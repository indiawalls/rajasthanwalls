'use client';

import { useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Phone } from 'lucide-react';

// Leaflet touches `window`, so it must only load in the browser
const UnitsMap = dynamic(() => import('./UnitsMap'), {
    ssr: false,
    loading: () => <div className="h-full w-full animate-pulse bg-slate-200" />,
});

export default function UnitsExplorer({ units, phone }) {
    const [active, setActive] = useState(null);
    const itemRefs = useRef([]);

    // Group by region, keeping each unit's original index
    const groups = useMemo(() => {
        const map = new Map();
        units.forEach((unit, index) => {
            if (!map.has(unit.region)) map.set(unit.region, []);
            map.get(unit.region).push({ unit, index });
        });
        return [...map.entries()];
    }, [units]);

    // Pin clicked on the map: highlight the card and bring it into view
    const selectFromMap = (index) => {
        setActive(index);
        itemRefs.current[index]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    };

    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            {/* Map (first on mobile, right on desktop) */}
            <div className="isolate order-1 h-85 overflow-hidden rounded-2xl border border-slate-200 shadow-sm sm:h-105 lg:order-2 lg:h-150">
                <UnitsMap units={units} active={active} onSelect={selectFromMap} onReset={() => setActive(null)} />
            </div>

            {/* Unit list */}
            <div className="order-2 space-y-6 lg:order-1 lg:h-150 lg:overflow-y-auto lg:pr-2">
                {groups.map(([region, items]) => (
                    <div key={region}>
                        <h3 className="mb-3 text-sm font-bold text-slate-500">
                            {region} ({items.length})
                        </h3>
                        <ul className="space-y-3">
                            {items.map(({ unit, index }) => {
                                const isActive = active === index;
                                return (
                                    <li
                                        key={unit.city}
                                        ref={(el) => (itemRefs.current[index] = el)}
                                        className={`rounded-xl border bg-white transition-colors ${isActive
                                                ? 'border-yellow-400 ring-2 ring-yellow-400/40'
                                                : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setActive(index)}
                                            aria-pressed={isActive}
                                            className="flex w-full items-start gap-3 rounded-t-xl p-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900"
                                        >
                                            <span
                                                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isActive ? 'bg-slate-900 text-yellow-400' : 'bg-yellow-100 text-slate-900'
                                                    }`}
                                            >
                                                <MapPin size={18} aria-hidden="true" />
                                            </span>
                                            <span>
                                                <span className="block text-lg font-bold text-slate-900">{unit.city}</span>
                                                <span className="block text-sm text-slate-600">{unit.address}</span>
                                            </span>
                                        </button>
                                        <div className="flex flex-wrap items-center gap-2 px-4 pb-4">
                                            <a
                                                href={`tel:${phone}`}
                                                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                                            >
                                                <Phone size={14} aria-hidden="true" /> Call
                                            </a>
                                            <a
                                                href={unit.mapsUrl || `https://www.google.com/maps?q=${unit.lat},${unit.lng}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 transition hover:border-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                                            >
                                                <MapPin size={14} aria-hidden="true" /> Open in Google Maps
                                            </a>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
