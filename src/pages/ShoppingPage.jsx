import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Star, Clock } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

const SHOPPING_PLACES = [
    { id: 1, name: "Pavilion KL", location: "Bukit Bintang", state: "Kuala Lumpur", rating: 4.8, type: "Mall", category: "Luxury", image: "https://images.unsplash.com/photo-1582037928769-181f2644ecb7?auto=format&fit=crop&w=500&q=80", hours: "10 AM - 10 PM" },
    { id: 2, name: "Sunway Pyramid", location: "Subang Jaya", state: "Selangor", rating: 4.7, type: "Mall", category: "Family", image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=500&q=80", hours: "10 AM - 10 PM" },
    { id: 3, name: "Jonker Street", location: "Malacca City", state: "Melaka", rating: 4.6, type: "Street", category: "Heritage", image: "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&w=500&q=80", hours: "9 AM - 6 PM" },
    { id: 4, name: "Queensbay Mall", location: "Bayan Lepas", state: "Penang", rating: 4.5, type: "Mall", category: "Electronics", image: "https://images.unsplash.com/photo-1519500099198-c185fba3b7e5?auto=format&fit=crop&w=500&q=80", hours: "10 AM - 10 PM" },
    { id: 5, name: "The Curve", location: "Petaling Jaya", state: "Selangor", rating: 4.6, type: "Mall", category: "Lifestyle", image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=500&q=80", hours: "10 AM - 10 PM" },
    { id: 6, name: "Komtar", location: "George Town", state: "Penang", rating: 4.4, type: "Mall", category: "Local", image: "https://images.unsplash.com/photo-1594206801227-c28ddb73a5e3?auto=format&fit=crop&w=500&q=80", hours: "9 AM - 9 PM" },
    { id: 7, name: "IOI City Mall", location: "Putrajaya", state: "Selangor", rating: 4.7, type: "Mall", category: "Family", image: "https://images.unsplash.com/photo-1567958451986-2de427a4a0be?auto=format&fit=crop&w=500&q=80", hours: "10 AM - 10 PM" },
    { id: 8, name: "Aeon Tebrau City", location: "Johor Bahru", state: "Johor", rating: 4.5, type: "Mall", category: "Hypermarket", image: "https://images.unsplash.com/photo-1580613034299-b1043f5d8ee6?auto=format&fit=crop&w=500&q=80", hours: "10 AM - 10 PM" },
];

export default function ShoppingPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedState, setSelectedState] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const filteredPlaces = SHOPPING_PLACES.filter(place => {
        if (selectedState !== 'all' && place.state !== selectedState) return false;
        if (selectedCategory !== 'all' && place.category !== selectedCategory) return false;
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            return place.name.toLowerCase().includes(query) || place.location.toLowerCase().includes(query);
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
                    <h1 className="text-4xl font-black tracking-tighter mb-2">Shopping</h1>
                    <p className="text-sm text-muted-foreground font-medium">Find the best malls and shopping streets</p>
                </div>

                <div className="mb-6 space-y-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search shopping places..."
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
                        </select>

                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="text-sm font-black px-4 py-3 rounded-2xl border-2 border-muted/50 bg-white outline-none">
                            <option value="all">All Types</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Family">Family</option>
                            <option value="Heritage">Heritage</option>
                            <option value="Lifestyle">Lifestyle</option>
                            <option value="Hypermarket">Hypermarket</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredPlaces.length > 0 ? (
                        filteredPlaces.map((place) => (
                            <Card
                                key={place.id}
                                onClick={() => navigate(`/shopping/mall/${place.id}`)}
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
                                            <div className="flex items-center gap-1 mb-2">
                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-[10px] text-muted-foreground">{place.hours}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                                    <span className="text-[11px] font-black">{place.rating}</span>
                                                </div>
                                                <span className="text-[10px] px-2 py-1 bg-primary/10 text-primary rounded-full font-bold">{place.category}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-muted/10 rounded-3xl">
                            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                            <p className="text-muted-foreground font-bold">No shopping places found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
