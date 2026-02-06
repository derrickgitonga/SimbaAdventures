import { SignIn, SignUp, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function CustomerAuth() {
    const { isSignedIn, isLoaded } = useUser();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string>('login');

    // Redirect to bookings if already signed in
    useEffect(() => {
        if (isLoaded && isSignedIn) {
            navigate('/my-bookings');
        }
    }, [isSignedIn, isLoaded, navigate]);

    // Show loading state while Clerk is initializing
    if (!isLoaded) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 container mx-auto px-4 py-20 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Loading...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1 container mx-auto px-4 py-20 flex items-center justify-center">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold text-center mb-8">My Account</h1>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Register</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <div className="flex justify-center">
                                <SignIn
                                    routing="path"
                                    path="/auth"
                                    signUpUrl="/auth"
                                    afterSignInUrl="/my-bookings"
                                    appearance={{
                                        elements: {
                                            rootBox: "w-full",
                                            card: "shadow-sm border rounded-xl bg-card",
                                            headerTitle: "hidden",
                                            headerSubtitle: "hidden",
                                            socialButtonsBlockButton: "border hover:bg-accent",
                                            formButtonPrimary: "bg-primary hover:bg-primary/90",
                                            footerActionLink: "text-primary hover:text-primary/90"
                                        }
                                    }}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="register">
                            <div className="flex justify-center">
                                <SignUp
                                    routing="path"
                                    path="/auth"
                                    signInUrl="/auth"
                                    afterSignUpUrl="/my-bookings"
                                    appearance={{
                                        elements: {
                                            rootBox: "w-full",
                                            card: "shadow-sm border rounded-xl bg-card",
                                            headerTitle: "hidden",
                                            headerSubtitle: "hidden",
                                            socialButtonsBlockButton: "border hover:bg-accent",
                                            formButtonPrimary: "bg-green-600 hover:bg-green-700",
                                            footerActionLink: "text-primary hover:text-primary/90"
                                        }
                                    }}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            <Footer />
        </div>
    );
}
