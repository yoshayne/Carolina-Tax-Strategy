import { useState } from 'react';
import Header from '@/react-app/components/Header';
import Footer from '@/react-app/components/Footer';
import { 
  Shield, 
  Lock, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  FileText,
  Clock,
  Search,
  PenTool,
  Send,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  TrendingUp,
  Building2,
  Home,
  Bitcoin,
  AlertCircle,
  Globe,
  DollarSign,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  filingStatus: string;
  state: string;
  incomeSources: string[];
  complexityFlags: string[];
}

const incomeSources = [
  { id: 'w2', label: 'W-2 Employment', icon: <Briefcase className="w-4 h-4" /> },
  { id: '1099', label: '1099 / Freelance', icon: <FileText className="w-4 h-4" /> },
  { id: 'investments', label: 'Investments / Dividends', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'business', label: 'Business Owner', icon: <Building2 className="w-4 h-4" /> },
  { id: 'rental', label: 'Rental Income', icon: <Home className="w-4 h-4" /> },
  { id: 'retirement', label: 'Retirement / Social Security', icon: <DollarSign className="w-4 h-4" /> },
];

const complexityFlags = [
  { id: 'multi-state', label: 'Multi-State Filing', icon: <Globe className="w-4 h-4" /> },
  { id: 'irs-notice', label: 'IRS Notice / Audit', icon: <AlertCircle className="w-4 h-4" /> },
  { id: 'crypto', label: 'Cryptocurrency', icon: <Bitcoin className="w-4 h-4" /> },
  { id: 'first-time', label: 'First-Time Filer', icon: <User className="w-4 h-4" /> },
];

const filingStatuses = [
  'Single',
  'Married Filing Jointly',
  'Married Filing Separately',
  'Head of Household',
  'Qualifying Widow(er)',
];

const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 
  'Wisconsin', 'Wyoming'
];

const timelineSteps = [
  { icon: <Calendar className="w-6 h-6" />, title: 'Schedule Call', description: 'Book a convenient time for your consultation', days: 'Day 1' },
  { icon: <Search className="w-6 h-6" />, title: 'Consultation', description: 'We review your situation and identify opportunities', days: 'Day 1–2' },
  { icon: <PenTool className="w-6 h-6" />, title: 'Preparation', description: 'Your return is prepared by a licensed professional', days: '2–4 days' },
  { icon: <Send className="w-6 h-6" />, title: 'Review & E-File', description: 'You review, approve, and we file electronically', days: '1–2 days' },
];

function calculateEstimate(incomeSources: string[], complexityFlags: string[]): { min: number; max: number } {
  let base = 400;
  let maxAdd = 0;

  // Income source complexity
  if (incomeSources.includes('business')) { base += 200; maxAdd += 400; }
  if (incomeSources.includes('rental')) { base += 150; maxAdd += 300; }
  if (incomeSources.includes('investments')) { base += 50; maxAdd += 150; }
  if (incomeSources.includes('1099')) { base += 75; maxAdd += 150; }

  // Complexity flags
  if (complexityFlags.includes('multi-state')) { base += 100; maxAdd += 200; }
  if (complexityFlags.includes('irs-notice')) { base += 200; maxAdd += 400; }
  if (complexityFlags.includes('crypto')) { base += 150; maxAdd += 300; }

  return { min: base, max: base + maxAdd };
}

function shouldShowUpsell(incomeSources: string[]): boolean {
  return incomeSources.includes('business') || incomeSources.length >= 3;
}

export default function FileTaxes() {
  const [step, setStep] = useState(1);
  const [showEstimate, setShowEstimate] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [upsellDismissed, setUpsellDismissed] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    filingStatus: '',
    state: '',
    incomeSources: [],
    complexityFlags: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleIncomeSource = (id: string) => {
    setFormData(prev => ({
      ...prev,
      incomeSources: prev.incomeSources.includes(id)
        ? prev.incomeSources.filter(s => s !== id)
        : [...prev.incomeSources, id],
    }));
  };

  const toggleComplexityFlag = (id: string) => {
    setFormData(prev => ({
      ...prev,
      complexityFlags: prev.complexityFlags.includes(id)
        ? prev.complexityFlags.filter(f => f !== id)
        : [...prev.complexityFlags, id],
    }));
  };

  const canProceedStep1 = formData.firstName && formData.lastName && formData.email && formData.filingStatus && formData.state;
  const canProceedStep2 = formData.incomeSources.length > 0;

  const handleNext = () => {
    if (step === 1 && canProceedStep1) {
      setStep(2);
    }
  };

  const handleSubmit = () => {
    if (shouldShowUpsell(formData.incomeSources) && !upsellDismissed) {
      setShowUpsell(true);
    } else {
      void submitIntake(false);
      setShowEstimate(true);
    }
  };

  const handleUpsellDismiss = () => {
    setShowUpsell(false);
    setUpsellDismissed(true);
    void submitIntake(false);
    setShowEstimate(true);
  };

  const handleUpsellAccept = () => {
    setShowUpsell(false);
    setUpsellDismissed(true);
    void submitIntake(true);
    setShowEstimate(true);
  };

  const estimate = calculateEstimate(formData.incomeSources, formData.complexityFlags);

  const submitIntake = async (wantsPremium: boolean) => {
    try {
      await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          filingStatus: formData.filingStatus,
          state: formData.state,
          incomeSources: formData.incomeSources,
          complexityFlags: formData.complexityFlags,
          estimateMin: estimate.min,
          estimateMax: estimate.max,
          wantsPremium,
        }),
      });
    } catch (err) {
      console.error('Failed to submit intake:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 py-12 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <span className="inline-block bg-teal/20 text-teal text-sm font-semibold uppercase tracking-wide px-4 py-1.5 rounded-full mb-6">
                Professional Tax Preparation
              </span>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-6 leading-tight">
                Professional Tax Preparation,<br className="hidden md:block" />
                <span className="text-gold">Without the Retail Tax Store Chaos</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-4 max-w-2xl mx-auto">
                Work directly with licensed tax professionals who take the time to understand your situation. 
                No rushed appointments. No upsells at checkout.
              </p>
              <p className="text-2xl font-semibold text-gold mb-8">
                Starting at $400
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#intake-form"
                  className="bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  Get Started
                  <ChevronRight className="w-5 h-5" />
                </a>
                <Link
                  to="/book"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 border border-white/30"
                >
                  Not Sure? Book a Call
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="bg-white border-b border-gray-100 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              <div className="flex items-center gap-2 text-navy-600">
                <Lock className="w-5 h-5 text-teal" />
                <span className="text-sm font-medium">256-bit SSL Encryption</span>
              </div>
              <div className="flex items-center gap-2 text-navy-600">
                <Calendar className="w-5 h-5 text-teal" />
                <span className="text-sm font-medium">Flexible Scheduling</span>
              </div>
              <div className="flex items-center gap-2 text-navy-600">
                <Sparkles className="w-5 h-5 text-teal" />
                <span className="text-sm font-medium">Strategy Opportunities Identified Free</span>
              </div>
            </div>
          </div>
        </section>

        {/* Intake Form */}
        <section id="intake-form" className="py-12 lg:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {!showEstimate ? (
              <>
                {/* Progress Steps */}
                <div className="mb-10">
                  <div className="flex items-center justify-center mb-6">
                    {[1, 2].map((s) => (
                      <div key={s} className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                            step >= s
                              ? 'bg-teal text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {step > s ? <Check className="w-5 h-5" /> : s}
                        </div>
                        {s < 2 && (
                          <div className={`w-16 md:w-24 h-1 mx-2 transition-colors ${step > s ? 'bg-teal' : 'bg-gray-200'}`} />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-16 text-sm text-navy-600">
                    <span className={step >= 1 ? 'text-teal font-medium' : ''}>Your Info</span>
                    <span className={step >= 2 ? 'text-teal font-medium' : ''}>Income</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-10">
                  {/* Step 1: Personal Info */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="font-serif text-2xl text-navy-900 mb-2">Let's Start With Your Information</h2>
                        <p className="text-navy-600">We'll use this to personalize your tax preparation experience.</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-navy-700 mb-2">First Name *</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-teal outline-none"
                              placeholder="John"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy-700 mb-2">Last Name *</label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-teal outline-none"
                            placeholder="Smith"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">Email Address *</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-teal outline-none"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-teal outline-none"
                            placeholder="(555) 123-4567"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-navy-700 mb-2">Filing Status *</label>
                          <select
                            name="filingStatus"
                            value={formData.filingStatus}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-teal outline-none appearance-none bg-white"
                          >
                            <option value="">Select status...</option>
                            {filingStatuses.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy-700 mb-2">State of Residence *</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
                            <select
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-teal outline-none appearance-none bg-white"
                            >
                              <option value="">Select state...</option>
                              {states.map(state => (
                                <option key={state} value={state}>{state}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleNext}
                        disabled={!canProceedStep1}
                        className="w-full bg-gold hover:bg-gold-dark disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        Continue
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {/* Step 2: Income Sources */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="font-serif text-2xl text-navy-900 mb-2">What Are Your Income Sources?</h2>
                        <p className="text-navy-600">Select all that apply. This helps us prepare for your consultation.</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-3">Income Sources *</label>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {incomeSources.map(source => (
                            <button
                              key={source.id}
                              type="button"
                              onClick={() => toggleIncomeSource(source.id)}
                              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                                formData.incomeSources.includes(source.id)
                                  ? 'border-teal bg-teal/5 text-teal'
                                  : 'border-gray-200 hover:border-gray-300 text-navy-700'
                              }`}
                            >
                              <span className={formData.incomeSources.includes(source.id) ? 'text-teal' : 'text-navy-400'}>
                                {source.icon}
                              </span>
                              <span className="font-medium">{source.label}</span>
                              {formData.incomeSources.includes(source.id) && (
                                <Check className="w-4 h-4 ml-auto" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-3">Additional Complexity (Optional)</label>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {complexityFlags.map(flag => (
                            <button
                              key={flag.id}
                              type="button"
                              onClick={() => toggleComplexityFlag(flag.id)}
                              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                                formData.complexityFlags.includes(flag.id)
                                  ? 'border-gold bg-gold/5 text-gold-dark'
                                  : 'border-gray-200 hover:border-gray-300 text-navy-700'
                              }`}
                            >
                              <span className={formData.complexityFlags.includes(flag.id) ? 'text-gold' : 'text-navy-400'}>
                                {flag.icon}
                              </span>
                              <span className="font-medium">{flag.label}</span>
                              {formData.complexityFlags.includes(flag.id) && (
                                <Check className="w-4 h-4 ml-auto text-gold" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setStep(1)}
                          className="px-6 py-4 border border-gray-300 text-navy-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <ChevronLeft className="w-5 h-5" />
                          Back
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={!canProceedStep2}
                          className="flex-1 bg-gold hover:bg-gold-dark disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          Get My Estimate
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Estimate Display */
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-10 text-center">
                <div className="w-20 h-20 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-teal" />
                </div>
                
                <h2 className="font-serif text-3xl text-navy-900 mb-4">Your Estimated Fee</h2>
                
                <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-xl p-6 mb-6 max-w-sm mx-auto">
                  <p className="text-white/70 text-sm mb-2">Based on your selections</p>
                  <p className="text-4xl font-bold text-gold">
                    ${estimate.min.toLocaleString()} – ${estimate.max.toLocaleString()}
                    {estimate.max >= 1200 && '+'}
                  </p>
                </div>

                <p className="text-sm text-navy-500 mb-8 max-w-md mx-auto">
                  This is an estimate based on the information provided. Your final quote will be confirmed during your consultation.
                </p>

                <div className="bg-teal/5 border border-teal/20 rounded-xl p-6 mb-8">
                  <h3 className="font-semibold text-navy-900 mb-4">What Happens Next</h3>
                  <div className="grid sm:grid-cols-4 gap-4 text-left">
                    {timelineSteps.map((step, index) => (
                      <div key={index} className="relative">
                        <div className="flex sm:flex-col items-start sm:items-center gap-3 sm:text-center">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-teal shadow-sm flex-shrink-0">
                            {step.icon}
                          </div>
                          <div>
                            <p className="font-medium text-navy-900 text-sm">{step.title}</p>
                            <p className="text-xs text-navy-500 mt-1 hidden sm:block">{step.description}</p>
                            <p className="text-xs text-teal font-medium mt-1">{step.days}</p>
                          </div>
                        </div>
                        {index < timelineSteps.length - 1 && (
                          <div className="hidden sm:block absolute top-6 left-1/2 w-full h-0.5 bg-teal/20" style={{ transform: 'translateX(50%)' }} />
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-sm text-navy-600 mt-4 pt-4 border-t border-teal/20">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Total turnaround: <span className="font-semibold">5–10 business days</span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/book"
                    className="bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-4 rounded-lg transition-colors"
                  >
                    Schedule Your Consultation
                  </Link>
                  <a
                    href="tel:+18446411040"
                    className="border border-gray-300 text-navy-700 font-semibold px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Call Us: (844) 641-1040
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Timeline Section (shown before form submission) */}
        {!showEstimate && (
          <section className="py-12 lg:py-16 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="font-serif text-2xl md:text-3xl text-navy-900 mb-4">What Happens After You Submit</h2>
                <p className="text-navy-600">A clear, predictable process from start to finish.</p>
              </div>

              <div className="grid md:grid-cols-4 gap-6 md:gap-4">
                {timelineSteps.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="flex md:flex-col items-start md:items-center gap-4 md:text-center">
                      <div className="w-16 h-16 bg-teal/10 rounded-2xl flex items-center justify-center text-teal flex-shrink-0">
                        {step.icon}
                      </div>
                      <div>
                        <span className="text-xs text-teal font-semibold uppercase tracking-wide">{step.days}</span>
                        <h3 className="font-semibold text-navy-900 mt-1">{step.title}</h3>
                        <p className="text-sm text-navy-600 mt-1">{step.description}</p>
                      </div>
                    </div>
                    {index < timelineSteps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200" style={{ transform: 'translateX(50%)' }} />
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center mt-10 pt-8 border-t border-gray-100">
                <div className="inline-flex items-center gap-2 bg-navy-900 text-white px-6 py-3 rounded-full">
                  <Calendar className="w-5 h-5 text-gold" />
                  <span className="font-medium">Total Turnaround: 5–10 Business Days</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Trust Section */}
        <section className="py-12 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-14 h-14 bg-teal/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-teal" />
                </div>
                <h3 className="font-semibold text-navy-900 mb-2">Bank-Level Security</h3>
                <p className="text-sm text-navy-600">256-bit SSL encryption protects all your data and documents.</p>
              </div>
              <div>
                <div className="w-14 h-14 bg-teal/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-7 h-7 text-teal" />
                </div>
                <h3 className="font-semibold text-navy-900 mb-2">Flexible Scheduling</h3>
                <p className="text-sm text-navy-600">Book a consultation time that works for your schedule.</p>
              </div>
              <div>
                <div className="w-14 h-14 bg-teal/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-7 h-7 text-teal" />
                </div>
                <h3 className="font-semibold text-navy-900 mb-2">Strategy Included</h3>
                <p className="text-sm text-navy-600">We identify tax-saving opportunities at no extra charge.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Upsell Modal */}
      {showUpsell && (
        <div className="fixed inset-0 bg-navy-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 lg:p-8 relative">
            <button
              onClick={handleUpsellDismiss}
              className="absolute top-4 right-4 text-navy-400 hover:text-navy-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-serif text-2xl text-navy-900 mb-2">You May Benefit From Our Premium Tier</h3>
              <p className="text-navy-600">Based on your income profile, you could save significantly with proactive tax strategy.</p>
            </div>

            <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-xl p-6 mb-6">
              <h4 className="text-gold font-semibold mb-4">Strategy + Filing Tier Includes:</h4>
              <ul className="space-y-3">
                {[
                  'Full tax return preparation',
                  'Proactive tax strategy consultation',
                  'Entity structure optimization review',
                  'Quarterly estimated tax planning',
                  'Year-round email support',
                  'Audit protection guidance',
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3 text-white">
                    <Check className="w-5 h-5 text-teal flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleUpsellAccept}
                className="flex-1 bg-gold hover:bg-gold-dark text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Tell Me More
              </button>
              <button
                onClick={handleUpsellDismiss}
                className="flex-1 border border-gray-300 text-navy-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Just Filing for Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
