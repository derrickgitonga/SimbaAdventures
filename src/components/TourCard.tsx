import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Star, TrendingUp } from 'lucide-react';
import { Tour } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

interface TourCardProps {
  tour: Tour;
  index?: number;
}

const difficultyColors = {
  Easy: 'bg-green-500/10 text-green-600 border-green-500/30',
  Moderate: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
  Challenging: 'bg-orange-500/10 text-orange-600 border-orange-500/30',
  Extreme: 'bg-red-500/10 text-red-600 border-red-500/30',
};

export function TourCard({ tour, index = 0 }: TourCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/tours/${tour.slug}`}
        className="group block card-adventure h-full"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={tour.image}
            alt={tour.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {tour.featured && (
              <Badge className="bg-accent text-accent-foreground border-0">
                <TrendingUp className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            <Badge className={`border ${difficultyColors[tour.difficulty]}`}>
              {tour.difficulty}
            </Badge>
          </div>

          {/* Price */}
          <div className="absolute bottom-4 right-4 text-right">
            {tour.originalPrice && (
              <span className="text-white/60 text-sm line-through block">
                ${tour.originalPrice}
              </span>
            )}
            <span className="text-white font-heading font-bold text-2xl">
              ${tour.price}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Category */}
          <span className="text-xs font-medium text-accent uppercase tracking-wider">
            {tour.category}
          </span>

          {/* Title */}
          <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-accent transition-colors line-clamp-2">
            {tour.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <MapPin className="w-4 h-4 text-accent" />
            <span>{tour.location}</span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-sm line-clamp-2">
            {tour.shortDescription}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{tour.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>Max {tour.maxGroupSize}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="font-medium text-foreground">{tour.rating}</span>
              <span className="text-muted-foreground text-sm">({tour.reviewCount})</span>
            </div>
          </div>

          {/* Spots Left */}
          {tour.spotsLeft <= 5 && (
            <div className="bg-destructive/10 text-destructive px-3 py-2 rounded-lg text-sm font-medium text-center">
              Only {tour.spotsLeft} spots left!
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
