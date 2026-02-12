import React, { useState, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { STATE_ACTIVITIES, TRANSPORT_ROUTES, DEFAULT_ACTIVITIES, TRAVEL_ADVICE, TRANSPORT_ESTIMATES, ROUTE_GUIDANCE, ITINERARY_RULES, BUDGET_DEFAULTS } from '../../lib/constants';
import { Clock, MapPin, DollarSign, Loader2, ArrowLeft, Bus, Car, Star, X, Info, Sparkles, ArrowRight, Users, Plus, Calendar, ChevronUp, ChevronDown, AlertTriangle, Share2 } from 'lucide-react';
import TripMap from '../../components/trips/TripMap';
import ActivityDetailsModal from '../../components/trips/ActivityDetailsModal';
import { useCurrency } from '../../context/CurrencyContext';
import { getValidationRules, getAttractions } from '../../lib/api';
import { validateItinerary } from '../../lib/validationUtils';

export default function ItineraryView() {
    const location = useLocation();
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();
    const tripData = location.state || {};

    const [isLoading, setIsLoading] = useState(true);
    const [itinerary, setItinerary] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [showAddMiniGemDialog, setShowAddMiniGemDialog] = useState(false);
    const [pendingMiniGem, setPendingMiniGem] = useState(null);
    const [miniGemDuration, setMiniGemDuration] = useState(1); // User's desired duration for mini-gem
    const [itineraryAlert, setItineraryAlert] = useState(null);
    const [showReorderConfirm, setShowReorderConfirm] = useState(false);
    const [pendingReorderData, setPendingReorderData] = useState(null); // { dayIndex, newOrder }
    const [showShareModal, setShowShareModal] = useState(false);
    const [dismissedAlerts, setDismissedAlerts] = useState({});
    const [tripMembers, setTripMembers] = useState(['You']);
    const [showMap, setShowMap] = useState(true);
    const [validationRules, setValidationRules] = useState(null);
    const [dayWarnings, setDayWarnings] = useState({});
    const mapRef = React.useRef(null);

    useEffect(() => {
        const saved = localStorage.getItem('trip_participants');
        if (saved) {
            setTripMembers(JSON.parse(saved));
        } else {
            // Default members if none found, to match previous mock
            setTripMembers(['You', 'Sarah', 'Amir']);
        }
    }, []);

    // Fetch validation rules
    useEffect(() => {
        getValidationRules().then(rules => {
            setValidationRules(rules);
        });
    }, []);

    // Validate itinerary when it changes
    useEffect(() => {
        if (!validationRules || !itinerary.length) return;

        const warnings = validateItinerary(itinerary, validationRules);
        setDayWarnings(warnings);
    }, [itinerary, validationRules]);

    const isPreview = tripData.mode === 'preview';
    const [showEditConfirm, setShowEditConfirm] = useState(false);

    const handleStartPlanning = () => {
        setShowEditConfirm(true);
    };

    const confirmStartPlanning = () => {
        const newState = { ...tripData };
        delete newState.mode;
        // Keep preGeneratedItinerary so it doesn't regenerate from scratch/randomly
        navigate('/trips/itinerary', { state: newState, replace: true });
        setShowEditConfirm(false);
    };

    const scrollToMap = () => {
        mapRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const isActivityPast = (dayNum, timeStr) => {
        try {
            if (!timeStr) return false;
            const baseDate = tripData.date ? new Date(tripData.date) : new Date();
            baseDate.setHours(0, 0, 0, 0);

            const targetDate = new Date(baseDate);
            targetDate.setDate(baseDate.getDate() + dayNum - 1);

            const now = new Date();
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (targetDate < today) return true;
            if (targetDate > today) return false;

            // Same day logic
            const [h, m] = timeStr.split(':').map(Number);
            const actTime = new Date(now);
            actTime.setHours(h, m, 0, 0);

            return now > actTime;
        } catch (e) { return false; }
    };

    // ... (keep lines 34-486 same, just ensure we update the header) ...
    // Actually, I can't skip lines in 'ReplacementContent' unless I use separate chunks or match exact context.
    // I will use a smaller chunk for the state and another for the header.

    useEffect(() => {
        const generateItinerary = async () => {
            if (tripData.preGeneratedItinerary) {
                setItinerary(tripData.preGeneratedItinerary);
                setIsLoading(false);
                return;
            }

            try {
                const days = tripData.duration || 3;
                const states = (tripData.locations && tripData.locations.length > 0) ? tripData.locations : (tripData.location ? [tripData.location] : ['Kuala Lumpur']);

                // Fetch attractions for all locations
                const attractionsPromises = states.map(state => getAttractions({ state }));
                const attractionsArrays = await Promise.all(attractionsPromises);

                // Create a map of state -> attractions
                const stateAttractions = {};
                states.forEach((state, index) => {
                    // Map API data to expected format if needed, but it should be compatible
                    // Ensure we have coords array [lat, lng]
                    stateAttractions[state] = attractionsArrays[index].map(attr => ({
                        ...attr,
                        coords: attr.latitude && attr.longitude ? [attr.latitude, attr.longitude] : null,
                        // Ensure category/type are present
                        category: attr.category || (attr.type === 'food' ? 'Food' : 'Activity'),
                        type: attr.type || 'activity'
                    }));
                });

                const generated = [];
                const usedActivityIds = new Set();
                const userSelectedActivities = tripData.activities || [];

                // 1. Mark user selected IDs as used
                userSelectedActivities.forEach(a => {
                    if (a && a.id) usedActivityIds.add(a.id);
                });

                const findActivity = (state, category, type, nearCoords = null) => {
                    // Use fetched attractions instead of STATE_ACTIVITIES
                    const stateSpecific = stateAttractions[state] || STATE_ACTIVITIES[state] || [];
                    let pool = [...stateSpecific];

                    let candidates = pool.filter(a =>
                        (a.category === category || a.type === type) && !usedActivityIds.has(a.id)
                    );

                    if (candidates.length === 0) {
                        candidates = pool.filter(a => !usedActivityIds.has(a.id));
                    }

                    if (candidates.length > 0) {
                        if (nearCoords) {
                            candidates.sort((a, b) => {
                                const distA = a.coords ? Math.sqrt(Math.pow(a.coords[0] - nearCoords[0], 2) + Math.pow(a.coords[1] - nearCoords[1], 2)) : Infinity;
                                const distB = b.coords ? Math.sqrt(Math.pow(b.coords[0] - nearCoords[0], 2) + Math.pow(b.coords[1] - nearCoords[1], 2)) : Infinity;
                                return distA - distB;
                            });
                        }
                        const selected = candidates[0];
                        usedActivityIds.add(selected.id);
                        return { ...selected, state };
                    }
                    return null;
                };

                const getNearbySpots = (state, currentId, count = 2) => {
                    // Use fetched attractions instead of STATE_ACTIVITIES
                    const stateSpecific = stateAttractions[state] || STATE_ACTIVITIES[state] || [];
                    return stateSpecific
                        .filter(a => a.id !== currentId && !usedActivityIds.has(a.id))
                        .slice(0, count);
                };

                // Distribute states across days
                const daysPerState = Math.ceil(days / states.length);

                for (let day = 1; day <= days; day++) {
                    const stateIdx = Math.min(states.length - 1, Math.floor((day - 1) / daysPerState));
                    const state = states[stateIdx];
                    let dailyPlan = [];

                    // Default slots
                    let slots = [
                        { time: '09:00', label: 'Morning Adventure', category: 'Nature', type: 'activity' },
                        { time: '13:00', label: 'Local Lunch', category: 'Food', type: 'food' },
                        { time: '15:30', label: 'Afternoon Discovery', category: 'Cultural', type: 'activity' },
                        { time: '19:30', label: 'Evening Vibe', category: 'Food', type: 'food' }
                    ];

                    // Adjust slots for Last Day (Check-out first)
                    if (day === days) {
                        slots = [
                            { time: '13:00', label: 'Farewell Lunch', category: 'Food', type: 'food' },
                            { time: '15:00', label: 'Last Minute Shopping', category: 'Shopping', type: 'activity' }
                        ];
                    }

                    slots.forEach((slot, sIdx) => {
                        // Priority 1: User chose something for THIS DAY and roughly this time?
                        const userMatch = userSelectedActivities.find(a => {
                            if (!a || !a.time) return false;
                            if (a.day !== day) return false; // MUST MATCH DAY
                            try {
                                const [h] = a.time.split(':').map(Number);
                                const [slotH] = slot.time.split(':').map(Number);
                                return Math.abs(h - slotH) <= 2 && !dailyPlan.find(dp => dp.id === a.id);
                            } catch (e) { return false; }
                        });

                        let act = userMatch;
                        // Only auto-fill if NO activities were selected by the user for the entire trip
                        // This ensures manual picks are respected strictly.
                        if (!act && (!userSelectedActivities || userSelectedActivities.length === 0)) {
                            act = findActivity(state, slot.category, slot.type);
                        }

                        if (act) {
                            // Add transport if not first slot
                            if (dailyPlan.length > 0) {
                                dailyPlan.push({
                                    id: `trans-${day}-${sIdx}`,
                                    type: 'transport',
                                    method: tripData.transport === 'public' ? 'Public Transport' : 'Grab / Car',
                                    duration: '20 mins',
                                    price: tripData.transport === 'public' ? 5 : 18,
                                    time: slot.time
                                });
                            }

                            // Inject Nearby spots for richer UI
                            const nearby = getNearbySpots(state, act.id);
                            dailyPlan.push({
                                ...act,
                                time: act.time || slot.time,
                                nearbySpots: nearby
                            });
                        }
                    });

                    // Standard Check-in/Check-out Logic
                    const hotel = (tripData.accommodation && (tripData.accommodation[day] || tripData.accommodation[1])) || { name: 'Selected Hotel' };

                    // Day 1: Check-in
                    if (day === 1) {
                        dailyPlan.push({
                            id: `checkin-${day}`,
                            type: 'accommodation',
                            category: 'Logistics',
                            name: `Check-in: ${hotel.name}`,
                            time: '15:00',
                            duration: 1,
                            image: hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000'
                        });
                    }

                    // Last Day: Check-out (Must be first)
                    if (day === days) {
                        dailyPlan.push({
                            id: `checkout-${day}`,
                            type: 'accommodation',
                            category: 'Logistics',
                            name: `Check-out: ${hotel.name}`,
                            time: '10:00',
                            duration: 1,
                            image: hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000'
                        });
                    }

                    // All Days except Last: Back to Hotel
                    if (day < days) {
                        dailyPlan.push({
                            id: `back-${day}`,
                            type: 'accommodation',
                            category: 'Logistics',
                            name: `Back to ${hotel.name}`,
                            time: '22:00',
                            duration: 0,
                            image: hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000'
                        });
                    }

                    // Append any user selected activities for this day that didn't match a slot
                    userSelectedActivities
                        .filter(a => a.day === day && !dailyPlan.find(dp => dp.id === a.id))
                        .forEach(a => {
                            dailyPlan.push({ ...a, nearbySpots: getNearbySpots(state, a.id) });
                        });

                    // Sort tasks by time
                    dailyPlan.sort((a, b) => {
                        if (!a.time) return 1;
                        if (!b.time) return -1;
                        const [h1, m1] = a.time.split(':').map(Number);
                        const [h2, m2] = b.time.split(':').map(Number);
                        return (h1 * 60 + m1) - (h2 * 60 + m2);
                    });

                    generated.push({ day, state, activities: dailyPlan });
                }

                setItinerary(generated);
                setIsLoading(false);
            } catch (err) {
                console.error("Itinerary generation failed:", err);
                setItinerary([]);
                setIsLoading(false);
            }
        };

        generateItinerary();
    }, [tripData]);

    const handleRemoveActivity = (dayIndex, activityId) => {
        const newItinerary = [...itinerary];
        newItinerary[dayIndex].activities = newItinerary[dayIndex].activities.filter(a => a.id !== activityId);
        setItinerary(newItinerary);
    };

    const handleSaveTrip = () => {
        const savedTrips = JSON.parse(localStorage.getItem('my_trips') || '[]');
        const newTrip = {
            id: Date.now(),
            ...tripData,
            itinerary,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('my_trips', JSON.stringify([...savedTrips, newTrip]));
        alert('Trip saved to My Trips! 🇲🇾');
        navigate('/trips');
    };

    const renderAdvice = () => {
        const state = (tripData.locations && tripData.locations.length > 0) ? tripData.locations[0] : (tripData.location || 'Kuala Lumpur');
        const advice = TRAVEL_ADVICE[state] || TRAVEL_ADVICE['General'] || [];

        return (
            <div className="mb-10">
                <div className="flex items-center gap-2 mb-6">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Info className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-black text-xl tracking-tight">Pro Tips for {state}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {advice.slice(0, 2).map((adv, i) => (
                        <div key={i} className="bg-muted/30 p-5 rounded-[28px] border border-muted/50 group hover:border-primary/20 transition-all">
                            <h4 className="font-black text-[10px] text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Sparkles className="h-3.5 w-3.5" /> {adv.title}
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed font-medium">{adv.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Handler to initiate adding a mini-gem
    const handleAddMiniGemClick = (spot, dayIndex, activityIndex) => {
        setPendingMiniGem({ spot, dayIndex, activityIndex });
        setMiniGemDuration(spot.duration || 1); // Set default from spot or 1 hour
        setShowAddMiniGemDialog(true);
    };

    // Handler to confirm mini-gem addition
    const confirmAddMiniGem = () => {
        if (!pendingMiniGem) return;

        const { spot, dayIndex, activityIndex } = pendingMiniGem;

        // Create a copy of the itinerary
        const newItinerary = JSON.parse(JSON.stringify(itinerary));

        // Get the current activity and its time
        const currentActivity = newItinerary[dayIndex].activities[activityIndex];
        const currentTime = currentActivity.time;

        // Parse the time (e.g., "09:00" -> {hours: 9, minutes: 0})
        const [hours, minutes] = currentTime.split(':').map(Number);
        const currentActivityDuration = currentActivity.duration || 2;

        // Calculate new time for mini-gem (right after current activity)
        const miniGemStartMinutes = hours * 60 + minutes + (currentActivityDuration * 60);
        const miniGemHours = Math.floor(miniGemStartMinutes / 60) % 24;
        const miniGemMinutes = miniGemStartMinutes % 60;
        const miniGemTime = `${String(miniGemHours).padStart(2, '0')}:${String(miniGemMinutes).padStart(2, '0')}`;

        // Create the mini-gem activity with proper structure
        const miniGemActivity = {
            ...spot,
            time: miniGemTime,
            duration: miniGemDuration, // Use user's input duration
            day: dayIndex + 1
        };

        // Insert the mini-gem after the current activity
        newItinerary[dayIndex].activities.splice(activityIndex + 1, 0, miniGemActivity);

        // Adjust times for all subsequent activities on that day
        for (let i = activityIndex + 2; i < newItinerary[dayIndex].activities.length; i++) {
            const activity = newItinerary[dayIndex].activities[i];
            if (activity.type !== 'transport') {
                const [actHours, actMinutes] = activity.time.split(':').map(Number);
                const actStartMinutes = actHours * 60 + actMinutes + (miniGemDuration * 60);
                const newHours = Math.floor(actStartMinutes / 60) % 24;
                const newMinutes = actStartMinutes % 60;
                activity.time = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
            }
        }

        // Update the state
        setItinerary(newItinerary);
        setShowAddMiniGemDialog(false);
        setPendingMiniGem(null);
    };

    // Handler to move activity up or down
    const handleMoveActivity = (dayIndex, activityIndex, direction) => {
        const newItinerary = JSON.parse(JSON.stringify(itinerary));
        const dayActivities = newItinerary[dayIndex].activities;

        // Swap with previous or next activity
        const targetIndex = activityIndex + direction; // -1 for up, +1 for down

        // Check bounds
        if (targetIndex < 0 || targetIndex >= dayActivities.length) return;

        // Determine effective swap
        // We need to find the correct index in the array, skipping 'transport' types for UI logic, 
        // BUT the array contains transport items too.
        // The UI renders transport items separately.
        // However, simplify: Just swap in the array.
        // If the adjacent item is a 'transport', we might need to swap past it or swap WITH it?
        // Actually, transport items are usually between activities. 
        // If we move Activity A down past Activity B, we might also need to move the Transport between A and B?
        // This is complex.
    };

    const handleReorderActivities = (dayIndex, newOrder) => {
        // Save original only if we don't have a pending one (first move in a session)
        if (!pendingReorderData) {
            setPendingReorderData({
                dayIndex,
                originalOrder: [...itinerary[dayIndex].activities]
            });
        }

        const newItinerary = [...itinerary];
        newItinerary[dayIndex].activities = newOrder;
        setItinerary(newItinerary);

        // We don't show the modal here yet to avoid interrupting the drag.
        // It will be shown on onDragEnd.
    };

    const handleReorderConfirm = () => {
        if (!pendingReorderData) return;

        const { dayIndex } = pendingReorderData;
        const newItinerary = [...itinerary];
        const day = newItinerary[dayIndex];

        // "Bring along logistics" - Recalculate transport and times
        const activitiesOnly = day.activities.filter(a => a.type !== 'transport');

        let dailyPlan = [];
        let currentTime = activitiesOnly[0]?.time || '09:00';

        activitiesOnly.forEach((act, idx) => {
            if (idx > 0) {
                // Add fresh transport item
                dailyPlan.push({
                    id: `trans-${day.day}-${idx}-${Date.now()}`,
                    type: 'transport',
                    method: tripData.transport === 'public' ? 'Public Transport' : 'Grab / Car',
                    duration: '20 mins',
                    price: tripData.transport === 'public' ? 5 : 18,
                    time: currentTime
                });
            }

            // Sync activity time based on previous activity duration (simple ripple)
            act.time = currentTime;
            dailyPlan.push(act);

            // Calculate next start time
            const [h, m] = currentTime.split(':').map(Number);
            const duration = act.duration || 2;
            const transportMinutes = idx < activitiesOnly.length - 1 ? 30 : 0; // 30 min buffer/transport
            const totalMinutes = h * 60 + m + (duration * 60) + transportMinutes;

            const nextH = Math.floor(totalMinutes / 60) % 24;
            const nextM = totalMinutes % 60;
            currentTime = `${String(nextH).padStart(2, '0')}:${String(nextM).padStart(2, '0')}`;
        });

        newItinerary[dayIndex].activities = dailyPlan;
        setItinerary(newItinerary);
        setPendingReorderData(null);
        setShowReorderConfirm(false);

        setItineraryAlert("Route updated & logistics synchronized! 🚚");
        setTimeout(() => setItineraryAlert(null), 4000);
    };

    const handleReorderCancel = () => {
        if (!pendingReorderData) return;

        const { dayIndex, originalOrder } = pendingReorderData;
        const newItinerary = [...itinerary];
        newItinerary[dayIndex].activities = originalOrder;

        setItinerary(newItinerary);
        setPendingReorderData(null);
        setShowReorderConfirm(false);
    };

    const handleDurationChange = (dayIndex, activityIndex, newDuration) => {
        const newItinerary = JSON.parse(JSON.stringify(itinerary));
        const activity = newItinerary[dayIndex].activities[activityIndex];
        const oldDuration = activity.duration || 2;

        activity.duration = newDuration;
        const timeDiffMinutes = (newDuration - oldDuration) * 60;

        for (let i = activityIndex + 1; i < newItinerary[dayIndex].activities.length; i++) {
            const nextActivity = newItinerary[dayIndex].activities[i];
            if (nextActivity.type !== 'transport' && nextActivity.time) {
                const [hours, minutes] = nextActivity.time.split(':').map(Number);
                const currentMinutes = hours * 60 + minutes;
                const newMinutes = currentMinutes + timeDiffMinutes;
                const newHours = Math.floor(newMinutes / 60) % 24;
                const newMins = newMinutes % 60;
                nextActivity.time = `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
            }
        }
        setItinerary(newItinerary);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-background">
                <div className="relative mb-8">
                    <div className="h-24 w-24 rounded-[32px] border-4 border-primary/20 border-t-primary animate-spin"></div>
                    <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-black tracking-tighter text-foreground mb-3">Crafting your Malaysian Story...</h2>
                <p className="text-muted-foreground max-w-xs font-medium leading-relaxed">Analyzing your preferences and checking traffic patterns in {tripData.locations?.length > 1 ? `${tripData.locations[0]} and others` : (tripData.locations?.[0] || tripData.location || 'Malaysia')}.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-8 pb-32">
            {/* Header */}
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="p-0 h-auto hover:bg-transparent text-primary font-black text-[10px] tracking-[0.2em] flex items-center gap-2 mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" /> CHANGE PLAN
                    </Button>
                    <h1 className="text-5xl font-black text-foreground tracking-tighter leading-none">
                        {(tripData.locations && tripData.locations.length > 0)
                            ? (tripData.locations.length > 1 ? `${tripData.locations[0]} & ${tripData.locations.length - 1} more` : tripData.locations[0])
                            : (tripData.location || "Malaysian Story")}
                    </h1>
                    <div className="flex items-center gap-3">
                        {isPreview ? (
                            <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center gap-2">
                                <Info className="h-3 w-3 text-blue-500" />
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Preview Mode</span>
                            </div>
                        ) : (
                            <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Optimized for you</span>
                            </div>
                        )}
                        <span className="text-sm font-bold text-muted-foreground">Generated {new Date().toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Header Controls moved to bottom */}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Itinerary Column */}
                <div className="lg:col-span-8 space-y-10">
                    {renderAdvice()}

                    <div className="space-y-8">
                        {itinerary.length > 0 ? itinerary.map((day, dIdx) => (
                            <Card key={dIdx} className="border-none bg-transparent shadow-none overflow-visible">
                                <CardHeader className="px-0 pb-6">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-primary/20">
                                                {day.day}
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black tracking-tight">{day.state}</h2>
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                    {(() => {
                                                        try {
                                                            const baseDate = tripData.date ? new Date(tripData.date) : new Date();
                                                            const displayDate = new Date(baseDate);
                                                            displayDate.setDate(baseDate.getDate() + day.day - 1);
                                                            return displayDate.toLocaleDateString('en-MY', { weekday: 'long', day: 'numeric', month: 'short' });
                                                        } catch (e) { return 'Date pending'; }
                                                    })()}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Daily Accommodation Badge */}
                                        {tripData.accommodation && tripData.accommodation[day.day] && (
                                            <div className="hidden md:flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-muted shadow-sm">
                                                <div className="h-8 w-8 rounded-lg overflow-hidden">
                                                    <img src={tripData.accommodation[day.day].image} className="h-full w-full object-cover" alt="" />
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">Night At</p>
                                                    <p className="text-xs font-bold text-primary truncate max-w-[100px]">{tripData.accommodation[day.day].name}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="px-0 relative p-0">
                                    {/* Validation Warnings */}
                                    {dayWarnings[day.day] && dayWarnings[day.day].length > 0 && (
                                        <div className="ml-28 mr-4 mb-4 space-y-2">
                                            {dayWarnings[day.day].map((warning, wIdx) => (
                                                <div
                                                    key={wIdx}
                                                    className={`flex items-center gap-3 p-3 rounded-xl border-2 ${warning.severity === 'error'
                                                        ? 'bg-red-50 border-red-200'
                                                        : 'bg-yellow-50 border-yellow-200'
                                                        }`}
                                                >
                                                    <AlertTriangle className={`h-4 w-4 flex-shrink-0 ${warning.severity === 'error' ? 'text-red-600' : 'text-yellow-600'
                                                        }`} />
                                                    <div className="flex-1">
                                                        <span className={`text-xs font-bold ${warning.severity === 'error' ? 'text-red-700' : 'text-yellow-700'
                                                            }`}>
                                                            {warning.message}
                                                        </span>
                                                        {warning.detail && (
                                                            <p className={`text-[10px] mt-0.5 ${warning.severity === 'error' ? 'text-red-600' : 'text-yellow-600'
                                                                }`}>
                                                                {warning.detail}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {/* Warnings */}
                                    {(day.activities && day.activities.filter(a => a.type !== 'transport').length > ITINERARY_RULES.warningThresholds.busyDay && !dismissedAlerts[`busy-${dIdx}`]) && (
                                        <div className="ml-28 mr-4 mb-6 bg-orange-50 border border-orange-200 p-4 rounded-2xl flex items-start gap-3 relative z-10 shadow-sm animate-in zoom-in-95">
                                            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                                <AlertTriangle className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-xs font-black text-orange-800 uppercase tracking-widest mb-1">Busy Day Alert</h4>
                                                <p className="text-sm text-orange-700 font-medium">You have many activities planned. Consider moving some to another day.</p>
                                            </div>
                                            <button
                                                onClick={() => setDismissedAlerts(prev => ({ ...prev, [`busy-${dIdx}`]: true }))}
                                                className="h-6 w-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center hover:bg-orange-200 transition-colors"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    )}
                                    {(() => {
                                        const dayCost = day.activities.reduce((sum, a) => sum + (a.price || 0), 0);
                                        if (dayCost > BUDGET_DEFAULTS.foodPerDay.high + BUDGET_DEFAULTS.transportPerDay.high + 200) { // Arbitrary daily high limit
                                            return (
                                                <div className="mx-4 mb-6 bg-red-50 border border-red-200 p-4 rounded-2xl flex items-start gap-3">
                                                    <div className="p-2 bg-red-100 rounded-lg text-red-600">
                                                        <DollarSign className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-black text-red-800 uppercase tracking-widest mb-1">High Spending</h4>
                                                        <p className="text-sm text-red-700 font-medium">Day total (RM {dayCost}) exceeds typical daily budget. Check your expenses.</p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}

                                    <div className="absolute left-[75px] top-0 bottom-0 w-1 bg-gradient-to-b from-primary/30 via-primary/20 to-transparent"></div>
                                    <Reorder.Group
                                        axis="y"
                                        values={day.activities || []}
                                        onReorder={(newOrder) => handleReorderActivities(dIdx, newOrder)}
                                        className="space-y-12"
                                    >
                                        {day.activities && day.activities.filter(a => a.type !== 'transport').map((activity, aIdx, filteredArr) => (
                                            <Reorder.Item
                                                key={activity.id + aIdx}
                                                value={activity}
                                                className="relative pl-28"
                                                onDragEnd={() => {
                                                    if (pendingReorderData) {
                                                        setShowReorderConfirm(true);
                                                    }
                                                }}
                                            >
                                                <div className="group/item">
                                                    {/* Time & Dot Indicator */}
                                                    <div className="absolute left-2 top-6 w-14 text-right">
                                                        <span className="text-xs font-black text-muted-foreground">{activity.time}</span>
                                                    </div>
                                                    <div className="absolute left-[71px] top-6 h-3 w-3 rounded-full bg-primary ring-4 ring-background z-10 shadow-[0_0_15px_rgba(var(--primary),0.3)]"></div>

                                                    {/* Activity Card */}
                                                    <div className={`space-y-4 transition-opacity duration-500 ${isActivityPast(day.day, activity.time) ? 'opacity-50 grayscale' : ''}`}>
                                                        <div
                                                            className="bg-card p-6 rounded-[32px] border-2 border-muted hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all flex flex-col md:flex-row gap-6 cursor-pointer relative"
                                                            onClick={() => setSelectedActivity(activity)}
                                                        >
                                                            <button
                                                                className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all z-20 shadow-lg"
                                                                onClick={(e) => { e.stopPropagation(); handleRemoveActivity(dIdx, activity.id); }}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>

                                                            {activity.image && (
                                                                <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden shrink-0 shadow-sm border-4 border-background">
                                                                    <img src={activity.image} alt={activity.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700" />
                                                                </div>
                                                            )}

                                                            <div className="flex-1 space-y-3">
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{activity.category}</span>
                                                                        </div>
                                                                        <h3 className="text-2xl font-black tracking-tight group-hover/item:text-primary transition-colors">{activity.name}</h3>
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 bg-yellow-400/10 text-yellow-700 px-3 py-1 rounded-full text-xs font-black ring-1 ring-yellow-400/20">
                                                                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                                                        {activity.rating || 4.7}
                                                                    </div>
                                                                </div>

                                                                <div className="flex flex-wrap gap-4 pt-2">
                                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                                                                        <DollarSign className="h-3.5 w-3.5 text-primary" />
                                                                        {activity.category === 'Logistics' ? 'Included' : `${formatPrice(activity.price || 0)} / pax`}
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                                                                        <Clock className="h-3.5 w-3.5 text-primary" />
                                                                        {activity.category !== 'Logistics' ? (
                                                                            <div className="flex items-center gap-1 bg-muted/30 rounded-lg px-2 py-1">
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        const currentDuration = activity.duration || 2;
                                                                                        if (currentDuration > 0.5) {
                                                                                            handleDurationChange(dIdx, aIdx, currentDuration - 0.5);
                                                                                        }
                                                                                    }}
                                                                                    className="h-5 w-5 rounded bg-white hover:bg-primary hover:text-white text-primary flex items-center justify-center transition-colors"
                                                                                    title="Decrease duration"
                                                                                >
                                                                                    <span className="text-xs font-black">-</span>
                                                                                </button>
                                                                                <input
                                                                                    type="number"
                                                                                    value={activity.duration || 2}
                                                                                    onChange={(e) => {
                                                                                        e.stopPropagation();
                                                                                        const newVal = parseFloat(e.target.value);
                                                                                        if (newVal > 0 && newVal <= 12) {
                                                                                            handleDurationChange(dIdx, aIdx, newVal);
                                                                                        }
                                                                                    }}
                                                                                    onClick={(e) => e.stopPropagation()}
                                                                                    className="w-10 text-center bg-transparent font-bold text-xs outline-none"
                                                                                    min="0.5"
                                                                                    max="12"
                                                                                    step="0.5"
                                                                                />
                                                                                <span className="text-xs">hrs</span>
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        const currentDuration = activity.duration || 2;
                                                                                        if (currentDuration < 12) {
                                                                                            handleDurationChange(dIdx, aIdx, currentDuration + 0.5);
                                                                                        }
                                                                                    }}
                                                                                    className="h-5 w-5 rounded bg-white hover:bg-primary hover:text-white text-primary flex items-center justify-center transition-colors"
                                                                                    title="Increase duration"
                                                                                >
                                                                                    <span className="text-xs font-black">+</span>
                                                                                </button>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                                                                                {activity.id === 'check-out' ? (
                                                                                    <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] uppercase font-black">Departure</span>
                                                                                ) : activity.id.startsWith('back-') ? (
                                                                                    <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px] uppercase font-black">Overnight • Rest</span>
                                                                                ) : (
                                                                                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] uppercase font-black">Settling In</span>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                                                                        <MapPin className="h-3.5 w-3.5 text-primary" />
                                                                        {activity.state}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Nearby Suggestions Section */}
                                                        {activity.nearbySpots?.length > 0 && (
                                                            <div className="pl-4 pb-4">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                                                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Nearby Mini-Gems</span>
                                                                </div>
                                                                <div className="flex gap-4 overflow-x-auto pb-4 pt-4 no-scrollbar">
                                                                    {activity.nearbySpots.map((spot, ridx) => (
                                                                        <div
                                                                            key={ridx}
                                                                            className="shrink-0 w-56 bg-muted/20 hover:bg-muted/40 p-3 rounded-2xl border border-muted/50 transition-all flex gap-3 items-center group/spot relative"
                                                                        >
                                                                            {/* Add Button */}
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleAddMiniGemClick(spot, dIdx, aIdx);
                                                                                }}
                                                                                className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
                                                                                title="Add to itinerary"
                                                                            >
                                                                                <Plus className="h-4 w-4" />
                                                                            </button>

                                                                            <div
                                                                                className="flex gap-3 items-center flex-1 cursor-pointer"
                                                                                onClick={() => setSelectedActivity(spot)}
                                                                            >
                                                                                <img src={spot.image} className="h-12 w-12 rounded-xl object-cover shadow-sm" alt="" />
                                                                                <div className="flex-1 overflow-hidden">
                                                                                    <p className="text-xs font-black truncate">{spot.name}</p>
                                                                                    <div className="flex items-center gap-1">
                                                                                        <Star className="h-2.5 w-2.5 fill-yellow-500 text-yellow-500" />
                                                                                        <span className="text-[9px] font-bold text-muted-foreground">{spot.rating} • {spot.category}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Static Transport Card (Connector) */}
                                                {aIdx < filteredArr.length - 1 && (
                                                    <div className="py-8 ml-0">
                                                        {tripData.transportMode === 'public' ? (
                                                            <div className="bg-emerald-50/50 border-2 border-dashed border-emerald-200 rounded-[32px] p-5 transition-all">
                                                                <div className="flex items-start gap-4">
                                                                    <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                                                                        <Bus className="h-5 w-5" />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center justify-between mb-0.5">
                                                                            <p className="text-[9px] font-black text-emerald-900 uppercase tracking-[0.2em]">Public Transport</p>
                                                                            <span className="text-[10px] font-black text-emerald-700">RM 5.00</span>
                                                                        </div>
                                                                        <h4 className="text-sm font-black text-emerald-800">Trip towards next stop</h4>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="bg-orange-50/50 border-2 border-dashed border-orange-200 rounded-[32px] p-5 transition-all">
                                                                <div className="flex items-start gap-4">
                                                                    <div className="h-10 w-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md">
                                                                        <Car className="h-5 w-5" />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center justify-between mb-0.5">
                                                                            <p className="text-[9px] font-black text-orange-900 uppercase tracking-[0.2em]">Grab / Car</p>
                                                                            <span className="text-[10px] font-black text-orange-700">~RM 18.00</span>
                                                                        </div>
                                                                        <h4 className="text-sm font-black text-orange-800">Trip towards next stop</h4>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </Reorder.Item>
                                        ))}
                                    </Reorder.Group>
                                </CardContent>
                            </Card>
                        ))
                            : (
                                <div className="py-20 text-center">
                                    <h3 className="text-2xl font-black opacity-40">No itinerary generated.</h3>
                                    <Button onClick={() => navigate('/trips/create')} className="mt-4 rounded-xl">Try Re-building</Button>
                                </div>
                            )}
                    </div>
                </div>

                {/* Sticky Sidebar Map & Summary */}
                {showMap && (
                    <div className="lg:col-span-4" ref={mapRef}>
                        <div className="sticky top-10 space-y-8">
                            {/* Map View */}
                            <div className="rounded-[40px] overflow-hidden border-8 border-background shadow-2xl relative h-80">
                                {/* Pass items with isPast flag */}
                                <TripMap items={itinerary.map(day => ({
                                    ...day,
                                    activities: day.activities?.map(act => ({
                                        ...act,
                                        isPast: isActivityPast(day.day, act.time)
                                    }))
                                }))} />
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-md px-6 py-2 rounded-full border border-primary/20 shadow-xl">
                                    <span className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                        <MapPin className="h-3 w-3" /> Map Active
                                    </span>
                                </div>
                            </div>

                            {/* Bill Splitter & Crew Management */}
                            <Card className="rounded-[40px] border-none bg-white shadow-2xl overflow-hidden border-2 border-muted">
                                <CardHeader className="bg-muted/30 pb-6 p-8">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                            <Users className="h-4 w-4 text-primary" /> Trip Members
                                        </CardTitle>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full bg-primary/10 text-primary" onClick={() => navigate('/trips/expenses')}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="flex -space-x-4">
                                        {tripMembers.map((m, i) => (
                                            <div key={i} className="h-12 w-12 rounded-full border-4 border-white bg-primary/10 flex items-center justify-center text-xs font-black ring-2 ring-primary/5">
                                                {m[0]}
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => navigate('/trips/expenses')}
                                            className="h-12 w-12 rounded-full border-4 border-white bg-muted flex items-center justify-center text-xs font-black hover:bg-primary/10 transition-colors"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="h-px bg-muted w-full"></div>
                                    <Button
                                        onClick={() => navigate('/trips/expenses')}
                                        className="w-full h-16 bg-primary text-white rounded-3xl font-black shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all active:scale-95"
                                    >
                                        <DollarSign className="h-5 w-5" /> GO TO BILL SPLITTER
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Accommodation Info */}
                            {tripData.accommodation && Object.keys(tripData.accommodation).length > 0 && (
                                <Card className="rounded-[40px] border-none bg-white shadow-2xl overflow-hidden border-2 border-muted">
                                    <CardContent className="p-8 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">Your Stay</div>
                                            {(() => {
                                                const firstStay = tripData.accommodation[1];
                                                const isMixed = Object.values(tripData.accommodation).some(s => s.id !== firstStay?.id);
                                                if (!isMixed && firstStay) {
                                                    return (
                                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-600 text-[10px] font-black">
                                                            <Star className="h-3 w-3 fill-current" /> {firstStay.rating}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })()}
                                        </div>

                                        {(() => {
                                            const firstStay = tripData.accommodation[1];
                                            const isMixed = Object.values(tripData.accommodation).some(s => s.id !== firstStay?.id);

                                            if (isMixed) {
                                                return (
                                                    <div className="flex gap-5 items-center">
                                                        <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                                                            <MapPin className="h-8 w-8 text-primary" />
                                                        </div>
                                                        <div className="flex-1 flex flex-col justify-center">
                                                            <h3 className="font-black text-lg text-primary tracking-tight leading-tight">Multiple Stays</h3>
                                                            <p className="text-xs font-bold text-muted-foreground">Check itinerary for daily details</p>
                                                        </div>
                                                    </div>
                                                );
                                            } else if (firstStay) {
                                                return (
                                                    <>
                                                        <div className="flex gap-5">
                                                            <img src={firstStay.image} className="h-20 w-20 rounded-2xl object-cover shadow-sm" alt="" />
                                                            <div className="flex-1 flex flex-col justify-center">
                                                                <h3 className="font-black text-lg text-primary tracking-tight leading-tight">{firstStay.name}</h3>
                                                                <p className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                                                                    <MapPin className="h-3 w-3 opacity-40" /> {firstStay.location}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="pt-4 border-t border-muted flex justify-between items-center">
                                                            <p className="font-black text-primary">RM {firstStay.price}<span className="text-[10px] font-bold opacity-40 ml-1">/ NIGHT</span></p>
                                                            <div className="px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest">Full Trip</div>
                                                        </div>
                                                    </>
                                                );
                                            }
                                            return null;
                                        })()}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Transport Info */}
                            {tripData.transportMode && (
                                <Card className="rounded-[40px] border-none bg-white shadow-2xl overflow-hidden border-2 border-muted">
                                    <CardContent className="p-8 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">
                                                {tripData.transportMode === 'own' ? 'Transport Costs' : 'Route Guide'}
                                            </div>
                                            <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${tripData.transportMode === 'own' ? 'bg-primary/10' : 'bg-emerald-500/10'
                                                }`}>
                                                {tripData.transportMode === 'own' ? (
                                                    <Car className="h-5 w-5 text-primary" />
                                                ) : (
                                                    <Bus className="h-5 w-5 text-emerald-600" />
                                                )}
                                            </div>
                                        </div>

                                        {tripData.transportMode === 'own' ? (
                                            /* Own Transport - Show Toll + Gas Estimates */
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center bg-muted/20 p-4 rounded-2xl">
                                                    <span className="text-sm font-bold text-muted-foreground">Est. Toll</span>
                                                    <span className="font-black text-primary">RM {TRANSPORT_ESTIMATES.ownTransport.toll.default * (tripData.locations?.length || 1)}</span>
                                                </div>
                                                <div className="flex justify-between items-center bg-muted/20 p-4 rounded-2xl">
                                                    <span className="text-sm font-bold text-muted-foreground">Est. Gas</span>
                                                    <span className="font-black text-primary">
                                                        RM {(TRANSPORT_ESTIMATES.ownTransport.gas.perKm * TRANSPORT_ESTIMATES.ownTransport.gas.avgDistance * (tripData.locations?.length || 1)).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="pt-4 border-t border-muted">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs font-black uppercase text-muted-foreground">Total Transport</span>
                                                        <span className="text-xl font-black text-primary">
                                                            RM {(
                                                                TRANSPORT_ESTIMATES.ownTransport.toll.default * (tripData.locations?.length || 1) +
                                                                TRANSPORT_ESTIMATES.ownTransport.gas.perKm * TRANSPORT_ESTIMATES.ownTransport.gas.avgDistance * (tripData.locations?.length || 1)
                                                            ).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Public Transport - Show Routes */
                                            <div className="space-y-3">
                                                {tripData.locations?.map((state, index) => (
                                                    <div key={state} className="space-y-2">
                                                        <p className="text-xs font-black uppercase text-muted-foreground">{state}</p>
                                                        <p className="text-sm font-bold text-foreground leading-relaxed">
                                                            {TRANSPORT_ESTIMATES.publicTransport.routes[state] || TRANSPORT_ESTIMATES.publicTransport.routes.default}
                                                        </p>
                                                        {index < (tripData.locations?.length || 0) - 1 && (
                                                            <div className="mt-2 pt-2 border-t border-dashed border-muted">
                                                                <p className="text-xs font-black text-primary opacity-60">TO NEXT STATE</p>
                                                                <p className="text-xs font-bold text-muted-foreground">
                                                                    {TRANSPORT_ESTIMATES.publicTransport.interState.default}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Trip Strategy Summary */}
                            <Card className="rounded-[40px] border-none bg-[#0a0a0a] text-white shadow-2xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                <CardContent className="p-8 space-y-6">
                                    <h3 className="text-xl font-black tracking-tight uppercase tracking-widest text-[11px] opacity-70">Strategy Summary</h3>

                                    <div className="space-y-4 pt-2">
                                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="h-5 w-5 opacity-60" />
                                                <span className="text-sm font-bold opacity-80">Duration</span>
                                            </div>
                                            <span className="font-black text-xl">{tripData.duration || 3} Days</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <Users className="h-5 w-5 opacity-60" />
                                                <span className="text-sm font-bold opacity-80">Party Size</span>
                                            </div>
                                            <span className="font-black text-xl">{tripData.guests || 2} Pax</span>
                                        </div>
                                    </div>

                                    <div className="h-px bg-white/10 w-full"></div>

                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Estimated Cost</span>
                                            <p className="text-3xl font-black">{formatPrice(
                                                (itinerary.reduce((acc, d) => acc + (d.activities ? d.activities.reduce((a, s) => a + (s.price || 0), 0) : 0), 0) +
                                                    (tripData.accommodation ? Object.values(tripData.accommodation).reduce((acc, stay) => acc + (stay.price || 0), 0) : 0)) * (tripData.guests || 1)
                                            )}</p>
                                        </div>
                                        <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center">
                                            <DollarSign className="h-6 w-6" />
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        {isPreview ? (
                                            <Button
                                                onClick={handleStartPlanning}
                                                className="w-full h-14 bg-white text-primary hover:bg-white/90 rounded-[28px] font-black text-xl shadow-2xl group transition-all"
                                            >
                                                Start Planning with this Template <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1.5 transition-transform" />
                                            </Button>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setShowShareModal(true)}
                                                    className="flex-1 h-14 bg-white/10 text-white border-white/10 hover:bg-white/20 rounded-[28px] font-black text-lg transition-all"
                                                >
                                                    <Share2 className="mr-2 h-5 w-5" /> Share
                                                </Button>
                                                <Button
                                                    onClick={handleSaveTrip}
                                                    className="flex-[2] h-14 bg-white text-primary hover:bg-white/90 rounded-[28px] font-black text-xl shadow-2xl group transition-all"
                                                >
                                                    Confirm Plan <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1.5 transition-transform" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                <ActivityDetailsModal
                    isOpen={!!selectedActivity}
                    onClose={() => setSelectedActivity(null)}
                    activity={selectedActivity}
                />
                {/* Bottom Buttons removed as per request (Share moved to sidebar, Save removed) */}

                {/* Mini-Gem Addition Confirmation Dialog */}
                {
                    showAddMiniGemDialog && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <Info className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tight">Add to Itinerary?</h3>
                                </div>

                                {pendingMiniGem && (
                                    <>
                                        <div className="mb-4 p-4 bg-muted/20 rounded-2xl">
                                            <p className="text-sm font-bold mb-3">Adding: {pendingMiniGem.spot.name}</p>

                                            {/* Duration Input */}
                                            <div className="mb-3">
                                                <label className="block text-xs font-bold text-muted-foreground mb-2">
                                                    How long do you want to spend here?
                                                </label>
                                                <div className="flex items-center gap-2 bg-white rounded-lg p-2">
                                                    <button
                                                        onClick={() => {
                                                            if (miniGemDuration > 0.5) {
                                                                setMiniGemDuration(miniGemDuration - 0.5);
                                                            }
                                                        }}
                                                        className="h-8 w-8 rounded bg-muted hover:bg-primary hover:text-white text-primary flex items-center justify-center transition-colors"
                                                    >
                                                        <span className="text-sm font-black">-</span>
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={miniGemDuration}
                                                        onChange={(e) => {
                                                            const val = parseFloat(e.target.value);
                                                            if (val > 0 && val <= 8) {
                                                                setMiniGemDuration(val);
                                                            }
                                                        }}
                                                        className="flex-1 text-center font-bold text-sm outline-none"
                                                        min="0.5"
                                                        max="8"
                                                        step="0.5"
                                                    />
                                                    <span className="text-sm font-bold">hours</span>
                                                    <button
                                                        onClick={() => {
                                                            if (miniGemDuration < 8) {
                                                                setMiniGemDuration(miniGemDuration + 0.5);
                                                            }
                                                        }}
                                                        className="h-8 w-8 rounded bg-muted hover:bg-primary hover:text-white text-primary flex items-center justify-center transition-colors"
                                                    >
                                                        <span className="text-sm font-black">+</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Warning Message */}
                                        <div className="mb-6 p-4 bg-orange-50 border-2 border-orange-200 rounded-2xl">
                                            <p className="text-xs text-orange-800 leading-relaxed font-bold">
                                                ⚠️ Adding this mini-gem will adjust the timing of all subsequent activities on this day.
                                                Activities will be pushed back by <span className="text-orange-600 font-black">{miniGemDuration} hour(s)</span>.
                                            </p>
                                        </div>
                                    </>
                                )}

                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowAddMiniGemDialog(false);
                                            setPendingMiniGem(null);
                                        }}
                                        className="flex-1 h-14 rounded-2xl"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={confirmAddMiniGem}
                                        className="flex-1 h-14 rounded-2xl"
                                    >
                                        Add Anyway
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )
                }
                {/* Custom Toast Notification */}
                {
                    itineraryAlert && (
                        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="bg-foreground text-background px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-md">
                                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                                <span className="text-sm font-black tracking-tight">{itineraryAlert}</span>
                            </div>
                        </div>
                    )
                }

                {/* Reorder Confirmation Dialog */}
                {
                    showReorderConfirm && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-in fade-in duration-300">
                            <div className="bg-white rounded-[40px] p-10 max-w-lg w-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-muted scale-in-center animate-in zoom-in-95 duration-300">
                                <div className="flex flex-col items-center text-center space-y-6">
                                    <div className="h-24 w-24 rounded-[32px] bg-primary/10 flex items-center justify-center animate-bounce">
                                        <Sparkles className="h-12 w-12 text-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-black tracking-tight text-foreground">Optimize Route?</h3>
                                        <p className="text-muted-foreground font-medium leading-relaxed">
                                            You've rearranged your activities. To maintain a smooth trip, we'll sync the transport logistics between your new destinations.
                                        </p>
                                    </div>

                                    <div className="w-full space-y-3 pt-4">
                                        <Button
                                            onClick={handleReorderConfirm}
                                            className="w-full h-16 rounded-3xl font-black text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all active:scale-95"
                                        >
                                            <Sparkles className="h-5 w-5" /> APPLY CHANGES & SYNC
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleReorderCancel}
                                            className="w-full h-16 rounded-3xl font-black text-lg border-2 hover:bg-muted/50 transition-all active:scale-95"
                                        >
                                            REVERT ORDER
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                {/* Share Modal */}
                {showShareModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[80] p-4 animate-in fade-in">
                        <div className="bg-white rounded-[40px] max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 relative border border-white/20">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                            <div className="p-8 text-center relative z-10">
                                <div className="h-20 w-20 bg-primary/10 rounded-[24px] flex items-center justify-center mx-auto mb-6 transform rotate-3 shadow-inner">
                                    <Sparkles className="h-10 w-10 text-primary" />
                                </div>
                                <h2 className="text-3xl font-black mb-2 tracking-tight text-foreground">Trip Ready!</h2>
                                <p className="text-muted-foreground font-medium mb-8 leading-relaxed px-4">
                                    Your adventure to <span className="text-primary font-bold">{(tripData.locations && tripData.locations.length > 0) ? tripData.locations.join(' & ') : (tripData.location || 'Malaysia')}</span> is beautifully planned.
                                </p>

                                <div className="bg-muted/30 rounded-3xl border-2 border-dashed border-primary/20 p-6 mb-8 relative">
                                    <div className="flex justify-between items-end mb-4">
                                        <div className="text-left">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Duration</p>
                                            <p className="text-xl font-black">{tripData.duration} Days</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Est. Cost</p>
                                            <p className="text-2xl font-black text-primary">
                                                {(() => {
                                                    const total = itinerary.reduce((sum, day) => {
                                                        return sum + (day.activities?.reduce((dSum, act) => dSum + (act.price || 0), 0) || 0);
                                                    }, 0);
                                                    return formatPrice(total * (tripData.guests || 1));
                                                })()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-white rounded-full overflow-hidden shadow-sm">
                                        <div className="h-full bg-primary w-2/3 rounded-full"></div>
                                    </div>
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-3 text-[10px] font-black text-primary/60 uppercase tracking-widest border border-primary/10 rounded-full">Summary</div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Button size="lg" className="rounded-2xl font-black h-14 text-base" onClick={() => setShowShareModal(false)}>
                                        COPY LINK
                                    </Button>
                                    <Button variant="outline" size="lg" className="rounded-2xl font-black h-14 text-base border-2 hover:bg-muted" onClick={() => setShowShareModal(false)}>
                                        CLOSE
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Preview Confirmation Dialog */}
                {showEditConfirm && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[80] p-4 animate-in fade-in">
                        <div className="bg-white rounded-[40px] max-w-md w-full overflow-hidden shadow-2xl p-8 text-center border border-white/20">
                            <div className="h-20 w-20 bg-primary/10 rounded-[24px] flex items-center justify-center mx-auto mb-6 transform -rotate-3 shadow-inner">
                                <Sparkles className="h-10 w-10 text-primary" />
                            </div>
                            <h2 className="text-2xl font-black mb-3 text-foreground">Customize this Trip?</h2>
                            <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
                                This will create an editable copy of this itinerary for you. You can then add, remove, and reorder activities.
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowEditConfirm(false)}
                                    className="flex-1 h-12 rounded-2xl font-black"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={confirmStartPlanning}
                                    className="flex-1 h-12 rounded-2xl font-black bg-primary text-white hover:bg-primary/90"
                                >
                                    Yes, Let's Go!
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
