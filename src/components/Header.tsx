
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Templates', href: '#templates' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Login', href: '#login' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold gradient-text">AI Resume Pro</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-600 hover:text-navy-600 transition-colors duration-200 font-medium"
              >
                {item.label}
              </a>
            ))}
            <Button className="gradient-bg hover:opacity-90 transition-opacity">
              Get Started
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-600 hover:text-navy-600 transition-colors duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <Button className="gradient-bg hover:opacity-90 transition-opacity w-full">
                Get Started
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
