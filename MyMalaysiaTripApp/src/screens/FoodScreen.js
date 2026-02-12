import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, MapPin, Star, DollarSign, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import AddActivityModal from '../components/AddActivityModal';
import { useTrip } from '../context/TripContext';

const FOOD_PLACES = [
    { id: 1, name: "Village Park Nasi Lemak", location: "Petaling Jaya", state: "Selangor", rating: 4.8, price: 25, image: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=500&q=80", category: "Local", description: "Famous nasi lemak with crispy chicken", halal: true, isLocal: true },
    { id: 2, name: "Jalan Alor Night Market", location: "Bukit Bintang", state: "Kuala Lumpur", rating: 4.7, price: 15, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80", category: "Street Food", description: "Vibrant street food paradise", halal: false, isLocal: true },
    { id: 3, name: "Char Kuey Teow Lorong Selamat", location: "George Town", state: "Penang", rating: 4.8, price: 12, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=500&q=80", category: "Local", description: "Best char kuey teow in Penang", halal: false, isLocal: true },
    { id: 4, name: "Hakka Restaurant", location: "Ipoh", state: "Perak", rating: 4.6, price: 30, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80", category: "Restaurant", description: "Authentic Hakka cuisine", halal: false, isLocal: true },
    { id: 5, name: "Satay Celup Capitol", location: "Malacca City", state: "Melaka", rating: 4.5, price: 20, image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=500&q=80", category: "Local", description: "Famous satay celup hotpot", halal: true, isLocal: true },
    { id: 6, name: "Kim Lian Kee", location: "Kuala Lumpur", state: "Kuala Lumpur", rating: 4.6, price: 18, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80", category: "Local", description: "Iconic hokkien mee since 1927", halal: false, isLocal: true },
    { id: 7, name: "Oceanview Seafood", location: "Kuantan", state: "Pahang", rating: 4.7, price: 50, image: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=500&q=80", category: "Seafood", description: "Fresh seafood by the sea", halal: true, isLocal: true },
    { id: 8, name: "Little India Banana Leaf", location: "Johor Bahru", state: "Johor", rating: 4.5, price: 15, image: "https://images.unsplash.com/photo-1585937421612-70e008356f3a?auto=format&fit=crop&w=500&q=80", category: "Indian", description: "Authentic South Indian cuisine", halal: true, isLocal: true },
];

const FoodScreen = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedState, setSelectedState] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { addActivity } = useTrip();

    const filteredPlaces = FOOD_PLACES.filter(place => {
        if (selectedState !== 'all' && place.state !== selectedState) return false;
        if (selectedCategory !== 'all' && place.category !== selectedCategory) return false;
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            return place.name.toLowerCase().includes(query) ||
                place.location.toLowerCase().includes(query) ||
                place.description.toLowerCase().includes(query);
        }
        return true;
    });

    // Helper for formatting price
    const formatPrice = (price) => `RM ${price}`;

    // Simple Dropdown-like Selector
    const Selector = ({ value, options, onSelect, label }) => (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
            <TouchableOpacity
                style={[styles.chip, value === 'all' && styles.chipActive]}
                onPress={() => onSelect('all')}
            >
                <Text style={[styles.chipText, value === 'all' && styles.chipTextActive]}>All {label}</Text>
            </TouchableOpacity>
            {options.map(opt => (
                <TouchableOpacity
                    key={opt}
                    style={[styles.chip, value === opt && styles.chipActive]}
                    onPress={() => onSelect(opt)}
                >
                    <Text style={[styles.chipText, value === opt && styles.chipTextActive]}>{opt}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    const states = ['Kuala Lumpur', 'Selangor', 'Penang', 'Johor', 'Melaka', 'Perak', 'Pahang'];
    const categories = ['Local', 'Street Food', 'Restaurant', 'Seafood', 'Indian'];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#64748b" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Find Food 🍜</Text>
                <Text style={styles.subtitle}>Discover amazing food across Malaysia</Text>
            </View>

            <View style={styles.searchContainer}>
                <Search size={20} color="#94a3b8" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search food places..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#94a3b8"
                />
            </View>

            <View style={styles.filtersContainer}>
                <Selector value={selectedState} options={states} onSelect={setSelectedState} label="States" />
                <View style={{ height: 10 }} />
                <Selector value={selectedCategory} options={categories} onSelect={setSelectedCategory} label="Types" />
            </View>

            <FlatList
                data={filteredPlaces}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => setSelectedSpot(item)}>
                        <Image source={{ uri: item.image }} style={styles.cardImage} />
                        <View style={styles.cardContent}>
                            <View style={styles.row}>
                                <Text style={styles.cardTitle}>{item.name}</Text>
                                {item.halal && <View style={styles.halalBadgeMini}><Text style={styles.halalTextMini}>M</Text></View>}
                            </View>
                            <View style={styles.row}>
                                <MapPin size={12} color="#0f172a" />
                                <Text style={styles.cardLocation}>{item.location}, {item.state}</Text>
                            </View>
                            <View style={styles.tagRow}>
                                {item.isLocal && <View style={styles.localTag}><Text style={styles.localTagText}>LOCAL FAVORITE</Text></View>}
                            </View>
                            <Text style={styles.cardDesc} numberOfLines={1}>{item.description}</Text>
                            <View style={styles.cardFooter}>
                                <View style={styles.ratingBadge}>
                                    <Star size={12} color="#eab308" fill="#eab308" />
                                    <Text style={styles.ratingText}>{item.rating}</Text>
                                </View>
                                <Text style={styles.priceText}>{formatPrice(item.price)}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Search size={48} color="#cbd5e1" />
                        <Text style={styles.emptyText}>No food places found</Text>
                    </View>
                }
            />

            {/* Detail Modal */}
            <Modal visible={!!selectedSpot} animationType="slide" transparent>
                {selectedSpot && (
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalImageContainer}>
                                <Image source={{ uri: selectedSpot.image }} style={styles.modalImage} />
                                <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedSpot(null)}>
                                    <X size={20} color="#0f172a" />
                                </TouchableOpacity>
                                <View style={styles.categoryBadge}>
                                    <Text style={styles.categoryText}>{selectedSpot.category}</Text>
                                </View>
                            </View>

                            <View style={styles.modalBody}>
                                <Text style={styles.modalTitle}>{selectedSpot.name}</Text>
                                <View style={styles.row}>
                                    <MapPin size={16} color="#0f172a" />
                                    <Text style={styles.modalLocation}>{selectedSpot.location}, {selectedSpot.state}</Text>
                                </View>

                                <View style={styles.statsContainer}>
                                    <View style={styles.statBadge}>
                                        <Star size={16} color="#eab308" fill="#eab308" />
                                        <Text style={styles.statText}>{selectedSpot.rating}</Text>
                                    </View>
                                    <View style={[styles.statBadge, { backgroundColor: '#f0f9ff', borderColor: '#e0f2fe' }]}>
                                        <DollarSign size={16} color="#0284c7" />
                                        <Text style={[styles.statText, { color: '#0284c7' }]}>{formatPrice(selectedSpot.price)}</Text>
                                    </View>
                                </View>

                                <Text style={styles.modalDesc}>{selectedSpot.description}</Text>

                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => setIsAddModalOpen(true)}
                                >
                                    <Text style={styles.actionButtonText}>Add to Trip</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            </Modal>

            <AddActivityModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                spot={selectedSpot}
                onConfirm={(data) => {
                    addActivity(data);
                    setSelectedSpot(null);
                    // Optional: Navigate to Itinerary or show toast
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { padding: 24, paddingBottom: 16 },
    backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    backText: { marginLeft: 8, fontSize: 14, fontWeight: 'bold', color: '#64748b' },
    title: { fontSize: 32, fontWeight: '900', color: '#0f172a', marginBottom: 4 },
    subtitle: { fontSize: 14, color: '#64748b' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 24, borderRadius: 16, paddingHorizontal: 16, height: 50, borderWidth: 1, borderColor: '#e2e8f0' },
    searchIcon: { marginRight: 12 },
    searchInput: { flex: 1, fontSize: 14, fontWeight: '600', color: '#0f172a' },
    filtersContainer: { paddingHorizontal: 24, marginVertical: 16 },
    selectorScroll: { flexDirection: 'row' },
    chip: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#fff', borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#e2e8f0' },
    chipActive: { backgroundColor: '#0f172a', borderColor: '#0f172a' },
    chipText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
    chipTextActive: { color: '#fff' },
    listContent: { paddingHorizontal: 24, paddingBottom: 40 },
    card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 24, padding: 12, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    cardImage: { width: 100, height: 100, borderRadius: 16 },
    cardContent: { flex: 1, marginLeft: 16, justifyContent: 'center' },
    cardTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
    cardLocation: { fontSize: 12, fontWeight: '600', color: '#64748b' },
    cardDesc: { fontSize: 11, color: '#94a3b8', marginBottom: 8 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    ratingText: { fontSize: 12, fontWeight: '800', color: '#0f172a' },
    priceText: { fontSize: 12, fontWeight: '800', color: '#0f172a' },
    emptyState: { alignItems: 'center', marginTop: 40 },
    emptyText: { marginTop: 16, fontSize: 16, fontWeight: '600', color: '#94a3b8' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
    modalContent: { backgroundColor: '#fff', borderRadius: 32, overflow: 'hidden' },
    modalImageContainer: { height: 250, width: '100%' },
    modalImage: { width: '100%', height: '100%' },
    closeButton: { position: 'absolute', top: 16, right: 16, backgroundColor: '#fff', padding: 8, borderRadius: 20 },
    categoryBadge: { position: 'absolute', top: 16, left: 16, backgroundColor: '#0f172a', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    categoryText: { color: '#fff', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
    modalBody: { padding: 24 },
    modalTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a', marginBottom: 8 },
    modalLocation: { fontSize: 14, fontWeight: '600', color: '#64748b' },
    statsContainer: { flexDirection: 'row', gap: 12, marginVertical: 20 },
    statBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fefce8', borderRadius: 12, borderWidth: 1, borderColor: '#fef08a' },
    statText: { fontSize: 14, fontWeight: '800', color: '#0f172a' },
    modalDesc: { fontSize: 14, color: '#475569', lineHeight: 22, marginBottom: 24 },
    actionButton: { backgroundColor: '#0f172a', paddingVertical: 16, borderRadius: 20, alignItems: 'center' },
    actionButtonText: { color: '#fff', fontSize: 16, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },

    // Parity Badges
    halalBadgeMini: { backgroundColor: '#16a34a', width: 14, height: 14, borderRadius: 7, alignItems: 'center', justifyContent: 'center', marginLeft: 4 },
    halalTextMini: { color: '#fff', fontSize: 8, fontWeight: '900' },
    tagRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
    localTag: { backgroundColor: '#eff6ff', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    localTagText: { fontSize: 8, fontWeight: '900', color: '#1d4ed8' },
});

export default FoodScreen;
