import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { ArrowLeft, ArrowRight, Plus, Trash2, PieChart, DollarSign, Users, UserPlus, X, Calculator, Star } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export default function ExpenseTracker() {
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();

    // -- State --
    const [members, setMembers] = useState(['You', 'Sarah']);
    const [newMemberName, setNewMemberName] = useState('');
    const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);

    const [expenses, setExpenses] = useState([
        { id: 1, title: 'Dinner at Jalan Alor', amount: 120, payer: 'You', involved: ['You', 'Sarah'], date: '2023-10-25' },
        { id: 2, title: 'Grab to KLCC', amount: 15, payer: 'Sarah', involved: ['You', 'Sarah'], date: '2023-10-25' }
    ]);

    const [newExpense, setNewExpense] = useState({
        title: '',
        amount: '',
        payer: 'You',
        involved: ['You', 'Sarah'],
        splitType: 'equal', // 'equal', 'manual', 'percentage'
        customAmounts: {}, // { 'Person1': 50 }
        percentages: {}   // { 'Person1': 50 }
    });
    const [isAdding, setIsAdding] = useState(false);
    const [settlements, setSettlements] = useState([]);
    const [history, setHistory] = useState([]); // Past settlements

    // -- Effects --
    useEffect(() => {
        calculateSettlements();
    }, [expenses, members]);

    // -- Actions --

    const handleAddMember = () => {
        if (newMemberName.trim() && !members.includes(newMemberName.trim())) {
            setMembers([...members, newMemberName.trim()]);
            setNewMemberName('');
        }
    };

    const handleRemoveMember = (member) => {
        if (members.length <= 1) {
            alert("You need at least 1 member.");
            return;
        }
        // Optional: Check if member has expenses before deleting? 
        // For now, simple delete. Expenses involving them might get buggy if not handled, 
        // but let's assume user clears expenses or we filter them out in calcs.
        setMembers(members.filter(m => m !== member));
    };

    const handleAddExpense = () => {
        const total = parseFloat(newExpense.amount);
        if (!newExpense.title || !total || newExpense.involved.length === 0) {
            alert("Please fill in all fields and select at least one person to split with.");
            return;
        }

        if (newExpense.splitType === 'manual') {
            const manualTotal = Object.values(newExpense.customAmounts).reduce((a, b) => a + (parseFloat(b) || 0), 0);
            if (Math.abs(manualTotal - total) > 0.01) {
                alert(`Split amounts (${manualTotal.toFixed(2)}) must equal total (${total.toFixed(2)})`);
                return;
            }
        }

        if (newExpense.splitType === 'percentage') {
            const totalPercent = Object.values(newExpense.percentages).reduce((a, b) => a + (parseFloat(b) || 0), 0);
            if (Math.abs(totalPercent - 100) > 0.01) {
                alert(`Total percentage (${totalPercent}%) must equal 100%`);
                return;
            }
        }

        const expense = {
            id: Date.now(),
            title: newExpense.title,
            amount: total,
            payer: newExpense.payer,
            involved: newExpense.involved,
            splitType: newExpense.splitType,
            customAmounts: newExpense.splitType === 'manual' ? newExpense.customAmounts : null,
            percentages: newExpense.splitType === 'percentage' ? newExpense.percentages : null,
            date: new Date().toISOString().split('T')[0]
        };

        setExpenses([expense, ...expenses]);
        setNewExpense({
            title: '',
            amount: '',
            payer: members[0] || 'You',
            involved: members,
            splitType: 'equal',
            customAmounts: {}
        });
        setIsAdding(false);
    };

    const toggleInvolved = (member) => {
        if (newExpense.involved.includes(member)) {
            setNewExpense({ ...newExpense, involved: newExpense.involved.filter(m => m !== member) });
        } else {
            setNewExpense({ ...newExpense, involved: [...newExpense.involved, member] });
        }
    };

    // -- Logic --

    const calculateSettlements = () => {
        const balances = {};
        members.forEach(m => balances[m] = 0);

        expenses.forEach(expense => {
            const amount = parseFloat(expense.amount);
            const payer = expense.payer;
            const involved = expense.involved.filter(m => members.includes(m)); // Filter out deleted members just in case

            if (involved.length === 0) return;

            // Involved people "spent" the split amount (- debit)
            involved.forEach(person => {
                if (balances[person] !== undefined) {
                    if (expense.splitType === 'manual' && expense.customAmounts) {
                        balances[person] -= (parseFloat(expense.customAmounts[person]) || 0);
                    } else if (expense.splitType === 'percentage' && expense.percentages) {
                        balances[person] -= (amount * (parseFloat(expense.percentages[person]) / 100));
                    } else {
                        const splitAmount = amount / involved.length;
                        balances[person] -= splitAmount;
                    }
                }
            });

            // Payer "paid" the amount (+ credit)
            if (balances[payer] !== undefined) {
                balances[payer] += amount;
            }
        });

        // Generate transactions
        const debtors = [];
        const creditors = [];

        Object.entries(balances).forEach(([member, balance]) => {
            if (balance < -0.01) debtors.push({ member, amount: balance }); // Negative balance = Owes money
            if (balance > 0.01) creditors.push({ member, amount: balance }); // Positive balance = Owed money
        });

        debtors.sort((a, b) => a.amount - b.amount); // Sort by most debt
        creditors.sort((a, b) => b.amount - a.amount); // Sort by most credit

        const newSettlements = [];
        let i = 0; // debtors index
        let j = 0; // creditors index

        while (i < debtors.length && j < creditors.length) {
            const debtor = debtors[i];
            const creditor = creditors[j];

            const amount = Math.min(Math.abs(debtor.amount), creditor.amount);

            newSettlements.push({
                from: debtor.member,
                to: creditor.member,
                amount: amount
            });

            debtor.amount += amount;
            creditor.amount -= amount;

            if (Math.abs(debtor.amount) < 0.01) i++;
            if (creditor.amount < 0.01) j++;
        }

        setSettlements(newSettlements);
    };

    const totalExpense = expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);

    return (
        <div className="min-h-screen bg-batik pb-20">
            <div className="max-w-4xl mx-auto px-6 py-10">
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="p-0 h-auto hover:bg-transparent text-primary font-black text-[10px] tracking-[0.2em] flex items-center gap-2 mb-2"
                        >
                            <ArrowLeft className="h-4 w-4" /> BACK TO TRIP
                        </Button>
                        <h1 className="text-4xl font-black tracking-tighter text-foreground flex items-center gap-3">
                            Bill Splitter <Calculator className="h-8 w-8 text-primary" />
                        </h1>
                        <p className="text-muted-foreground font-medium text-sm italic">Making sure travel debts don't ruin the friendship 🇲🇾</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsManageMembersOpen(!isManageMembersOpen)}
                            className="rounded-2xl h-12 border-2 border-primary/20 bg-white shadow-sm font-black"
                        >
                            <Users className="mr-2 h-4 w-4" /> FRIENDS ({members.length})
                        </Button>
                    </div>
                </header>

                {/* Manage Members Section */}
                {isManageMembersOpen && (
                    <Card className="mb-10 glass-card rounded-[32px] overflow-hidden border-2 border-primary/10">
                        <CardHeader className="bg-primary/5 pb-4">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-primary">Your Travel Crew</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex flex-wrap gap-3 mb-6">
                                {members.map(member => (
                                    <div key={member} className="bg-white border-2 border-muted px-4 py-2 rounded-2xl flex items-center gap-3 text-sm font-black shadow-sm group hover:border-primary/40 transition-all">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px]">{member[0]}</div>
                                        <span>{member}</span>
                                        <button onClick={() => handleRemoveMember(member)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-3 max-w-sm">
                                <Input
                                    placeholder="Add someone else..."
                                    className="h-12 rounded-2xl border-2 focus-visible:ring-primary/20"
                                    value={newMemberName}
                                    onChange={e => setNewMemberName(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddMember()}
                                />
                                <Button className="h-12 w-12 rounded-2xl shrink-0" onClick={handleAddMember}><Plus className="h-5 w-5" /></Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            <Card className="rounded-[32px] border-none bg-primary text-primary-foreground shadow-xl shadow-primary/20 p-6 flex flex-col justify-between h-32">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Trip Pot</span>
                                <span className="text-3xl font-black">{formatPrice(totalExpense)}</span>
                            </Card>

                            <Card className="rounded-[32px] border-none glass-card p-6 flex flex-col justify-between h-32">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">My Position</span>
                                <div className={`text-3xl font-black ${settlements.some(s => s.from === 'You') ? 'text-destructive' : settlements.some(s => s.to === 'You') ? 'text-green-600' : ''}`}>
                                    {(() => {
                                        const myDebt = settlements.filter(s => s.from === 'You').reduce((sum, s) => sum + s.amount, 0);
                                        const myCredit = settlements.filter(s => s.to === 'You').reduce((sum, s) => sum + s.amount, 0);
                                        const balance = myCredit - myDebt;
                                        return balance === 0 ? formatPrice(0) : (balance > 0 ? `+${formatPrice(balance)}` : `-${formatPrice(Math.abs(balance))}`);
                                    })()}
                                </div>
                            </Card>

                            {/* Top Settlements as mini-cards */}
                            {settlements.slice(0, 2).map((s, idx) => (
                                <Card key={idx} className="rounded-[32px] border-none glass-card p-6 flex flex-col justify-between bg-white/40">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-destructive">Pay To</span>
                                            <span className="font-black truncate w-20">{s.to}</span>
                                        </div>
                                        <ArrowLeft className="h-4 w-4 rotate-[135deg] text-destructive" />
                                    </div>
                                    <div className="text-2xl font-black text-foreground">{formatPrice(s.amount)}</div>
                                </Card>
                            ))}

                            {settlements.length === 0 && expenses.length > 0 && (
                                <Card className="rounded-[32px] border-none bg-green-500 text-white p-6 flex items-center gap-4 col-span-1 sm:col-span-2">
                                    <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                        <Star className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Sync Complete</span>
                                        <p className="font-black text-xl">All balances settled!</p>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-primary" /> Expense History
                                </h3>
                                {!isAdding && (
                                    <Button onClick={() => setIsAdding(true)} className="rounded-2xl h-10 px-6 font-black text-xs shadow-lg shadow-primary/20">
                                        <Plus className="mr-2 h-4 w-4" /> ADD BILL
                                    </Button>
                                )}
                            </div>

                            {isAdding && (
                                <Card className="rounded-[32px] glass-card border-2 border-primary/20 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-4">
                                    <div className="p-8 space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 block">Description</label>
                                                    <Input
                                                        placeholder="e.g. Seafood Dinner at Malacca"
                                                        className="h-14 rounded-2xl border-2 text-lg font-bold"
                                                        value={newExpense.title}
                                                        onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 block">Total Amount (RM)</label>
                                                    <div className="relative">
                                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-primary h-6 w-6" />
                                                        <Input
                                                            type="number"
                                                            placeholder="0.00"
                                                            className="h-14 rounded-2xl border-2 pl-12 text-2xl font-black"
                                                            value={newExpense.amount}
                                                            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 block">Who Paid?</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {members.map(member => (
                                                            <button
                                                                key={member}
                                                                className={`px-5 py-3 rounded-2xl text-sm font-black border-2 transition-all ${newExpense.payer === member ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white hover:border-primary/30 border-muted'}`}
                                                                onClick={() => setNewExpense({ ...newExpense, payer: member })}
                                                            >
                                                                {member}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div>
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 block">Split Mode</label>
                                                    <div className="flex bg-muted/50 p-1.5 rounded-2xl border-2">
                                                        {['equal', 'manual', 'percentage'].map(mode => (
                                                            <button
                                                                key={mode}
                                                                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${newExpense.splitType === mode ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground opacity-60 hover:opacity-100'}`}
                                                                onClick={() => setNewExpense({ ...newExpense, splitType: mode })}
                                                            >
                                                                {mode}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 block">Split Details</label>
                                                    <div className="space-y-3">
                                                        {members.map(member => (
                                                            <div key={member} className="flex items-center gap-3">
                                                                <button
                                                                    className={`flex-1 text-left px-5 py-3 rounded-2xl border-2 text-sm font-bold transition-all flex justify-between items-center ${newExpense.involved.includes(member) ? 'bg-primary/5 border-primary/20' : 'bg-white opacity-40 grayscale border-dashed'}`}
                                                                    onClick={() => toggleInvolved(member)}
                                                                >
                                                                    <span>{member}</span>
                                                                    {newExpense.involved.includes(member) && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                                                                </button>
                                                                {(newExpense.splitType === 'manual' || newExpense.splitType === 'percentage') && newExpense.involved.includes(member) && (
                                                                    <div className="w-28 relative">
                                                                        <Input
                                                                            type="number"
                                                                            placeholder={newExpense.splitType === 'manual' ? '0.00' : '0%'}
                                                                            className="h-12 rounded-xl text-right font-black border-2 pr-8"
                                                                            value={newExpense.splitType === 'manual' ? (newExpense.customAmounts[member] || '') : (newExpense.percentages[member] || '')}
                                                                            onChange={(e) => {
                                                                                const val = e.target.value;
                                                                                if (newExpense.splitType === 'manual') {
                                                                                    setNewExpense({ ...newExpense, customAmounts: { ...newExpense.customAmounts, [member]: val } });
                                                                                } else {
                                                                                    setNewExpense({ ...newExpense, percentages: { ...newExpense.percentages, [member]: val } });
                                                                                }
                                                                            }}
                                                                        />
                                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground">
                                                                            {newExpense.splitType === 'manual' ? 'RM' : '%'}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-6 border-t">
                                            <Button variant="ghost" onClick={() => setIsAdding(false)} className="rounded-xl font-bold font-black text-xs tracking-widest uppercase">Discard</Button>
                                            <Button onClick={handleAddExpense} className="h-14 px-12 rounded-2xl font-black shadow-xl shadow-primary/20">SAVE EXPENSE</Button>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            <div className="space-y-4">
                                {expenses.length > 0 ? (
                                    expenses.map(expense => (
                                        <div key={expense.id} className="p-6 bg-white/60 backdrop-blur-md rounded-[32px] border-2 border-muted hover:border-primary/20 transition-all flex flex-col md:flex-row md:items-center justify-between group shadow-sm">
                                            <div className="flex items-center gap-5">
                                                <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                                    <DollarSign className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black tracking-tight">{expense.title}</h4>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-[10px] font-black uppercase text-primary/70">{expense.payer} paid</span>
                                                        <span className="h-1 w-1 rounded-full bg-muted"></span>
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{expense.involved.length} involved</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6 mt-4 md:mt-0 ml-16 md:ml-0">
                                                <span className="text-2xl font-black tracking-tighter">{formatPrice(expense.amount)}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all rounded-xl"
                                                    onClick={() => setExpenses(expenses.filter(e => e.id !== expense.id))}
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 text-center space-y-4">
                                        <div className="h-24 w-24 rounded-[40px] bg-muted mx-auto flex items-center justify-center text-muted-foreground/30">
                                            <DollarSign className="h-12 w-12" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-xl font-black">Clean Slate!</h4>
                                            <p className="text-muted-foreground text-sm font-medium">Add some expenses to see the magic flow.</p>
                                        </div>
                                        <Button onClick={() => setIsAdding(true)} variant="outline" className="rounded-2xl border-2 font-black">Get Started</Button>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="sticky top-10 space-y-8">
                            <Card className="rounded-[40px] border-none malaysia-gradient text-white p-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                <div className="relative z-10 space-y-6">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest opacity-80">Settlement Hub</h3>

                                    <div className="space-y-4">
                                        {settlements.map((s, idx) => (
                                            <div key={idx} className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/10 space-y-4">
                                                <div className="flex justify-between items-center px-1">
                                                    <div className="text-center">
                                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-black text-sm mb-2">{s.from[0]}</div>
                                                        <p className="text-[8px] font-black uppercase opacity-60">Payer</p>
                                                        <p className="text-xs font-black truncate w-16">{s.from}</p>
                                                    </div>
                                                    <ArrowRight className="h-4 w-4 opacity-40 shrink-0" />
                                                    <div className="text-center">
                                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-black text-sm mb-2">{s.to[0]}</div>
                                                        <p className="text-[8px] font-black uppercase opacity-60">Collector</p>
                                                        <p className="text-xs font-black truncate w-16">{s.to}</p>
                                                    </div>
                                                </div>
                                                <div className="h-px bg-white/10"></div>
                                                <div className="flex justify-between items-center pt-1">
                                                    <span className="text-[10px] font-black uppercase opacity-60">Balance Due</span>
                                                    <span className="text-xl font-black">{formatPrice(s.amount)}</span>
                                                </div>
                                            </div>
                                        ))}

                                        {settlements.length === 0 && (
                                            <div className="py-8 text-center text-white/50 space-y-3">
                                                <div className="h-12 w-12 rounded-2xl bg-white/10 mx-auto flex items-center justify-center">
                                                    <Star className="h-6 w-6" />
                                                </div>
                                                <p className="text-xs font-bold uppercase tracking-widest">Perfectly Balanced</p>
                                            </div>
                                        )}
                                    </div>

                                    <Button className="w-full h-16 bg-white text-primary hover:bg-white/90 rounded-[24px] font-black shadow-xl group">
                                        SETTLE ALL <X className="ml-2 h-4 w-4 rotate-45" />
                                    </Button>
                                </div>
                            </Card>

                            <Card className="rounded-[40px] border-2 border-muted bg-white p-8">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6">Split Dynamics</h4>
                                <div className="space-y-6">
                                    {members.map(member => {
                                        const totalSpentBy = expenses.filter(e => e.payer === member).reduce((a, b) => a + b.amount, 0);
                                        const ratio = totalExpense > 0 ? (totalSpentBy / totalExpense) * 100 : 0;

                                        return (
                                            <div key={member} className="space-y-2">
                                                <div className="flex justify-between text-xs font-black">
                                                    <span className="uppercase text-muted-foreground">{member}</span>
                                                    <span>{formatPrice(totalSpentBy)}</span>
                                                </div>
                                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary transition-all duration-1000 ease-out"
                                                        style={{ width: `${ratio}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
