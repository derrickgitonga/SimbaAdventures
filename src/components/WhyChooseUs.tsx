import { motion } from 'framer-motion';
import { Shield, Users, Award, Clock, MapPin, Heart } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Safety First',
    description: 'Certified guides, quality equipment, and comprehensive insurance on every adventure.',
  },
  {
    icon: Users,
    title: 'Small Groups',
    description: 'Intimate group sizes ensure personalized attention and authentic experiences.',
  },
  {
    icon: Award,
    title: 'Expert Guides',
    description: 'Local professionals with years of experience and deep knowledge of the terrain.',
  },
  {
    icon: Clock,
    title: 'Flexible Booking',
    description: 'Free cancellation up to 7 days before departure. Plans change, we understand.',
  },
  {
    icon: MapPin,
    title: 'Local Impact',
    description: 'We partner with local communities and support sustainable tourism initiatives.',
  },
  {
    icon: Heart,
    title: 'Passion Driven',
    description: 'Every trip is crafted by adventurers who live and breathe African exploration.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-accent font-medium uppercase tracking-wider text-sm">
            Why Simba Adventures
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mt-3 mb-4">
            Adventure Done Right
          </h2>
          <div className="section-divider" />
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-xl bg-card border border-border hover:border-accent/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                <feature.icon className="w-7 h-7 text-accent group-hover:text-accent-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-heading font-bold text-xl text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
