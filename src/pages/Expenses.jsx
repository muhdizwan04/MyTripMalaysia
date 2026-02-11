import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Plus, Receipt, Users, Calculator,
    Calendar, Trash2, DollarSign, Wallet, X, ChevronRight,
    Utensils, Car, Bed, ShoppingBag, Edit2
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useCurrency } from '../context/CurrencyContext';
import {
    createExpense,
    fetchUserTrips,
    fetchUserExpenses,
    fetchTripExpenses,
    createLocalTrip
} from '../lib/api';

// Mock User
const CURRENT_USER = 'You';

export default function Expenses() {
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();

    // View States: 'home', 'workspace', 'details', 'trip_select'
    const [viewState, setViewState] = useState('home');
    const [loading, setLoading] = useState(false);

    // Data
    const [trips, setTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [workspaceExpenses, setWorkspaceExpenses] = useState([]); // Expenses for the current session/trip
    const [recentExpenses, setRecentExpenses] = useState([]); // All expenses for Home view
    const [selectedExpense, setSelectedExpense] = useState(null); // For Details View
    const [isCreatingBill, setIsCreatingBill] = useState(false); // Modal state
    const [billGroupName, setBillGroupName] = useState(''); // New Bill Group Name

    // Participants (dynamic based on context)
    const [participants, setParticipants] = useState([CURRENT_USER, 'Sarah', 'Amir']);

    // Form State
    const [newParticipant, setNewParticipant] = useState('');
    const [amount, setAmount] = useState('');
    const [billName, setBillName] = useState('');
    const [category, setCategory] = useState('Food');
    const [payer, setPayer] = useState(CURRENT_USER);
    const [splitMethod, setSplitMethod] = useState('equal');
    const [manualSplits, setManualSplits] = useState({}); // { "User": 50 }

    // --- Load User Data Needed for Home ---
    useEffect(() => {
        loadHomeData();
    }, []);

    const loadHomeData = async () => {
        try {
            const [expensesData, tripsData] = await Promise.all([
                fetchUserExpenses(CURRENT_USER),
                fetchUserTrips()
            ]);
            setRecentExpenses(mapExpenses(expensesData));
            setTrips(tripsData);
        } catch (err) {
            console.error("Failed to load data", err);
        }
    };

    const mapExpenses = (data) => data.map(e => ({
        id: e.id,
        title: e.title || e.category,
        amount: e.amount,
        payer: e.payer,
        participants: e.participants || [],
        splitMethod: e.split_method || 'EQUALLY',
        date: e.date,
        category: e.category,
        trip_id: e.trip_id
    }));

    // --- Handlers ---

    const handleCreateNewBill = () => {
        setBillGroupName('');
        setIsCreatingBill(true);
    };

    const confirmCreateBill = async () => {
        if (!billGroupName.trim()) {
            alert('Please enter a name for this bill group');
            return;
        }

        // Create a local trip/session to group these bills
        const newTrip = await createLocalTrip({
            destination: billGroupName,
            startDate: new Date().toISOString(),
            isAdHoc: true
        });

        setSelectedTrip(newTrip);

        // Reset Workspace Form
        setBillName('');
        setAmount('');
        setCategory('Food');
        setParticipants([CURRENT_USER, 'Friend 1']); // Default start
        setPayer(CURRENT_USER);
        setSplitMethod('equal');
        setManualSplits({});

        setWorkspaceExpenses([]);

        // Update local list immediately to ensure it appears
        setTrips(prev => [newTrip, ...prev]);

        setIsCreatingBill(false);
        setViewState('workspace');
    };

    const handleSelectTrip = async () => {
        setLoading(true);
        try {
            const userTrips = await fetchUserTrips();
            setTrips(userTrips);
            setViewState('trip_select');
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleTripSelected = async (trip) => {
        setSelectedTrip(trip);
        setLoading(true);
        try {
            const data = await fetchTripExpenses(trip.id);
            setWorkspaceExpenses(mapExpenses(data));
            // In a real app, participants would come from the trip data
            setParticipants([CURRENT_USER, 'Ali', 'Abu', 'Siti']);
            setViewState('workspace');
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleAddExpense = async () => {
        const numAmount = parseFloat(amount);
        if (!amount || isNaN(numAmount) || numAmount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        if (!billName.trim()) {
            alert('Please name your bill');
            return;
        }

        let finalParticipants = participants;
        if (splitMethod === 'manual') {
            const manualTotal = participants.reduce((sum, p) => sum + (parseFloat(manualSplits[p]) || 0), 0);
            if (Math.abs(manualTotal - numAmount) > 0.1) {
                alert(`Manual splits sum (${manualTotal.toFixed(2)}) must match bill amount (${numAmount.toFixed(2)})`);
                return;
            }
            finalParticipants = participants.map(p => ({
                name: p,
                amount: parseFloat(manualSplits[p] || 0)
            }));
        }

        setLoading(true);
        try {
            const expenseData = {
                title: billName,
                amount: numAmount,
                category: category,
                payer: payer,
                participants: finalParticipants,
                split_method: splitMethod === 'equal' ? 'EQUALLY' : 'MANUALLY',
                trip_id: selectedTrip ? selectedTrip.id : null,
                date: new Date().toISOString()
            };

            const saved = await createExpense(expenseData);

            // Add to workspace list locally (for immediate feedback)
            const newExp = {
                id: saved.id || Date.now(),
                title: billName,
                amount: numAmount,
                category: category,
                payer: payer,
                participants: finalParticipants,
                splitMethod: splitMethod === 'equal' ? 'EQUALLY' : 'MANUALLY',
                date: new Date().toISOString(),
                trip_id: selectedTrip ? selectedTrip.id : null
            };

            setWorkspaceExpenses([...workspaceExpenses, newExp]);

            // Reset Form ONLY (Keep user in workspace)
            setAmount('');
            setBillName('');
            setManualSplits({});
            // Keep participants and other settings for rapid entry

        } catch (error) {
            console.error("Failed to save", error);
            alert("Failed to save bill");
        } finally {
            setLoading(false);
        }
    };

    const openBillDetail = (expense) => {
        setSelectedExpense(expense);
        setViewState('details');
    };

    const calculateDebts = (items) => {
        const balances = {};
        // Get unique participants from items OR current participants list
        const allParticipants = [
            ...new Set([
                ...participants,
                ...items.flatMap(i => i.participants.map(p => typeof p === 'string' ? p : p.name))
            ])
        ];
        allParticipants.forEach(p => balances[p] = 0);

        items.forEach(exp => {
            if (exp.splitMethod === 'MANUALLY' || (exp.participants.length > 0 && typeof exp.participants[0] === 'object')) {
                // Manual Split Logic
                exp.participants.forEach(p => {
                    // p is { name, amount }
                    if (balances[p.name] !== undefined) balances[p.name] -= p.amount;
                });
            } else {
                // Equal Split Logic
                const split = exp.amount / exp.participants.length;
                exp.participants.forEach(p => {
                    const name = typeof p === 'string' ? p : p.name;
                    if (balances[name] !== undefined) balances[name] -= split;
                });
            }
            // Payer gets credit
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

    // --- Components ---

    const CategoryIcon = ({ cat }) => {
        switch (cat) {
            case 'Food': return <Utensils className="h-4 w-4" />;
            case 'Transport': return <Car className="h-4 w-4" />;
            case 'Hotel': return <Bed className="h-4 w-4" />;
            default: return <ShoppingBag className="h-4 w-4" />;
        }
    };

    const addP = () => {
        if (newParticipant.trim() && !participants.includes(newParticipant.trim())) {
            setParticipants([...participants, newParticipant.trim()]);
            setNewParticipant('');
        }
    };

    // --- Render Views ---

    // 1. HOME VIEW
    if (viewState === 'home') {
        return (
            <div className="min-h-screen bg-batik pb-24 flex flex-col pt-20 px-6">
                <button onClick={() => navigate('/trips')} className="absolute top-8 left-6 p-2 bg-white rounded-full shadow-sm">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="text-center mb-8">
                    <Wallet className="h-16 w-16 mx-auto text-primary mb-4" />
                    <h2 className="text-3xl font-black">Expenses</h2>
                    <p className="text-gray-500 font-medium">Split bills fairly among friends</p>
                </div>

                <div className="space-y-4 mb-8">
                    <button onClick={handleCreateNewBill} className="w-full bg-white p-6 rounded-[32px] shadow-lg flex items-center gap-4 hover:scale-[1.05] active:scale-95 transition-all">
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <Receipt className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-lg">Create New Bill</h3>
                            <p className="text-sm text-gray-400">Quick standalone expense</p>
                        </div>
                    </button>

                    <button onClick={handleSelectTrip} className="w-full bg-white p-6 rounded-[32px] shadow-lg flex items-center gap-4 hover:scale-[1.05] active:scale-95 transition-all">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            <Calendar className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-lg">Select from Trip</h3>
                            <p className="text-sm text-gray-400">Link to an existing trip</p>
                        </div>
                    </button>
                </div>

                <div className="flex-1">
                    <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-4 px-2">Bill List (Sessions)</h3>
                    {trips.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 opacity-50">
                            <p className="text-sm font-medium">No active bill sessions.</p>
                        </div>
                    ) : (
                        <div className="space-y-3 pb-8">
                            {trips.map(trip => (
                                <div
                                    key={trip.id}
                                    onClick={() => handleTripSelected(trip)}
                                    className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer hover:shadow-md transition-all active:scale-95"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {trip.destination.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-800 line-clamp-1">{trip.destination}</h4>
                                            <p className="text-gray-500 text-[10px]">{new Date(trip.startDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    {trip.isAdHoc && (
                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">Standalone</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Create Bill Modal */}
                {isCreatingBill && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
                        <div className="bg-white p-6 rounded-3xl w-full max-w-sm shadow-2xl animate-in zoom-in-95">
                            <h3 className="text-xl font-black mb-4">Name Your Bill Group</h3>
                            <p className="text-gray-500 text-sm mb-4">Give a name to this collection of expenses (e.g. "Dinner at Mamak", "Langkawi Trip").</p>
                            <Input
                                value={billGroupName}
                                onChange={(e) => setBillGroupName(e.target.value)}
                                placeholder="e.g. Weekend Getaway"
                                className="mb-6 font-bold"
                                autoFocus
                            />
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={() => setIsCreatingBill(false)}>Cancel</Button>
                                <Button className="flex-1 font-bold" onClick={confirmCreateBill}>Create Bill</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // 2. UNIFIED WORKSPACE (Create + List + Settlement)
    if (viewState === 'workspace') {
        const debts = calculateDebts(workspaceExpenses);
        const totalSpent = workspaceExpenses.reduce((s, e) => s + e.amount, 0);

        return (
            <div className="min-h-screen bg-batik pb-24 pt-20 px-6">
                <button onClick={() => {
                    loadHomeData(); // Refresh home data before going back
                    setViewState('home');
                }} className="absolute top-8 left-6 p-2 bg-white rounded-full shadow-sm z-10">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <button onClick={() => {
                    loadHomeData();
                    setViewState('home');
                }} className="absolute top-8 right-6 px-4 py-2 bg-primary text-white text-xs font-bold rounded-full shadow-sm hover:bg-primary/90 z-10">
                    Save & Finish
                </button>

                <div className="mb-6">
                    <h2 className="text-3xl font-black">{selectedTrip ? selectedTrip.destination : 'New Bill Session'}</h2>
                    <p className="text-gray-500 text-sm font-medium">Add bills & track splits</p>
                </div>

                {/* 1. Configuration (Participants) */}
                <Card className="rounded-3xl shadow-sm border-white/50 bg-white/50 backdrop-blur-sm mb-6">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-xs font-bold text-gray-500 uppercase">Participants</label>
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{participants.length}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {participants.map(p => (
                                <div key={p} className="flex items-center gap-1 bg-white border border-gray-100 px-3 py-1.5 rounded-full shadow-sm">
                                    <span className="text-xs font-bold text-gray-700">{p}</span>
                                    {p !== CURRENT_USER && (
                                        <button onClick={() => setParticipants(participants.filter(x => x !== p))}>
                                            <X className="h-3 w-3 text-red-300 hover:text-red-500" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                value={newParticipant}
                                onChange={(e) => setNewParticipant(e.target.value)}
                                placeholder="Add friend..."
                                className="h-10 text-sm font-bold rounded-xl bg-white"
                            />
                            <Button onClick={addP} size="icon" className="h-10 w-10 rounded-xl shrink-0"><Plus className="h-5 w-5" /></Button>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Add Expense Form (Always visible) */}
                <Card className="rounded-3xl shadow-xl border-none mb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500" />
                    <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-black text-gray-900">Add Bill</h3>
                            <div className="flex gap-1">
                                {['Food', 'Transport', 'Hotel', 'Shop'].map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setCategory(c === 'Shop' ? 'Shopping' : c)}
                                        className={`p-2 rounded-lg transition-colors ${category === (c === 'Shop' ? 'Shopping' : c) ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}
                                    >
                                        {c === 'Food' && <Utensils className="h-3 w-3" />}
                                        {c === 'Transport' && <Car className="h-3 w-3" />}
                                        {c === 'Hotel' && <Bed className="h-3 w-3" />}
                                        {c === 'Shop' && <ShoppingBag className="h-3 w-3" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Input
                                value={billName}
                                onChange={(e) => setBillName(e.target.value)}
                                placeholder="Expense Name (e.g. Lunch)"
                                className="h-12 text-lg font-bold rounded-xl bg-gray-50 border-transparent focus:bg-white"
                            />
                        </div>

                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="pl-9 h-12 text-lg font-black rounded-xl bg-gray-50 border-transparent focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Paid By</label>
                            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                {participants.map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setPayer(p)}
                                        className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${payer === p ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Split Method</label>
                            <div className="flex bg-gray-100 p-1 rounded-xl mb-3">
                                <button
                                    className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${splitMethod === 'equal' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
                                    onClick={() => setSplitMethod('equal')}
                                >
                                    Equally
                                </button>
                                <button
                                    className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${splitMethod === 'manual' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
                                    onClick={() => setSplitMethod('manual')}
                                >
                                    Manually
                                </button>
                            </div>

                            {/* Manual Split Inputs */}
                            {splitMethod === 'manual' && (
                                <div className="space-y-2 bg-gray-50 p-3 rounded-xl">
                                    {participants.map(p => (
                                        <div key={p} className="flex items-center gap-2">
                                            <span className="text-xs font-bold w-20 truncate">{p}</span>
                                            <div className="relative flex-1">
                                                <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={manualSplits[p] || ''}
                                                    onChange={(e) => setManualSplits({ ...manualSplits, [p]: e.target.value })}
                                                    className="h-8 pl-6 text-xs font-bold bg-white"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex justify-between text-xs font-bold pt-2 border-t border-gray-200">
                                        <span>Total:</span>
                                        <span className={Math.abs(participants.reduce((s, p) => s + (parseFloat(manualSplits[p]) || 0), 0) - parseFloat(amount || 0)) < 0.1 ? 'text-green-600' : 'text-red-500'}>
                                            {formatPrice(participants.reduce((s, p) => s + (parseFloat(manualSplits[p]) || 0), 0))}
                                            / {formatPrice(amount || 0)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Button onClick={handleAddExpense} disabled={loading} className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
                            {loading ? 'Adding...' : 'Add to List'}
                        </Button>
                    </CardContent>
                </Card>

                {/* 3. Expense List */}
                <div className="mb-8">
                    <div className="flex items-center justify-between px-2 mb-3">
                        <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Current Bills</h3>
                        <span className="text-xs font-bold text-primary">Total: {formatPrice(totalSpent)}</span>
                    </div>

                    {workspaceExpenses.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-3xl">
                            <p className="text-sm text-gray-400">No bills added yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {workspaceExpenses.map(expense => (
                                <div
                                    key={expense.id}
                                    onClick={() => openBillDetail(expense)}
                                    className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer hover:border-primary transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                            <CategoryIcon cat={expense.category} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-900">{expense.title}</h4>
                                            <p className="text-[10px] text-gray-500">Paid by {expense.payer}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-gray-900">{formatPrice(expense.amount)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 4. Settlement Plan */}
                <Card className="bg-gray-900 text-white border-none rounded-3xl shadow-xl">
                    <CardContent className="p-6">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Calculator className="h-4 w-4" /> Settlement
                        </h3>
                        {debts.length > 0 ? (
                            <div className="space-y-4">
                                {debts.map((d, i) => (
                                    <div key={i} className="flex items-center justify-between bg-white/10 p-3 rounded-2xl">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-red-500/20 text-red-200 flex items-center justify-center text-[10px] font-bold border border-red-500/30">
                                                {d.from.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-gray-200">{d.from}</span>
                                            </div>
                                            <ArrowLeft className="h-3 w-3 text-gray-500 rotate-180" />
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-gray-200">{d.to}</span>
                                            </div>
                                        </div>
                                        <span className="font-bold text-white text-sm">{formatPrice(d.amt)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-sm text-gray-600 py-4">All settled up!</p>
                        )}
                    </CardContent>
                </Card>


            </div>
        );
    }

    // 3. DETAILS VIEW
    if (viewState === 'details' && selectedExpense) {
        const splitAmount = selectedExpense.amount / selectedExpense.participants.length;

        return (
            <div className="min-h-screen bg-gray-50 pb-24 pt-20 px-6">
                <button onClick={() => setViewState('workspace')} className="absolute top-8 left-6 p-2 bg-white rounded-full shadow-sm">
                    <ArrowLeft className="h-5 w-5" />
                </button>

                <div className="text-center mb-8">
                    <div className="h-20 w-20 bg-white rounded-full shadow-lg mx-auto flex items-center justify-center text-primary mb-4 p-4">
                        <CategoryIcon cat={selectedExpense.category} />
                    </div>
                    <h2 className="text-2xl font-black mb-1">{selectedExpense.title}</h2>
                    <p className="text-gray-500 text-sm font-medium">{new Date(selectedExpense.date).toLocaleDateString()}</p>
                    <h1 className="text-4xl font-black mt-4">{formatPrice(selectedExpense.amount)}</h1>
                    <p className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 inline-block px-3 py-1 rounded-full mt-2">
                        Paid by {selectedExpense.payer}
                    </p>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-4">Breakdown</h3>
                    <div className="space-y-4">
                        {selectedExpense.participants.map(p => (
                            <div key={p} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                        {p.charAt(0)}
                                    </div>
                                    <span className="font-bold text-sm text-gray-700">{p}</span>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-gray-900">{formatPrice(splitAmount)}</span>
                                    {p === selectedExpense.payer ? (
                                        <span className="text-[10px] text-green-500 font-bold uppercase">Payer</span>
                                    ) : (
                                        <span className="text-[10px] text-red-400 font-bold uppercase">Owes</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Button variant="ghost" className="text-red-500 font-bold text-sm" onClick={() => {
                        // Delete logic
                        setWorkspaceExpenses(workspaceExpenses.filter(e => e.id !== selectedExpense.id));
                        setViewState('workspace');
                    }}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete Bill
                    </Button>
                </div>
            </div>
        );
    }

    // 4. Trip Selection (kept simple)
    if (viewState === 'trip_select') {
        return (
            <div className="min-h-screen bg-batik pb-24 p-6 pt-20">
                <button onClick={() => setViewState('home')} className="absolute top-8 left-6 p-2 bg-white rounded-full shadow-sm">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h2 className="text-2xl font-black mb-6">Select a Trip</h2>
                {loading && <p>Loading...</p>}
                <div className="space-y-4">
                    {trips.map(trip => (
                        <div key={trip.id} onClick={() => handleTripSelected(trip)} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-primary transition-all">
                            <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-xl">
                                {trip.destination?.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{trip.destination}</h3>
                                <p className="text-xs text-gray-500">{new Date(trip.startDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return null;
}
