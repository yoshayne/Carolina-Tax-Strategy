import { Link } from 'react-router';
import Header from '@/react-app/components/Header';
import Footer from '@/react-app/components/Footer';
import { 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  Calculator,
  Building2,
  PiggyBank,
  Calendar,
  BookOpen,
  Clock,
  Users,
  Shield
} from 'lucide-react';

interface Resource {
  icon: React.ReactNode;
  title: string;
  description: string;
  type: string;
}

const clientResources: Resource[] = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: '2026 Tax Savings Checklist',
    description: '17 legal deductions most business owners miss—plus worksheets and templates.',
    type: 'Checklist',
  },
  {
    icon: <Calculator className="w-6 h-6" />,
    title: 'Tax Savings Calculator',
    description: 'Estimate your potential savings based on income and business structure.',
    type: 'Interactive Tool',
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    title: 'Entity Structure Guide',
    description: 'LLC vs S-Corp vs C-Corp: Which is right for your business?',
    type: 'Guide',
  },
  {
    icon: <PiggyBank className="w-6 h-6" />,
    title: 'Retirement Strategy Playbook',
    description: 'Maximize tax-advantaged retirement contributions as a business owner.',
    type: 'Playbook',
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: 'Quarterly Tax Calendar',
    description: 'Never miss a deadline with our comprehensive tax calendar.',
    type: 'Calendar',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Audit-Ready Documentation Guide',
    description: 'Templates and checklists to keep your records IRS-compliant.',
    type: 'Guide',
  },
];

const checklistHighlights = [
  '17-point deduction checklist most business owners miss',
  'Entity structure decision framework',
  'Retirement contribution optimization strategies',
  'Home office deduction calculator worksheet',
  'Vehicle expense tracking template',
  'Quarterly estimated tax planning guide',
];

export default function Resources() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block bg-teal/20 text-teal text-sm font-semibold uppercase tracking-wide px-4 py-1.5 rounded-full mb-6">
                Client Resources
              </span>
              <h1 className="font-serif text-4xl md:text-5xl text-white mb-6">
                Exclusive Tools & Resources for Our Clients
              </h1>
              <p className="text-xl text-white/70 mb-8">
                When you become a Carolina Tax Strategy client, you gain access to our comprehensive library of tax-saving tools, checklists, and guides designed to maximize your savings.
              </p>
              <Link
                to="/book"
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200"
              >
                Become a Client
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Featured: Tax Checklist */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Content */}
              <div>
                <span className="inline-block bg-gold/20 text-gold text-sm font-semibold uppercase tracking-wide px-4 py-1.5 rounded-full mb-4">
                  Client Exclusive
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-navy-900 mb-6">
                  The 2026 Business Owner's Tax Savings Checklist
                </h2>
                <p className="text-lg text-navy-600 mb-8">
                  Our most comprehensive resource—24 pages of actionable tax strategies, worksheets, and templates that have helped our clients save an average of $8,400 per year.
                </p>

                {/* What's Inside */}
                <div className="space-y-3">
                  {checklistHighlights.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" />
                      <span className="text-navy-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: CTA Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-navy-900 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900">Client Resource</p>
                    <p className="text-sm text-navy-500">24 pages • Included with all services</p>
                  </div>
                </div>

                <div className="bg-teal/5 border border-teal/20 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="w-5 h-5 text-teal" />
                    <span className="font-semibold text-navy-900">Available to All Clients</span>
                  </div>
                  <p className="text-navy-600 text-sm">
                    This checklist and all our resources are included when you work with Carolina Tax Strategy. No separate purchase required.
                  </p>
                </div>

                <Link
                  to="/book"
                  className="block w-full bg-gold hover:bg-gold-dark text-white font-semibold py-4 rounded-lg transition-colors duration-200 text-center"
                >
                  Book a Consultation to Get Started
                </Link>

                <p className="text-xs text-navy-500 mt-4 text-center">
                  Free consultation • No obligation
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* All Client Resources */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl text-navy-900 mb-4">
                Full Resource Library
              </h2>
              <p className="text-lg text-navy-600 max-w-2xl mx-auto">
                Every client receives access to our complete library of tools, guides, and templates designed to help you take control of your taxes.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clientResources.map((resource) => (
                <div
                  key={resource.title}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-100"
                >
                  <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center text-teal mb-4">
                    {resource.icon}
                  </div>
                  <span className="text-xs font-semibold text-teal uppercase tracking-wide">
                    {resource.type}
                  </span>
                  <h3 className="font-semibold text-navy-900 mt-1 mb-2">{resource.title}</h3>
                  <p className="text-sm text-navy-600">{resource.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Preview */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-navy-900 mb-4">
                  Tax Strategy Insights
                </h2>
                <p className="text-lg text-navy-600">
                  Expert advice to help you make smarter tax decisions
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <BlogPreviewCard
                title="5 Tax Moves to Make Before Year-End"
                excerpt="Strategic actions you can take in Q4 to reduce your 2026 tax liability."
                readTime="6 min read"
                category="Strategy"
              />
              <BlogPreviewCard
                title="S-Corp Election: When It Makes Sense"
                excerpt="The real math behind choosing S-Corp status for your business."
                readTime="8 min read"
                category="Business Structure"
              />
              <BlogPreviewCard
                title="Real Estate Investor Tax Playbook"
                excerpt="Depreciation, 1031 exchanges, and other strategies for rental property owners."
                readTime="10 min read"
                category="Real Estate"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-20 bg-navy-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <BookOpen className="w-12 h-12 text-gold mx-auto mb-6" />
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
              Ready for Personalized Strategy?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Get access to all our resources plus a custom strategy built for your specific situation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/book"
                className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200"
              >
                Book Free Consultation
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200"
              >
                View Services
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function BlogPreviewCard({ title, excerpt, readTime, category }: { title: string; excerpt: string; readTime: string; category: string }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden group cursor-pointer shadow-sm border border-gray-100">
      <div className="aspect-video bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center">
        <FileText className="w-12 h-12 text-white/20" />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-semibold text-teal uppercase tracking-wide">{category}</span>
          <span className="text-xs text-navy-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {readTime}
          </span>
        </div>
        <h3 className="font-semibold text-navy-900 mb-2 group-hover:text-teal transition-colors">
          {title}
        </h3>
        <p className="text-sm text-navy-600">{excerpt}</p>
      </div>
    </div>
  );
}
