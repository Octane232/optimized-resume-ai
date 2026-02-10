import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Github, Mail } from 'lucide-react';

const Footer = () => {
  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Resume Builder', href: '/resume-builder' },
        { label: 'Job Search', href: '/job-search' },
        { label: 'Templates', href: '/templates' },
        { label: 'AI Features', href: '/ai-features' },
        { label: 'Analytics', href: '/analytics' }
      ]
    },
    {
      title: 'Solutions',
      links: [
        { label: 'For Individuals', href: '/for-individuals' },
        { label: 'For Students', href: '/for-students' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about-us' },
        { label: 'Contact', href: '/contact' },
        { label: 'Affiliate Program', href: '/affiliate-program' }
      ]
    }
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="relative bg-card border-t border-border overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 max-w-7xl relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center mb-4 sm:mb-6">
              <Link to="/" className="flex items-center">
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">
                  Vaylance
                </span>
              </Link>
            </div>
            <p className="text-muted-foreground mb-6 sm:mb-8 leading-relaxed text-xs sm:text-sm">
              Create professional resumes in minutes. Built for job seekers who want results.
            </p>
            <div className="flex gap-2 sm:gap-3">
              {[
                { Icon: Linkedin, href: 'https://linkedin.com/company/vaylance' },
                { Icon: Twitter, href: 'https://x.com/vaylance' },
                { Icon: Github, href: 'https://github.com/vaylance' },
                { Icon: Mail, href: 'mailto:contact@vaylance.com' }
              ].map(({ Icon, href }, i) => (
                <a 
                  key={i}
                  href={href} 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-border hover:border-foreground flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-3 sm:mb-4 text-foreground text-xs sm:text-sm">{section.title}</h3>
              <ul className="space-y-2 sm:space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.href.startsWith('/') ? (
                      <Link 
                        to={link.href} 
                        className="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <button 
                        onClick={() => scrollToSection(link.href)}
                        className="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm text-left"
                      >
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-muted-foreground text-xs sm:text-sm">
              © {new Date().getFullYear()} Vaylance. All rights reserved.
            </p>
            <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
              <Link to="/cookie-policy" className="text-muted-foreground hover:text-foreground transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
