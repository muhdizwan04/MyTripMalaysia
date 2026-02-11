/**
 * Validation utility functions for itinerary validation
 */

/**
 * Validate a single day in the itinerary
 * @param {Object} day - Day object with activities
 * @param {Object} rules - Validation rules from backend
 * @returns {Array} Array of warning objects
 */
export function validateDay(day, rules) {
    const warnings = [];
    const activities = (day.activities || []).filter(act => act.type !== 'transport');

    // Check activity count
    if (activities.length > rules.maxActivitiesPerDay) {
        warnings.push({
            type: 'activities',
            message: `${activities.length}/${rules.maxActivitiesPerDay} activities`,
            severity: 'error',
            detail: 'Consider reducing activities for a more relaxed day'
        });
    }

    // Check total duration
    const totalDuration = activities.reduce((sum, act) => {
        // Convert duration from minutes to hours if needed
        const duration = act.duration > 24 ? act.duration / 60 : act.duration;
        return sum + (duration || 2);
    }, 0);

    if (totalDuration > rules.maxDurationHours) {
        warnings.push({
            type: 'duration',
            message: `${totalDuration.toFixed(1)}h/${rules.maxDurationHours}h duration`,
            severity: 'warning',
            detail: 'This day may be too packed'
        });
    }

    // Check budget
    const totalCost = activities.reduce((sum, act) =>
        sum + (act.price || 0), 0
    );

    if (totalCost > rules.defaultDailyBudget) {
        warnings.push({
            type: 'budget',
            message: `RM ${totalCost}/RM ${rules.defaultDailyBudget} budget`,
            severity: 'warning',
            detail: 'Daily spending exceeds recommended budget'
        });
    }

    return warnings;
}

/**
 * Validate entire itinerary
 * @param {Array} itinerary - Array of day objects
 * @param {Object} rules - Validation rules
 * @returns {Object} Object mapping day numbers to warnings
 */
export function validateItinerary(itinerary, rules) {
    const warnings = {};

    itinerary.forEach(day => {
        const dayWarnings = validateDay(day, rules);
        if (dayWarnings.length > 0) {
            warnings[day.day] = dayWarnings;
        }
    });

    return warnings;
}
