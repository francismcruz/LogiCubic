import React, { useRef, useState, useEffect } from "react";

interface SignaturePadProps {
  value: string | null; // base64 string
  onChange: (base64: string | null) => void;
  lang: string;
  placeholderText: string;
}

export default function SignaturePad({ value, onChange, lang, placeholderText }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  // Clear canvas drawing
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background (pure white to avoid transparent alpha artifacts in jsPDF)
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setHasSigned(false);
    onChange(null);
  };

  // Setup canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      // Account for device pixel ratio for smooth lines
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = 140 * dpr; // Static height
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#1e293b"; // Slate-800
        ctx.lineWidth = 2.5;

        // Draw initially pure white background
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, rect.width, 140);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // If pre-existing base64 value is provided (e.g. when loading recorded report/details), draw it
    if (value) {
      const img = new Image();
      img.onload = () => {
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        if (ctx) {
          ctx.drawImage(img, 0, 0, rect.width, 140);
          setHasSigned(true);
        }
      };
      img.src = value;
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [value]);

  // Coordinates helper
  const getCoordinates = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Drawing event handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSigned(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    // Save and callback data-url
    const canvas = canvasRef.current;
    if (canvas) {
      // Get data URL (uses PNG/JPEG representation)
      const dataUrl = canvas.toDataURL("image/png");
      onChange(dataUrl);
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {lang === "es" ? "FIRMA CONFORME" : "SIGNATURE CONFIRMATION"}
        </span>
        {hasSigned && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[10px] font-bold text-red-500 hover:text-red-600 transition uppercase tracking-wider"
          >
            {lang === "es" ? "Borrar" : "Clear"}
          </button>
        )}
      </div>

      <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white rounded-lg overflow-hidden h-[142px]">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-[140px] cursor-crosshair touch-none"
        />

        {!hasSigned && (
          <div className="absolute inset-0 flex items-center justify-center p-4 py-8 text-center pointer-events-none select-none text-slate-400 text-xs">
            {placeholderText}
          </div>
        )}
      </div>
    </div>
  );
}
