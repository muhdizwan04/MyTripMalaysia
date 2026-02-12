import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { MapPin, Calendar, ArrowRight, Plus } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyTripsScreen() {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        if (isFocused) {
            loadTrips();
        }
    }, [isFocused]);

    const loadTrips = async () => {
        try {
            const savedTrips = await AsyncStorage.getItem('my_trips');
            if (savedTrips) {
                setTrips(JSON.parse(savedTrips).reverse());
            }
        } catch (error) {
            console.error('Failed to load trips:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerSubtitle}>YOUR PASSPORT</Text>
                    <Text style={styles.headerTitle}>My Trips</Text>
                </View>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('Plan')} // Plan tab
                >
                    <Plus size={24} color="#0f172a" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {trips.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconBox}>
                            <MapPin size={48} color="#cbd5e1" />
                        </View>
                        <View style={styles.emptyTextContainer}>
                            <Text style={styles.emptyTitle}>The map is empty!</Text>
                            <Text style={styles.emptySubtitle}>
                                "Travel is the only thing you buy that makes you richer."
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.ctaButton}
                            onPress={() => navigation.navigate('Plan')}
                        >
                            <Text style={styles.ctaButtonText}>PLAN FIRST ADVENTURE</Text>
                            <ArrowRight size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.tripsList}>
                        {trips.map((trip, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.tripCard}
                                onPress={() => navigation.navigate('Itinerary', { itinerary: trip.itinerary, tripName: trip.title })}
                                activeOpacity={0.9}
                            >
                                <View style={styles.cardHeader}>
                                    <View style={styles.cardOverlay} />
                                    {/* Mock Gradient/Image placeholder - in real app use ImageBackground with trip destination image */}
                                    <View style={styles.cardInternal}>
                                        <MapPin size={64} color="rgba(255,255,255,0.1)" style={styles.cardBgIcon} />

                                        <View style={styles.durationBadge}>
                                            <Text style={styles.durationText}>{trip.duration || 3} DAYS</Text>
                                        </View>

                                        <View style={styles.arrowBadge}>
                                            <ArrowRight size={20} color="#fff" />
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.cardContent}>
                                    <View>
                                        <Text style={styles.tripTitle}>{trip.title || 'Wild Adventure'}</Text>
                                        <View style={styles.dateRow}>
                                            <Calendar size={12} color="#0f172a" />
                                            <Text style={styles.dateText}>
                                                {new Date(trip.createdAt || Date.now()).toLocaleDateString('en-MY', { month: 'long', year: 'numeric' })}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.cardFooter}>
                                        <View style={styles.paxRow}>
                                            <View style={[styles.paxBubble, { zIndex: 3, backgroundColor: '#f1f5f9' }]}>
                                                <Text style={styles.paxText}>S</Text>
                                            </View>
                                            <View style={[styles.paxBubble, { zIndex: 2, marginLeft: -8, backgroundColor: '#e2e8f0' }]}>
                                                <Text style={styles.paxText}>M</Text>
                                            </View>
                                            <View style={[styles.paxBubble, { zIndex: 1, marginLeft: -8, backgroundColor: '#eff6ff' }]}>
                                                <Text style={[styles.paxText, { color: '#2563eb' }]}>+{trip.pax || 2}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.tagBadge}>
                                            <Text style={styles.tagText}>{trip.travelStyle || 'EXPLORE'}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fdfbf7' }, // bg-batik equivalent
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', padding: 24, paddingBottom: 10 },
    headerSubtitle: { fontSize: 10, fontWeight: '900', color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2 },
    headerTitle: { fontSize: 36, fontWeight: '900', color: '#0f172a', letterSpacing: -1 },
    addButton: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#2563eb', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4 },

    content: { padding: 24, paddingBottom: 100 },

    // Empty State
    emptyState: { paddingVertical: 60, alignItems: 'center', gap: 24 },
    emptyIconBox: { width: 120, height: 120, borderRadius: 48, backgroundColor: 'rgba(241, 245, 249, 0.5)', borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
    emptyTextContainer: { alignItems: 'center', gap: 8 },
    emptyTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
    emptySubtitle: { fontSize: 14, color: '#64748b', fontStyle: 'italic', textAlign: 'center', paddingHorizontal: 40, lineHeight: 22 },
    ctaButton: { flexDirection: 'row', alignItems: 'center', height: 64, paddingHorizontal: 40, backgroundColor: '#0f172a', borderRadius: 28, gap: 8, marginTop: 16, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
    ctaButtonText: { color: '#fff', fontSize: 14, fontWeight: '900' },

    // List
    tripsList: { gap: 24 },
    tripCard: { backgroundColor: '#fff', borderRadius: 32, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15, shadowOffset: { width: 0, height: 8 }, elevation: 3 },
    cardHeader: { height: 128, backgroundColor: '#eff6ff', position: 'relative' },
    cardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.05)' },
    cardInternal: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    cardBgIcon: { opacity: 0.5 },

    durationBadge: { position: 'absolute', top: 16, left: 16, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    durationText: { fontSize: 10, fontWeight: '900', color: '#2563eb', letterSpacing: 1 },

    arrowBadge: { position: 'absolute', bottom: 16, right: 16, width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },

    cardContent: { padding: 24, gap: 16 },
    tripTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a', lineHeight: 28, marginBottom: 8 },
    dateRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f8fafc', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    dateText: { fontSize: 10, fontWeight: '800', color: '#64748b', letterSpacing: 0.5, textTransform: 'uppercase' },

    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 },
    paxRow: { flexDirection: 'row', alignItems: 'center' },
    paxBubble: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
    paxText: { fontSize: 10, fontWeight: '800', color: '#64748b' },

    tagBadge: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#eff6ff', borderRadius: 100 },
    tagText: { fontSize: 10, fontWeight: '900', color: '#2563eb', letterSpacing: 1 }
});
