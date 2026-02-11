import React, { useState, useEffect } from 'react';
import { getTransportLines, calculateTransport } from '../lib/api';
import { Train, MapPin, Clock, CreditCard, ChevronRight, Loader2, AlertCircle, Info, Calendar } from 'lucide-react';
import { clsx } from 'clsx';

export default function TransportPage() {
    const [lines, setLines] = useState([]);
    const [selectedLine, setSelectedLine] = useState(null);
    const [startStation, setStartStation] = useState('');
    const [endStation, setEndStation] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [view, setView] = useState('calculator'); // 'calculator' or 'timetable'

    useEffect(() => {
        loadLines();
    }, []);

    const loadLines = async () => {
        try {
            setLoading(true);
            const data = await getTransportLines();
            setLines(data);
            if (data.length > 0) setSelectedLine(data[0]);
        } catch (err) {
            setError('Failed to load transport data.');
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
            setError('Calculation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-6 pt-12 rounded-b-[2.5rem] shadow-lg">
                <h1 className="text-2xl font-black">Transport Guide</h1>
                <p className="text-primary-foreground/70 text-sm mt-1">Plan your Klang Valley rail journey</p>

                <div className="flex bg-white/10 p-1 rounded-xl mt-6">
                    <button
                        onClick={() => setView('calculator')}
                        className={clsx(
                            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all",
                            view === 'calculator' ? "bg-white text-primary" : "text-white/60"
                        )}
                    >
                        <CreditCard size={16} /> Calculator
                    </button>
                    <button
                        onClick={() => setView('timetable')}
                        className={clsx(
                            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all",
                            view === 'timetable' ? "bg-white text-primary" : "text-white/60"
                        )}
                    >
                        <Clock size={16} /> Timetable
                    </button>
                </div>
            </div>

            <div className="p-5 mt-2">
                {view === 'calculator' ? (
                    <div className="space-y-6">
                        {/* Selector Section */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Rail Line</label>
                                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                    {lines.map((line) => (
                                        <button
                                            key={line.id}
                                            onClick={() => {
                                                setSelectedLine(line);
                                                setStartStation('');
                                                setEndStation('');
                                                setResult(null);
                                            }}
                                            className={clsx(
                                                "whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all",
                                                selectedLine?.id === line.id
                                                    ? "border-primary bg-primary/5 text-primary"
                                                    : "border-slate-100 text-slate-400"
                                            )}
                                        >
                                            {line.type} {line.line_name.split(' ')[1]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">From Station</label>
                                    <select
                                        className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                        value={startStation}
                                        onChange={(e) => setStartStation(e.target.value)}
                                    >
                                        <option value="">Select Departure</option>
                                        {selectedLine?.stations.map(s => (
                                            <option key={s.code} value={s.name}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">To Station</label>
                                    <select
                                        className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                        value={endStation}
                                        onChange={(e) => setEndStation(e.target.value)}
                                    >
                                        <option value="">Select Destination</option>
                                        {selectedLine?.stations.map(s => (
                                            <option key={s.code} value={s.name}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleCalculate}
                                disabled={loading || !startStation || !endStation}
                                className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary/30 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : "Check Cost & Time"}
                            </button>
                        </div>

                        {/* Result Section */}
                        {result && (
                            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 animate-in zoom-in-95 duration-300">
                                <div className="p-6 text-white" style={{ backgroundColor: result.color_code }}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[10px] font-black uppercase opacity-70 tracking-widest">Recommended Route</p>
                                            <h3 className="text-xl font-black mt-1">Estimated Journey</h3>
                                        </div>
                                        <Train size={32} className="opacity-30" />
                                    </div>

                                    <div className="flex items-center justify-between mt-8 relative">
                                        <div className="absolute left-0 right-0 h-[1px] bg-white/20 top-1/2 -translate-y-1/2 border-dashed border-t"></div>
                                        <div className="bg-white text-slate-900 w-2.5 h-2.5 rounded-full z-10 shadow-lg"></div>
                                        <div className="bg-white px-3 py-1 rounded-full text-[10px] font-black text-slate-900 z-10 shadow-md">
                                            {result.stops} STOPS
                                        </div>
                                        <div className="bg-white text-slate-900 w-2.5 h-2.5 rounded-full z-10 shadow-lg"></div>
                                    </div>

                                    <div className="flex justify-between mt-3 px-1">
                                        <p className="text-xs font-bold leading-tight max-w-[80px] text-left">{result.start}</p>
                                        <p className="text-xs font-bold leading-tight max-w-[80px] text-right">{result.end}</p>
                                    </div>
                                </div>

                                <div className="p-6 bg-white grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <CreditCard size={14} />
                                            <p className="text-[10px] font-bold uppercase tracking-wider">Estimated Fare</p>
                                        </div>
                                        <p className="text-2xl font-black text-slate-900">RM {result.fare.toFixed(2)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <Clock size={14} />
                                            <p className="text-[10px] font-bold uppercase tracking-wider">Estimated Time</p>
                                        </div>
                                        <p className="text-2xl font-black text-slate-900">{result.duration_min} <span className="text-sm">mins</span></p>
                                    </div>
                                </div>

                                <div className="px-6 pb-6 pt-2 grid grid-cols-2 gap-4 border-t border-slate-50 italic">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400">NEXT DEPARTURE</p>
                                        <p className="text-sm font-bold text-emerald-600">{result.departure_time}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400">EST. ARRIVAL</p>
                                        <p className="text-sm font-bold text-blue-600">{result.arrival_time}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 italic">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900">KTM Timetables</h3>
                                    <p className="text-xs text-slate-500">Live frequency & estimated times</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                KTM Komuter trains arrive approximately every <span className="font-bold text-slate-900">30-45 minutes</span> during peak hours.
                            </p>
                        </div>

                        {lines.filter(l => l.type === 'KTM').map(line => (
                            <div key={line.id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-8 rounded-full" style={{ backgroundColor: line.color_code }}></div>
                                        <h4 className="font-bold text-slate-800">{line.line_name}</h4>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">LIVE ESTIMATE</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-medium">Frequency (Peak)</span>
                                        <span className="font-bold text-slate-900">{line.frequency.peak}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-medium">Frequency (Off-Peak)</span>
                                        <span className="font-bold text-slate-900">{line.frequency.off_peak}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-medium">Operating Hours</span>
                                        <span className="font-bold text-slate-900">{line.operating_hours.start} - {line.operating_hours.end}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="p-4 bg-amber-50 rounded-2xl flex gap-3 text-amber-700">
                            <Info size={18} className="flex-shrink-0" />
                            <p className="text-xs font-medium leading-relaxed">
                                Schedules are estimates based on standard frequency. For real-time updates, please check the MyRailtime app or station display boards.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
