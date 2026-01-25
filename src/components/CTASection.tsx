import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=1600&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary/80" />

          {/* Content */}
          <div className="relative z-10 py-16 md:py-24 px-8 md:px-16">
            <div className="max-w-2xl">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent border border-accent/30 text-sm font-medium mb-6"
              >
                <Calendar className="w-4 h-4" />
                2026 Season Now Open
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-6 leading-tight"
              >
                Ready to Start Your
                <span className="block text-accent">African Adventure?</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-primary-foreground/80 text-lg mb-8 leading-relaxed"
              >
                Join thousands of adventurers who've discovered the magic of East Africa with us.
                Book your 2026 expedition today and save up to 15% with early bird pricing.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button asChild size="lg" className="btn-adventure">
                  <Link to="/tours" className="flex items-center gap-2">
                    Browse Adventures
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 text-black hover:bg-primary-foreground/10 hover:text-black"
                >
                  <Link to="/contact">Talk to an Expert</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
