
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-aurum-navy text-white pt-12 pb-6">
      <div className="aurum-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-aurum-gold">AurumEscape</h3>
            <p className="text-sm text-gray-300">
              Discover extraordinary rental experiences at premium destinations worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-aurum-gold transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-aurum-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-aurum-gold transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/explore" className="hover:text-aurum-gold transition-colors">Find Stays</Link></li>
              <li><Link to="/explore?category=luxury" className="hover:text-aurum-gold transition-colors">Luxury Properties</Link></li>
              <li><Link to="/explore?category=beach" className="hover:text-aurum-gold transition-colors">Beach Escapes</Link></li>
              <li><Link to="/explore?category=mountain" className="hover:text-aurum-gold transition-colors">Mountain Retreats</Link></li>
              <li><Link to="/explore?category=urban" className="hover:text-aurum-gold transition-colors">Urban Experiences</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Host</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/host" className="hover:text-aurum-gold transition-colors">Become a Host</Link></li>
              <li><Link to="/host/resources" className="hover:text-aurum-gold transition-colors">Hosting Resources</Link></li>
              <li><Link to="/host/responsible" className="hover:text-aurum-gold transition-colors">Responsible Hosting</Link></li>
              <li><Link to="/host/community" className="hover:text-aurum-gold transition-colors">Host Community</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/help-center" className="hover:text-aurum-gold transition-colors">Help Center</Link></li>
              <li><Link to="/cancellation-options" className="hover:text-aurum-gold transition-colors">Cancellation Options</Link></li>
              <li><Link to="/trust-safety" className="hover:text-aurum-gold transition-colors">Trust & Safety</Link></li>
              <li><Link to="/contact" className="hover:text-aurum-gold transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-700 text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div>
            &copy; {currentYear} AurumEscape. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link to="/privacy" className="hover:text-aurum-gold transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-aurum-gold transition-colors">Terms</Link>
            <Link to="/sitemap" className="hover:text-aurum-gold transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
