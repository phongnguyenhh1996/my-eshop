"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Image as ImageIcon } from "lucide-react";

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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      // 1. Upload the image directly to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      
      const data = await response.json();
      
      // 2. Set the returned URL to state
      if (data.secure_url) {
        setUrl(data.secure_url);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
        onChange={handleFileChange}
        disabled={isLoading}
      />
      
      {/* 4. This hidden input holds the URL for the Server Action */}
      <input type="hidden" name={name} value={url} />
    </div>
  );
}