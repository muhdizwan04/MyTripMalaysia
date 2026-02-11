// Social Post Model
const SocialPostStructure = {
    id: 'string',                    // Auto-generated
    author_id: 'string',             // Reference to Users collection
    author_name: 'string',           // Cached for performance
    author_image: 'string',          // Cached profile image
    location_name: 'string',         // e.g., "Village Park Restaurant"
    image_url: 'string',             // Post image URL
    caption: 'string',               // Post description
    tags: 'array<string>',           // e.g., ["KL FOOD", "SCENERY"]
    likes_count: 'number',           // Total likes
    comments_count: 'number',        // Total comments
    rating: 'number',                // e.g., 4.8
    created_at: 'timestamp',
    updated_at: 'timestamp'
};

module.exports = SocialPostStructure;
