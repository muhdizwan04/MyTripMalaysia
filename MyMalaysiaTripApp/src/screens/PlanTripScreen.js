import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Modal, Platform, Alert, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
    ChevronRight, ChevronLeft, MapPin, Calendar, Users,
    Check, Star, Utensils, Camera, ShoppingBag, Compass,
    Clock, Bus, Car, X, Plus, Info, Building, Home, Bed, Sparkles, ArrowRight
} from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import BatikOverlay from '../components/ui/BatikOverlay';

// Constants & API
import { MALAYSIA_LOCATIONS, STATE_ACTIVITIES, DESTINATION_INTELLIGENCE, ACCOMMODATION_DATA } from '../lib/constants';
import { getDestinations, getAttractions, getShops, fetchHotels } from '../lib/api';
import { generateSmartItinerary } from '../utils/smartItinerary';
import { calculateCenterPoint, calculateDistanceFromRef } from '../lib/utils';
import { useTrip } from '../context/TripContext';

const { width } = Dimensions.get('window');

const PRIORITIES = [
    { id: 'Food', label: 'Local Food', icon: Utensils },
    { id: 'Halal', label: 'Halal Food', icon: Utensils },
    { id: 'Viral', label: 'Viral Spots', icon: Camera },
    { id: 'Nature', label: 'Nature/Relax', icon: Compass },
    { id: 'Shopping', label: 'Shopping', icon: ShoppingBag },
];

const TAG_MAPPING = {
    "Local Food": "local_food",
    "Halal Food": "halal_food",
    "Viral Spots": "viral_spot",
    "Nature/Relax": "nature",
    "Shopping": "shopping"
};

export default function PlanTripScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { setItinerary: setCtxItinerary, setTripName: setCtxTripName, setLocation: setCtxLocation } = useTrip();

    // State
    const [step, setStep] = useState(1);
    const [loadingAttractions, setLoadingAttractions] = useState(false);

    // Data State
    const [destinations, setDestinations] = useState([]);
    const [backendAttractions, setBackendAttractions] = useState([]);
    const [backendMalls, setBackendMalls] = useState([]);
    const [hotels, setHotels] = useState([]);

    const [tripData, setTripData] = useState({
        locations: [],
        date: new Date(),
        activities: [],
        priorities: ['Food'], // same as web default
        duration: 3,
        guests: 2,
        transportMode: 'own',
        accommodation: {} // { 1: hotelObj, 2: hotelObj }
    });

    // Step 4 State
    const [platform, setPlatform] = useState('hotel'); // hotel, airbnb, homestay
    const [currentAccomDay, setCurrentAccomDay] = useState(1);

    // Date Picker State
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Generation State
    const [isGenerating, setIsGenerating] = useState(false);
    const [genProgress, setGenProgress] = useState(0);
    const [genStatus, setGenStatus] = useState('Optimizing routes...');

    // Custom Activity Modal (same as web)
    const [showCustomModal, setShowCustomModal] = useState(false);
    const [customForm, setCustomForm] = useState({ name: '', location: '' });

    // Mall Modal State
    const [showMallModal, setShowMallModal] = useState(false);
    const [selectedMall, setSelectedMall] = useState(null);
    const [selectedShops, setSelectedShops] = useState([]);
    const [mallShops, setMallShops] = useState([]);
    const [loadingShops, setLoadingShops] = useState(false);

    // Overlap validation: same activity at same time on same day — user must change day or time (match web)
    const [overlapError, setOverlapError] = useState(null);

    // Initial Load
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [destData, hotelsData] = await Promise.all([
                    getDestinations(),
                    fetchHotels()
                ]);
                setDestinations(destData || []);
                setHotels(hotelsData || []);
            } catch (error) {
                console.error('Failed to fetch destinations:', error);
            }
        };
        fetchInitialData();
    }, []);

    // Handle Route Params (Pre-selection from Home/Listing)
    useEffect(() => {
        if (route.params?.preSelectedState) {
            setTripData(prev => ({
                ...prev,
                locations: [route.params.preSelectedState]
            }));
            setStep(2); // Jump to Basics
        }
    }, [route.params?.preSelectedState]);

    // Fetch Attractions when Locations Change
    useEffect(() => {
        const fetchAttrs = async () => {
            if (!tripData.locations || tripData.locations.length === 0) {
                setBackendAttractions([]);
                return;
            }

            setLoadingAttractions(true);
            try {
                // Fetch logic similar to web
                const attractionsPromises = tripData.locations.map(async loc => {
                    const dest = destinations.find(d => d.name === loc);
                    if (!dest) return [];

                    // Part 1: Use Tag Mapping
                    const mappedTags = tripData.priorities.map(p => TAG_MAPPING[p] || p.toLowerCase());

                    let results = await getAttractions({
                        destinationId: dest.id,
                        tags: mappedTags.join(',')
                    });

                    // Fallback: If 0 results, fetch top 5 for state
                    if (!results || results.length === 0) {
                        results = await getAttractions({ destinationId: dest.id, limit: 5 });
                    }

                    return results || [];
                });

                const results = await Promise.all(attractionsPromises);
                const allAttractions = results.flat();

                // Process Data
                const malls = allAttractions.filter(a => a.isMall).map(mapAttractionData);
                const others = allAttractions.filter(a => !a.isMall).map(mapAttractionData);

                setBackendMalls(malls);
                setBackendAttractions(others);
            } catch (error) {
                console.error('Fetch attractions failed:', error);
            } finally {
                setLoadingAttractions(false);
            }
        };

        if (destinations.length > 0) fetchAttrs();
    }, [tripData.locations, tripData.priorities, destinations]);

    // Logic: Map Backend Data to App Structure
    const mapAttractionData = (attr) => ({
        id: attr.id,
        name: attr.name,
        category: attr.type || (attr.isMall ? 'Shopping' : 'Activity'),
        type: attr.type || (attr.isMall ? 'Mall' : 'activity'),
        isMall: attr.isMall,
        duration: (attr.suggested_duration || 120) / 60,
        price: attr.price || 0,
        location: attr.location_address || attr.state,
        state: attr.state,
        latitude: attr.latitude,
        longitude: attr.longitude,
        image: attr.image_url || 'https://images.unsplash.com/photo-1596422846543-75c6fc18593',
        rating: 4.5,
        bestTime: 'Morning',
        description: attr.description || '',
        tags: attr.tags || []
    });

    // Derived: Available Activities
    const availableStateActivities = useMemo(() => {
        if (!tripData.locations.length) return [];
        let all = [...backendAttractions, ...backendMalls];
        if (all.length === 0) {
            all = tripData.locations.flatMap(loc => STATE_ACTIVITIES[loc] || []);
        }
        return all;
    }, [tripData.locations, backendAttractions, backendMalls]);

    // Suggestions for Step 5 (same as web: not yet selected, match priorities)
    const suggestions = useMemo(() => {
        if (!tripData.locations.length || !availableStateActivities.length) return [];
        const selectedIds = new Set(tripData.activities.map(a => a.id));
        return availableStateActivities.filter(a => {
            if (selectedIds.has(a.id)) return false;
            return tripData.priorities.some(p => {
                const s = (p || '').toLowerCase();
                return (a.category?.toLowerCase().includes(s)) || (a.type?.toLowerCase().includes(s)) || (a.tags?.some(t => t?.toLowerCase().includes(s)));
            });
        }).slice(0, 5);
    }, [tripData.locations, tripData.activities, tripData.priorities, availableStateActivities]);


    // Actions
    const handleNext = () => {
        if (step >= 5) return;

        if (step === 2 && tripData.activities.length === 0) {
            // Auto-generate Smart Itinerary
            const allAvailable = [...backendAttractions, ...backendMalls];
            // Only generate if we have data
            if (allAvailable.length > 0 || Object.keys(STATE_ACTIVITIES).length > 0) {
                const smartPlan = generateSmartItinerary(
                    tripData.priorities,
                    tripData.locations[0],
                    allAvailable.length > 0 ? allAvailable : null
                );

                if (smartPlan.length > 0) {
                    const formatted = smartPlan.map((act, idx) => ({
                        ...act,
                        time: ['09:00', '12:30', '15:00', '19:30'][idx] || '10:00',
                        day: 1,
                        duration: act.duration || 2
                    }));
                    setTripData(prev => ({ ...prev, activities: formatted }));
                }
            }
        }
        setStep(s => s + 1);
    };

    const handleBack = () => setStep(s => s - 1);

    const togglePriority = (pid) => {
        setTripData(prev => {
            const exists = prev.priorities.includes(pid);
            return {
                ...prev,
                priorities: exists
                    ? prev.priorities.filter(p => p !== pid)
                    : [...prev.priorities, pid]
            };
        });
    };

    const toggleLocation = (locName) => {
        setTripData(prev => {
            const exists = prev.locations.includes(locName);
            return {
                ...prev,
                locations: exists
                    ? prev.locations.filter(l => l !== locName)
                    : [...prev.locations, locName]
            };
        });
    };

    // Find overlapping activity (same day + same time); return that activity or null
    const getOverlap = (activityId, time, day, activities) =>
        activities.find(a => a.id !== activityId && a.time === time && a.day === day) || null;

    const setOverlapErrorAndAlert = (message) => {
        setOverlapError(message);
        Alert.alert(
            'Time slot taken',
            message + '\n\nPlease choose a different Day or Time for your activity.',
            [{ text: 'OK' }]
        );
    };

    const toggleActivity = (act) => {
        setTripData(prev => {
            const exists = prev.activities.find(a => a.id === act.id);
            if (exists) {
                setOverlapError(null);
                return { ...prev, activities: prev.activities.filter(a => a.id !== act.id) };
            }
            const defaultTime = '10:00';
            const defaultDay = 1;
            const newList = [...prev.activities, { ...act, time: defaultTime, duration: act.duration || 2, day: defaultDay }];
            const other = getOverlap(act.id, defaultTime, defaultDay, newList);
            if (other) {
                const msg = `"${other.name}" is already scheduled for Day ${defaultDay} at ${defaultTime}.`;
                setOverlapErrorAndAlert(msg);
            } else {
                setOverlapError(null);
            }
            return { ...prev, activities: newList };
        });
    };

    const updateScheduledActivity = (id, updates) => {
        setTripData(prev => {
            const next = prev.activities.map(a => a.id === id ? { ...a, ...updates } : a);
            const act = next.find(a => a.id === id);
            if (act && (updates.time !== undefined || updates.day !== undefined)) {
                const other = getOverlap(id, act.time, act.day, next);
                if (other) {
                    setOverlapErrorAndAlert(`"${other.name}" is already scheduled for Day ${act.day} at ${act.time}.`);
                } else {
                    setOverlapError(null);
                }
            }
            return { ...prev, activities: next };
        });
    };

    const handleMallClick = async (mall) => {
        setSelectedMall(mall);
        setLoadingShops(true);
        setShowMallModal(true);
        try {
            const shops = await getShops(mall.id);
            setMallShops(shops || []);
        } catch (error) {
            console.error('Failed to fetch shops:', error);
        } finally {
            setLoadingShops(false);
        }
    };

    const confirmMallSelection = () => {
        if (!selectedMall) return;

        const defaultTime = '10:00';
        const defaultDay = 1;
        const mallWithShops = {
            ...selectedMall,
            selectedShops: selectedShops,
            time: defaultTime,
            duration: 2 + (selectedShops.length * 0.5),
            day: defaultDay
        };

        setTripData(prev => {
            const next = [...prev.activities, mallWithShops];
            const other = getOverlap(mallWithShops.id, defaultTime, defaultDay, next);
            if (other) {
                setOverlapErrorAndAlert(`"${other.name}" is already scheduled for Day ${defaultDay} at ${defaultTime}.`);
            } else {
                setOverlapError(null);
            }
            return { ...prev, activities: next };
        });

        setShowMallModal(false);
        setSelectedMall(null);
        setSelectedShops([]);
    };

    const finalizeTrip = () => {
        setIsGenerating(true);
        setGenProgress(0);

        const statuses = [
            'Analyzing preferences...',
            'Optimizing routes...',
            'Calculating transit times...',
            'Confirming stays...',
            'Almost there...',
            'Generation complete!'
        ];

        let i = 0;
        const interval = setInterval(() => {
            setGenStatus(statuses[i] || 'Finalizing...');
            setGenProgress(prev => Math.min(prev + 20, 100));
            i++;
            if (i >= statuses.length) {
                clearInterval(interval);
                setTimeout(() => {
                    const sortedActivities = [...tripData.activities].sort((a, b) => {
                        if (a.day !== b.day) return a.day - b.day;
                        return a.time.localeCompare(b.time);
                    });

                    const itinerary = [];
                    itinerary.push({
                        id: 'log-checkin',
                        type: 'logistics',
                        name: 'Check-in to Stay',
                        time: '14:00',
                        day: 1,
                        category: 'Accommodation'
                    });

                    sortedActivities.forEach((act, idx) => {
                        itinerary.push({ ...act, period: `Day ${act.day} • ${act.time}` });

                        const nextAct = sortedActivities[idx + 1];
                        if (nextAct && nextAct.day === act.day) {
                            itinerary.push({
                                id: `trans-${act.id}-${nextAct.id}`,
                                type: 'transport',
                                day: act.day,
                                mode: tripData.transportMode === 'own' ? 'Car' : 'Grab',
                                duration: '20-30m',
                                price: tripData.transportMode === 'own' ? 5 : 18,
                                time: act.time
                            });
                        }
                    });

                    const tripName = tripData.locations?.length ? `Trip to ${tripData.locations.join(', ')}` : 'My Malaysian Adventure';
                    const location = tripData.locations?.[0] || 'Kuala Lumpur';

                    setCtxItinerary(itinerary);
                    setCtxTripName(tripName);
                    setCtxLocation(location);

                    const startDate = tripData.date instanceof Date ? tripData.date : new Date(tripData.date || Date.now());

                    navigation.navigate('Itinerary', {
                        itinerary,
                        tripName,
                        location,
                        tripData: {
                            locations: tripData.locations,
                            duration: tripData.duration,
                            guests: tripData.guests,
                            transportMode: tripData.transportMode,
                            accommodation: tripData.accommodation,
                            startDate: startDate.toISOString ? startDate.toISOString() : String(startDate)
                        },
                        members: ['You', 'Sarah', 'Amir']
                    });
                    setIsGenerating(false);
                }, 500);
            }
        }, 800);
    };


    // --- Step 4 Handlers ---
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

    // --- Render Steps ---

    const renderStep1 = () => (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.headerBlock}>
                <Text style={styles.title}>What do you love? 🇲🇾</Text>
                <Text style={styles.subtitle}>We'll tailor your Malaysian adventure based on your vibe.</Text>
            </View>

            <View style={styles.grid}>
                {PRIORITIES.map(p => {
                    const isSelected = tripData.priorities.includes(p.id);
                    return (
                        <TouchableOpacity
                            key={p.id}
                            onPress={() => togglePriority(p.id)}
                            style={[
                                styles.priorityCard,
                                isSelected && styles.priorityCardSelected
                            ]}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.iconBox, isSelected && styles.iconBoxSelected]}>
                                {(() => {
                                    const IconComponent = p.icon;
                                    return <IconComponent size={32} color={isSelected ? '#fff' : '#64748b'} />;
                                })()}
                            </View>
                            <Text style={[styles.priorityLabel, isSelected && styles.priorityLabelSelected]}>
                                {p.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    );

    const renderStep2 = () => (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.headerBlock}>
                <Text style={styles.title}>The Basics</Text>
                <Text style={styles.subtitle}>Tell us the details of your getaway.</Text>
            </View>

            {/* Locations - same label as web */}
            <View style={styles.section}>
                <Text style={styles.label}>WHERE ARE YOU HEADING? (SELECT MULTIPLE OPTIONAL)</Text>
                <View style={styles.grid}>
                    {destinations.map(dest => {
                        const isSelected = tripData.locations.includes(dest.name);
                        return (
                            <TouchableOpacity
                                key={dest.id}
                                onPress={() => toggleLocation(dest.name)}
                                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <MapPin size={16} color={isSelected ? '#0f172a' : '#94a3b8'} />
                                    <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                                        {dest.name}
                                    </Text>
                                    {isSelected && <Check size={16} color="#0f172a" style={{ marginLeft: 'auto' }} />}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                {tripData.locations.length > 0 && (() => {
                    const totalMinDays = tripData.locations.reduce((sum, loc) => sum + (DESTINATION_INTELLIGENCE[loc]?.minDays || 2), 0);
                    if (tripData.duration < totalMinDays) {
                        return (
                            <View style={styles.durationWarning}>
                                <Info size={14} color="#c2410c" />
                                <Text style={styles.durationWarningText}>Recommended duration for selected spots is {totalMinDays} days.</Text>
                            </View>
                        );
                    }
                    return null;
                })()}
            </View>

            <View style={styles.row}>
                {/* Duration */}
                <View style={{ flex: 1 }}>
                    <Text style={styles.label}>DURATION (DAYS)</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={String(tripData.duration)}
                            onChangeText={v => setTripData({ ...tripData, duration: parseInt(v) || 1 })}
                        />
                        <Clock size={20} color="#94a3b8" style={styles.inputIcon} />
                    </View>
                </View>
                <View style={{ width: 16 }} />
                {/* Guests */}
                <View style={{ flex: 1 }}>
                    <Text style={styles.label}>GUESTS</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={String(tripData.guests)}
                            onChangeText={v => setTripData({ ...tripData, guests: parseInt(v) || 1 })}
                        />
                        <Users size={20} color="#94a3b8" style={styles.inputIcon} />
                    </View>
                </View>
            </View>

            {/* Date */}
            <View style={styles.section}>
                <Text style={styles.label}>START DATE</Text>
                <TouchableOpacity style={styles.inputContainer} onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.inputText}>
                        {tripData.date.toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </Text>
                    <Calendar size={20} color="#94a3b8" style={styles.inputIcon} />
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={tripData.date}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) setTripData({ ...tripData, date: selectedDate });
                        }}
                    />
                )}
            </View>

            {/* Transport */}
            <View style={styles.section}>
                <Text style={styles.label}>TRANSPORT MODE</Text>
                <View style={styles.row}>
                    <TouchableOpacity
                        onPress={() => setTripData({ ...tripData, transportMode: 'own' })}
                        style={[styles.transportCard, tripData.transportMode === 'own' && styles.transportCardSelected]}
                    >
                        <View style={[styles.transportIcon, tripData.transportMode === 'own' && styles.transportIconSelected]}>
                            <Car size={24} color={tripData.transportMode === 'own' ? '#fff' : '#64748b'} />
                        </View>
                        <Text style={styles.transportLabel}>Own Transport</Text>
                    </TouchableOpacity>

                    <View style={{ width: 16 }} />

                    <TouchableOpacity
                        onPress={() => setTripData({ ...tripData, transportMode: 'public' })}
                        style={[styles.transportCard, tripData.transportMode === 'public' && styles.transportCardSelected]}
                    >
                        <View style={[styles.transportIcon, tripData.transportMode === 'public' && styles.transportIconSelected]}>
                            <Bus size={24} color={tripData.transportMode === 'public' ? '#fff' : '#64748b'} />
                        </View>
                        <Text style={styles.transportLabel}>Public Transport</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );

    const addCustomActivity = () => {
        if (!customForm.name.trim() || !customForm.location.trim()) return;
        const newAct = {
            id: `custom-${Date.now()}`,
            name: customForm.name.trim(),
            location: customForm.location.trim(),
            category: 'User Custom',
            image: 'https://images.unsplash.com/photo-1596422846543-75c6fc18a593?q=80&w=2670&auto=format&fit=crop',
            time: '12:00',
            duration: 2,
            day: 1,
            price: 0,
            rating: 5.0
        };
        const other = getOverlap(newAct.id, newAct.time, newAct.day, [...tripData.activities, newAct]);
        if (other) setOverlapErrorAndAlert(`"${other.name}" is already scheduled for Day ${newAct.day} at ${newAct.time}.`);
        else setOverlapError(null);
        setTripData(prev => ({ ...prev, activities: [...prev.activities, newAct] }));
        setShowCustomModal(false);
        setCustomForm({ name: '', location: '' });
    };

    const renderStep3 = () => (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={[styles.headerBlock, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }]}>
                <View>
                    <Text style={styles.title}>Select Spots</Text>
                    <Text style={styles.subtitle}>Suggested for your selected priorities.</Text>
                </View>
                <TouchableOpacity
                    style={styles.addCustomButton}
                    onPress={() => setShowCustomModal(true)}
                >
                    <Plus size={14} color="#0f172a" />
                    <Text style={styles.addCustomButtonText}>ADD CUSTOM</Text>
                </TouchableOpacity>
            </View>

            {overlapError ? (
                <View style={styles.warningBox}>
                    <Info size={20} color="#dc2626" style={{ marginRight: 8 }} />
                    <Text style={styles.warningText}>{overlapError}</Text>
                </View>
            ) : null}

            {loadingAttractions && (
                <View style={styles.loadingBox}>
                    <Text style={styles.loadingText}>Loading attractions...</Text>
                </View>
            )}

            {/* Group by Time Slots (Simplification of Web) */}
            {['Morning', 'Afternoon', 'Evening', 'Night'].map(timeSlot => {
                const activities = availableStateActivities.filter(a => (a.bestTime || 'Morning') === timeSlot);
                if (activities.length === 0) return null;

                return (
                    <View key={timeSlot} style={styles.section}>
                        <View style={styles.stickyHeader}>
                            <Text style={styles.timeSlotTitle}>{timeSlot}</Text>
                        </View>

                        {activities.map(act => {
                            const selectedAct = tripData.activities.find(a => a.id === act.id);
                            const isSelected = !!selectedAct;
                            const isMall = act.type === 'Mall' || act.isMall;

                            return (
                                <View key={act.id} style={[styles.activityCard, isSelected && styles.activityCardSelected]}>
                                    <View style={styles.activityRow}>
                                        <Image source={{ uri: act.image }} style={styles.activityImage} />
                                        <View style={styles.activityInfo}>
                                            <Text style={styles.activityName}>{act.name}</Text>
                                            <View style={styles.activityMeta}>
                                                <Text style={styles.activityMetaText}>{act.category} • {act.duration}h • RM {act.price}</Text>
                                            </View>
                                        </View>
                                        {isMall && !isSelected ? (
                                            <TouchableOpacity
                                                style={styles.viewShopsBtn}
                                                onPress={() => handleMallClick(act)}
                                            >
                                                <Text style={styles.viewShopsText}>VIEW SHOPS</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity
                                                style={[styles.addButtonSmall, isSelected && styles.removeButton]}
                                                onPress={() => toggleActivity(act)}
                                            >
                                                {isSelected ? <X size={16} color="#fff" /> : <Plus size={16} color="#0f172a" />}
                                            </TouchableOpacity>
                                        )}
                                    </View>

                                    {/* Inline Scheduling (Day / Time / Duration) */}
                                    {isSelected && (
                                        <View style={styles.inlineScheduling}>
                                            <View style={styles.schedulingHeader}>
                                                <Text style={styles.schedulingLabel}>WHEN & HOW LONG?</Text>
                                            </View>
                                            <View style={styles.schedulingControls}>
                                                {/* Day Select */}
                                                <View style={styles.controlGroup}>
                                                    <Text style={styles.controlLabel}>DAY</Text>
                                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelectionMini}>
                                                        {[...Array(tripData.duration)].map((_, i) => (
                                                            <TouchableOpacity
                                                                key={i}
                                                                onPress={() => updateScheduledActivity(act.id, { day: i + 1 })}
                                                                style={[styles.miniDayPill, selectedAct.day === (i + 1) && styles.miniDayPillSelected]}
                                                            >
                                                                <Text style={[styles.miniDayText, selectedAct.day === (i + 1) && styles.miniDayTextSelected]}>D{i + 1}</Text>
                                                            </TouchableOpacity>
                                                        ))}
                                                    </ScrollView>
                                                </View>

                                                {/* Time Select */}
                                                <View style={[styles.controlGroup, { flex: 1 }]}>
                                                    <Text style={styles.controlLabel}>TIME</Text>
                                                    <TouchableOpacity
                                                        style={styles.timeInputMini}
                                                        onPress={() => {
                                                            Alert.prompt("Set Time", "Enter start time (e.g. 10:30)", [
                                                                { text: "Cancel" },
                                                                { text: "Set", onPress: (val) => updateScheduledActivity(act.id, { time: val }) }
                                                            ], "plain-text", selectedAct.time);
                                                        }}
                                                    >
                                                        <Clock size={12} color="#64748b" />
                                                        <Text style={styles.timeInputText}>{selectedAct.time}</Text>
                                                    </TouchableOpacity>
                                                </View>

                                                {/* Duration Select */}
                                                <View style={styles.controlGroup}>
                                                    <Text style={styles.controlLabel}>DURATION</Text>
                                                    <View style={styles.durationMini}>
                                                        <TouchableOpacity onPress={() => updateScheduledActivity(act.id, { duration: Math.max(0.5, selectedAct.duration - 0.5) })}>
                                                            <Text style={styles.durOp}>-</Text>
                                                        </TouchableOpacity>
                                                        <Text style={styles.durVal}>{selectedAct.duration}h</Text>
                                                        <TouchableOpacity onPress={() => updateScheduledActivity(act.id, { duration: Math.min(8, selectedAct.duration + 0.5) })}>
                                                            <Text style={styles.durOp}>+</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                );
            })}

            {/* Custom Activities Added (same as web) */}
            {tripData.activities.filter(a => a.id.startsWith('custom-')).map(act => (
                <View key={act.id} style={[styles.activityCard, styles.activityCardSelected]}>
                    <View style={styles.activityRow}>
                        <View style={[styles.activityImage, { backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' }]}>
                            <MapPin size={24} color="#64748b" />
                        </View>
                        <View style={styles.activityInfo}>
                            <Text style={styles.activityName}>{act.name}</Text>
                            <Text style={[styles.activityMetaText, { marginTop: 4 }]}>Your Spot • {act.location}</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.addButtonSmall, styles.removeButton]}
                            onPress={() => setTripData(prev => ({ ...prev, activities: prev.activities.filter(a => a.id !== act.id) }))}
                        >
                            <X size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inlineScheduling}>
                        <View style={styles.schedulingControls}>
                            <View style={styles.controlGroup}>
                                <Text style={styles.controlLabel}>TIME</Text>
                                <TouchableOpacity
                                    style={styles.timeInputMini}
                                    onPress={() => {
                                        Alert.prompt('Set Time', 'Enter start time (e.g. 10:30)', [
                                            { text: 'Cancel' },
                                            { text: 'Set', onPress: (val) => updateScheduledActivity(act.id, { time: val || act.time }) }
                                        ], 'plain-text', act.time);
                                    }}
                                >
                                    <Clock size={12} color="#64748b" />
                                    <Text style={styles.timeInputText}>{act.time}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.controlGroup}>
                                <Text style={styles.controlLabel}>DAY</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelectionMini}>
                                    {[...Array(tripData.duration)].map((_, i) => (
                                        <TouchableOpacity
                                            key={i}
                                            onPress={() => updateScheduledActivity(act.id, { day: i + 1 })}
                                            style={[styles.miniDayPill, act.day === (i + 1) && styles.miniDayPillSelected]}
                                        >
                                            <Text style={[styles.miniDayText, act.day === (i + 1) && styles.miniDayTextSelected]}>D{i + 1}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                </View>
            ))}
        </ScrollView>
    );

    const renderStep4 = () => (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.headerBlock}>
                <Text style={styles.title}>Stay Authentic</Text>
                <Text style={styles.subtitle}>Where will you be resting your head on Day {currentAccomDay}?</Text>
            </View>

            {/* Day Selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daySelectorScroll}>
                {[...Array(tripData.duration)].map((_, i) => {
                    const day = i + 1;
                    const isFilled = !!tripData.accommodation[day];
                    const isCurrent = currentAccomDay === day;
                    return (
                        <TouchableOpacity
                            key={day}
                            onPress={() => setCurrentAccomDay(day)}
                            style={[
                                styles.dayPill,
                                isCurrent && styles.dayPillSelected,
                                (isFilled && !isCurrent) && styles.dayPillFilled
                            ]}
                        >
                            <Text style={[styles.dayPillText, isCurrent && styles.dayPillTextSelected]}>
                                Day {day} {isFilled && !isCurrent && '✓'}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Platform Selector */}
            <View style={styles.platformSelector}>
                {['hotel', 'airbnb', 'homestay'].map(p => (
                    <TouchableOpacity
                        key={p}
                        onPress={() => setPlatform(p)}
                        style={[styles.platformButton, platform === p && styles.platformButtonSelected]}
                    >
                        <Text style={[styles.platformButtonText, platform === p && styles.platformButtonTextSelected]}>{p}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Selected Summary */}
            <View style={styles.accomSummaryRow}>
                <Text style={styles.label}>{tripData.accommodation[currentAccomDay] ? 'Selected for this day' : 'Select a place'}</Text>
                {tripData.accommodation[currentAccomDay] && (
                    <TouchableOpacity onPress={applyToAllDays}>
                        <Text style={styles.applyAllText}>APPLY TO ALL DAYS</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* List */}
            <View style={styles.gridVertical}>
                {(hotels.length > 0 ? hotels.filter(h => h.type.toLowerCase() === platform) : (ACCOMMODATION_DATA[platform] || [])).map(stay => {
                    const isSelected = tripData.accommodation[currentAccomDay]?.id === stay.id;
                    return (
                        <TouchableOpacity
                            key={stay.id}
                            style={[styles.accomCard, isSelected && styles.accomCardSelected]}
                            onPress={() => handleAccomSelect(stay)}
                            activeOpacity={0.9}
                        >
                            <Image source={{ uri: stay.image_url || stay.image }} style={styles.accomImage} />
                            <View style={styles.accomContent}>
                                <View style={styles.accomHeader}>
                                    <Text style={styles.accomName}>{stay.name}</Text>
                                    <View style={styles.ratingBadge}>
                                        <Star size={10} color="#d97706" fill="#d97706" />
                                        <Text style={styles.ratingText}>{stay.rating}</Text>
                                    </View>
                                </View>
                                <View style={styles.accomMeta}>
                                    <MapPin size={12} color="#94a3b8" />
                                    <Text style={styles.accomLocation}>{stay.location}</Text>
                                </View>
                                <View style={styles.accomFooter}>
                                    <View>
                                        <Text style={styles.accomPrice}>RM {stay.price}</Text>
                                        <Text style={styles.perNight}>/ NIGHT</Text>
                                    </View>
                                    <View style={[styles.selectCircle, isSelected && styles.selectCircleSelected]}>
                                        {isSelected ? <Check size={16} color="#fff" /> : <ArrowRight size={16} color="#0f172a" />}
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    );

    const renderStep5 = () => {
        const firstStay = tripData.accommodation[1];

        return (
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.headerBlock}>
                    <Text style={styles.title}>Suggestions for You</Text>
                    <Text style={styles.subtitle}>Extra filler activities nearby.</Text>
                </View>

                {/* Suggestion cards (same as web) */}
                {suggestions.length > 0 && (
                    <View style={styles.suggestionsSection}>
                        {suggestions.map(s => (
                            <TouchableOpacity
                                key={s.id}
                                style={styles.suggestionCard}
                                onPress={() => toggleActivity(s)}
                                activeOpacity={0.9}
                            >
                                <Image source={{ uri: s.image }} style={styles.suggestionImage} />
                                <View style={styles.suggestionContent}>
                                    <Text style={styles.suggestionName}>{s.name}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                        <Star size={12} color="#eab308" fill="#eab308" />
                                        <Text style={styles.suggestionMeta}>{s.rating || 4.5} • {s.category}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.addToPlanBtn}
                                        onPress={() => toggleActivity(s)}
                                    >
                                        <Plus size={14} color="#0f172a" />
                                        <Text style={styles.addToPlanBtnText}>ADD TO PLAN</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <View style={[styles.headerBlock, { marginTop: suggestions.length > 0 ? 24 : 0 }]}>
                    <Text style={styles.title}>Trip Summary 🇲🇾</Text>
                    <Text style={styles.subtitle}>Ready to build your itinerary?</Text>
                </View>

                {/* Summary Card */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <View style={styles.summaryIconBox}>
                            <Calendar size={24} color="#fff" />
                        </View>
                        <View>
                            <Text style={styles.summaryLabel}>ITINERARY FOR</Text>
                            <Text style={styles.summaryValue}>{tripData.locations.join(', ')}</Text>
                        </View>
                    </View>

                    {Object.keys(tripData.accommodation).length > 0 && (
                        <View style={styles.staySummary}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                {firstStay && <Image source={{ uri: firstStay.image_url || firstStay.image }} style={{ width: 40, height: 40, borderRadius: 12 }} />}
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.stayName}>{firstStay ? firstStay.name : 'Multiple Stays'}</Text>
                                    <Text style={styles.stayDates}>{Object.keys(tripData.accommodation).length} Nights Booked</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    <View style={styles.statsGrid}>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>DURATION</Text>
                            <Text style={styles.statValue}>{tripData.duration} Days</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>TRAVELERS</Text>
                            <Text style={styles.statValue}>{tripData.guests} Pax</Text>
                        </View>
                    </View>

                    <View style={styles.summaryFooter}>
                        <Text style={{ color: '#fff', fontSize: 12 }}>Plan ready {tripData.activities.length} activities selected</Text>
                    </View>

                    <TouchableOpacity style={styles.buildButton} onPress={finalizeTrip}>
                        <Text style={styles.buildButtonText}>Build My Itinerary</Text>
                        <ArrowRight size={20} color="#0f172a" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <BatikOverlay type="full" opacity={0.03} />
            {/* Top Navigation Bar */}
            <View style={styles.topNavBar}>
                <TouchableOpacity
                    onPress={() => step > 1 ? setStep(s => s - 1) : navigation.goBack()}
                    style={styles.navButton}
                >
                    <ChevronLeft size={24} color="#0f172a" />
                </TouchableOpacity>

                <Text style={styles.navTitle}>
                    {step === 1 ? 'Trip Vibe' :
                        step === 2 ? 'Details' :
                            step === 3 ? 'Activities' :
                                step === 4 ? 'Stays' : 'Summary'}
                </Text>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Home')}
                    style={styles.navButton}
                >
                    <X size={24} color="#0f172a" />
                </TouchableOpacity>
            </View>

            {/* Steps Content */}
            <View style={{ flex: 1 }}>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
                {step === 5 && renderStep5()}
            </View>

            {/* Mall Shops Modal */}
            <Modal visible={showMallModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.mallModalContent}>
                        <View style={styles.mallModalHeader}>
                            <Text style={styles.mallModalTitle}>{selectedMall?.name}</Text>
                            <TouchableOpacity onPress={() => setShowMallModal(false)}>
                                <X size={24} color="#0f172a" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.mallModalSubtitle}>Select shops you'd like to visit:</Text>

                        {loadingShops ? (
                            <ActivityIndicator size="large" color="#0f172a" style={{ margin: 40 }} />
                        ) : (
                            <ScrollView style={styles.shopsList}>
                                {mallShops.map(shop => {
                                    const isShopSelected = selectedShops.includes(shop.name);
                                    return (
                                        <TouchableOpacity
                                            key={shop.id}
                                            style={[styles.shopItem, isShopSelected && styles.shopItemSelected]}
                                            onPress={() => {
                                                if (isShopSelected) setSelectedShops(selectedShops.filter(s => s !== shop.name));
                                                else setSelectedShops([...selectedShops, shop.name]);
                                            }}
                                        >
                                            <Text style={[styles.shopName, isShopSelected && styles.shopNameSelected]}>{shop.name}</Text>
                                            <View style={[styles.shopCheck, isShopSelected && styles.shopCheckActive]}>
                                                {isShopSelected && <Check size={12} color="#fff" />}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        )}

                        <TouchableOpacity
                            style={styles.confirmMallBtn}
                            onPress={confirmMallSelection}
                        >
                            <Text style={styles.confirmMallText}>Add Mall to Trip</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Custom Activity Modal (same as web - Add Your Gem) */}
            <Modal visible={showCustomModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.customModalContent}>
                        <View style={styles.customModalHeader}>
                            <Text style={styles.customModalTitle}>Add Your Gem</Text>
                            <Text style={styles.customModalSubtitle}>What local secret are we visiting?</Text>
                        </View>
                        <View style={styles.customModalBody}>
                            <Text style={styles.label}>SPOT NAME</Text>
                            <TextInput
                                style={styles.customInput}
                                placeholder="e.g. Hidden Cafe in KL"
                                placeholderTextColor="#94a3b8"
                                value={customForm.name}
                                onChangeText={v => setCustomForm(prev => ({ ...prev, name: v }))}
                            />
                            <Text style={[styles.label, { marginTop: 16 }]}>LOCATION DETAILS</Text>
                            <TextInput
                                style={styles.customInput}
                                placeholder="e.g. Bukit Bintang Area"
                                placeholderTextColor="#94a3b8"
                                value={customForm.location}
                                onChangeText={v => setCustomForm(prev => ({ ...prev, location: v }))}
                            />
                        </View>
                        <View style={styles.customModalFooter}>
                            <TouchableOpacity style={styles.customModalCancel} onPress={() => { setShowCustomModal(false); setCustomForm({ name: '', location: '' }); }}>
                                <Text style={styles.customModalCancelText}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.customModalAdd, (!customForm.name.trim() || !customForm.location.trim()) && styles.customModalAddDisabled]}
                                onPress={addCustomActivity}
                                disabled={!customForm.name.trim() || !customForm.location.trim()}
                            >
                                <Text style={styles.customModalAddText}>ADD SPOT</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Generation Loading Overay */}
            <Modal visible={isGenerating} transparent>
                <View style={styles.genOverlay}>
                    <View style={styles.genBox}>
                        <Sparkles size={48} color="#0f172a" style={styles.genIcon} />
                        <Text style={styles.genTitle}>Optimizing For You</Text>
                        <Text style={styles.genStatus}>{genStatus}</Text>
                        <View style={styles.genProgressBg}>
                            <View style={[styles.genProgressFill, { width: `${genProgress}%` }]} />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Bottom Navigation */}
            {step < 5 && (
                <View style={styles.bottomNav}>
                    {step > 1 && (
                        <TouchableOpacity onPress={handleBack} style={styles.backNavButton}>
                            <ChevronLeft size={24} color="#64748b" />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        onPress={handleNext}
                        style={[styles.nextButton, step === 1 && { flex: 1 }]}
                        disabled={
                            (step === 1 && tripData.priorities.length === 0) ||
                            (step === 3 && !!overlapError) ||
                            (step === 4 && Object.keys(tripData.accommodation).length < tripData.duration)
                        }
                    >
                        <Text style={styles.nextButtonText}>
                            {step === 1 ? 'Next: Where & When' : step === 2 ? 'Pick My Activities' : step === 3 ? 'Review My Plan' : 'Final Review'}
                        </Text>
                        <ChevronRight size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollContent: { padding: 24, paddingBottom: 100 },

    headerBlock: { marginBottom: 32 },
    title: { fontSize: 32, fontWeight: '900', color: '#0f172a', marginBottom: 8, letterSpacing: -1 },
    subtitle: { fontSize: 16, fontWeight: '500', color: '#64748b' },

    // Top Navigation
    topNavBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    navButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
    navTitle: { fontSize: 16, fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: 1 },

    // Step 1: Grid
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    priorityCard: { width: '48%', aspectRatio: 1, borderRadius: 32, borderWidth: 2, borderColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center', gap: 16 },
    priorityCardSelected: { borderColor: '#0f172a', backgroundColor: '#f8fafc' },
    iconBox: { width: 64, height: 64, borderRadius: 24, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
    iconBoxSelected: { backgroundColor: '#0f172a', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
    priorityLabel: { fontSize: 14, fontWeight: '900', color: '#64748b' },
    priorityLabelSelected: { color: '#0f172a' },

    // Step 2
    section: { marginBottom: 24 },
    label: { fontSize: 10, fontWeight: '900', color: 'rgba(15,23,42,0.6)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8, paddingLeft: 4 },
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },

    optionCard: { width: '48%', padding: 16, borderRadius: 16, borderWidth: 2, borderColor: '#e2e8f0' },
    optionCardSelected: { borderColor: '#0f172a', backgroundColor: '#f1f5f9' },
    optionLabel: { fontSize: 12, fontWeight: '700', color: '#64748b', flex: 1 },
    optionLabelSelected: { color: '#0f172a' },
    durationWarning: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff7ed', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#fed7aa', marginTop: 12 },
    durationWarningText: { fontSize: 10, fontWeight: '700', color: '#c2410c', flex: 1 },

    inputContainer: { flexDirection: 'row', alignItems: 'center', height: 64, borderWidth: 2, borderColor: '#e2e8f0', borderRadius: 24, paddingHorizontal: 20 },
    input: { flex: 1, fontSize: 18, fontWeight: '700', color: '#0f172a', height: '100%' },
    inputText: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
    inputIcon: { marginLeft: 12 },

    transportCard: { flex: 1, padding: 24, borderRadius: 24, borderWidth: 2, borderColor: '#e2e8f0', alignItems: 'center', gap: 12 },
    transportCardSelected: { borderColor: '#0f172a', backgroundColor: '#f8fafc' },
    transportIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
    transportIconSelected: { backgroundColor: '#0f172a' },
    transportLabel: { fontSize: 12, fontWeight: '900', color: '#0f172a' },

    // Step 3
    loadingBox: { padding: 20, alignItems: 'center' },
    loadingText: { color: '#64748b', fontWeight: '700' },
    stickyHeader: { paddingVertical: 8, backgroundColor: '#fff', borderLeftWidth: 4, borderLeftColor: '#f1f5f9', paddingLeft: 12, marginBottom: 12 },
    timeSlotTitle: { fontSize: 14, fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: 1 },

    activityCard: { borderRadius: 28, borderWidth: 2, borderColor: '#e2e8f0', padding: 16, marginBottom: 12 },
    activityCardSelected: { borderColor: '#0f172a', backgroundColor: '#f8fafc' },
    activityRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    activityImage: { width: 64, height: 64, borderRadius: 20, backgroundColor: '#e2e8f0' },
    activityInfo: { flex: 1 },
    activityName: { fontSize: 14, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
    activityMetaText: { fontSize: 10, fontWeight: '700', color: '#94a3b8' },

    addButtonSmall: { width: 36, height: 36, borderRadius: 12, borderWidth: 2, borderColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
    removeButton: { backgroundColor: '#ef4444', borderColor: '#ef4444' },
    addCustomButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(15,23,42,0.4)', backgroundColor: '#f8fafc' },
    addCustomButtonText: { fontSize: 10, fontWeight: '900', color: '#0f172a', letterSpacing: 0.5 },

    // Bottom Nav
    bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f5f9', flexDirection: 'row', gap: 16 },
    backNavButton: { height: 64, width: 64, borderRadius: 28, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
    nextButton: { flex: 1, height: 64, borderRadius: 28, backgroundColor: '#0f172a', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
    nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '900' },

    // Step 4: Accommodation
    daySelectorScroll: { paddingBottom: 16, gap: 8 },
    dayPill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 2, borderColor: '#e2e8f0', backgroundColor: '#fff' },
    dayPillSelected: { backgroundColor: '#0f172a', borderColor: '#0f172a' },
    dayPillFilled: { backgroundColor: '#f1f5f9', borderColor: '#cbd5e1' },
    dayPillText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
    dayPillTextSelected: { color: '#fff' },

    platformSelector: { flexDirection: 'row', backgroundColor: '#f1f5f9', padding: 4, borderRadius: 16, marginBottom: 24 },
    platformButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
    platformButtonSelected: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
    platformButtonText: { fontSize: 10, fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 },
    platformButtonTextSelected: { color: '#0f172a' },

    accomSummaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    applyAllText: { fontSize: 10, fontWeight: '900', color: '#0f172a', textTransform: 'uppercase' },

    gridVertical: { gap: 16 },
    accomCard: { backgroundColor: '#fff', borderRadius: 24, borderWidth: 2, borderColor: '#e2e8f0', overflow: 'hidden' },
    accomCardSelected: { borderColor: '#0f172a', backgroundColor: '#f8fafc' },
    accomImage: { width: '100%', height: 160 },
    accomContent: { padding: 16 },
    accomHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
    accomName: { fontSize: 18, fontWeight: '900', color: '#0f172a', flex: 1, marginRight: 8 },
    ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fffbeb', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 100, gap: 4 },
    ratingText: { fontSize: 10, fontWeight: '800', color: '#d97706' },
    accomMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
    accomLocation: { fontSize: 12, fontWeight: '600', color: '#64748b' },
    accomFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
    accomPrice: { fontSize: 20, fontWeight: '900', color: '#0f172a' },
    perNight: { fontSize: 10, fontWeight: '700', color: '#94a3b8' },
    selectCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
    selectCircleSelected: { backgroundColor: '#0f172a' },

    // Inline Scheduling
    inlineScheduling: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
    schedulingHeader: { marginBottom: 12 },
    schedulingLabel: { fontSize: 9, fontWeight: '900', color: '#94a3b8', letterSpacing: 1 },
    schedulingControls: { flexDirection: 'row', gap: 12, alignItems: 'flex-end' },
    controlGroup: { gap: 4 },
    controlLabel: { fontSize: 8, fontWeight: '900', color: '#64748b', textTransform: 'uppercase' },
    daySelectionMini: { flexDirection: 'row', width: 80 },
    miniDayPill: { paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6, backgroundColor: '#f1f5f9', marginRight: 4, borderWidth: 1, borderColor: '#e2e8f0' },
    miniDayPillSelected: { backgroundColor: '#0f172a', borderColor: '#0f172a' },
    miniDayText: { fontSize: 9, fontWeight: '800', color: '#64748b' },
    miniDayTextSelected: { color: '#fff' },
    timeInputMini: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff', padding: 6, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0' },
    timeInputText: { fontSize: 10, fontWeight: '900', color: '#0f172a' },
    durationMini: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', padding: 4, borderRadius: 8, gap: 8 },
    durOp: { fontSize: 16, fontWeight: '900', color: '#3b82f6', paddingHorizontal: 4 },
    durVal: { fontSize: 10, fontWeight: '900', color: '#0f172a' },

    viewShopsBtn: { backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    viewShopsText: { fontSize: 10, fontWeight: '900', color: '#0f172a' },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    mallModalContent: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: '80%' },
    mallModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    mallModalTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
    mallModalSubtitle: { fontSize: 14, color: '#64748b', marginBottom: 12 },
    shopsList: { maxHeight: 300 },
    shopItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 16, backgroundColor: '#f8fafc', marginBottom: 8, borderWidth: 1, borderColor: '#e2e8f0' },
    shopItemSelected: { borderColor: '#0f172a', backgroundColor: '#f1f5f9' },
    shopName: { fontSize: 14, fontWeight: '700', color: '#64748b' },
    shopNameSelected: { color: '#0f172a' },
    shopCheck: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center' },
    shopCheckActive: { backgroundColor: '#10b981', borderColor: '#10b981' },
    confirmMallBtn: { backgroundColor: '#0f172a', paddingVertical: 18, borderRadius: 20, alignItems: 'center', marginTop: 16 },
    confirmMallText: { color: '#fff', fontSize: 16, fontWeight: '900' },

    // Generation Overlay
    genOverlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.95)', justifyContent: 'center', alignItems: 'center' },
    genBox: { width: '80%', alignItems: 'center' },
    genIcon: { marginBottom: 24 },
    genTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a', marginBottom: 8 },
    genStatus: { fontSize: 14, fontWeight: '600', color: '#64748b', marginBottom: 32 },
    genProgressBg: { width: '100%', height: 6, backgroundColor: '#f1f5f9', borderRadius: 3, overflow: 'hidden' },
    genProgressFill: { height: '100%', backgroundColor: '#0f172a' },

    // Step 5: Summary
    summaryCard: { backgroundColor: '#0f172a', borderRadius: 32, padding: 24, shadowColor: '#0f172a', shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
    summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
    summaryIconBox: { width: 56, height: 56, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    summaryLabel: { fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.6)', letterSpacing: 2, marginBottom: 4 },
    summaryValue: { fontSize: 24, fontWeight: '900', color: '#fff' },

    staySummary: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 16, borderRadius: 20, marginBottom: 24 },
    stayName: { fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 2 },
    stayDates: { fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.7)' },

    statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    statBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', padding: 16, borderRadius: 20 },
    statLabel: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.6)', marginBottom: 4 },
    statValue: { fontSize: 16, fontWeight: '900', color: '#fff' },

    summaryFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, marginBottom: 24 },
    buildButton: { backgroundColor: '#fff', height: 64, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    buildButtonText: { fontSize: 16, fontWeight: '900', color: '#0f172a' },
    warningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#fffbeb', // orange-50
        borderWidth: 1,
        borderColor: '#fcd34d', // orange-200
        padding: 12,
        borderRadius: 16,
        marginBottom: 16,
    },
    warningText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#d97706',
        flex: 1,
    },

    // Custom Activity Modal
    customModalContent: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: '85%' },
    customModalHeader: { backgroundColor: '#0f172a', marginHorizontal: -24, marginTop: -24, padding: 32, paddingBottom: 40, borderTopLeftRadius: 32, borderTopRightRadius: 32 },
    customModalTitle: { fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 8 },
    customModalSubtitle: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.7)' },
    customModalBody: { paddingTop: 24 },
    customInput: { height: 56, borderWidth: 2, borderColor: '#e2e8f0', borderRadius: 16, paddingHorizontal: 20, fontSize: 16, fontWeight: '700', color: '#0f172a', marginTop: 8 },
    customModalFooter: { flexDirection: 'row', gap: 12, marginTop: 32, paddingTop: 16 },
    customModalCancel: { flex: 1, height: 56, borderRadius: 24, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
    customModalCancelText: { fontSize: 14, fontWeight: '900', color: '#64748b' },
    customModalAdd: { flex: 1, height: 56, borderRadius: 24, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center', shadowColor: '#0f172a', shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
    customModalAddDisabled: { opacity: 0.5 },
    customModalAddText: { fontSize: 14, fontWeight: '900', color: '#fff' },

    // Step 5 Suggestions
    suggestionsSection: { marginBottom: 24 },
    suggestionCard: { flexDirection: 'row', backgroundColor: '#f8fafc', borderRadius: 28, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9' },
    suggestionImage: { width: 80, height: 80, borderRadius: 20, backgroundColor: '#e2e8f0' },
    suggestionContent: { flex: 1, marginLeft: 16, justifyContent: 'center' },
    suggestionName: { fontSize: 16, fontWeight: '900', color: '#0f172a', marginBottom: 4 },
    suggestionMeta: { fontSize: 11, fontWeight: '800', color: '#64748b' },
    addToPlanBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginTop: 8, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12, borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(15,23,42,0.4)' },
    addToPlanBtnText: { fontSize: 10, fontWeight: '900', color: '#0f172a' },
});
