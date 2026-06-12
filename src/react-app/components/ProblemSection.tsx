import { Zap, FileSearch, ClipboardList } from 'lucide-react';
import { Link } from 'react-router';

export default function ProblemSection() {
  return (
    <section className="bg-navy-900 py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white text-center mb-12">
          The IRS Isn't the Problem. The Plan Is.
        </h2>

        {/* Problem Cards */}
        <div className="bg-white rounded-xl shadow-xl p-8 md:p-10">
          <div className="grid md:grid-cols-3 gap-8 md:gap-6">
            <ProblemCard
              icon={<Zap className="w-8 h-8 text-navy-800" />}
              title="Surprise Bills"
              description="Most taxpayers wait until April to discover they owe thousands"
            />
            <ProblemCard
              icon={<FileSearch className="w-8 h-8 text-navy-800" />}
              title="Missed Deductions"
              description="Without quarterly structure, you miss legal savings every year."
              showDivider
            />
            <ProblemCard
              icon={<ClipboardList className="w-8 h-8 text-navy-800" />}
              title="Documentation Risk"
              description="Messy write-offs that don't hold up under scrutiny"
              showDivider
            />
          </div>
        </div>

        {/* Micro-copy */}
        <p className="text-center text-white/80 text-lg mt-8 italic font-serif">
          If there's no plan, you'll pay the default rate.
        </p>

        {/* CTA Button */}
        <div className="text-center mt-8">
          <Link
            to="/book"
            className="inline-block bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-3 rounded transition-colors duration-200"
          >
            Reply "2026 PLAN" for Strategy
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProblemCard({
  icon,
  title,
  description,
  showDivider = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  showDivider?: boolean;
}) {
  return (
    <div className={`text-center ${showDivider ? 'md:border-l md:border-gray-200 md:pl-6' : ''}`}>
      <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-xl text-navy-900 mb-2">{title}</h3>
      <p className="text-navy-600">{description}</p>
    </div>
  );
}
