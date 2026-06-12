import { Link } from 'react-router';
import { Mail, Phone, MapPin, Linkedin, Facebook } from 'lucide-react';

const quickLinks = [
  { label: 'Services & Pricing', href: '/services' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Resources', href: '/resources' },
  { label: 'Book a Session', href: '/book' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Disclaimer', href: '/terms' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-navy-900">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img
                src="/logo.png"
                alt="Carolina Tax Strategy"
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-navy-700 text-sm mb-6">
              Strategic tax planning for business owners, investors, and high earners in the Carolinas and beyond.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-navy-100 hover:bg-teal hover:text-white text-navy-700 rounded-lg flex items-center justify-center transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-navy-100 hover:bg-teal hover:text-white text-navy-700 rounded-lg flex items-center justify-center transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-navy-900 mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-navy-700 hover:text-teal transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-navy-900 mb-4">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-navy-700 hover:text-teal transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-navy-900 mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info@carolinataxstrategy.com"
                  className="flex items-center gap-3 text-navy-700 hover:text-teal transition-colors duration-200"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  info@carolinataxstrategy.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+18446411040"
                  className="flex items-center gap-3 text-navy-700 hover:text-teal transition-colors duration-200"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  (844) 641-1040
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-navy-700">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Charlotte, NC
                    <br />
                    Serving clients nationwide
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Compliance Section */}
      <div className="border-t border-navy-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-xs text-navy-600 leading-relaxed mb-4">
            <strong>Disclaimer:</strong> Carolina Tax Strategy provides professional tax preparation and strategic tax planning services for businesses and individuals. Tax outcomes vary based on individual circumstances, and past results do not guarantee future performance. Nothing on this website constitutes legal or financial advice specific to your situation.
          </p>
          <p className="text-xs text-navy-600 leading-relaxed mb-4">
            <strong>Confidentiality:</strong> Your information is kept strictly confidential. We only share your tax information with the IRS and relevant state tax authorities when filing your returns. Client information is never shared with third parties without your explicit consent.
          </p>
          <p className="text-xs text-navy-600 leading-relaxed">
            Carolina Tax Strategy is not affiliated with the IRS or any government agency. The information provided is for general informational purposes only. Contact us to discuss your specific tax situation.
          </p>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-navy-200 bg-navy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-navy-600">
            <p>© {currentYear} Carolina Tax Strategy. All rights reserved.</p>
            <p>Designed with strategy in mind.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
