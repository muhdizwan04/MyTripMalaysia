import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Search, Heart, MessageCircle, Share2, MapPin, Plus } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Mock Data matching Web "FEED_POSTS" structure
const FEED_POSTS = [
    {
        id: 1,
        username: 'Sarah J.',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        image: 'https://images.unsplash.com/photo-1596422846543-75c6fc18593',
        description: 'Found this hidden gem in Langkawi! The sunset was unreal.',
        likes: 124,
        comments: 18,
        location: 'Tanjung Rhu, Langkawi',
        type: 'scenery',
        time: '2h ago'
    },
    {
        id: 2,
        username: 'Amirul Eats',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
        image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be',
        description: 'Best Nasi Lemak in KL? I think I found it at Village Park.',
        likes: 892,
        comments: 142,
        location: 'Damansara Uptown, KL',
        type: 'food',
        time: '5h ago'
    },
    {
        id: 3,
        username: 'TravelWithMe',
        userAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12',
        image: 'https://images.unsplash.com/photo-1590483861822-75d31cb0311f',
        description: 'Walking through the historic streets of Malacca. So much history here!',
        likes: 450,
        comments: 32,
        location: 'Jonker Street, Malacca',
        type: 'scenery',
        time: '1d ago'
    }
];

export default function CommunityScreen() {
    const navigation = useNavigation();
    const [filter, setFilter] = useState('all'); // all, food, scenery
    const [searchQuery, setSearchQuery] = useState('');
    const [posts, setPosts] = useState(FEED_POSTS);

    // Filtering Logic
    const filteredPosts = posts.filter(post => {
        const matchesType = filter === 'all' || post.type === filter;
        const matchesSearch = post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    const renderPost = ({ item }) => (
        <View style={styles.postCard}>
            {/* Header */}
            <View style={styles.postHeader}>
                <Image source={{ uri: item.userAvatar }} style={styles.avatar} />
                <View style={styles.userInfo}>
                    <Text style={styles.username}>{item.username}</Text>
                    <Text style={styles.timeAgo}>{item.time} • {item.location}</Text>
                </View>
                <TouchableOpacity>
                    <MapPin size={16} color="#64748b" />
                </TouchableOpacity>
            </View>

            {/* Image */}
            <Image source={{ uri: item.image }} style={styles.postImage} />

            {/* Actions */}
            <View style={styles.actionRow}>
                <View style={styles.actionLeft}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Heart size={24} color="#ef4444" fill="#ef4444" />
                        <Text style={styles.actionText}>{item.likes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <MessageCircle size={24} color="#0f172a" />
                        <Text style={styles.actionText}>{item.comments}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Share2 size={24} color="#0f172a" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Caption */}
            <View style={styles.captionContainer}>
                <Text style={styles.captionText}>
                    <Text style={styles.captionUsername}>{item.username} </Text>
                    {item.description}
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Community</Text>
                    <Text style={styles.headerSubtitle}>Discover stories from travelers</Text>
                </View>
                <View style={styles.headerRight}>
                    {/* Placeholder for Profile or Notif */}
                </View>
            </View>

            {/* Search & Filter */}
            <View style={styles.filterSection}>
                <View style={styles.searchBar}>
                    <Search size={18} color="#94a3b8" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View style={styles.chipsRow}>
                    {['all', 'food', 'scenery'].map(f => (
                        <TouchableOpacity
                            key={f}
                            style={[styles.filterChip, filter === f && styles.filterChipActive]}
                            onPress={() => setFilter(f)}
                        >
                            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <FlatList
                data={filteredPosts}
                renderItem={renderPost}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No posts found matching your criteria.</Text>
                    </View>
                }
            />

            {/* FAB */}
            <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
                <Plus size={32} color="#fff" />
            </TouchableOpacity>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },

    header: { paddingHorizontal: 24, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { fontSize: 28, fontWeight: '900', color: '#0f172a', letterSpacing: -1 },
    headerSubtitle: { fontSize: 14, color: '#64748b', fontWeight: '500' },

    filterSection: { paddingHorizontal: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', paddingHorizontal: 16, height: 48, borderRadius: 16, marginBottom: 16 },
    searchInput: { flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '600', color: '#0f172a' },

    chipsRow: { flexDirection: 'row', gap: 12 },
    filterChip: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 24, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#f1f5f9' },
    filterChipActive: { backgroundColor: '#0f172a', borderColor: '#0f172a' },
    filterText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
    filterTextActive: { color: '#fff' },

    listContent: { padding: 24, paddingBottom: 100 },

    postCard: { marginBottom: 32 },
    postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e2e8f0' },
    userInfo: { flex: 1, marginLeft: 12 },
    username: { fontSize: 14, fontWeight: '800', color: '#0f172a' },
    timeAgo: { fontSize: 12, color: '#64748b', fontWeight: '500' },

    postImage: { width: '100%', aspectRatio: 1, borderRadius: 24, backgroundColor: '#f1f5f9', marginBottom: 16 },

    actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    actionLeft: { flexDirection: 'row', gap: 20 },
    actionButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    actionText: { fontSize: 14, fontWeight: '700', color: '#0f172a' },

    captionContainer: { paddingHorizontal: 4 },
    captionText: { fontSize: 14, color: '#334155', lineHeight: 22 },
    captionUsername: { fontWeight: '800', color: '#0f172a' },

    emptyState: { padding: 40, alignItems: 'center' },
    emptyText: { color: '#94a3b8', fontSize: 14, fontWeight: '500' },

    fab: { position: 'absolute', bottom: 32, right: 24, width: 64, height: 64, borderRadius: 32, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center', shadowColor: '#0f172a', shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 8 }
});
