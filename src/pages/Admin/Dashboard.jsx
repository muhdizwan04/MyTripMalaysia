import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, RefreshCw, ShoppingBag, Map, Hotel, Activity } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';
import { ImageUpload } from '../../components/admin/ImageUpload';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('attractions');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [data, setData] = useState({
        attractions: [],
        destinations: [],
        hotels: []
    });

    const [formData, setFormData] = useState({
        attractions: { name: '', type: 'Food', image_url: '', location: '', rating: 4.5, price: 0 },
        destinations: { name: '', description: '', image_url: '', lat: 3.1390, lng: 101.6869 },
        hotels: { name: '', type: 'Luxury', image_url: '', location: '', rating: 4.5, price: 0 }
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [attrRes, destRes, hotelRes] = await Promise.all([
                api.get('/attractions'),
                api.get('/destinations'),
                api.get('/hotels')
            ]);
            setData({
                attractions: attrRes.data,
                destinations: destRes.data,
                hotels: hotelRes.data
            });
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const currentForm = formData[activeTab];

        if (!currentForm.name?.trim()) {
            alert('Please enter name');
            return;
        }

        try {
            setSubmitting(true);
            await api.post(`/${activeTab}`, currentForm);

            // Reset form
            setFormData({
                ...formData,
                [activeTab]: activeTab === 'attractions'
                    ? { name: '', type: 'Food', image_url: '', location: '', rating: 4.5, price: 0 }
                    : activeTab === 'destinations'
                        ? { name: '', description: '', image_url: '', lat: 3.1390, lng: 101.6869 }
                        : { name: '', type: 'Luxury', image_url: '', location: '', rating: 4.5, price: 0 }
            });

            await fetchData();
            alert(`${activeTab.slice(0, -1)} added successfully!`);
        } catch (error) {
            console.error(`Failed to create ${activeTab}:`, error);
            alert(`Failed: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id, name, type) => {
        if (!window.confirm(`Delete "${name}"?`)) return;
        try {
            await api.delete(`/${type}/${id}`);
            await fetchData();
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const tabs = [
        { id: 'attractions', label: 'Attractions', icon: Activity },
        { id: 'destinations', label: 'Destinations', icon: Map },
        { id: 'hotels', label: 'Hotels', icon: Hotel }
    ];

    return (
        <div className="min-h-screen bg-batik pb-24">
            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-5 w-5" />
                            <span className="text-sm font-bold">Back to Home</span>
                        </button>
                        <h1 className="text-3xl font-black tracking-tight">Admin Portal</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/admin/malls')} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl shadow-md">
                            <ShoppingBag className="h-4 w-4" />
                            <span className="text-sm font-bold">Manage Malls</span>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 bg-white/50 p-2 rounded-2xl border-2 border-white w-fit">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-white'}`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Form Section */}
                <Card className="mb-8 border-2 border-primary/20 rounded-3xl overflow-hidden">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black">Add New {activeTab.slice(0, -1)}</h2>
                            <button onClick={fetchData} className="p-2 hover:bg-muted/10 rounded-xl transition-colors">
                                <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2 px-2">Name *</label>
                                    <input
                                        type="text"
                                        value={formData[activeTab].name}
                                        onChange={e => setFormData({ ...formData, [activeTab]: { ...formData[activeTab], name: e.target.value } })}
                                        className="w-full px-5 py-3 rounded-2xl border-2 border-muted focus:border-primary outline-none font-bold"
                                        placeholder={`e.g. ${activeTab === 'hotels' ? 'Grand Hyatt' : 'KL Tower'}`}
                                        required
                                    />
                                </div>

                                {activeTab === 'attractions' && (
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2 px-2">Type</label>
                                        <select
                                            value={formData.attractions.type}
                                            onChange={e => setFormData({ ...formData, attractions: { ...formData.attractions, type: e.target.value } })}
                                            className="w-full px-5 py-3 rounded-2xl border-2 border-muted focus:border-primary outline-none font-bold"
                                        >
                                            <option>Food</option>
                                            <option>Landmark</option>
                                            <option>Nature</option>
                                            <option>Mall</option>
                                        </select>
                                    </div>
                                )}

                                {activeTab === 'hotels' && (
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2 px-2">Hotel Type</label>
                                        <select
                                            value={formData.hotels.type}
                                            onChange={e => setFormData({ ...formData, hotels: { ...formData.hotels, type: e.target.value } })}
                                            className="w-full px-5 py-3 rounded-2xl border-2 border-muted focus:border-primary outline-none font-bold"
                                        >
                                            <option>Luxury</option>
                                            <option>Budget</option>
                                            <option>Airbnb</option>
                                            <option>Resort</option>
                                        </select>
                                    </div>
                                )}

                                {activeTab !== 'destinations' && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2 px-2">Location</label>
                                            <input
                                                type="text"
                                                value={formData[activeTab].location}
                                                onChange={e => setFormData({ ...formData, [activeTab]: { ...formData[activeTab], location: e.target.value } })}
                                                className="w-full px-5 py-3 rounded-2xl border-2 border-muted focus:border-primary outline-none font-bold"
                                                placeholder="Kuala Lumpur"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2 px-2">Price (RM)</label>
                                            <input
                                                type="number"
                                                value={formData[activeTab].price}
                                                onChange={e => setFormData({ ...formData, [activeTab]: { ...formData[activeTab], price: parseFloat(e.target.value) } })}
                                                className="w-full px-5 py-3 rounded-2xl border-2 border-muted focus:border-primary outline-none font-bold"
                                            />
                                        </div>
                                    </>
                                )}

                                {activeTab === 'destinations' && (
                                    <div className="col-span-2">
                                        <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2 px-2">Description</label>
                                        <textarea
                                            value={formData.destinations.description}
                                            onChange={e => setFormData({ ...formData, destinations: { ...formData.destinations, description: e.target.value } })}
                                            className="w-full px-5 py-3 rounded-2xl border-2 border-muted focus:border-primary outline-none font-bold h-24"
                                            placeholder="Tell us about this state..."
                                        />
                                    </div>
                                )}

                                {activeTab === 'social-posts' && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2 px-2">Author Name *</label>
                                            <input
                                                type="text"
                                                value={formData[activeTab].author_name}
                                                onChange={e => setFormData({ ...formData, [activeTab]: { ...formData[activeTab], author_name: e.target.value } })}
                                                className="w-full px-5 py-3 rounded-2xl border-2 border-muted focus:border-primary outline-none font-bold"
                                                placeholder="Sarah Tan"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2 px-2">Location Name</label>
                                            <input
                                                type="text"
                                                value={formData[activeTab].location_name}
                                                onChange={e => setFormData({ ...formData, [activeTab]: { ...formData[activeTab], location_name: e.target.value } })}
                                                className="w-full px-5 py-3 rounded-2xl border-2 border-muted focus:border-primary outline-none font-bold"
                                                placeholder="Pavilion KL"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2 px-2">Caption</label>
                                            <textarea
                                                value={formData[activeTab].caption}
                                                onChange={e => setFormData({ ...formData, [activeTab]: { ...formData[activeTab], caption: e.target.value } })}
                                                className="w-full px-5 py-3 rounded-2xl border-2 border-muted focus:border-primary outline-none font-bold h-24"
                                                placeholder="Share your experience..."
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="col-span-1 md:col-span-2">
                                    <ImageUpload
                                        value={formData[activeTab].image_url}
                                        onChange={url => setFormData({ ...formData, [activeTab]: { ...formData[activeTab], image_url: url } })}
                                        label={`${tabLabelMap[activeTab] || 'Post'} Image`}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-primary text-white rounded-2xl py-4 font-black mt-2 shadow-lg shadow-primary/20"
                            >
                                {submitting ? 'Processing...' : `Save ${activeTab === 'social-posts' ? 'Post' : activeTab.slice(0, -1)}`}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* List Section */}
                <Card className="border-2 border-white/50 rounded-3xl overflow-hidden">
                    <CardContent className="p-0">
                        <div className="p-8 border-b border-muted/10 flex items-center justify-between">
                            <h2 className="text-xl font-black">All {activeTab === 'social-posts' ? 'Posts' : activeTab} ({data[activeTab]?.length || 0})</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/5">
                                    <tr>
                                        <th className="text-left p-6 font-black text-xs uppercase tracking-wider">Preview</th>
                                        <th className="text-left p-6 font-black text-xs uppercase tracking-wider">Name / Author</th>
                                        <th className="text-left p-6 font-black text-xs uppercase tracking-wider">Detail</th>
                                        <th className="text-right p-6 font-black text-xs uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data[activeTab].map(item => (
                                        <tr key={item.id} className="border-b border-muted/5 group hover:bg-muted/5 transition-colors">
                                            <td className="p-6">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-sm shrink-0">
                                                    <img src={item.image_url || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=200'} className="w-full h-full object-cover" />
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <p className="font-black text-sm">{item.name || item.author_name}</p>
                                                <p className="text-[10px] font-bold text-muted-foreground">{item.location || item.type || item.location_name || 'N/A'}</p>
                                            </td>
                                            <td className="p-6 text-xs font-bold text-muted-foreground">
                                                {item.price ? `RM ${item.price}` : (item.description || item.caption)?.substring(0, 40) + '...' || '-'}
                                            </td>
                                            <td className="p-6 text-right">
                                                <button
                                                    onClick={() => handleDelete(item.id, item.name || item.author_name, activeTab)}
                                                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

const tabLabelMap = {
    attractions: 'Attraction',
    destinations: 'Destination',
    hotels: 'Hotel',
    'social-posts': 'Community Post'
};
