import { useState } from 'react';
import { Link } from 'react-router';
import Header from '@/react-app/components/Header';
import Footer from '@/react-app/components/Footer';
import { 
  Calendar, 
  Upload, 
  FileText, 
  Shield, 
  ChevronDown, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  FileCheck,
  TrendingUp,
  Users
} from 'lucide-react';

interface DetailedStep {
  number: number;
  icon: React.ReactNode;
  title: string;
  duration: string;
  description: string;
  details: string[];
  highlight?: { icon: React.ReactNode; text: string };
}

const detailedSteps: DetailedStep[] = [
  {
    number: 1,
    icon: <Calendar className="w-8 h-8" />,
    title: 'Book Your Strategy Session',
    duration: '60 minutes',
    description: 'A diagnostic conversation focused on understanding your unique financial situation, goals, and pain points.',
    details: [
      'Review your current income structure and sources',
      'Identify immediate tax-saving opportunities',
      'Discuss your short and long-term financial goals',
      'Determine the best service tier for your needs',
      'Answer any questions about the process',
    ],
    highlight: { icon: <MessageSquare className="w-4 h-4" />, text: 'Free consultation—no obligation' },
  },
  {
    number: 2,
    icon: <Upload className="w-8 h-8" />,
    title: 'Upload Your Documents',
    duration: '3–5 minutes',
    description: 'Securely share your financial documents through our encrypted portal. Missing items? No problem.',
    details: [
      'Easy online intake form takes just 3 minutes',
      'Automatic document organization',
      'We identify any missing items and guide you',
      'Substitutes accepted for common documents',
      'We\'ll guide you on what documents to bring to your consultation',
    ],
    highlight: { icon: <Shield className="w-4 h-4" />, text: 'Bank-level 256-bit encryption' },
  },
  {
    number: 3,
    icon: <FileCheck className="w-8 h-8" />,
    title: 'We Analyze & Build Your Plan',
    duration: '7–14 days',
    description: 'Our team reviews every detail of your situation and crafts a personalized tax strategy.',
    details: [
      'Comprehensive review of all documents',
      'Entity structure optimization analysis',
      'Retirement contribution strategy',
      'Timing recommendations for transactions',
      'Audit-ready documentation standards',
    ],
    highlight: { icon: <Users className="w-4 h-4" />, text: 'Dedicated strategist assigned' },
  },
  {
    number: 4,
    icon: <FileText className="w-8 h-8" />,
    title: 'Receive Your Execution Plan',
    duration: 'Delivered via portal',
    description: 'Your custom tax roadmap with clear action steps, timelines, and projected savings.',
    details: [
      'Detailed strategy document (PDF)',
      'Quarterly checkpoint schedule',
      'Prioritized action item list',
      'Projected tax savings breakdown',
      'Implementation support resources',
    ],
    highlight: { icon: <TrendingUp className="w-4 h-4" />, text: 'Average savings: $8,400/year' },
  },
];

const documentsList = [
  { category: 'Income Documents', items: ['W-2s from all employers', '1099s (freelance, investments, interest)', 'K-1s from partnerships/S-corps', 'Rental income statements'] },
  { category: 'Business Documents', items: ['Profit & loss statements', 'Business expense receipts', 'Vehicle mileage logs', 'Home office measurements'] },
  { category: 'Deduction Support', items: ['Mortgage interest (Form 1098)', 'Property tax statements', 'Charitable donation receipts', 'Medical expense records'] },
  { category: 'Prior Year Reference', items: ['Last year\'s tax return', 'Quarterly estimated payments made', 'Any IRS correspondence', 'Prior year W-2s (if changed jobs)'] },
];

const faqs = [
  {
    question: 'What happens during the strategy session?',
    answer: "We'll have a focused conversation about your income sources, business structure, investments, and goals. It's not a sales pitch—it's a genuine diagnostic to understand if we can help and how. Many clients get actionable insights just from this call.",
  },
  {
    question: "What if I don't have all my documents?",
    answer: "Upload what you have. We'll identify gaps and often can work with substitutes. For example, bank statements can sometimes replace missing 1099s. We guide you through exactly what's needed and why.",
  },
  {
    question: 'How is my data protected?',
    answer: 'We use bank-level 256-bit SSL encryption for all transfers. Documents are stored in SOC 2 compliant systems with strict access controls. We never share your information with third parties without your explicit consent.',
  },
  {
    question: 'Can I implement the plan myself?',
    answer: "Absolutely. Your strategy plan includes clear, step-by-step instructions. Many clients handle implementation themselves or work with their existing CPA. We're also available to answer questions during implementation.",
  },
  {
    question: 'What if my situation changes mid-year?',
    answer: "For Strategy + Filing clients, we include one strategy update if circumstances change significantly. Year-Round Advisory clients have unlimited updates—that's the point of ongoing partnership.",
  },
  {
    question: 'How long until I see results?',
    answer: "You'll have your strategy plan within 7-14 days. Implementation timing varies, but many clients see impact on their next quarterly estimate. The full benefit typically shows on your next tax return.",
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block bg-teal/20 text-teal text-sm font-semibold uppercase tracking-wide px-4 py-1.5 rounded-full mb-6">
              How It Works
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              From Overwhelmed to<br />Optimized in 4 Steps
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
              We've refined our process to minimize your time investment while maximizing your tax savings. Here's exactly what to expect.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-white/60">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold" />
                <span>Under 2 hours of your time</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-gold" />
                <span>100% secure process</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gold" />
                <span>Plan delivered in 7-14 days</span>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Steps Section */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12 lg:space-y-16">
              {detailedSteps.map((step, index) => (
                <StepDetail key={step.number} step={step} isReversed={index % 2 === 1} />
              ))}
            </div>
          </div>
        </section>

        {/* Documents Checklist Section */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl text-navy-900 mb-4">
                What You'll Need
              </h2>
              <p className="text-lg text-navy-600 max-w-2xl mx-auto">
                Don't stress about having everything perfect. Upload what you have and we'll guide you through the rest.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {documentsList.map((category) => (
                <div key={category.category} className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-teal" />
                    {category.category}
                  </h3>
                  <ul className="space-y-2">
                    {category.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-navy-600">
                        <CheckCircle2 className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-navy-500 text-sm">
                Missing documents? <span className="text-teal font-medium">That's okay.</span> We'll identify gaps and help you find alternatives.
              </p>
            </div>
          </div>
        </section>

        {/* Timeline Visual */}
        <section className="py-16 lg:py-20 bg-navy-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
                Your Timeline
              </h2>
              <p className="text-lg text-white/70">
                From first call to finished plan in under three weeks
              </p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal via-gold to-teal transform md:-translate-x-1/2" />

              <div className="space-y-8">
                <TimelineItem 
                  day="Day 1" 
                  title="Strategy Session" 
                  description="60-minute call to understand your situation"
                  side="left"
                />
                <TimelineItem 
                  day="Day 1-3" 
                  title="Document Upload" 
                  description="Share your documents through our secure portal"
                  side="right"
                />
                <TimelineItem 
                  day="Day 3-10" 
                  title="Analysis Phase" 
                  description="Our team reviews and builds your strategy"
                  side="left"
                />
                <TimelineItem 
                  day="Day 7-14" 
                  title="Plan Delivery" 
                  description="Receive your custom tax roadmap"
                  side="right"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl text-navy-900 mb-4">
                Questions About the Process
              </h2>
              <p className="text-lg text-navy-600">
                Everything you need to know before getting started.
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
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-2xl p-8 lg:p-12 shadow-xl">
              <span className="inline-block bg-gold/20 text-gold text-sm font-semibold uppercase tracking-wide px-4 py-1.5 rounded-full mb-6">
                Ready to Start?
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
                Your 2026 Tax Outcome Starts Here
              </h2>
              <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
                Book your free strategy session today. No commitment, no pressure—just a genuine conversation about your tax situation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/book"
                  className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200"
                >
                  <Calendar className="w-5 h-5" />
                  Book Free Consultation
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function StepDetail({ step, isReversed }: { step: DetailedStep; isReversed: boolean }) {
  return (
    <div className={`flex flex-col lg:flex-row gap-8 lg:gap-12 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
      {/* Visual Side */}
      <div className="w-full lg:w-1/2">
        <div className="relative bg-white rounded-2xl shadow-lg p-8 lg:p-10">
          {/* Step Number Badge */}
          <div className="absolute -top-4 -left-4 w-12 h-12 bg-gold rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {step.number}
          </div>

          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-teal to-teal-dark rounded-xl flex items-center justify-center text-white mb-6">
            {step.icon}
          </div>

          <h3 className="text-2xl font-semibold text-navy-900 mb-2">{step.title}</h3>
          <p className="text-teal font-medium mb-4">{step.duration}</p>
          <p className="text-navy-600 mb-6">{step.description}</p>

          {step.highlight && (
            <div className="inline-flex items-center gap-2 bg-teal/10 text-teal px-4 py-2 rounded-full text-sm font-medium">
              {step.highlight.icon}
              {step.highlight.text}
            </div>
          )}
        </div>
      </div>

      {/* Details Side */}
      <div className="w-full lg:w-1/2">
        <h4 className="text-lg font-semibold text-navy-900 mb-4">What happens in this step:</h4>
        <ul className="space-y-3">
          {step.details.map((detail, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" />
              <span className="text-navy-700">{detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TimelineItem({ day, title, description, side }: { day: string; title: string; description: string; side: 'left' | 'right' }) {
  return (
    <div className={`relative flex items-center ${side === 'right' ? 'md:flex-row-reverse' : ''}`}>
      {/* Dot */}
      <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-gold rounded-full transform -translate-x-1/2 z-10" />

      {/* Content */}
      <div className={`ml-12 md:ml-0 md:w-1/2 ${side === 'left' ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
        <span className="text-gold font-semibold text-sm uppercase tracking-wide">{day}</span>
        <h4 className="text-white font-semibold text-lg">{title}</h4>
        <p className="text-white/60 text-sm">{description}</p>
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
