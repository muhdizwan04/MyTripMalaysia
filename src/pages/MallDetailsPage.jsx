import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Clock, Tag, Star, X, Layers } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { fetchShops, fetchAttractionById } from '../lib/api';

// Shop Details Modal
const ShopModal = ({ shop, onClose }) => {
    if (!shop) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="relative h-56">
                    <img
                        src={shop.image_url || shop.image || "https://images.unsplash.com/photo-1519500099198-c185fba3b7e5?auto=format&fit=crop&w=500&q=80"}
                        alt={shop.name}
                        className="w-full h-full object-cover"
                    />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors backdrop-blur-md"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] px-2 py-1 bg-primary/10 text-primary rounded-full font-bold uppercase tracking-wider">{shop.category}</span>
                        <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="text-xs font-black">{shop.rating || '4.5'}</span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-black mb-1">{shop.name}</h2>
                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                        <Layers className="h-4 w-4 text-primary" />
                        <span className="text-sm font-bold">Level: {shop.floor || 'N/A'}</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                        {shop.description || `Visit ${shop.name} for the best ${shop.category.toLowerCase()} experience. Located at ${shop.floor}.`}
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-3 rounded-2xl">
                            <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Opening Hours</span>
                            <span className="text-xs font-bold text-gray-800">10:00 AM - 10:00 PM</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-2xl">
                            <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Contact</span>
                            <span className="text-xs font-bold text-gray-800">+60 3-1234 5678</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function MallDetailsPage() {
    const navigate = useNavigate();
    const { mallId } = useParams();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedFloor, setSelectedFloor] = useState('all');

    const [mallInfo, setMallInfo] = useState(location.state?.mall || null);
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedShop, setSelectedShop] = useState(null);

    // Fetch mall and shops on mount
    useEffect(() => {
        const loadPageData = async () => {
            console.log('MallDetailsPage: Loading data for mallId:', mallId);
            try {
                setLoading(true);

                // Fetch Mall Details if not in state
                const mallPromise = !mallInfo ? fetchAttractionById(mallId) : Promise.resolve(mallInfo);

                // Fetch Shops
                const shopsPromise = fetchShops(mallId);

                const [mallData, shopsData] = await Promise.all([mallPromise, shopsPromise]);

                console.log(`MallDetailsPage: Fetched mall:`, mallData);
                console.log(`MallDetailsPage: Fetched ${shopsData.length} shops:`, shopsData);

                setMallInfo(mallData);
                setShops(shopsData);
            } catch (error) {
                console.error('MallDetailsPage: Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadPageData();
    }, [mallId, mallInfo]);

    // Group shops by category
    const groupedShops = shops.reduce((acc, shop) => {
        const category = shop.category || 'Other';
        const floor = shop.floor || 'Other';

        if (!acc[category]) acc[category] = [];

        // Apply filters
        const matchesSearch = !searchQuery.trim() ||
            shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
        const matchesFloor = selectedFloor === 'all' || floor === selectedFloor;

        if (matchesSearch && matchesCategory && matchesFloor) {
            acc[category].push(shop);
        }
        return acc;
    }, {});

    // Get unique categories and floors for filters
    const categoriesList = ['all', ...new Set(shops.map(shop => shop.category || 'Other'))];
    const floorsList = ['all', ...new Set(shops.map(shop => shop.floor || 'Other'))];

    const sortedCategories = Object.keys(groupedShops).sort();

    return (
        <div className="min-h-screen bg-batik pb-24">
            <div className="max-w-md mx-auto px-6 py-10">
                {/* Header */}
                <div className="mb-8">
                    <button onClick={() => navigate('/shopping')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="text-sm font-bold">Back to Shopping</span>
                    </button>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">{mallInfo?.name || "Shopping Mall"}</h1>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm font-medium">{mallInfo?.location || mallInfo?.state || "Unknown Location"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm font-medium">{mallInfo?.hours || "10 AM - 10 PM"}</span>
                        </div>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="mb-6 space-y-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search shops..."
                            className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-muted/50 focus:border-primary outline-none font-bold text-sm bg-white"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="text-sm font-black px-4 py-3 rounded-2xl border-2 border-muted/50 bg-white outline-none">
                            {categoriesList.map(cat => (
                                <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                            ))}
                        </select>

                        <select value={selectedFloor} onChange={(e) => setSelectedFloor(e.target.value)} className="text-sm font-black px-4 py-3 rounded-2xl border-2 border-muted/50 bg-white outline-none">
                            {floorsList.map(floor => (
                                <option key={floor} value={floor}>{floor === 'all' ? 'All Floors' : floor}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Shop Results Grouped by Category */}
                <div className="space-y-8">
                    {sortedCategories.length > 0 ? (
                        sortedCategories.map(category => (
                            groupedShops[category].length > 0 && (
                                <div key={category} className="space-y-4">
                                    <h3 className="text-xl font-black flex items-center gap-2 px-2 text-primary">
                                        <Tag size={20} />
                                        {category}
                                    </h3>
                                    <div className="space-y-4">
                                        {groupedShops[category].map((shop) => (
                                            <Card
                                                key={shop.id}
                                                onClick={() => setSelectedShop(shop)}
                                                className="overflow-hidden cursor-pointer group border-2 border-white/50 hover:shadow-xl transition-all rounded-[28px]"
                                            >
                                                <CardContent className="p-0">
                                                    <div className="flex gap-4">
                                                        <div className="w-28 h-28 shrink-0 relative overflow-hidden">
                                                            <img src={shop.image_url || shop.image || "https://images.unsplash.com/photo-1519500099198-c185fba3b7e5?auto=format&fit=crop&w=500&q=80"} alt={shop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        </div>
                                                        <div className="flex-1 py-3 pr-4">
                                                            <h4 className="font-black text-sm mb-1">{shop.name}</h4>
                                                            <div className="flex items-center gap-1 mb-2">
                                                                <Layers className="h-3 w-3 text-primary" />
                                                                <span className="text-[10px] font-bold text-muted-foreground">Level: {shop.floor || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex items-center gap-1">
                                                                    <Tag className="h-3 w-3 text-primary" />
                                                                    <span className="text-[10px] px-2 py-1 bg-primary/10 text-primary rounded-full font-bold">{shop.category}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )
                        ))
                    ) : (
                        <div className="text-center py-20 bg-muted/10 rounded-3xl">
                            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                            <p className="text-muted-foreground font-bold">No shops found</p>
                            <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {selectedShop && (
                <ShopModal shop={selectedShop} onClose={() => setSelectedShop(null)} />
            )}
        </div>
    );
}
