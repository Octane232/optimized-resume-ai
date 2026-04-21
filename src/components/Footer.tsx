import React from 'react';
import { Link } from 'react-router-dom';

const VaylanceLogo = () => (
  <svg width="24" height="24" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <rect width="48" height="48" rx="11" fill="#1d4ed8"/>
    <circle cx="22" cy="27" r="11" stroke="white" strokeWidth="2.2" fill="none"/>
    <circle cx="22" cy="27" r="6.5" stroke="white" strokeWidth="1.6" strokeOpacity="0.6" fill="none"/>
    <circle cx="22" cy="27" r="2.6" fill="white"/>
    <line x1="29.5" y1="19.5" x2="36" y2="13" stroke="white" strokeWidth="1.9" strokeLinecap="round"/>
    <line x1="32.5" y1="13" x2="36" y2="13" stroke="white" strokeWidth="1.9" strokeLinecap="round"/>
    <line x1="36" y1="13" x2="36" y2="16.5" stroke="white" strokeWidth="1.9" strokeLinecap="round"/>
  </svg>
);

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

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <VaylanceLogo />
              <span className="font-bold text-lg text-foreground tracking-tight">Vaylance</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The AI job search platform that helps you get hired faster.
            </p>
          </div>

          {navSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© {currentYear} Vaylance. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">contact@vaylance.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
