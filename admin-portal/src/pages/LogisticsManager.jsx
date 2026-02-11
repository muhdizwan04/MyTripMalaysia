import React, { useState, useEffect } from 'react';
import { getTransportLines, calculateTransport } from '../lib/api';
import { Truck, Train, Clock, CreditCard, ChevronRight, Settings, Calculator, AlertCircle, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export default function LogisticsManager() {
    const [activeTab, setActiveTab] = useState('settings'); // 'settings' or 'calculator'
    const [lines, setLines] = useState([]);
    const [selectedLine, setSelectedLine] = useState(null);
    const [startStation, setStartStation] = useState('');
    const [endStation, setEndStation] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (activeTab === 'calculator') {
            loadLines();
        }
    }, [activeTab]);

    const loadLines = async () => {
        try {
            setLoading(true);
            const data = await getTransportLines();
            setLines(data);
            if (data.length > 0 && !selectedLine) {
                setSelectedLine(data[0]);
            }
        } catch (err) {
            setError('Failed to load transport lines.');
        } finally {
            setLoading(false);
        }
    };

    const handleCalculate = async () => {
        if (!selectedLine || !startStation || !endStation) return;

        setLoading(true);
        setError('');
        try {
            const data = await calculateTransport({
                line: selectedLine.line_name,
                start: startStation,
                end: endStation
            });
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.error || 'Calculation failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleLineChange = (lineId) => {
        const line = lines.find(l => l.id === lineId);
        setSelectedLine(line);
        setStartStation('');
        setEndStation('');
        setResult(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Logistics & Transport</h2>
                    <p className="text-slate-500">Configure global transport rates and test public transport logic.</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={clsx(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                            activeTab === 'settings' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <Settings size={16} />
                        Settings
                    </button>
                    <button
                        onClick={() => setActiveTab('calculator')}
                        className={clsx(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                            activeTab === 'calculator' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <Calculator size={16} />
                        Calculator
                    </button>
                </div>
            </div>

            {activeTab === 'settings' ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
                        <Truck size={20} className="text-primary" />
                        Global Transport Rates
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700">Grab Base Rate (RM/km)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">RM</span>
                                <input type="number" defaultValue="1.50" step="0.1" className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700">Average Petrol Cost (RM/km)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">RM</span>
                                <input type="number" defaultValue="0.25" step="0.01" className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                            Save Global Rates
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Calculator Form */}
                    <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 self-start">
                        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                            <Train size={20} className="text-secondary" />
                            Fare Calculator
                        </h3>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Transport Line</label>
                                <select
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                                    value={selectedLine?.id || ''}
                                    onChange={(e) => handleLineChange(e.target.value)}
                                >
                                    {loading && lines.length === 0 ? <option>Loading...</option> : null}
                                    {lines.map(line => (
                                        <option key={line.id} value={line.id}>{line.line_name} ({line.type})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Start Station</label>
                                <select
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={startStation}
                                    onChange={(e) => setStartStation(e.target.value)}
                                    disabled={!selectedLine}
                                >
                                    <option value="">Select station...</option>
                                    {selectedLine?.stations.map(s => (
                                        <option key={s.code} value={s.name}>{s.name} ({s.code})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">End Station</label>
                                <select
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={endStation}
                                    onChange={(e) => setEndStation(e.target.value)}
                                    disabled={!selectedLine}
                                >
                                    <option value="">Select station...</option>
                                    {selectedLine?.stations.map(s => (
                                        <option key={s.code} value={s.name}>{s.name} ({s.code})</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={handleCalculate}
                                disabled={loading || !startStation || !endStation}
                                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Calculate Fare'}
                            </button>
                        </div>
                    </div>

                    {/* Result Display */}
                    <div className="lg:col-span-2 space-y-6">
                        {result ? (
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-300">
                                <div
                                    className="h-24 p-6 flex items-center justify-between text-white"
                                    style={{ backgroundColor: result.color_code }}
                                >
                                    <div>
                                        <p className="text-white/80 text-xs font-bold uppercase tracking-widest">{result.type}</p>
                                        <h4 className="text-xl font-bold">{result.line}</h4>
                                    </div>
                                    <Train size={32} className="opacity-40" />
                                </div>
                                <div className="p-8">
                                    <div className="flex items-center justify-between gap-4 mb-10">
                                        <div className="text-center flex-1">
                                            <p className="text-xs text-slate-400 font-bold uppercase mb-1">From</p>
                                            <p className="font-bold text-slate-800">{result.start}</p>
                                        </div>
                                        <div className="flex flex-col items-center flex-shrink-0 px-4">
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: result.color_code }}></div>
                                                <div className="w-12 h-[2px] bg-slate-100"></div>
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: result.color_code }}></div>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 mt-2">{result.stops} stops</span>
                                        </div>
                                        <div className="text-center flex-1">
                                            <p className="text-xs text-slate-400 font-bold uppercase mb-1">To</p>
                                            <p className="font-bold text-slate-800">{result.end}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                            <div className="flex items-center gap-3 text-emerald-600 mb-2">
                                                <CreditCard size={20} />
                                                <span className="text-xs font-bold uppercase tracking-wider">Estimated Fare</span>
                                            </div>
                                            <p className="text-3xl font-black text-slate-900">RM {result.fare.toFixed(2)}</p>
                                        </div>
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                            <div className="flex items-center gap-3 text-blue-600 mb-2">
                                                <Clock size={20} />
                                                <span className="text-xs font-bold uppercase tracking-wider">Estimated Time</span>
                                            </div>
                                            <p className="text-3xl font-black text-slate-900">{result.duration_min} <span className="text-lg font-bold text-slate-400">Mins</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full min-h-[400px] bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                                    <Calculator size={32} />
                                </div>
                                <h4 className="font-bold text-slate-600">No Calculation Yet</h4>
                                <p className="text-sm max-w-xs mt-2">Select a transport line and stations to calculate estimated fare and travel time.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
