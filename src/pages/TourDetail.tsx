import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Clock,
  Users,
  Star,
  Calendar,
  Check,
  X,
  ChevronRight,
  Share2,
  Heart,
  ArrowLeft,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { tours } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const difficultyColors = {
  Easy: 'bg-green-500/10 text-green-600 border-green-500/30',
  Moderate: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
  Challenging: 'bg-orange-500/10 text-orange-600 border-orange-500/30',
  Extreme: 'bg-red-500/10 text-red-600 border-red-500/30',
};

export default function TourDetail() {
  const { slug } = useParams();
  const tour = tours.find((t) => t.slug === slug);

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tour not found</h1>
          <Button asChild>
            <Link to="/tours">Back to Adventures</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Image */}
      <section className="relative h-[50vh] md:h-[60vh] mt-16 md:mt-20">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Back Button */}
        <Link
          to="/tours"
          className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>All Adventures</span>
        </Link>

        {/* Share & Like */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 flex gap-2">
          <button className="p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-accent font-medium uppercase tracking-wider text-sm">
                {tour.category}
              </span>
              <h1 className="font-heading font-bold text-3xl md:text-5xl text-white mt-2 mb-4">
                {tour.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span>{tour.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-accent text-accent" />
                  <span>
                    {tour.rating} ({tour.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Quick Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <div className="p-4 rounded-xl bg-card border border-border text-center">
                  <Clock className="w-6 h-6 text-accent mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <p className="font-semibold text-foreground">{tour.duration}</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border text-center">
                  <Users className="w-6 h-6 text-accent mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">Group Size</span>
                  <p className="font-semibold text-foreground">Max {tour.maxGroupSize}</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border text-center">
                  <Calendar className="w-6 h-6 text-accent mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">Next Date</span>
                  <p className="font-semibold text-foreground">
                    {new Date(tour.nextDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border text-center">
                  <Badge className={`${difficultyColors[tour.difficulty]} mx-auto`}>
                    {tour.difficulty}
                  </Badge>
                  <span className="text-sm text-muted-foreground block mt-2">Difficulty</span>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="font-heading font-bold text-2xl mb-4">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">{tour.description}</p>
              </motion.div>

              {/* Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="font-heading font-bold text-2xl mb-4">Highlights</h2>
                <ul className="space-y-3">
                  {tour.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-accent/10 mt-0.5">
                        <Check className="w-4 h-4 text-accent" />
                      </div>
                      <span className="text-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Itinerary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="font-heading font-bold text-2xl mb-6">Itinerary</h2>
                <div className="space-y-4">
                  {tour.itinerary.map((day) => (
                    <div
                      key={day.day}
                      className="p-5 rounded-xl bg-card border border-border hover:border-accent/50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                          <span className="font-heading font-bold text-accent">
                            {day.day}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {day.title}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {day.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Inclusions/Exclusions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div>
                  <h2 className="font-heading font-bold text-2xl mb-4">Included</h2>
                  <ul className="space-y-3">
                    {tour.inclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="font-heading font-bold text-2xl mb-4">Not Included</h2>
                  <ul className="space-y-3">
                    {tour.exclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* Sidebar - Booking Card */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-24 p-6 rounded-2xl bg-card border border-border shadow-lg"
              >
                {/* Price */}
                <div className="mb-6">
                  {tour.originalPrice && (
                    <span className="text-muted-foreground line-through text-lg">
                      ${tour.originalPrice}
                    </span>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading font-bold text-4xl text-foreground">
                      ${tour.price}
                    </span>
                    <span className="text-muted-foreground">per person</span>
                  </div>
                </div>

                {/* Spots Left */}
                {tour.spotsLeft <= 5 && (
                  <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm font-medium text-center mb-6">
                    🔥 Only {tour.spotsLeft} spots left for next departure!
                  </div>
                )}

                {/* Date */}
                <div className="p-4 rounded-xl bg-muted/50 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-muted-foreground">Next Departure</span>
                      <p className="font-semibold text-foreground">
                        {new Date(tour.nextDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Button className="w-full btn-adventure py-6 text-lg">
                    Book This Adventure
                  </Button>
                  <Button variant="outline" className="w-full py-6">
                    Request Custom Date
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-border space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent" />
                    <span>Free cancellation up to 7 days before</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent" />
                    <span>Secure payment with Stripe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent" />
                    <span>Instant confirmation</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
