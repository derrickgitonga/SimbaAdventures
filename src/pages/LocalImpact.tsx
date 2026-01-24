import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { MapPin, Users, Leaf, Heart } from 'lucide-react';

const LocalImpact = () => {
    const initiatives = [
        {
            icon: Users,
            title: 'Community Partnerships',
            description: 'We work directly with local communities, ensuring that tourism revenue supports schools, healthcare, and local businesses.',
        },
        {
            icon: Leaf,
            title: 'Environmental Conservation',
            description: 'A portion of every booking goes toward conservation efforts, protecting the natural habitats and wildlife you come to experience.',
        },
        {
            icon: MapPin,
            title: 'Local Employment',
            description: 'We prioritize hiring local guides, support staff, and service providers, creating sustainable employment in the communities we visit.',
        },
        {
            icon: Heart,
            title: 'Cultural Preservation',
            description: 'We support initiatives that preserve traditional practices, languages, and cultural heritage for future generations.',
        },
    ];

    return (
        <div className="min-h-screen">
            <Header />
            <main>
                {/* Hero Section */}
                <section className="relative py-20 md:py-32 bg-gradient-to-br from-accent/10 to-background">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl mx-auto text-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                                <MapPin className="w-10 h-10 text-accent" />
                            </div>
                            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
                                Local Impact
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Tourism done right creates positive change. We're committed to ensuring that your adventures contribute to thriving local communities and protected natural environments.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Initiatives Grid */}
                <section className="py-16 md:py-24 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                            {initiatives.map((initiative, index) => (
                                <motion.div
                                    key={initiative.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-8 rounded-xl bg-card border border-border"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                                        <initiative.icon className="w-7 h-7 text-accent" />
                                    </div>
                                    <h3 className="font-heading font-bold text-2xl text-foreground mb-4">
                                        {initiative.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {initiative.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Detailed Content */}
                <section className="py-16 md:py-24 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="font-heading font-bold text-3xl text-foreground mb-6">
                                    Creating Lasting Positive Change
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Sustainable tourism isn't just a buzzword for us—it's a fundamental part of how we operate. We believe that the places we love to explore should benefit from our presence, not suffer from it.
                                </p>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Through our community partnership programs, we ensure that local voices are heard in how tourism develops in their regions. We don't just pass through communities—we build long-term relationships, invest in local infrastructure, and create opportunities for economic growth.
                                </p>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Environmental stewardship is equally important. We follow Leave No Trace principles, support anti-poaching efforts, and contribute to habitat restoration projects. When you book with us, you're not just taking a trip—you're actively participating in conservation.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    We publish an annual impact report detailing exactly where our conservation funds go and what measurable outcomes they achieve. Transparency matters to us, and we want you to see the real difference your adventure makes.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default LocalImpact;
