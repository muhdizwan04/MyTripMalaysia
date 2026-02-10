import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { MapPin, Clock, DollarSign, ArrowLeft, Heart, Sparkles, Filter, Search } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { FEATURED_TRIPS, MOCK_ITINERARIES } from '../../lib/constants';

const TAGS = ["All", "Culinary", "Culture", "Relaxation", "Adventure", "Nature"];

export default function TrendingItineraries() {
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();
    const [selectedTag, setSelectedTag] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredTrips = FEATURED_TRIPS.filter(trip => {
        const matchesTag = selectedTag === "All" || trip.tag === selectedTag;
        const matchesSearch = trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trip.states.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTag && matchesSearch;
    });

    const handleTripClick = (trip) => {
        navigate('/trips/itinerary', {
            state: {
                ...trip,
                guests: 2,
                locations: trip.states,
                duration: parseInt(trip.days),
                startDate: new Date(),
                endDate: new Date(new Date().setDate(new Date().getDate() + parseInt(trip.days))),
                preGeneratedItinerary: MOCK_ITINERARIES[trip.id],
                mode: 'preview'
            }
        });
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-md mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className=" -ml-2 rounded-full hover:bg-white/5"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                        <h1 className="text-xl font-black tracking-tight">Trending Itineraries</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-6 py-6 space-y-8">
                {/* Search & Filter */}
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search accessible trips..."
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                        {TAGS.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(tag)}
                                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedTag === tag
                                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                        : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Trips Grid */}
                <div className="grid gap-6">
                    {filteredTrips.length > 0 ? (
                        filteredTrips.map((trip) => (
                            <div
                                key={trip.id}
                                onClick={() => handleTripClick(trip)}
                                className="group relative bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-muted"
                            >
                                {/* Image */}
                                <div className="aspect-[4/3] relative overflow-hidden">
                                    <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs font-bold text-white">
                                        {trip.tag}
                                    </div>
                                    <img
                                        src={trip.image}
                                        alt={trip.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="text-2xl font-black text-white mb-2 leading-none">{trip.title}</h3>

                                    <div className="flex items-center gap-4 text-white/90 text-sm font-medium mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4 text-primary" />
                                            {trip.days}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            {trip.states.length > 1 ? `${trip.states[0]} + ${trip.states.length - 1}` : trip.states[0]}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase tracking-widest text-white/60 font-bold">Est. Cost</span>
                                            <span className="text-lg font-black text-primary">{trip.price}</span>
                                        </div>
                                        <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                            <Sparkles className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground font-medium">No trips found matching your criteria.</p>
                            <Button variant="link" onClick={() => { setSelectedTag("All"); setSearchQuery(""); }}>
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
