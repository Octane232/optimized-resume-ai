import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import VaylanceLogo from '@/components/VaylanceLogo';

const navItems = [
  { label: 'Home', href: '#top' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', to: '/about-us' },
];

export const Logo = () => (
  <span className="flex items-center gap-2.5">
    <VaylanceLogo width={40} height={40} />
    <span className="text-[21px] font-semibold text-vy-text">Vaylance</span>
  </span>
);

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute top-0 inset-x-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
        <Link to="/" aria-label="Vaylance home"><Logo /></Link>

        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((n, i) =>
            n.to ? (
              <Link key={n.label} to={n.to} className="text-sm text-vy-dim hover:text-vy-text transition-colors">{n.label}</Link>
            ) : (
              <a key={n.label} href={n.href} className={`relative text-sm transition-colors ${i === 0 ? 'text-vy-glow' : 'text-vy-dim hover:text-vy-text'}`}>
                {n.label}
                {i === 0 && <span className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full bg-vy-glow" />}
              </a>
            )
          )}
        </nav>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/auth" className="text-sm text-vy-dim hover:text-vy-text">Sign In</Link>
          <Link to="/auth" className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-vy-teal text-vy-text text-sm font-semibold hover:bg-vy-glow transition-colors">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <button className="md:hidden p-2 text-vy-text" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden mx-4 rounded-xl border border-vy-line bg-vy-panel p-4 flex flex-col gap-3">
          {navItems.map((n) =>
            n.to ? <Link key={n.label} to={n.to} className="text-sm text-vy-dim py-1">{n.label}</Link>
              : <a key={n.label} href={n.href} onClick={() => setOpen(false)} className="text-sm text-vy-dim py-1">{n.label}</a>
          )}
          <Link to="/auth" className="text-sm text-vy-dim py-1">Sign In</Link>
          <Link to="/auth" className="h-10 rounded-lg bg-vy-teal text-vy-text text-sm font-semibold flex items-center justify-center">Get Started Free</Link>
        </div>
      )}
    </header>
  );
};

export default Header;
