import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, MapPin, Clock, Tag, Star, X, Layers, Phone } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AddActivityModal from '../components/AddActivityModal';
import { useTrip } from '../context/TripContext';
import { fetchShops, fetchAttractionById } from '../lib/api';

const MallDetailsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { mallId, mall: initialMall } = route.params || {};

    const [mallInfo, setMallInfo] = useState(initialMall || null);
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedFloor, setSelectedFloor] = useState('all');
    const [selectedShop, setSelectedShop] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { addActivity } = useTrip();

    useEffect(() => {
        const loadPageData = async () => {
            try {
                setLoading(true);
                // Fetch Mall Details if not in state
                const mallPromise = !mallInfo && mallId ? fetchAttractionById(mallId) : Promise.resolve(mallInfo);
                // Fetch Shops
                const shopsPromise = mallId ? fetchShops(mallId) : Promise.resolve([]);

                const [mallData, shopsData] = await Promise.all([mallPromise, shopsPromise]);

                if (mallData) setMallInfo(mallData);
                if (shopsData) setShops(shopsData);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadPageData();
    }, [mallId]);

    // Group shops by category
    const groupedShops = shops.reduce((acc, shop) => {
        const category = shop.category || 'Other';
        const floor = shop.floor || 'Other';

        if (!acc[category]) acc[category] = [];

        // Apply filters
        const matchesSearch = !searchQuery.trim() ||
            shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
        const matchesFloor = selectedFloor === 'all' || floor === selectedFloor;

        if (matchesSearch && matchesCategory && matchesFloor) {
            acc[category].push(shop);
        }
        return acc;
    }, {});

    const sortedCategories = Object.keys(groupedShops).sort();
    const categoriesList = ['all', ...new Set(shops.map(shop => shop.category || 'Other'))];
    const floorsList = ['all', ...new Set(shops.map(shop => shop.floor || 'Other'))];

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

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#64748b" />
                        <Text style={styles.backText}>Back to Shopping</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>{mallInfo?.name || "Shopping Mall"}</Text>
                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <MapPin size={14} color="#64748b" />
                            <Text style={styles.metaText}>{mallInfo?.location || mallInfo?.state || "Unknown Location"}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Clock size={14} color="#64748b" />
                            <Text style={styles.metaText}>{mallInfo?.hours || "10 AM - 10 PM"}</Text>
                        </View>
                    </View>
                </View>

                {/* Filters */}
                <View style={styles.filtersSection}>
                    <View style={styles.searchContainer}>
                        <Search size={20} color="#94a3b8" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search shops..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor="#94a3b8"
                        />
                    </View>
                    <View style={{ marginBottom: 16 }}>
                        <Selector value={selectedCategory} options={categoriesList.filter(c => c !== 'all')} onSelect={setSelectedCategory} label="Categories" />
                    </View>
                    <View style={{ marginBottom: 8 }}>
                        <Selector value={selectedFloor} options={floorsList.filter(f => f !== 'all')} onSelect={setSelectedFloor} label="Floors" />
                    </View>
                </View>

                {/* Loading / Results */}
                {loading ? (
                    <View style={styles.centerBox}>
                        <ActivityIndicator size="large" color="#0f172a" />
                        <Text style={styles.loadingText}>Loading shops...</Text>
                    </View>
                ) : (
                    <View style={styles.results}>
                        {sortedCategories.length > 0 ? (
                            sortedCategories.map(category => (
                                groupedShops[category].length > 0 && (
                                    <View key={category} style={styles.categorySection}>
                                        <View style={styles.categoryHeader}>
                                            <Tag size={16} color="#0f172a" />
                                            <Text style={styles.categoryTitle}>{category}</Text>
                                        </View>

                                        {groupedShops[category].map(shop => (
                                            <TouchableOpacity
                                                key={shop.id}
                                                style={styles.card}
                                                onPress={() => setSelectedShop(shop)}
                                            >
                                                <Image
                                                    source={{ uri: shop.image_url || shop.image || "https://images.unsplash.com/photo-1519500099198-c185fba3b7e5?auto=format&fit=crop&w=500&q=80" }}
                                                    style={styles.cardImage}
                                                />
                                                <View style={styles.cardContent}>
                                                    <Text style={styles.cardTitle}>{shop.name}</Text>
                                                    <View style={styles.row}>
                                                        <Layers size={12} color="#0f172a" />
                                                        <Text style={styles.cardMeta}>Level: {shop.floor || 'N/A'}</Text>
                                                    </View>
                                                    <View style={styles.tagBadge}>
                                                        <Text style={styles.tagText}>{shop.category}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )
                            ))
                        ) : (
                            <View style={styles.centerBox}>
                                <Search size={40} color="#cbd5e1" />
                                <Text style={styles.emptyText}>No shops found</Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>

            {/* Shop Modal */}
            <Modal visible={!!selectedShop} animationType="fade" transparent>
                {selectedShop && (
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalImageContainer}>
                                <Image
                                    source={{ uri: selectedShop.image_url || selectedShop.image || "https://images.unsplash.com/photo-1519500099198-c185fba3b7e5?auto=format&fit=crop&w=500&q=80" }}
                                    style={styles.modalImage}
                                />
                                <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedShop(null)}>
                                    <X size={20} color="#0f172a" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.modalBody}>
                                <View style={styles.modalHeaderRow}>
                                    <View style={styles.modalTag}>
                                        <Text style={styles.modalTagText}>{selectedShop.category}</Text>
                                    </View>
                                    <View style={styles.modalRating}>
                                        <Star size={12} color="#eab308" fill="#eab308" />
                                        <Text style={styles.modalRatingText}>{selectedShop.rating || '4.5'}</Text>
                                    </View>
                                </View>

                                <Text style={styles.modalTitle}>{selectedShop.name}</Text>
                                <View style={styles.row}>
                                    <Layers size={14} color="#0f172a" />
                                    <Text style={styles.modalMeta}>Level: {selectedShop.floor || 'N/A'}</Text>
                                </View>

                                <Text style={styles.modalDesc}>
                                    {selectedShop.description || `Visit ${selectedShop.name} for the best ${selectedShop.category.toLowerCase()} experience.`}
                                </Text>

                                <View style={styles.infoGrid}>
                                    <View style={styles.infoBox}>
                                        <Text style={styles.infoLabel}>Opening Hours</Text>
                                        <Text style={styles.infoValue}>10:00 AM - 10:00 PM</Text>
                                    </View>
                                    <View style={styles.infoBox}>
                                        <Text style={styles.infoLabel}>Directory</Text>
                                        <Text style={[styles.infoValue, { color: '#3b82f6' }]}>VIEW FLOOR MAP</Text>
                                    </View>
                                </View>

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
                spot={selectedShop}
                onConfirm={(data) => {
                    addActivity(data);
                    setSelectedShop(null);
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    content: { paddingBottom: 40 },
    header: { padding: 24, paddingBottom: 16 },
    backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    backText: { marginLeft: 8, fontSize: 14, fontWeight: 'bold', color: '#64748b' },
    title: { fontSize: 32, fontWeight: '900', color: '#0f172a', marginBottom: 8 },
    metaRow: { flexDirection: 'column', gap: 4 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    metaText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
    filtersSection: { paddingHorizontal: 24 },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 16, height: 50, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16 },
    searchIcon: { marginRight: 12 },
    searchInput: { flex: 1, fontSize: 14, fontWeight: '600', color: '#0f172a' },
    selectorScroll: { flexDirection: 'row' },
    chip: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#fff', borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#e2e8f0' },
    chipActive: { backgroundColor: '#0f172a', borderColor: '#0f172a' },
    chipText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
    chipTextActive: { color: '#fff' },
    centerBox: { alignItems: 'center', marginTop: 40 },
    loadingText: { marginTop: 12, color: '#64748b', fontWeight: 'bold' },
    emptyText: { marginTop: 16, fontSize: 16, fontWeight: '600', color: '#94a3b8' },
    results: { paddingHorizontal: 24, marginTop: 16 },
    categorySection: { marginBottom: 24 },
    categoryHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, paddingHorizontal: 4 },
    categoryTitle: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
    card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 24, padding: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    cardImage: { width: 90, height: 90, borderRadius: 16 },
    cardContent: { flex: 1, marginLeft: 16, justifyContent: 'center' },
    cardTitle: { fontSize: 15, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
    cardMeta: { fontSize: 11, fontWeight: '600', color: '#64748b' },
    tagBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#eff6ff', borderRadius: 8 },
    tagText: { fontSize: 10, fontWeight: '800', color: '#3b82f6' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 24 },
    modalContent: { backgroundColor: '#fff', borderRadius: 32, overflow: 'hidden' },
    modalImageContainer: { height: 220, width: '100%' },
    modalImage: { width: '100%', height: '100%' },
    closeButton: { position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 20 },
    modalBody: { padding: 24 },
    modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    modalTag: { backgroundColor: '#eff6ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    modalTagText: { color: '#3b82f6', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
    modalRating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    modalRatingText: { fontSize: 12, fontWeight: '900', color: '#0f172a' },
    modalTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a', marginBottom: 4 },
    modalMeta: { fontSize: 13, fontWeight: '700', color: '#64748b' },
    modalDesc: { fontSize: 14, color: '#475569', lineHeight: 22, marginVertical: 20 },
    infoGrid: { flexDirection: 'row', gap: 12 },
    infoBox: { flex: 1, backgroundColor: '#f8fafc', padding: 12, borderRadius: 16 },
    infoLabel: { fontSize: 10, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 },
    infoValue: { fontSize: 12, fontWeight: '800', color: '#0f172a' },
    actionButton: { backgroundColor: '#0f172a', paddingVertical: 16, borderRadius: 20, alignItems: 'center', marginTop: 24 },
    actionButtonText: { color: '#fff', fontSize: 16, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
});

export default MallDetailsScreen;
