// User Model - No actual schema for Firestore, just structure definition
const UserStructure = {
    id: 'string',                    // Auto-generated
    username: 'string',              // Unique username
    full_name: 'string',             // Display name
    bio: 'string',                   // User biography
    profile_image: 'string',         // URL to profile image
    email: 'string',                 // User email
    counts: {
        trips: 'number',             // Total trips created
        posts: 'number',             // Total posts shared
        saved: 'number'              // Total saved items
    },
    created_at: 'timestamp',
    updated_at: 'timestamp'
};

module.exports = UserStructure;
