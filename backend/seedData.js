const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seedDatabase() {
    console.log('🌱 Starting database seeding...');

    try {
        // Create batch
        const batch = db.batch();

        // ============================
        // 1. USERS
        // ============================
        console.log('📝 Adding Users...');

        const user1Ref = db.collection('users').doc();
        batch.set(user1Ref, {
            username: 'john_traveler',
            full_name: 'John Traveler',
            bio: 'Exploring Malaysia one state at a time 🇲🇾',
            profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            email: 'john@example.com',
            counts: {
                trips: 12,
                posts: 8,
                saved: 24
            },
            created_at: new Date(),
            updated_at: new Date()
        });

        const user2Ref = db.collection('users').doc();
        batch.set(user2Ref, {
            username: 'sarah_tan',
            full_name: 'Sarah Tan',
            bio: 'Food lover & travel enthusiast 🍜',
            profile_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
            email: 'sarah@example.com',
            counts: {
                trips: 8,
                posts: 15,
                saved: 12
            },
            created_at: new Date(),
            updated_at: new Date()
        });

        const user3Ref = db.collection('users').doc();
        batch.set(user3Ref, {
            username: 'ahmad_razak',
            full_name: 'Ahmad Razak',
            bio: 'Nature photographer 📸',
            profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
            email: 'ahmad@example.com',
            counts: {
                trips: 15,
                posts: 23,
                saved: 18
            },
            created_at: new Date(),
            updated_at: new Date()
        });

        // ============================
        // 2. DESTINATIONS
        // ============================
        console.log('📍 Adding Destinations...');

        const dest1Ref = db.collection('destinations').doc();
        batch.set(dest1Ref, {
            name: 'Kuala Lumpur',
            code: 'KUL',
            description: 'The vibrant capital city of Malaysia',
            created_at: new Date()
        });

        const dest2Ref = db.collection('destinations').doc();
        batch.set(dest2Ref, {
            name: 'Pahang',
            code: 'PAH',
            description: 'Home to Cameron Highlands',
            created_at: new Date()
        });

        const dest3Ref = db.collection('destinations').doc();
        batch.set(dest3Ref, {
            name: 'Selangor',
            code: 'SEL',
            description: 'Gateway to Batu Caves',
            created_at: new Date()
        });

        // ============================
        // 3. ATTRACTIONS
        // ============================
        console.log('🏛️ Adding Attractions...');

        const attr1Ref = db.collection('attractions').doc();
        batch.set(attr1Ref, {
            name: 'Village Park Nasi Lemak',
            destinationId: dest1Ref.id,
            type: 'Food',
            latitude: 3.1746,
            longitude: 101.6663,
            avgDuration: 60,
            avgCost: 25.00,
            ticket_price: 25.00,
            rating: 4.8,
            review_count: 1247,
            isMall: false,
            description: 'Famous for the best Nasi Lemak in KL. A must-try local delicacy!',
            image: 'https://images.unsplash.com/photo-1596040033229-a0b2b7c16a1b?w=800',
            created_at: new Date()
        });

        const attr2Ref = db.collection('attractions').doc();
        batch.set(attr2Ref, {
            name: 'Batu Caves Rainbow Stairs',
            destinationId: dest3Ref.id,
            type: 'Landmark',
            latitude: 3.2379,
            longitude: 101.6840,
            avgDuration: 120,
            avgCost: 0,
            ticket_price: 0,
            rating: 4.8,
            review_count: 3521,
            isMall: false,
            description: 'Iconic limestone hill with colorful rainbow stairs and Hindu temple.',
            image: 'https://images.unsplash.com/photo-1596422846543-75c6fc196491?w=800',
            created_at: new Date()
        });

        const attr3Ref = db.collection('attractions').doc();
        batch.set(attr3Ref, {
            name: 'Petronas Twin Towers',
            destinationId: dest1Ref.id,
            type: 'Landmark',
            latitude: 3.1579,
            longitude: 101.7116,
            avgDuration: 90,
            avgCost: 85.00,
            ticket_price: 85.00,
            rating: 4.9,
            review_count: 5432,
            isMall: false,
            description: 'Iconic 88-story twin skyscrapers with stunning city views.',
            image: 'https://images.unsplash.com/photo-1508062878650-88b52897f298?w=800',
            created_at: new Date()
        });

        const attr4Ref = db.collection('attractions').doc();
        batch.set(attr4Ref, {
            name: 'Cameron Highlands Tea Plantation',
            destinationId: dest2Ref.id,
            type: 'Nature',
            latitude: 4.4704,
            longitude: 101.3779,
            avgDuration: 180,
            avgCost: 30.00,
            ticket_price: 30.00,
            rating: 4.7,
            review_count: 2134,
            isMall: false,
            description: 'Beautiful tea plantations with breathtaking highland views.',
            image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800',
            created_at: new Date()
        });

        // Pavilion KL Mall
        const mallRef = db.collection('attractions').doc();
        batch.set(mallRef, {
            name: 'Pavilion KL',
            destinationId: dest1Ref.id,
            type: 'Mall',
            latitude: 3.1495,
            longitude: 101.7131,
            avgDuration: 180,
            avgCost: 150.00,
            ticket_price: 0,
            rating: 4.6,
            review_count: 4234,
            isMall: true,
            description: 'Premier shopping mall in the heart of Kuala Lumpur.',
            image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800',
            created_at: new Date()
        });

        // ============================
        // 4. SHOPS (Pavilion KL)
        // ============================
        console.log('🛍️ Adding Shops...');

        const shop1Ref = db.collection('shops').doc();
        batch.set(shop1Ref, {
            mallId: mallRef.id,
            name: 'Zara',
            category: 'Fashion',
            floor_level: 'Ground Floor',
            avgDuration: 45,
            avgCost: 200,
            created_at: new Date()
        });

        const shop2Ref = db.collection('shops').doc();
        batch.set(shop2Ref, {
            mallId: mallRef.id,
            name: 'Uniqlo',
            category: 'Fashion',
            floor_level: 'Level 1',
            avgDuration: 40,
            avgCost: 150,
            created_at: new Date()
        });

        const shop3Ref = db.collection('shops').doc();
        batch.set(shop3Ref, {
            mallId: mallRef.id,
            name: 'Apple Store',
            category: 'Electronics',
            floor_level: 'Level 2',
            avgDuration: 60,
            avgCost: 500,
            created_at: new Date()
        });

        const shop4Ref = db.collection('shops').doc();
        batch.set(shop4Ref, {
            mallId: mallRef.id,
            name: 'Sephora',
            category: 'Services',
            floor_level: 'Level 3',
            avgDuration: 50,
            avgCost: 180,
            created_at: new Date()
        });

        const shop5Ref = db.collection('shops').doc();
        batch.set(shop5Ref, {
            mallId: mallRef.id,
            name: 'Din Tai Fung',
            category: 'Food',
            floor_level: 'Level 1',
            avgDuration: 90,
            avgCost: 80,
            created_at: new Date()
        });

        // ============================
        // 5. TRENDING ITINERARIES
        // ============================
        console.log('⭐ Adding Trending Itineraries...');

        const itin1Ref = db.collection('trending_itineraries').doc();
        batch.set(itin1Ref, {
            title: "Foodie's Paradise",
            duration_days: 5,
            total_cost: 'RM 450',
            type: 'Culinary',
            cover_image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
            description: 'Explore the best street food and restaurants across Malaysia',
            highlights: ['Village Park Nasi Lemak', 'Jalan Alor Night Market', 'Penang Street Food'],
            trending_score: 95,
            created_at: new Date(),
            updated_at: new Date()
        });

        const itin2Ref = db.collection('trending_itineraries').doc();
        batch.set(itin2Ref, {
            title: 'Heritage Trail',
            duration_days: 4,
            total_cost: 'RM 360',
            type: 'Culture',
            cover_image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800',
            description: 'Discover Malaysia\'s rich cultural heritage and historical landmarks',
            highlights: ['Batu Caves', 'Petronas Towers', 'National Museum', 'Sultan Palace'],
            trending_score: 88,
            created_at: new Date(),
            updated_at: new Date()
        });

        // ============================
        // 6. SOCIAL POSTS
        // ============================
        console.log('💬 Adding Social Posts...');

        const post1Ref = db.collection('social_posts').doc();
        batch.set(post1Ref, {
            author_id: user2Ref.id,
            author_name: 'Sarah Tan',
            author_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
            location_name: 'Village Park Restaurant',
            image_url: 'https://images.unsplash.com/photo-1596040033229-a0b2b7c16a1b?w=800',
            caption: 'Best Nasi Lemak in KL! The sambal is absolutely divine 😍🔥 #MustTry',
            tags: ['KL FOOD', 'LOCAL EATS', 'NASI LEMAK'],
            likes_count: 324,
            comments_count: 42,
            rating: 4.8,
            created_at: new Date(),
            updated_at: new Date()
        });

        const post2Ref = db.collection('social_posts').doc();
        batch.set(post2Ref, {
            author_id: user3Ref.id,
            author_name: 'Ahmad Razak',
            author_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
            location_name: 'Cameron Highlands',
            image_url: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800',
            caption: 'The morning mist over the tea plantations is magical ☁️🍵',
            tags: ['SCENERY', 'NATURE', 'HIGHLANDS'],
            likes_count: 567,
            comments_count: 89,
            rating: 4.9,
            created_at: new Date(),
            updated_at: new Date()
        });

        // Commit batch
        await batch.commit();

        console.log('✅ Database seeded successfully!');
        console.log('\n📊 Summary:');
        console.log('   - 3 Users');
        console.log('   - 3 Destinations');
        console.log('   - 5 Attractions (including Pavilion KL Mall)');
        console.log('   - 5 Shops in Pavilion KL');
        console.log('   - 2 Trending Itineraries');
        console.log('   - 2 Social Posts');
        console.log('\n🎉 All done! You can now test the app with realistic data.');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    } finally {
        // Close connection
        await admin.app().delete();
    }
}

// Run the seeder
seedDatabase();
