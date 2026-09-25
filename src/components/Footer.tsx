import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VaylanceLogo from '@/components/VaylanceLogo';


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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <VaylanceLogo width={24} height={24} />
              <span className="font-bold text-lg text-foreground tracking-tight">Vaylance</span>
            </Link>
            <p className="text-base text-muted-foreground leading-relaxed max-w-sm mb-5">
              Hiring signals and resume tools for reaching companies before the job is posted.
            </p>
            <Button asChild variant="outline"><Link to="/contact"><Mail className="w-4 h-4" /> Contact support <ArrowUpRight className="w-4 h-4" /></Link></Button>
          </div>

          {navSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <Link to={link.to} className="text-base text-muted-foreground hover:text-foreground transition-colors">
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
          <p className="text-xs text-muted-foreground">Career tools for a more focused job search.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
