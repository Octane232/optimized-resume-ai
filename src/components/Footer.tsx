
import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Github, Mail } from 'lucide-react';
import logo from '@/assets/pitchsora-logo.png';

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
        { label: 'Contact', href: '/contact' }
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
      <div className="container mx-auto px-4 lg:px-8 py-20 max-w-7xl relative">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-6">
              <Link to="/" className="flex items-center">
                <img src={logo} alt="Pitchsora" className="h-36 w-auto object-contain" />
              </Link>
            </div>
            <p className="text-muted-foreground mb-8 leading-relaxed text-sm">
              Create professional resumes in minutes. Built for job seekers who want results.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Linkedin, href: '#' },
                { Icon: Twitter, href: '#' },
                { Icon: Github, href: '#' },
                { Icon: Mail, href: 'mailto:contact-us@pitchsora.com' }
              ].map(({ Icon, href }, i) => (
                <a 
                  key={i}
                  href={href} 
                  className="w-10 h-10 rounded-lg border border-border hover:border-foreground flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-4 text-foreground text-sm">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.href.startsWith('/') ? (
                      <Link 
                        to={link.href} 
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <button 
                        onClick={() => scrollToSection(link.href)}
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm text-left"
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
        <div className="container mx-auto px-4 lg:px-8 py-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © 2024 Pitchsora. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
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
