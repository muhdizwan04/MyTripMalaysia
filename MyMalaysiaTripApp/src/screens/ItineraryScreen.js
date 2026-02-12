import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Image, FlatList, Modal, TextInput, Alert, Animated } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ChevronLeft, MapPin, Clock, Car, MoreVertical, Navigation,
    Info, Sparkles, User, Plus, MoveUp, MoveDown, Check, X,
    Utensils, Bed, ShoppingBag, Mountain, Map as MapIcon, Calendar, Users,
    Bookmark, Share2, Download, Printer, AlertTriangle, ArrowRight, Star, ArrowLeft
} from 'lucide-react-native';
import { TRAVEL_ADVICE, ACCOMMODATION_DATA, ITINERARY_RULES, BUDGET_DEFAULTS } from '../lib/constants';
import { useTrip } from '../context/TripContext';
import TripMap from '../components/trips/TripMap';
import BatikOverlay from '../components/ui/BatikOverlay';

const { width } = Dimensions.get('window');

// Custom Components (Defined at top to avoid hoisting issues)
const DollarSign = (props) => (
    <Text style={{ fontStyle: 'normal', fontWeight: '900', color: props.color || '#64748b', fontSize: 16 }}>$</Text>
);

// Helper to format price
const formatPrice = (p) => `RM ${p?.toFixed(2) || '0.00'}`;

export default function ItineraryScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const scrollRef = useRef(null);

    // Params from Context
    const {
        itinerary,
        tripName: ctxTripName,
        location: ctxLocation,
        removeActivity,
        updateActivityDuration,
        reorderActivities: ctxReorder
    } = useTrip();

    const tripName = ctxTripName || route.params?.tripName || 'Malaysian Story';
    const locationName = ctxLocation || route.params?.location || 'Kuala Lumpur';

    // State
    const [tripMembers, setTripMembers] = useState(['You', 'Sarah', 'Amir']);
    const [showMap, setShowMap] = useState(false);

    // Group itinerary by day for the UI
    const dailyPlans = useMemo(() => {
        const grouped = {};
        if (!itinerary) return grouped;

        itinerary.forEach(item => {
            const d = item.day || 1;
            if (!grouped[d]) grouped[d] = [];
            grouped[d].push({ ...item, type: item.type || 'activity' });
        });

        // Add logistics and sorting
        Object.keys(grouped).forEach(day => {
            const dayItems = grouped[day];
            // Sort by time
            dayItems.sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));
        });

        return grouped;
    }, [itinerary]);

    const dayList = Object.keys(dailyPlans).sort((a, b) => parseInt(a) - parseInt(b));

    // Pro Tips for current location
    const tips = TRAVEL_ADVICE[locationName] || TRAVEL_ADVICE['General'] || [];

    // Accommodation Mock (Use day 1 hotel for all days for parity demo)
    const accommodation = ACCOMMODATION_DATA.hotel[0];

    const handleAddMiniGem = (parentActivity, spot) => {
        Alert.alert(
            "Add Mini-Gem",
            `Add ${spot.name} to your plan? (~1 hour)`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Add",
                    onPress: () => {
                        const newItinerary = [...itinerary];
                        const day = parentActivity.day;

                        // Parse parent time
                        const [hours, minutes] = parentActivity.time.split(':').map(Number);
                        const duration = parentActivity.duration || 2;

                        // Calculate new time
                        const startMins = hours * 60 + minutes + (duration * 60);
                        const newH = Math.floor(startMins / 60) % 24;
                        const newM = startMins % 60;
                        const newTime = `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;

                        const newActivity = {
                            ...spot,
                            id: `gem-${Date.now()}`,
                            day,
                            time: newTime,
                            duration: 1,
                            type: 'activity',
                            category: spot.category || 'Discovery'
                        };

                        newItinerary.push(newActivity);
                        // Sort
                        newItinerary.sort((a, b) => {
                            if (a.day !== b.day) return a.day - b.day;
                            const ta = parseInt(a.time.replace(':', ''));
                            const tb = parseInt(b.time.replace(':', ''));
                            return ta - tb;
                        });

                        setItinerary(newItinerary);
                        Alert.alert("Success", `${spot.name} added!`);
                    }
                }
            ]
        );
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out my trip to ${locationName}!\n\nI'm planning a trip to ${locationName}. Check out my itinerary!`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const renderActivityCard = (item, index, dayItems) => {
        if (item.type === 'transport') {
            return (
                <View key={item.id || index} style={styles.transportWrapper}>
                    <View style={styles.transportCard}>
                        <View style={[styles.transportIconBox, { backgroundColor: '#f97316' }]}>
                            <Car size={16} color="#fff" />
                        </View>
                        <View style={styles.transportBody}>
                            <View style={styles.transportHead}>
                                <Text style={styles.transportLabel}>GRAB / CAR</Text>
                                <Text style={styles.transportCost}>~RM {item.price || 18}</Text>
                            </View>
                            <Text style={styles.transportTitle}>Trip towards next stop</Text>
                        </View>
                    </View>
                </View>
            );
        }

        if (item.type === 'logistics') {
            return (
                <View key={item.id || index} style={styles.timelineItem}>
                    <View style={styles.timeLabelContainer}>
                        <Text style={styles.timeLabelText}>{item.time || '14:00'}</Text>
                    </View>
                    <View style={[styles.timelineDot, { backgroundColor: '#3b82f6' }]} />
                    <View style={[styles.cardContainer, { backgroundColor: '#eff6ff', borderColor: '#dbeafe' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <Bed size={20} color="#3b82f6" />
                            <View>
                                <Text style={[styles.cardCat, { color: '#3b82f6' }]}>ACCOMMODATION</Text>
                                <Text style={styles.cardTitle}>{item.name}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            );
        }

        return (
            <View key={item.id || index} style={styles.timelineItem}>
                {/* Time & Dot Indicator */}
                <View style={styles.timeLabelContainer}>
                    <Text style={styles.timeLabelText}>{item.time || '09:00'}</Text>
                </View>
                <View style={[styles.timelineDot, item.category === 'Food' && { backgroundColor: '#ef4444' }]} />

                {/* Activity Card */}
                <TouchableOpacity
                    style={styles.cardContainer}
                    activeOpacity={0.9}
                    onPress={() => Alert.alert(item.name, item.description || "Activity Details")}
                >
                    <View style={styles.cardHeaderRow}>
                        <Text style={styles.cardCat}>{item.category || item.type}</Text>
                        <View style={styles.ratingBadge}>
                            <Star size={10} color="#eab308" fill="#eab308" />
                            <Text style={styles.ratingText}>{item.rating || 4.5}</Text>
                        </View>
                    </View>

                    <Text style={styles.cardTitle}>{item.name}</Text>

                    <View style={styles.cardStatsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{formatPrice(item.price || 0)} / pax</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Clock size={12} color="#64748b" />
                            <View style={styles.durationInlineControls}>
                                <TouchableOpacity onPress={() => updateActivityDuration(item.id, Math.max(0.5, (item.duration || 2) - 0.5))}>
                                    <View style={styles.miniCirc}>
                                        <Text style={styles.miniCircText}>-</Text>
                                    </View>
                                </TouchableOpacity>
                                <Text style={styles.statValue}>{item.duration || 2} hrs</Text>
                                <TouchableOpacity onPress={() => updateActivityDuration(item.id, Math.min(8, (item.duration || 2) + 0.5))}>
                                    <View style={styles.miniCirc}>
                                        <Text style={styles.miniCircText}>+</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={styles.locationRow}>
                        <MapPin size={12} color="#64748b" />
                        <Text style={styles.locText}>{locationName}</Text>
                    </View>

                    {item.nearbySpots && item.nearbySpots.length > 0 && (
                        <View style={styles.nearbySection}>
                            <View style={styles.nearbyHeader}>
                                <Sparkles size={10} color="#94a3b8" />
                                <Text style={styles.nearbyTitle}>NEARBY MINI-GEMS</Text>
                            </View>
                            {item.nearbySpots.slice(0, 1).map((spot, sIdx) => (
                                <View key={sIdx} style={styles.nearbyTinyCard}>
                                    <View style={styles.nearbyImgHold} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.nearbyName}>{spot.name}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                                            <Star size={8} color="#eab308" fill="#eab308" />
                                            <Text style={styles.nearbyMeta}>4.5</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.nearbyAdd}
                                        onPress={() => handleAddMiniGem(item, spot)}
                                    >
                                        <Plus size={14} color="#64748b" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <BatikOverlay type="full" opacity={0.04} />
            <View style={styles.screenWrapper}>
                <ScrollView
                    ref={scrollRef}
                    style={styles.container}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header Section */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.changePlanBtn}>
                            <ArrowLeft size={16} color="#3b82f6" />
                            <Text style={styles.changePlanText}>CHANGE PLAN</Text>
                        </TouchableOpacity>

                        <Text style={styles.tripTitle}>{tripName}</Text>

                        <View style={styles.statusRow}>
                            <View style={styles.optimizedBadge}>
                                <View style={styles.pulseDot} />
                                <Text style={styles.optimizedText}>OPTIMIZED FOR YOU</Text>
                            </View>
                            <Text style={styles.genDate}>Generated {new Date().toLocaleDateString('en-GB')}</Text>
                        </View>
                    </View>

                    {/* Pro Tips Section */}
                    <View style={styles.tipsSection}>
                        <View style={styles.tipsSectionTitleRow}>
                            <View style={styles.infoIconBox}>
                                <Info size={14} color="#3b82f6" />
                            </View>
                            <Text style={styles.tipsSectionTitle}>Pro Tips for {locationName}</Text>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tipsScroll}>
                            {tips.length > 0 ? tips.slice(0, 2).map((tip, i) => (
                                <View key={i} style={styles.tipCard}>
                                    <View style={styles.tipHeader}>
                                        <Sparkles size={12} color="#3b82f6" />
                                        <Text style={styles.tipLabelText}>{tip.title?.toUpperCase() || 'TIP'}</Text>
                                    </View>
                                    <Text style={styles.tipContentText} numberOfLines={3}>{tip.content}</Text>
                                </View>
                            )) : (
                                <View style={styles.tipCard}>
                                    <Text style={styles.tipContentText}>Plan your trip across beautiful Malaysia.</Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>

                    {/* Itinerary Flow Section */}
                    <View style={styles.flowContainer}>
                        {/* Vertical Timeline Line */}
                        <View style={styles.timelineLine} />

                        {dayList.map((dayNum) => (
                            <View key={dayNum} style={styles.dayGroup}>
                                {/* Day Header */}
                                <View style={styles.dayHeader}>
                                    <View style={styles.dayCircle}>
                                        <Text style={styles.dayCircleText}>{dayNum}</Text>
                                    </View>
                                    <View style={styles.dayHeaderInfo}>
                                        <Text style={styles.dayLocationName}>{locationName}</Text>
                                        <Text style={styles.dayDateSubtext}>
                                            {new Date(new Date().setDate(new Date().getDate() + (parseInt(dayNum) - 1))).toLocaleDateString('en-MY', { weekday: 'long', day: 'numeric', month: 'short' }).toUpperCase()}
                                        </Text>
                                    </View>
                                </View>

                                {/* Warnings */}
                                {(() => {
                                    const activitiesCount = dailyPlans[dayNum].filter(a => a.type !== 'transport').length;
                                    const dayCost = dailyPlans[dayNum].reduce((sum, a) => sum + (a.price || 0), 0);
                                    const isBusy = activitiesCount > (ITINERARY_RULES?.warningThresholds?.busyDay || 5);
                                    const isExpensive = dayCost > ((BUDGET_DEFAULTS?.foodPerDay?.high || 150) + (BUDGET_DEFAULTS?.transportPerDay?.high || 100) + 200);

                                    return (
                                        <View style={{ marginBottom: 16, paddingLeft: 76 }}>
                                            {isBusy && (
                                                <View style={styles.warningBox}>
                                                    <View style={[styles.warningIconBox, { backgroundColor: '#ffedd5' }]}>
                                                        <AlertTriangle size={14} color="#c2410c" />
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={[styles.warningTitle, { color: '#9a3412' }]}>BUSY DAY ALERT</Text>
                                                        <Text style={[styles.warningDesc, { color: '#c2410c' }]}>Consider moving some activities.</Text>
                                                    </View>
                                                </View>
                                            )}
                                            {isExpensive && (
                                                <View style={[styles.warningBox, { backgroundColor: '#fef2f2', borderColor: '#fecaca' }]}>
                                                    <View style={[styles.warningIconBox, { backgroundColor: '#fee2e2' }]}>
                                                        <DollarSign color="#dc2626" />
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={[styles.warningTitle, { color: '#991b1b' }]}>HIGH SPENDING</Text>
                                                        <Text style={[styles.warningDesc, { color: '#b91c1c' }]}>Day total RM {dayCost} exceeds typical budget.</Text>
                                                    </View>
                                                </View>
                                            )}
                                        </View>
                                    );
                                })()}

                                {/* Activities for the day */}
                                {dailyPlans[dayNum].map((item, idx) => renderActivityCard(item, idx, dailyPlans[dayNum]))}
                            </View>
                        ))}
                    </View>

                    {/* Strategy Summary Section */}
                    <View style={styles.summarySection}>
                        <Text style={styles.summaryTitle}>STRATEGY SUMMARY</Text>
                        <View style={styles.summaryCard}>
                            <View style={styles.summaryRow}>
                                <View style={styles.summaryIconBox}><Clock size={16} color="#64748b" /></View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.sumLabel}>Net Duration</Text>
                                    <Text style={styles.sumValue}>{itinerary.length * 4}h over {dayList.length} days</Text>
                                </View>
                            </View>
                            <View style={styles.summaryRow}>
                                <View style={styles.summaryIconBox}><Users size={16} color="#64748b" /></View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.sumLabel}>Travel Party</Text>
                                    <Text style={styles.sumValue}>{tripMembers.length} Person</Text>
                                </View>
                            </View>
                            <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
                                <View style={styles.summaryIconBox}><DollarSign color="#64748b" /></View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.sumLabel}>Estimated Cost</Text>
                                    <Text style={styles.sumValue}>RM {(itinerary.length * 45).toFixed(2)}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.actionButtons}>
                            <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                                <Share2 size={20} color="#0f172a" />
                                <Text style={styles.shareBtnText}>Share</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmBtn}>
                                <Text style={styles.confirmBtnText}>Confirm Plan</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>

                {/* Floating Map Button */}
                <TouchableOpacity
                    style={styles.mapFab}
                    onPress={() => setShowMap(true)}
                    activeOpacity={0.9}
                >
                    <MapIcon size={24} color="#fff" />
                    <Text style={styles.mapFabText}>View Map</Text>
                </TouchableOpacity>

                {/* Map Modal */}
                <Modal
                    visible={showMap}
                    animationType="slide"
                    presentationStyle="pageSheet"
                    onRequestClose={() => setShowMap(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Trip Map</Text>
                            <TouchableOpacity onPress={() => setShowMap(false)} style={styles.closeBtn}>
                                <X size={24} color="#0f172a" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.mapWrapper}>
                            <TripMap items={dailyPlans ? Object.keys(dailyPlans).map(d => ({
                                day: d,
                                state: dailyPlans[d][0]?.state || locationName,
                                activities: dailyPlans[d]
                            })) : []} />
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#fff' },
    screenWrapper: { flex: 1 },
    container: { flex: 1 },
    scrollContent: { padding: 24, paddingBottom: 100 },

    // Header
    header: { marginBottom: 32 },
    changePlanBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    changePlanText: { fontSize: 10, fontWeight: '900', color: '#3b82f6', letterSpacing: 2 },
    tripTitle: { fontSize: 36, fontWeight: '900', color: '#0f172a', tracking: -1, lineHeight: 40, marginBottom: 16, maxWidth: '90%' },
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    optimizedBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f0fdf4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: '#dcfce7' },
    pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22c55e' },
    optimizedText: { fontSize: 9, fontWeight: '900', color: '#166534', letterSpacing: 1 },
    genDate: { fontSize: 13, fontWeight: '700', color: '#94a3b8' },

    // Tips Area
    tipsSection: { marginBottom: 40 },
    tipsSectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16, paddingLeft: 4 },
    infoIconBox: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center' },
    tipsSectionTitle: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
    tipsScroll: { marginHorizontal: -24, paddingHorizontal: 24 },
    tipCard: { width: width * 0.7, backgroundColor: '#f8fafc', padding: 20, borderRadius: 32, borderWidth: 1, borderColor: '#f1f5f9', marginRight: 16 },
    tipHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    tipLabelText: { fontSize: 9, fontWeight: '900', color: '#3b82f6', letterSpacing: 1 },
    tipContentText: { fontSize: 13, fontWeight: '600', color: '#64748b', lineHeight: 20 },

    // Flow & Timeline
    flowContainer: { position: 'relative', paddingLeft: 24 }, // Add padding to container so absolute lefts work relative to this
    timelineLine: { position: 'absolute', left: 83, top: 0, bottom: 0, width: 4, backgroundColor: '#e2e8f0', borderRadius: 2 }, // Thicker, lighter line
    dayGroup: { marginBottom: 32 },

    // Day Header
    dayHeader: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 32 },
    dayCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center', shadowColor: '#0f172a', shadowOpacity: 0.3, shadowRadius: 8, elevation: 6, zIndex: 10, borderWidth: 4, borderColor: '#fff' },
    dayCircleText: { fontSize: 20, fontWeight: '900', color: '#fff' },
    dayHeaderInfo: { flex: 1 },
    dayLocationName: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
    dayDateSubtext: { fontSize: 12, fontWeight: '800', color: '#94a3b8', letterSpacing: 1, textTransform: 'uppercase' },

    // Timeline Items
    timelineItem: { flexDirection: 'row', marginBottom: 32, position: 'relative', minHeight: 80 },
    timeLabelContainer: { position: 'absolute', left: 0, top: 24, width: 60, alignItems: 'flex-end', paddingRight: 8 },
    timeLabelText: { fontSize: 12, fontWeight: '800', color: '#94a3b8' },

    // Dot with Ring
    timelineDot: { position: 'absolute', left: 78, top: 28, width: 14, height: 14, borderRadius: 7, backgroundColor: '#3b82f6', borderWidth: 3, borderColor: '#fff', zIndex: 10, shadowColor: '#3b82f6', shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 },

    // Activity Cards (Horizontal)
    cardContainer: { flex: 1, marginLeft: 100, backgroundColor: '#fff', padding: 20, borderRadius: 28, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 16, elevation: 3 },
    cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    cardCat: { fontSize: 10, fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 },
    ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fefce8', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#fef3c7' },
    ratingText: { fontSize: 10, fontWeight: '900', color: '#854d0e' },
    cardTitle: { fontSize: 18, fontWeight: '900', color: '#0f172a', marginBottom: 16 },
    cardStatsRow: { flexDirection: 'row', gap: 16, marginBottom: 12 },
    statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    statValue: { fontSize: 12, fontWeight: '800', color: '#64748b' },
    durationInlineControls: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f8fafc', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    miniCirc: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
    miniCircText: { fontSize: 14, fontWeight: '900', color: '#3b82f6' },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    locText: { fontSize: 11, fontWeight: '800', color: '#94a3b8' },

    // Transport Card
    transportWrapper: { paddingLeft: 100, marginBottom: 32 },
    transportCard: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, borderRadius: 24, borderWidth: 1, borderStyle: 'dashed', borderColor: '#fdba74', backgroundColor: '#fff7ed' },
    transportIconBox: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    transportBody: { flex: 1 },
    transportHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
    transportLabel: { fontSize: 10, fontWeight: '900', color: '#c2410c', letterSpacing: 0.5 },
    transportCost: { fontSize: 12, fontWeight: '800', color: '#c2410c' },
    transportTitle: { fontSize: 14, fontWeight: '800', color: '#9a3412' },

    // Nearby Mini Gems (Responsive style)
    nearbySection: { marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
    nearbyHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
    nearbyTitle: { fontSize: 9, fontWeight: '900', color: '#94a3b8', letterSpacing: 1 },
    nearbyTinyCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#f8fafc', padding: 8, borderRadius: 16 },
    nearbyImgHold: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#cbd5e1' },
    nearbyName: { fontSize: 12, fontWeight: '800', color: '#0f172a' },
    nearbyMeta: { fontSize: 10, fontWeight: '800', color: '#854d0e' },
    nearbyAdd: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e2e8f0' },

    // Summary Section
    summarySection: { marginTop: 16, borderTopWidth: 2, borderTopColor: '#f1f5f9', paddingTop: 40 },
    summaryTitle: { fontSize: 11, fontWeight: '900', color: '#94a3b8', letterSpacing: 2, marginBottom: 20 },
    summaryCard: { backgroundColor: '#f8fafc', padding: 24, borderRadius: 32, borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 24 },
    summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    summaryIconBox: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
    sumLabel: { fontSize: 10, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' },
    sumValue: { fontSize: 14, fontWeight: '900', color: '#0f172a' },

    actionButtons: { flexDirection: 'row', gap: 12 },
    shareBtn: { flex: 1, height: 60, borderRadius: 30, backgroundColor: '#f8fafc', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderWidth: 1, borderColor: '#e2e8f0' },
    shareBtnText: { fontSize: 15, fontWeight: '900', color: '#0f172a' },
    confirmBtn: { flex: 1.5, height: 60, borderRadius: 30, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center' },
    confirmBtnText: { fontSize: 15, fontWeight: '900', color: '#fff' },

    // Warnings
    warningBox: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff7ed', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#fed7aa', marginBottom: 8 },
    warningIconBox: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    warningTitle: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
    warningDesc: { fontSize: 11, fontWeight: '600' },

    // Map FAB
    mapFab: { position: 'absolute', bottom: 32, right: 24, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#0f172a', paddingHorizontal: 20, paddingVertical: 16, borderRadius: 32, shadowColor: '#0f172a', shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
    mapFabText: { fontSize: 13, fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: 1 },

    // Modal
    modalContainer: { flex: 1, backgroundColor: '#fff' },
    modalHeader: { padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    modalTitle: { fontSize: 20, fontWeight: '900', color: '#0f172a' },
    closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
    mapWrapper: { flex: 1 },
});
