/**
 * Calculates the Harvesine distance between two sets of coordinates.
 */
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

/**
 * Generates a smart itinerary based on user interests, selected state, and available attractions.
 * logic:
 * 1. Filter by state and tags.
 * 2. Start from a central point (KL Sentral for KL, or first attraction).
 * 3. Find nearest neighbor iteratively.
 * 4. Pick top 3-4.
 */
export function generateSmartItinerary(userInterests, selectedState, allAttractions) {
    if (!allAttractions || allAttractions.length === 0) return [];

    // 1. Filter
    let filtered = allAttractions.filter(attr => {
        // Match state (destinationId)
        const matchesState = attr.destinationId?.toLowerCase() === selectedState?.toLowerCase();

        // Match tags (any overlap)
        const matchesInterests = userInterests.length === 0 ||
            (attr.tags && attr.tags.some(tag => userInterests.includes(tag)));

        return matchesState && matchesInterests;
    });

    if (filtered.length === 0) return [];

    // 2. Sort by distance (Nearest Neighbor)
    const result = [];

    // Central starting points per state
    const startingPoints = {
        'kl': { lat: 3.1344, lng: 101.6865 }, // KL Sentral
        'penang': { lat: 5.4141, lng: 100.3288 }, // Komtar
        'melaka': { lat: 2.1944, lng: 102.2492 } // Dutch Square
    };

    let currentPoint = startingPoints[selectedState?.toLowerCase()] || {
        lat: filtered[0].latitude,
        lng: filtered[0].longitude
    };

    const remaining = [...filtered];

    // Pick top 4 for the day
    while (result.length < 4 && remaining.length > 0) {
        let nearestIndex = 0;
        let minDistance = Infinity;

        for (let i = 0; i < remaining.length; i++) {
            const dist = getDistance(
                currentPoint.lat, currentPoint.lng,
                remaining[i].latitude, remaining[i].longitude
            );
            if (dist < minDistance) {
                minDistance = dist;
                nearestIndex = i;
            }
        }

        const nextStop = remaining.splice(nearestIndex, 1)[0];
        result.push(nextStop);
        currentPoint = { lat: nextStop.latitude, lng: nextStop.longitude };
    }

    // 3. Assign periods
    const periods = ['Morning', 'Lunch', 'Afternoon', 'Night'];
    return result.map((item, index) => ({
        ...item,
        period: periods[index] || 'Evening'
    }));
}
