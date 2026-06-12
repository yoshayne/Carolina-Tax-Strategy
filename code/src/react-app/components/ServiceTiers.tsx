import { Link } from 'react-router';
import { Check } from 'lucide-react';

interface TierFeature {
  text: string;
}

interface ServiceTier {
  name: string;
  label: string;
  price: string;
  priceNote?: string;
  bestFor: string;
  features: TierFeature[];
  cta: string;
  ctaLink: string;
  popular?: boolean;
}

const tiers: ServiceTier[] = [
  {
    name: 'GOOD',
    label: 'Tax Prep Only',
    price: 'Starting at $400',
    bestFor: 'Stable income, minimal complexity',
    features: [
      { text: 'Federal + state filing' },
      { text: 'Basic compliance review' },
      { text: 'Standard deduction analysis' },
      { text: 'E-file with confirmation' },
    ],
    cta: 'Book Basic Prep',
    ctaLink: '/book',
  },
  {
    name: 'BETTER',
    label: 'Strategy + Filing',
    price: 'Starting at $1,900',
    priceNote: 'Plan delivered in 7–14 days',
    bestFor: 'Business owners & high earners who want legal savings',
    features: [
      { text: 'Annual strategy plan' },
      { text: 'Quarterly projections' },
      { text: 'Entity structure review' },
      { text: 'Tax filing included' },
      { text: 'Audit-ready documentation' },
    ],
    cta: 'Start Your Strategy',
    ctaLink: '/book',
    popular: true,
  },
  {
    name: 'BEST',
    label: 'Year-Round Advisory',
    price: 'Starting at $500',
    priceNote: 'per month',
    bestFor: 'Growing revenue, complex multi-income streams',
    features: [
      { text: 'Monthly advisory calls' },
      { text: 'Quarterly tax management' },
      { text: 'Year-end execution oversight' },
      { text: 'Proactive planning updates' },
      { text: 'Priority support access' },
      { text: 'All Strategy + Filing benefits' },
    ],
    cta: 'Apply for Advisory',
    ctaLink: '/book',
  },
];

export default function ServiceTiers() {
  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-navy-900 mb-4">
            Choose Your Level of Control
          </h2>
          <p className="text-lg text-navy-600 max-w-2xl mx-auto">
            From straightforward filing to comprehensive year-round strategy—find the service that matches your needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <TierCard key={tier.name} tier={tier} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TierCard({ tier }: { tier: ServiceTier }) {
  const isPopular = tier.popular;

  return (
    <div
      className={`relative bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isPopular ? 'ring-2 ring-gold md:scale-105' : ''
      }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute top-4 right-4">
          <span className="bg-gold text-white text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full">
            Popular
          </span>
        </div>
      )}

      {/* Card Header */}
      <div className={`p-6 pb-4 ${isPopular ? 'bg-navy-900 text-white' : 'bg-gray-100'}`}>
        <p className={`text-sm font-bold uppercase tracking-wider mb-1 ${isPopular ? 'text-gold' : 'text-teal'}`}>
          {tier.name}
        </p>
        <h3 className={`text-xl font-semibold mb-3 ${isPopular ? 'text-white' : 'text-navy-900'}`}>
          {tier.label}
        </h3>
        <div className="flex items-baseline gap-1">
          <span className={`text-3xl font-bold ${isPopular ? 'text-white' : 'text-navy-900'}`}>
            {tier.price}
          </span>
          {tier.priceNote && (
            <span className={`text-sm ${isPopular ? 'text-white/70' : 'text-navy-500'}`}>
              {tier.priceNote}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col">
        <p className="text-sm text-navy-600 mb-4">
          <span className="font-semibold text-navy-800">Best for:</span> {tier.bestFor}
        </p>

        {/* Features List */}
        <ul className="space-y-3 mb-6 flex-1">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 bg-teal/10 rounded-full flex items-center justify-center mt-0.5">
                <Check className="w-3 h-3 text-teal" />
              </div>
              <span className="text-navy-700">{feature.text}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Link
          to={tier.ctaLink}
          className={`block w-full text-center font-semibold py-3 rounded transition-colors duration-200 ${
            isPopular
              ? 'bg-gold hover:bg-gold-dark text-white'
              : 'bg-navy-900 hover:bg-navy-800 text-white'
          }`}
        >
          {tier.cta}
        </Link>
      </div>
    </div>
  );
}
