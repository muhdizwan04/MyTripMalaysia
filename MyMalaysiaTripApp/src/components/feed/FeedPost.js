import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { MapPin, Star, Heart, Bookmark, MessageCircle, Utensils, Camera } from 'lucide-react-native';
import { colors } from '../../config/colors';

const { width } = Dimensions.get('window');

export default function FeedPost({ post }) {
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);

    return (
        <View style={styles.card}>
            {/* Post Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: post.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
                {/* Category Badge */}
                <View style={[styles.badge, post.type === 'food' ? styles.badgeFood : styles.badgeScenery]}>
                    {post.type === 'food' ?
                        <Utensils size={12} color="#fff" style={styles.badgeIcon} /> :
                        <Camera size={12} color="#fff" style={styles.badgeIcon} />
                    }
                    <Text style={styles.badgeText}>{post.type}</Text>
                </View>
            </View>

            {/* Post Content */}
            <View style={styles.content}>
                {/* User Info */}
                <View style={styles.userInfo}>
                    <Image
                        source={{ uri: post.user.avatar }}
                        style={styles.avatar}
                    />
                    <View style={styles.userMeta}>
                        <Text style={styles.userName}>{post.user.name}</Text>
                        <Text style={styles.timestamp}>{post.timestamp}</Text>
                    </View>
                </View>

                {/* Place Name */}
                <Text style={styles.placeName}>{post.placeName}</Text>

                {/* Location */}
                <View style={styles.locationContainer}>
                    <MapPin size={16} color={colors.primary} />
                    <Text style={styles.locationText}>{post.location}</Text>
                </View>

                {/* Rating */}
                <View style={styles.ratingContainer}>
                    <View style={styles.ratingBadge}>
                        <Star size={16} color="#fbbf24" fill="#fbbf24" />
                        <Text style={styles.ratingValue}>{post.rating}</Text>
                    </View>
                    <Text style={styles.reviewCount}>({post.reviewCount} reviews)</Text>
                </View>

                {/* Description */}
                <Text style={styles.description}>{post.description}</Text>

                {/* Engagement Stats */}
                <View style={styles.engagementContainer}>
                    <TouchableOpacity
                        onPress={() => setLiked(!liked)}
                        style={styles.actionButton}
                    >
                        <Heart
                            size={20}
                            color={liked ? colors.destructive : colors.mutedForeground}
                            fill={liked ? colors.destructive : 'transparent'}
                        />
                        <Text style={[styles.actionText, liked && styles.actionTextActive]}>
                            {liked ? (post.likes || 0) + 1 : (post.likes || 0)}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setSaved(!saved)}
                        style={styles.actionButton}
                    >
                        <Bookmark
                            size={20}
                            color={saved ? colors.primary : colors.mutedForeground}
                            fill={saved ? colors.primary : 'transparent'}
                        />
                        <Text style={[styles.actionText, saved && styles.actionTextActive]}>
                            {saved ? (post.saves || 0) + 1 : (post.saves || 0)}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.actionButton}>
                        <MessageCircle size={20} color={colors.mutedForeground} />
                        <Text style={styles.actionText}>{post.comments || 0}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 32,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'rgba(241, 245, 249, 0.5)', // muted/20
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    badge: {
        position: 'absolute',
        top: 16,
        right: 16,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    badgeFood: {
        backgroundColor: '#f97316', // orange-500
    },
    badgeScenery: {
        backgroundColor: '#10b981', // emerald-500
    },
    badgeIcon: {
        marginRight: 6,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    content: {
        padding: 24,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    userMeta: {
        flex: 1,
    },
    userName: {
        fontSize: 14,
        fontWeight: '900',
        color: colors.foreground,
    },
    timestamp: {
        fontSize: 12,
        color: colors.mutedForeground,
    },
    placeName: {
        fontSize: 20,
        fontWeight: '900',
        color: colors.foreground,
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    locationText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '700',
        color: colors.mutedForeground,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    ratingValue: {
        marginLeft: 4,
        fontSize: 14,
        fontWeight: '900',
        color: colors.foreground,
    },
    reviewCount: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.mutedForeground,
    },
    description: {
        fontSize: 14,
        lineHeight: 22,
        color: colors.foreground,
        marginBottom: 16,
    },
    engagementContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 2,
        borderTopColor: 'rgba(241, 245, 249, 0.5)', // muted/20
        gap: 24,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '700',
        color: colors.mutedForeground,
    },
    actionTextActive: {
        color: colors.destructive,
    },
});
