import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, TextInput, ScrollView, Dimensions } from 'react-native';
import { X, Calendar, Clock, Sparkles, Check, ChevronRight } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function AddActivityModal({ isOpen, onClose, spot, onConfirm, totalDays = 3 }) {
    const [selectedDay, setSelectedDay] = useState(1);
    const [selectedTime, setSelectedTime] = useState('10:00');
    const [duration, setDuration] = useState(2);

    if (!isOpen || !spot) return null;

    const days = Array.from({ length: totalDays }, (_, i) => i + 1);

    const handleConfirm = () => {
        onConfirm({
            ...spot,
            day: selectedDay,
            time: selectedTime,
            duration: duration
        });
        onClose();
    };

    return (
        <Modal
            visible={isOpen}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header Image */}
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: spot.image || spot.image_url }} style={styles.image} />
                        <View style={styles.imageGradient} />
                        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                            <X size={20} color="#0f172a" />
                        </TouchableOpacity>
                        <View style={styles.headerText}>
                            <View style={styles.sparkleBadge}>
                                <Sparkles size={12} color="#fff" />
                                <Text style={styles.sparkleText}>ADD TO TRIP</Text>
                            </View>
                            <Text style={styles.spotName} numberOfLines={2}>{spot.name}</Text>
                        </View>
                    </View>

                    <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                        {/* Day Selection */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Calendar size={16} color="#0f172a" />
                                <Text style={styles.sectionTitle}>WHICH DAY?</Text>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayScroll}>
                                {days.map(day => (
                                    <TouchableOpacity
                                        key={day}
                                        onPress={() => setSelectedDay(day)}
                                        style={[styles.dayChip, selectedDay === day && styles.dayChipActive]}
                                    >
                                        <Text style={[styles.dayText, selectedDay === day && styles.dayTextActive]}>Day {day}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Time Selection */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Clock size={16} color="#0f172a" />
                                <Text style={styles.sectionTitle}>WHAT TIME?</Text>
                            </View>
                            <View style={styles.timeInputRow}>
                                <TextInput
                                    style={styles.timeInput}
                                    value={selectedTime}
                                    onChangeText={setSelectedTime}
                                    placeholder="09:00"
                                    placeholderTextColor="#94a3b8"
                                />
                                <View style={styles.durationControl}>
                                    <TouchableOpacity
                                        style={styles.durationBtn}
                                        onPress={() => setDuration(Math.max(0.5, duration - 0.5))}
                                    >
                                        <Text style={styles.durationOp}>-</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.durationText}>{duration}h</Text>
                                    <TouchableOpacity
                                        style={styles.durationBtn}
                                        onPress={() => setDuration(Math.min(8, duration + 0.5))}
                                    >
                                        <Text style={styles.durationOp}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Note / Warning */}
                        <View style={styles.warningBox}>
                            <View style={styles.warningIcon}>
                                <Info size={14} color="#f97316" />
                            </View>
                            <Text style={styles.warningText}>
                                Adding this will adjust subsequent activities on Day {selectedDay}.
                            </Text>
                        </View>
                    </ScrollView>

                    {/* Footer Actions */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                            <Text style={styles.cancelText}>CANCEL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                            <Text style={styles.confirmText}>ADD TO ITINERARY</Text>
                            <Check size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        height: height * 0.75,
        overflow: 'hidden',
    },
    imageContainer: {
        height: 200,
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageGradient: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    closeBtn: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    headerText: {
        position: 'absolute',
        bottom: 24,
        left: 24,
        right: 24,
    },
    sparkleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3b82f6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 8,
        gap: 4,
    },
    sparkleText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    spotName: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '900',
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    body: {
        flex: 1,
        padding: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '900',
        color: '#0f172a',
        letterSpacing: 1,
    },
    dayScroll: {
        paddingRight: 24,
    },
    dayChip: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 16,
        backgroundColor: '#f1f5f9',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    dayChipActive: {
        backgroundColor: '#0f172a',
        borderColor: '#0f172a',
    },
    dayText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748b',
    },
    dayTextActive: {
        color: '#fff',
    },
    timeInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    timeInput: {
        flex: 1,
        height: 56,
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        fontWeight: '800',
        color: '#0f172a',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    durationControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        padding: 4,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    durationBtn: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    durationOp: {
        fontSize: 20,
        fontWeight: '900',
        color: '#3b82f6',
    },
    durationText: {
        paddingHorizontal: 16,
        fontSize: 14,
        fontWeight: '900',
        color: '#0f172a',
    },
    warningBox: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff7ed',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ffedd5',
        gap: 12,
        marginBottom: 24,
    },
    warningIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#ffedd5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    warningText: {
        flex: 1,
        fontSize: 12,
        fontWeight: '600',
        color: '#9a3412',
        lineHeight: 18,
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
        flexDirection: 'row',
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    cancelBtn: {
        flex: 1,
        height: 60,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f5f9',
    },
    cancelText: {
        fontSize: 12,
        fontWeight: '900',
        color: '#64748b',
        letterSpacing: 1,
    },
    confirmBtn: {
        flex: 2,
        height: 60,
        borderRadius: 20,
        backgroundColor: '#3b82f6',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#3b82f6',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    confirmText: {
        fontSize: 14,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 1,
    }
});
