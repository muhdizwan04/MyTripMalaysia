// Validation Rules Configuration
const ValidationRules = {
    maxActivitiesPerDay: 5,
    maxDurationHours: 8,
    defaultDailyBudget: 300, // RM
    warnings: {
        activitiesExceeded: 'Too many activities scheduled',
        durationExceeded: 'Day schedule is too long',
        budgetExceeded: 'Daily budget exceeded'
    }
};

module.exports = ValidationRules;
