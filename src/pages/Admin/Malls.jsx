import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, RefreshCw, ShoppingBag, X } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';
import { ImageUpload } from '../../components/admin/ImageUpload';

export default function AdminMalls() {
    const navigate = useNavigate();
    const [malls, setMalls] = useState([]);
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedMall, setSelectedMall] = useState(null);
    const [showShopModal, setShowShopModal] = useState(false);

    const [shopFormData, setShopFormData] = useState({
        name: '',
        category: 'Fashion',
        floor: '',
        image_url: ''
    });

    // Fetch only malls
    const fetchMalls = async () => {
        try {
            setLoading(true);
            const response = await api.get('/attractions', { params: { type: 'Mall' } });
            setMalls(response.data);
        } catch (error) {
            console.error('Failed to fetch malls:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch shops for a mall
    const fetchShops = async (mallId) => {
        try {
            const response = await api.get('/shops', { params: { mall_id: mallId } });
            setShops(response.data);
        } catch (error) {
            console.error('Failed to fetch shops:', error);
        }
    };

    useEffect(() => {
        fetchMalls();
    }, []);

    const handleManageShops = (mall) => {
        setSelectedMall(mall);
        fetchShops(mall.id);
        setShowShopModal(true);
    };

    const handleAddShop = async (e) => {
        e.preventDefault();
        if (!shopFormData.name.trim()) return;

        try {
            setSubmitting(true);
            await api.post('/shops', {
                ...shopFormData,
                mall_id: selectedMall.id
            });
            // Reset and refresh
            setShopFormData({ name: '', category: 'Fashion', floor: '', image_url: '' });
            await fetchShops(selectedMall.id);
            alert('Shop added successfully!');
        } catch (error) {
            console.error('Failed to add shop:', error);
            alert('Failed to add shop: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteShop = async (shopId) => {
        if (!window.confirm('Delete this shop?')) return;
        try {
            await api.delete(`/shops/${shopId}`);
            await fetchShops(selectedMall.id);
        } catch (error) {
            console.error('Failed to delete shop:', error);
        }
    };

    return (
        <div className="min-h-screen bg-batik pb-24">
            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin')}
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span className="text-sm font-bold">Back to Dashboard</span>
                        </button>
                        <h1 className="text-3xl font-black tracking-tight">Mall Management</h1>
                    </div>
                </div>

                {/* Malls List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full text-center py-20">
                            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                            <p className="text-sm text-muted-foreground font-bold">Loading malls...</p>
                        </div>
                    ) : (
                        malls.map(mall => (
                            <Card key={mall.id} className="overflow-hidden border-2 border-white/50 hover:shadow-xl transition-all rounded-[32px]">
                                <div className="h-32 bg-gray-100 relative group overflow-hidden">
                                    <img src={mall.image_url} alt={mall.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/20" />
                                </div>
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-black mb-1">{mall.name}</h3>
                                    <p className="text-xs text-muted-foreground font-bold mb-4">{mall.location}</p>
                                    <Button
                                        onClick={() => handleManageShops(mall)}
                                        className="w-full bg-primary text-white rounded-xl py-3 font-black flex items-center justify-center gap-2"
                                    >
                                        <ShoppingBag size={18} />
                                        Manage Shops
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Shop Management Modal */}
                {showShopModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                            <div className="p-8 border-b border-muted/20 flex items-center justify-between bg-batik relative overflow-hidden">
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight">{selectedMall?.name}</h2>
                                    <p className="text-sm text-muted-foreground font-bold">Manage Boutique & Stores</p>
                                </div>
                                <button onClick={() => setShowShopModal(false)} className="p-3 hover:bg-white/50 rounded-2xl transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                                {/* Add Shop Form */}
                                <div className="bg-muted/5 p-6 rounded-[32px] border-2 border-primary/10">
                                    <h3 className="text-lg font-black mb-4">Add New Shop</h3>
                                    <form onSubmit={handleAddShop} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground px-2">Shop Name</label>
                                                <input
                                                    type="text"
                                                    value={shopFormData.name}
                                                    onChange={e => setShopFormData({ ...shopFormData, name: e.target.value })}
                                                    className="w-full px-5 py-3 rounded-2xl border-2 border-muted focus:border-primary outline-none font-bold"
                                                    placeholder="e.g. Zara"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground px-2">Category</label>
                                                <select
                                                    value={shopFormData.category}
                                                    onChange={e => setShopFormData({ ...shopFormData, category: e.target.value })}
                                                    className="w-full px-5 py-3 rounded-2xl border-2 border-muted focus:border-primary outline-none font-bold"
                                                >
                                                    <option>Fashion</option>
                                                    <option>Food</option>
                                                    <option>Tech</option>
                                                    <option>Beauty</option>
                                                    <option>Entertainment</option>
                                                    <option>Departmental</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground px-2">Floor</label>
                                                <input
                                                    type="text"
                                                    value={shopFormData.floor}
                                                    onChange={e => setShopFormData({ ...shopFormData, floor: e.target.value })}
                                                    className="w-full px-5 py-3 rounded-2xl border-2 border-muted focus:border-primary outline-none font-bold"
                                                    placeholder="Level 3"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <ImageUpload
                                                    value={shopFormData.image_url}
                                                    onChange={url => setShopFormData({ ...shopFormData, image_url: url })}
                                                    label="Shop Image"
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full bg-primary text-white rounded-2xl py-4 font-black mt-2 shadow-lg shadow-primary/20"
                                        >
                                            {submitting ? 'Saving...' : 'Add Shop to Mall'}
                                        </Button>
                                    </form>
                                </div>

                                {/* Shops List */}
                                <div>
                                    <h3 className="text-lg font-black mb-4">Current Shops ({shops.length})</h3>
                                    <div className="space-y-3">
                                        {shops.length === 0 ? (
                                            <p className="text-center py-10 text-muted-foreground font-bold">No shops linked to this mall yet.</p>
                                        ) : (
                                            shops.map(shop => (
                                                <div key={shop.id} className="flex items-center justify-between p-4 bg-muted/5 rounded-2xl border-2 border-white/50 group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                                                            <img src={shop.image_url || "https://images.unsplash.com/photo-1519500099198-c185fba3b7e5?q=80&w=200"} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-black text-sm">{shop.name}</h4>
                                                            <p className="text-[10px] font-bold text-muted-foreground">{shop.category} • {shop.floor || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteShop(shop.id)}
                                                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
