import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Convert degrees to radians
 */
function toRad(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

/**
 * Calculate distance from a reference point to an attraction
 * @param {Object} attraction - Attraction object with coords [lat, lon]
 * @param {Array} refPoint - Reference point [lat, lon]
 * @returns {number|null} Distance in km or null if coords missing
 */
export function calculateDistanceFromRef(attraction, refPoint) {
    if (!attraction.coords || !refPoint || refPoint.length !== 2) {
        return null;
    }
    return haversineDistance(
        refPoint[0],
        refPoint[1],
        attraction.coords[0],
        attraction.coords[1]
    );
}

/**
 * Calculate center point (average) of multiple coordinates
 * @param {Array} attractions - Array of attractions with coords
 * @returns {Array|null} Center point [lat, lon] or null
 */
export function calculateCenterPoint(attractions) {
    const validAttractions = attractions.filter(a => a.coords && a.coords.length === 2);
    if (validAttractions.length === 0) return null;

    const avgLat = validAttractions.reduce((sum, a) => sum + a.coords[0], 0) / validAttractions.length;
    const avgLon = validAttractions.reduce((sum, a) => sum + a.coords[1], 0) / validAttractions.length;

    return [avgLat, avgLon];
}
