import { Link } from 'react-router';
import { ArrowRight, Download, Clock } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="relative bg-navy-900 py-16 lg:py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Urgency Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-white/90 text-sm mb-8">
          <Clock className="w-4 h-4" />
          Limited strategy sessions available this month
        </div>

        {/* Headline */}
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-6">
          Every Day You Wait Is Money Left on the Table
        </h2>

        {/* Subheadline */}
        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          Book your free 30-minute planning session today. We'll identify at least 3 strategies to reduce your 2026 tax liability.
        </p>

        {/* Primary CTA */}
        <Link
          to="/book"
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-navy-900 font-bold text-lg px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl group mb-6"
        >
          Claim Your Strategy Session
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>

        {/* Secondary CTA */}
        <div className="mt-6">
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200 group"
          >
            <Download className="w-4 h-4" />
            Not ready? Download the 2026 Tax Checklist
            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
          </Link>
        </div>

        {/* Trust Text */}
        <p className="mt-10 text-sm text-white/50">
          No obligation • 100% confidential • Results-focused conversation
        </p>
      </div>
    </section>
  );
}
