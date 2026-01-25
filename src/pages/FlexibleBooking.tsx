import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Clock, Calendar, CreditCard, RefreshCw } from 'lucide-react';

const FlexibleBooking = () => {
    const features = [
        {
            icon: Calendar,
            title: 'Free Cancellation',
            description: 'Cancel up to 7 days before departure for a full refund. We understand that life happens and plans change.',
        },
        {
            icon: RefreshCw,
            title: 'Easy Rescheduling',
            description: 'Need to change your dates? We make it simple to reschedule your adventure with no hassle or hidden fees.',
        },
        {
            icon: CreditCard,
            title: 'Flexible Payment',
            description: 'Pay a small deposit to secure your spot, then settle the balance closer to your departure date.',
        },
        {
            icon: Clock,
            title: 'Instant Confirmation',
            description: 'Get immediate booking confirmation via email, with all the details you need to start planning your adventure.',
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
                                <Clock className="w-10 h-10 text-accent" />
                            </div>
                            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
                                Flexible Booking
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Book with confidence. We've designed our booking policies to be as flexible as possible, so you can plan your adventure without worry.
                            </p>
                        </motion.div>
                    </div>
                </section>

                <section className="py-16 md:py-24 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                            {features.map((feature, index) => (
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
                            >
                                <h2 className="font-heading font-bold text-3xl text-foreground mb-6">
                                    Booking Made Simple
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    We believe that booking your dream adventure should be straightforward and stress-free. That's why we've eliminated complicated terms and conditions in favor of clear, customer-friendly policies.
                                </p>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Our 7-day free cancellation policy gives you peace of mind. If something comes up and you need to cancel, just let us know at least 7 days before your departure and we'll process a full refund—no questions asked.
                                </p>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Need to reschedule? We make it easy. Contact us and we'll work with you to find new dates that fit your schedule. We only ask that you give us reasonable notice so we can adjust our logistics accordingly.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    We also offer flexible payment options. Secure your spot with a small deposit (typically 30% of the total cost), and pay the remainder 30 days before departure. We accept all major credit cards, bank transfers, and can work with you on payment plans for longer expeditions.
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

export default FlexibleBooking;
