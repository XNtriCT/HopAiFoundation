import { useEffect, useState } from 'react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'What We Do', href: '#what-we-do' },
  { name: 'Partnerships', href: '#partnerships' },
  { name: 'Contact', href: '#contact' }
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      
      // Simple scrollspy
      const sections = LINKS.map(link => document.querySelector(link.href));
      const scrollPos = window.scrollY + 200;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i] as HTMLElement;
        if (section && section.offsetTop <= scrollPos) {
          setActiveLink(LINKS[i].name);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled ? 'bg-background/80 backdrop-blur-md border-b border-secondary/30 py-3' : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-3 relative z-10 group" onClick={() => setMobileOpen(false)}>
          <img 
            src="/HOP_AI_logo.svg" 
            alt="HOP AI Logo" 
            className="w-8 h-8 md:w-9 md:h-9 object-contain group-hover:scale-110 transition-transform duration-300" 
          />
          <span className="font-display font-bold text-xl md:text-2xl tracking-tight text-foreground">
            HOP AI Foundation
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center relative liquid-glass rounded-full px-2 py-1">
          {LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setActiveLink(link.name)}
              className="relative px-5 py-2 text-sm font-medium transition-colors hover:text-foreground"
            >
              {activeLink === link.name && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute inset-0 bg-primary/10 rounded-full border border-primary/25 -z-10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className={cn('relative z-10', activeLink === link.name ? 'text-primary font-bold' : 'text-muted-foreground')}>
                {link.name}
              </span>
            </a>
          ))}
        </div>

        <div className="hidden md:block">
           <a 
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-primary hover:bg-primary/95 text-white font-bold text-sm shadow-md shadow-primary/20 hover:scale-105 transition-all duration-300"
           >
              Get Involved
           </a>
        </div>

        {/* Mobile Toggle */}
        <button 
           className="md:hidden relative z-10 p-2 text-foreground"
           onClick={() => setMobileOpen(!mobileOpen)}
           aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div className={cn(
        "fixed inset-0 bg-background/95 backdrop-blur-xl z-0 transition-opacity duration-300 md:hidden flex flex-col justify-center items-center gap-8",
        mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
         {LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => {
                setActiveLink(link.name);
                setMobileOpen(false);
              }}
              className="text-2xl font-display font-bold text-foreground"
            >
              {link.name}
            </a>
          ))}
          <a 
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="mt-4 inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary hover:bg-primary/95 text-white font-bold text-lg shadow-md shadow-primary/20 hover:scale-105 transition-all duration-300"
           >
              Get Involved
           </a>
      </div>
    </nav>
  );
}
