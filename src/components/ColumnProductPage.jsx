import React from 'react';
import dynamic from 'next/dynamic';
const ColumnViewer = dynamic(() => import('./ColumnViewer'))

export default function ColumnProductPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

      {/* 3D Model Viewport */}
      <div>
        <ColumnViewer />
      </div>

      {/* Product Details */}
      <div className="space-y-4">
        <span className="text-xs uppercase tracking-wider text-amber-600 font-bold">
          Precast RCC Component
        </span>

        {/* Updated Heading */}
        <h1 className="text-3xl font-bold text-slate-800">
          RCC Columns
        </h1>

        {/* Updated Paragraph */}
        <p className="text-slate-600 text-lg leading-relaxed">
          Precast RCC columns manufactured with a stressing system
          to securely lock boundary wall planks in place, delivering maximum stability and high wind resistance.
        </p>

        {/* Specification Card */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 font-mono text-sm">
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-700">Cross Section:</span>
            <span className="text-slate-800 font-semibold">6 x 6 Inches (150mm x 150mm)</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-700">Reinforcement:</span>
            <span className="text-slate-800 font-semibold">7 Pieces of 3mm PCC Steel Wire</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-700">Technology:</span>
            <span className="text-slate-800 font-semibold">Stressing System</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-700">Length / Height:</span>
            <span className="text-slate-800 font-semibold">According to Customer Requirement</span>
          </div>
        </div>
      </div>

    </div>
  );
}