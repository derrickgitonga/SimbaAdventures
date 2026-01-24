import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Camera, Star } from 'lucide-react';

const SmallGroups = () => {
    const benefits = [
        {
            icon: MessageCircle,
            title: 'Personalized Attention',
            description: 'With smaller groups, our guides can tailor the experience to your interests and ensure everyone gets the attention they deserve.',
        },
        {
            icon: Camera,
            title: 'Better Experiences',
            description: 'Smaller groups mean less waiting, more flexibility, and the ability to access locations that larger tours simply cannot reach.',
        },
        {
            icon: Star,
            title: 'Authentic Connections',
            description: 'Build meaningful relationships with fellow adventurers and local communities through genuine, intimate interactions.',
        },
        {
            icon: Users,
            title: 'Maximum 12 People',
            description: 'We cap our groups at 12 participants to ensure quality experiences and minimize environmental impact on the locations we visit.',
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
                                <Users className="w-10 h-10 text-accent" />
                            </div>
                            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
                                Small Groups
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Experience the difference that intimate group sizes make. We believe the best adventures happen when you're not lost in a crowd.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Benefits Grid */}
                <section className="py-16 md:py-24 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={benefit.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-8 rounded-xl bg-card border border-border"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                                        <benefit.icon className="w-7 h-7 text-accent" />
                                    </div>
                                    <h3 className="font-heading font-bold text-2xl text-foreground mb-4">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {benefit.description}
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
                                    Why Small Groups Matter
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    In the adventure travel industry, bigger isn't always better. We've deliberately chosen to keep our group sizes small because we've seen firsthand how it transforms the travel experience.
                                </p>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    With fewer people, you'll spend less time waiting and organizing, and more time actually experiencing the destination. Our guides can adapt the itinerary on the fly based on the group's interests and energy levels.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    Small groups also mean we can access hidden gems and local experiences that simply aren't possible with larger tour groups. You'll eat at family-run restaurants, visit local artisans, and explore trails that most tourists never see.
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

export default SmallGroups;
