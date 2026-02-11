import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Search, MapPin, Compass, Utensils, ShoppingBag, Camera, ChevronRight, Star, User, DollarSign, Sparkles, X } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import FeedPost from '../components/feed/FeedPost';
import { FEED_POSTS, MOCK_ITINERARIES, VIRAL_SPOTS } from '../lib/constants'; // Removed FEATURED_TRIPS
import { fetchAttractions, fetchDestinations, fetchItineraries } from '../lib/api';

export default function Home() {
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedSpot, setSelectedSpot] = useState(null);

    // API State
    const [attractions, setAttractions] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [itineraries, setItineraries] = useState([]); // New state for itineraries
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch attractions, destinations, and itineraries from backend
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [attractionsData, destinationsData, itinerariesData] = await Promise.all([
                    fetchAttractions(),
                    fetchDestinations(),
                    fetchItineraries()
                ]);
                setAttractions(attractionsData);
                setDestinations(destinationsData);
                setItineraries(itinerariesData);
            } catch (err) {
                console.error('Failed to load data:', err);
                setError('Failed to load data. Using defaults.');
                // Fallback handled by UI checks
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const isSearching = searchQuery.trim().length > 0;

    const filteredPosts = FEED_POSTS.filter(post => {
        if (activeFilter !== 'all' && post.type !== activeFilter) {
            return false;
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            return (
                post.placeName.toLowerCase().includes(query) ||
                post.location.toLowerCase().includes(query) ||
                post.description.toLowerCase().includes(query) ||
                post.state.toLowerCase().includes(query)
            );
        }

        return true;
    });

    return (
        <div className="min-h-screen bg-batik pb-24">
            <div className="max-w-md mx-auto px-6 py-10">
                <header className="mb-10 space-y-6">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Explore</h2>
                            <h1 className="text-4xl font-black tracking-tighter text-foreground">Malaysia</h1>
                        </div>
                        <div onClick={() => navigate('/profile')} className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform border-2 border-primary/20">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-[28px] blur-xl group-focus-within:blur-2xl transition-all" />
                        <div className="relative bg-white rounded-[24px] px-6 py-4 flex items-center gap-4 shadow-lg border-2 border-white/50 group-focus-within:shadow-primary/10 transition-all">
                            <Search className="h-5 w-5 text-muted-foreground" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Where to next?"
                                className="text-sm font-medium flex-1 outline-none bg-transparent placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>
                </header>

                {/* Search Results - Show at top when searching */}
                {isSearching && (
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h3 className="text-sm font-black">Search Results</h3>
                            <button
                                onClick={() => setSearchQuery('')}
                                className="text-xs font-bold text-primary hover:underline"
                            >
                                Clear
                            </button>
                        </div>

                        {filteredPosts.length > 0 ? (
                            <div className="space-y-6">
                                {filteredPosts.map((post) => (
                                    <FeedPost key={post.id} post={post} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-muted/10 rounded-3xl">
                                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                <p className="text-muted-foreground font-bold">No similar results found</p>
                                <p className="text-xs text-muted-foreground mt-1">Try different keywords or browse our feed below</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Quick Actions - Hidden when searching */}
                {!isSearching && (
                    <div className="space-y-8 mb-10">
                        {/* Prominent Start Planning CTA */}
                        <div
                            onClick={() => navigate('/trips/create')}
                            className="bg-primary text-primary-foreground rounded-[28px] p-6 shadow-xl shadow-primary/20 cursor-pointer group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl -ml-5 -mb-5"></div>

                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight mb-1">Start Planning</h2>
                                    <p className="text-primary-foreground/80 font-medium text-sm">Build your perfect Malaysia trip in minutes.</p>
                                </div>
                                <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform backdrop-blur-sm">
                                    <Compass className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions Grid */}
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                { icon: Utensils, label: 'Find Food', path: '/food' },
                                { icon: ShoppingBag, label: 'Shopping', path: '/shopping' },
                                { icon: Camera, label: 'Must Visit', path: '/must-visit' },
                                { icon: DollarSign, label: 'Expenses', path: '/trips/expenses' }
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => navigate(item.path)}
                                    className="bg-white rounded-[24px] py-4 flex flex-col items-center gap-2 cursor-pointer hover:shadow-lg transition-all border-2 border-white/50"
                                >
                                    <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <item.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <span className="text-[9px] font-black tracking-wider text-[#1a1a1a] text-center leading-tight">{item.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Featured Trips / Trending Itineraries (FROM DB) */}
                        <div>
                            <div
                                className="flex items-center justify-between mb-4 px-1 cursor-pointer hover:bg-white/5 p-2 transition-colors rounded-xl"
                                onClick={() => navigate('/trips/trending')}
                            >
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Trending Itineraries</h3>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
                                {itineraries.length > 0 ? (
                                    itineraries.map((trip) => (
                                        <div
                                            key={trip.id}
                                            onClick={() => navigate('/trips/itinerary', {
                                                state: {
                                                    ...trip,
                                                    guests: 2,
                                                    locations: trip.states || [], // Fallback if no states in DB yet
                                                    duration: parseInt(trip.days),
                                                    startDate: new Date(),
                                                    endDate: new Date(new Date().setDate(new Date().getDate() + parseInt(trip.days))),
                                                    preGeneratedItinerary: MOCK_ITINERARIES[trip.id] || {}, // Ideally fetch real structure too
                                                    mode: 'preview'
                                                }
                                            })}
                                            className="min-w-[200px] h-[240px] rounded-[28px] overflow-hidden relative group cursor-pointer border-2 border-white/50 shadow-sm"
                                        >
                                            <img src={trip.image_url} alt={trip.title} className="md:w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <div className="inline-block px-2 py-1 bg-primary/90 rounded-lg text-[8px] font-black text-white uppercase mb-2 backdrop-blur-md">
                                                    {trip.type}
                                                </div>
                                                <h4 className="text-white font-black text-lg leading-tight mb-1">{trip.title}</h4>
                                                <div className="flex items-center gap-2 text-white/80 text-[10px] font-bold">
                                                    <span>{trip.days} Days</span>
                                                    <span>•</span>
                                                    <span>RM {trip.price}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-muted-foreground pl-6">Loading itineraries...</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Explore by State - Hidden when searching */}
                {!isSearching && (
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-6 px-1">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Destinations</h3>
                            <span className="text-[10px] font-black text-muted-foreground uppercase">13 States</span>
                        </div>
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
                            {(destinations.length > 0 ? destinations : [
                                { name: 'Selangor', image_url: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=300&q=80' },
                                { name: 'Kuala Lumpur', image_url: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=300&q=80' },
                                { name: 'Penang', image_url: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800' }
                            ]).map((dest, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => navigate('/trips/create', { state: { preSelectedState: dest.name } })}
                                    className="shrink-0 w-32 group cursor-pointer"
                                >
                                    <div className="h-40 w-full rounded-[28px] overflow-hidden mb-3 relative shadow-lg group-hover:shadow-primary/20 transition-all border-2 border-white/50">
                                        <img
                                            src={dest.image_url}
                                            alt={dest.name}
                                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                        <div className="absolute bottom-3 left-3 right-3">
                                            <p className="text-white text-xs font-black tracking-tight drop-shadow-lg">{dest.name}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Trending Spots - Hidden when searching */}
                {!isSearching && (
                    <div className="mb-10">
                        <div
                            onClick={() => navigate('/trending')}
                            className="flex items-center justify-between mb-6 px-1 cursor-pointer group"
                        >
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary group-hover:text-primary/80 transition-colors">Trending Now</h3>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>

                        {loading ? (
                            <div className="text-center py-10">
                                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                                <p className="text-sm font-medium text-muted-foreground">Loading trending spots...</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {(attractions.length > 0
                                    ? attractions.filter(spot => spot.is_trending) // Use is_trending from Golden Schema
                                    : VIRAL_SPOTS
                                ).map((spot) => (
                                    <Card
                                        key={spot.id}
                                        onClick={() => setSelectedSpot(spot)}
                                        className="overflow-hidden cursor-pointer group border-2 border-white/50 hover:shadow-xl hover:shadow-primary/10 transition-all rounded-[28px]"
                                    >
                                        <CardContent className="p-0">
                                            <div className="flex gap-4">
                                                <div className="w-24 h-24 shrink-0 relative overflow-hidden">
                                                    <img
                                                        src={spot.image_url || spot.image || `https://images.unsplash.com/photo-1537996194471-e0f2909c8e0d?auto=format&fit=crop&w=200&q=80`}
                                                        alt={spot.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute top-2 left-2 bg-primary/90 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase">
                                                        {spot.type || spot.tag || 'Attraction'}
                                                    </div>
                                                </div>
                                                <div className="flex-1 py-3 pr-4">
                                                    <h4 className="font-black text-sm mb-1 tracking-tight">{spot.name}</h4>
                                                    <div className="flex items-center gap-1 mb-2">
                                                        <MapPin className="h-3 w-3 text-primary" />
                                                        <span className="text-[10px] font-bold text-muted-foreground">
                                                            {spot.location || 'Malaysia'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-1">
                                                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                                            <span className="text-[11px] font-black">{spot.rating}</span>
                                                        </div>
                                                        {/* Use price from Golden Schema */}
                                                        {(spot.price) > 0 && (
                                                            <div className="flex items-center gap-1">
                                                                <DollarSign className="h-3 w-3 text-primary" />
                                                                <span className="text-[11px] font-black text-primary">
                                                                    {formatPrice(spot.price)}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {error && !loading && (
                            <div className="text-center py-4">
                                <p className="text-xs text-red-500">⚠️ {error}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Community Feed */}
                <div className="mb-10">
                    <div
                        onClick={() => navigate('/community')}
                        className="flex items-center justify-between mb-6 px-1 cursor-pointer group"
                    >
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary group-hover:text-primary/80 transition-colors">Community Feed</h3>
                        </div>

                        {/* Simplified Filter Dropdown */}
                        <select
                            value={activeFilter}
                            onChange={(e) => setActiveFilter(e.target.value)}
                            className="text-xs font-black px-3 py-2 rounded-full border-2 border-muted/50 bg-white outline-none cursor-pointer hover:border-primary/50 transition-colors"
                        >
                            <option value="all">All</option>
                            <option value="food">🍽️ Food</option>
                            <option value="scenery">📸 Scenery</option>
                        </select>
                    </div>

                    <div className="space-y-6">
                        {filteredPosts.map((post) => (
                            <FeedPost key={post.id} post={post} />
                        ))}
                    </div>

                    {filteredPosts.length === 0 && (
                        <div className="text-center py-20 bg-muted/10 rounded-3xl">
                            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                            <p className="text-muted-foreground font-bold">No posts found</p>
                            <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Trending Spot Detail Modal */}
            {selectedSpot && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl">
                        <div className="relative h-64">
                            {/* Use image_url from Golden Schema */}
                            <img src={selectedSpot.image_url || selectedSpot.image} alt={selectedSpot.name} className="w-full h-full object-cover" />
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={() => setSelectedSpot(null)}
                                    className="h-10 w-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="absolute top-4 left-4 bg-primary text-white text-xs font-black px-3 py-1 rounded-full uppercase">
                                {selectedSpot.type || selectedSpot.tag || 'Attraction'}
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
                                <div className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4 text-primary" />
                                    <span className="font-black text-primary">{formatPrice(selectedSpot.price || 0)}</span>
                                </div>
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
