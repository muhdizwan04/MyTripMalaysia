import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, MapPin, Star, Clock } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchMalls } from '../lib/api';

const ShoppingScreen = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedState, setSelectedState] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [malls, setMalls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMalls = async () => {
            try {
                setLoading(true);
                const data = await fetchMalls({ limit: 12 });
                setMalls(data || []);
            } catch (error) {
                console.error('Failed to load malls:', error);
            } finally {
                setLoading(false);
            }
        };
        loadMalls();
    }, []);

    const filteredPlaces = malls.filter(place => {
        const locationText = (place.state || place.location || '').toLowerCase();
        const typeText = (place.type || '').toLowerCase();

        if (selectedState !== 'all' && locationText.indexOf(selectedState.toLowerCase()) === -1) return false;
        if (selectedCategory !== 'all' && typeText !== selectedCategory.toLowerCase()) return false;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const name = (place.name || '').toLowerCase();
            const location = (place.location || '').toLowerCase();
            return name.includes(query) || location.includes(query);
        }
        return true;
    });

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

    const states = ['Kuala Lumpur', 'Selangor', 'Penang', 'Johor', 'Melaka'];
    const categories = ['Luxury', 'Electronics', 'Family', 'Heritage', 'Lifestyle', 'Hypermarket'];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#64748b" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Shopping 🛍️</Text>
                <Text style={styles.subtitle}>Find the best malls and shopping streets</Text>
            </View>

            <View style={styles.searchContainer}>
                <Search size={20} color="#94a3b8" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search shopping places..."
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
                    <Text style={styles.loadingText}>Loading malls...</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredPlaces}
                    keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate('MallDetails', { mallId: item.id, mall: item })}
                        >
                            <Image source={{ uri: item.image_url || item.image }} style={styles.cardImage} />
                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>{item.name}</Text>
                                <View style={styles.row}>
                                    <MapPin size={12} color="#0f172a" />
                                    <Text style={styles.cardLocation}>
                                        {item.location || item.location_name}
                                        {item.state ? `, ${item.state}` : ''}
                                    </Text>
                                </View>
                                <View style={styles.row}>
                                    <Clock size={12} color="#94a3b8" />
                                    <Text style={styles.cardDesc}>{item.hours || '10 AM - 10 PM'}</Text>
                                </View>
                                <View style={styles.cardFooter}>
                                    <View style={styles.ratingBadge}>
                                        <Star size={12} color="#eab308" fill="#eab308" />
                                        <Text style={styles.ratingText}>{item.rating || 4.5}</Text>
                                    </View>
                                    <View style={styles.typeBadge}>
                                        <Text style={styles.typeText}>{item.type || item.category || 'Mall'}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Search size={48} color="#cbd5e1" />
                            <Text style={styles.emptyText}>No shopping places found</Text>
                        </View>
                    }
                />
            )}
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
    cardDesc: { fontSize: 11, color: '#94a3b8' },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
    ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    ratingText: { fontSize: 12, fontWeight: '800', color: '#0f172a' },
    typeBadge: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#f0f9ff', borderRadius: 8 },
    typeText: { fontSize: 10, fontWeight: '800', color: '#0284c7' },
    emptyState: { alignItems: 'center', marginTop: 40 },
    emptyText: { marginTop: 16, fontSize: 16, fontWeight: '600', color: '#94a3b8' },
    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 40 },
    loadingText: { marginTop: 12, color: '#64748b', fontWeight: 'bold' },
});

export default ShoppingScreen;
