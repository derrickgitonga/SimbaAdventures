import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TourCard } from '@/components/TourCard';
import { categories, difficultyLevels } from '@/data/mockData';
import { useTours } from '@/hooks/useTours';
import { Button } from '@/components/ui/button';
import { useActivityTracker, trackSearch } from '@/lib/activityTracker';

export default function Tours() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const { data: tours, isLoading, error } = useTours();
  const { track } = useActivityTracker();

  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'All Adventures';
  const selectedDifficulty = searchParams.get('difficulty') || '';
  const sortBy = searchParams.get('sort') || 'featured';

  useEffect(() => {
    track({
      action: 'CUSTOMER_VIEW_TOURS',
      description: 'Viewed tours page',
      entityType: 'system',
      severity: 'info'
    });
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const timer = setTimeout(() => {
        trackSearch(searchQuery, filteredTours.length);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All Adventures' && value !== '') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const filteredTours = useMemo(() => {
    if (!tours) return [];
    let result = [...tours];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (tour) =>
          tour.title.toLowerCase().includes(query) ||
          tour.location.toLowerCase().includes(query) ||
          tour.description.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'All Adventures') {
      result = result.filter((tour) => tour.category === selectedCategory);
    }

    // Difficulty filter
    if (selectedDifficulty) {
      result = result.filter((tour) => tour.difficulty === selectedDifficulty);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [tours, searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  const hasActiveFilters = searchQuery || selectedCategory !== 'All Adventures' || selectedDifficulty;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Banner */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-primary-foreground mb-4">
              All Adventures
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              {filteredTours.length} incredible experiences await. Find your perfect adventure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search adventures..."
                value={searchQuery}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>

            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              className="md:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Filters
            </Button>

            {/* Desktop Filters */}
            <div className="hidden md:flex gap-4">
              {/* Category */}
              <select
                value={selectedCategory}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="px-4 py-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Difficulty */}
              <select
                value={selectedDifficulty}
                onChange={(e) => updateFilter('difficulty', e.target.value)}
                className="px-4 py-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer"
              >
                <option value="">All Difficulties</option>
                {difficultyLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="px-4 py-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mb-6 p-4 rounded-lg border border-border bg-card space-y-4"
            >
              <select
                value={selectedCategory}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => updateFilter('difficulty', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background"
              >
                <option value="">All Difficulties</option>
                {difficultyLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </motion.div>
          )}

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm">
                  "{searchQuery}"
                  <button onClick={() => updateFilter('search', '')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory !== 'All Adventures' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm">
                  {selectedCategory}
                  <button onClick={() => updateFilter('category', 'All Adventures')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedDifficulty && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm">
                  {selectedDifficulty}
                  <button onClick={() => updateFilter('difficulty', '')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
              <span className="ml-3 text-lg text-muted-foreground">Loading adventures...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <p className="text-destructive text-lg mb-4">
                Failed to load adventures. Please try again later.
              </p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry
              </Button>
            </div>
          )}

          {/* Tours Grid */}
          {!isLoading && !error && filteredTours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTours.map((tour, index) => (
                <TourCard key={tour._id || tour.slug} tour={tour} index={index} />
              ))}
            </div>
          ) : !isLoading && !error && filteredTours.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">
                No adventures found matching your criteria.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          ) : null}
        </div>
      </section>

      <Footer />
    </div>
  );
}
