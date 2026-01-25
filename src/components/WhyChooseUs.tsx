import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Users, Award, Clock, MapPin, Heart } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Safety First',
    description: 'Certified guides, quality equipment, and comprehensive insurance on every adventure.',
    link: '/safety-first',
  },
  {
    icon: Users,
    title: 'Small Groups',
    description: 'Intimate group sizes ensure personalized attention and authentic experiences.',
    link: '/small-groups',
  },
  {
    icon: Award,
    title: 'Expert Guides',
    description: 'Local professionals with years of experience and deep knowledge of the terrain.',
    link: '/expert-guides',
  },
  {
    icon: Clock,
    title: 'Flexible Booking',
    description: 'Free cancellation up to 7 days before departure. Plans change, we understand.',
    link: '/flexible-booking',
  },
  {
    icon: MapPin,
    title: 'Local Impact',
    description: 'We partner with local communities and support sustainable tourism initiatives.',
    link: '/local-impact',
  },
  {
    icon: Heart,
    title: 'Passion Driven',
    description: 'Every trip is crafted by adventurers who live and breathe African exploration.',
    link: '/passion-driven',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link key={feature.title} to={feature.link}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-xl bg-card border border-border hover:border-accent/50 hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
