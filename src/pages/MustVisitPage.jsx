import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Star, DollarSign } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { useCurrency } from '../context/CurrencyContext';

const MUST_VISIT_PLACES = [
    { id: 1, name: "Batu Caves", location: "Gombak", state: "Selangor", rating: 4.6, price: 0, category: "Scenery", image: "https://images.unsplash.com/photo-1544013919-4bb5cb5b77ef?auto=format&fit=crop&w=500&q=80", description: "Iconic limestone caves with Hindu shrines" },
    { id: 2, name: "Petronas Twin Towers", location: "KLCC", state: "Kuala Lumpur", rating: 4.9, price: 85, category: "Scenery", image: "https://images.unsplash.com/photo-1508062878650-88b52897f298?auto=format&fit=crop&w=500&q=80", description: "World-famous twin skyscrapers" },
    { id: 3, name: "Sunway Lagoon", location: "Subang Jaya", state: "Selangor", rating: 4.5, price: 180, category: "Theme Park", image: "https://images.unsplash.com/photo-1577894947058-fccf3380c8c4?auto=format&fit=crop&w=500&q=80", description: "Water park and theme park" },
    { id: 4, name: "KL Bird Park", location: "Kuala Lumpur", state: "Kuala Lumpur", rating: 4.4, price: 65, category: "Bird Park", image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=500&q=80", description: "World's largest free-flight aviary" },
    { id: 5, name: "National Museum", location: "Kuala Lumpur", state: "Kuala Lumpur", rating: 4.3, price: 5, category: "Museum", image: "https://images.unsplash.com/photo-1595177437642-5ba6d9c5ef5c?auto=format&fit=crop&w=500&q=80", description: "Malaysian history and culture" },
    { id: 6, name: "Cameron Highlands", location: "Cameron Highlands", state: "Pahang", rating: 4.7, price: 0, category: "Scenery", image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=500&q=80", description: "Beautiful tea plantations" },
    { id: 7, name: "Langkawi SkyCab", location: "Langkawi", state: "Kedah", rating: 4.7, price: 95, category: "Activity", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=500&q=80", description: "Cable car with stunning views" },
    { id: 8, name: "Legoland Malaysia", location: "Johor Bahru", state: "Johor", rating: 4.5, price: 220, category: "Theme Park", image: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=500&q=80", description: "Lego-themed amusement park" },
    { id: 9, name: "Penang National Park", location: "George Town", state: "Penang", rating: 4.6, price: 0, category: "Activity", image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=500&q=80", description: "Hiking trails and beaches" },
    { id: 10, name: "Islamic Arts Museum", location: "Kuala Lumpur", state: "Kuala Lumpur", rating: 4.7, price: 14, category: "Museum", image: "https://images.unsplash.com/photo-1554066502-1ca3c75e7e49?auto=format&fit=crop&w=500&q=80", description: "Islamic art collection" },
];

export default function MustVisitPage() {
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedState, setSelectedState] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const filteredPlaces = MUST_VISIT_PLACES.filter(place => {
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
                    <h1 className="text-4xl font-black tracking-tighter mb-2">Must Visit</h1>
                    <p className="text-sm text-muted-foreground font-medium">Explore top attractions across Malaysia</p>
                </div>

                <div className="mb-6 space-y-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search attractions..."
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
                            <option value="Pahang">Pahang</option>
                            <option value="Kedah">Kedah</option>
                        </select>

                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="text-sm font-black px-4 py-3 rounded-2xl border-2 border-muted/50 bg-white outline-none">
                            <option value="all">All Types</option>
                            <option value="Scenery">Scenery</option>
                            <option value="Activity">Activity</option>
                            <option value="Theme Park">Theme Park</option>
                            <option value="Bird Park">Bird Park</option>
                            <option value="Museum">Museum</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredPlaces.length > 0 ? (
                        filteredPlaces.map((place) => (
                            <Card key={place.id} className="overflow-hidden cursor-pointer group border-2 border-white/50 hover:shadow-xl transition-all rounded-[28px]">
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
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                                        <span className="text-[11px] font-black">{place.rating}</span>
                                                    </div>
                                                    <span className="text-[10px] px-2 py-1 bg-primary/10 text-primary rounded-full font-bold">{place.category}</span>
                                                </div>
                                                {place.price > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        <DollarSign className="h-3 w-3 text-primary" />
                                                        <span className="text-[11px] font-black text-primary">{formatPrice(place.price)}</span>
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
                            <p className="text-muted-foreground font-bold">No attractions found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
