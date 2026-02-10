import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, DollarSign, Search, Filter, X } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useCurrency } from '../context/CurrencyContext';

const ALL_TRENDING_SPOTS = [
    {
        id: 1,
        name: "Village Park Nasi Lemak",
        location: "Petaling Jaya, Selangor",
        rating: 4.8,
        price: 25,
        image: "https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tag: "Viral Food",
        category: "food",
        description: "Best nasi lemak in KL! The sambal is perfectly spicy and the chicken is crispy. Long queues form early morning but worth the wait."
    },
    {
        id: 2,
        name: "Batu Caves Rainbow Stairs",
        location: "Gombak, Selangor",
        rating: 4.6,
        price: 0,
        image: "https://images.unsplash.com/photo-1544013919-4bb5cb5b77ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tag: "Must Visit",
        category: "scenery",
        description: "Iconic 272 steps painted in vibrant rainbow colors. Home to Hindu shrines and monkeys. Come early to avoid crowds and heat."
    },
    {
        id: 3,
        name: "Pavilion KL Mall",
        location: "Bukit Bintang, Kuala Lumpur",
        rating: 4.8,
        price: 0,
        image: "https://images.unsplash.com/photo-1582037928769-181f2644ecb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tag: "Shopping",
        category: "shopping",
        description: "Premier shopping destination in Bukit Bintang. Over 450 retail outlets including luxury brands. Great food court and cinema."
    },
    {
        id: 4,
        name: "Jalan Alor Night Market",
        location: "Bukit Bintang, Kuala Lumpur",
        rating: 4.7,
        price: 15,
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tag: "Street Food",
        category: "food",
        description: "Famous street food paradise! Try durian, BBQ chicken wings, satay, and fresh seafood. Vibrant atmosphere every night."
    },
    {
        id: 5,
        name: "Petronas Twin Towers",
        location: "KLCC, Kuala Lumpur",
        rating: 4.9,
        price: 85,
        image: "https://images.unsplash.com/photo-1508062878650-88b52897f298?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tag: "Iconic",
        category: "scenery",
        description: "World-famous twin skyscrapers. Visit the skybridge for stunning views. Book tickets in advance online."
    },
    {
        id: 6,
        name: "Penang Street Art",
        location: "George Town, Penang",
        rating: 4.7,
        price: 0,
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tag: "Art & Culture",
        category: "scenery",
        description: "Explore famous murals by Ernest Zacharevic. Kids on Bicycle, Little Girl in Blue, and more. Great for photography!"
    },
    {
        id: 7,
        name: "Char Kuey Teow Lorong Selamat",
        location: "George Town, Penang",
        rating: 4.8,
        price: 12,
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tag: "Local Favorite",
        category: "food",
        description: "Best char kuey teow in Penang! Smoky wok hei, fresh prawns, crispy lard. Very long queues, come early."
    },
    {
        id: 8,
        name: "Cameron Highlands Tea Plantation",
        location: "Cameron Highlands, Pahang",
        rating: 4.6,
        price: 0,
        image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tag: "Nature",
        category: "scenery",
        description: "Beautiful rolling tea hills. Cool climate perfect for escaping heat. Visit BOH tea factory for fresh tea and scones."
    },
    {
        id: 9,
        name: "Malacca Jonker Street",
        location: "Malacca City, Melaka",
        rating: 4.5,
        price: 0,
        image: "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tag: "Heritage",
        category: "shopping",
        description: "Historic street with antique shops, cafes, and night market on weekends. Try chicken rice balls!"
    },
    {
        id: 10,
        name: "Langkawi SkyCab",
        location: "Langkawi, Kedah",
        rating: 4.7,
        price: 95,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tag: "Adventure",
        category: "scenery",
        description: "Cable car to the top of Gunung Machinchang. Breathtaking views, SkyBridge, and SkyDome. Not for those afraid of heights!"
    }
];

export default function TrendingPage() {
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSpot, setSelectedSpot] = useState(null);

    const filteredSpots = ALL_TRENDING_SPOTS.filter(spot => {
        if (selectedCategory !== 'all' && spot.category !== selectedCategory) {
            return false;
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            return (
                spot.name.toLowerCase().includes(query) ||
                spot.location.toLowerCase().includes(query) ||
                spot.description.toLowerCase().includes(query)
            );
        }

        return true;
    });

    return (
        <div className="min-h-screen bg-batik pb-24">
            <div className="max-w-md mx-auto px-6 py-10">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="text-sm font-bold">Back</span>
                    </button>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">Trending Now</h1>
                    <p className="text-sm text-muted-foreground font-medium">
                        Discover the hottest spots in Malaysia
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="mb-6 space-y-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search trending spots..."
                            className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-muted/50 focus:border-primary outline-none font-bold text-sm bg-white"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                        {[
                            { value: 'all', label: 'All' },
                            { value: 'food', label: 'Food' },
                            { value: 'scenery', label: 'Scenery' },
                            { value: 'shopping', label: 'Shopping' }
                        ].map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => setSelectedCategory(cat.value)}
                                className={`shrink-0 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${selectedCategory === cat.value
                                        ? 'bg-primary text-white'
                                        : 'bg-white text-muted-foreground border-2 border-muted/50 hover:border-primary/50'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Trending Spots Grid */}
                <div className="space-y-4">
                    {filteredSpots.length > 0 ? (
                        filteredSpots.map((spot) => (
                            <Card
                                key={spot.id}
                                onClick={() => setSelectedSpot(spot)}
                                className="overflow-hidden cursor-pointer group border-2 border-white/50 hover:shadow-xl hover:shadow-primary/10 transition-all rounded-[28px]"
                            >
                                <CardContent className="p-0">
                                    <div className="flex gap-4">
                                        <div className="w-28 h-28 shrink-0 relative overflow-hidden">
                                            <img src={spot.image} alt={spot.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute top-2 left-2 bg-primary/90 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase">
                                                {spot.tag}
                                            </div>
                                        </div>
                                        <div className="flex-1 py-3 pr-4">
                                            <h4 className="font-black text-sm mb-1 tracking-tight line-clamp-1">{spot.name}</h4>
                                            <div className="flex items-center gap-1 mb-2">
                                                <MapPin className="h-3 w-3 text-primary" />
                                                <span className="text-[10px] font-bold text-muted-foreground line-clamp-1">{spot.location}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                                    <span className="text-[11px] font-black">{spot.rating}</span>
                                                </div>
                                                {spot.price > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        <DollarSign className="h-3 w-3 text-primary" />
                                                        <span className="text-[11px] font-black text-primary">{formatPrice(spot.price)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-muted/10 rounded-3xl">
                            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                            <p className="text-muted-foreground font-bold">No spots found</p>
                            <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filter</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            {selectedSpot && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl">
                        <div className="relative h-64">
                            <img src={selectedSpot.image} alt={selectedSpot.name} className="w-full h-full object-cover" />
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={() => setSelectedSpot(null)}
                                    className="h-10 w-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="absolute top-4 left-4 bg-primary text-white text-xs font-black px-3 py-1 rounded-full uppercase">
                                {selectedSpot.tag}
                            </div>
                        </div>
                        <div className="p-6">
                            <h2 className="text-2xl font-black mb-2">{selectedSpot.name}</h2>
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span className="text-sm font-bold text-muted-foreground">{selectedSpot.location}</span>
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1">
                                    <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                                    <span className="font-black">{selectedSpot.rating}</span>
                                </div>
                                {selectedSpot.price > 0 && (
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="h-4 w-4 text-primary" />
                                        <span className="font-black text-primary">{formatPrice(selectedSpot.price)}</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm leading-relaxed text-muted-foreground mb-6">{selectedSpot.description}</p>
                            <Button
                                onClick={() => navigate('/trips/create')}
                                className="w-full h-14 rounded-2xl"
                            >
                                Add to Trip
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
