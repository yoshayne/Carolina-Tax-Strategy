import { Link } from 'react-router';
import { Briefcase, Building2, Home, ArrowRight } from 'lucide-react';

interface AudienceBlock {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  image: string;
  ctaText: string;
}

const audiences: AudienceBlock[] = [
  {
    id: 'w2-side-hustle',
    icon: <Briefcase className="w-8 h-8" />,
    title: 'W-2 + Side Hustle',
    subtitle: 'Dual Income Earners',
    description:
      "You're in the highest-risk group for surprise tax bills. We build legal, simple tax plans that account for both income streams.",
    benefits: [
      'Withholding optimization across income sources',
      'Quarterly estimated payment planning',
      'Side business expense tracking setup',
      'Self-employment tax strategy',
    ],
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80',
    ctaText: 'Get Your Dual-Income Plan',
  },
  {
    id: 'business-owners',
    icon: <Building2 className="w-8 h-8" />,
    title: '6-Figure Business Owners',
    subtitle: 'Growing Entrepreneurs',
    description:
      'At 6 figures, taxes become a profit leak without the right structure. Entity optimization, payroll strategy, and quarterly planning.',
    benefits: [
      'Entity structure optimization (LLC, S-Corp)',
      'Reasonable compensation analysis',
      'Retirement account strategies',
      'Quarterly tax management',
    ],
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&auto=format&fit=crop&q=80',
    ctaText: 'Optimize Your Business Taxes',
  },
  {
    id: 'real-estate',
    icon: <Home className="w-8 h-8" />,
    title: 'Real Estate Investors',
    subtitle: 'Property Portfolio Owners',
    description:
      'Depreciation strategy, entity structuring, and clean tracking for repairs vs. improvements.',
    benefits: [
      'Cost segregation analysis',
      'Depreciation optimization',
      'Repairs vs. improvements tracking',
      '1031 exchange planning',
    ],
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&auto=format&fit=crop&q=80',
    ctaText: 'Maximize Your Property Deductions',
  },
];

export default function AudienceSections() {
  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-navy-900 mb-4">
            Tailored Strategies for Your Situation
          </h2>
          <p className="text-lg text-navy-600 max-w-2xl mx-auto">
            Different income types require different approaches. Find your path to optimized taxes.
          </p>
        </div>

        {/* Audience Blocks */}
        <div className="space-y-16 lg:space-y-24">
          {audiences.map((audience, index) => (
            <AudienceCard
              key={audience.id}
              audience={audience}
              reversed={index % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function AudienceCard({
  audience,
  reversed,
}: {
  audience: AudienceBlock;
  reversed: boolean;
}) {
  return (
    <div
      className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
        reversed ? 'lg:flex-row-reverse' : ''
      }`}
    >
      {/* Image */}
      <div className={`${reversed ? 'lg:order-2' : 'lg:order-1'}`}>
        <div className="relative">
          <img
            src={audience.image}
            alt={audience.title}
            className="w-full h-64 lg:h-80 object-cover rounded-xl shadow-lg"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-navy-900/20 to-transparent rounded-xl" />
          {/* Icon Badge */}
          <div className="absolute -bottom-4 -right-4 lg:-right-6 w-16 h-16 bg-teal rounded-xl shadow-lg flex items-center justify-center text-white">
            {audience.icon}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`${reversed ? 'lg:order-1' : 'lg:order-2'}`}>
        <p className="text-sm font-bold uppercase tracking-wider text-teal mb-2">
          {audience.subtitle}
        </p>
        <h3 className="font-serif text-2xl md:text-3xl text-navy-900 mb-4">
          {audience.title}
        </h3>
        <p className="text-lg text-navy-600 mb-6">{audience.description}</p>

        {/* Benefits List */}
        <ul className="space-y-3 mb-8">
          {audience.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-2 h-2 bg-gold rounded-full mt-2" />
              <span className="text-navy-700">{benefit}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          to="/book"
          className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-semibold px-6 py-3 rounded transition-colors duration-200 group"
        >
          {audience.ctaText}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </div>
  );
}
