const admin = require('firebase-admin');
const serviceAccount = require('./src/config/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seedCommunityFeed() {
    console.log('🌱 Seeding Community Feed...\n');

    try {
        const posts = [
            {
                author: 'Sarah Tan',
                author_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
                location: 'Village Park Restaurant',
                image_url: 'https://images.unsplash.com/photo-1624518266248-3e134a972d7e?w=800',
                caption: 'Best nasi lemak in KL! The sambal is perfectly spicy. 😋',
                likes: 324,
                comments: 89,
                saves: 156,
                tags: ['KL FOOD', 'VIRAL'],
                timestamp: admin.firestore.Timestamp.now()
            },
            {
                author: 'Ahmad Razak',
                author_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
                location: 'Cameron Highlands',
                image_url: 'https://images.unsplash.com/photo-1563260797-cb5cd70254c8?w=800',
                caption: 'Stunning morning view. Bring a jacket! 🍃',
                likes: 567,
                comments: 234,
                saves: 289,
                tags: ['SCENERY', 'NATURE'],
                timestamp: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 86400000)) // 1 day ago
            },
            {
                author: 'John Traveler',
                author_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
                location: 'Saloma Bridge',
                image_url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800',
                caption: 'Night walk around KL is magical. 🇲🇾',
                likes: 120,
                comments: 45,
                saves: 67,
                tags: ['CITY', 'NIGHTLIFE'],
                timestamp: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 172800000)) // 2 days ago
            }
        ];

        for (const post of posts) {
            await db.collection('community_posts').add(post);
            console.log(`✅ Added post by ${post.author}`);
        }

        console.log('\n🎉 ✅ Community feed seeded successfully!\n');
        console.log('📊 Summary:');
        console.log('   - 3 Community Posts');
        console.log('   - From Sarah Tan, Ahmad Razak, and John Traveler');
        console.log('\n🚀 Refresh your Community Feed to see the posts!');

    } catch (error) {
        console.error('❌ Error seeding community feed:', error);
        process.exit(1);
    }

    process.exit(0);
}

seedCommunityFeed();
