import React, { useRef, useState } from "react";
import { Camera, Image as ImageIcon, Trash2 } from "lucide-react";

interface PhotoSelectorProps {
  value: string | null; // base64 string
  onChange: (base64: string | null) => void;
  lang: string;
  photoTitle: string;
  photoPlaceholder: string;
}

export default function PhotoSelector({ value, onChange, lang, photoTitle, photoPlaceholder }: PhotoSelectorProps) {
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  // Resize and compress files client-side to ~20KB-40KB for safe localStorage storage!
  const processFile = (file: File) => {
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to downscale
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 500;
        const scale = MAX_WIDTH / img.width;
        
        // Handle images smaller than MAX_WIDTH or landscape/portrait bounding boxes
        const width = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
        const height = img.width > MAX_WIDTH ? img.height * scale : img.height;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Export as compressed JPEG
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
          onChange(compressedBase64);
        }
        setLoading(false);
      };
      img.onerror = () => {
        setLoading(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const triggerCamera = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    cameraInputRef.current?.click();
  };

  const triggerGallery = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    galleryInputRef.current?.click();
  };

  const handleRemove = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onChange(null);
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  // Drag and drop support
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {photoTitle}
        </span>
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-[10px] font-bold text-red-500 hover:text-red-400 transition uppercase tracking-wider flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>{lang === "es" ? "Quitar" : "Remove"}</span>
          </button>
        )}
      </div>

      {/* Camera-only Input (forces camera application on mobile) */}
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* Gallery Input (allows file/photo gallery pickers) */}
      <input
        type="file"
        ref={galleryInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {value ? (
        <div className="relative rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-950 group">
          <img
            src={value}
            alt="Truck Evidence"
            className="w-full h-[155px] object-cover"
          />
          <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition duration-200 flex flex-col items-center justify-center gap-2 p-3">
            <span className="text-white font-extrabold text-[11px] mb-1">
              {lang === "es" ? "¿Desea cambiar la evidencia?" : "Change evidence photo?"}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={triggerCamera}
                className="px-3 py-1.5 bg-[#fcc419] hover:bg-[#fab005] text-slate-900 text-[10px] font-black rounded uppercase tracking-wider flex items-center gap-1 transition active:scale-95"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{lang === "es" ? "Cámara" : "Camera"}</span>
              </button>
              <button
                type="button"
                onClick={triggerGallery}
                className="px-3 py-1.5 bg-blue-650 hover:bg-blue-500 text-white text-[10px] font-black rounded uppercase tracking-wider flex items-center gap-1 transition active:scale-95"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{lang === "es" ? "Galería" : "Gallery"}</span>
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black rounded uppercase tracking-wider flex items-center gap-1 transition active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{lang === "es" ? "Quitar" : "Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-350 dark:border-slate-800 hover:border-[#fcc419] rounded-lg h-[155px] transition text-center bg-white dark:bg-[#111827]"
        >
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-300">
              <div className="w-6 h-6 border-2 border-[#fcc419] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-semibold">
                {lang === "es" ? "Procesando imagen..." : "Processing image..."}
              </span>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col justify-between py-1">
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase text-slate-650 dark:text-gray-300 tracking-wider block">
                  {lang === "es" ? "Registro Fotográfico de Tolva" : "Truck Photo Evidence"}
                </span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 block leading-tight">
                  {lang === "es"
                    ? "Suba un archivo o seleccione un método de captura:"
                    : "Upload an image or select a capture style:"}
                </span>
              </div>

              {/* Explicit dual-mode touch targets */}
              <div className="grid grid-cols-2 gap-2 mt-2 w-full max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={triggerCamera}
                  className="py-2.5 px-3 bg-[#fcc419] hover:bg-[#fab005] text-slate-950 text-[10px] font-black rounded-lg uppercase tracking-wider flex flex-col items-center justify-center gap-1.5 transition transform active:scale-95 shadow-sm border border-amber-400/20"
                >
                  <Camera className="w-4 h-4 text-slate-900" />
                  <span>{lang === "es" ? "CÁMARA" : "CAMERA"}</span>
                </button>

                <button
                  type="button"
                  onClick={triggerGallery}
                  className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-250 dark:hover:bg-slate-755 text-slate-700 dark:text-slate-200 text-[10px] font-black rounded-lg uppercase tracking-wider flex flex-col items-center justify-center gap-1.5 transition transform active:scale-95 shadow-sm border border-slate-200 dark:border-gray-700/50"
                >
                  <ImageIcon className="w-4 h-4 text-sky-500" />
                  <span>{lang === "es" ? "GALERÍA" : "GALLERY"}</span>
                </button>
              </div>

              <div className="text-[8.5px] text-slate-400 dark:text-slate-600 mt-1 select-none">
                {lang === "es" ? "Soporta arrastrar y soltar archivos" : "Supports drag and drop"}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
