import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MapPin, Calendar, ArrowRight, Plus } from 'lucide-react';

export default function TripsList() {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        const savedTrips = JSON.parse(localStorage.getItem('my_trips') || '[]');
        setTrips(savedTrips.reverse()); // Show newest first
    }, []);

    return (
        <div className="min-h-screen bg-batik pb-24">
            <div className="max-w-md mx-auto px-6 py-12">
                <header className="flex justify-between items-end mb-10">
                    <div className="space-y-1">
                        <h1 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Your Passport</h1>
                        <h2 className="text-4xl font-black tracking-tighter">My Trips</h2>
                    </div>
                    <Button
                        size="icon"
                        onClick={() => navigate('/trips/create')}
                        className="h-14 w-14 rounded-2xl shadow-xl shadow-primary/20 shrink-0"
                    >
                        <Plus className="h-6 w-6" />
                    </Button>
                </header>

                {trips.length === 0 ? (
                    <div className="py-20 text-center space-y-6">
                        <div className="h-32 w-32 rounded-[48px] bg-muted/50 mx-auto flex items-center justify-center text-muted-foreground/20 border-4 border-white shadow-inner">
                            <MapPin className="h-14 w-14" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black tracking-tight">The map is empty!</h3>
                            <p className="text-muted-foreground text-sm font-medium px-10 leading-relaxed italic">
                                "Travel is the only thing you buy that makes you richer."
                            </p>
                        </div>
                        <Button
                            onClick={() => navigate('/trips/create')}
                            className="h-16 px-10 rounded-[28px] font-black shadow-xl group"
                        >
                            PLAN FIRST ADVENTURE <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {trips.map(trip => (
                            <Card
                                key={trip.id}
                                className="rounded-[40px] overflow-hidden glass-card border-none shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group"
                                onClick={() => navigate('/trips/itinerary', { state: trip })}
                            >
                                <div className="h-32 bg-primary/10 relative overflow-hidden">
                                    {/* Batik Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-5 group-hover:opacity-10 transition-opacity">
                                        <MapPin className="h-24 w-24" />
                                    </div>
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                                            {trip.duration} DAYS
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 right-4 h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                                <CardContent className="p-8 space-y-4">
                                    <div>
                                        <h3 className="text-2xl font-black tracking-tight leading-none mb-2 group-hover:text-primary transition-colors">
                                            {trip.destination || (trip.states ? trip.states.join(', ') : 'Wild Adventure')}
                                        </h3>
                                        <div className="flex items-center text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                                            <Calendar className="h-3 w-3 mr-2 text-primary" />
                                            {new Date(trip.startDate || trip.createdAt).toLocaleDateString('en-MY', { month: 'long', year: 'numeric' })}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-muted flex items-center justify-center text-[10px] font-bold">
                                                    {['S', 'M', 'A'][i - 1]}
                                                </div>
                                            ))}
                                            <div className="h-8 w-8 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                                                +{trip.pax || 2}
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 bg-primary/5 px-4 py-2 rounded-full">
                                            {trip.travelStyle || 'Explore'}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
