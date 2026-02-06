import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Mountain, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/tours', label: 'Adventures' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground group-hover:bg-accent transition-colors duration-300">
              <Mountain className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="font-heading font-bold text-lg md:text-xl text-foreground">
              Simba<span className="text-accent">Adventures</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`font-medium transition-colors duration-300 hover:text-accent ${location.pathname === link.href
                  ? 'text-accent'
                  : 'text-foreground/80'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+254700000000" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">+254 700 000 000</span>
            </a>

            {/* Clerk Authentication */}
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">Sign In</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9"
                  }
                }}
              />
            </SignedIn>

            <Button asChild className="btn-adventure">
              <Link to="/tours">Book Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`py-3 px-4 rounded-lg font-medium transition-colors ${location.pathname === link.href
                    ? 'bg-accent/10 text-accent'
                    : 'text-foreground hover:bg-muted'
                    }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Authentication */}
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline" className="mt-2">Sign In</Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link
                  to="/my-bookings"
                  onClick={() => setIsOpen(false)}
                  className="py-3 px-4 rounded-lg font-medium text-foreground hover:bg-muted transition-colors"
                >
                  My Bookings
                </Link>
              </SignedIn>

              <Button asChild className="btn-adventure mt-2">
                <Link to="/tours" onClick={() => setIsOpen(false)}>
                  Book Your Adventure
                </Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
