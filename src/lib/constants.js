export const ACCOMMODATION_DATA = {
    hotel: [
        { id: 'h1', name: "Grand Hyatt", price: 450, rating: 4.8, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", location: "City Centre", type: "Luxury Hotel" },
        { id: 'h2', name: "Budget Inn", price: 80, rating: 3.5, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", location: "City Centre", type: "Budget Hotel" },
        { id: 'h3', name: "Seaside Resort", price: 300, rating: 4.5, image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", location: "Beachfront", type: "Resort" },
        { id: 'h4', name: "Heritage Boutique", price: 200, rating: 4.2, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", location: "Old Town", type: "Boutique Hotel" }
    ],
    airbnb: [
        { id: 'a1', name: "Skyline Loft with KLCC View", price: 250, rating: 4.9, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", location: "Bukit Bintang", type: "Entire Apartment" },
        { id: 'a2', name: "Cozy Studio near MRT", price: 120, rating: 4.7, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", location: "Petaling Jaya", type: "Studio Unit" },
        { id: 'a3', name: "Heritage Shophouse Stay", price: 180, rating: 4.8, image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", location: "Georgetown", type: "Private Room" }
    ],
    homestay: [
        { id: 'hs1', name: "Kampung Life Experience", price: 60, rating: 4.6, image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", location: "Kuala Selangor", type: "Village Homestay" },
        { id: 'hs2', name: "Cameron Highlands Cottage", price: 100, rating: 4.5, image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", location: "Cameron Highlands", type: "Nature Retreat" }
    ]
};

export const TRANSPORT_ESTIMATES = {
    ownTransport: {
        toll: {
            'Selangor-Penang': 45,
            'Selangor-Johor': 60,
            'Selangor-Melaka': 35,
            'Penang-Kedah': 20,
            'default': 25 // per inter-state trip
        },
        gas: {
            perKm: 0.50, // RM per km
            avgDistance: 150 // avg distance between states in km
        }
    },
    publicTransport: {
        routes: {
            'Selangor': 'KTM Komuter, LRT, MRT, RapidKL Bus available throughout the state',
            'Penang': 'RapidPenang Bus, CAT Free Shuttle in Georgetown',
            'Johor': ['Legoland Malaysia', 'Johor Premium Outlets', 'Angry Birds Activity Park'],
            'Melaka': 'Panorama Melaka Bus, Hop-On Hop-Off Tourist Bus',
            'Kedah': 'Local bus services, taxi recommended for rural areas',
            'default': 'Check local bus terminals and train stations for schedules'
        },
        interState: {
            'Selangor-Penang': 'ETS Train (RM 59-89) or Express Bus (RM 35-50)',
            'Selangor-Johor': 'KTM Intercity or Express Bus (RM 30-55)',
            'Selangor-Melaka': 'Express Bus (RM 12-20)',
            'default': 'Check bus terminals for express coaches between states'
        }
    }
};

export const ROUTE_GUIDANCE = {
    // Public transport availability by location category
    publicTransportAvailable: {
        'Theme Park': false,
        'Nature/Culture': true,
        'Nightlife': true,
        'Viral Food': true,
        'Mall': true,
        'Shopping': true,
        'food': true,
        'shopping': true,
        'activity': true,
        'default': true
    },

    // GrabCar estimates
    grabCar: {
        baseFare: 4.00,
        perKm: 1.20,
        avgDistance: 8 // average km between activities
    },

    // Public transport routes between activity types
    transitRoutes: {
        'Theme Park': 'GrabCar recommended (no direct public transport)',
        'Nature/Culture': 'LRT/KTM + 10min walk',
        'Nightlife': 'MRT/LRT direct access',
        'Viral Food': 'RapidKL Bus or short Grab ride',
        'Mall': 'MRT/LRT direct access',
        'Shopping': 'MRT/LRT + connecting bus',
        'default': 'RapidKL Bus or MRT/LRT'
    },

    // Cost estimates for public transport
    publicTransportCost: {
        'short': 2.50,  // within 5km
        'medium': 4.50, // 5-15km
        'long': 7.00    // 15km+
    }
};

// Organized by State -> Category
export const STATE_ACTIVITIES = {
    "Selangor": [
        {
            id: 's1',
            name: "Sunway Lagoon Theme Park",
            type: "activity", category: "Theme Park", price: 200, rating: 4.7, coords: [3.0732, 101.6074],
            image: "https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            videoUrl: "https://www.youtube.com/embed/5U7DkL-3-uQ",
            description: "A massive multi-theme park with water slides, wildlife, and scream-worthy rides. Features Vuvuzela, the world's largest water ride.",
            reviews: [
                { user: "Sarah", rating: 5, text: "Best water park in Malaysia! The Vuvuzela is terrifyingly good." },
                { user: "John", rating: 4, text: "Kids loved the wildlife section. A bit hot, so bring sunscreen." },
                { user: "Aiza", rating: 5, text: "Go early to avoid long queues. The night park is also amazing." }
            ]
        },
        {
            id: 's2',
            name: "Batu Caves",
            type: "activity", category: "Nature/Culture", price: 0, rating: 4.6, coords: [3.2379, 101.6840],
            image: "https://images.unsplash.com/photo-1544013919-4bb5cb5b77ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            videoUrl: "https://www.youtube.com/embed/PjE3Wn_XmIs",
            description: "Iconic Hindu temple set in limestone caves with a massive golden statue of Lord Murugan. The 272 steps are painted in vibrant rainbow colors.",
            reviews: [
                { user: "Emma", rating: 5, text: "272 steps were worth it! The view from the top is great." },
                { user: "Loke", rating: 4, text: "Watch out for the monkeys! They will take your food and bags." },
                { user: "Divya", rating: 5, text: "The architectural colors are stunning since the paint job." }
            ]
        },
        { id: 's3', name: "I-City Theme Park", type: "activity", category: "Nightlife", price: 50, rating: 4.3, coords: [3.0648, 101.4851], image: "https://images.unsplash.com/photo-1583248356463-6e7e1532130e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "City of Digital Lights with amazing LED displays and a Snow Walk." },
        { id: 's4', name: "Village Park Nasi Lemak", type: "food", category: "Viral Food", price: 25, rating: 4.8, coords: [3.1307, 101.6225], image: "https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Legitimately the best Nasi Lemak Ayam Goreng in the country.", reviews: [{ user: "Ali", rating: 5, text: "Crispy chicken 10/10" }, { user: "Wei", rating: 4, text: "Long queue but worth it." }] },
        { id: 's5', name: "One Utama Shopping Centre", type: "shopping", category: "Mall", price: 0, rating: 4.7, coords: [3.1502, 101.6152], image: "https://images.unsplash.com/photo-1582037928769-181f2644ecb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "One of the world's largest malls with an indoor rainforest." }
    ],
    "Kuala Lumpur": [
        {
            id: 'k1',
            name: "Petronas Twin Towers",
            type: "activity", category: "Landmark", price: 80, rating: 4.9, coords: [3.1579, 101.7123],
            image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            videoUrl: "https://www.youtube.com/embed/V6_yFf3fD8A",
            description: "The world's tallest twin towers. Best viewed at night from KLCC Park. You can walk the Skybridge connecting the two towers.",
            reviews: [
                { user: "Tom", rating: 5, text: "Iconic! Must see when in Malaysia." },
                { user: "Lucy", rating: 5, text: "The view from the bridge is amazing but book tickets in advance." }
            ]
        },
        { id: 'k3', name: "Pavilion KL", type: "shopping", category: "Mall", price: 0, rating: 4.8, coords: [3.1485, 101.7139], image: "https://images.unsplash.com/photo-1582037928769-181f2644ecb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Luxury shopping destination with award-winning store concepts." }
    ]
};

export const MALAYSIA_LOCATIONS = [
    { city: "Kuala Lumpur", state: "Kuala Lumpur" },
    { city: "Petaling Jaya", state: "Selangor" },
    { city: "Shah Alam", state: "Selangor" },
    { city: "Georgetown", state: "Penang" },
    { city: "Ipoh", state: "Perak" },
    { city: "Malacca City", state: "Malacca" },
    { city: "Johor Bahru", state: "Johor" }
];

export const TRAVEL_ADVICE = {
    "Selangor": [
        { title: "Avoid Jam", content: "Plan your travel outside of peak hours (7am-9am, 5pm-8pm) as Selangor traffic can be intense." },
        { title: "Family Friendly", content: "Sunway is great for kids, visit during weekdays for shorter queues." }
    ],
    "Kuala Lumpur": [
        { title: "Go Vertical", content: "Use the LRT/MRT to reach major spots instead of driving; it's faster and cheaper." },
        { title: "Stay Safe", content: "Keep your belongings close in crowded night markets like Jalan Alor." }
    ],
    "Penang": [
        { title: "Food Hop", content: "Most famous food stalls are within walking distance in Georgetown proper." },
        { title: "Peak Season", content: "Be prepared for crowds during school holidays and long weekends." }
    ],
    "General": [
        { title: "Weather Tip", content: "Always carry a small umbrella. Even if it's sunny, Malaysia gets sudden rain showers." },
        { title: "E-Hailing", content: "Download 'Grab' or 'Indrive' apps for easy and transparent transport pricing." }
    ]
};

export const TRANSPORT_ROUTES = {
    "public": {
        "Selangor": { method: "LRT/MRT + Grab", priceRange: "RM 20 - RM 50 / day", description: "Efficient rail network connecting major districts." },
        "Kuala Lumpur": { method: "Monorail/LRT/MRT", priceRange: "RM 10 - RM 30 / day", description: "Comprehensive coverage of city centre." },
        "Penang": { method: "Rapid Penang Bus + Grab", priceRange: "RM 30 - RM 60 / day", description: "Buses cover most areas, but Grab is faster." },
        "Perak": { method: "Grab / Taxi", priceRange: "RM 50 - RM 100 / day", description: "Public transport is limited; e-hailing is recommended." }
    },
    "car": {
        "default": { method: "Own Vehicle", priceRange: "Fuel + Tolls (~RM 50/day)", description: "Flexible travel at your own pace." }
    }
};

export const DEFAULT_ACTIVITIES = [
    { id: 'd1', name: "Local Kopitiam Breakfast", type: "food", category: "Breakfast", price: 15, rating: 4.6, image: "https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Classic Malaysian breakfast with Kaya Toast and Teh Tarik." }
];

export const STATE_COORDS = {
    "Kuala Lumpur": [3.1390, 101.6869],
    "Selangor": [3.0738, 101.5183],
    "Penang": [5.4141, 100.3288],
    "Perak": [4.5975, 101.0901]
};

// Social Feed Posts (Food & Scenery Only)
export const FEED_POSTS = [
    {
        id: 1,
        type: 'food',
        user: { name: 'Sarah Tan', avatar: 'https://i.pravatar.cc/150?img=5' },
        placeName: 'Village Park Restaurant',
        location: 'Petaling Jaya, Selangor',
        state: 'Selangor',
        description: 'Best nasi lemak in KL! The sambal is perfectly spicy and the chicken is crispy. Queue starts early but totally worth it!',
        image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        reviewCount: 1245,
        likes: 324,
        saves: 89,
        comments: 45,
        timestamp: '2 hours ago'
    },
    {
        id: 2,
        type: 'scenery',
        user: { name: 'Ahmad Razak', avatar: 'https://i.pravatar.cc/150?img=12' },
        placeName: 'Cameron Highlands Tea Plantation',
        location: 'Tanah Rata, Pahang',
        state: 'Pahang',
        description: 'Stunning morning view of the tea fields! Perfect temperature at 6am. Bring a jacket, it gets chilly up here.',
        image: 'https://images.unsplash.com/photo-1564759224907-65b945b4a401?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        reviewCount: 892,
        likes: 567,
        saves: 234,
        comments: 78,
        timestamp: '5 hours ago'
    },
    {
        id: 3,
        type: 'food',
        user: { name: 'Lisa Wong', avatar: 'https://i.pravatar.cc/150?img=9' },
        placeName: 'Jonker Street Night Market',
        location: 'Melaka City, Melaka',
        state: 'Melaka',
        description: 'Amazing cendol and satay celup! Friday night market has the best variety of street food. Try the chicken rice balls!',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        rating: 4.7,
        reviewCount: 2103,
        likes: 892,
        saves: 456,
        comments: 123,
        timestamp: '1 day ago'
    },
    {
        id: 4,
        type: 'scenery',
        user: { name: 'Raj Kumar', avatar: 'https://i.pravatar.cc/150?img=14' },
        placeName: 'Batu Caves',
        location: 'Gombak, Selangor',
        state: 'Selangor',
        description: 'Rainbow stairs are Instagram perfect! Come early to avoid crowds. The temple caves are beautiful and culturally rich.',
        image: 'https://images.unsplash.com/photo-1544013919-4bb5cb5b77ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        rating: 4.6,
        reviewCount: 3421,
        likes: 1234,
        saves: 678,
        comments: 234,
        timestamp: '2 days ago'
    },
    {
        id: 5,
        type: 'food',
        user: { name: 'Nurul Aina', avatar: 'https://i.pravatar.cc/150?img=20' },
        placeName: 'Restoran Rebung Chef Ismail',
        location: 'Ampang, Kuala Lumpur',
        state: 'Kuala Lumpur',
        description: 'Traditional Malay cuisine at its finest! The rendang is heavenly. Buffet style with over 40 dishes. Book in advance!',
        image: 'https://images.unsplash.com/photo-1596040033229-a0b8b5ffb2a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        reviewCount: 876,
        likes: 445,
        saves: 198,
        comments: 67,
        timestamp: '3 days ago'
    },
    {
        id: 6,
        type: 'scenery',
        user: { name: 'David Lim', avatar: 'https://i.pravatar.cc/150?img=8' },
        placeName: 'Penang Street Art',
        location: 'Georgetown, Penang',
        state: 'Penang',
        description: 'Found this amazing mural walk! Kids on Bicycle is my favorite. The old town has so much character and history.',
        image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        reviewCount: 1567,
        likes: 789,
        saves: 345,
        comments: 156,
        timestamp: '4 days ago'
    }
];
