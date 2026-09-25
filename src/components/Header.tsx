import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VaylanceLogo from '@/components/VaylanceLogo';


const Logo = () => (
  <div className="flex items-center gap-2.5">
    <VaylanceLogo />
    <span className="text-lg font-bold text-foreground">Vaylance</span>
  </div>
);

// ===== Navigation Items =====
const navItems = [
  { label: 'Features', id: 'features' },
  { label: 'How it works', id: 'how-it-works' },
  { label: 'Pricing', id: 'pricing' },
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
      scrolled ? 'bg-background/90 backdrop-blur-xl border-b border-border/70' : 'bg-background/70 backdrop-blur-md'
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
              <Button
                variant="ghost"
                size="sm"
                key={idx}
                onClick={() => scrollTo(item.id)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="font-medium text-muted-foreground hover:text-foreground">
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="font-semibold px-5">
              <Link to="/auth">Create free account</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
           <Button
             variant="ghost"
             size="icon"
             className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
           </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background">
            <div className="flex flex-col gap-3 px-2">
              {navItems.map((item, idx) => (
                <Button
                  variant="ghost"
                  key={idx} 
                  onClick={() => scrollTo(item.id)} 
                  className="justify-start text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </Button>
              ))}
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <Button asChild variant="outline" size="sm">
                  <Link to="/auth">Sign in</Link>
                </Button>
                <Button asChild size="sm">
                   <Link to="/auth">Create free account</Link>
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
