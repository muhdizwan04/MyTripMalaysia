import React, { useState, useEffect } from 'react';
import { api, getDestinations } from '../lib/api';
import { Trash2, Plus, Hotel, MapPin, ImageIcon, Star, Pencil, X, Search } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';

export default function HotelsManager() {
    const [hotels, setHotels] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    const [formData, setFormData] = useState({
        name: '',
        location: '',
        type: 'Hotel',
        rating: 4.5,
        price: 0,
        image_url: '',
        latitude: '',
        longitude: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [hotelRes, destData] = await Promise.all([
                api.get('/hotels'),
                getDestinations()
            ]);
            setHotels(hotelRes.data);
            setDestinations(destData);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this hotel?')) {
            try {
                await api.delete(`/hotels/${id}`);
                loadData();
            } catch (error) {
                console.error('Failed to delete:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/hotels/${editingId}`, formData);
            } else {
                await api.post('/hotels', formData);
            }
            resetForm();
            loadData();
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Error saving hotel');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '', location: '', type: 'Hotel', rating: 4.5, price: 0, image_url: '', latitude: '', longitude: ''
        });
        setEditingId(null);
        setIsModalOpen(false);
    };

    const handleEdit = (hotel) => {
        setFormData({
            name: hotel.name,
            location: hotel.location,
            type: hotel.type || 'Hotel',
            rating: hotel.rating || 4.5,
            price: hotel.price || 0,
            image_url: hotel.image_url || '',
            latitude: hotel.latitude || '',
            longitude: hotel.longitude || ''
        });
        setEditingId(hotel.id);
        setIsModalOpen(true);
    };

    const filteredHotels = hotels.filter(hotel => {
        const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || hotel.type === filterType;
        return matchesSearch && matchesType;
    });

    if (loading) return <div className="p-8 text-center font-bold">Loading Hotels...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Hotels Manager</h2>
                    <p className="text-slate-500">Manage accommodation listings across Malaysia.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Hotel
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search hotels or locations..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-500">Type:</span>
                    <select
                        className="border rounded-xl px-4 py-2 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                    >
                        <option value="All">All Types</option>
                        <option value="Hotel">Hotel</option>
                        <option value="Airbnb">Airbnb</option>
                        <option value="Homestay">Homestay</option>
                    </select>
                </div>
            </div>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Image</th>
                        <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Name</th>
                        <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Location</th>
                        <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Type</th>
                        <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Price</th>
                        <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredHotels.map((hotel) => (
                        <tr key={hotel.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                                    {hotel.image_url ? (
                                        <img src={hotel.image_url} alt={hotel.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            <ImageIcon size={20} />
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <p className="font-medium text-slate-900">{hotel.name}</p>
                                <div className="flex items-center gap-1 text-amber-500">
                                    <Star size={10} fill="currentColor" />
                                    <span className="text-[10px] font-bold">{hotel.rating}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                                <span className="flex items-center gap-1">
                                    <MapPin size={14} className="text-slate-400" />
                                    {hotel.location}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
                                    {hotel.type}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-slate-900 font-bold">RM {hotel.price}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => handleEdit(hotel)}
                                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(hotel.id)}
                                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl my-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">{editingId ? 'Edit Hotel' : 'Add New Hotel'}</h3>
                            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                    <input
                                        type="text" required
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                    <input
                                        type="text" required
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={formData.location}
                                        placeholder="e.g. Kuala Lumpur"
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-lg font-bold"
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="Hotel">Hotel</option>
                                        <option value="Airbnb">Airbnb</option>
                                        <option value="Homestay">Homestay</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
                                    <input
                                        type="number" step="0.1" min="0" max="5"
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={formData.rating}
                                        onChange={e => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Price (RM)</label>
                                    <input
                                        type="number" min="0"
                                        className="w-full px-3 py-2 border rounded-lg font-bold"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Latitude</label>
                                    <input
                                        type="number" step="any" required
                                        className="w-full px-3 py-2 border rounded-lg font-mono text-xs"
                                        value={formData.latitude}
                                        placeholder="e.g. 3.1390"
                                        onChange={e => setFormData({ ...formData, latitude: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Longitude</label>
                                    <input
                                        type="number" step="any" required
                                        className="w-full px-3 py-2 border rounded-lg font-mono text-xs"
                                        value={formData.longitude}
                                        placeholder="e.g. 101.6869"
                                        onChange={e => setFormData({ ...formData, longitude: e.target.value })}
                                    />
                                </div>
                            </div>

                            <ImageUpload
                                value={formData.image_url}
                                onChange={(url) => setFormData({ ...formData, image_url: url })}
                                label="Hotel Cover Image"
                            />

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={resetForm} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium">
                                    {editingId ? 'Update Hotel' : 'Create Hotel'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

