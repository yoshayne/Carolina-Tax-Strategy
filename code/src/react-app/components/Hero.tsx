import { Link } from 'react-router';
import { Lock, MapPin, ClipboardCheck } from 'lucide-react';
const HERO_IMAGE = '/hero.png';
export default function Hero() {
  return <section className="bg-white">
      {/* Main Hero */}
      <div className="relative min-h-[600px] lg:min-h-[700px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Professional tax planning workspace" className="w-full h-full object-cover" />
          {/* White gradient overlay for text visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 w-full">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.25rem] leading-tight text-navy-900 mb-6">Your 2025 Tax Outcome 
Is Being Decided Right Now</h1>
            <p className="text-lg text-navy-700 mb-8 leading-relaxed">
              High earners and business owners don't "file taxes"—they engineer the outcome legally before the year ends. If you're waiting until March to think about taxes, you're already paying the default rate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/book" className="bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-3.5 rounded text-center transition-colors duration-200 shadow-md hover:shadow-lg">
                Build Your 2026 Plan
              </Link>
              <Link to="/services" className="border-2 border-navy-800 text-navy-800 hover:bg-navy-50 font-semibold px-8 py-3.5 rounded text-center transition-colors duration-200">
                View Our Services
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <TrustItem icon={<Lock className="w-6 h-6 text-teal" />} title="Encrypted" subtitle="Document Portal" />
            <TrustItem icon={<MapPin className="w-6 h-6 text-teal" />} title="Multi-State Expertise:" subtitle="NC/SC & National" showDivider />
            <TrustItem icon={<ClipboardCheck className="w-6 h-6 text-teal" />} title="Audit-Ready" subtitle="Documentation Standards" showDivider />
          </div>
        </div>
      </div>
    </section>;
}
function TrustItem({
  icon,
  title,
  subtitle,
  showDivider = false
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  showDivider?: boolean;
}) {
  return <div className={`flex items-center gap-4 ${showDivider ? 'md:border-l md:border-gray-300 md:pl-8' : ''}`}>
      <div className="flex-shrink-0 w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-navy-900">{title}</p>
        <p className="text-navy-600">{subtitle}</p>
      </div>
    </div>;
}