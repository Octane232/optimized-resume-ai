import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Navigation links data
  const navSections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', to: '/#features' },
        { label: 'Pricing', to: '/#pricing' },
        { label: 'Sign in', to: '/auth' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', to: '/about-us' },
        { label: 'Contact', to: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', to: '/privacy' },
        { label: 'Terms of Service', to: '/terms' },
        { label: 'Cookie Policy', to: '/cookie-policy' },
      ],
    },
  ];

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1">
            <Link 
              to="/" 
              className="font-bold text-xl text-foreground tracking-tight"
            >
              Vaylance
            </Link>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-xs">
              The AI job search platform that helps you get hired faster.
            </p>
          </div>

          {/* Navigation Sections */}
          {navSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Vaylance. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            contact@vaylance.com
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
