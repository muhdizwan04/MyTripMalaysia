import React, { useState, useEffect } from 'react';
import { getDestinations, createDestination, deleteDestination } from '../lib/api';
import { Trash2, Plus, MapPin, ImageIcon } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';

export default function DestinationsManager() {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', image_url: '' });

    useEffect(() => {
        loadDestinations();
    }, []);

    const loadDestinations = async () => {
        try {
            const data = await getDestinations();
            setDestinations(data);
        } catch (error) {
            console.error('Failed to load destinations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this destination?')) {
            try {
                await deleteDestination(id);
                loadDestinations();
            } catch (error) {
                console.error('Failed to delete:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createDestination(formData);
            setIsModalOpen(false);
            setFormData({ name: '', description: '', image_url: '' });
            loadDestinations();
        } catch (error) {
            console.error('Failed to create:', error);
            alert('Error creating destination');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Destinations Manager</h2>
                    <p className="text-slate-500">Manage states and cities for itineraries.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Destination
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Image</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Name</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Description</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {destinations.map((dest) => (
                            <tr key={dest.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                                        {dest.image_url ? (
                                            <img src={dest.image_url} alt={dest.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <ImageIcon size={20} />
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                                    <MapPin size={16} className="text-slate-400" />
                                    {dest.name}
                                </td>
                                <td className="px-6 py-4 text-slate-600 max-w-md truncate">{dest.description}</td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleDelete(dest.id)}
                                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {destinations.length === 0 && (
                            <tr>
                                <td colSpan="3" className="px-6 py-8 text-center text-slate-500">
                                    No destinations found. Add one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                        <h3 className="text-lg font-bold mb-4">Add New Destination</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Kuala Lumpur"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                    rows="1"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief description..."
                                />
                            </div>
                            <ImageUpload
                                value={formData.image_url}
                                onChange={(url) => setFormData({ ...formData, image_url: url })}
                                label="Cover Image"
                            />
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                                >
                                    Create Destination
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
