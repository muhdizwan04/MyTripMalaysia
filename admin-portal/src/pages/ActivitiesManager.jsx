import React, { useState, useEffect } from 'react';
import { getAttractions, createAttraction, updateAttraction, deleteAttraction, getDestinations, getShops, createShop, updateShop, deleteShop } from '../lib/api';
import { Trash2, Plus, AlertCircle, CheckCircle, Sparkles, X, Pencil, ImageIcon, Search, Filter, Store, ChevronRight, ArrowLeft } from 'lucide-react';
import { generateAttractionSuggestions } from '../lib/aiAssist';
import ImageUpload from '../components/ImageUpload';

export default function ActivitiesManager() {
    const [attractions, setAttractions] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    // Shop Management State (Nested View)
    const [selectedMall, setSelectedMall] = useState(null); // When not null, show shop directory
    const [shops, setShops] = useState([]);
    const [isShopModalOpen, setIsShopModalOpen] = useState(false);
    const [editingShopId, setEditingShopId] = useState(null);
    const [shopFormData, setShopFormData] = useState({
        name: '',
        category: 'Fashion',
        avgCost: 0,
        image_url: ''
    });

    // Feedback State
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        destinationId: '',
        type: 'Nature',
        latitude: '',
        longitude: '',
        suggested_duration: 60,
        avgCost: 0,
        price_level: 1,
        opening_hours: '',
        tags: [],
        isMall: false,
        isTrending: false,
        description: '',
        image_url: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [attrData, destData] = await Promise.all([
                getAttractions(),
                getDestinations()
            ]);
            setAttractions(attrData);
            setDestinations(destData);
        } catch (error) {
            console.error('Failed to load data:', error);
            setError('Failed to load data. Please check backend connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this attraction?')) {
            try {
                await deleteAttraction(id);
                setSuccess('Attraction deleted successfully.');
                setTimeout(() => setSuccess(''), 3000);
                loadData();
            } catch (error) {
                console.error('Failed to delete:', error);
                setError('Failed to delete attraction.');
                setTimeout(() => setError(''), 3000);
            }
        }
    };

    const handleEdit = (attraction) => {
        setFormData({
            name: attraction.name,
            destinationId: attraction.destinationId,
            type: attraction.type,
            latitude: attraction.latitude,
            longitude: attraction.longitude,
            suggested_duration: attraction.suggested_duration || attraction.avgDuration || 60,
            avgCost: attraction.price || 0,
            price_level: attraction.price_level || 1,
            opening_hours: attraction.opening_hours || '',
            tags: attraction.tags || [],
            isMall: attraction.is_mall || false,
            isTrending: attraction.is_trending || false,
            description: attraction.description || '',
            image_url: attraction.image_url || ''
        });
        setEditingId(attraction.id);
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: '', destinationId: '', type: 'Nature',
            latitude: '', longitude: '', suggested_duration: 60, avgCost: 0,
            price_level: 1, opening_hours: '', tags: [],
            isMall: false, isTrending: false, description: '', image_url: ''
        });
        setEditingId(null);
        setIsModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.name || !formData.destinationId || !formData.latitude || !formData.longitude) {
            setError('Please fill in all required fields.');
            return;
        }

        const payload = {
            name: formData.name,
            destinationId: formData.destinationId,
            type: formData.isMall ? 'Mall' : formData.type,
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
            description: formData.description,
            price: parseFloat(formData.avgCost),
            price_level: parseInt(formData.price_level),
            opening_hours: formData.opening_hours,
            tags: formData.tags,
            is_mall: formData.isMall,
            is_trending: formData.isTrending,
            image_url: formData.image_url,
            suggested_duration: parseInt(formData.suggested_duration)
        };

        try {
            if (editingId) {
                await updateAttraction(editingId, payload);
                setSuccess('Attraction updated successfully!');
            } else {
                await createAttraction(payload);
                setSuccess('Attraction created successfully!');
            }

            setTimeout(() => setSuccess(''), 3000);
            resetForm();
            loadData();
        } catch (err) {
            console.error('Failed to save:', err);
            setError(err.response?.data?.error || 'Error saving attraction.');
        }
    };

    // --- Shop Management Functions ---
    const handleManageShops = async (mall) => {
        setLoading(true);
        setSelectedMall(mall);
        try {
            const shopData = await getShops(mall.id);
            setShops(shopData);
        } catch (error) {
            console.error('Failed to load shops:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadShops = async (mallId) => {
        try {
            const shopData = await getShops(mallId);
            setShops(shopData);
        } catch (error) {
            console.error('Failed to load shops:', error);
        }
    };

    const handleShopSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...shopFormData, mallId: selectedMall.id };
            if (editingShopId) {
                await updateShop(editingShopId, payload);
            } else {
                await createShop(payload);
            }
            setIsShopModalOpen(false);
            resetShopForm();
            loadShops(selectedMall.id);
        } catch (error) {
            console.error('Failed to save shop:', error);
            alert('Error saving shop.');
        }
    };

    const resetShopForm = () => {
        setShopFormData({ name: '', category: 'Fashion', avgCost: 0, image_url: '' });
        setEditingShopId(null);
    };

    const handleEditShop = (shop) => {
        setShopFormData({
            name: shop.name,
            category: shop.category || 'Fashion',
            avgCost: shop.avgCost || 0,
            image_url: shop.image_url || ''
        });
        setEditingShopId(shop.id);
        setIsShopModalOpen(true);
    };

    const handleDeleteShop = async (id) => {
        if (window.confirm('Delete this shop?')) {
            try {
                await deleteShop(id);
                loadShops(selectedMall.id);
            } catch (error) {
                console.error('Failed to delete shop:', error);
            }
        }
    };

    const getDestinationName = (id) => {
        const dest = destinations.find(d => d.id === id);
        return dest ? dest.name : 'Unknown';
    };

    const filteredAttractions = attractions.filter(attr => {
        const matchesSearch = attr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            getDestinationName(attr.destinationId).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || attr.type === filterCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading && !selectedMall) return <div className="p-8 text-center font-bold text-slate-400">Loading Attractions...</div>;

    // --- RENDER SHOP DIRECTORY VIEW ---
    if (selectedMall) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSelectedMall(null)}
                            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{selectedMall.name} Directory</h2>
                            <p className="text-slate-500">Manage shops and outlets inside this mall.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { resetShopForm(); setIsShopModalOpen(true); }}
                        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add Shop
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Logo</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Shop Name</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Category</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Cost Level</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {shops.map((shop) => (
                                <tr key={shop.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                                            {shop.image_url ? (
                                                <img src={shop.image_url} alt={shop.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                    <ImageIcon size={16} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{shop.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-700">
                                            {shop.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-900 font-bold">RM {shop.avgCost}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleEditShop(shop)} className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Pencil size={18} />
                                            </button>
                                            <button onClick={() => handleDeleteShop(shop.id)} className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {shops.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                        <Store size={48} className="mx-auto mb-4 opacity-20" />
                                        <p className="font-medium text-lg text-slate-400">No shops listed yet.</p>
                                        <p className="text-sm">Start by adding the first shop to this mall.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Shop Modal */}
                {isShopModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">{editingShopId ? 'Edit Shop' : 'Add New Shop'}</h3>
                                <button onClick={() => setIsShopModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleShopSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                    <input
                                        type="text" required
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={shopFormData.name}
                                        onChange={e => setShopFormData({ ...shopFormData, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                        <select
                                            className="w-full px-3 py-2 border rounded-lg"
                                            value={shopFormData.category}
                                            onChange={e => setShopFormData({ ...shopFormData, category: e.target.value })}
                                        >
                                            <option value="Fashion">Fashion</option>
                                            <option value="Food">Food / Cafe</option>
                                            <option value="Entertainment">Entertainment</option>
                                            <option value="Electronics">Electronics</option>
                                            <option value="Services">Services</option>
                                            <option value="Beauty">Beauty / Spa</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Avg. Cost (RM)</label>
                                        <input
                                            type="number" min="0"
                                            className="w-full px-3 py-2 border rounded-lg"
                                            value={shopFormData.avgCost}
                                            onChange={e => setShopFormData({ ...shopFormData, avgCost: parseFloat(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <ImageUpload
                                    value={shopFormData.image_url}
                                    onChange={(url) => setShopFormData({ ...shopFormData, image_url: url })}
                                    label="Shop Logo / Image"
                                />

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                    <button type="button" onClick={() => setIsShopModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium whitespace-nowrap">
                                        {editingShopId ? 'Update Shop' : 'Create Shop'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // --- RENDER ATTRACTIONS LIST VIEW ---
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Activities Manager</h2>
                    <p className="text-slate-500">Manage tourist spots, landmarks, and parks.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Activity
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 text-green-600 p-3 rounded-lg flex items-center gap-2">
                    <CheckCircle size={18} />
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-slate-200">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or destination..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-slate-400" size={18} />
                    <select
                        className="flex-1 border rounded-xl px-4 py-2 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={filterCategory}
                        onChange={e => setFilterCategory(e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        <option value="Nature">Nature</option>
                        <option value="Landmark">Landmark</option>
                        <option value="Food">Food / Dining</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Culture">Culture / Heritage</option>
                        <option value="Theme Park">Theme Park</option>
                        <option value="Zoo">Zoo / Aquarium</option>
                        <option value="Mall">Shopping Mall</option>
                        <option value="Activity">Activity / Sports</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Image</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Name</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm whitespace-nowrap">Destination</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Price</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredAttractions.map((attr) => (
                            <tr key={attr.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                                        {attr.image_url ? (
                                            <img src={attr.image_url} alt={attr.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <ImageIcon size={20} />
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-slate-900">{attr.name}</span>
                                        {attr.is_mall && (
                                            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-700">MALL</span>
                                        )}
                                        {attr.is_trending && (
                                            <Sparkles size={14} className="text-amber-500" />
                                        )}
                                    </div>
                                    <div className="text-xs text-slate-500 max-w-xs truncate">{attr.description}</div>
                                </td>
                                <td className="px-6 py-4 text-slate-600 text-sm">{getDestinationName(attr.destinationId)}</td>
                                <td className="px-6 py-4 text-slate-900 text-sm font-medium">
                                    {attr.price === 0 ? 'Free' : `RM ${attr.price}`}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {attr.is_mall && (
                                            <button
                                                onClick={() => handleManageShops(attr)}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                                            >
                                                <Store size={14} />
                                                Directory <ChevronRight size={14} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleEdit(attr)}
                                            className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(attr.id)}
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
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl my-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">{editingId ? 'Edit Activity' : 'Add New Activity'}</h3>
                            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>

                        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                                    <input
                                        type="text" required
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Destination *</label>
                                    <select
                                        required
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={formData.destinationId}
                                        onChange={e => setFormData({ ...formData, destinationId: e.target.value })}
                                    >
                                        <option value="">Select...</option>
                                        {destinations.map(d => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Type *</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        disabled={formData.isMall}
                                    >
                                        <option value="Nature">Nature</option>
                                        <option value="Landmark">Landmark</option>
                                        <option value="Food">Food / Dining</option>
                                        <option value="Entertainment">Entertainment</option>
                                        <option value="Culture">Culture / Heritage</option>
                                        <option value="Theme Park">Theme Park</option>
                                        <option value="Zoo">Zoo / Aquarium</option>
                                        <option value="Mall">Shopping Mall</option>
                                        <option value="Activity">Activity / Sports</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Entrance Fee (RM)</label>
                                    <input
                                        type="number" min="0"
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={formData.avgCost}
                                        onChange={e => setFormData({ ...formData, avgCost: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Latitude *</label>
                                    <input
                                        type="number" step="any" required
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={formData.latitude}
                                        onChange={e => setFormData({ ...formData, latitude: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Longitude *</label>
                                    <input
                                        type="number" step="any" required
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={formData.longitude}
                                        onChange={e => setFormData({ ...formData, longitude: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Mins)</label>
                                    <input
                                        type="number" min="1"
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={formData.suggested_duration}
                                        onChange={e => setFormData({ ...formData, suggested_duration: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Price Level (1-5)</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={formData.price_level}
                                        onChange={e => setFormData({ ...formData, price_level: e.target.value })}
                                    >
                                        {[1, 2, 3, 4, 5].map(lvl => (
                                            <option key={lvl} value={lvl}>{lvl} - {lvl === 1 ? 'Cheap' : lvl === 5 ? 'Luxury' : 'Moderate'}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Opening Hours</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 09:00 - 18:00"
                                    className="w-full px-3 py-2 border rounded-lg"
                                    value={formData.opening_hours}
                                    onChange={e => setFormData({ ...formData, opening_hours: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tags (Multiple)</label>
                                <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                                    {["nature", "family_friendly", "viral_spot", "halal_food", "landmark", "luxury", "cultural", "local_food", "theme_park", "street_food", "nightlife", "photography", "adventure", "heritage", "educational"].map(tag => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => {
                                                const newTags = formData.tags.includes(tag)
                                                    ? formData.tags.filter(t => t !== tag)
                                                    : [...formData.tags, tag];
                                                setFormData({ ...formData, tags: newTags });
                                            }}
                                            className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight transition-colors ${formData.tags.includes(tag)
                                                    ? "bg-primary text-white shadow-sm"
                                                    : "bg-white text-slate-400 border border-slate-200 hover:border-slate-300"
                                                }`}
                                        >
                                            {tag.replace('_', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded"
                                        checked={formData.isMall}
                                        onChange={e => {
                                            const checked = e.target.checked;
                                            setFormData({
                                                ...formData,
                                                isMall: checked,
                                                type: checked ? 'Mall' : 'Nature'
                                            });
                                        }}
                                    />
                                    <span className="text-sm font-medium text-slate-700">Is a Shopping Mall?</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded"
                                        checked={formData.isTrending}
                                        onChange={e => setFormData({ ...formData, isTrending: e.target.checked })}
                                    />
                                    <span className="text-sm font-medium text-slate-700">Is Trending?</span>
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    className="w-full px-3 py-2 border rounded-lg"
                                    rows="1"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <ImageUpload
                                value={formData.image_url}
                                onChange={(url) => setFormData({ ...formData, image_url: url })}
                                label="Activity Image"
                            />

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={resetForm} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium whitespace-nowrap">
                                    {editingId ? 'Update Activity' : 'Create Activity'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
