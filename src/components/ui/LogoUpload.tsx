"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface LogoUploadProps {
  currentLogoUrl?: string | null;
  onLogoChange: (file: File | null) => void;
}

async function compressImage(file: File, maxSize = 200, quality = 0.8): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
        }
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function LogoUpload({ currentLogoUrl, onLogoChange }: LogoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentLogoUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync preview when currentLogoUrl changes (useful when profile loads asynchronously)
  useEffect(() => {
    if (currentLogoUrl) {
      setPreview(currentLogoUrl);
    }
  }, [currentLogoUrl]);

  const handleFileSelect = async (file: File | null) => {
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("File harus berupa gambar");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file maksimal 5MB");
        return;
      }

      setIsCompressing(true);
      const compressedFile = await compressImage(file, 200, 0.8);
      setIsCompressing(false);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
      onLogoChange(compressedFile);
    } else {
      setPreview(null);
      onLogoChange(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = () => {
    setPreview(null);
    onLogoChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative group border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all overflow-hidden ${
          isDragging 
            ? "border-primary bg-primary/5" 
            : preview 
              ? "border-success/30 bg-success/5" 
              : "border-border bg-muted hover:border-primary/50 hover:bg-background"
        }`}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        aria-label="Upload logo"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
          aria-hidden="true"
        />
        
        {isCompressing ? (
          <div className="py-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-muted-foreground">Optimasi...</p>
          </div>
        ) : preview ? (
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-background border border-border">
              <Image 
                src={preview} 
                alt="Logo" 
                fill 
                className="object-contain p-1"
                unoptimized
              />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground">Logo Terpasang</p>
              <p className="text-xs text-success">Klik untuk ganti</p>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                onClick={handleRemove}
                aria-label="Remove logo"
              >
                <X size={14} />
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center mx-auto mb-3">
              {isDragging ? (
                <Upload size={18} className="text-primary" />
              ) : (
                <ImageIcon size={18} className="text-background" />
              )}
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              <span className="text-primary">Pilih Logo</span>
              {" "}atau seret
            </p>
            <p className="text-xs text-muted-foreground">
              Digunakan pada Invoice
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
