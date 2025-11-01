"use client";

import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Image as ImageIcon } from "lucide-react";
import Cropper, { Area } from "react-easy-crop";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { getCroppedImg } from "@/lib/crop-image";

interface ImageUploaderProps {
  // This 'name' will be used for the hidden input
  name: string;
  // This 'defaultValue' will be the existing image URL (if any)
  defaultValue?: string | null;
}

// !! IMPORTANT !!
// Replace these with your actual Cloudinary details
const CLOUDINARY_CLOUD_NAME = "easy-toeic";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

export function ImageUploader({ name, defaultValue }: ImageUploaderProps) {
  const [url, setUrl] = useState(defaultValue || "");
  const [isLoading, setIsLoading] = useState(false);

  // State for the cropper modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // Called when the user selects a file
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setIsModalOpen(true);
      };
    }
  };

  // Called when the user clicks "Save & Upload"
  const onSaveCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsLoading(true);
    setIsModalOpen(false);

    try {
      // 1. Get the new cropped File object
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);

      // 2. Upload the new cropped file to Cloudinary
      const formData = new FormData();
      formData.append("file", croppedFile);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      
      const data = await response.json();

      if (data.secure_url) {
        setUrl(data.secure_url);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsLoading(false);
      setImageSrc(null); // Clear the cropper state
      setZoom(1);
    }
  };

  // Called by <Cropper> when the user stops dragging/zooming
  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  
  return (
    <div className="space-y-2">
      <Label htmlFor="image-upload">Product Image</Label>
      <div className="w-full h-48 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        )}

        {/* 3. Show the image preview */}
        {url ? (
          <img src={url} alt="Product preview" className="object-contain h-full w-full p-2" />
        ) : (
          <div className="text-center text-muted-foreground">
            <ImageIcon className="w-12 h-12 mx-auto" />
            <p>No image selected</p>
          </div>
        )}
      </div>

      <Input
        id="image-upload"
        type="file"
        onChange={onFileChange}
        disabled={isLoading}
      />

      {/* 4. This hidden input holds the URL for the Server Action */}
      <input type="hidden" name={name} value={url} />

      {/* --- CROPPER MODAL --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crop Your Image</DialogTitle>
          </DialogHeader>
          <div className="relative h-80 w-full">
            <Cropper
              image={imageSrc || ""}
              crop={crop}
              zoom={zoom}
              aspect={132/169}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="space-y-2">
            <Label>Zoom</Label>
            <Slider
              min={1}
              max={3}
              step={0.1}
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onSaveCrop} disabled={isLoading}>
              Save & Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
