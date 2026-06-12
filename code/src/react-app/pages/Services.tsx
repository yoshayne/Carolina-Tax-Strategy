import { useState } from 'react';
import { Link } from 'react-router';
import Header from '@/react-app/components/Header';
import Footer from '@/react-app/components/Footer';
import { Check, ChevronDown, Shield, Clock, FileCheck, Users } from 'lucide-react';

interface TierFeature {
  text: string;
  included: boolean;
}

interface ServiceTier {
  name: string;
  label: string;
  price: string;
  priceNote?: string;
  bestFor: string;
  description: string;
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
    description: 'Professional tax preparation for individuals and businesses who need accurate, compliant filing without the extras.',
    features: [
      { text: 'Federal + state filing', included: true },
      { text: 'Basic compliance review', included: true },
      { text: 'Standard deduction analysis', included: true },
      { text: 'E-file with confirmation', included: true },
      { text: 'Annual strategy plan', included: false },
      { text: 'Quarterly projections', included: false },
      { text: 'Entity structure review', included: false },
      { text: 'Monthly advisory calls', included: false },
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
    description: 'Comprehensive tax strategy paired with professional filing. We find the savings, then handle the paperwork.',
    features: [
      { text: 'Federal + state filing', included: true },
      { text: 'Basic compliance review', included: true },
      { text: 'Standard deduction analysis', included: true },
      { text: 'E-file with confirmation', included: true },
      { text: 'Annual strategy plan', included: true },
      { text: 'Quarterly projections', included: true },
      { text: 'Entity structure review', included: true },
      { text: 'Monthly advisory calls', included: false },
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
    description: 'Ongoing partnership for proactive tax management. We monitor, advise, and adjust throughout the year.',
    features: [
      { text: 'Federal + state filing', included: true },
      { text: 'Basic compliance review', included: true },
      { text: 'Standard deduction analysis', included: true },
      { text: 'E-file with confirmation', included: true },
      { text: 'Annual strategy plan', included: true },
      { text: 'Quarterly projections', included: true },
      { text: 'Entity structure review', included: true },
      { text: 'Monthly advisory calls', included: true },
    ],
    cta: 'Apply for Advisory',
    ctaLink: '/book',
  },
];

const faqs = [
  {
    question: 'How do I know which tier is right for me?',
    answer: 'If you have straightforward W-2 income with minimal investments, Good may be sufficient. If you own a business, have rental properties, or earn over $200K, Better gives you proactive strategy. If your situation changes frequently or you want ongoing guidance, Best keeps us connected year-round.',
  },
  {
    question: "What's included in the annual strategy plan?",
    answer: "Your strategy plan is a detailed document outlining specific, legal tax-saving opportunities for your situation. It includes entity structure recommendations, retirement contribution strategies, timing considerations, and documentation requirements—delivered with clear action steps you can implement immediately.",
  },
  {
    question: 'Do you prepare tax returns or just provide strategy?',
    answer: 'Both. Our Good and Better tiers include full tax preparation and filing. The BEST tier also includes filing. We handle federal and state returns, ensure compliance, and e-file on your behalf.',
  },
  {
    question: "What if I already have a CPA?",
    answer: "Many clients work with us for strategy while their existing CPA handles filing. Our Strategy + Filing tier can complement or replace your current setup. We're happy to collaborate with your existing team if that works best for you.",
  },
  {
    question: 'How quickly will I see results?',
    answer: 'Strategy plans are delivered within 7-14 days. Many clients implement changes immediately and see impact on their next quarterly estimate. Year-round advisory clients typically see the biggest gains as we optimize throughout the year rather than scrambling at tax time.',
  },
  {
    question: "Is there a guarantee?",
    answer: "We guarantee the accuracy of our work and stand behind our recommendations. If a strategy we recommend doesn't perform as projected due to our error, we'll work to make it right. However, tax outcomes depend on many factors including implementation and changing tax law.",
  },
];

const guarantees = [
  {
    icon: Shield,
    title: 'Accuracy Guarantee',
    description: 'We stand behind every calculation and recommendation.',
  },
  {
    icon: Clock,
    title: 'Timely Delivery',
    description: 'Strategy plans delivered within 7-14 business days.',
  },
  {
    icon: FileCheck,
    title: 'Audit Support',
    description: 'Documentation designed to withstand IRS scrutiny.',
  },
  {
    icon: Users,
    title: 'Personal Attention',
    description: 'Work directly with experienced tax strategists.',
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block bg-gold/20 text-gold text-sm font-semibold uppercase tracking-wide px-4 py-1.5 rounded-full mb-6">
              Services & Pricing
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Transparent Pricing,<br />Tangible Results
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Every engagement is designed to deliver more value than it costs. Choose the level of service that matches your complexity.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {tiers.map((tier) => (
                <TierCard key={tier.name} tier={tier} />
              ))}
            </div>

            {/* Comparison Note */}
            <p className="text-center text-navy-500 mt-8">
              Not sure which to choose? <Link to="/book" className="text-teal hover:underline font-medium">Book a free consultation</Link> and we'll recommend the right fit.
            </p>
          </div>
        </section>

        {/* Guarantees Section */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl text-navy-900 mb-4">
                Our Commitment to You
              </h2>
              <p className="text-lg text-navy-600 max-w-2xl mx-auto">
                Every client receives the same attention to detail and dedication to results.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {guarantees.map((guarantee) => (
                <div key={guarantee.title} className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <guarantee.icon className="w-6 h-6 text-teal" />
                  </div>
                  <h3 className="font-semibold text-navy-900 mb-2">{guarantee.title}</h3>
                  <p className="text-sm text-navy-600">{guarantee.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl text-navy-900 mb-4">
                Pricing Questions
              </h2>
              <p className="text-lg text-navy-600">
                Common questions about our services and how we work.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-20 bg-navy-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
              Ready to Take Control of Your Tax Outcome?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Book a free consultation to discuss your situation and find the right service tier.
            </p>
            <Link
              to="/book"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200"
            >
              Book Your Free Consultation
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function TierCard({ tier }: { tier: ServiceTier }) {
  const isPopular = tier.popular;

  return (
    <div
      className={`relative bg-white rounded-xl shadow-lg overflow-hidden flex flex-col ${
        isPopular ? 'ring-2 ring-gold lg:scale-105 lg:-my-4' : ''
      }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-gold text-white text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      {/* Card Header */}
      <div className={`p-6 ${isPopular ? 'bg-navy-900 text-white' : 'bg-gray-100'}`}>
        <p className={`text-sm font-bold uppercase tracking-wider mb-1 ${isPopular ? 'text-gold' : 'text-teal'}`}>
          {tier.name}
        </p>
        <h3 className={`text-2xl font-semibold mb-2 ${isPopular ? 'text-white' : 'text-navy-900'}`}>
          {tier.label}
        </h3>
        <div className="flex items-baseline gap-1 mb-3">
          <span className={`text-3xl font-bold ${isPopular ? 'text-white' : 'text-navy-900'}`}>
            {tier.price}
          </span>
          {tier.priceNote && (
            <span className={`text-sm ${isPopular ? 'text-white/70' : 'text-navy-500'}`}>
              {tier.priceNote}
            </span>
          )}
        </div>
        <p className={`text-sm ${isPopular ? 'text-white/80' : 'text-navy-600'}`}>
          {tier.description}
        </p>
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
              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                feature.included ? 'bg-teal/10' : 'bg-gray-100'
              }`}>
                {feature.included ? (
                  <Check className="w-3 h-3 text-teal" />
                ) : (
                  <span className="w-1.5 h-0.5 bg-gray-300 rounded" />
                )}
              </div>
              <span className={feature.included ? 'text-navy-700' : 'text-navy-400'}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Link
          to={tier.ctaLink}
          className={`block w-full text-center font-semibold py-3 rounded-lg transition-colors duration-200 ${
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

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-navy-900 pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-navy-400 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-5">
          <p className="text-navy-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
