import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  quote: string;
  result: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Marcus Thompson',
    role: 'Software Engineer & Etsy Seller',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    quote:
      "I was getting hit with a $4,000 surprise bill every April. After working with Carolina Tax Strategy, I actually got a refund this year. The peace of mind alone is worth it.",
    result: 'Saved $6,200 in first year',
  },
  {
    id: 2,
    name: 'Jennifer Walsh',
    role: 'Marketing Agency Owner',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    quote:
      "The S-Corp election they recommended saved me more in self-employment taxes than their entire fee. I only wish I'd found them sooner.",
    result: 'Reduced tax liability by 23%',
  },
  {
    id: 3,
    name: 'Robert Chen',
    role: 'Real Estate Investor (12 units)',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    quote:
      "They found depreciation I'd been missing for years. The cost segregation study alone generated $45K in deductions I had no idea I was leaving on the table.",
    result: '$45,000 in recovered deductions',
  },
];

export default function SocialProof() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-navy-900 mb-4">
            Real Results from Real Clients
          </h2>
          <p className="text-lg text-navy-600 max-w-2xl mx-auto">
            See how our strategic approach has transformed tax outcomes for business owners and investors.
          </p>
        </div>

        {/* Testimonial Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 lg:gap-16 text-navy-600">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-gold fill-gold" />
              ))}
            </div>
            <span className="font-medium">4.9/5 Client Rating</span>
          </div>
          <div className="text-center">
            <span className="text-3xl font-bold text-navy-900">500+</span>
            <p className="text-sm">Tax Plans Delivered</p>
          </div>
          <div className="text-center">
            <span className="text-3xl font-bold text-navy-900">$2.3M</span>
            <p className="text-sm">Client Tax Savings</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 lg:p-8 relative group hover:shadow-lg transition-shadow duration-300">
      {/* Quote Icon */}
      <div className="absolute -top-3 -left-3 w-10 h-10 bg-teal rounded-lg flex items-center justify-center shadow-md">
        <Quote className="w-5 h-5 text-white" />
      </div>

      {/* Quote */}
      <p className="text-navy-700 mb-6 leading-relaxed">"{testimonial.quote}"</p>

      {/* Result Badge */}
      <div className="inline-block bg-gold/10 text-gold-dark px-3 py-1.5 rounded-full text-sm font-semibold mb-6">
        {testimonial.result}
      </div>

      {/* Author */}
      <div className="flex items-center gap-4">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-navy-900">{testimonial.name}</p>
          <p className="text-sm text-navy-600">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}
