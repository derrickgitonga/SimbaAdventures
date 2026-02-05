import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Lock, Phone } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function CustomerAuth() {

    const { login, register } = useUserAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Login State
    const [lEmail, setLEmail] = useState('');
    const [lPass, setLPass] = useState('');

    // Register State
    const [rName, setRName] = useState('');
    const [rEmail, setREmail] = useState('');
    const [rPass, setRPass] = useState('');
    const [rPhone, setRPhone] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (await login(lEmail, lPass)) {
            navigate('/my-bookings');
        } else {
            alert('Login failed');
        }
        setLoading(false);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (await register(rName, rEmail, rPass, rPhone)) {
            navigate('/my-bookings');
        } else {
            alert('Registration failed');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1 container mx-auto px-4 py-20 flex items-center justify-center">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold text-center mb-8">My Account</h1>

                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Register</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <form onSubmit={handleLogin} className="space-y-4 p-6 border rounded-xl bg-card shadow-sm">
                                <div className="space-y-2">
                                    <label>Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input className="pl-10" value={lEmail} onChange={e => setLEmail(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label>Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input type="password" className="pl-10" value={lPass} onChange={e => setLPass(e.target.value)} required />
                                    </div>
                                </div>
                                <Button className="w-full" disabled={loading}>
                                    {loading ? 'Processing...' : 'Login'}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="register">
                            <form onSubmit={handleRegister} className="space-y-4 p-6 border rounded-xl bg-card shadow-sm">
                                <div className="space-y-2">
                                    <label>Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input className="pl-10" value={rName} onChange={e => setRName(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label>Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input type="email" className="pl-10" value={rEmail} onChange={e => setREmail(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label>Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input className="pl-10" value={rPhone} onChange={e => setRPhone(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label>Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input type="password" className="pl-10" value={rPass} onChange={e => setRPass(e.target.value)} required />
                                    </div>
                                </div>
                                <Button className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            <Footer />
        </div>
    );
}
