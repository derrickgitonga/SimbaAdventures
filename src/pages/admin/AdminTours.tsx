import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
    Package,
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
    Star,
    MapPin,
    Clock,
    DollarSign,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Tour {
    _id: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    duration: string;
    difficulty: string;
    location: string;
    image: string;
    featured: boolean;
    maxGroupSize: number;
    rating: number;
    views: number;
    inquiries: number;
}

export default function AdminTours() {
    const { token } = useAuth();
    const { toast } = useToast();
    const [tours, setTours] = useState<Tour[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Tour>>({});

    const API_URL = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/admin/tours`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setTours(data);
            } else {
                const publicResponse = await fetch(`${API_URL}/api/tours`);
                if (publicResponse.ok) {
                    const data = await publicResponse.json();
                    setTours(data);
                }
            }
        } catch (error) {
            console.error('Failed to fetch tours:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateTour = async () => {
        if (!selectedTour) return;

        try {
            const response = await fetch(`${API_URL}/api/admin/tours/${selectedTour._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editForm)
            });

            if (response.ok) {
                toast({ title: 'Tour Updated', description: 'Changes saved successfully' });
                fetchTours();
                setIsEditing(false);
                setSelectedTour(null);
            } else {
                toast({ title: 'Update Failed', variant: 'destructive' });
            }
        } catch (error) {
            toast({ title: 'Network Error', variant: 'destructive' });
        }
    };

    const deleteTour = async (tourId: string) => {
        if (!confirm('Are you sure you want to delete this tour?')) return;

        try {
            const response = await fetch(`${API_URL}/api/admin/tours/${tourId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                toast({ title: 'Tour Deleted' });
                fetchTours();
            } else {
                toast({ title: 'Delete Failed', variant: 'destructive' });
            }
        } catch (error) {
            toast({ title: 'Network Error', variant: 'destructive' });
        }
    };

    const openEditModal = (tour: Tour) => {
        setSelectedTour(tour);
        setEditForm({
            title: tour.title,
            description: tour.description,
            price: tour.price,
            duration: tour.duration,
            difficulty: tour.difficulty,
            location: tour.location,
            maxGroupSize: tour.maxGroupSize,
            featured: tour.featured,
            image: tour.image
        });
        setIsEditing(true);
    };

    const openCreateModal = () => {
        setSelectedTour(null);
        setEditForm({
            title: '', description: '', price: 0, duration: '',
            difficulty: 'Moderate', location: '', maxGroupSize: 10, featured: false, image: ''
        });
        setIsEditing(true);
    };

    const saveTour = async () => {
        const method = selectedTour ? 'PUT' : 'POST';
        const url = selectedTour
            ? `${API_URL}/api/admin/tours/${selectedTour._id}`
            : `${API_URL}/api/admin/tours`;

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editForm)
            });

            if (response.ok) {
                toast({ title: 'Success', description: 'Tour saved successfully' });
                fetchTours();
                setIsEditing(false);
                setSelectedTour(null);
            } else {
                toast({ title: 'Save Failed', variant: 'destructive' });
            }
        } catch (error) {
            toast({ title: 'Network Error', variant: 'destructive' });
        }
    };

    const filteredTours = tours.filter(tour =>
        tour.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalRevenue = tours.reduce((sum, t) => sum + (t.price * t.inquiries), 0);

    return (
        <div className="p-4 lg:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10">
                        <Package className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Tours Management</h1>
                        <p className="text-sm text-muted-foreground">Manage your safari packages</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button onClick={openCreateModal} className="bg-amber-500 hover:bg-amber-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Tour
                    </Button>
                    <Button onClick={fetchTours} variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-card border border-border">
                    <p className="text-sm text-muted-foreground">Total Tours</p>
                    <p className="text-2xl font-bold">{tours.length}</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border">
                    <p className="text-sm text-muted-foreground">Featured</p>
                    <p className="text-2xl font-bold text-amber-500">
                        {tours.filter(t => t.featured).length}
                    </p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border">
                    <p className="text-sm text-muted-foreground">Total Views</p>
                    <p className="text-2xl font-bold text-blue-500">
                        {tours.reduce((sum, t) => sum + (t.views || 0), 0).toLocaleString()}
                    </p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border">
                    <p className="text-sm text-muted-foreground">Total Inquiries</p>
                    <p className="text-2xl font-bold text-green-500">
                        {tours.reduce((sum, t) => sum + (t.inquiries || 0), 0)}
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search tours..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Tours Grid */}
            {isLoading ? (
                <div className="p-8 text-center text-muted-foreground">Loading tours...</div>
            ) : filteredTours.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No tours found</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTours.map((tour) => (
                        <div
                            key={tour._id}
                            className="rounded-xl bg-card border border-border overflow-hidden hover:border-amber-500/50 transition-colors group"
                        >
                            <div className="relative h-40">
                                <img
                                    src={tour.image}
                                    alt={tour.title}
                                    className="w-full h-full object-cover"
                                />
                                {tour.featured && (
                                    <span className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-amber-500 text-white text-xs font-medium flex items-center gap-1">
                                        <Star className="w-3 h-3" />
                                        Featured
                                    </span>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-2 left-2 right-2">
                                    <h3 className="font-bold text-white line-clamp-1">{tour.title}</h3>
                                </div>
                            </div>

                            <div className="p-4 space-y-3">
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        <MapPin className="w-3 h-3" />
                                        {tour.location}
                                    </span>
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <Clock className="w-3 h-3" />
                                        <span>
                                            {(() => {
                                                const match = tour.duration.match(/^(\d+)\s*Days?$/i);
                                                if (match) {
                                                    const days = parseInt(match[1]);
                                                    if (days > 1) return `${days} Days & ${days - 1} Nights`;
                                                }
                                                return tour.duration;
                                            })()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-bold text-green-500">Ksh {tour.price}</span>
                                    <span className="text-sm text-muted-foreground">
                                        {tour.inquiries || 0} inquiries
                                    </span>
                                </div>

                                <div className="flex gap-2 pt-2 border-t border-border">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => openEditModal(tour)}
                                    >
                                        <Edit className="w-4 h-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                        onClick={() => deleteTour(tour._id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-2xl bg-card border border-border shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">{selectedTour ? 'Edit Tour' : 'New Tour'}</h2>
                            <button onClick={() => setIsEditing(false)} className="p-2 rounded-lg hover:bg-muted">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Image URL</label>
                                <Input
                                    value={editForm.image || ''}
                                    onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Title</label>
                                <Input
                                    value={editForm.title || ''}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Description</label>
                                <textarea
                                    value={editForm.description || ''}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    className="w-full h-24 p-3 rounded-lg bg-background border border-border resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Price (Ksh)</label>
                                    <Input
                                        type="number"
                                        value={editForm.price || ''}
                                        onChange={(e) => setEditForm({ ...editForm, price: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Duration</label>
                                    <Input
                                        value={editForm.duration || ''}
                                        onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Location</label>
                                    <Input
                                        value={editForm.location || ''}
                                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Max Group Size</label>
                                    <Input
                                        type="number"
                                        value={editForm.maxGroupSize || ''}
                                        onChange={(e) => setEditForm({ ...editForm, maxGroupSize: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Difficulty</label>
                                <select
                                    value={editForm.difficulty || ''}
                                    onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value })}
                                    className="w-full p-3 rounded-lg bg-background border border-border"
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Moderate">Moderate</option>
                                    <option value="Challenging">Challenging</option>
                                    <option value="Extreme">Extreme</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={editForm.featured || false}
                                    onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })}
                                    className="w-4 h-4 rounded"
                                />
                                <label htmlFor="featured" className="text-sm font-medium">Featured Tour</label>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-6">
                            <Button
                                className="flex-1 bg-amber-500 hover:bg-amber-600"
                                onClick={saveTour}
                            >
                                Save Changes
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
