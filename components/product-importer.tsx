"use client";

import { useState, useTransition, ChangeEvent } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
import uniqBy from 'lodash/uniqBy'

function update_sheet_range(ws: XLSX.WorkSheet) {
  const range = {s:{r:Infinity, c:Infinity},e:{r:0,c:0}};
  Object.keys(ws).filter(function(x) { return x.charAt(0) != "!"; }).map(XLSX.utils.decode_cell).forEach(function(x) {
    range.s.c = Math.min(range.s.c, x.c); range.s.r = Math.min(range.s.r, x.r);
    range.e.c = Math.max(range.e.c, x.c); range.e.r = Math.max(range.e.r, x.r);
  });
  ws['!ref'] = XLSX.utils.encode_range(range);
}

interface ProductImporterProps {
  onLoadedProducts: (products: Record<string, unknown>[]) => Promise<{
    success: boolean;
    count?: number;
    error?: string | null;
  }>;
}

export function ProductImporter({ onLoadedProducts }: ProductImporterProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = () => {
      startTransition(async () => {
        try {
          const buffer = reader.result;
          const workbook = XLSX.read(buffer, { type: "buffer" });
          const sheetName = "Template";
          const worksheet = workbook.Sheets[sheetName];
          update_sheet_range(worksheet)
          if (!worksheet) {
            throw new Error(`Sheet "${sheetName}" không được tìm thấy.`);
          }

          // --- Logic xử lý file Excel mới và mạnh mẽ hơn ---

          // 1. Chuyển sheet thành một mảng các mảng (array of arrays)
          const data = XLSX.utils.sheet_to_json(worksheet, {
            header: 1, // Yêu cầu trả về mảng các mảng
            blankrows: false,
          }) as unknown[][];

          // 2. Tìm hàng tiêu đề thực sự (dòng có chứa 'product_id')
          const headerRowIndex = data.findIndex(row => 
            Array.isArray(row) && row.includes('product_id')
          );
          
          if (headerRowIndex === -1) {
            throw new Error("Không thể tìm thấy hàng tiêu đề (có 'product_id') trong file.");
          }
          
          const headers = data[headerRowIndex] as string[];

          // 3. Lấy tất cả các hàng *sau* hàng tiêu đề
          const dataRows = data.slice(headerRowIndex + 1) as (string | number)[][];

          // 4. Lọc bỏ TẤT CẢ các hàng rác/hàng hướng dẫn
          // Chúng ta xác định một hàng rác bằng cách nhìn vào ô đầu tiên của nó
          const junkIdentifiers = [
            'V3', 
            'ID sản phẩm', 
            'Bắt buộc', 
            'Không thể chỉnh sửa'
          ];
          
          const realDataRows = dataRows.filter(row => {
            if (!row || row.length === 0) return false; // Bỏ qua hàng trống
            const firstCell = String(row[0] || '').trim();
            return !junkIdentifiers.includes(firstCell) && firstCell.length > 0;
          });

          if (realDataRows.length === 0) {
            throw new Error("Không tìm thấy dữ liệu sản phẩm nào trong file.");
          }

          // 5. Chuyển đổi các hàng dữ liệu thực sự thành đối tượng
          const productsAsObjects = uniqBy(realDataRows.map((row) => {
            const product: { [key: string]: unknown } = {};
            headers.forEach((key, index) => {
              product[key] = row[index];
            });
            return product;
          }), 'product_name')
          
          // 6. Gửi dữ liệu đã làm sạch đến Server Action
          const response = await onLoadedProducts(productsAsObjects);

          if (response.success) {
            setSuccess(`Đồng bộ thành công ${response.count} sản phẩm!`);
          } else {
            setError(response.error || "Đã xảy ra lỗi không xác định.");
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Không thể xử lý file.");
          }
        }
      });
    };

    reader.onerror = () => {
      setError("Không thể đọc file.");
    };
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold">Import từ TikTok Excel</h3>
      <div className="flex gap-2">
        <Label htmlFor="xlsx-upload" className="sr-only">Tải lên XLSX</Label>
        <Input
          id="xlsx-upload"
          type="file"
          accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={handleFileChange}
          disabled={isPending}
        />
        <Button disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          Import
        </Button>
      </div>
      {success && <p className="text-sm text-green-600">{success}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}