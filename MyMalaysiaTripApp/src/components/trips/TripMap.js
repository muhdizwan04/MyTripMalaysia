
import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

// Coordinate mapping for states (approximate centers)
const STATE_COORDS = {
    "Kuala Lumpur": { latitude: 3.1390, longitude: 101.6869 },
    "Selangor": { latitude: 3.0738, longitude: 101.5183 },
    "Penang": { latitude: 5.4141, longitude: 100.3288 },
    "Perak": { latitude: 4.5921, longitude: 101.0901 }, // Ipoh
    "Johor": { latitude: 1.4927, longitude: 103.7414 }, // JB
    "Melaka": { latitude: 2.1896, longitude: 102.2501 },
    "Kedah": { latitude: 6.1184, longitude: 100.3685 }, // Alor Setar
    "Pahang": { latitude: 3.8126, longitude: 103.3256 }, // Kuantan
    "Terengganu": { latitude: 5.3117, longitude: 103.1324 }, // KT
    "Kelantan": { latitude: 6.1254, longitude: 102.2381 }, // KB
    "Negeri Sembilan": { latitude: 2.7258, longitude: 101.9424 }, // Seremban
    "Perlis": { latitude: 6.4449, longitude: 100.1986 }, // Kangar
    "Sabah": { latitude: 5.9804, longitude: 116.0753 }, // KK
    "Sarawak": { latitude: 1.5533, longitude: 110.3592 }, // Kuching
    "Putrajaya": { latitude: 2.9264, longitude: 101.6964 },
    "Labuan": { latitude: 5.2831, longitude: 115.2308 }
};

export default function TripMap({ items = [] }) {
    const mapRef = useRef(null);

    // Collect all valid markers from itinerary items
    let globalIndex = 0;
    const markers = items.flatMap((day) =>
        (day.activities || []).map((act) => {
            // Use actual coords from activity if available, else fallback to state center
            const fallback = STATE_COORDS[day.state] || STATE_COORDS['Kuala Lumpur'];

            // Check if act.coords is valid array [lat, lng]
            let position = fallback;
            if (act.coords && Array.isArray(act.coords) && act.coords.length === 2) {
                position = { latitude: act.coords[0], longitude: act.coords[1] };
            }

            const isTransport = act.type === 'transport';
            if (isTransport) return null;

            globalIndex++;
            return {
                id: act.id,
                name: act.name,
                category: act.category,
                day: day.day,
                time: act.time,
                isPast: false, // Mobile doesn't have "past" logic easily accessible yet, default false
                isMall: act.isMall || act.type === 'Mall',
                number: globalIndex,
                coordinate: position
            };
        })
    ).filter(Boolean);

    const polylineCoordinates = markers.map(m => m.coordinate);

    useEffect(() => {
        if (markers.length > 0 && mapRef.current) {
            // Fit to coordinates
            mapRef.current.fitToCoordinates(markers.map(m => m.coordinate), {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        }
    }, [markers]);

    if (markers.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <Text>No map data available.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: 4.2105,
                    longitude: 101.9758,
                    latitudeDelta: 5,
                    longitudeDelta: 5,
                }}
            >
                <Polyline
                    coordinates={polylineCoordinates}
                    strokeColor="#3b82f6"
                    strokeWidth={3}
                    lineDashPattern={[10, 10]}
                />

                {markers.map((marker, index) => (
                    <Marker
                        key={`marker-${index}`}
                        coordinate={marker.coordinate}
                        title={marker.name}
                        description={`Day ${marker.day} • ${marker.time}`}
                    >
                        <View style={[
                            styles.marker,
                            { backgroundColor: marker.isMall ? '#22c55e' : '#2563eb' } // Green for malls, Blue for others
                        ]}>
                            <Text style={styles.markerText}>{marker.number}</Text>
                        </View>
                    </Marker>
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 24,
        overflow: 'hidden',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    loadingContainer: {
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f5f9'
    },
    marker: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    markerText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 10,
    }
});
