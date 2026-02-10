import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import {
    ChevronRight, ChevronLeft, MapPin, Calendar, Users,
    Check, Star, Utensils, Camera, ShoppingBag, Compass,
    Sparkles, Plus, Clock, ArrowRight, X, Info, Car, Bus
} from 'lucide-react';
import { MALAYSIA_LOCATIONS, STATE_ACTIVITIES, ACCOMMODATION_DATA, TRANSPORT_ESTIMATES, DESTINATION_INTELLIGENCE } from '../../lib/constants';
import ActivityDetailsModal from '../../components/trips/ActivityDetailsModal';

const PRIORITIES = [
    { id: 'Food', label: 'Local Food', icon: Utensils },
    { id: 'Viral', label: 'Viral Spots', icon: Camera },
    { id: 'Nature', label: 'Nature/Relax', icon: Compass },
    { id: 'Shopping', label: 'Shopping', icon: ShoppingBag },
];

export default function CreateTrip() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [overlapError, setOverlapError] = useState(null);
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
    const [customForm, setCustomForm] = useState({ name: '', location: '' });
    const [selectedDetailActivity, setSelectedDetailActivity] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const locationState = useLocation().state;

    const [tripData, setTripData] = useState({
        locations: locationState?.preSelectedState ? [locationState.preSelectedState] : [],
        date: new Date().toISOString().split('T')[0],
        activities: [], // { id, name, time, duration, image, category, location, day }
        priorities: ['Food'],
        duration: 3,
        priorities: ['Food'],
        duration: 3,
        guests: 2,
        accommodation: {}, // { 1: hotelA, 2: hotelB }
        transportMode: 'own' // 'own' or 'public'
    });

    const [platform, setPlatform] = useState('hotel'); // hotel, airbnb, homestay
    const [currentAccomDay, setCurrentAccomDay] = useState(1);

    // -- Derived Data --
    const availableStateActivities = useMemo(() => {
        if (!tripData.locations || tripData.locations.length === 0) return [];
        return tripData.locations.flatMap(loc => STATE_ACTIVITIES[loc] || []);
    }, [tripData.locations]);

    const suggestions = useMemo(() => {
        if (!tripData.locations.length || availableStateActivities.length === 0) return [];
        const selectedIds = new Set(tripData.activities.map(a => a.id));
        return availableStateActivities.filter(a =>
            !selectedIds.has(a.id) &&
            tripData.priorities.some(p => a.category?.includes(p))
        ).slice(0, 5);
    }, [tripData.locations, tripData.activities, tripData.priorities, availableStateActivities]);

    // -- Actions --
    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const checkOverlap = (id, time, day, list) => {
        const overlap = list.find(a => a.id !== id && a.time === time && a.day === day);
        if (overlap) {
            setOverlapError(`Overlap on Day ${day}: "${overlap.name}" is already scheduled for ${time}.`);
            return true;
        }
        setOverlapError(null);
        return false;
    };

    const toggleActivity = (act) => {
        if (tripData.activities.find(a => a.id === act.id)) {
            setTripData({ ...tripData, activities: tripData.activities.filter(a => a.id !== act.id) });
            setOverlapError(null);
        } else {
            const defaultTime = '10:00';
            const defaultDay = 1;
            checkOverlap(act.id, defaultTime, defaultDay, tripData.activities);
            setTripData({
                ...tripData,
                activities: [...tripData.activities, { ...act, time: defaultTime, duration: 2, day: defaultDay }]
            });
        }
    };

    const updateActivityDetail = (id, field, value) => {
        const updatedActivities = tripData.activities.map(a => a.id === id ? { ...a, [field]: value } : a);
        if (field === 'time' || field === 'day') {
            const act = updatedActivities.find(a => a.id === id);
            checkOverlap(id, act.time, act.day, tripData.activities);
        }
        setTripData({
            ...tripData,
            activities: updatedActivities
        });
    };

    const addCustomActivity = () => {
        if (!customForm.name || !customForm.location) return;
        const newAct = {
            id: `custom-${Date.now()}`,
            name: customForm.name,
            location: customForm.location,
            category: 'User Custom',
            image: 'https://images.unsplash.com/photo-1596422846543-75c6fc18a593?q=80&w=2670&auto=format&fit=crop',
            time: '12:00',
            duration: 2,
            day: 1,
            price: 0,
            rating: 5.0
        };
        setTripData({ ...tripData, activities: [...tripData.activities, newAct] });
        setIsCustomModalOpen(false);
        setCustomForm({ name: '', location: '' });
    };

    const togglePriority = (p) => {
        if (tripData.priorities.includes(p)) {
            setTripData({ ...tripData, priorities: tripData.priorities.filter(i => i !== p) });
        } else {
            setTripData({ ...tripData, priorities: [...tripData.priorities, p] });
        }
    };

    const toggleLocation = (loc) => {
        if (tripData.locations.includes(loc)) {
            setTripData({ ...tripData, locations: tripData.locations.filter(l => l !== loc) });
        } else {
            setTripData({ ...tripData, locations: [...tripData.locations, loc] });
        }
    };

    const handleSuggestionClick = (act) => {
        setSelectedDetailActivity(act);
        setIsDetailModalOpen(true);
    };

    const finalize = () => {
        navigate('/trips/itinerary', { state: { ...tripData } });
    };

    // -- Step Renderers --
    const renderStep1 = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-3">
                <h2 className="text-3xl font-black text-primary leading-tight tracking-tighter">What do you love? 🇲🇾</h2>
                <p className="text-muted-foreground font-medium">We'll tailor your Malaysian adventure based on your vibe.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {PRIORITIES.map(p => (
                    <button
                        key={p.id}
                        onClick={() => togglePriority(p.id)}
                        className={`p-7 rounded-[32px] border-2 flex flex-col items-center gap-4 transition-all ${tripData.priorities.includes(p.id) ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5 scale-[1.02]' : 'border-muted hover:border-primary/20'}`}
                    >
                        <div className={`h-16 w-16 rounded-[24px] flex items-center justify-center transition-all ${tripData.priorities.includes(p.id) ? 'bg-primary text-white shadow-lg' : 'bg-muted text-muted-foreground'}`}>
                            <p.icon className="h-8 w-8" />
                        </div>
                        <span className="font-black text-sm tracking-tight">{p.label}</span>
                    </button>
                ))}
            </div>

            <Button
                className="w-full h-20 rounded-[28px] shadow-2xl shadow-primary/20 font-black text-lg transition-transform active:scale-95"
                disabled={tripData.priorities.length === 0}
                onClick={handleNext}
            >
                Next: Where & When <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-3">
                <h2 className="text-3xl font-black text-primary leading-tight tracking-tighter">The Basics</h2>
                <p className="text-muted-foreground font-medium">Tell us the details of your getaway.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 pl-1">Where are you heading? (Select multiple optional)</label>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.keys(STATE_ACTIVITIES).map(state => {
                            const isSelected = tripData.locations.includes(state);
                            const intelligence = DESTINATION_INTELLIGENCE[state];
                            return (
                                <button
                                    key={state}
                                    onClick={() => toggleLocation(state)}
                                    className={`relative flex flex-col items-start gap-1 px-4 py-3 rounded-2xl border-2 transition-all text-left ${isSelected ? 'border-primary bg-primary/5 text-primary' : 'border-muted text-muted-foreground hover:border-primary/20'}`}
                                >
                                    <div className="flex items-center gap-2 w-full">
                                        <MapPin className={`h-4 w-4 ${isSelected ? 'text-primary' : 'text-primary/20'}`} />
                                        <span className="font-bold text-xs truncate">{state}</span>
                                        {isSelected && <Check className="h-3.5 w-3.5 ml-auto" />}
                                    </div>
                                    {intelligence && (
                                        <span className="text-[9px] font-bold opacity-60 ml-6">
                                            Best for {intelligence.minDays} days • {intelligence.suggestedPace}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    {/* Soft Warning for Duration */}
                    {(() => {
                        const totalMinDays = tripData.locations.reduce((sum, loc) => sum + (DESTINATION_INTELLIGENCE[loc]?.minDays || 2), 0);
                        if (tripData.locations.length > 0 && tripData.duration < totalMinDays) {
                            return (
                                <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-2 rounded-xl border border-orange-100 animate-in fade-in">
                                    <Info className="h-3.5 w-3.5" />
                                    <p className="text-[10px] font-bold">Recommended duration for selected spots is {totalMinDays} days.</p>
                                </div>
                            );
                        }
                        return null;
                    })()}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 absolute left-5 top-3 z-10">Duration (Days)</label>
                        <input
                            type="number"
                            min="1"
                            max="30"
                            className="w-full h-20 pl-5 pr-12 pt-6 rounded-[24px] border-2 border-muted bg-background font-bold text-lg focus:border-primary focus:ring-0 transition-all"
                            value={tripData.duration}
                            onChange={(e) => setTripData({ ...tripData, duration: parseInt(e.target.value) || 1 })}
                        />
                        <Clock className="absolute right-5 top-7 h-6 w-6 text-primary/40 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 absolute left-5 top-3 z-10">Guests</label>
                        <input
                            type="number"
                            min="1"
                            className="w-full h-20 pl-5 pr-12 pt-6 rounded-[24px] border-2 border-muted bg-background font-bold text-lg focus:border-primary focus:ring-0 transition-all"
                            value={tripData.guests}
                            onChange={(e) => setTripData({ ...tripData, guests: parseInt(e.target.value) || 1 })}
                        />
                        <Users className="absolute right-5 top-7 h-6 w-6 text-primary/40 pointer-events-none" />
                    </div>
                </div>

                <div className="relative">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 absolute left-5 top-3 z-10">Start Date</label>
                    <input
                        type="date"
                        className="w-full h-20 pl-5 pr-12 pt-6 rounded-[24px] border-2 border-muted bg-background font-bold text-lg focus:border-primary focus:ring-0 transition-all font-sans"
                        value={tripData.date}
                        onChange={(e) => setTripData({ ...tripData, date: e.target.value })}
                    />
                    <Calendar className="absolute right-5 top-7 h-6 w-6 text-primary/40 pointer-events-none" />
                </div>

                {/* Transport Mode Selector */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 pl-1">Transport Mode</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setTripData({ ...tripData, transportMode: 'own' })}
                            className={`p-6 rounded-[24px] border-2 flex flex-col items-center gap-3 transition-all ${tripData.transportMode === 'own'
                                ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5 scale-[1.02]'
                                : 'border-muted hover:border-primary/20'
                                }`}
                        >
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${tripData.transportMode === 'own' ? 'bg-primary text-white shadow-lg' : 'bg-muted text-muted-foreground'
                                }`}>
                                <Car className="h-6 w-6" />
                            </div>
                            <span className="font-black text-xs tracking-tight">Own Transport</span>
                        </button>

                        <button
                            onClick={() => setTripData({ ...tripData, transportMode: 'public' })}
                            className={`p-6 rounded-[24px] border-2 flex flex-col items-center gap-3 transition-all ${tripData.transportMode === 'public'
                                ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5 scale-[1.02]'
                                : 'border-muted hover:border-primary/20'
                                }`}
                        >
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${tripData.transportMode === 'public' ? 'bg-primary text-white shadow-lg' : 'bg-muted text-muted-foreground'
                                }`}>
                                <Bus className="h-6 w-6" />
                            </div>
                            <span className="font-black text-xs tracking-tight">Public Transport</span>
                        </button>
                    </div>
                </div>
            </div>

            <Button
                className="w-full h-20 rounded-[28px] shadow-2xl shadow-primary/20 font-black text-lg transition-transform active:scale-95"
                disabled={tripData.locations.length === 0}
                onClick={handleNext}
            >
                Pick My Activities <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-primary tracking-tight">Select Spots</h2>
                    <p className="text-muted-foreground text-sm">Suggested for your selected priorities.</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-dashed border-primary/40 text-primary font-black text-[10px] h-10 px-4"
                    onClick={() => setIsCustomModalOpen(true)}
                >
                    <Plus className="h-3.5 w-3.5 mr-1" /> ADD CUSTOM
                </Button>
            </div>

            {overlapError && (
                <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-3xl flex items-center gap-3 animate-in shake">
                    <Info className="h-5 w-5 text-destructive shrink-0" />
                    <p className="text-xs font-bold text-destructive leading-tight">{overlapError}</p>
                </div>
            )}

            <div className={`space-y-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar`}>
                {['Morning', 'Afternoon', 'Evening', 'Night'].map(timeSlot => {
                    const activitiesInSlot = availableStateActivities.filter(a => (a.bestTime || 'Morning') === timeSlot);
                    if (activitiesInSlot.length === 0) return null;

                    return (
                        <div key={timeSlot} className="space-y-3 mb-6">
                            <h3 className="text-sm font-black text-primary uppercase tracking-widest pl-2 border-l-4 border-primary/20 sticky top-0 bg-background/95 backdrop-blur z-10 py-2">
                                {timeSlot}
                            </h3>
                            {activitiesInSlot.map(act => {
                                const selected = tripData.activities.find(a => a.id === act.id);
                                return (
                                    <div key={act.id} className={`p-4 rounded-[28px] border-2 transition-all ${selected ? 'border-primary bg-primary/5 shadow-sm' : 'border-muted'}`}>
                                        <div className="flex items-center gap-4 mb-3">
                                            <img src={act.image} className="h-16 w-16 rounded-[20px] object-cover shadow-sm" alt="" />
                                            <div className="flex-1">
                                                <h4 className="font-bold text-sm leading-snug">{act.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-black text-primary/70 uppercase tracking-tighter">{act.category}</span>
                                                    <span className="text-[10px] text-muted-foreground">•</span>
                                                    <span className="text-[10px] font-bold text-muted-foreground">{act.duration ? `${act.duration / 60}h` : '2h'}</span>
                                                    <span className="text-[10px] text-muted-foreground">•</span>
                                                    <span className="text-[10px] font-bold text-muted-foreground">RM {act.price || 0}</span>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant={selected ? "destructive" : "outline"}
                                                className={`rounded-xl h-9 px-4 text-[10px] font-black transition-all ${selected ? 'shadow-lg shadow-destructive/20' : ''}`}
                                                onClick={() => toggleActivity(act)}
                                            >
                                                {selected ? <X className="h-4 w-4" /> : 'ADD'}
                                            </Button>
                                        </div>
                                        {selected && (
                                            <div className="flex items-center gap-4 py-3 border-t border-primary/10 mt-1">
                                                <div className="flex items-center gap-2 flex-1">
                                                    <div className="p-2 bg-primary/10 rounded-lg"><Clock className="h-3.5 w-3.5 text-primary" /></div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-black text-muted-foreground uppercase leading-none mb-1">Schedule Time</span>
                                                        <input
                                                            type="time"
                                                            className="bg-transparent border-none p-0 text-sm font-black text-primary focus:ring-0 leading-none h-4"
                                                            value={selected.time}
                                                            onChange={(e) => updateActivityDetail(act.id, 'time', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="h-8 w-px bg-primary/10"></div>
                                                <div className="flex-1 flex flex-col justify-center">
                                                    <span className="text-[9px] font-black text-muted-foreground uppercase leading-none mb-1">Day</span>
                                                    <select
                                                        className="bg-transparent border-none p-0 text-sm font-black text-primary focus:ring-0 leading-none h-4 w-16"
                                                        value={selected.day || 1}
                                                        onChange={(e) => updateActivityDetail(act.id, 'day', parseInt(e.target.value))}
                                                    >
                                                        {[...Array(tripData.duration)].map((_, i) => (
                                                            <option key={i + 1} value={i + 1}>Day {i + 1}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="h-8 w-px bg-primary/10"></div>
                                                <div className="flex-1 flex flex-col justify-center">
                                                    <span className="text-[9px] font-black text-muted-foreground uppercase leading-none mb-1">Duration</span>
                                                    <select
                                                        className="bg-transparent border-none p-0 text-sm font-black text-primary focus:ring-0 leading-none h-4 w-16"
                                                        value={selected.duration}
                                                        onChange={(e) => updateActivityDetail(act.id, 'duration', parseInt(e.target.value))}
                                                    >
                                                        {[1, 1.5, 2, 2.5, 3, 4, 5, 8].map(h => <option key={h} value={h}>{h} h</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}

                {/* Show Custom Activities Added */}
                {tripData.activities.filter(a => a.id.startsWith('custom-')).map(act => (
                    <div key={act.id} className="p-4 rounded-[28px] border-2 border-primary bg-primary/5 shadow-sm">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="h-16 w-16 rounded-[20px] bg-primary/10 flex items-center justify-center text-primary">
                                <MapPin className="h-8 w-8" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-sm leading-snug">{act.name}</h4>
                                <span className="text-[10px] font-black text-primary/70 uppercase tracking-tighter">Your Spot • {act.location}</span>
                            </div>
                            <Button
                                size="sm"
                                variant="destructive"
                                className="rounded-xl h-9 px-4 text-[10px] font-black shadow-lg shadow-destructive/20"
                                onClick={() => setTripData({ ...tripData, activities: tripData.activities.filter(a => a.id !== act.id) })}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex items-center gap-4 py-3 border-t border-primary/10 mt-1">
                            <div className="flex items-center gap-2 flex-1">
                                <div className="p-2 bg-primary/10 rounded-lg"><Clock className="h-3.5 w-3.5 text-primary" /></div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-muted-foreground uppercase leading-none mb-1">Schedule Time</span>
                                    <input
                                        type="time"
                                        className="bg-transparent border-none p-0 text-sm font-black text-primary focus:ring-0 leading-none h-4"
                                        value={act.time}
                                        onChange={(e) => updateActivityDetail(act.id, 'time', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="h-8 w-px bg-primary/10"></div>
                            <div className="flex-1 flex flex-col justify-center">
                                <span className="text-[9px] font-black text-muted-foreground uppercase leading-none mb-1">Day</span>
                                <select
                                    className="bg-transparent border-none p-0 text-sm font-black text-primary focus:ring-0 leading-none h-4 w-16"
                                    value={act.day || 1}
                                    onChange={(e) => updateActivityDetail(act.id, 'day', parseInt(e.target.value))}
                                >
                                    {[...Array(tripData.duration)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>Day {i + 1}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Button className="w-full py-7 rounded-3xl shadow-xl shadow-primary/10 font-black text-lg" disabled={tripData.activities.length === 0} onClick={handleNext}>
                Review My Plan <ChevronRight className="ml-2 h-5 w-5" />
            </Button>

            {/* Custom Activity Modal */}
            {isCustomModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <Card className="w-full max-w-sm rounded-[32px] overflow-hidden border-none shadow-2xl">
                        <CardHeader className="bg-primary text-primary-foreground p-8 pb-10">
                            <CardTitle className="text-2xl font-black tracking-tight">Add Your Gem</CardTitle>
                            <CardDescription className="text-primary-foreground/70 font-bold">What local secret are we visiting?</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Spot Name</label>
                                <Input
                                    placeholder="e.g. Hidden Cafe in KL"
                                    className="h-14 rounded-2xl border-2 border-muted focus:border-primary font-bold transition-all"
                                    value={customForm.name}
                                    onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Location Details</label>
                                <Input
                                    placeholder="e.g. Bukit Bintang Area"
                                    className="h-14 rounded-2xl border-2 border-muted focus:border-primary font-bold transition-all"
                                    value={customForm.location}
                                    onChange={(e) => setCustomForm({ ...customForm, location: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button variant="ghost" className="flex-1 h-14 rounded-2xl font-black text-muted-foreground" onClick={() => setIsCustomModalOpen(false)}>CANCEL</Button>
                                <Button className="flex-1 h-14 rounded-2xl font-black shadow-lg shadow-primary/20" disabled={!customForm.name || !customForm.location} onClick={addCustomActivity}>ADD SPOT</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );

    const handleAccomSelect = (stay) => {
        setTripData(prev => ({
            ...prev,
            accommodation: {
                ...prev.accommodation,
                [currentAccomDay]: stay
            }
        }));
    };

    const applyToAllDays = () => {
        const currentStay = tripData.accommodation[currentAccomDay];
        if (!currentStay) return;

        const newAccom = { ...tripData.accommodation };
        for (let i = 1; i <= tripData.duration; i++) {
            newAccom[i] = currentStay;
        }
        setTripData(prev => ({ ...prev, accommodation: newAccom }));
    };

    const renderStep4 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-foreground tracking-tighter">Stay Authentic</h2>
                <p className="text-muted-foreground font-medium">Where will you be resting your head on Day {currentAccomDay}?</p>
            </div>

            {/* Day Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {[...Array(tripData.duration)].map((_, i) => {
                    const day = i + 1;
                    const isFilled = !!tripData.accommodation[day];
                    const isCurrent = currentAccomDay === day;
                    return (
                        <button
                            key={day}
                            onClick={() => setCurrentAccomDay(day)}
                            className={`h-10 px-4 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all border-2 
                                ${isCurrent ? 'bg-primary text-white border-primary shadow-lg scale-105' :
                                    isFilled ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground border-transparent'}`}
                        >
                            Day {day} {isFilled && !isCurrent && '✓'}
                        </button>
                    );
                })}
            </div>

            {/* Platform Selection */}
            <div className="flex p-1 bg-muted/50 rounded-2xl mb-2">
                {['hotel', 'airbnb', 'homestay'].map(p => (
                    <button
                        key={p}
                        onClick={() => setPlatform(p)}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${platform === p ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:bg-white/50'}`}
                    >
                        {p}
                    </button>
                ))}
            </div>

            {/* Selected Summary for Day */}
            <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {tripData.accommodation[currentAccomDay] ? 'Selected for this day' : 'Select a place'}
                </span>
                {tripData.accommodation[currentAccomDay] && (
                    <button onClick={applyToAllDays} className="text-[10px] font-black text-primary hover:underline">
                        APPLY TO ALL DAYS
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4">
                {ACCOMMODATION_DATA[platform].map(stay => {
                    const isSelected = tripData.accommodation[currentAccomDay]?.id === stay.id;
                    return (
                        <Card
                            key={stay.id}
                            className={`group overflow-hidden border-2 transition-all cursor-pointer rounded-[32px] ${isSelected ? 'border-primary ring-4 ring-primary/5 bg-primary/5' : 'border-muted hover:border-primary/20'}`}
                            onClick={() => handleAccomSelect(stay)}
                        >
                            <CardContent className="p-4 flex gap-5">
                                <div className="relative shrink-0">
                                    <img src={stay.image} className="h-24 w-24 rounded-[24px] object-cover shadow-sm transition-transform group-hover:scale-105" alt="" />
                                    {isSelected && (
                                        <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center shadow-lg border-4 border-background">
                                            <Check className="h-4 w-4" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col justify-center gap-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-black text-lg text-primary tracking-tight leading-tight">{stay.name}</h3>
                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-600 text-[10px] font-black">
                                            <Star className="h-3 w-3 fill-current" /> {stay.rating}
                                        </div>
                                    </div>
                                    <p className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                                        <MapPin className="h-3 w-3 opacity-40" /> {stay.location}
                                    </p>
                                    <div className="flex items-end justify-between mt-2">
                                        <div className="flex flex-col">
                                            <p className="text-lg font-black text-primary">RM {stay.price}<span className="text-[10px] font-bold opacity-40 ml-1">/ NIGHT</span></p>
                                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{stay.type}</span>
                                        </div>
                                        <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Button
                className="w-full h-20 rounded-[28px] shadow-2xl shadow-primary/20 font-black text-lg transition-transform active:scale-95 mt-4"
                disabled={Object.keys(tripData.accommodation).length < tripData.duration}
                onClick={handleNext}
            >
                Final Review <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
        </div>
    );

    const renderStep5 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-2">
                <h2 className="text-2xl font-black text-primary tracking-tight">Suggestions for You</h2>
                <p className="text-muted-foreground text-sm font-medium">Extra filler activities nearby.</p>
            </div>

            <div className="space-y-4">
                {suggestions.map(s => (
                    <Card key={s.id} className="border-none bg-muted/30 hover:bg-muted/50 transition-all rounded-[32px] overflow-hidden group cursor-pointer" onClick={() => handleSuggestionClick(s)}>
                        <CardContent className="p-4 flex gap-5">
                            <div className="relative shrink-0">
                                <img src={s.image} className="h-20 w-20 rounded-[24px] object-cover shadow-sm transition-transform group-hover:scale-105" alt="" />
                                <div className="absolute -top-2 -right-2 bg-primary text-white p-1 rounded-full shadow-lg"><Sparkles className="h-3 w-3" /></div>
                            </div>
                            <div className="flex-1 py-1">
                                <h4 className="font-black text-sm mb-1 leading-snug">{s.name}</h4>
                                <div className="flex items-center gap-2 mb-3">
                                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                    <span className="text-[11px] font-black text-muted-foreground/80 tracking-tight">{s.rating} • {s.category}</span>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="rounded-xl border-dashed border-primary/40 text-primary font-black h-8 px-4 text-[10px] hover:bg-primary hover:text-white transition-colors"
                                    onClick={() => toggleActivity(s)}
                                >
                                    <Plus className="h-3.5 w-3.5 mr-1" /> ADD TO PLAN
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <ActivityDetailsModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                activity={selectedDetailActivity}
            />

            <Card className="bg-primary text-primary-foreground border-none shadow-2xl rounded-[40px] overflow-hidden relative mt-4">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -ml-16 -mb-16"></div>
                <CardContent className="p-8 relative">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-5">
                            <div className="h-16 w-16 bg-white/20 rounded-[24px] flex items-center justify-center backdrop-blur-md shadow-inner">
                                <Calendar className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] mb-1">Trip Summary</div>
                                <div className="text-2xl font-black tracking-tighter">{tripData.locations.length > 1 ? `${tripData.locations[0]} + ${tripData.locations.length - 1}` : tripData.locations[0] || 'Malaysian'} Escape</div>
                            </div>
                        </div>

                        {Object.keys(tripData.accommodation).length > 0 && (
                            <div className="bg-white/10 rounded-3xl p-5 backdrop-blur-md border border-white/10 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-[8px] font-black uppercase opacity-60 tracking-widest leading-none">Your Stays</p>
                                    <p className="text-[9px] font-bold opacity-80">{Object.keys(tripData.accommodation).length} Nights Booked</p>
                                </div>
                                {/* Show first stay details or "Multiple Stays" */}
                                {(() => {
                                    const firstStay = tripData.accommodation[1];
                                    const isMixed = Object.values(tripData.accommodation).some(s => s.id !== firstStay?.id);

                                    if (isMixed) {
                                        return (
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                                                    <MapPin className="h-6 w-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-black">Multiple Locations</p>
                                                    <p className="text-[10px] opacity-70">Different stay for different days</p>
                                                </div>
                                            </div>
                                        );
                                    } else if (firstStay) {
                                        return (
                                            <div className="flex items-center gap-4">
                                                <img src={firstStay.image} className="h-12 w-12 rounded-xl object-cover" alt="" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-black truncate">{firstStay.name}</p>
                                                    <p className="text-[10px] opacity-70">{firstStay.location}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-black">RM {firstStay.price}</p>
                                                    <p className="text-[8px] font-bold opacity-60">PER NIGHT</p>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 rounded-3xl p-4 backdrop-blur-md border border-white/5">
                                <span className="block text-[9px] font-black opacity-60 uppercase tracking-widest mb-1">Duration</span>
                                <span className="text-sm font-black">{tripData.duration} Days</span>
                            </div>
                            <div className="bg-white/10 rounded-3xl p-4 backdrop-blur-md border border-white/5 text-right">
                                <span className="block text-[9px] font-black opacity-60 uppercase tracking-widest mb-1">Members</span>
                                <span className="text-sm font-black">{tripData.guests} People</span>
                            </div>
                        </div>

                        <div className="h-px bg-white/10 w-full opacity-50"></div>

                        <div className="flex justify-between items-center bg-white/5 rounded-[24px] px-6 py-4">
                            <span className="text-sm font-bold opacity-80 italic">Plan ready for build</span>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
                                <span className="text-xs font-black uppercase tracking-widest">{tripData.activities.length} Selected</span>
                            </div>
                        </div>

                        <Button
                            className="w-full bg-white text-primary hover:bg-white/90 rounded-[28px] font-black py-8 shadow-2xl text-xl group transition-all"
                            onClick={finalize}
                        >
                            Build My Itinerary
                            <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1.5 transition-transform" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="max-w-md mx-auto px-6 py-8 pb-32 min-h-screen bg-background relative selection:bg-primary/20">
            {/* Background Decor */}
            <div className="fixed top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10 animate-pulse"></div>
            <div className="fixed bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10 animation-delay-2000"></div>

            {/* Nav Header */}
            <div className="flex items-center justify-between mb-12">
                {step > 1 ? (
                    <button onClick={handleBack} className="h-12 w-12 rounded-2xl border-2 border-muted flex items-center justify-center text-primary hover:bg-primary/5 transition-all group">
                        <ChevronLeft className="h-6 w-6 transition-transform group-hover:-translate-x-0.5" />
                    </button>
                ) : (
                    <button onClick={() => navigate('/')} className="h-12 px-6 rounded-2xl border-2 border-muted flex items-center justify-center text-muted-foreground hover:text-foreground font-black text-[10px] tracking-widest uppercase transition-all">
                        CANCEL
                    </button>
                )}
                <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map(s => (
                        <div key={s} className={`h-2 rounded-full transition-all duration-700 ease-out shadow-sm ${step === s ? 'w-10 bg-primary shadow-primary/20' : step > s ? 'w-3 bg-primary/40' : 'w-2 bg-muted'}`}></div>
                    ))}
                </div>
            </div>

            {/* Wizards */}
            <main className="relative">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
                {step === 5 && renderStep5()}
            </main>
        </div>
    );
}
