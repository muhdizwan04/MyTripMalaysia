import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Search, MapPin, Compass, Utensils, ShoppingBag, Camera, ChevronRight, Star, User, DollarSign, Sparkles, X, Heart, Bookmark, MessageCircle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FEED_POSTS, MOCK_ITINERARIES, VIRAL_SPOTS, FEATURED_TRIPS } from '../lib/constants';
import { fetchAttractions, fetchDestinations, fetchItineraries } from '../lib/api';
import { useCurrency } from '../context/CurrencyContext';
import FeedPost from '../components/feed/FeedPost';
import { Button } from '../components/ui/Button';
import { colors } from '../config/colors';
import BatikOverlay from '../components/ui/BatikOverlay';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
    const navigation = useNavigation();
    const { formatPrice } = useCurrency();
    const [searchQuery, setSearchQuery] = useState('');
    const [attractions, setAttractions] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedSpot, setSelectedSpot] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [attractionsData, destinationsData, itinerariesData] = await Promise.all([
                    fetchAttractions({ limit: 10, is_trending: true }),
                    fetchDestinations(),
                    fetchItineraries({ limit: 5 })
                ]);
                setAttractions(attractionsData || []);
                setDestinations(destinationsData || []);
                setItineraries(itinerariesData || []);
            } catch (err) {
                console.error('Failed to load data:', err);
                // Fallbacks
                setAttractions([]);
                setDestinations([]);
                setItineraries([]);
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
                (post.state || '').toLowerCase().includes(query)
            );
        }

        return true;
    });

    return (
        <SafeAreaView style={styles.container}>
            <BatikOverlay type="full" opacity={0.02} />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={styles.headerSubtitle}>EXPLORE</Text>
                            <Text style={styles.headerTitle}>Malaysia</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileButton}>
                            <User size={20} color={colors.primary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchContainer}>
                        <View style={styles.searchBar}>
                            <Search size={20} color={colors.mutedForeground} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Where to next?"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholderTextColor={colors.mutedForeground}
                            />
                        </View>
                    </View>
                </View>

                {/* Search Results */}
                {isSearching && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>SEARCH RESULTS</Text>
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Text style={{ fontSize: 12, fontWeight: '700', color: colors.primary }}>Clear</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.verticalList}>
                            {filteredPosts.length > 0 ? (
                                filteredPosts.map((post) => (
                                    <FeedPost key={post.id} post={post} />
                                ))
                            ) : (
                                <View style={{ alignItems: 'center', padding: 40, backgroundColor: colors.muted, borderRadius: 24, opacity: 0.5 }}>
                                    <Search size={48} color={colors.mutedForeground} style={{ marginBottom: 12, opacity: 0.5 }} />
                                    <Text style={{ color: colors.mutedForeground, fontWeight: 'bold' }}>No similar results found</Text>
                                    <Text style={{ fontSize: 12, color: colors.mutedForeground, marginTop: 4 }}>Try different keywords</Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                {!isSearching && (
                    <>
                        {/* Start Planning CTA */}
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Plan')}
                            style={styles.ctaCard}
                        >
                            <BatikOverlay type="full" inverted={true} opacity={0.15} />
                            <View style={styles.ctaDecoration1} />
                            <View style={styles.ctaDecoration2} />
                            <View style={styles.ctaContent}>
                                <View style={{ flex: 1, paddingRight: 20 }}>
                                    <View style={{ marginBottom: 4 }}>
                                        <Text style={styles.ctaTitle}>Start Planning</Text>
                                    </View>
                                    <Text style={styles.ctaDesc}>Build your perfect Malaysia trip in minutes.</Text>
                                </View>
                                <View style={styles.ctaIconBox}>
                                    <View style={styles.ctaIconPulse} />
                                    <Compass size={28} color="#fff" />
                                </View>
                            </View>
                        </TouchableOpacity>

                        {/* Quick Actions */}
                        <View style={styles.quickActionsGrid}>
                            {[
                                { icon: Utensils, label: 'Find Food', nav: 'Food', params: {} },
                                { icon: ShoppingBag, label: 'Shopping', nav: 'Shopping', params: {} },
                                { icon: Camera, label: 'Must Visit', nav: 'MustVisit', params: {} },
                                { icon: DollarSign, label: 'Expenses', nav: 'Expenses', params: {} }
                            ].map((item, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    onPress={() => navigation.navigate(item.nav, item.params)}
                                    style={styles.quickActionItem}
                                >
                                    <View style={styles.quickActionIcon}>
                                        <item.icon size={20} color={colors.primary} />
                                    </View>
                                    <Text style={styles.quickActionLabel}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Trending Itineraries */}
                        <View style={styles.section}>
                            <TouchableOpacity
                                style={styles.sectionHeader}
                                onPress={() => navigation.navigate('MustVisit', { type: 'MustVisit', title: 'Trending Itineraries', subtitle: 'Popular trips curated for you' })}
                            >
                                <Text style={styles.sectionTitle}>TRENDING ITINERARIES</Text>
                                <ChevronRight size={16} color={colors.mutedForeground} />
                            </TouchableOpacity>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                                {(itineraries.length > 0 ? itineraries : FEATURED_TRIPS).map((trip) => (
                                    <TouchableOpacity
                                        key={trip.id}
                                        style={styles.tripCard}
                                        onPress={() => {
                                            // Find matching full itinerary details
                                            const fullItinerary = MOCK_ITINERARIES[trip.id];
                                            if (fullItinerary) {
                                                // Flatten the day-by-day structure for the map verification
                                                const flatActivities = fullItinerary.flatMap(day => day.activities);
                                                navigation.navigate('Itinerary', {
                                                    itinerary: flatActivities,
                                                    tripName: trip.title
                                                });
                                            }
                                        }}
                                    >
                                        <Image source={{ uri: trip.image_url || trip.image }} style={styles.tripImage} />
                                        <View style={styles.tripOverlay}>
                                            <View style={styles.tripOverlayGradient} />
                                            <View style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                                                <Text style={styles.tripType}>{trip.tag || trip.type}</Text>
                                                <Text style={styles.tripTitle}>{trip.title}</Text>
                                                <Text style={styles.tripDetails}>{trip.days} Days • RM {trip.price}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Destinations */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>DESTINATIONS</Text>
                                <Text style={styles.sectionSubtitle}>13 STATES</Text>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                                {(destinations.length > 0 ? destinations : [
                                    { name: 'Selangor', image_url: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=300&q=80' },
                                    { name: 'Kuala Lumpur', image_url: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=300&q=80' },
                                    { name: 'Penang', image_url: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800' }
                                ]).map((dest, idx) => (
                                    <TouchableOpacity key={idx} style={styles.destCard} onPress={() => navigation.navigate('Plan', { preSelectedState: dest.name })}>
                                        <Image source={{ uri: dest.image_url }} style={styles.destImage} />
                                        <View style={styles.destOverlay}>
                                            <View style={styles.tripOverlayGradient} />
                                            <Text style={styles.destName}>{dest.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Trending Spot Detail Modal */}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={selectedSpot !== null}
                            onRequestClose={() => setSelectedSpot(null)}
                        >
                            {selectedSpot && (
                                <View style={styles.modalOverlay}>
                                    <View style={styles.modalContent}>
                                        <View style={styles.modalImageContainer}>
                                            <Image source={{ uri: selectedSpot.image_url || selectedSpot.image }} style={styles.modalImage} />
                                            <TouchableOpacity
                                                style={styles.closeButton}
                                                onPress={() => setSelectedSpot(null)}
                                            >
                                                <X size={20} color="#0f172a" />
                                            </TouchableOpacity>
                                            <View style={styles.modalBadge}>
                                                <Text style={styles.modalBadgeText}>{selectedSpot.type || selectedSpot.tag || 'Attraction'}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.modalBody}>
                                            <Text style={styles.modalTitle}>{selectedSpot.name}</Text>
                                            <View style={styles.modalMetaRow}>
                                                <MapPin size={16} color={colors.primary} />
                                                <Text style={styles.modalLocation}>{selectedSpot.location || 'Malaysia'}</Text>
                                            </View>
                                            <View style={styles.modalStatsRow}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                                    <Star size={20} color="#fbbf24" fill="#fbbf24" />
                                                    <Text style={{ fontWeight: '900', fontSize: 16 }}>{selectedSpot.rating}</Text>
                                                </View>
                                                {(selectedSpot.price) > 0 && (
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                                        <DollarSign size={16} color={colors.primary} />
                                                        <Text style={{ fontWeight: '900', color: colors.primary }}>{formatPrice(selectedSpot.price)}</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <ScrollView style={{ maxHeight: 150 }}>
                                                <Text style={styles.modalDescription}>{selectedSpot.description}</Text>
                                            </ScrollView>
                                            <Button
                                                onPress={() => {
                                                    setSelectedSpot(null);
                                                    navigation.navigate('Plan'); // Ideally pre-select
                                                }}
                                                style={{ marginTop: 24, height: 56, borderRadius: 16 }}
                                            >
                                                Add to Trip
                                            </Button>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </Modal>

                        {/* Trending Spots (Vertical) */}
                        <View style={styles.section}>
                            <TouchableOpacity
                                style={styles.sectionHeader}
                                onPress={() => navigation.navigate('MustVisit', { type: 'MustVisit', title: 'Trending Now', subtitle: 'Viral spots you cannot miss' })}
                            >
                                <Text style={styles.sectionTitle}>TRENDING NOW</Text>
                                <ChevronRight size={16} color={colors.mutedForeground} />
                            </TouchableOpacity>
                            <View style={styles.verticalList}>
                                {loading ? (
                                    <Text style={styles.loadingText}>Loading...</Text>
                                ) : (
                                    (attractions.length > 0 ? attractions.filter(spot => spot.is_trending) : VIRAL_SPOTS).map((spot) => (
                                        <TouchableOpacity
                                            key={spot.id}
                                            style={styles.spotCard}
                                            onPress={() => setSelectedSpot(spot)}
                                        >
                                            <Image source={{ uri: spot.image_url || spot.image }} style={styles.spotImage} />
                                            <View style={styles.spotInfo}>
                                                <Text style={styles.spotName}>{spot.name}</Text>
                                                <View style={styles.spotMeta}>
                                                    <MapPin size={12} color={colors.primary} />
                                                    <Text style={styles.spotLocation}>{spot.location || spot.state}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <View style={styles.spotRating}>
                                                        <Star size={12} color="#fbbf24" fill="#fbbf24" />
                                                        <Text style={styles.spotRatingText}>{spot.rating}</Text>
                                                    </View>
                                                    {(spot.price) > 0 && (
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                                                            <DollarSign size={12} color={colors.primary} />
                                                            <Text style={{ fontSize: 10, fontWeight: '900', color: colors.primary }}>{formatPrice(spot.price)}</Text>
                                                        </View>
                                                    )}
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                )}
                            </View>
                        </View>

                        {/* Community Feed */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <Sparkles size={16} color={colors.primary} />
                                    <Text style={styles.sectionTitle}>COMMUNITY FEED</Text>
                                </View>
                                {/* Filter Chips */}
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                                    {['all', 'food', 'scenery'].map((filter) => (
                                        <TouchableOpacity
                                            key={filter}
                                            onPress={() => setActiveFilter(filter)}
                                            style={{
                                                paddingHorizontal: 12,
                                                paddingVertical: 6,
                                                borderRadius: 20,
                                                backgroundColor: activeFilter === filter ? colors.primary : '#fff',
                                                borderWidth: 1,
                                                borderColor: activeFilter === filter ? colors.primary : colors.input
                                            }}
                                        >
                                            <Text style={{
                                                fontSize: 10,
                                                fontWeight: '900',
                                                textTransform: 'uppercase',
                                                color: activeFilter === filter ? '#fff' : colors.mutedForeground
                                            }}>
                                                {filter === 'scenery' ? '📸 Scenery' : filter === 'food' ? '🍽️ Food' : 'All'}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            <View style={styles.verticalList}>
                                {filteredPosts.length > 0 ? (
                                    filteredPosts.map((post) => (
                                        <FeedPost key={post.id} post={post} />
                                    ))
                                ) : (
                                    <View style={{ alignItems: 'center', padding: 20 }}>
                                        <Text style={{ color: colors.mutedForeground }}>No posts found.</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background, // bg-batik equivalent would be an ImageBackground but using simple color for now
    },
    scrollContent: {
        paddingBottom: 24,
    },
    header: {
        padding: 24,
        paddingBottom: 10,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    headerSubtitle: {
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: colors.primary,
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: colors.foreground,
        letterSpacing: -1,
    },
    profileButton: {
        height: 48,
        width: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(37, 99, 235, 0.1)', // primary/10
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(37, 99, 235, 0.2)', // primary/20
    },
    searchContainer: {
        marginBottom: 10,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    searchInput: {
        marginLeft: 12,
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: colors.foreground,
    },
    ctaCard: {
        backgroundColor: colors.primary,
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 32,
        borderRadius: 48,
        padding: 32,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.35,
        shadowRadius: 25,
        elevation: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    ctaDecoration1: {
        position: 'absolute',
        top: -60,
        right: -30,
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    ctaDecoration2: {
        position: 'absolute',
        bottom: -20,
        left: -40,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    ctaContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 2,
    },
    ctaTitle: {
        fontSize: 34,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: -1,
        lineHeight: 40,
    },
    ctaDesc: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 22,
    },
    ctaIconBox: {
        height: 64,
        width: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    ctaIconPulse: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    quickActionsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        marginBottom: 40,
    },
    quickActionItem: {
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#fff',
        paddingVertical: 16,
        paddingHorizontal: 12, // slightly adjusted
        borderRadius: 24,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        width: width / 4 - 18, // dynamic width
    },
    quickActionIcon: {
        height: 40,
        width: 40,
        borderRadius: 16,
        backgroundColor: 'rgba(37, 99, 235, 0.1)', // primary/10
        alignItems: 'center',
        justifyContent: 'center',
    },
    quickActionLabel: {
        fontSize: 9,
        fontWeight: '900',
        color: '#0f172a',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    section: {
        marginBottom: 40,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: colors.primary,
    },
    sectionSubtitle: {
        fontSize: 10,
        fontWeight: '900',
        color: colors.mutedForeground,
    },
    horizontalList: {
        paddingHorizontal: 24,
        gap: 16,
    },
    tripCard: {
        width: 200,
        height: 240,
        borderRadius: 28,
        overflow: 'hidden',
        backgroundColor: colors.secondary,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    tripImage: {
        width: '100%',
        height: '100%',
    },
    tripOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    tripOverlayGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: 'rgba(0,0,0,0.6)', // Gradient simulation
    },
    tripType: {
        fontSize: 8,
        fontWeight: '900',
        color: '#fff',
        backgroundColor: colors.primary,
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        marginBottom: 4,
        overflow: 'hidden',
        opacity: 0.9,
    },
    tripTitle: {
        fontSize: 18, // slightly larger
        fontWeight: '900',
        color: '#fff',
        marginBottom: 4,
        lineHeight: 20,
    },
    tripDetails: {
        fontSize: 10,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.8)',
    },
    destCard: {
        width: 128,
        height: 160,
        borderRadius: 28,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
        position: 'relative',
    },
    destImage: {
        width: '100%',
        height: '100%',
    },
    destOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
    },
    destName: {
        fontSize: 12,
        fontWeight: '900',
        color: '#fff',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
        zIndex: 2,
    },
    verticalList: {
        paddingHorizontal: 24,
        gap: 16,
    },
    spotCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 28,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)', // white/50
        overflow: 'hidden',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    spotImage: {
        width: 96,
        height: 96,
    },
    spotInfo: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    spotName: {
        fontSize: 14,
        fontWeight: '900',
        color: colors.foreground,
        marginBottom: 4,
    },
    spotMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 8,
    },
    spotLocation: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.mutedForeground,
    },
    spotRating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    spotRatingText: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.mutedForeground,
    },
    loadingText: {
        marginLeft: 24,
        color: colors.mutedForeground,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 32,
        overflow: 'hidden',
        maxHeight: height * 0.8,
    },
    modalImageContainer: {
        height: 250,
        position: 'relative',
    },
    modalImage: {
        width: '100%',
        height: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    modalBadge: {
        position: 'absolute',
        top: 16,
        left: 16,
        backgroundColor: colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    modalBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    modalBody: {
        padding: 24,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 8,
        color: colors.foreground,
    },
    modalMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    modalLocation: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.mutedForeground,
    },
    modalStatsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
        marginBottom: 16,
    },
    modalDescription: {
        fontSize: 14,
        lineHeight: 24,
        color: colors.mutedForeground,
    }
});
