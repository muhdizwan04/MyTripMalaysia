import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, divIcon } from 'leaflet';

// Fix for Leaflet default icon not showing
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = Icon.Default.mergeOptions({
    iconUrl: icon,
    shadowUrl: iconShadow
});

// Helper to fit bounds
function MapBounds({ markers }) {
    const map = useMap();
    useEffect(() => {
        if (markers.length > 0) {
            const bounds = markers.map(m => m.position);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [markers, map]);
    return null;
}

// Custom Numbered Icon
const createNumberedIcon = (number, isPast, isMall = false) => {
    const bgColor = isPast ? '#94a3b8' : (isMall ? '#22c55e' : '#2563eb'); // Gray for past, green for malls, blue for regular

    return divIcon({
        className: 'custom-marker-icon',
        html: `<div style="
            background-color: ${bgColor}; 
            color: white; 
            border-radius: 50%; 
            width: 24px; 
            height: 24px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-weight: bold; 
            border: 2px solid white; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            font-size: 12px;
            filter: ${isPast ? 'grayscale(100%)' : 'none'};
        ">${number}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
    });
};

// Coordinate mapping for states (approximate centers)
const STATE_COORDS = {
    "Kuala Lumpur": [3.1390, 101.6869],
    "Selangor": [3.0738, 101.5183],
    "Penang": [5.4141, 100.3288],
    "Perak": [4.5921, 101.0901], // Ipoh
    "Johor": [1.4927, 103.7414], // JB
    "Melaka": [2.1896, 102.2501],
    "Kedah": [6.1184, 100.3685], // Alor Setar
    "Pahang": [3.8126, 103.3256], // Kuantan
    "Terengganu": [5.3117, 103.1324], // KT
    "Kelantan": [6.1254, 102.2381], // KB
    "Negeri Sembilan": [2.7258, 101.9424], // Seremban
    "Perlis": [6.4449, 100.1986], // Kangar
    "Sabah": [5.9804, 116.0753], // KK
    "Sarawak": [1.5533, 110.3592], // Kuching
    "Putrajaya": [2.9264, 101.6964],
    "Labuan": [5.2831, 115.2308]
};

export default function TripMap({ items = [] }) {
    // Collect all valid markers from itinerary items
    let globalIndex = 0;

    const markers = items.flatMap((day, dayIndex) =>
        (day.activities || []).map((act, actIndex) => {
            // Use actual coords from activity if available, else fallback to state center
            const stateCoords = STATE_COORDS[day.state] || STATE_COORDS['Kuala Lumpur'];
            const position = act.coords || stateCoords;
            const isTransport = act.type === 'transport';

            if (isTransport) return null; // Skip markers for transport lines? Or keep them? Usually transport doesn't have coords in this data.

            globalIndex++;
            return {
                id: act.id,
                name: act.name,
                category: act.category,
                day: day.day,
                time: act.time,
                isPast: act.isPast,
                isMall: act.isMall || act.type === 'Mall',
                number: globalIndex,
                position: position
            };
        })
    ).filter(Boolean);

    const polylinePositions = markers.map(marker => marker.position);

    if (markers.length === 0) return (
        <div className="h-64 bg-muted animate-pulse rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground">Loading Map...</span>
        </div>
    );

    return (
        <div className="h-[400px] w-full rounded-lg overflow-hidden border z-0">
            <MapContainer
                center={[4.2105, 101.9758]}
                zoom={6}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <Polyline
                    positions={polylinePositions}
                    pathOptions={{ color: '#3b82f6', weight: 4, opacity: 0.7, dashArray: '10, 10' }}
                />

                {markers.map(marker => {
                    const isPast = marker.isPast || false;

                    return (
                        <Marker
                            key={marker.id}
                            position={marker.position}
                            icon={createNumberedIcon(marker.number, isPast, marker.isMall)}
                        >
                            <Popup>
                                <div className="text-sm font-semibold">{marker.name}</div>
                                <div className="text-xs text-muted-foreground">Day {marker.day} • {marker.time}</div>
                                {marker.isMall && (
                                    <div className="text-xs font-bold text-green-600 mt-1">🛍️ Shopping Mall</div>
                                )}
                            </Popup>
                        </Marker>
                    );
                })}
                <MapBounds markers={markers} />
            </MapContainer>
        </div>
    );
}
