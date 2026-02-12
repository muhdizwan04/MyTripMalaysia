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
            duration: 360, isIndoor: false, bestTime: "Morning",
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
            duration: 120, isIndoor: false, bestTime: "Morning",
            reviews: [
                { user: "Emma", rating: 5, text: "272 steps were worth it! The view from the top is great." },
                { user: "Loke", rating: 4, text: "Watch out for the monkeys! They will take your food and bags." },
                { user: "Divya", rating: 5, text: "The architectural colors are stunning since the paint job." }
            ]
        }
    ],
    "Kuala Lumpur": [
        {
            id: 'k1',
            name: "Petronas Twin Towers",
            type: "activity", category: "Landmark", price: 80, rating: 4.9, coords: [3.1579, 101.7123],
            image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            videoUrl: "https://www.youtube.com/embed/V6_yFf3fD8A",
            description: "The world's tallest twin towers. Best viewed at night from KLCC Park. You can walk the Skybridge connecting the two towers.",
            duration: 90, isIndoor: false, bestTime: "Evening"
        }
    ],
    "Penang": [],
    "Melaka": [],
    "Johor": [],
    "Sabah": []
};

export const DESTINATION_INTELLIGENCE = {
    "Selangor": { minDays: 2, suggestedPace: "Balanced", bestFor: ["Families", "Theme Parks"] },
    "Kuala Lumpur": { minDays: 3, suggestedPace: "Packed", bestFor: ["Shopping", "City Sightseeing"] },
    "Penang": { minDays: 3, suggestedPace: "Relaxed", bestFor: ["Food", "Heritage"] },
    "Melaka": { minDays: 2, suggestedPace: "Relaxed", bestFor: ["History", "Food"] },
    "Johor": { minDays: 2, suggestedPace: "Balanced", bestFor: ["Theme Parks", "Shopping"] },
    "Sabah": { minDays: 4, suggestedPace: "Adventure", bestFor: ["Nature", "Hiking"] }
};

export const ITINERARY_RULES = {
    maxActivitiesPerDay: 4,
    minBreakTime: 30, // minutes
    maxTravelTimePerDay: 120, // minutes
    dayStartHour: 9, // 9 AM
    dayEndHour: 22, // 10 PM
    warningThresholds: {
        busyDay: 4, // activities
        expensiveDay: 500, // RM
        travelHeavy: 60 // minutes
    }
};

export const BUDGET_DEFAULTS = {
    foodPerDay: { low: 30, mid: 80, high: 200 },
    transportPerDay: { low: 10, mid: 30, high: 100 },
    miscPerDay: 50
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

export const VIRAL_SPOTS = [
    {
        id: 1,
        name: "Village Park Nasi Lemak",
        location: "Petaling Jaya",
        rating: 4.8,
        price: 25,
        image: "https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tag: "Viral Food",
        description: "Best nasi lemak in KL! The sambal is perfectly spicy and the chicken is crispy. Long queues form early morning but worth the wait."
    },
    {
        id: 2,
        name: "Batu Caves Rainbow Stairs",
        location: "Selangor",
        rating: 4.6,
        price: 0,
        image: "https://images.unsplash.com/photo-1544013919-4bb5cb5b77ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tag: "Must Visit",
        description: "Iconic 272 steps painted in vibrant rainbow colors. Home to Hindu shrines and monkeys. Come early to avoid crowds and heat."
    },
    {
        id: 3,
        name: "Pavilion KL Mall",
        location: "Kuala Lumpur",
        rating: 4.8,
        price: 0,
        image: "https://images.unsplash.com/photo-1582037928769-181f2644ecb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tag: "Shopping",
        description: "Premier shopping destination in Bukit Bintang. Over 450 retail outlets including luxury brands. Great food court and cinema."
    }
];

export const FEATURED_TRIPS = [
    {
        id: 1,
        title: "Foodie's Paradise",
        days: "3 Days",
        states: ["Penang", "Ipoh"],
        price: "RM 450",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tag: "Culinary"
    },
    {
        id: 2,
        title: "Heritage Trail",
        days: "4 Days",
        states: ["Malacca", "Negeri Sembilan"],
        price: "RM 380",
        image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tag: "Culture"
    },
    {
        id: 3,
        title: "Island Escape",
        days: "5 Days",
        states: ["Sabah", "Langkawi"],
        price: "RM 1200",
        image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tag: "Relaxation"
    }
];

export const MOCK_ITINERARIES = {
    1: [ // Foodie's Paradise
        {
            day: 1,
            state: 'Penang',
            activities: [
                { id: 'p1', name: 'Roti Canai Transfer Road', category: 'Breakfast', type: 'food', time: '08:00', price: 10, coords: [5.4200, 100.3300] },
                { id: 'p2', name: 'Pinang Peranakan Mansion', category: 'Culture', type: 'activity', time: '10:30', price: 25, coords: [5.4180, 100.3400] },
                { id: 'p3', name: 'Penang Road Famous Teochew Chendul', category: 'Lunch', type: 'food', time: '13:00', price: 8, coords: [5.4170, 100.3300] },
                { id: 'p4', name: 'Clan Jetties', category: 'Sightseeing', type: 'activity', time: '16:00', price: 0, coords: [5.4120, 100.3400] },
                { id: 'p5', name: 'Gurney Drive Hawker Centre', category: 'Dinner', type: 'food', time: '19:30', price: 30, coords: [5.4400, 100.3000] }
            ]
        },
        {
            day: 2,
            state: 'Penang',
            activities: [
                { id: 'p6', name: 'Toh Soon Cafe', category: 'Breakfast', type: 'food', time: '08:30', price: 12, coords: [5.4185, 100.3320] },
                { id: 'p7', name: 'Penang Hill', category: 'Nature', type: 'activity', time: '10:00', price: 30, coords: [5.4080, 100.2770] },
                { id: 'p8', name: 'Laksa at Ayer Itam', category: 'Lunch', type: 'food', time: '13:30', price: 15, coords: [5.4010, 100.2780] },
                { id: 'p9', name: 'Batu Ferringhi Beach', category: 'Relaxation', type: 'activity', time: '17:00', price: 0, coords: [5.4670, 100.2500] }
            ]
        },
        {
            day: 3,
            state: 'Ipoh',
            activities: [
                { id: 'i1', name: 'Nam Heong White Coffee', category: 'Breakfast', type: 'food', time: '09:00', price: 15, coords: [4.5950, 101.0790] },
                { id: 'i2', name: 'Kek Lok Tong Cave Temple', category: 'Culture', type: 'activity', time: '11:00', price: 0, coords: [4.5600, 101.1200] },
                { id: 'i3', name: 'Nasi Ganja Yong Suan', category: 'Lunch', type: 'food', time: '13:30', price: 20, coords: [4.5980, 101.0800] },
                { id: 'i4', name: 'Concubine Lane', category: 'Shopping', type: 'shopping', time: '15:30', price: 0, coords: [4.5960, 101.0780] }
            ]
        }
    ],
    2: [ // Heritage Trail
        {
            day: 1,
            state: 'Malacca',
            activities: [
                { id: 'm1', name: 'The Daily Fix Cafe', category: 'Breakfast', type: 'food', time: '09:00', price: 25, coords: [2.1950, 102.2490] },
                { id: 'm2', name: 'Dutch Square (Red Square)', category: 'History', type: 'activity', time: '10:30', price: 0, coords: [2.1930, 102.2480] },
                { id: 'm3', name: 'Chicken Rice Ball', category: 'Lunch', type: 'food', time: '13:00', price: 18, coords: [2.1945, 102.2485] },
                { id: 'm4', name: 'A Famosa Fort', category: 'History', type: 'activity', time: '15:00', price: 0, coords: [2.1920, 102.2500] },
                { id: 'm5', name: 'Jonker Walk Night Market', category: 'Dinner', type: 'food', time: '19:00', price: 40, coords: [2.1950, 102.2480] }
            ]
        },
        {
            day: 2,
            state: 'Malacca',
            activities: [
                { id: 'm6', name: 'Baba Nyonya Heritage Museum', category: 'Culture', type: 'activity', time: '10:00', price: 16, coords: [2.1960, 102.2470] },
                { id: 'm7', name: 'Nyonya Laksa', category: 'Lunch', type: 'food', time: '12:30', price: 20, coords: [2.1970, 102.2480] },
                { id: 'm8', name: 'Melaka River Cruise', category: 'Sightseeing', type: 'activity', time: '17:30', price: 30, coords: [2.1940, 102.2490] }
            ]
        },
        {
            day: 3,
            state: 'Negeri Sembilan',
            activities: [
                { id: 'n1', name: 'Seremban Siew Pao', category: 'Snack', type: 'food', time: '10:00', price: 15, coords: [2.7200, 101.9400] },
                { id: 'n2', name: 'Centipede Temple', category: 'Culture', type: 'activity', time: '11:30', price: 0, coords: [2.7300, 101.9500] },
                { id: 'n3', name: 'Masak Lemak Cili Api', category: 'Lunch', type: 'food', time: '13:30', price: 25, coords: [2.7250, 101.9450] },
                { id: 'n4', name: 'Port Dickson Beach', category: 'Relaxation', type: 'activity', time: '16:00', price: 0, coords: [2.5200, 101.7900] }
            ]
        }
    ],
    3: [ // Island Escape
        {
            day: 1,
            state: 'Sabah',
            activities: [
                { id: 'sb1', name: 'Gaya Street Sunday Market', category: 'Shopping', type: 'shopping', time: '08:00', price: 0, coords: [5.9830, 116.0770] },
                { id: 'sb2', name: 'Tunku Abdul Rahman Park', category: 'Nature', type: 'activity', time: '10:00', price: 50, coords: [5.9600, 116.0000] },
                { id: 'sb3', name: 'Welcome Seafood Restaurant', category: 'Dinner', type: 'food', time: '19:00', price: 60, coords: [5.9800, 116.0700] }
            ]
        },
        {
            day: 2,
            state: 'Sabah',
            activities: [
                { id: 'sb4', name: 'Mari Mari Cultural Village', category: 'Culture', type: 'activity', time: '09:00', price: 100, coords: [5.9800, 116.1500] },
                { id: 'sb5', name: 'Soto Makassar', category: 'Lunch', type: 'food', time: '13:00', price: 15, coords: [5.9850, 116.0800] },
                { id: 'sb6', name: 'Tanjung Aru Sunset', category: 'Scenery', type: 'activity', time: '17:30', price: 0, coords: [5.9480, 116.0450] }
            ]
        },
        {
            day: 3,
            state: 'Langkawi',
            activities: [
                { id: 'l1', name: 'Langkawi SkyCab', category: 'Adventure', type: 'activity', time: '09:30', price: 85, coords: [6.3700, 99.6700] },
                { id: 'l2', name: 'Laksa Langkawi', category: 'Lunch', type: 'food', time: '13:00', price: 12, coords: [6.3500, 99.6800] },
                { id: 'l3', name: 'Pantai Cenang', category: 'Relaxation', type: 'activity', time: '16:00', price: 0, coords: [6.2900, 99.7300] }
            ]
        }
    ]
};

export const FOOD_PLACES = [
    { id: 1, name: "Village Park Nasi Lemak", location: "Petaling Jaya", state: "Selangor", rating: 4.8, price: 25, image: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=500&q=80", category: "Local", description: "Famous nasi lemak with crispy chicken" },
    { id: 2, name: "Jalan Alor Night Market", location: "Bukit Bintang", state: "Kuala Lumpur", rating: 4.7, price: 15, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80", category: "Street Food", description: "Vibrant street food paradise" },
    { id: 3, name: "Char Kuey Teow Lorong Selamat", location: "George Town", state: "Penang", rating: 4.8, price: 12, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=500&q=80", category: "Local", description: "Best char kuey teow in Penang" },
    { id: 4, name: "Hakka Restaurant", location: "Ipoh", state: "Perak", rating: 4.6, price: 30, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80", category: "Restaurant", description: "Authentic Hakka cuisine" },
    { id: 5, name: "Satay Celup Capitol", location: "Malacca City", state: "Melaka", rating: 4.5, price: 20, image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=500&q=80", category: "Local", description: "Famous satay celup hotpot" },
    { id: 6, name: "Kim Lian Kee", location: "Kuala Lumpur", state: "Kuala Lumpur", rating: 4.6, price: 18, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80", category: "Local", description: "Iconic hokkien mee since 1927" },
    { id: 7, name: "Oceanview Seafood", location: "Kuantan", state: "Pahang", rating: 4.7, price: 50, image: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=500&q=80", category: "Seafood", description: "Fresh seafood by the sea" },
    { id: 8, name: "Little India Banana Leaf", location: "Johor Bahru", state: "Johor", rating: 4.5, price: 15, image: "https://images.unsplash.com/photo-1585937421612-70e008356f3a?auto=format&fit=crop&w=500&q=80", category: "Indian", description: "Authentic South Indian cuisine" }
];

export const MUST_VISIT_PLACES = [
    {
        id: 'mv1', name: "Petronas Twin Towers", description: "Tallest twin towers in the world and the iconic landmark of Malaysia.",
        state: "Kuala Lumpur", location: "KLCC, Kuala Lumpur", category: "Landmark", rating: 4.8, price: 98,
        image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800"
    },
    {
        id: 'mv2', name: "Batu Caves", description: "A limestone hill that has a series of caves and cave temples.",
        state: "Selangor", location: "Gombak, Selangor", category: "Culture", rating: 4.7, price: 0,
        image: "https://images.unsplash.com/photo-1568603681498-844517228896?auto=format&fit=crop&w=800"
    },
    {
        id: 'mv3', name: "Sunway Lagoon", description: "Multi-themed amusement and water park for total fun.",
        state: "Selangor", location: "Subang Jaya, Selangor", category: "Entertainment", rating: 4.6, price: 220,
        image: "https://images.unsplash.com/photo-1542823617-6cb566580998?auto=format&fit=crop&w=800"
    },
    {
        id: 'mv4', name: "Penang Hill", description: "Cool air and breathtaking views of George Town from the peak.",
        state: "Penang", location: "Air Itam, Penang", category: "Nature", rating: 4.7, price: 30,
        image: "https://images.unsplash.com/photo-1513413157580-73895e631d87?auto=format&fit=crop&w=800"
    },
    {
        id: 'mv5', name: "A Famosa", description: "Portuguese fortress ruins in the heart of the historical city.",
        state: "Melaka", location: "Jalan Kota, Melaka", category: "History", rating: 4.6, price: 0,
        image: "https://images.unsplash.com/photo-1629196883210-90c74ee34d90?auto=format&fit=crop&w=800"
    },
    {
        id: 'mv6', name: "Legoland Malaysia", description: "First Legoland theme park in Asia with rides and a water park.",
        state: "Johor", location: "Iskandar Puteri, Johor", category: "Entertainment", rating: 4.7, price: 249,
        image: "https://images.unsplash.com/photo-1531315630201-bb15fbeb8653?auto=format&fit=crop&w=800"
    }
];

export const SHOPPING_PLACES = [
    {
        id: 'sh1', name: "Pavilion KL", description: "Award-winning shopping mall with an extensive range of luxury brands.",
        state: "Kuala Lumpur", location: "Bukit Bintang, Kuala Lumpur", category: "Luxury", rating: 4.9, price: 0,
        image: "https://images.unsplash.com/photo-1582234033100-8451f28b2656?auto=format&fit=crop&w=800",
        hours: "10 AM - 10 PM"
    },
    {
        id: 'sh2', name: "Suria KLCC", description: "Premier shopping mall located at the foot of the Petronas Twin Towers.",
        state: "Kuala Lumpur", location: "Kuala Lumpur City Centre", category: "Family", rating: 4.7, price: 0,
        image: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=800",
        hours: "10 AM - 10 PM"
    },
    {
        id: 'sh3', name: "Gurney Plaza", description: "George Town's premier lifestyle shopping destination.",
        state: "Penang", location: "Gurney Drive, Penang", category: "Lifestyle", rating: 4.7, price: 0,
        image: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=800",
        hours: "10 AM - 10 PM"
    },
    {
        id: 'sh4', name: "Mid Valley Megamall", description: "One of the largest shopping malls in Southeast Asia.",
        state: "Kuala Lumpur", location: "Mid Valley City", category: "Family", rating: 4.6, price: 0,
        image: "https://images.unsplash.com/photo-1555529733-0e670560f7e1?auto=format&fit=crop&w=800",
        hours: "10 AM - 10 PM"
    }
];
