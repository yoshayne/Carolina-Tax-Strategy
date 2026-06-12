import { useState } from 'react';
import { Calendar, ClipboardList, FileText, Shield, ChevronDown } from 'lucide-react';

interface ProcessStep {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: string;
}

const steps: ProcessStep[] = [
  {
    number: 1,
    icon: <Calendar className="w-8 h-8" />,
    title: 'Book Your Strategy Session',
    description: '60-minute diagnostic focused on your specific income structure and goals.',
  },
  {
    number: 2,
    icon: <ClipboardList className="w-8 h-8" />,
    title: 'Complete Quick Intake',
    description: 'Complete our quick intake form—takes 3 minutes. We\'ll guide you on what to bring to your consultation.',
    highlight: 'Bank-level encryption',
  },
  {
    number: 3,
    icon: <FileText className="w-8 h-8" />,
    title: 'Receive Your Execution Plan',
    description: '7–14 days later: your custom 2026 tax roadmap with quarterly checkpoints and audit-ready documentation standards.',
  },
];

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "What if I'm missing documents?",
    answer: "Upload what you have; we'll identify any gaps during our review and guide you on substitutes or alternatives.",
  },
  {
    question: 'Is this secure?',
    answer: 'Absolutely. We use bank-level 256-bit SSL encryption for all document transfers. Your data is protected with the same standards used by major financial institutions.',
  },
];

export default function ProcessSection() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-navy-900 mb-4">
            From Chaos to Plan in Three Steps
          </h2>
          <p className="text-lg text-navy-600 max-w-2xl mx-auto">
            We've simplified the process so you can focus on your business while we handle your tax strategy.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Connecting Line (desktop only) */}
          <div className="hidden lg:block absolute top-24 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-teal via-gold to-teal" />

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step) => (
              <StepCard key={step.number} step={step} />
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold text-navy-900 mb-6 text-center">
            Common Questions
          </h3>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <FAQItem key={index} faq={faq} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({ step }: { step: ProcessStep }) {
  return (
    <div className="relative text-center">
      {/* Step Number Circle */}
      <div className="relative z-10 mx-auto w-20 h-20 bg-gradient-to-br from-teal to-teal-dark rounded-full flex items-center justify-center text-white shadow-lg mb-6">
        {step.icon}
      </div>

      {/* Step Number Badge */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-8 h-8 bg-gold rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
        {step.number}
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-navy-900 mb-3">{step.title}</h3>
      <p className="text-navy-600 mb-3">{step.description}</p>

      {/* Security Badge */}
      {step.highlight && (
        <div className="inline-flex items-center gap-2 bg-teal/10 text-teal px-3 py-1.5 rounded-full text-sm font-medium">
          <Shield className="w-4 h-4" />
          {step.highlight}
        </div>
      )}
    </div>
  );
}

function FAQItem({ faq }: { faq: FAQ }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
      >
        <span className="font-medium text-navy-900">{faq.question}</span>
        <ChevronDown
          className={`w-5 h-5 text-navy-600 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-40' : 'max-h-0'
        }`}
      >
        <p className="p-4 text-navy-600 bg-white">{faq.answer}</p>
      </div>
    </div>
  );
}
