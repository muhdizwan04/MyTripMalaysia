import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Star, DollarSign, X } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useCurrency } from '../context/CurrencyContext';

const FOOD_PLACES = [
    { id: 1, name: "Village Park Nasi Lemak", location: "Petaling Jaya", state: "Selangor", rating: 4.8, price: 25, image: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=500&q=80", category: "Local", description: "Famous nasi lemak with crispy chicken" },
    { id: 2, name: "Jalan Alor Night Market", location: "Bukit Bintang", state: "Kuala Lumpur", rating: 4.7, price: 15, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80", category: "Street Food", description: "Vibrant street food paradise" },
    { id: 3, name: "Char Kuey Teow Lorong Selamat", location: "George Town", state: "Penang", rating: 4.8, price: 12, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=500&q=80", category: "Local", description: "Best char kuey teow in Penang" },
    { id: 4, name: "Hakka Restaurant", location: "Ipoh", state: "Perak", rating: 4.6, price: 30, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80", category: "Restaurant", description: "Authentic Hakka cuisine" },
    { id: 5, name: "Satay Celup Capitol", location: "Malacca City", state: "Melaka", rating: 4.5, price: 20, image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=500&q=80", category: "Local", description: "Famous satay celup hotpot" },
    { id: 6, name: "Kim Lian Kee", location: "Kuala Lumpur", state: "Kuala Lumpur", rating: 4.6, price: 18, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80", category: "Local", description: "Iconic hokkien mee since 1927" },
    { id: 7, name: "Oceanview Seafood", location: "Kuantan", state: "Pahang", rating: 4.7, price: 50, image: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=500&q=80", category: "Seafood", description: "Fresh seafood by the sea" },
    { id: 8, name: "Little India Banana Leaf", location: "Johor Bahru", state: "Johor", rating: 4.5, price: 15, image: "https://images.unsplash.com/photo-1585937421612-70e008356f3a?auto=format&fit=crop&w=500&q=80", category: "Indian", description: "Authentic South Indian cuisine" },
];

export default function FoodPage() {
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedState, setSelectedState] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSpot, setSelectedSpot] = useState(null);

    const filteredPlaces = FOOD_PLACES.filter(place => {
        if (selectedState !== 'all' && place.state !== selectedState) return false;
        if (selectedCategory !== 'all' && place.category !== selectedCategory) return false;
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            return place.name.toLowerCase().includes(query) ||
                place.location.toLowerCase().includes(query) ||
                place.description.toLowerCase().includes(query);
        }
        return true;
    });

    return (
        <div className="min-h-screen bg-batik pb-24">
            <div className="max-w-md mx-auto px-6 py-10">
                <div className="mb-8">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="text-sm font-bold">Back</span>
                    </button>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">Find Food</h1>
                    <p className="text-sm text-muted-foreground font-medium">Discover amazing food across Malaysia</p>
                </div>

                {/* Search & Filters */}
                <div className="mb-6 space-y-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search food places..."
                            className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-muted/50 focus:border-primary outline-none font-bold text-sm bg-white"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="text-sm font-black px-4 py-3 rounded-2xl border-2 border-muted/50 bg-white outline-none">
                            <option value="all">All States</option>
                            <option value="Kuala Lumpur">KL</option>
                            <option value="Selangor">Selangor</option>
                            <option value="Penang">Penang</option>
                            <option value="Johor">Johor</option>
                            <option value="Melaka">Melaka</option>
                            <option value="Perak">Perak</option>
                            <option value="Pahang">Pahang</option>
                        </select>

                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="text-sm font-black px-4 py-3 rounded-2xl border-2 border-muted/50 bg-white outline-none">
                            <option value="all">All Types</option>
                            <option value="Local">Local</option>
                            <option value="Street Food">Street Food</option>
                            <option value="Restaurant">Restaurant</option>
                            <option value="Seafood">Seafood</option>
                            <option value="Indian">Indian</option>
                        </select>
                    </div>
                </div>

                {/* Results */}
                <div className="space-y-4">
                    {filteredPlaces.length > 0 ? (
                        filteredPlaces.map((place) => (
                            <Card
                                key={place.id}
                                onClick={() => setSelectedSpot(place)}
                                className="overflow-hidden cursor-pointer group border-2 border-white/50 hover:shadow-xl transition-all rounded-[28px]"
                            >
                                <CardContent className="p-0">
                                    <div className="flex gap-4">
                                        <div className="w-28 h-28 shrink-0 relative overflow-hidden">
                                            <img src={place.image} alt={place.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-1 py-3 pr-4">
                                            <h4 className="font-black text-sm mb-1">{place.name}</h4>
                                            <div className="flex items-center gap-1 mb-1">
                                                <MapPin className="h-3 w-3 text-primary" />
                                                <span className="text-[10px] font-bold text-muted-foreground">{place.location}, {place.state}</span>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground mb-2">{place.description}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                                    <span className="text-[11px] font-black">{place.rating}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="h-3 w-3 text-primary" />
                                                    <span className="text-[11px] font-black text-primary">{formatPrice(place.price)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-muted/10 rounded-3xl">
                            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                            <p className="text-muted-foreground font-bold">No food places found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Food Detail Modal */}
            {selectedSpot && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="relative h-64">
                            <img src={selectedSpot.image} alt={selectedSpot.name} className="w-full h-full object-cover" />
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={() => setSelectedSpot(null)}
                                    className="h-10 w-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                                >
                                    <X className="h-5 w-5 text-foreground" />
                                </button>
                            </div>
                            <div className="absolute top-4 left-4 bg-primary text-white text-xs font-black px-3 py-1 rounded-full uppercase shadow-lg">
                                {selectedSpot.category}
                            </div>
                        </div>
                        <div className="p-6">
                            <h2 className="text-2xl font-black mb-2 tracking-tight">{selectedSpot.name}</h2>
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span className="text-sm font-bold text-muted-foreground">{selectedSpot.location}, {selectedSpot.state}</span>
                            </div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                    <span className="font-black text-sm">{selectedSpot.rating}</span>
                                </div>
                                <div className="flex items-center gap-1 bg-primary/5 px-2 py-1 rounded-lg border border-primary/10">
                                    <DollarSign className="h-4 w-4 text-primary" />
                                    <span className="font-black text-sm text-primary">{formatPrice(selectedSpot.price)}</span>
                                </div>
                            </div>
                            <p className="text-sm leading-relaxed text-muted-foreground mb-8 font-medium">{selectedSpot.description}</p>
                            <Button
                                onClick={() => navigate('/trips/create')}
                                className="w-full h-14 rounded-2xl font-black uppercase tracking-wider shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
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
