import React from 'react';
import dynamic from 'next/dynamic';
const CementPlankViewer = dynamic(() => import("./CementPlankViewer"))

export default function ProductCementPlank() {
    return (
        <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

            {/* 3D Model Display */}
            <div>
                <CementPlankViewer />
            </div>

            {/* Product Description & Specs */}
            <div className="space-y-4">
                <span className="text-xs uppercase tracking-wider text-amber-500 font-bold">
                    Precast RCC Component
                </span>
                <h1 className="text-3xl font-bold text-slate-800">Cement Sets (Pannel)</h1>

                <p className="text-slate-700 text-lg leading-relaxed">
                    Vertical concrete posts and horizontal panel manufactured with stressing system
                    to achieve maximum durability and strength.
                </p>

                {/* Specification Card */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 font-mono text-sm">
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-700">Length:</span>
                        <span className="text-slate-800 font-semibold">6 Feet (1800mm/2150mm)</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-700">Height:</span>
                        <span className="text-slate-800 font-semibold">1 Feet (300mm)</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-700">Width / Thickness:</span>
                        <span className="text-slate-800 font-semibold">2 Inches (50mm)</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-700">Reinforcement:</span>
                        <span className="text-slate-800 font-semibold">3 pcs of 3mm/4mm PCC steel</span>
                    </div>
                </div>
            </div>

        </div>
    );
}