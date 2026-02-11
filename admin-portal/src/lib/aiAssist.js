/**
 * AI Assist - Rule-based intelligent suggestion system for attractions
 */

// Attraction type templates with default values
const ATTRACTION_TEMPLATES = {
    'Nature': {
        categories: ['Nature', 'Recreation', 'Outdoor'],
        duration: 180,
        cost: 0,
        descriptionTemplate: 'Experience the natural beauty of {name}, a stunning {type} destination in {destination}. Perfect for outdoor enthusiasts and nature lovers.'
    },
    'Cultural': {
        categories: ['Cultural', 'Heritage', 'Historical'],
        duration: 90,
        cost: 20,
        descriptionTemplate: 'Discover the rich heritage of {name}, a significant {type} site in {destination}. Immerse yourself in local culture and history.'
    },
    'Landmark': {
        categories: ['Landmark', 'Iconic', 'Tourist Spot'],
        duration: 90,
        cost: 50,
        descriptionTemplate: 'Visit {name}, an iconic {type} in {destination}. A must-see attraction that defines the skyline and spirit of the region.'
    },
    'Shopping': {
        categories: ['Shopping', 'Entertainment', 'Retail'],
        duration: 180,
        cost: 100,
        descriptionTemplate: 'Shop till you drop at {name}, a premier {type} destination in {destination}. Features a wide variety of stores and dining options.'
    },
    'Food': {
        categories: ['Food', 'Dining', 'Culinary'],
        duration: 90,
        cost: 40,
        descriptionTemplate: 'Savor authentic flavors at {name}, a popular {type} spot in {destination}. Experience the local cuisine and dining culture.'
    },
    'Adventure': {
        categories: ['Adventure', 'Extreme', 'Thrilling'],
        duration: 240,
        cost: 150,
        descriptionTemplate: 'Get your adrenaline pumping at {name}, an exciting {type} destination in {destination}. Perfect for thrill-seekers and adventure enthusiasts.'
    },
    'Museum': {
        categories: ['Museum', 'Educational', 'Cultural'],
        duration: 120,
        cost: 25,
        descriptionTemplate: 'Explore fascinating exhibits at {name}, a renowned {type} in {destination}. Learn about art, history, and culture through interactive displays.'
    },
    'Beach': {
        categories: ['Beach', 'Nature', 'Water'],
        duration: 240,
        cost: 0,
        descriptionTemplate: 'Relax and unwind at {name}, a beautiful {type} in {destination}. Enjoy sun, sand, and sea in this tropical paradise.'
    },
    'Park': {
        categories: ['Park', 'Recreation', 'Nature'],
        duration: 180,
        cost: 0,
        descriptionTemplate: 'Enjoy outdoor activities at {name}, a spacious {type} in {destination}. Perfect for picnics, walks, and family outings.'
    }
};

// Keyword-based enhancements
const KEYWORDS = {
    'tower': { category: 'Landmark', duration: 90, cost: 50 },
    'beach': { category: 'Beach', duration: 240, cost: 0 },
    'temple': { category: 'Cultural', duration: 60, cost: 0 },
    'mosque': { category: 'Cultural', duration: 60, cost: 0 },
    'church': { category: 'Cultural', duration: 60, cost: 0 },
    'palace': { category: 'Cultural', duration: 120, cost: 30 },
    'mall': { category: 'Shopping', duration: 180, cost: 100 },
    'market': { category: 'Shopping', duration: 120, cost: 50 },
    'museum': { category: 'Museum', duration: 120, cost: 25 },
    'park': { category: 'Park', duration: 180, cost: 0 },
    'garden': { category: 'Nature', duration: 120, cost: 10 },
    'zoo': { category: 'Nature', duration: 180, cost: 40 },
    'aquarium': { category: 'Nature', duration: 120, cost: 50 },
    'waterfall': { category: 'Nature', duration: 180, cost: 0 },
    'mountain': { category: 'Adventure', duration: 300, cost: 50 },
    'island': { category: 'Beach', duration: 360, cost: 100 },
    'cave': { category: 'Adventure', duration: 90, cost: 20 },
    'theme park': { category: 'Adventure', duration: 360, cost: 120 },
    'resort': { category: 'Beach', duration: 480, cost: 200 }
};

/**
 * Generate intelligent suggestions for an attraction
 * @param {string} name - Attraction name
 * @param {string} type - Attraction type
 * @param {string} destination - Destination name
 * @returns {Object} Suggestions object
 */
export function generateAttractionSuggestions(name, type, destination = 'Malaysia') {
    const suggestions = {
        description: '',
        category: type || 'Tourist Spot',
        duration: 120, // minutes
        cost: 50 // RM
    };

    // 1. Start with type template if available
    if (ATTRACTION_TEMPLATES[type]) {
        const template = ATTRACTION_TEMPLATES[type];
        suggestions.category = template.categories[0];
        suggestions.duration = template.duration;
        suggestions.cost = template.cost;
        suggestions.description = template.descriptionTemplate
            .replace('{name}', name)
            .replace('{type}', type.toLowerCase())
            .replace('{destination}', destination || 'Malaysia');
    } else {
        // Default description
        suggestions.description = `Discover ${name}, a popular attraction in ${destination || 'Malaysia'}. A must-visit destination for travelers.`;
    }

    // 2. Enhance based on keywords in name
    const lowerName = name.toLowerCase();
    for (const [keyword, props] of Object.entries(KEYWORDS)) {
        if (lowerName.includes(keyword)) {
            // Override with keyword-specific values
            if (props.category) suggestions.category = props.category;
            if (props.duration) suggestions.duration = props.duration;
            if (props.cost !== undefined) suggestions.cost = props.cost;

            // Add keyword-specific context to description if not from template
            if (!ATTRACTION_TEMPLATES[type]) {
                suggestions.description = `Explore ${name}, featuring ${keyword} experiences in ${destination || 'Malaysia'}. ${suggestions.description}`;
            }
            break; // Use first matching keyword
        }
    }

    return suggestions;
}

/**
 * Get category suggestions based on attraction type
 * @param {string} type - Attraction type
 * @returns {Array} Array of suggested categories
 */
export function getCategorySuggestions(type) {
    if (ATTRACTION_TEMPLATES[type]) {
        return ATTRACTION_TEMPLATES[type].categories;
    }
    return ['Tourist Spot', 'Attraction', 'Point of Interest'];
}
