import React, { useState, useEffect } from 'react';
import { Hotel, MapPin, Utensils, Users, Search, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../lib/api';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDestinations: 0,
        totalAttractions: 0,
        totalHotels: 0,
    });
    const [chartData, setChartData] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Adjust endpoint if needed; assumes specific admin route or consolidated stats
                // The user requested GET /api/admin/dashboard-stats
                const res = await api.get('/admin/dashboard-stats');
                const data = res.data;

                setStats(data.counts);
                setChartData(data.charts.attractionsPerState);
                setRecentActivity(data.recentActivity);
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statCards = [
        { name: 'Total Hotels', value: stats.totalHotels, icon: Hotel, color: 'text-blue-600', bg: 'bg-blue-100' },
        { name: 'Total Attractions', value: stats.totalAttractions, icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { name: 'Total Destinations', value: stats.totalDestinations, icon: Utensils, color: 'text-orange-600', bg: 'bg-orange-100' },
        { name: 'Total Users', value: stats.totalUsers, icon: Search, color: 'text-purple-600', bg: 'bg-purple-100' },
    ];

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Welcome back, Admin</h2>
                <p className="text-slate-500">Here's what's happening with MyMalaysiaTrip today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <div key={stat.name} className="bg-surface p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                            </div>
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-surface p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-slate-900">Attractions Per State</h3>
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">Overall Distribution</span>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 10 }}
                                    interval={0}
                                    angle={-45}
                                    textAnchor="end"
                                />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-surface p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-slate-900">Recently Added</h3>
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Newest 5</span>
                    </div>
                    <div className="space-y-4">
                        {recentActivity.length > 0 ? recentActivity.map((item, idx) => (
                            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                                <div className="flex items-center space-x-3">
                                    <span className="text-xs font-bold text-slate-400">#0{idx + 1}</span>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">{item.name}</p>
                                        <p className="text-xs text-slate-400">{item.state}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-emerald-600">New</span>
                            </div>
                        )) : (
                            <p className="text-sm text-slate-500 text-center py-4">No recent activity found.</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
