// Trending Itinerary Model
const TrendingItineraryStructure = {
    id: 'string',                    // Auto-generated
    title: 'string',                 // e.g., "Foodie's Paradise"
    duration_days: 'number',         // e.g., 5
    total_cost: 'string',            // e.g., "RM 450"
    type: 'string',                  // e.g., "Culinary", "Culture"
    cover_image: 'string',           // Itinerary cover image
    description: 'string',           // Brief description
    highlights: 'array<string>',     // Key highlights
    trending_score: 'number',        // For sorting
    created_at: 'timestamp',
    updated_at: 'timestamp'
};

module.exports = TrendingItineraryStructure;
