import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Heart, Compass, Mountain, Sparkles } from 'lucide-react';

const PassionDriven = () => {
    const values = [
        {
            icon: Heart,
            title: 'Born from Love',
            description: 'Every member of our team fell in love with African wilderness first, then decided to share that passion through adventure travel.',
        },
        {
            icon: Compass,
            title: 'Personal Experience',
            description: 'We only offer adventures we\'ve personally completed and tested. If we wouldn\'t do it ourselves, we won\'t ask you to.',
        },
        {
            icon: Mountain,
            title: 'Pushing Boundaries',
            description: 'We\'re adventurers at heart, constantly exploring new routes and experiences to offer our guests something extraordinary.',
        },
        {
            icon: Sparkles,
            title: 'Attention to Detail',
            description: 'Our passion shows in every detail—from route planning to meal selection—because we genuinely care about your experience.',
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
                                <Heart className="w-10 h-10 text-accent" />
                            </div>
                            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
                                Passion Driven
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                We're not just running a business—we're sharing our life's passion. Every adventure is crafted by people who live and breathe African exploration.
                            </p>
                        </motion.div>
                    </div>
                </section>

                <section className="py-16 md:py-24 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                            {values.map((value, index) => (
                                <motion.div
                                    key={value.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-8 rounded-xl bg-card border border-border"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                                        <value.icon className="w-7 h-7 text-accent" />
                                    </div>
                                    <h3 className="font-heading font-bold text-2xl text-foreground mb-4">
                                        {value.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {value.description}
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
                            >
                                <h2 className="font-heading font-bold text-3xl text-foreground mb-6">
                                    Why We Do What We Do
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Simba Adventures wasn't started by businesspeople who saw an opportunity—it was founded by adventurers who couldn't imagine doing anything else. Each member of our team has their own story of falling in love with Africa's wild places.
                                </p>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    For some, it was watching the sunrise over the Serengeti for the first time. For others, it was summiting Mount Kilimanjaro or tracking gorillas through the mist. These moments changed us, and now we dedicate ourselves to creating those same life-changing experiences for others.
                                </p>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    This passion translates into how we operate. We don't cut corners or take shortcuts. We invest in the best equipment, partner with the best guides, and spend countless hours refining our itineraries because your experience matters deeply to us.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    When you travel with Simba Adventures, you're not just booking a tour—you're connecting with people who genuinely love what they do and can't wait to share it with you. That enthusiasm is infectious, and it's what makes our adventures truly special.
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

export default PassionDriven;
