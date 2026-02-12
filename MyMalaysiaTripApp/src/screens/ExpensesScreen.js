import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ArrowLeft, Plus, Receipt, Users, Calculator,
    Calendar, Trash2, DollarSign, Wallet, X, ChevronRight,
    Utensils, Car, Bed, ShoppingBag, Check
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

// Mock Data / Constants
const CURRENT_USER = 'You';

const ExpensesScreen = () => {
    const navigation = useNavigation();

    // View States: 'home', 'workspace', 'details', 'trip_select'
    const [viewState, setViewState] = useState('home');
    const [loading, setLoading] = useState(false);

    // Data
    const [trips, setTrips] = useState([
        { id: 101, destination: 'Penang Food Trip', startDate: '2023-10-15', isAdHoc: false },
        { id: 102, destination: 'KL Staycation', startDate: '2023-11-01', isAdHoc: true }
    ]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [workspaceExpenses, setWorkspaceExpenses] = useState([]);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [isCreatingBill, setIsCreatingBill] = useState(false);
    const [billGroupName, setBillGroupName] = useState('');

    // Participants
    const [participants, setParticipants] = useState([CURRENT_USER, 'Sarah', 'Amir']);

    // Form State
    const [newParticipant, setNewParticipant] = useState('');
    const [amount, setAmount] = useState('');
    const [billName, setBillName] = useState('');
    const [category, setCategory] = useState('Food');
    const [payer, setPayer] = useState(CURRENT_USER);
    const [splitMethod, setSplitMethod] = useState('equal');
    const [manualSplits, setManualSplits] = useState({});

    // --- Logic ---

    const handleCreateNewBill = () => {
        setBillGroupName('');
        setIsCreatingBill(true);
    };

    const confirmCreateBill = () => {
        if (!billGroupName.trim()) {
            Alert.alert('Error', 'Please enter a name for this bill group');
            return;
        }

        const newTrip = {
            id: Date.now(),
            destination: billGroupName,
            startDate: new Date().toISOString(),
            isAdHoc: true
        };

        setTrips([newTrip, ...trips]);
        setSelectedTrip(newTrip);
        setWorkspaceExpenses([]);
        setBillName('');
        setAmount('');
        setCategory('Food');
        setParticipants([CURRENT_USER, 'Friend 1']);
        setPayer(CURRENT_USER);
        setSplitMethod('equal');
        setIsCreatingBill(false);
        setViewState('workspace');
    };

    const handleSelectTrip = () => {
        setViewState('trip_select');
    };

    const handleTripSelected = (trip) => {
        setSelectedTrip(trip);
        // Mock loading expenses for this trip
        setLoading(true);
        setTimeout(() => {
            setWorkspaceExpenses([
                { id: 1, title: 'Lunch', amount: 120, category: 'Food', payer: 'You', participants: [CURRENT_USER, 'Sarah'], splitMethod: 'EQUALLY', date: new Date().toISOString() },
                { id: 2, title: 'Grab to Hotel', amount: 35, category: 'Transport', payer: 'Sarah', participants: [CURRENT_USER, 'Sarah', 'Amir'], splitMethod: 'EQUALLY', date: new Date().toISOString() }
            ]);
            setParticipants([CURRENT_USER, 'Sarah', 'Amir']); // Should come from trip
            setLoading(false);
            setViewState('workspace');
        }, 500);
    };

    const handleAddExpense = () => {
        const numAmount = parseFloat(amount);
        if (!amount || isNaN(numAmount) || numAmount <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }
        if (!billName.trim()) {
            Alert.alert('Error', 'Please name your bill');
            return;
        }

        let finalParticipants = participants.map(p => p); // Simple string array for now to match Web logic simplified

        // Manual Split Validation
        if (splitMethod === 'manual') {
            const manualTotal = participants.reduce((sum, p) => sum + (parseFloat(manualSplits[p]) || 0), 0);
            if (Math.abs(manualTotal - numAmount) > 0.1) {
                Alert.alert('Error', `Manual splits sum (${manualTotal.toFixed(2)}) must match bill amount (${numAmount.toFixed(2)})`);
                return;
            }
        }

        const newExp = {
            id: Date.now(),
            title: billName,
            amount: numAmount,
            category,
            payer,
            participants: splitMethod === 'manual'
                ? participants.map(p => ({ name: p, amount: parseFloat(manualSplits[p] || 0) }))
                : participants, // Just names if equal
            splitMethod: splitMethod === 'equal' ? 'EQUALLY' : 'MANUALLY',
            date: new Date().toISOString(),
            trip_id: selectedTrip?.id
        };

        setWorkspaceExpenses([...workspaceExpenses, newExp]);
        setAmount('');
        setBillName('');
        setManualSplits({});
    };

    const calculateDebts = (items) => {
        const balances = {};
        const allParticipants = [
            ...new Set([
                ...participants,
                ...items.flatMap(i => i.splitMethod === 'MANUALLY' ? i.participants.map(p => p.name) : i.participants)
            ])
        ];
        allParticipants.forEach(p => balances[p] = 0);

        items.forEach(exp => {
            if (exp.splitMethod === 'MANUALLY') {
                exp.participants.forEach(p => {
                    if (balances[p.name] !== undefined) balances[p.name] -= p.amount;
                });
            } else {
                const split = exp.amount / exp.participants.length;
                exp.participants.forEach(p => {
                    if (balances[p] !== undefined) balances[p] -= split;
                });
            }
            if (balances[exp.payer] !== undefined) balances[exp.payer] += exp.amount;
        });

        const debtors = Object.entries(balances).filter(([_, amt]) => amt < -0.01).map(([p, a]) => ({ p, a })).sort((a, b) => a.a - b.a);
        const creditors = Object.entries(balances).filter(([_, amt]) => amt > 0.01).map(([p, a]) => ({ p, a })).sort((a, b) => b.a - a.a);

        const results = [];
        let i = 0, j = 0;
        while (i < debtors.length && j < creditors.length) {
            const debt = debtors[i];
            const cred = creditors[j];
            const amt = Math.min(Math.abs(debt.a), cred.a);
            results.push({ from: debt.p, to: cred.p, amt });
            debt.a += amt;
            cred.a -= amt;
            if (Math.abs(debt.a) < 0.01) i++;
            if (cred.a < 0.01) j++;
        }
        return results;
    };

    const addP = () => {
        if (newParticipant.trim() && !participants.includes(newParticipant.trim())) {
            setParticipants([...participants, newParticipant.trim()]);
            setNewParticipant('');
        }
    };

    // Helper for formatting price
    const formatPrice = (p) => `RM ${typeof p === 'number' ? p.toFixed(2) : '0.00'}`;

    const CategoryIcon = ({ cat, size = 20, color = "#000" }) => {
        switch (cat) {
            case 'Food': return <Utensils size={size} color={color} />;
            case 'Transport': return <Car size={size} color={color} />;
            case 'Hotel': return <Bed size={size} color={color} />;
            default: return <ShoppingBag size={size} color={color} />;
        }
    };

    // --- Renders ---

    // 1. HOME VIEW
    if (viewState === 'home') {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                        <ArrowLeft size={24} color="#0f172a" />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Wallet size={48} color="#0f172a" />
                        <Text style={styles.headerTitleLarge}>Expenses</Text>
                        <Text style={styles.headerSubtitle}>Split bills fairly among friends</Text>
                    </View>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.actionContainer}>
                    <TouchableOpacity style={styles.actionCard} onPress={handleCreateNewBill}>
                        <View style={[styles.actionIconCircle, { backgroundColor: '#dcfce7' }]}>
                            <Receipt size={24} color="#16a34a" />
                        </View>
                        <View>
                            <Text style={styles.actionTitle}>Create New Bill</Text>
                            <Text style={styles.actionDesc}>Quick standalone expense</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard} onPress={handleSelectTrip}>
                        <View style={[styles.actionIconCircle, { backgroundColor: '#dbeafe' }]}>
                            <Calendar size={24} color="#2563eb" />
                        </View>
                        <View>
                            <Text style={styles.actionTitle}>Select from Trip</Text>
                            <Text style={styles.actionDesc}>Link to an existing trip</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.listContainer}>
                    <Text style={styles.sectionHeaderLabel}>BILL SESSIONS</Text>
                    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                        {trips.length === 0 ? (
                            <Text style={styles.emptyText}>No active bill sessions.</Text>
                        ) : (
                            trips.map(trip => (
                                <TouchableOpacity key={trip.id} style={styles.tripCard} onPress={() => handleTripSelected(trip)}>
                                    <View style={styles.tripIcon}>
                                        <Text style={styles.tripIconText}>{trip.destination.charAt(0)}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.tripTitle}>{trip.destination}</Text>
                                        <Text style={styles.tripDate}>{trip.startDate}</Text>
                                    </View>
                                    {trip.isAdHoc && (
                                        <View style={styles.badge}>
                                            <Text style={styles.badgeText}>Standalone</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))
                        )}
                    </ScrollView>
                </View>

                <Modal visible={isCreatingBill} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalHeaderTitle}>Name Your Bill Group</Text>
                            <Text style={styles.modalSubText}>Give a name to this collection (e.g. "Dinner at Mamak").</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="e.g. Weekend Getaway"
                                value={billGroupName}
                                onChangeText={setBillGroupName}
                                autoFocus
                            />
                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={styles.modalCancel} onPress={() => setIsCreatingBill(false)}>
                                    <Text style={styles.modalCancelText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalConfirm} onPress={confirmCreateBill}>
                                    <Text style={styles.modalConfirmText}>Create Bill</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        );
    }

    // 2. TRIP SELECT VIEW
    if (viewState === 'trip_select') {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.simpleHeader}>
                    <TouchableOpacity onPress={() => setViewState('home')} style={styles.iconButton}>
                        <ArrowLeft size={24} color="#0f172a" />
                    </TouchableOpacity>
                    <Text style={styles.simpleHeaderTitle}>Select a Trip</Text>
                </View>
                <ScrollView contentContainerStyle={{ padding: 24 }}>
                    {trips.map(trip => (
                        <TouchableOpacity key={trip.id} style={styles.tripCard} onPress={() => handleTripSelected(trip)}>
                            <View style={styles.tripIcon}>
                                <Text style={styles.tripIconText}>{trip.destination.charAt(0)}</Text>
                            </View>
                            <View>
                                <Text style={styles.tripTitle}>{trip.destination}</Text>
                                <Text style={styles.tripDate}>{trip.startDate}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </SafeAreaView>
        );
    }

    // 3. DETAILS VIEW
    if (viewState === 'details' && selectedExpense) {
        const splitAmount = selectedExpense.amount / (selectedExpense.splitMethod === 'MANUALLY' ? selectedExpense.participants.length : selectedExpense.participants.length);

        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.simpleHeader}>
                    <TouchableOpacity onPress={() => setViewState('workspace')} style={styles.iconButton}>
                        <ArrowLeft size={24} color="#0f172a" />
                    </TouchableOpacity>
                </View>
                <View style={styles.detailBody}>
                    <View style={styles.detailIcon}>
                        <CategoryIcon cat={selectedExpense.category} size={32} color="#0f172a" />
                    </View>
                    <Text style={styles.detailTitle}>{selectedExpense.title}</Text>
                    <Text style={styles.detailDate}>{new Date(selectedExpense.date).toLocaleDateString()}</Text>
                    <Text style={styles.detailAmount}>{formatPrice(selectedExpense.amount)}</Text>
                    <View style={styles.payerBadge}>
                        <Text style={styles.payerBadgeText}>Paid by {selectedExpense.payer}</Text>
                    </View>

                    <View style={styles.breakdownContainer}>
                        <Text style={styles.sectionHeaderLabel}>BREAKDOWN</Text>
                        {selectedExpense.participants.map(p => {
                            const name = selectedExpense.splitMethod === 'MANUALLY' ? p.name : p;
                            const amt = selectedExpense.splitMethod === 'MANUALLY' ? p.amount : splitAmount;

                            return (
                                <View key={name} style={styles.breakdownRow}>
                                    <View style={styles.breakdownUser}>
                                        <View style={styles.avatarSmall}><Text style={styles.avatarText}>{name.charAt(0)}</Text></View>
                                        <Text style={styles.userName}>{name}</Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={styles.amountText}>{formatPrice(amt)}</Text>
                                        <Text style={[styles.roleText, name === selectedExpense.payer ? { color: '#22c55e' } : { color: '#f43f5e' }]}>
                                            {name === selectedExpense.payer ? 'PAYER' : 'OWES'}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => {
                            setWorkspaceExpenses(workspaceExpenses.filter(e => e.id !== selectedExpense.id));
                            setSelectedExpense(null);
                            setViewState('workspace');
                        }}
                    >
                        <Trash2 size={16} color="#ef4444" style={{ marginRight: 8 }} />
                        <Text style={styles.deleteButtonText}>Delete Bill</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // 4. WORKSPACE VIEW
    const debts = calculateDebts(workspaceExpenses);
    const totalSpent = workspaceExpenses.reduce((s, e) => s + e.amount, 0);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => setViewState('home')} style={styles.iconButton}>
                    <ArrowLeft size={24} color="#0f172a" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setViewState('home')} style={styles.saveFinishButton}>
                    <Text style={styles.saveFinishText}>Save & Finish</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.workspaceContent}>
                <Text style={styles.workspaceTitle}>{selectedTrip?.destination}</Text>
                <Text style={styles.workspaceSubtitle}>Add bills & track splits</Text>

                {/* Participants Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeaderRow}>
                        <Text style={styles.cardLabel}>PARTICIPANTS</Text>
                        <View style={styles.countBadge}><Text style={styles.countText}>{participants.length}</Text></View>
                    </View>
                    <View style={styles.participantTags}>
                        {participants.map(p => (
                            <View key={p} style={styles.participantTag}>
                                <Text style={styles.participantName}>{p}</Text>
                                {p !== CURRENT_USER && (
                                    <TouchableOpacity onPress={() => setParticipants(prev => prev.filter(x => x !== p))}>
                                        <X size={12} color="#fca5a5" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </View>
                    <View style={styles.addParticipantRow}>
                        <TextInput
                            style={styles.addParticipantInput}
                            placeholder="Add friend..."
                            value={newParticipant}
                            onChangeText={setNewParticipant}
                        />
                        <TouchableOpacity style={styles.addIconBtn} onPress={addP}>
                            <Plus size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Add Expense Form */}
                <View style={styles.formCard}>
                    <View style={styles.formHeader}>
                        <Text style={styles.formTitle}>Add Bill</Text>
                        <View style={styles.categoryRow}>
                            {['Food', 'Transport', 'Hotel', 'Shopping'].map(c => (
                                <TouchableOpacity
                                    key={c}
                                    style={[styles.catBtn, category === c && { backgroundColor: '#0f172a' }]}
                                    onPress={() => setCategory(c)}
                                >
                                    <CategoryIcon cat={c} size={14} color={category === c ? '#fff' : '#94a3b8'} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <TextInput
                        style={styles.billNameInput}
                        placeholder="Expense Name (e.g. Lunch)"
                        value={billName}
                        onChangeText={setBillName}
                    />

                    <View style={styles.amountInputRow}>
                        <DollarSign size={16} color="#94a3b8" />
                        <TextInput
                            style={styles.amountInputLarge}
                            placeholder="0.00"
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />
                    </View>

                    <Text style={styles.inputLabel}>PAID BY</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                        {participants.map(p => (
                            <TouchableOpacity
                                key={p}
                                style={[styles.chipChoice, payer === p && styles.chipChoiceActive]}
                                onPress={() => setPayer(p)}
                            >
                                <Text style={[styles.chipText, payer === p && styles.chipTextActive]}>{p}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <Text style={styles.inputLabel}>SPLIT METHOD</Text>
                    <View style={styles.splitToggle}>
                        <TouchableOpacity
                            style={[styles.splitOption, splitMethod === 'equal' && styles.splitOptionActive]}
                            onPress={() => setSplitMethod('equal')}
                        >
                            <Text style={[styles.splitText, splitMethod === 'equal' && styles.splitTextActive]}>EQUALLY</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.splitOption, splitMethod === 'manual' && styles.splitOptionActive]}
                            onPress={() => setSplitMethod('manual')}
                        >
                            <Text style={[styles.splitText, splitMethod === 'manual' && styles.splitTextActive]}>MANUALLY</Text>
                        </TouchableOpacity>
                    </View>

                    {splitMethod === 'manual' && (
                        <View style={styles.manualSplitBox}>
                            {participants.map(p => (
                                <View key={p} style={styles.manualRow}>
                                    <Text style={styles.manualName}>{p}</Text>
                                    <View style={styles.manualInputContainer}>
                                        <Text style={styles.currencyPrefix}>RM</Text>
                                        <TextInput
                                            style={styles.manualInput}
                                            keyboardType="numeric"
                                            placeholder="0"
                                            value={manualSplits[p] || ''}
                                            onChangeText={t => setManualSplits({ ...manualSplits, [p]: t })}
                                        />
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    <TouchableOpacity style={styles.addButtonMain} onPress={handleAddExpense}>
                        <Text style={styles.addButtonText}>Add to List</Text>
                    </TouchableOpacity>
                </View>

                {/* Expense List */}
                <View style={styles.listSection}>
                    <View style={styles.listHeader}>
                        <Text style={styles.sectionHeaderLabel}>CURRENT BILLS</Text>
                        <Text style={styles.totalText}>Total: {formatPrice(totalSpent)}</Text>
                    </View>

                    {workspaceExpenses.length === 0 ? (
                        <View style={styles.emptyBox}>
                            <Text style={styles.emptyBoxText}>No bills added yet.</Text>
                        </View>
                    ) : (
                        workspaceExpenses.map(exp => (
                            <TouchableOpacity key={exp.id} style={styles.expenseItem} onPress={() => { setSelectedExpense(exp); setViewState('details'); }}>
                                <View style={styles.expenseLeft}>
                                    <View style={styles.catIconCircle}>
                                        <CategoryIcon cat={exp.category} color="#3b82f6" />
                                    </View>
                                    <View>
                                        <Text style={styles.expenseTitle}>{exp.title}</Text>
                                        <Text style={styles.expenseSub}>Paid by {exp.payer}</Text>
                                    </View>
                                </View>
                                <Text style={styles.expenseAmount}>{formatPrice(exp.amount)}</Text>
                            </TouchableOpacity>
                        ))
                    )}
                </View>

                {/* Settlement */}
                <View style={styles.settlementCard}>
                    <View style={styles.cardHeaderRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Calculator size={16} color="#9ca3af" />
                            <Text style={styles.cardLabel}>SETTLEMENT</Text>
                        </View>
                    </View>
                    {debts.length > 0 ? (
                        debts.map((d, i) => (
                            <View key={i} style={styles.debtRow}>
                                <View style={styles.debtUser}>
                                    <View style={styles.avatarMini}><Text style={styles.avatarTextMini}>{d.from.charAt(0)}</Text></View>
                                    <Text style={styles.debtName}>{d.from}</Text>
                                </View>
                                <ArrowLeft size={12} color="#9ca3af" style={{ transform: [{ rotate: '180deg' }] }} />
                                <View style={styles.debtUser}>
                                    <Text style={styles.debtName}>{d.to}</Text>
                                </View>
                                <Text style={styles.debtAmount}>{formatPrice(d.amt)}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.allSettledText}>All settled up!</Text>
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },

    // Header
    header: { padding: 24, paddingBottom: 10, alignItems: 'center' },
    headerCenter: { alignItems: 'center', marginVertical: 16 },
    headerTitleLarge: { fontSize: 28, fontWeight: '900', color: '#0f172a', marginTop: 16 },
    headerSubtitle: { fontSize: 14, color: '#64748b', fontWeight: '500' },
    iconButton: { padding: 8, backgroundColor: '#fff', borderRadius: 20 },

    // Actions
    actionContainer: { padding: 24, gap: 16 },
    actionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 24, borderRadius: 32, gap: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    actionIconCircle: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
    actionTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
    actionDesc: { fontSize: 12, color: '#94a3b8' },

    // Lists
    listContainer: { flex: 1, paddingHorizontal: 24 },
    sectionHeaderLabel: { fontSize: 10, fontWeight: '900', color: '#94a3b8', marginBottom: 12, letterSpacing: 1 },
    emptyText: { textAlign: 'center', color: '#cbd5e1', marginTop: 24, fontSize: 14 },
    tripCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 24, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9' },
    tripIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    tripIconText: { fontSize: 16, fontWeight: '800', color: '#3b82f6' },
    tripTitle: { fontSize: 14, fontWeight: '800', color: '#0f172a' },
    tripDate: { fontSize: 10, color: '#94a3b8' },
    badge: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    badgeText: { fontSize: 10, fontWeight: '700', color: '#64748b' },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
    modalContainer: { backgroundColor: '#fff', borderRadius: 32, padding: 24 },
    modalHeaderTitle: { fontSize: 20, fontWeight: '900', color: '#0f172a', marginBottom: 8 },
    modalSubText: { fontSize: 12, color: '#64748b', marginBottom: 16 },
    modalInput: { fontSize: 16, fontWeight: '700', borderBottomWidth: 2, borderColor: '#e2e8f0', paddingVertical: 8, marginBottom: 24 },
    modalButtons: { flexDirection: 'row', gap: 12 },
    modalCancel: { flex: 1, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
    modalConfirm: { flex: 1, padding: 16, borderRadius: 16, backgroundColor: '#0f172a', alignItems: 'center' },
    modalCancelText: { fontWeight: '700', color: '#0f172a' },
    modalConfirmText: { fontWeight: '700', color: '#fff' },

    // Workspace
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 24 },
    saveFinishButton: { backgroundColor: '#0f172a', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
    saveFinishText: { color: '#fff', fontSize: 12, fontWeight: '800' },
    workspaceContent: { padding: 24, paddingTop: 0, paddingBottom: 40 },
    workspaceTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
    workspaceSubtitle: { fontSize: 14, color: '#64748b', marginBottom: 24 },

    card: { backgroundColor: 'rgba(255,255,255,0.6)', padding: 16, borderRadius: 24, marginBottom: 16, borderWidth: 1, borderColor: '#fff' },
    cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    cardLabel: { fontSize: 10, fontWeight: '800', color: '#94a3b8' },
    countBadge: { backgroundColor: '#eff6ff', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
    countText: { fontSize: 10, fontWeight: '800', color: '#3b82f6' },
    participantTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
    participantTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: '#f1f5f9', gap: 4 },
    participantName: { fontSize: 12, fontWeight: '700', color: '#475569' },
    addParticipantRow: { flexDirection: 'row', gap: 8 },
    addParticipantInput: { flex: 1, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, fontSize: 12, height: 40, fontWeight: '600' },
    addIconBtn: { width: 40, height: 40, backgroundColor: '#0f172a', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },

    formCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 4, marginBottom: 24, overflow: 'hidden' },
    formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    formTitle: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
    categoryRow: { flexDirection: 'row', gap: 4 },
    catBtn: { padding: 8, borderRadius: 8, backgroundColor: '#f1f5f9' },
    billNameInput: { fontSize: 16, fontWeight: '700', borderBottomWidth: 1, borderColor: '#e2e8f0', paddingVertical: 8, marginBottom: 16 },
    amountInputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 12, paddingHorizontal: 12, marginBottom: 16 },
    amountInputLarge: { flex: 1, fontSize: 20, fontWeight: '900', paddingVertical: 12, marginLeft: 8 },
    inputLabel: { fontSize: 10, fontWeight: '800', color: '#94a3b8', marginBottom: 8, marginTop: 8 },
    horizontalScroll: { marginBottom: 16 },
    chipChoice: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#f1f5f9', marginRight: 8 },
    chipChoiceActive: { backgroundColor: '#0f172a' },
    chipText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
    chipTextActive: { color: '#fff' },
    splitToggle: { flexDirection: 'row', backgroundColor: '#f1f5f9', padding: 4, borderRadius: 12, marginBottom: 16 },
    splitOption: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
    splitOptionActive: { backgroundColor: '#fff', shadowOpacity: 0.05, shadowRadius: 2, shadowColor: '#000', elevation: 1 },
    splitText: { fontSize: 10, fontWeight: '900', color: '#94a3b8' },
    splitTextActive: { color: '#0f172a' },
    manualSplitBox: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 12, gap: 8, marginBottom: 16 },
    manualRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    manualName: { fontSize: 12, fontWeight: '700', color: '#475569' },
    manualInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 8, width: 80 },
    currencyPrefix: { fontSize: 10, fontWeight: '700', color: '#94a3b8', marginRight: 4 },
    manualInput: { flex: 1, fontSize: 12, fontWeight: '700', paddingVertical: 6 },
    addButtonMain: { backgroundColor: '#0f172a', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
    addButtonText: { color: '#fff', fontWeight: '800', fontSize: 14 },

    listSection: { marginBottom: 24 },
    listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 4 },
    totalText: { fontSize: 12, fontWeight: '800', color: '#3b82f6' },
    emptyBox: { padding: 32, alignItems: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: '#e2e8f0', borderRadius: 24 },
    emptyBoxText: { color: '#94a3b8', fontWeight: '600' },
    expenseItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 20, marginBottom: 8, borderWidth: 1, borderColor: '#f1f5f9' },
    expenseLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    catIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center' },
    expenseTitle: { fontSize: 14, fontWeight: '800', color: '#0f172a' },
    expenseSub: { fontSize: 10, color: '#64748b' },
    expenseAmount: { fontSize: 14, fontWeight: '800', color: '#0f172a' },

    settlementCard: { backgroundColor: '#0f172a', borderRadius: 24, padding: 24, marginBottom: 40 },
    debtRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 16, marginBottom: 8 },
    debtUser: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    avatarMini: { width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(239, 68, 68, 0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' },
    avatarTextMini: { fontSize: 10, fontWeight: '800', color: '#fecaca' },
    debtName: { color: '#e2e8f0', fontSize: 12, fontWeight: '700' },
    debtAmount: { color: '#fff', fontWeight: '800', fontSize: 14 },
    allSettledText: { color: '#64748b', textAlign: 'center', fontWeight: '600', fontSize: 12, marginTop: 8 },

    // Details View
    simpleHeader: { padding: 24, flexDirection: 'row', alignItems: 'center', gap: 16 },
    simpleHeaderTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
    detailBody: { padding: 24, alignItems: 'center' },
    detailIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, marginBottom: 24 },
    detailTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a', marginBottom: 4 },
    detailDate: { fontSize: 14, color: '#64748b', fontWeight: '600', marginBottom: 16 },
    detailAmount: { fontSize: 48, fontWeight: '900', color: '#0f172a', marginBottom: 8 },
    payerBadge: { backgroundColor: '#eff6ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 32 },
    payerBadgeText: { color: '#3b82f6', fontWeight: '800', fontSize: 12, textTransform: 'uppercase' },

    breakdownContainer: { width: '100%', backgroundColor: '#fff', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
    breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    breakdownUser: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatarSmall: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: 12, fontWeight: '800', color: '#64748b' },
    userName: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
    amountText: { fontSize: 14, fontWeight: '800', color: '#0f172a' },
    roleText: { fontSize: 10, fontWeight: '800', textAlign: 'right' },
    deleteButton: { flexDirection: 'row', alignItems: 'center', marginTop: 32 },
    deleteButtonText: { color: '#ef4444', fontWeight: '700' },
});

export default ExpensesScreen;
