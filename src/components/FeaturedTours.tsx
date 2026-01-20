import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TourCard } from '@/components/TourCard';
import { tours } from '@/data/mockData';
import { Button } from '@/components/ui/button';

export function FeaturedTours() {
  const featuredTours = tours.filter((tour) => tour.featured).slice(0, 3);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredTours.map((tour, index) => (
            <TourCard key={tour.id} tour={tour} index={index} />
          ))}
        </div>

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
