import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TourCard } from '@/components/TourCard';
import { useFeaturedTours } from '@/hooks/useTours';
import { Button } from '@/components/ui/button';

export function FeaturedTours() {
  const { data: featuredTours, isLoading } = useFeaturedTours(3);

  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-accent font-medium uppercase tracking-wider text-sm">
            Explore Our Top Picks
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mt-3 mb-4">
            Featured Adventures
          </h2>
          <div className="section-divider" />
          <p className="text-muted-foreground max-w-2xl mx-auto mt-6 text-lg">
            Handpicked experiences that showcase the best of East African adventure.
            From challenging summits to serene safaris.
          </p>
        </motion.div>

        {/* Tours Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : featuredTours && featuredTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredTours.map((tour, index) => (
              <TourCard key={tour._id || tour.slug} tour={tour} index={index} />
            ))}
          </div>
        ) : null}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button asChild size="lg" className="btn-adventure">
            <Link to="/tours" className="flex items-center gap-2">
              View All Adventures
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
