'use client';

import { useState } from 'react';

const precastWall = 'Precast Concrete Boundary Wall';

export default function ProductRequirementsFields() {
    const [product, setProduct] = useState(precastWall);

    return (
        <>
            <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Product Category
                </label>
                <select
                    value={product}
                    onChange={(event) => setProduct(event.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-yellow-500 transition"
                >
                    <option>Precast Concrete Boundary Wall</option>
                    <option>RCC Fencing Poles</option>
                    <option>Chainlink Mesh Fencing</option>
                    <option>Interlocking Paver Blocks</option>
                    <option>Multiple / Turnkey Project</option>
                </select>
            </div>

            {product === precastWall && (
                <>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Approximate Area / Length (Feet)
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. 500 Running Feet"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-yellow-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Height (Feet)
                        </label>
                        <select
                            className="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-3 text-base font-normal text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                            name="height"
                            required
                        >
                            <option value="">Select height</option>
                            {[5, 6, 7, 8, 9, 10].map((heightOption) => (
                                <option key={heightOption} value={heightOption}>
                                    {heightOption}
                                </option>
                            ))}
                        </select>
                    </div>
                </>
            )}
        </>
    );
}
