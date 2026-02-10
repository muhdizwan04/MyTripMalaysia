import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Plus, Trash2, DollarSign, Calculator, Users } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useCurrency } from '../../context/CurrencyContext';

export default function BillSplitter() {
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();

    // State
    const [participants, setParticipants] = useState(['You']);
    const [newParticipant, setNewParticipant] = useState('');

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState(''); // Used for Custom Type specification or generic note
    const [expenseType, setExpenseType] = useState('Food');
    const [payer, setPayer] = useState('You');
    const [splitMethod, setSplitMethod] = useState('equal'); // 'equal' | 'manual'
    const [manualShares, setManualShares] = useState({});

    const [expenses, setExpenses] = useState([]);

    // Handlers
    const addParticipant = () => {
        if (newParticipant.trim() && !participants.includes(newParticipant.trim())) {
            setParticipants([...participants, newParticipant.trim()]);
            setNewParticipant('');
        }
    };

    const removeParticipant = (name) => {
        if (name === 'You') return;
        setParticipants(participants.filter(p => p !== name));
        // Also remove from manual shares if present
        const newShares = { ...manualShares };
        delete newShares[name];
        setManualShares(newShares);
    };

    const handleAddExpense = () => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        const expenseAmount = parseFloat(amount);
        let shares = {};

        if (splitMethod === 'equal') {
            const splitAmount = expenseAmount / participants.length;
            participants.forEach(p => shares[p] = splitAmount);
        } else {
            // Validate manual split total
            const totalManual = Object.values(manualShares).reduce((a, b) => a + (parseFloat(b) || 0), 0);
            if (Math.abs(totalManual - expenseAmount) > 0.01) {
                alert(`Total split amount (${totalManual}) must equal expense amount (${expenseAmount})`);
                return;
            }
            participants.forEach(p => shares[p] = parseFloat(manualShares[p]) || 0);
        }

        const typeLabel = expenseType === 'Others' ? (description || 'Others') : expenseType;

        const newExpense = {
            id: Date.now(),
            type: typeLabel,
            amount: expenseAmount,
            payer,
            shares,
            splitMethod
        };

        setExpenses([...expenses, newExpense]);

        // Reset form
        setAmount('');
        setDescription('');
        setExpenseType('Food');
        setPayer('You');
        setSplitMethod('equal');
        setManualShares({});
    };

    const handleDeleteExpense = (id) => {
        setExpenses(expenses.filter(e => e.id !== id));
    };

    // Calculation Logic
    const calculateDebts = () => {
        const balances = {};
        participants.forEach(p => balances[p] = 0);

        expenses.forEach(expense => {
            const paidBy = expense.payer;
            balances[paidBy] += expense.amount; // Payer gets credit

            // Deduct shares from each participant
            Object.entries(expense.shares).forEach(([person, share]) => {
                balances[person] -= share;
            });
        });

        const debtors = [];
        const creditors = [];

        Object.entries(balances).forEach(([person, amount]) => {
            if (amount < -0.01) debtors.push({ person, amount });
            else if (amount > 0.01) creditors.push({ person, amount });
        });

        debtors.sort((a, b) => a.amount - b.amount);
        creditors.sort((a, b) => b.amount - a.amount);

        const debts = [];
        let i = 0;
        let j = 0;

        while (i < debtors.length && j < creditors.length) {
            let debtor = debtors[i];
            let creditor = creditors[j];

            let amount = Math.min(Math.abs(debtor.amount), creditor.amount);

            debts.push({
                from: debtor.person,
                to: creditor.person,
                amount: amount
            });

            debtor.amount += amount;
            creditor.amount -= amount;

            if (Math.abs(debtor.amount) < 0.01) i++;
            if (creditor.amount < 0.01) j++;
        }

        return debts;
    };

    const debts = calculateDebts();
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className="min-h-screen bg-batik pb-24">
            <div className="max-w-md mx-auto px-6 py-10">
                <div className="mb-8">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="text-sm font-bold">Back</span>
                    </button>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">Details Bill Splitter</h1>
                    <p className="text-sm text-muted-foreground font-medium">Split expenses fairly among friends</p>
                </div>

                {/* Participants Section */}
                <Card className="mb-6 border-2 border-white/50 rounded-3xl overflow-hidden glass-card">
                    <CardContent className="p-6">
                        <h3 className="text-xs font-black uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
                            <Users className="h-4 w-4" /> Participants
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {participants.map((p) => (
                                <div key={p} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
                                    <div className="h-5 w-5 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-[10px] text-white font-bold">
                                        {p.charAt(0)}
                                    </div>
                                    <span className="text-sm font-bold">{p}</span>
                                    {p !== 'You' && (
                                        <button onClick={() => removeParticipant(p)} className="text-red-400 hover:text-red-600">
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                value={newParticipant}
                                onChange={(e) => setNewParticipant(e.target.value)}
                                placeholder="Add name..."
                                className="h-10 text-sm font-bold rounded-xl"
                            />
                            <Button onClick={addParticipant} size="sm" className="h-10 w-10 p-0 rounded-xl">
                                <Plus className="h-5 w-5" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Add Expense Form */}
                <Card className="mb-8 border-2 border-white/50 rounded-3xl overflow-hidden glass-card shadow-lg">
                    <CardContent className="p-6 space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-primary mb-2 flex items-center gap-2">
                            <Plus className="h-4 w-4" /> Add New Expense
                        </h3>

                        {/* Amount & Type */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Amount</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="pl-9 h-12 text-lg font-black rounded-xl"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Type</label>
                                <select
                                    value={expenseType}
                                    onChange={(e) => setExpenseType(e.target.value)}
                                    className="w-full h-12 px-3 rounded-xl border-2 border-muted/20 bg-white font-bold text-sm outline-none focus:border-primary"
                                >
                                    <option value="Food">Food</option>
                                    <option value="Gas">Gas</option>
                                    <option value="Hotel">Hotel</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                        </div>

                        {/* Custom Description for Others */}
                        {expenseType === 'Others' && (
                            <Input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Specify expense type..."
                                className="rounded-xl font-medium"
                            />
                        )}

                        {/* Paid By */}
                        <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Paid By</label>
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                                {participants.map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setPayer(p)}
                                        className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all ${payer === p
                                                ? 'bg-primary text-white shadow-md transform scale-105'
                                                : 'bg-white border border-gray-100 text-gray-600'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Split Method */}
                        <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase mb-2 block">Split Method</label>
                            <div className="flex bg-muted/20 p-1 rounded-xl mb-3">
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
                                <div className="space-y-2 bg-white/50 p-3 rounded-xl border border-white/50">
                                    {participants.map(p => (
                                        <div key={p} className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-gray-700">{p}</span>
                                            <Input
                                                type="number"
                                                value={manualShares[p] || ''}
                                                onChange={(e) => setManualShares({ ...manualShares, [p]: e.target.value })}
                                                placeholder="0.00"
                                                className="w-24 h-8 text-right font-bold"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Button onClick={handleAddExpense} className="w-full h-12 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg shadow-primary/20">
                            Add Expense
                        </Button>
                    </CardContent>
                </Card>

                {/* Expenses List */}
                {expenses.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Recent Expenses</h3>
                            <span className="text-xs font-bold text-primary">Total: {formatPrice(totalSpent)}</span>
                        </div>

                        {expenses.map((expense) => (
                            <div key={expense.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative group">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-black text-gray-800">{expense.type}</h4>
                                        <p className="text-xs text-gray-500 font-medium">Paid by <span className="text-primary font-bold">{expense.payer}</span></p>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-black text-lg text-gray-900">{formatPrice(expense.amount)}</span>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{expense.splitMethod} Split</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteExpense(expense.id)}
                                    className="absolute -top-2 -right-2 bg-red-100 text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ))}

                        {/* Settlement Plan */}
                        <Card className="mt-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none rounded-3xl shadow-xl">
                            <CardContent className="p-6">
                                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-6 flex items-center gap-2">
                                    <Calculator className="h-4 w-4" /> Settlement Plan
                                </h3>

                                {debts.length > 0 ? (
                                    <div className="space-y-4">
                                        {debts.map((debt, idx) => (
                                            <div key={idx} className="flex items-center justify-between bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-red-500/20 text-red-200 flex items-center justify-center font-bold border border-red-500/30">
                                                        {debt.from.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-gray-200">{debt.from}</span>
                                                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Owes {debt.to}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xl font-black text-white">{formatPrice(debt.amount)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-400">
                                        <p className="font-medium text-sm">All settled up! No debts.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}

function X({ size = 24, className = "" }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    )
}
