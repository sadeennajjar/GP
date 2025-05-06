import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-kitchance-navy-dark font-cursive text-5xl font-bold">KitChance</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="font-medium hover:text-kitchance-navy-dark transition-colors">
            Home
          </Link>
          <Link to="/features" className="font-medium hover:text-kitchance-navy-dark transition-colors">
            Features
          </Link>
          <Link to="/how-it-works" className="font-medium hover:text-kitchance-navy-dark transition-colors">
            How It Works
          </Link>
          <Link to="/about-remy" className="font-medium hover:text-kitchance-navy-dark transition-colors">
            About Remy
          </Link>
          <Link to="/contact" className="font-medium hover:text-kitchance-navy-dark transition-colors">
            Contact
          </Link>
          {/* ✅ Desktop Login Button */}
          <Button asChild variant="default" className="rounded-full px-6">
            <Link to="/auth">Start Designing</Link>
          </Button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden pt-20`}
      >
        <nav className="flex flex-col items-center space-y-6 p-8">
          <Link to="/" className="text-xl font-medium" onClick={closeMenu}>
            Home
          </Link>
          <Link to="/features" className="text-xl font-medium" onClick={closeMenu}>
            Features
          </Link>
          <Link to="/how-it-works" className="text-xl font-medium" onClick={closeMenu}>
            How It Works
          </Link>
          <Link to="/about-remy" className="text-xl font-medium" onClick={closeMenu}>
            About Remy
          </Link>
          <Link to="/contact" className="text-xl font-medium" onClick={closeMenu}>
            Contact
          </Link>
          {/* ✅ Mobile Login Button */}
          <Button asChild variant="default" className="rounded-full px-8 py-6 w-full">
            <Link to="/auth" onClick={closeMenu}>Start Designing</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
