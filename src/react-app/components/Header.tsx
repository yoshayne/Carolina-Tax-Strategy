import { useState } from 'react';
import { Link } from 'react-router';
import { Menu, X } from 'lucide-react';

const LOGO_URL = '/logo.png';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Services & Pricing', href: '/services' },
    { name: 'File My Taxes', href: '/file-taxes' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Resources', href: '/resources' },
  ];

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src={LOGO_URL}
              alt="Carolina Tax Strategy, LLC"
              className="h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-navy-800 hover:text-teal font-medium transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/book"
              className="bg-gold hover:bg-gold-dark text-white font-semibold px-6 py-2.5 rounded transition-colors duration-200"
            >
              Book Strategy
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-navy-800 p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-navy-800 hover:text-teal font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/book"
                className="bg-gold hover:bg-gold-dark text-white font-semibold px-6 py-2.5 rounded text-center transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book Strategy
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
