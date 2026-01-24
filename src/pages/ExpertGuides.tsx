import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Award, MapPin, BookOpen, Globe } from 'lucide-react';

const ExpertGuides = () => {
    const expertise = [
        {
            icon: Award,
            title: 'Certified Professionals',
            description: 'All guides hold internationally recognized certifications including wilderness first aid, outdoor leadership, and specialized regional qualifications.',
        },
        {
            icon: MapPin,
            title: 'Local Knowledge',
            description: 'Our guides are local experts who grew up in the regions they lead, with deep cultural understanding and insider knowledge of hidden gems.',
        },
        {
            icon: BookOpen,
            title: 'Continuous Training',
            description: 'We invest heavily in ongoing education, ensuring our guides stay current with best practices in safety, sustainability, and customer service.',
        },
        {
            icon: Globe,
            title: 'Multi-Lingual',
            description: 'Our team speaks over 15 languages combined, ensuring clear communication and cultural bridge-building throughout your journey.',
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
                                <Award className="w-10 h-10 text-accent" />
                            </div>
                            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
                                Expert Guides
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Meet the heart of Simba Adventures. Our guides aren't just leading your trip—they're sharing their home, their culture, and their passion for Africa.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Expertise Grid */}
                <section className="py-16 md:py-24 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                            {expertise.map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-8 rounded-xl bg-card border border-border"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                                        <item.icon className="w-7 h-7 text-accent" />
                                    </div>
                                    <h3 className="font-heading font-bold text-2xl text-foreground mb-4">
                                        {item.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {item.description}
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
                                    The Difference Expert Guidance Makes
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    A great guide transforms a good trip into an unforgettable adventure. Our team brings an average of 8+ years of guiding experience, with some of our senior guides having led expeditions for over two decades.
                                </p>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Beyond technical skills and certifications, our guides are natural storytellers and cultural ambassadors. They'll share the hidden history of ancient trails, identify wildlife tracks you'd never notice, and introduce you to local communities in meaningful ways.
                                </p>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    We hire locals whenever possible because we believe they offer insights and connections that outsiders simply cannot provide. When you travel with us, you're not just seeing Africa—you're experiencing it through the eyes of those who call it home.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    Our commitment to our guides extends beyond their professional development. We provide competitive wages, health benefits, and career advancement opportunities, ensuring that the people who make your adventure possible are valued and supported.
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

export default ExpertGuides;
