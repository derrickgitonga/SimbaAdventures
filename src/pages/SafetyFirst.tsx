import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Award, Heart } from 'lucide-react';

const SafetyFirst = () => {
    const safetyFeatures = [
        {
            icon: Shield,
            title: 'Comprehensive Insurance',
            description: 'Every adventure is covered by extensive travel and medical insurance, ensuring peace of mind for you and your loved ones.',
        },
        {
            icon: CheckCircle,
            title: 'Premium Equipment',
            description: 'We use only top-tier, regularly inspected equipment from leading outdoor brands, maintained to the highest standards.',
        },
        {
            icon: Award,
            title: 'Certified Guides',
            description: 'All our guides hold internationally recognized certifications in wilderness first aid, navigation, and outdoor leadership.',
        },
        {
            icon: Heart,
            title: 'Emergency Protocols',
            description: 'Detailed emergency action plans are in place for every tour, with 24/7 support and satellite communication in remote areas.',
        },
    ];

    return (
        <div className="min-h-screen">
            <Header />
            <main>
                <section className="relative py-20 md:py-32 bg-gradient-to-br from-accent/10 to-background">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl mx-auto text-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                                <Shield className="w-10 h-10 text-accent" />
                            </div>
                            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
                                Safety First
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Your safety is our top priority. We maintain the highest standards in equipment, training, and protocols to ensure every adventure is as safe as it is exciting.
                            </p>
                        </motion.div>
                    </div>
                </section>

                <section className="py-16 md:py-24 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                            {safetyFeatures.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-8 rounded-xl bg-card border border-border"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                                        <feature.icon className="w-7 h-7 text-accent" />
                                    </div>
                                    <h3 className="font-heading font-bold text-2xl text-foreground mb-4">
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

                <section className="py-16 md:py-24 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="prose prose-lg max-w-none"
                            >
                                <h2 className="font-heading font-bold text-3xl text-foreground mb-6">
                                    Our Commitment to Your Safety
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    At Simba Adventures, safety isn't just a priority—it's embedded in everything we do. From the moment you book your adventure to the time you return home, we've carefully considered every aspect of your journey to minimize risk and maximize safety.
                                </p>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Our guides undergo rigorous training programs and hold certifications from internationally recognized organizations. They're not just experts in their field—they're trained to handle emergency situations with calm professionalism.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    We regularly audit our safety procedures, update our equipment, and stay informed about the latest safety protocols in adventure tourism. Your trust in us is something we never take for granted.
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

export default SafetyFirst;
