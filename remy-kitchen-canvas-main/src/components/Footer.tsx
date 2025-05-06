import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="text-3xl font-cursive text-kitchance-navy-dark">KitChance</Link>
            <p className="mt-4 text-gray-600">
              Design your dream kitchen with Remy, your AI kitchen design assistant.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-kitchance-navy-dark hover:text-kitchance-blue-medium transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-kitchance-navy-dark hover:text-kitchance-blue-medium transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-kitchance-navy-dark hover:text-kitchance-blue-medium transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-gray-600 hover:text-kitchance-teal transition-colors">Home</Link>
              <Link to="/features" className="text-gray-600 hover:text-kitchance-teal transition-colors">Features</Link>
              <Link to="/how-it-works" className="text-gray-600 hover:text-kitchance-teal transition-colors">How It Works</Link>
              <Link to="/about-remy" className="text-gray-600 hover:text-kitchance-teal transition-colors">About Remy</Link>
              <Link to="/contact" className="text-gray-600 hover:text-kitchance-teal transition-colors">Contact</Link>
            </nav>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-kitchance-navy-dark" />
                <span className="text-gray-600">info@kitchance.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-kitchance-navy-dark" />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-bold text-lg mb-4">Newsletter</h4>
            <p className="text-gray-600 mb-4">Stay updated with the latest kitchen design trends.</p>
            <form className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-kitchance-teal"
              />
              <button 
                type="submit" 
                className="bg-kitchance-navy-dark text-white py-2 px-4 rounded-full hover:bg-kitchance-blue-deep transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} KitChance. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;