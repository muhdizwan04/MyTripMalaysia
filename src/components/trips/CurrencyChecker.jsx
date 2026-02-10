import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { RefreshCcw, DollarSign, ArrowRightLeft, TrendingUp } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

const EXCHANGE_RATES = {
    RM: 1,
    USD: 0.21,
    SGD: 0.28,
    EUR: 0.19,
    GBP: 0.17,
    AUD: 0.32,
    JPY: 31.5,
    THB: 7.5
};

export default function CurrencyChecker() {
    const { currency, formatPrice } = useCurrency();
    const [amount, setAmount] = useState('100');
    const [fromCurrency, setFromCurrency] = useState('RM');
    const [toCurrency, setToCurrency] = useState('USD');
    const [result, setResult] = useState(null);

    const convert = () => {
        const amt = parseFloat(amount) || 0;
        const rateFrom = EXCHANGE_RATES[fromCurrency];
        const rateTo = EXCHANGE_RATES[toCurrency];

        // Convert to RM first, then to target
        const inRM = amt / rateFrom;
        const final = inRM * rateTo;

        setResult(final);
    };

    useEffect(() => {
        convert();
    }, [amount, fromCurrency, toCurrency]);

    return (
        <Card className="rounded-[32px] glass-card border-none shadow-xl overflow-hidden">
            <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-primary flex items-center justify-between">
                    Live Rates <TrendingUp className="h-4 w-4" />
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <div className="flex-1 space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">From</label>
                            <div className="flex gap-2">
                                <select
                                    className="bg-muted/50 rounded-xl px-2 text-xs font-black w-20 border-none"
                                    value={fromCurrency}
                                    onChange={(e) => setFromCurrency(e.target.value)}
                                >
                                    {Object.keys(EXCHANGE_RATES).map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <Input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="rounded-xl font-black h-10"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center -my-2 relative z-10">
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full bg-white shadow-md h-8 w-8 border-2 border-primary/10"
                            onClick={() => {
                                const temp = fromCurrency;
                                setFromCurrency(toCurrency);
                                setToCurrency(temp);
                            }}
                        >
                            <ArrowRightLeft className="h-3 w-3 text-primary" />
                        </Button>
                    </div>

                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">To</label>
                        <div className="flex gap-2">
                            <select
                                className="bg-muted/50 rounded-xl px-2 text-xs font-black w-20 border-none"
                                value={toCurrency}
                                onChange={(e) => setToCurrency(e.target.value)}
                            >
                                {Object.keys(EXCHANGE_RATES).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <div className="flex-1 bg-primary/5 rounded-xl flex items-center px-4 font-black text-primary">
                                {result ? result.toFixed(2) : '0.00'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-dashed">
                    <p className="text-[9px] text-center text-muted-foreground font-medium italic">
                        Rates are approximate. Check with your bank for exact conversion.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
