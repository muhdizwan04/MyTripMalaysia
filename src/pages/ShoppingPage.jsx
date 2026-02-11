import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Star, Clock } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { fetchMalls } from '../lib/api';

export default function ShoppingPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedState, setSelectedState] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const [malls, setMalls] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch malls on mount
    useEffect(() => {
        const loadMalls = async () => {
            try {
                setLoading(true);
                const data = await fetchMalls();
                setMalls(data);
            } catch (error) {
                console.error('Failed to load malls:', error);
            } finally {
                setLoading(false);
            }
        };
        loadMalls();
    }, []);

    const filteredPlaces = malls.filter(place => {
        const locationText = (place.state || place.location || '').toLowerCase();
        const typeText = (place.type || '').toLowerCase();

        if (selectedState !== 'all' && locationText.indexOf(selectedState.toLowerCase()) === -1) return false;
        if (selectedCategory !== 'all' && typeText !== selectedCategory.toLowerCase()) return false;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const name = (place.name || '').toLowerCase();
            const location = (place.location || '').toLowerCase();
            return name.includes(query) || location.includes(query);
        }
        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-batik flex items-center justify-center">
                <p className="text-xl font-bold animate-pulse">Loading shopping places...</p>
            </div>
        );
    }

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

                {/* Filters */}
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

                {/* List */}
                <div className="space-y-4">
                    {filteredPlaces.length > 0 ? (
                        filteredPlaces.map((place) => (
                            <Card
                                key={place.id}
                                onClick={() => navigate(`/shopping/mall/${place.id}`, { state: { mall: place } })}
                                className="overflow-hidden cursor-pointer group border-2 border-white/50 hover:shadow-xl transition-all rounded-[28px]"
                            >
                                <CardContent className="p-0">
                                    <div className="flex gap-4">
                                        <div className="w-28 h-28 shrink-0 relative overflow-hidden">
                                            <img src={place.image_url || place.image} alt={place.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-1 py-3 pr-4">
                                            <h4 className="font-black text-sm mb-1">{place.name}</h4>
                                            <div className="flex items-center gap-1 mb-1">
                                                <MapPin className="h-3 w-3 text-primary" />
                                                <span className="text-[10px] font-bold text-muted-foreground">
                                                    {place.location || place.location_name}
                                                    {place.state ? `, ${place.state}` : ''}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 mb-2">
                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-[10px] text-muted-foreground">{place.hours || '10 AM - 10 PM'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                                    <span className="text-[11px] font-black">{place.rating || 0}</span>
                                                </div>
                                                <span className="text-[10px] px-2 py-1 bg-primary/10 text-primary rounded-full font-bold">{place.type || place.category || 'Mall'}</span>
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
