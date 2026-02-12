import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, LogOut, Heart, Bell, Moon, ChevronRight, Shield } from 'lucide-react-native';
import { auth } from '../config/firebase';
import BatikOverlay from '../components/ui/BatikOverlay';

export default function ProfileScreen() {
    const user = auth.currentUser || {
        displayName: 'Guest User',
        email: 'guest@example.com',
        photoURL: 'https://i.pravatar.cc/150?img=3'
    };

    const menuItems = [
        { icon: Heart, label: 'Favorites', badge: '12' },
        { icon: Bell, label: 'Notifications', badge: '3' },
        { icon: Shield, label: 'Privacy & Security', badge: null },
        { icon: Moon, label: 'Dark Mode', toggle: true },
        { icon: Settings, label: 'Settings', badge: null },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <BatikOverlay type="full" opacity={0.03} />
            <ScrollView contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                </View>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <Image source={{ uri: user.photoURL || 'https://via.placeholder.com/150' }} style={styles.avatar} />
                    <View style={styles.profileInfo}>
                        <Text style={styles.name}>{user.displayName || 'Traveler'}</Text>
                        <Text style={styles.email}>{user.email}</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Premium Member</Text>
                        </View>
                    </View>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>12</Text>
                        <Text style={styles.statLabel}>Trips</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>45</Text>
                        <Text style={styles.statLabel}>Places</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>8</Text>
                        <Text style={styles.statLabel}>Reviews</Text>
                    </View>
                </View>

                {/* Menu */}
                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem}>
                            <View style={styles.menuLeft}>
                                <View style={styles.iconBox}>
                                    <item.icon size={20} color="#0f172a" />
                                </View>
                                <Text style={styles.menuLabel}>{item.label}</Text>
                            </View>
                            <View style={styles.menuRight}>
                                {item.badge && (
                                    <View style={styles.menuBadge}>
                                        <Text style={styles.menuBadgeText}>{item.badge}</Text>
                                    </View>
                                )}
                                {item.toggle ? (
                                    <Switch value={false} trackColor={{ false: "#e2e8f0", true: "#0f172a" }} />
                                ) : (
                                    <ChevronRight size={16} color="#94a3b8" />
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutButton} onPress={() => {
                    auth.signOut().then(() => {
                        // For now, just stay here or nav to generic login if we had one.
                        // Since we don't have a specific auth stack flow defined in detail, 
                        // we'll mainly rely on the auth listener in a real app.
                        // For parity demo:
                        alert('Logged out successfully');
                    }).catch(e => console.error(e));
                }}>
                    <LogOut size={20} color="#ef4444" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Version 1.0.0 (Build 124) • MyMalaysiaTrip</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    content: { padding: 24, paddingBottom: 40 },
    header: { marginBottom: 24 },
    headerTitle: { fontSize: 28, fontWeight: '900', color: '#0f172a' },

    profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 24, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
    avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: '#f1f5f9' },
    profileInfo: { marginLeft: 16, flex: 1 },
    name: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
    email: { fontSize: 14, color: '#64748b', marginBottom: 8 },
    badge: { backgroundColor: '#fef9c3', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
    badgeText: { fontSize: 10, fontWeight: '800', color: '#854d0e', textTransform: 'uppercase' },

    statsRow: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 24, justifyContent: 'space-between' },
    statItem: { alignItems: 'center', flex: 1 },
    statValue: { fontSize: 20, fontWeight: '900', color: '#0f172a' },
    statLabel: { fontSize: 12, fontWeight: '600', color: '#64748b' },
    statDivider: { width: 1, backgroundColor: '#f1f5f9' },

    menuContainer: { backgroundColor: '#fff', borderRadius: 24, padding: 8, marginBottom: 24 },
    menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
    menuLabel: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
    menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    menuBadge: { backgroundColor: '#ef4444', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
    menuBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },

    logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, backgroundColor: '#fee2e2', borderRadius: 20, marginBottom: 24 },
    logoutText: { fontSize: 16, fontWeight: '700', color: '#ef4444' },

    versionText: { textAlign: 'center', color: '#94a3b8', fontSize: 12, fontWeight: '500' }
});
