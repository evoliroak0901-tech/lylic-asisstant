
import React, { useRef, useState, useEffect } from 'react';

interface XYPadProps {
  x: number; // -100 to 100
  y: number; // -100 to 100
  onChange: (x: number, y: number) => void;
}

export const XYPad: React.FC<XYPadProps> = ({ x, y, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointer = (e: React.PointerEvent | PointerEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    // Calculate percentage 0-1
    let newX = (clientX - rect.left) / rect.width;
    let newY = (clientY - rect.top) / rect.height;

    // Clamp
    newX = Math.max(0, Math.min(1, newX));
    newY = Math.max(0, Math.min(1, newY));

    // Convert to -100 to 100 range
    // X: 0 -> -100, 1 -> 100
    // Y: 0 -> 100 (High/Top), 1 -> -100 (Low/Bottom) based on visual request "Top High, Bottom Low"
    
    const valX = Math.round((newX * 200) - 100);
    const valY = Math.round(((1 - newY) * 200) - 100); // Invert Y so Top is High (100)

    onChange(valX, valY);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handlePointer(e);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (isDragging) handlePointer(e);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Convert values back to % position for the handle
  // x: -100 -> 0%, 100 -> 100%
  // y: 100 -> 0%, -100 -> 100%
  const leftPos = `${((x + 100) / 200) * 100}%`;
  const topPos = `${((100 - y) / 200) * 100}%`;

  return (
    <div className="flex flex-col items-center gap-2 select-none touch-none">
      <div className="flex justify-between w-full text-xs font-bold text-orange-700 px-2">
         <span>高音 (High)</span>
      </div>
      <div className="flex items-center gap-2 w-full">
        <span className="text-xs font-bold text-orange-700 w-8 text-right">男性</span>
        
        <div 
          ref={containerRef}
          className="relative w-full h-48 bg-gradient-to-br from-blue-50 to-pink-50 border-2 border-orange-200 rounded-lg shadow-inner cursor-crosshair overflow-hidden"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          {/* Grid lines */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-orange-100" />
          <div className="absolute left-1/2 top-0 w-px h-full bg-orange-100" />

          {/* Handle */}
          <div 
            className="absolute w-6 h-6 bg-orange-500 rounded-full shadow-lg border-2 border-white transform -translate-x-1/2 -translate-y-1/2 transition-transform active:scale-125"
            style={{ left: leftPos, top: topPos }}
          />
        </div>

        <span className="text-xs font-bold text-orange-700 w-8">女性</span>
      </div>
      <div className="flex justify-between w-full text-xs font-bold text-orange-700 px-2">
         <span>低音 (Low)</span>
      </div>
      
      {/* Value Display */}
      <div className="text-xs text-gray-500 mt-1 font-mono">
        性別: {x} / 音域: {y}
      </div>
    </div>
  );
};
