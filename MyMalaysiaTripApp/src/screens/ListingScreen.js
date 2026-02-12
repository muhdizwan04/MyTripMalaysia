import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Search, MapPin, Star, DollarSign, Clock, Filter, Sparkles } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FOOD_PLACES, SHOPPING_PLACES, MUST_VISIT_PLACES } from '../lib/constants';

const { width } = Dimensions.get('window');

// Generic Listing Screen for Food, Shopping, Hotels, etc.
export default function ListingScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { type, title, subtitle } = route.params || {};

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Select data source based on type
    const getDataSource = () => {
        switch (type) {
            case 'Food': return FOOD_PLACES;
            case 'Shopping': return SHOPPING_PLACES;
            case 'MustVisit': return MUST_VISIT_PLACES;
            default: return [];
        }
    };

    const DATA = getDataSource();

    // Extract categories
    const categories = ['All', ...new Set(DATA.map(item => item.category))];

    const filteredData = DATA.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.location || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const renderItem = (item) => (
        <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => {
                // Future: Navigate to detail? 
                // For now, let's just mimic "Add to Trip" or "Select"
                // Or maybe show a detail modal?
                // Let's simplified navigation: Go to Plan but pre-select this? 
                navigation.navigate('Main', {
                    screen: 'Plan',
                    params: {
                        preSelectedActivityId: item.id,
                        preSelectedState: item.state
                    }
                });
            }}
        >
            <Image source={{ uri: item.image || item.image_url }} style={styles.cardImage} />
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <View style={styles.ratingBadge}>
                        <Star size={10} color="#ca8a04" fill="#ca8a04" />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                </View>

                <View style={styles.locationRow}>
                    <MapPin size={12} color="#64748b" />
                    <Text style={styles.locationText}>{item.location}, {item.state}</Text>
                </View>

                {item.description && (
                    <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
                )}

                <View style={styles.cardFooter}>
                    <View style={styles.tagBadge}>
                        <Text style={styles.tagText}>{item.category}</Text>
                    </View>
                    {item.price > 0 ? (
                        <View style={styles.priceRow}>
                            <DollarSign size={12} color="#0f172a" />
                            <Text style={styles.priceText}>RM {item.price}</Text>
                        </View>
                    ) : (
                        <Text style={[styles.priceText, { color: '#16a34a' }]}>Free</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#0f172a" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>{title || type}</Text>
                    <Text style={styles.headerSubtitle}>{subtitle || 'Explore best spots'}</Text>
                </View>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Search size={20} color="#94a3b8" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={`Search ${title || 'places'}...`}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#94a3b8"
                    />
                </View>
            </View>

            {/* Categories */}
            <View style={styles.categoriesContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
                    {categories.map((cat, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* List */}
            <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                {filteredData.length > 0 ? (
                    filteredData.map(renderItem)
                ) : (
                    <View style={styles.emptyState}>
                        <Search size={48} color="#cbd5e1" />
                        <Text style={styles.emptyText}>No results found.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 10 },
    backButton: { marginRight: 16, padding: 8, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    headerTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a', letterSpacing: -0.5 },
    headerSubtitle: { fontSize: 13, color: '#64748b', fontWeight: '500' },

    searchContainer: { paddingHorizontal: 20, marginBottom: 16 },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, height: 50, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    searchInput: { flex: 1, marginLeft: 12, fontSize: 14, fontWeight: '600', color: '#0f172a' },

    categoriesContainer: { paddingBottom: 16 },
    categoriesList: { paddingHorizontal: 20, gap: 10 },
    categoryChip: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0' },
    categoryChipActive: { backgroundColor: '#0f172a', borderColor: '#0f172a' },
    categoryText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
    categoryTextActive: { color: '#fff' },

    listContent: { padding: 20, paddingTop: 0, gap: 16 },
    card: { backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
    cardImage: { width: '100%', height: 150 },
    cardContent: { padding: 16 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
    cardTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', flex: 1, marginRight: 8 },
    ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef9c3', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, gap: 4 },
    ratingText: { fontSize: 10, fontWeight: '800', color: '#854d0e' },

    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
    locationText: { fontSize: 12, color: '#64748b', fontWeight: '500' },
    description: { fontSize: 12, color: '#94a3b8', lineHeight: 18, marginBottom: 12 },

    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
    tagBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    tagText: { fontSize: 10, fontWeight: '700', color: '#475569', textTransform: 'uppercase' },
    priceRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
    priceText: { fontSize: 12, fontWeight: '800', color: '#0f172a' },

    emptyState: { alignItems: 'center', padding: 40 },
    emptyText: { marginTop: 16, color: '#94a3b8', fontWeight: '600' }
});
