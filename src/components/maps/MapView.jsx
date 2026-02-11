import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const regularIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const mallIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const centerIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

/**
 * MapView Component - Displays attractions on an interactive map
 * @param {Array} attractions - Array of attractions with coords [lat, lon]
 * @param {Array} center - Map center coordinates [lat, lon]
 * @param {number} zoom - Initial zoom level (default: 13)
 * @param {string} height - Map height (default: '400px')
 * @param {boolean} showCenter - Whether to show center marker
 */
export default function MapView({
    attractions = [],
    center = [3.139, 101.6869], // Default: KL
    zoom = 13,
    height = '400px',
    showCenter = false
}) {
    // Filter attractions with valid coordinates
    const validAttractions = attractions.filter(
        a => a.coords && Array.isArray(a.coords) && a.coords.length === 2
    );

    return (
        <div className="rounded-3xl overflow-hidden border-2 border-muted shadow-lg" style={{ height }}>
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Center marker (optional) */}
                {showCenter && (
                    <Marker position={center} icon={centerIcon}>
                        <Popup>
                            <div className="font-bold text-sm">Center Point</div>
                        </Popup>
                    </Marker>
                )}

                {/* Attraction markers */}
                {validAttractions.map((attraction, index) => {
                    const icon = attraction.isMall ? mallIcon : regularIcon;

                    return (
                        <Marker
                            key={attraction.id || index}
                            position={attraction.coords}
                            icon={icon}
                        >
                            <Popup>
                                <div className="space-y-1">
                                    <h3 className="font-black text-sm text-primary">{attraction.name}</h3>
                                    <p className="text-xs text-muted-foreground">{attraction.category || attraction.type}</p>
                                    {attraction.distance && (
                                        <p className="text-xs font-bold text-green-600">
                                            {attraction.distance.toFixed(1)} km away
                                        </p>
                                    )}
                                    {attraction.price !== undefined && (
                                        <p className="text-xs font-bold">RM {attraction.price}</p>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
