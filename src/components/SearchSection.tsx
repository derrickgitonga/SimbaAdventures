import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { categories } from '@/data/mockData';

export function SearchSection() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Adventures');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery) params.set('search', searchQuery);
        if (selectedCategory !== 'All Adventures') params.set('category', selectedCategory);
        navigate(`/tours?${params.toString()}`);
    };

    return (
        <section className="py-12 md:py-16 bg-background">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Search Bar */}
                    <form
                        onSubmit={handleSearch}
                        className="bg-card rounded-2xl p-3 border border-border shadow-sm max-w-3xl mx-auto mb-12"
                    >
                        <div className="flex flex-col md:flex-row gap-3">
                            {/* Search Input */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search adventures..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-background rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                                />
                            </div>

                            {/* Category Dropdown */}
                            <div className="relative min-w-[200px]">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full pl-12 pr-10 py-4 bg-background rounded-xl text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all cursor-pointer"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                            </div>

                            {/* Search Button */}
                            <Button type="submit" className="btn-adventure py-4 px-8">
                                <Search className="w-5 h-5 md:hidden" />
                                <span className="hidden md:inline">Search</span>
                            </Button>
                        </div>
                    </form>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
                    >
                        {[
                            { value: '500+', label: 'Adventures' },
                            { value: '10K+', label: 'Explorers' },
                            { value: '4.9', label: 'Rating' },
                            { value: '9', label: 'Years' },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-muted-foreground text-xs">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
