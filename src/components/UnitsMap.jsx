'use client';

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Brand-coloured SVG pin (avoids Leaflet's default marker image path issues in Next.js)
function pinIcon(active) {
    const w = active ? 38 : 30;
    const h = active ? 50 : 40;
    const body = active ? '#0f172a' : '#facc15';
    const dot = active ? '#facc15' : '#0f172a';
    return L.divIcon({
        className: '',
        iconSize: [w, h],
        iconAnchor: [w / 2, h],
        tooltipAnchor: [0, -h + 4],
        html: `<svg width="${w}" height="${h}" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))">
            <path d="M12 1C5.9 1 1 5.9 1 12c0 8.5 11 19 11 19s11-10.5 11-19C23 5.9 18.1 1 12 1z" fill="${body}" stroke="${active ? '#facc15' : '#0f172a'}" stroke-width="2"/>
            <circle cx="12" cy="12" r="4.5" fill="${dot}"/></svg>`,
    });
}

// Fly to the selected unit
function FlyToActive({ units, active }) {
    const map = useMap();
    useEffect(() => {
        if (active === null) return;
        const u = units[active];
        map.flyTo([u.lat, u.lng], Math.max(map.getZoom(), 10), { duration: 0.8 });
    }, [active, units, map]);
    return null;
}

function ResetButton({ bounds, onReset }) {
    const map = useMap();
    return (
        <button
            type="button"
            onClick={() => {
                onReset();
                map.fitBounds(bounds, { padding: [40, 40] });
            }}
            className="absolute right-3 top-3 z-1000 rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-900 shadow-md transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900"
        >
            Show all units
        </button>
    );
}

export default function UnitsMap({ units, active, onSelect, onReset }) {
    const bounds = useMemo(() => L.latLngBounds(units.map((u) => [u.lat, u.lng])), [units]);

    return (
        <MapContainer
            bounds={bounds}
            boundsOptions={{ padding: [40, 40] }}
            scrollWheelZoom={false} // stops the page getting "stuck" while scrolling past the map
            className="h-full w-full"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {units.map((u, i) => {
                const isActive = active === i;
                return (
                    <Marker
                        // key includes isActive so the icon and tooltip remount when selection changes
                        key={`${u.city}-${isActive}`}
                        position={[u.lat, u.lng]}
                        icon={pinIcon(isActive)}
                        zIndexOffset={isActive ? 1000 : 0}
                        eventHandlers={{ click: () => onSelect(i) }}
                        title={u.city}
                    >
                        <Tooltip direction="top" permanent={isActive}>
                            {u.city}
                        </Tooltip>
                    </Marker>
                );
            })}

            <FlyToActive units={units} active={active} />
            <ResetButton bounds={bounds} onReset={onReset} />
        </MapContainer>
    );
}
