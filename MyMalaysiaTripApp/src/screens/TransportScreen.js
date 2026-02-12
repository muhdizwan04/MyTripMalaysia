import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Train, Clock, CreditCard, ChevronRight, AlertCircle, Info, Calendar, MapPin, X, ArrowRight } from 'lucide-react-native';
import { getTransportLines, calculateTransport } from '../lib/api';
import BatikOverlay from '../components/ui/BatikOverlay';

const TransportScreen = () => {
    const [lines, setLines] = useState([]);
    const [selectedLine, setSelectedLine] = useState(null);
    const [startStation, setStartStation] = useState(null);
    const [endStation, setEndStation] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState('calculator'); // 'calculator' or 'timetable'

    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState(null); // 'start' or 'end'

    useEffect(() => {
        loadLines();
    }, []);

    const loadLines = async () => {
        try {
            setLoading(true);
            const data = await getTransportLines();
            setLines(data || []);
            if (data && data.length > 0) setSelectedLine(data[0]);
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to load transport data.');
        } finally {
            setLoading(false);
        }
    };

    const handleCalculate = async () => {
        if (!selectedLine || !startStation || !endStation) return;
        setLoading(true);
        try {
            const data = await calculateTransport({
                line: selectedLine.line_name,
                start: startStation.name,
                end: endStation.name
            });
            setResult(data);
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Calculation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (type) => {
        setModalType(type);
        setModalVisible(true);
    };

    const handleStationSelect = (station) => {
        if (modalType === 'start') setStartStation(station);
        else setEndStation(station);
        setModalVisible(false);
        setResult(null); // Reset result on change
    };

    return (
        <SafeAreaView style={styles.container}>
            <BatikOverlay type="full" opacity={0.03} />
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Transport Guide</Text>
                    <Text style={styles.subtitle}>Plan your Klang Valley rail journey</Text>
                </View>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tabButton, view === 'calculator' && styles.tabButtonActive]}
                        onPress={() => setView('calculator')}
                    >
                        <CreditCard size={16} color={view === 'calculator' ? '#0f172a' : '#fff'} />
                        <Text style={[styles.tabText, view === 'calculator' && styles.tabTextActive]}>Calculator</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton, view === 'timetable' && styles.tabButtonActive]}
                        onPress={() => setView('timetable')}
                    >
                        <Clock size={16} color={view === 'timetable' ? '#0f172a' : '#fff'} />
                        <Text style={[styles.tabText, view === 'timetable' && styles.tabTextActive]}>Timetable</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {view === 'calculator' ? (
                    <View style={styles.section}>
                        {/* Rail Line Selector */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>RAIL LINE</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.lineScroll}>
                                {lines.map((line) => (
                                    <TouchableOpacity
                                        key={line.id}
                                        onPress={() => {
                                            setSelectedLine(line);
                                            setStartStation(null);
                                            setEndStation(null);
                                            setResult(null);
                                        }}
                                        style={[
                                            styles.lineButton,
                                            selectedLine?.id === line.id && styles.lineButtonSelected,
                                            selectedLine?.id === line.id && { backgroundColor: '#f0f9ff', borderColor: '#0ea5e9' }
                                        ]}
                                    >
                                        <View style={[styles.lineDot, { backgroundColor: line.color_code || '#ccc' }]} />
                                        <Text style={[
                                            styles.lineButtonText,
                                            selectedLine?.id === line.id && { color: '#0ea5e9' }
                                        ]}>
                                            {line.type} {line.line_name.replace('Line', '').trim()}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Station Selectors */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>FROM STATION</Text>
                            <TouchableOpacity style={styles.selectButton} onPress={() => openModal('start')}>
                                <Text style={[styles.selectText, !startStation && styles.placeholder]}>
                                    {startStation ? startStation.name : 'Select Departure'}
                                </Text>
                                <ChevronRight size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>TO STATION</Text>
                            <TouchableOpacity style={styles.selectButton} onPress={() => openModal('end')}>
                                <Text style={[styles.selectText, !endStation && styles.placeholder]}>
                                    {endStation ? endStation.name : 'Select Destination'}
                                </Text>
                                <ChevronRight size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.calculateBtn,
                                (loading || !startStation || !endStation) && styles.calculateBtnDisabled
                            ]}
                            onPress={handleCalculate}
                            disabled={loading || !startStation || !endStation}
                        >
                            {loading ? <ActivityIndicator color="#fff" /> : (
                                <Text style={styles.calculateBtnText}>Check Cost & Time</Text>
                            )}
                        </TouchableOpacity>

                        {/* Result Card */}
                        {result && (
                            <View style={styles.resultCard}>
                                <View style={[styles.resultHeader, { backgroundColor: result.color_code || '#0f172a' }]}>
                                    <View>
                                        <Text style={styles.resultLabel}>RECOMMENDED ROUTE</Text>
                                        <Text style={styles.resultTitle}>Estimated Journey</Text>
                                    </View>
                                    <Train size={32} color="rgba(255,255,255,0.3)" />
                                </View>

                                <View style={styles.resultContent}>
                                    <View style={styles.timeline}>
                                        <View style={styles.timelineLine} />
                                        <View style={styles.timelinePoint} />
                                        <View style={styles.timelineBadge}><Text style={styles.timelineBadgeText}>{result.stops} STOPS</Text></View>
                                        <View style={styles.timelinePoint} />
                                    </View>

                                    <View style={styles.stationsRow}>
                                        <Text style={styles.stationName}>{result.start}</Text>
                                        <Text style={[styles.stationName, { textAlign: 'right' }]}>{result.end}</Text>
                                    </View>

                                    <View style={styles.statsGrid}>
                                        <View style={styles.statItem}>
                                            <View style={styles.statHeader}>
                                                <CreditCard size={14} color="#94a3b8" />
                                                <Text style={styles.statLabel}>FARE</Text>
                                            </View>
                                            <Text style={styles.statValue}>RM {result.fare.toFixed(2)}</Text>
                                        </View>
                                        <View style={styles.statItem}>
                                            <View style={styles.statHeader}>
                                                <Clock size={14} color="#94a3b8" />
                                                <Text style={styles.statLabel}>TIME</Text>
                                            </View>
                                            <Text style={styles.statValue}>{result.duration_min} <Text style={{ fontSize: 14 }}>mins</Text></Text>
                                        </View>
                                    </View>

                                    <View style={styles.resultFooter}>
                                        <View>
                                            <Text style={styles.footerLabel}>NEXT DEPARTURE</Text>
                                            <Text style={[styles.footerValue, { color: '#10b981' }]}>{result.departure_time}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.footerLabel}>EST. ARRIVAL</Text>
                                            <Text style={[styles.footerValue, { color: '#3b82f6' }]}>{result.arrival_time}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                ) : (
                    <View style={styles.section}>
                        <View style={styles.infoBox}>
                            <View style={styles.infoHeader}>
                                <View style={styles.iconCircle}>
                                    <Calendar size={20} color="#3b82f6" />
                                </View>
                                <View>
                                    <Text style={styles.infoTitle}>KTM Timetables</Text>
                                    <Text style={styles.infoSubtitle}>Live frequency & estimated times</Text>
                                </View>
                            </View>
                            <Text style={styles.infoText}>
                                KTM Komuter trains arrive approximately every <Text style={{ fontWeight: 'bold' }}>30-45 minutes</Text> during peak hours.
                            </Text>
                        </View>

                        {lines.filter(l => l.type === 'KTM').map(line => (
                            <View key={line.id} style={styles.timetableCard}>
                                <View style={styles.cardHeader}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        <View style={[styles.lineIndicator, { backgroundColor: line.color_code || '#ccc' }]} />
                                        <Text style={styles.cardTitle}>{line.line_name}</Text>
                                    </View>
                                    <View style={styles.liveBadge}>
                                        <Text style={styles.liveText}>LIVE ESTIMATE</Text>
                                    </View>
                                </View>

                                <View style={styles.frequencyRow}>
                                    <Text style={styles.freqLabel}>Frequency (Peak)</Text>
                                    <Text style={styles.freqValue}>{line.frequency.peak}</Text>
                                </View>
                                <View style={styles.frequencyRow}>
                                    <Text style={styles.freqLabel}>Frequency (Off-Peak)</Text>
                                    <Text style={styles.freqValue}>{line.frequency.off_peak}</Text>
                                </View>
                                <View style={styles.frequencyRow}>
                                    <Text style={styles.freqLabel}>Operating Hours</Text>
                                    <Text style={styles.freqValue}>{line.operating_hours.start} - {line.operating_hours.end}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Station Selection Modal */}
            <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            Select {modalType === 'start' ? 'Departure' : 'Destination'}
                        </Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                            <X size={24} color="#0f172a" />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={selectedLine?.stations || []}
                        keyExtractor={item => item.code}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.stationItem}
                                onPress={() => handleStationSelect(item)}
                            >
                                <MapPin size={20} color="#64748b" />
                                <Text style={styles.stationItemText}>{item.name}</Text>
                                {((modalType === 'start' && startStation?.code === item.code) ||
                                    (modalType === 'end' && endStation?.code === item.code)) && (
                                        <ArrowRight size={20} color="#0ea5e9" />
                                    )}
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={{ padding: 24 }}
                    />
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },

    // Header
    header: { backgroundColor: '#0f172a', padding: 24, paddingBottom: 32, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
    title: { fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 4 },
    subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 24 },

    tabContainer: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', padding: 4, borderRadius: 16 },
    tabButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 12 },
    tabButtonActive: { backgroundColor: '#fff' },
    tabText: { fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.7)' },
    tabTextActive: { color: '#0f172a' },

    scrollContent: { padding: 24 },
    section: { gap: 24 },

    // Calculator Utils
    inputGroup: { gap: 8 },
    label: { fontSize: 10, fontWeight: '900', color: '#94a3b8', letterSpacing: 1, paddingLeft: 4 },

    lineScroll: { gap: 8, paddingBottom: 8 },
    lineButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, borderWidth: 2, borderColor: '#e2e8f0', backgroundColor: '#fff' },
    lineButtonSelected: { borderColor: '#0f172a' },
    lineDot: { width: 8, height: 8, borderRadius: 4 },
    lineButtonText: { fontSize: 12, fontWeight: '700', color: '#64748b' },

    selectButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#f8fafc', borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0' },
    selectText: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
    placeholder: { color: '#94a3b8' },

    calculateBtn: { backgroundColor: '#0f172a', padding: 20, borderRadius: 20, alignItems: 'center', shadowColor: '#0f172a', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
    calculateBtnDisabled: { opacity: 0.5 },
    calculateBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' },

    // Results
    resultCard: { backgroundColor: '#fff', borderRadius: 24, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 12, elevation: 2 },
    resultHeader: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    resultLabel: { fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.6)', letterSpacing: 1, marginBottom: 4 },
    resultTitle: { fontSize: 20, fontWeight: '900', color: '#fff' },

    resultContent: { padding: 20 },
    timeline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, position: 'relative' },
    timelineLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#e2e8f0', top: '50%' },
    timelinePoint: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0f172a', zIndex: 1 },
    timelineBadge: { backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 100, borderWidth: 1, borderColor: '#e2e8f0', zIndex: 1 },
    timelineBadgeText: { fontSize: 10, fontWeight: '900', color: '#0f172a' },

    stationsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    stationName: { fontSize: 12, fontWeight: '700', color: '#0f172a', maxWidth: '40%' },

    statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    statItem: { flex: 1, padding: 16, backgroundColor: '#f8fafc', borderRadius: 16 },
    statHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
    statLabel: { fontSize: 10, fontWeight: '900', color: '#94a3b8' },
    statValue: { fontSize: 18, fontWeight: '900', color: '#0f172a' },

    resultFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 16 },
    footerLabel: { fontSize: 10, fontWeight: '900', color: '#94a3b8', marginBottom: 4 },
    footerValue: { fontSize: 14, fontWeight: '900' },

    // Timetable
    infoBox: { backgroundColor: '#fff', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 20 },
    infoHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
    iconCircle: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center' },
    infoTitle: { fontSize: 16, fontWeight: '900', color: '#0f172a' },
    infoSubtitle: { fontSize: 12, color: '#64748b' },
    infoText: { fontSize: 14, color: '#475569', lineHeight: 20 },

    timetableCard: { backgroundColor: '#fff', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    lineIndicator: { width: 4, height: 24, borderRadius: 2 },
    cardTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
    liveBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    liveText: { fontSize: 10, fontWeight: '900', color: '#64748b' },
    frequencyRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f8fafc' },
    freqLabel: { fontSize: 14, fontWeight: '500', color: '#64748b' },
    freqValue: { fontSize: 14, fontWeight: '700', color: '#0f172a' },

    // Modal
    modalContainer: { flex: 1, backgroundColor: '#fff', marginTop: 16 },
    modalHeader: { padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    modalTitle: { fontSize: 20, fontWeight: '900', color: '#0f172a' },
    closeBtn: { padding: 4 },
    stationItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    stationItemText: { fontSize: 16, fontWeight: '600', color: '#0f172a', flex: 1 },
});

export default TransportScreen;
