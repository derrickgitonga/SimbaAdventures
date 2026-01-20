import { motion } from 'framer-motion';
import { Target, Heart, Users, Award, MapPin } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CTASection } from '@/components/CTASection';

const team = [
  {
    name: 'James Kimani',
    role: 'Founder & Lead Guide',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    bio: '15 years guiding Mount Kenya and Kilimanjaro expeditions.',
  },
  {
    name: 'Sarah Okonkwo',
    role: 'Safari Director',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    bio: 'Wildlife biologist turned safari specialist.',
  },
  {
    name: 'David Mutua',
    role: 'Operations Manager',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    bio: 'Ensuring every adventure runs seamlessly.',
  },
];

const values = [
  {
    icon: Target,
    title: 'Adventure First',
    description: 'We believe in pushing boundaries while respecting limits. Every trip is designed to challenge and inspire.',
  },
  {
    icon: Heart,
    title: 'Sustainable Tourism',
    description: 'We partner with local communities and prioritize eco-friendly practices to preserve Africa for future generations.',
  },
  {
    icon: Users,
    title: 'Community Impact',
    description: 'A portion of every booking supports local education and conservation initiatives.',
  },
  {
    icon: Award,
    title: 'Excellence Always',
    description: 'From equipment to guides, we never compromise on quality. Your safety and experience come first.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1600&q=80')`,
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="text-accent font-medium uppercase tracking-wider text-sm">
              Our Story
            </span>
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mt-3 mb-6">
              Born from a Love for
              <span className="text-accent block">African Wilderness</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Simba Adventures was founded in 2015 by a group of passionate outdoor enthusiasts 
              who believed that the best way to experience Africa is on foot, away from the crowds, 
              immersed in nature's raw beauty.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80"
                alt="Safari experience"
                className="rounded-2xl shadow-xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
                From Summit Dreams to Safari Sunsets
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                What started as guiding friends up Mount Kenya has grown into East Africa's 
                most trusted adventure company. We've led over 500 expeditions, helped 10,000+ 
                adventurers discover the wild heart of Africa, and built lasting relationships 
                with communities across Kenya and Tanzania.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our philosophy is simple: small groups, expert local guides, authentic experiences, 
                and a deep commitment to sustainable tourism. We're not just tour operators—we're 
                storytellers, conservationists, and adventure enablers.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-accent">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">Based in Nairobi, Kenya</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
              What We Stand For
            </h2>
            <div className="section-divider" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-heading font-bold text-xl text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-accent font-medium uppercase tracking-wider text-sm">
              The Experts
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mt-3 mb-4">
              Meet Our Team
            </h2>
            <div className="section-divider" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-40 h-40 rounded-full object-cover mx-auto mb-4 border-4 border-accent/20"
                />
                <h3 className="font-heading font-bold text-xl text-foreground">
                  {member.name}
                </h3>
                <p className="text-accent text-sm font-medium mb-2">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  );
}
