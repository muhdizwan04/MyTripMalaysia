import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Clock, Tag } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

// Mock data - user will populate later
const MALL_DATA = {
    1: {
        name: "Pavilion KL",
        location: "Bukit Bintang, Kuala Lumpur",
        hours: "10 AM - 10 PM",
        shops: [
            { id: 1, name: "Zara", floor: "Ground Floor", category: "Fashion", image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=500&q=80" },
            { id: 2, name: "Uniqlo", floor: "Level 1", category: "Fashion", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=500&q=80" },
            { id: 3, name: "Apple Store", floor: "Level 2", category: "Electronics", image: "https://images.unsplash.com/photo-1621768216002-5ac171876625?auto=format&fit=crop&w=500&q=80" },
            { id: 4, name: "Sephora", floor: "Ground Floor", category: "Beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80" },
            { id: 5, name: "Din Tai Fung", floor: "Level 6", category: "Restaurant", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80" },
            { id: 6, name: "Popular Bookstore", floor: "Level 3", category: "Books", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80" },
            { id: 7, name: "Cotton On", floor: "Level 1", category: "Fashion", image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=500&q=80" },
            { id: 8, name: "Samsung Store", floor: "Level 2", category: "Electronics", image: "https://images.unsplash.com/photo-1610457167756-ad4b6b15d9a8?auto=format&fit=crop&w=500&q=80" },
        ]
    },
    2: {
        name: "Sunway Pyramid",
        location: "Subang Jaya, Selangor",
        hours: "10 AM - 10 PM",
        shops: [
            { id: 1, name: "H&M", floor: "Ground Floor", category: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=500&q=80" },
            { id: 2, name: "Starbucks", floor: "Lower Ground", category: "Cafe", image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbd?auto=format&fit=crop&w=500&q=80" },
            { id: 3, name: "Guardian", floor: "Level 1", category: "Health", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=500&q=80" },
            { id: 4, name: "Toys R Us", floor: "Level 2", category: "Toys", image: "https://images.unsplash.com/photo-1560628861-dcf7b8d8c58f?auto=format&fit=crop&w=500&q=80" },
        ]
    },
    // Default for other malls
    default: {
        name: "Shopping Mall",
        location: "Malaysia",
        hours: "10 AM - 10 PM",
        shops: [
            { id: 1, name: "Shop 1", floor: "Ground Floor", category: "Fashion", image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=500&q=80" },
            { id: 2, name: "Shop 2", floor: "Level 1", category: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=500&q=80" },
            { id: 3, name: "Shop 3", floor: "Level 2", category: "Restaurant", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=80" },
        ]
    }
};

export default function MallDetailsPage() {
    const navigate = useNavigate();
    const { mallId } = useParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedFloor, setSelectedFloor] = useState('all');

    const mallData = MALL_DATA[mallId] || MALL_DATA.default;

    // Get unique categories and floors
    const categories = ['all', ...new Set(mallData.shops.map(shop => shop.category))];
    const floors = ['all', ...new Set(mallData.shops.map(shop => shop.floor))];

    const filteredShops = mallData.shops.filter(shop => {
        if (selectedCategory !== 'all' && shop.category !== selectedCategory) return false;
        if (selectedFloor !== 'all' && shop.floor !== selectedFloor) return false;
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            return shop.name.toLowerCase().includes(query) || shop.category.toLowerCase().includes(query);
        }
        return true;
    });

    return (
        <div className="min-h-screen bg-batik pb-24">
            <div className="max-w-md mx-auto px-6 py-10">
                {/* Header */}
                <div className="mb-8">
                    <button onClick={() => navigate('/shopping')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="text-sm font-bold">Back to Shopping</span>
                    </button>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">{mallData.name}</h1>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm font-medium">{mallData.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm font-medium">{mallData.hours}</span>
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
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                            ))}
                        </select>

                        <select value={selectedFloor} onChange={(e) => setSelectedFloor(e.target.value)} className="text-sm font-black px-4 py-3 rounded-2xl border-2 border-muted/50 bg-white outline-none">
                            {floors.map(floor => (
                                <option key={floor} value={floor}>{floor === 'all' ? 'All Floors' : floor}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Shop Results */}
                <div className="mb-4">
                    <p className="text-sm font-bold text-muted-foreground">
                        {filteredShops.length} shop{filteredShops.length !== 1 ? 's' : ''} found
                    </p>
                </div>

                <div className="space-y-4">
                    {filteredShops.length > 0 ? (
                        filteredShops.map((shop) => (
                            <Card key={shop.id} className="overflow-hidden cursor-pointer group border-2 border-white/50 hover:shadow-xl transition-all rounded-[28px]">
                                <CardContent className="p-0">
                                    <div className="flex gap-4">
                                        <div className="w-28 h-28 shrink-0 relative overflow-hidden">
                                            <img src={shop.image} alt={shop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-1 py-3 pr-4">
                                            <h4 className="font-black text-sm mb-1">{shop.name}</h4>
                                            <div className="flex items-center gap-1 mb-2">
                                                <MapPin className="h-3 w-3 text-primary" />
                                                <span className="text-[10px] font-bold text-muted-foreground">{shop.floor}</span>
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
        </div>
    );
}
