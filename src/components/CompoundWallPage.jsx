import React from 'react';
import dynamic from 'next/dynamic';
const CompoundWallViewer = dynamic(() => import('./CompoundWallViewer'))

export default function CompoundWallPage() {
    return (
        <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

            {/* 3D Compound Wall Assembly Display */}
            <div>
                <CompoundWallViewer />
            </div>

            {/* Product Information */}
            <div className="space-y-4">
                <span className="text-xs uppercase tracking-wider text-amber-600 font-bold">
                    Precast RCC Boundary System
                </span>

                {/* Heading in text-slate-800 */}
                <h1 className="text-3xl font-bold text-slate-800">
                    Prefabricated Folding Compound Wall
                </h1>

                {/* Paragraph in text-lg */}
                <p className="text-slate-600 text-lg leading-relaxed">
                    Heavy-duty precast prestressed concrete compound wall system. Built using high-durability interlocked horizontal planks fitted into RCC H-columns, offering rapid installation and reusable modular design.
                </p>

                {/* Technical Data Table */}
                <div className="overflow-hidden rounded-lg border border-slate-200 shadow-sm bg-white font-sans text-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                                <th className="py-2.5 px-4 font-semibold">Specification</th>
                                <th className="py-2.5 px-4 font-semibold">Standard Dimension</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-600">
                            <tr>
                                <td className="py-2.5 px-4 font-medium text-slate-700">Available Wall Heights</td>
                                <td className="py-2.5 px-4 font-mono text-slate-800">6 Feet</td>
                            </tr>
                            <tr>
                                <td className="py-2.5 px-4 font-medium text-slate-700">Panel Length</td>
                                <td className="py-2.5 px-4 font-mono text-slate-800">6 Feet (1828.8mm)</td>
                            </tr>
                            <tr>
                                <td className="py-2.5 px-4 font-medium text-slate-700">Panel Height / Thickness</td>
                                <td className="py-2.5 px-4 font-mono text-slate-800">1 Feet (300mm) / 2 Inches (50mm)</td>
                            </tr>
                            <tr>
                                <td className="py-2.5 px-4 font-medium text-slate-700">Column Dimension</td>
                                <td className="py-2.5 px-4 font-mono text-slate-800">6 x 6 Inches (150mm x 150mm)</td>
                            </tr>
                            <tr>
                                <td className="py-2.5 px-4 font-medium text-slate-700">Column Total Length</td>
                                <td className="py-2.5 px-4 font-mono text-slate-800">10 Feet (6ft above ground + 4ft in-ground)</td>
                            </tr>
                            <tr>
                                <td className="py-2.5 px-4 font-medium text-slate-700">Concrete Foundation</td>
                                <td className="py-2.5 px-4 font-mono text-slate-800">2 Feet x 2 Feet poured base</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}