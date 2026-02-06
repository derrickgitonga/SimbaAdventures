import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    CreditCard,
    Banknote,
    Smartphone,
    Building,
    Receipt,
    Search,
    User,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Tour {
    _id: string;
    title: string;
    price: number;
    image: string;
    duration: string;
    slug: string;
}

interface CartItem {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    tourId?: string;
}

interface Customer {
    name: string;
    email: string;
    phone: string;
}

const paymentMethods = [
    { id: 'CASH', label: 'Cash', icon: Banknote },
    { id: 'CARD', label: 'Card', icon: CreditCard },
    { id: 'MPESA', label: 'M-Pesa', icon: Smartphone },
    { id: 'BANK_TRANSFER', label: 'Bank', icon: Building },
];

export default function AdminPOS() {
    const { token } = useAuth();
    const { toast } = useToast();
    const [tours, setTours] = useState<Tour[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [customer, setCustomer] = useState<Customer>({ name: '', email: '', phone: '' });
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [searchTerm, setSearchTerm] = useState('');
    const [discount, setDiscount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [lastTransaction, setLastTransaction] = useState<any>(null);
    const [tripDate, setTripDate] = useState('');

    const API_URL = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        fetchTours();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 7);
        setTripDate(tomorrow.toISOString().split('T')[0]);
    }, []);

    const fetchTours = async () => {
        try {
            const response = await fetch(`${API_URL}/api/tours`);
            const data = await response.json();
            setTours(data);
        } catch (error) {
            console.error('Failed to fetch tours:', error);
        }
    };

    const addToCart = (tour: Tour) => {
        const existingItem = cart.find(item => item.id === tour._id);
        if (existingItem) {
            setCart(cart.map(item =>
                item.id === tour._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, {
                id: tour._id,
                name: tour.title,
                quantity: 1,
                unitPrice: tour.price,
                tourId: tour._id
            }]);
        }
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const removeFromCart = (id: string) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
        setCustomer({ name: '', email: '', phone: '' });
        setDiscount(0);
        setLastTransaction(null);
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const total = subtotal - discount;

    const processSale = async () => {
        if (cart.length === 0) {
            toast({ title: 'Cart is empty', variant: 'destructive' });
            return;
        }
        if (!customer.name || !customer.email) {
            toast({ title: 'Customer name and email required', variant: 'destructive' });
            return;
        }

        setIsProcessing(true);

        try {
            const response = await fetch(`${API_URL}/api/admin/pos/sale`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    customer,
                    items: cart,
                    paymentMethod,
                    discount,
                    tripDate
                })
            });

            if (response.ok) {
                const transaction = await response.json();
                setLastTransaction(transaction);
                toast({
                    title: 'Sale Completed!',
                    description: `Receipt: ${transaction.receiptNumber}`
                });
                setCart([]);
                setCustomer({ name: '', email: '', phone: '' });
                setDiscount(0);
            } else {
                const error = await response.json();
                toast({ title: 'Sale Failed', description: error.error, variant: 'destructive' });
            }
        } catch (error) {
            toast({ title: 'Network Error', description: 'Could not process sale', variant: 'destructive' });
        } finally {
            setIsProcessing(false);
        }
    };

    const filteredTours = tours.filter(tour =>
        tour.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 lg:p-6 min-h-screen">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-green-500/10">
                    <ShoppingCart className="w-6 h-6 text-green-500" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Point of Sale</h1>
                    <p className="text-sm text-muted-foreground">Process walk-in bookings and payments</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tours Catalog */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="Search tours..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
                        {filteredTours.map(tour => (
                            <button
                                key={tour._id}
                                onClick={() => addToCart(tour)}
                                className="text-left p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-green-500/50 hover:bg-green-500/5 transition-all group"
                            >
                                <img
                                    src={tour.image}
                                    alt={tour.title}
                                    className="w-full h-28 object-cover rounded-lg mb-3"
                                />
                                <h3 className="font-medium text-foreground line-clamp-1 group-hover:text-green-500 transition-colors">
                                    {tour.title}
                                </h3>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-sm text-muted-foreground">{tour.duration}</span>
                                    <span className="font-bold text-green-500">Ksh {tour.price}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cart & Checkout */}
                <div className="space-y-4">
                    {/* Customer Info */}
                    <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <User className="w-5 h-5 text-muted-foreground" />
                            <h3 className="font-medium">Customer Details</h3>
                        </div>
                        <div className="space-y-2">
                            <Input
                                placeholder="Customer Name *"
                                value={customer.name}
                                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                            />
                            <Input
                                type="email"
                                placeholder="Email *"
                                value={customer.email}
                                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                            />
                            <Input
                                placeholder="Phone"
                                value={customer.phone}
                                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                            />
                            <Input
                                type="date"
                                value={tripDate}
                                onChange={(e) => setTripDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Cart Items */}
                    <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium">Cart ({cart.length})</h3>
                            {cart.length > 0 && (
                                <button
                                    onClick={clearCart}
                                    className="text-xs text-destructive hover:underline"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        {cart.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                Click on tours to add to cart
                            </p>
                        ) : (
                            <div className="space-y-3 max-h-48 overflow-y-auto">
                                {cart.map(item => (
                                    <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-background">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">Ksh {item.unitPrice} each</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="p-1 rounded hover:bg-muted"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="p-1 rounded hover:bg-muted"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="p-1 rounded hover:bg-destructive/10 text-destructive ml-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                        <h3 className="font-medium mb-3">Payment Method</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {paymentMethods.map(method => (
                                <button
                                    key={method.id}
                                    onClick={() => setPaymentMethod(method.id)}
                                    className={`p-3 rounded-lg border text-center transition-all ${paymentMethod === method.id
                                        ? 'border-green-500 bg-green-500/10 text-green-500'
                                        : 'border-border hover:border-muted-foreground'
                                        }`}
                                >
                                    <method.icon className="w-5 h-5 mx-auto mb-1" />
                                    <span className="text-xs">{method.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Discount */}
                    <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                        <label className="text-sm text-muted-foreground">Discount (Ksh)</label>
                        <Input
                            type="number"
                            min="0"
                            value={discount}
                            onChange={(e) => setDiscount(Math.max(0, parseInt(e.target.value) || 0))}
                            className="mt-1"
                        />
                    </div>

                    {/* Totals */}
                    <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>Ksh {subtotal.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-sm text-green-500">
                                <span>Discount</span>
                                <span>-Ksh {discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                            <span>Total</span>
                            <span className="text-green-500">Ksh {total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Process Button */}
                    <Button
                        onClick={processSale}
                        disabled={cart.length === 0 || isProcessing}
                        className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                    >
                        {isProcessing ? (
                            'Processing...'
                        ) : (
                            <>
                                <Receipt className="w-5 h-5 mr-2" />
                                Complete Sale (Ksh {total.toFixed(2)})
                            </>
                        )}
                    </Button>

                    {/* Last Transaction */}
                    {lastTransaction && (
                        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span className="font-medium text-green-500">Last Sale</span>
                            </div>
                            <div className="text-sm space-y-1">
                                <p>Receipt: {lastTransaction.receiptNumber}</p>
                                <p>Amount: Ksh {lastTransaction.total}</p>
                                <p>Customer: {lastTransaction.customer.name}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
