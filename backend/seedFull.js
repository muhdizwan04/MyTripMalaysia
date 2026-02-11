const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('./src/config/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seedFullDatabase() {
    console.log('🌱 Starting full database seed...\n');

    try {
        // 1. DESTINATIONS
        console.log('📍 Seeding destinations...');
        const destinations = [
            {
                name: 'Kuala Lumpur',
                description: 'The vibrant capital city of Malaysia, known for its modern skyline and cultural diversity.',
                image_url: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800'
            },
            {
                name: 'Selangor',
                description: 'Malaysia\'s most developed state, home to diverse attractions from nature to theme parks.',
                image_url: 'https://images.unsplash.com/photo-1583339793403-3d9b001b6008?w=800'
            },
            {
                name: 'Penang',
                description: 'The Pearl of the Orient, famous for its food heritage and colonial architecture.',
                image_url: 'https://images.unsplash.com/photo-1559142952-dbaa96df49a9?w=800'
            },
            {
                name: 'Melaka',
                description: 'UNESCO World Heritage city rich in history and multicultural influences.',
                image_url: 'https://images.unsplash.com/photo-1583339793403-3d9b001b6008?w=800'
            },
            {
                name: 'Sabah',
                description: 'Land Below the Wind, featuring pristine beaches and Mount Kinabalu.',
                image_url: 'https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=800'
            }
        ];

        for (const dest of destinations) {
            await db.collection('destinations').add(dest);
        }
        console.log('✅ Destinations seeded!\n');

        // 2. ATTRACTIONS
        console.log('🎯 Seeding attractions...');
        const attractions = [
            {
                name: 'Village Park Nasi Lemak',
                type: 'Food',
                rating: 4.8,
                ticket_price: 25.00,
                location: 'Petaling Jaya',
                description: 'Legendary nasi lemak spot with the best crispy rendang chicken',
                image_url: 'https://images.unsplash.com/photo-1624518266248-3e134a972d7e?w=800',
                destinationId: '',
                latitude: 3.1078,
                longitude: 101.6415,
                avgDuration: 60,
                avgCost: 25,
                isMall: false,
                review_count: 1240
            },
            {
                name: 'Batu Caves',
                type: 'Nature',
                rating: 4.6,
                ticket_price: 0,
                location: 'Selangor',
                description: 'Iconic limestone hill with Hindu temple and 272 colorful steps',
                image_url: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800',
                destinationId: '',
                latitude: 3.2379,
                longitude: 101.6841,
                avgDuration: 120,
                avgCost: 0,
                isMall: false,
                review_count: 8500
            },
            {
                name: 'Sunway Lagoon',
                type: 'Nature',
                rating: 4.5,
                ticket_price: 180.00,
                location: 'Selangor',
                description: 'Award-winning theme park with water rides, wildlife park, and extreme rides',
                image_url: 'https://images.unsplash.com/photo-1594385208974-2e75f8763c0e?w=800',
                destinationId: '',
                latitude: 3.0683,
                longitude: 101.6069,
                avgDuration: 480,
                avgCost: 200,
                isMall: false,
                review_count: 3200
            },
            {
                name: 'Petronas Twin Towers',
                type: 'Landmark',
                rating: 4.9,
                ticket_price: 85.00,
                location: 'Kuala Lumpur',
                description: 'World-famous skyscraper with breathtaking skybridge and observation deck',
                image_url: 'https://images.unsplash.com/photo-1508062878650-88b52897f298?w=800',
                destinationId: '',
                latitude: 3.1578,
                longitude: 101.7116,
                avgDuration: 90,
                avgCost: 85,
                isMall: false,
                review_count: 15000
            },
            {
                name: 'Pavilion KL',
                type: 'Mall',
                rating: 4.8,
                ticket_price: 0,
                location: 'Bukit Bintang',
                description: 'Premier shopping destination in the heart of KL with 450+ retail outlets',
                image_url: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce2?w=800',
                destinationId: '',
                latitude: 3.1493,
                longitude: 101.7143,
                avgDuration: 180,
                avgCost: 0,
                isMall: true,
                is_mall: true,
                review_count: 9800
            },
            {
                name: 'Sunway Pyramid',
                type: 'Mall',
                rating: 4.7,
                ticket_price: 0,
                location: 'Subang Jaya',
                description: 'Iconic Egyptian-themed shopping mall with ice skating rink',
                image_url: 'https://images.unsplash.com/photo-1555529902-5261145633bf?w=800',
                destinationId: '',
                latitude: 3.0733,
                longitude: 101.6069,
                avgDuration: 180,
                avgCost: 0,
                isMall: true,
                is_mall: true,
                review_count: 7200
            }
        ];

        let pavilionId = null;
        for (const attraction of attractions) {
            const docRef = await db.collection('attractions').add(attraction);
            if (attraction.name === 'Pavilion KL') {
                pavilionId = docRef.id;
                console.log(`✅ Pavilion KL created with ID: ${pavilionId}`);
            }
        }
        console.log('✅ Attractions seeded!\n');

        // 3. SHOPS (linked to Pavilion KL)
        if (pavilionId) {
            console.log('🛍️  Seeding shops for Pavilion KL...');
            const shops = [
                {
                    name: 'Zara',
                    mallId: pavilionId,
                    floor: 'Ground Floor',
                    category: 'Fashion',
                    description: 'Spanish fashion retailer offering trendy clothing',
                    image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600',
                    rating: 4.5
                },
                {
                    name: 'Uniqlo',
                    mallId: pavilionId,
                    floor: 'Level 1',
                    category: 'Fashion',
                    description: 'Japanese casual wear designer and retailer',
                    image_url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600',
                    rating: 4.6
                },
                {
                    name: 'Apple Store',
                    mallId: pavilionId,
                    floor: 'Level 2',
                    category: 'Electronics',
                    description: 'Official Apple retail store with full product range',
                    image_url: 'https://images.unsplash.com/photo-1592286927505-2fd0f8a196e0?w=600',
                    rating: 4.8
                },
                {
                    name: 'Sephora',
                    mallId: pavilionId,
                    floor: 'Level 3',
                    category: 'Beauty',
                    description: 'Premium beauty and cosmetics retailer',
                    image_url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600',
                    rating: 4.7
                },
                {
                    name: 'Din Tai Fung',
                    mallId: pavilionId,
                    floor: 'Level 1',
                    category: 'Food',
                    description: 'World-famous Taiwanese restaurant known for xiaolongbao',
                    image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600',
                    rating: 4.9
                }
            ];

            for (const shop of shops) {
                await db.collection('shops').add(shop);
            }
            console.log('✅ Shops seeded!\n');
        }

        // 4. HOTELS
        console.log('🏨 Seeding hotels...');
        const hotels = [
            {
                name: 'Grand Hyatt',
                type: 'Hotel',
                price: 450,
                rating: 4.8,
                location: 'Kuala Lumpur',
                description: '5-star luxury hotel in the heart of KLCC',
                image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
                amenities: ['Pool', 'Gym', 'Spa', 'Restaurant']
            },
            {
                name: 'Budget Inn',
                type: 'Hotel',
                price: 80,
                rating: 3.5,
                location: 'Kuala Lumpur',
                description: 'Affordable accommodation with basic amenities',
                image_url: 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=800',
                amenities: ['WiFi', 'AC']
            },
            {
                name: 'Skyline Loft with KLCC View',
                type: 'Airbnb',
                price: 250,
                rating: 4.9,
                location: 'Kuala Lumpur',
                description: 'Modern loft apartment with stunning city views',
                image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
                amenities: ['Kitchen', 'WiFi', 'City View', 'Washer']
            }
        ];

        for (const hotel of hotels) {
            await db.collection('hotels').add(hotel);
        }
        console.log('✅ Hotels seeded!\n');

        // 5. TRENDING ITINERARIES
        console.log('📋 Seeding trending itineraries...');
        const itineraries = [
            {
                title: "Foodie's Paradise",
                duration: 5,
                budget: 450,
                description: 'Explore the best food spots across KL and Penang',
                image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
                rating: 4.8,
                likes: 892,
                saves: 345,
                author: 'Sarah Tan',
                highlights: ['Village Park Nasi Lemak', 'Penang Street Food', 'Jalan Alor Night Market']
            },
            {
                title: 'Heritage Trail',
                duration: 4,
                budget: 360,
                description: 'Discover Malaysia\'s rich history and culture',
                image_url: 'https://images.unsplash.com/photo-1555633514-abcee6ab6e50?w=800',
                rating: 4.7,
                likes: 756,
                saves: 290,
                author: 'Ahmad Rahman',
                highlights: ['Batu Caves', 'Melaka Historical City', 'Sultan Abdul Samad Building']
            }
        ];

        for (const itinerary of itineraries) {
            await db.collection('trending_itineraries').add(itinerary);
        }
        console.log('✅ Trending itineraries seeded!\n');

        // 6. USERS & COMMUNITY POSTS
        console.log('👥 Seeding users and community posts...');

        // User
        const userDoc = await db.collection('users').add({
            username: 'sarah_tan',
            full_name: 'Sarah Tan',
            email: 'sarah.tan@example.com',
            bio: 'Food lover & travel enthusiast 🍜✈️',
            profile_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
            counts: {
                trips: 12,
                posts: 28,
                saved: 45,
                followers: 1240,
                following: 890
            },
            joined: admin.firestore.Timestamp.now()
        });

        // Community Post
        await db.collection('community_posts').add({
            userId: userDoc.id,
            author: 'Sarah Tan',
            author_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
            image_url: 'https://images.unsplash.com/photo-1624518266248-3e134a972d7e?w=800',
            caption: 'Best Nasi Lemak in KL! 🔥 The crispy rendang chicken is absolutely legendary!',
            location: 'Village Park Nasi Lemak',
            attraction_reference: 'Village Park Nasi Lemak',
            likes: 324,
            comments: 47,
            saves: 89,
            timestamp: admin.firestore.Timestamp.now()
        });

        console.log('✅ Users and community posts seeded!\n');

        // 7. LOGISTICS (Global Settings)
        console.log('⚙️  Seeding logistics/global settings...');
        await db.collection('logistics').doc('global_settings').set({
            grab_base_rate: 1.50,
            petrol_cost_per_km: 0.25,
            average_speed_kmh: 40,
            currency: 'RM',
            last_updated: admin.firestore.Timestamp.now()
        });
        console.log('✅ Logistics settings seeded!\n');

        console.log('🎉 ✅ All collections seeded successfully!\n');
        console.log('📊 Summary:');
        console.log('   - 5 Destinations');
        console.log('   - 6 Attractions (including 2 malls)');
        console.log('   - 5 Shops (linked to Pavilion KL)');
        console.log('   - 3 Hotels');
        console.log('   - 2 Trending Itineraries');
        console.log('   - 1 User with 1 Community Post');
        console.log('   - Global Logistics Settings');
        console.log('\n🚀 Your app is now fully populated with data!');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }

    process.exit(0);
}

// Run the seed function
seedFullDatabase();
