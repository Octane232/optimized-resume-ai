import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Sun, Moon, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';
import logo from '@/assets/pitchvaya-icon.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { label: 'How Vaya Works', href: '#how-it-works' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 header-glass z-50 transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5">
            <img src={logo} alt="PitchVaya" className="h-8 w-8 object-contain mix-blend-multiply dark:mix-blend-screen" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">
              PitchVaya
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="text-foreground/70 hover:text-foreground transition-colors duration-200 font-semibold text-sm relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-foreground/70 hover:text-foreground"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-foreground/70 hover:text-foreground font-semibold">
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button asChild size="sm" className="saas-button font-bold">
              <Link to="/auth" className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Chat with Vaya
              </Link>
            </Button>
          </div>

          <button
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border glass-card-strong">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="text-foreground/70 hover:text-foreground transition-colors duration-200 font-semibold text-sm py-2 text-left px-4"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border px-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="justify-start text-foreground/70 font-semibold"
                >
                  {theme === 'dark' ? <Sun size={18} className="mr-2" /> : <Moon size={18} className="mr-2" />}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </Button>
                <Button asChild variant="ghost" size="sm" className="justify-start font-semibold">
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button asChild size="sm" className="saas-button font-bold">
                  <Link to="/auth" className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Chat with Vaya
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
