import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, User, Mail, Phone, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCreateBooking } from '@/hooks/useBookings';
import type { Tour } from '@/data/mockData';

interface BookingModalProps {
    tour: Tour;
    isOpen: boolean;
    onClose: () => void;
}

export function BookingModal({ tour, isOpen, onClose }: BookingModalProps) {
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        participants: 1,
        tripDate: tour.nextDate,
    });
    const [success, setSuccess] = useState(false);

    const { mutate: createBooking, isPending } = useCreateBooking();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        createBooking({
            tourId: tour._id || tour.id || '',
            tourTitle: tour.title,
            customerName: formData.customerName,
            customerEmail: formData.customerEmail,
            customerPhone: formData.customerPhone,
            bookingDate: new Date().toISOString().split('T')[0],
            tripDate: formData.tripDate,
            participants: formData.participants,
            totalAmount: tour.price * formData.participants,
            status: 'Pending',
            paymentStatus: 'Pending',
        }, {
            onSuccess: () => {
                setSuccess(true);
                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                    setFormData({
                        customerName: '',
                        customerEmail: '',
                        customerPhone: '',
                        participants: 1,
                        tripDate: tour.nextDate,
                    });
                }, 2000);
            },
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'participants' ? parseInt(value) : value,
        }));
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl overflow-hidden"
                >
                    <div className="bg-primary p-6">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="font-heading font-bold text-2xl text-white">Book Your Adventure</h2>
                        <p className="text-white/80 mt-1">{tour.title}</p>
                    </div>

                    {success ? (
                        <div className="p-8 text-center">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h3 className="font-heading font-bold text-xl text-foreground mb-2">Booking Submitted!</h3>
                            <p className="text-muted-foreground">We'll contact you shortly to confirm your adventure.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    <User className="w-4 h-4 inline mr-2" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    <Mail className="w-4 h-4 inline mr-2" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="customerEmail"
                                    value={formData.customerEmail}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    <Phone className="w-4 h-4 inline mr-2" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="customerPhone"
                                    value={formData.customerPhone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50"
                                    placeholder="+254 700 000 000"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        <Users className="w-4 h-4 inline mr-2" />
                                        Participants
                                    </label>
                                    <select
                                        name="participants"
                                        value={formData.participants}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50"
                                    >
                                        {Array.from({ length: Math.min(tour.spotsLeft, tour.maxGroupSize) }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        <Calendar className="w-4 h-4 inline mr-2" />
                                        Trip Date
                                    </label>
                                    <input
                                        type="date"
                                        name="tripDate"
                                        value={formData.tripDate}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50"
                                    />
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-muted/50 border border-border">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Price per person</span>
                                    <span className="font-semibold">Ksh {tour.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-border">
                                    <span className="font-semibold text-foreground">Total Amount</span>
                                    <span className="font-heading font-bold text-xl text-accent">
                                        Ksh {(tour.price * formData.participants).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full btn-adventure py-6 text-lg"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Confirm Booking'
                                )}
                            </Button>

                            <p className="text-xs text-center text-muted-foreground">
                                By booking, you agree to our terms and conditions. Full payment details will be sent via email.
                            </p>
                        </form>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
