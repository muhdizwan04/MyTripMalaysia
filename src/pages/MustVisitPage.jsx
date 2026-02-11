import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Star, DollarSign } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { useCurrency } from '../context/CurrencyContext';
import { fetchMustVisitAttractions } from '../lib/api';

export default function MustVisitPage() {
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedState, setSelectedState] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedPlace, setSelectedPlace] = useState(null);

    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const loadPlaces = async () => {
            try {
                setLoading(true);
                const data = await fetchMustVisitAttractions();
                console.log('Fetched must visit attractions:', data);
                setPlaces(data);
            } catch (error) {
                console.error('Failed to load must visit attractions:', error);
            } finally {
                setLoading(false);
            }
        };
        loadPlaces();
    }, []);

    const filteredPlaces = places.filter(place => {
        // Handle various field names for location and category
        const placeLocation = (place.state || place.location || place.location_name || '').toLowerCase();
        const placeCategory = (place.category || place.type || '').toLowerCase();

        const stateMatch = selectedState === 'all' || placeLocation === selectedState.toLowerCase() ||
            (selectedState === 'Kuala Lumpur' && placeLocation === 'kl') ||
            (selectedState === 'kl' && placeLocation === 'kuala lumpur');

        const categoryMatch = selectedCategory === 'all' || placeCategory === selectedCategory.toLowerCase();

        if (!stateMatch || !categoryMatch) return false;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            return (place.name || '').toLowerCase().includes(query) ||
                placeLocation.includes(query) ||
                (place.description || '').toLowerCase().includes(query);
        }
        return true;
    });

    // Detail Modal
    const DetailModal = ({ place, onClose }) => {
        if (!place) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                    <div className="relative h-64">
                        <img
                            src={place.image_url || place.image}
                            alt={place.name}
                            className="w-full h-full object-cover"
                        />
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors backdrop-blur-md"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                        <div className="absolute top-4 left-4 bg-primary text-white text-xs font-black px-3 py-1 rounded-full uppercase shadow-lg">
                            {place.category || place.type}
                        </div>
                    </div>
                    <div className="p-6">
                        <h2 className="text-2xl font-black mb-2 tracking-tight">{place.name}</h2>
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="text-sm font-bold text-muted-foreground">{place.location || place.location_name}, {place.state || place.location_name}</span>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                <span className="font-black text-sm">{place.rating}</span>
                            </div>
                            {place.price > 0 ? (
                                <div className="flex items-center gap-1 bg-primary/5 px-2 py-1 rounded-lg border border-primary/10">
                                    <DollarSign className="h-4 w-4 text-primary" />
                                    <span className="font-black text-sm text-primary">{formatPrice(place.price)}</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                                    <span className="font-black text-sm text-green-600">Free</span>
                                </div>
                            )}
                        </div>

                        <p className="text-sm text-gray-600 mb-8 leading-relaxed font-medium">
                            {place.description}
                        </p>

                        <button
                            onClick={() => navigate('/trips/create')}
                            className="w-full h-14 bg-primary text-white rounded-2xl font-black uppercase tracking-wider shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center justify-center hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Add to Trip
                        </button>
                    </div>
                </div>
            </div>
        );
    };

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
                            <option value="Melaka">Melaka</option>
                            <option value="Gombak">Gombak</option>
                        </select>

                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="text-sm font-black px-4 py-3 rounded-2xl border-2 border-muted/50 bg-white outline-none">
                            <option value="all">All Types</option>
                            <option value="Landmark">Landmark</option>
                            <option value="Nature">Nature</option>
                            <option value="Culture">Culture</option>
                            <option value="Activity">Activity</option>
                            <option value="Theme Park">Theme Park</option>
                            <option value="Bird Park">Bird Park</option>
                            <option value="Museum">Museum</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 text-center">
                        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-muted-foreground font-bold">Loading attractions...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredPlaces.length > 0 ? (
                            filteredPlaces.map((place) => (
                                <Card
                                    key={place.id}
                                    onClick={() => setSelectedPlace(place)}
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
                                                        {(place.state && place.state !== place.location) ? `, ${place.state}` : ''}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground mb-2 line-clamp-2">{place.description}</p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-1">
                                                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                                            <span className="text-[11px] font-black">{place.rating}</span>
                                                        </div>
                                                        <span className="text-[10px] px-2 py-1 bg-primary/10 text-primary rounded-full font-bold">{place.category || place.type}</span>
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
                )}

                {/* Detail Modal */}
                {selectedPlace && (
                    <DetailModal place={selectedPlace} onClose={() => setSelectedPlace(null)} />
                )}
            </div>
        </div>
    );
}
