import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ===== Logo Components =====
const VaylanceLogo = () => (
  <svg width="28" height="28" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <rect width="48" height="48" rx="11" fill="#1d4ed8"/>
    <circle cx="22" cy="27" r="11" stroke="white" strokeWidth="2.2" fill="none"/>
    <circle cx="22" cy="27" r="6.5" stroke="white" strokeWidth="1.6" strokeOpacity="0.6" fill="none"/>
    <circle cx="22" cy="27" r="2.6" fill="white"/>
    <line x1="29.5" y1="19.5" x2="36" y2="13" stroke="white" strokeWidth="1.9" strokeLinecap="round"/>
    <line x1="32.5" y1="13" x2="36" y2="13" stroke="white" strokeWidth="1.9" strokeLinecap="round"/>
    <line x1="36" y1="13" x2="36" y2="16.5" stroke="white" strokeWidth="1.9" strokeLinecap="round"/>
  </svg>
);

const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <VaylanceLogo />
    <span style={{ fontWeight: 700, fontSize: 20, color: 'white', letterSpacing: '-0.02em' }}>Vaylance</span>
  </div>
);

// ===== Navigation Items =====
const navItems = [
  { label: 'Product', id: 'features' },
  { label: 'Features', id: 'features' },
  { label: 'Pricing', id: 'pricing' },
  { label: 'Resources', id: 'features' },
  { label: 'Company', id: 'features' },
];

// ===== Main Header Component =====
const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border/50' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => scrollTo(item.id)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                {item.label}
                {(item.label === 'Product' || item.label === 'Resources' || item.label === 'Company') && (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="font-medium text-muted-foreground hover:text-foreground">
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="font-semibold bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg shadow-blue-500/20 px-5">
              <Link to="/auth">Get Started Free</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background">
            <div className="flex flex-col gap-3 px-2">
              {navItems.map((item, idx) => (
                <button 
                  key={idx} 
                  onClick={() => scrollTo(item.id)} 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground py-2 text-left"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <Button asChild variant="outline" size="sm">
                  <Link to="/auth">Sign in</Link>
                </Button>
                <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-violet-600 text-white">
                  <Link to="/auth">Get Started Free</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
