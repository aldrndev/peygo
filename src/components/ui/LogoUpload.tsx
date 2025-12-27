"use client";

import { useState, useRef } from "react";
import { Button } from "@heroui/react";
import { Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";

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
        className={`relative group border-2 border-dashed rounded-[32px] p-8 text-center cursor-pointer transition-all duration-500 overflow-hidden ${
          isDragging 
            ? "border-orange-500 bg-orange-500/10 scale-[1.02] shadow-2xl shadow-orange-500/20" 
            : preview 
              ? "border-emerald-500/30 bg-emerald-500/5 shadow-xl shadow-emerald-500/5" 
              : "border-slate-200 bg-white/40 backdrop-blur-xl hover:border-orange-500/50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50"
        }`}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
        
        {isCompressing ? (
          <div className="py-6">
            <div className="w-12 h-12 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Optimasi Gambar...</p>
          </div>
        ) : preview ? (
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white shadow-2xl ring-4 ring-emerald-500/10">
              <Image 
                src={preview} 
                alt="Logo Preview" 
                fill 
                className="object-contain p-2"
                unoptimized
              />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-slate-900 tracking-tight">Logo Terpasang</p>
              <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mt-1">Klik untuk Ganti</p>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <Button
                isIconOnly
                size="sm"
                color="danger"
                variant="flat"
                className="bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-all rounded-xl"
                onPress={handleRemove}
              >
                <X size={16} />
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-6">
            <div className="w-16 h-16 rounded-[22px] bg-slate-900 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-slate-900/20">
              {isDragging ? (
                <Upload size={28} className="text-orange-500" />
              ) : (
                <ImageIcon size={28} className="text-white" />
              )}
            </div>
            <p className="text-sm font-bold text-slate-900 tracking-tight mb-2">
              <span className="text-orange-500">Pilih Logo</span>
              {" "}atau seret ke sini
            </p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest max-w-[200px] mx-auto leading-relaxed">
              Resmi digunakan pada setiap Invoice & Laporan
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
