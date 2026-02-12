import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, MapPin, Star, DollarSign, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import AddActivityModal from '../components/AddActivityModal';
import { useTrip } from '../context/TripContext';
import { fetchMustVisitAttractions } from '../lib/api';

const MustVisitScreen = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedState, setSelectedState] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { addActivity } = useTrip();

    useEffect(() => {
        const loadPlaces = async () => {
            try {
                setLoading(true);
                const data = await fetchMustVisitAttractions();
                setPlaces(data || []);
            } catch (error) {
                console.error('Failed to load places:', error);
            } finally {
                setLoading(false);
            }
        };
        loadPlaces();
    }, []);

    const filteredPlaces = places.filter(place => {
        const placeLocation = (place.state || place.location || place.location_name || '').toLowerCase();
        const placeCategory = (place.category || place.type || '').toLowerCase();

        const stateMatch = selectedState === 'all' || placeLocation === selectedState.toLowerCase() ||
            (selectedState === 'Kuala Lumpur' && placeLocation === 'kl');

        const categoryMatch = selectedCategory === 'all' || placeCategory === selectedCategory.toLowerCase();

        if (!stateMatch || !categoryMatch) return false;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            return (place.name || '').toLowerCase().includes(query) ||
                placeLocation.includes(query) ||
                (place.description || '').toLowerCase().includes(query);
        }
        return true;
    });

    const formatPrice = (price) => price > 0 ? `RM ${price}` : 'Free';

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

    const states = ['Kuala Lumpur', 'Selangor', 'Penang', 'Johor', 'Pahang', 'Kedah', 'Melaka'];
    const categories = ['Landmark', 'Nature', 'Culture', 'Activity', 'Theme Park', 'Museum'];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#64748b" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Must Visit 🕌</Text>
                <Text style={styles.subtitle}>Explore top attractions across Malaysia</Text>
            </View>

            <View style={styles.searchContainer}>
                <Search size={20} color="#94a3b8" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search attractions..."
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

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0f172a" />
                    <Text style={styles.loadingText}>Loading attractions...</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredPlaces}
                    keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.card} onPress={() => setSelectedPlace(item)}>
                            <Image source={{ uri: item.image_url || item.image }} style={styles.cardImage} />
                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>{item.name}</Text>
                                <View style={styles.row}>
                                    <MapPin size={12} color="#0f172a" />
                                    <Text style={styles.cardLocation}>{item.location || item.location_name}, {item.state}</Text>
                                </View>
                                <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                                <View style={styles.cardFooter}>
                                    <View style={styles.ratingBadge}>
                                        <Star size={12} color="#eab308" fill="#eab308" />
                                        <Text style={styles.ratingText}>{item.rating}</Text>
                                    </View>
                                    <Text style={[styles.priceText, item.price === 0 && { color: '#16a34a' }]}>{formatPrice(item.price)}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Search size={48} color="#cbd5e1" />
                            <Text style={styles.emptyText}>No attractions found</Text>
                        </View>
                    }
                />
            )}

            {/* Detail Modal */}
            <Modal visible={!!selectedPlace} animationType="slide" transparent>
                {selectedPlace && (
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalImageContainer}>
                                <Image source={{ uri: selectedPlace.image_url || selectedPlace.image }} style={styles.modalImage} />
                                <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedPlace(null)}>
                                    <X size={20} color="#0f172a" />
                                </TouchableOpacity>
                                <View style={styles.categoryBadge}>
                                    <Text style={styles.categoryText}>{selectedPlace.category || selectedPlace.type}</Text>
                                </View>
                            </View>

                            <View style={styles.modalBody}>
                                <Text style={styles.modalTitle}>{selectedPlace.name}</Text>
                                <View style={styles.row}>
                                    <MapPin size={16} color="#0f172a" />
                                    <Text style={styles.modalLocation}>{selectedPlace.location || selectedPlace.location_name}, {selectedPlace.state}</Text>
                                </View>

                                <View style={styles.statsContainer}>
                                    <View style={styles.statBadge}>
                                        <Star size={16} color="#eab308" fill="#eab308" />
                                        <Text style={styles.statText}>{selectedPlace.rating}</Text>
                                    </View>
                                    <View style={[styles.statBadge, { backgroundColor: selectedPlace.price > 0 ? '#f0f9ff' : '#f0fdf4', borderColor: selectedPlace.price > 0 ? '#e0f2fe' : '#dcfce7' }]}>
                                        <DollarSign size={16} color={selectedPlace.price > 0 ? "#0284c7" : "#16a34a"} />
                                        <Text style={[styles.statText, { color: selectedPlace.price > 0 ? '#0284c7' : '#16a34a' }]}>{formatPrice(selectedPlace.price)}</Text>
                                    </View>
                                </View>

                                <Text style={styles.modalDesc}>{selectedPlace.description}</Text>

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
                spot={selectedPlace}
                onConfirm={(data) => {
                    addActivity(data);
                    setSelectedPlace(null);
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
    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 40 },
    loadingText: { marginTop: 12, color: '#64748b', fontWeight: 'bold' },
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
});

export default MustVisitScreen;
