import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle scroll effect for header background
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', onScroll);
    
    // Cleanup event listener on unmount
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Smooth scroll to section and close mobile menu
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  // Navigation items
  const navItems = [
    { label: 'Features', id: 'features' },
    { label: 'Pricing', id: 'pricing' },
  ];

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${
          scrolled
            ? 'bg-background/95 backdrop-blur border-b border-border shadow-sm'
            : 'bg-transparent'
        }
      `}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-bold text-xl text-foreground tracking-tight">
            Vaylance
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="font-medium">
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="font-semibold">
              <Link to="/auth">Get started free</Link>
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

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background">
            <div className="flex flex-col gap-3 px-2">
              {/* Mobile Navigation Items */}
              <button
                onClick={() => scrollTo('features')}
                className="text-sm font-medium text-muted-foreground hover:text-foreground py-2 text-left"
              >
                Features
              </button>
              <button
                onClick={() => scrollTo('pricing')}
                className="text-sm font-medium text-muted-foreground hover:text-foreground py-2 text-left"
              >
                Pricing
              </button>

              {/* Mobile Actions */}
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <Button asChild variant="outline" size="sm">
                  <Link to="/auth">Sign in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/auth">Get started free</Link>
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
