import { useState, useEffect, useCallback } from 'react';
import Header from '@/react-app/components/Header';
import Footer from '@/react-app/components/Footer';
import { 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  Shield, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  Building2,
  DollarSign,
  MessageSquare
} from 'lucide-react';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface DaySlots {
  date: Date;
  slots: TimeSlot[];
}

const benefits = [
  'Review your current tax situation',
  'Identify immediate savings opportunities',
  'Discuss optimal business structure',
  'Get a personalized action plan',
  'No obligation, no pressure',
];

const sessionDetails = [
  { icon: <Clock className="w-5 h-5" />, label: '30 minutes' },
  { icon: <Video className="w-5 h-5" />, label: 'Video call (Zoom)' },
  { icon: <DollarSign className="w-5 h-5" />, label: 'Completely free' },
];

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatFullDate(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export default function Book() {
  const [step, setStep] = useState<'calendar' | 'form' | 'confirmation'>('calendar');
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date();
    // Start from next business day
    if (today.getDay() === 0) today.setDate(today.getDate() + 1);
    if (today.getDay() === 6) today.setDate(today.getDate() + 2);
    return today;
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [weekDays, setWeekDays] = useState<DaySlots[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);

  const loadAvailability = useCallback(async () => {
    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/availability?weekStart=${toDateKey(weekStart)}`);
      const data = await res.json();
      const days: DaySlots[] = (data.days || []).map((d: { date: string; slots: TimeSlot[] }) => {
        const [y, m, dd] = d.date.split('-').map(Number);
        return { date: new Date(y, m - 1, dd), slots: d.slots };
      });
      setWeekDays(days);
    } catch (err) {
      console.error('Failed to load availability:', err);
      setWeekDays([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [weekStart]);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessType: '',
    annualRevenue: '',
    primaryGoal: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePrevWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() - 7);
    if (newStart >= new Date()) {
      setWeekStart(newStart);
    }
  };

  const handleNextWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() + 7);
    setWeekStart(newStart);
  };

  const handleTimeSelect = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      setStep('form');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          appointmentDate: selectedDate ? toDateKey(selectedDate) : '',
          appointmentTime: selectedTime,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to book appointment');
      }
      
      setStep('confirmation');
    } catch (error) {
      console.error('Booking error:', error);
      alert('There was an error booking your appointment. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block bg-teal/20 text-teal text-sm font-semibold uppercase tracking-wide px-4 py-1.5 rounded-full mb-4">
                Free Strategy Session
              </span>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-4">
                Book Your Tax Strategy Call
              </h1>
              <p className="text-lg text-white/70">
                30 minutes that could save you thousands. No obligation, just clarity.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Left: Session Info */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 sticky top-24">
                  <h2 className="font-serif text-xl text-navy-900 mb-4">
                    Free Strategy Session
                  </h2>
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    {sessionDetails.map((detail, index) => (
                      <div key={index} className="flex items-center gap-2 text-navy-600">
                        <span className="text-teal">{detail.icon}</span>
                        <span className="text-sm">{detail.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-6 mb-6">
                    <h3 className="font-semibold text-navy-900 mb-3">What We Will Cover:</h3>
                    <ul className="space-y-2">
                      {benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-navy-600">
                          <CheckCircle2 className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedDate && selectedTime && (
                    <div className="bg-teal/5 border border-teal/20 rounded-xl p-4">
                      <p className="text-sm font-medium text-navy-900 mb-1">Selected Time:</p>
                      <p className="text-teal font-semibold">
                        {formatFullDate(selectedDate)}
                      </p>
                      <p className="text-teal font-semibold">
                        {selectedTime} EST
                      </p>
                    </div>
                  )}

                  <div className="mt-6 flex items-center gap-2 text-xs text-navy-500">
                    <Shield className="w-4 h-4" />
                    <span>Your information is secure and confidential</span>
                  </div>
                </div>
              </div>

              {/* Right: Calendar / Form / Confirmation */}
              <div className="lg:col-span-2">
                {step === 'calendar' && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                    <h2 className="font-serif text-2xl text-navy-900 mb-6">
                      Select a Date & Time
                    </h2>

                    {/* Week Navigation */}
                    <div className="flex items-center justify-between mb-6">
                      <button
                        onClick={handlePrevWeek}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30"
                        disabled={weekStart <= new Date()}
                      >
                        <ChevronLeft className="w-5 h-5 text-navy-600" />
                      </button>
                      <span className="font-medium text-navy-900">
                        {weekStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                      <button
                        onClick={handleNextWeek}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-navy-600" />
                      </button>
                    </div>

                    {/* Calendar Grid */}
                    {loadingSlots ? (
                      <div className="flex items-center justify-center py-16 mb-8">
                        <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : weekDays.every((d) => d.slots.filter((s) => s.available).length === 0) ? (
                      <div className="text-center py-16 mb-8 text-navy-500">
                        No available times this week. Try another week.
                      </div>
                    ) : (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                      {weekDays.map((day) => (
                        <div key={day.date.toISOString()} className="border border-gray-200 rounded-xl overflow-hidden">
                          <div className="bg-gray-50 px-3 py-2 text-center border-b border-gray-200">
                            <p className="text-xs text-navy-500 uppercase">
                              {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </p>
                            <p className="font-semibold text-navy-900">
                              {day.date.getDate()}
                            </p>
                          </div>
                          <div className="p-2 space-y-1.5 max-h-64 overflow-y-auto">
                            {day.slots.filter(s => s.available).slice(0, 6).map((slot) => (
                              <button
                                key={slot.time}
                                onClick={() => handleTimeSelect(day.date, slot.time)}
                                className={`w-full text-sm py-2 px-3 rounded-lg transition-colors ${
                                  selectedDate?.toDateString() === day.date.toDateString() && selectedTime === slot.time
                                    ? 'bg-teal text-white'
                                    : 'bg-gray-50 hover:bg-teal/10 text-navy-700 hover:text-teal'
                                }`}
                              >
                                {slot.time}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    )}

                    {/* Continue Button */}
                    <button
                      onClick={handleContinue}
                      disabled={!selectedDate || !selectedTime}
                      className="w-full md:w-auto bg-gold hover:bg-gold-dark disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      Continue
                      <ArrowRight className="w-5 h-5" />
                    </button>

                    <p className="text-sm text-navy-500 mt-4">
                      All times shown in Eastern Standard Time (EST)
                    </p>
                  </div>
                )}

                {step === 'form' && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                    <button
                      onClick={() => setStep('calendar')}
                      className="flex items-center gap-1 text-sm text-navy-500 hover:text-navy-700 mb-6"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Change time
                    </button>

                    <h2 className="font-serif text-2xl text-navy-900 mb-2">
                      Tell Us About Yourself
                    </h2>
                    <p className="text-navy-600 mb-6">
                      Help us prepare for your session by sharing a few details.
                    </p>

                    <form onSubmit={handleFormSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-navy-700 mb-2">
                            First Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
                            <input
                              type="text"
                              id="firstName"
                              name="firstName"
                              required
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-colors"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-navy-700 mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-navy-700 mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-navy-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="businessType" className="block text-sm font-medium text-navy-700 mb-2">
                            Business Type *
                          </label>
                          <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
                            <select
                              id="businessType"
                              name="businessType"
                              required
                              value={formData.businessType}
                              onChange={handleInputChange}
                              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-colors appearance-none bg-white"
                            >
                              <option value="">Select...</option>
                              <option value="sole-proprietor">Sole Proprietor</option>
                              <option value="llc">LLC</option>
                              <option value="s-corp">S-Corporation</option>
                              <option value="c-corp">C-Corporation</option>
                              <option value="partnership">Partnership</option>
                              <option value="w2-side-hustle">W-2 + Side Hustle</option>
                              <option value="real-estate">Real Estate Investor</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="annualRevenue" className="block text-sm font-medium text-navy-700 mb-2">
                            Annual Revenue *
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
                            <select
                              id="annualRevenue"
                              name="annualRevenue"
                              required
                              value={formData.annualRevenue}
                              onChange={handleInputChange}
                              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-colors appearance-none bg-white"
                            >
                              <option value="">Select...</option>
                              <option value="under-50k">Under $50,000</option>
                              <option value="50k-100k">$50,000 - $100,000</option>
                              <option value="100k-250k">$100,000 - $250,000</option>
                              <option value="250k-500k">$250,000 - $500,000</option>
                              <option value="500k-1m">$500,000 - $1,000,000</option>
                              <option value="over-1m">Over $1,000,000</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="primaryGoal" className="block text-sm font-medium text-navy-700 mb-2">
                          What is your primary goal? (optional)
                        </label>
                        <div className="relative">
                          <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-navy-400" />
                          <textarea
                            id="primaryGoal"
                            name="primaryGoal"
                            rows={3}
                            value={formData.primaryGoal}
                            onChange={handleInputChange}
                            placeholder="e.g., Reduce my tax bill, Choose the right business structure, Plan for retirement..."
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-colors resize-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gold hover:bg-gold-dark disabled:bg-gold/50 text-white font-semibold py-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Booking...
                          </>
                        ) : (
                          <>
                            <Calendar className="w-5 h-5" />
                            Confirm Booking
                          </>
                        )}
                      </button>

                      <p className="text-xs text-navy-500 text-center">
                        By booking, you agree to receive email communications about your appointment.
                        We respect your privacy and will never share your information.
                      </p>
                    </form>
                  </div>
                )}

                {step === 'confirmation' && selectedDate && selectedTime && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 lg:p-12 text-center">
                    <div className="w-20 h-20 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-teal" />
                    </div>
                    
                    <h2 className="font-serif text-3xl text-navy-900 mb-2">
                      You're All Set!
                    </h2>
                    <p className="text-lg text-navy-600 mb-8">
                      Your strategy session is confirmed.
                    </p>

                    <div className="bg-gray-50 rounded-xl p-6 mb-8 max-w-md mx-auto">
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-teal" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-navy-900">
                            {formatFullDate(selectedDate)}
                          </p>
                          <p className="text-navy-600">
                            {selectedTime} EST • 30 minutes
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-navy-500">
                        <Video className="w-4 h-4" />
                        <span>Zoom link will be sent to your email</span>
                      </div>
                    </div>

                    <div className="space-y-3 text-left max-w-md mx-auto">
                      <h3 className="font-semibold text-navy-900">What to Expect:</h3>
                      <ul className="space-y-2 text-sm text-navy-600">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" />
                          Check your email for a confirmation and calendar invite
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" />
                          You will receive a reminder 24 hours before your session
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" />
                          Have your most recent tax return handy (optional but helpful)
                        </li>
                      </ul>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100">
                      <p className="text-sm text-navy-500 mb-4">
                        Need to reschedule? Email us at{' '}
                        <a href="mailto:info@carolinataxstrategy.com" className="text-teal hover:underline">
                          info@carolinataxstrategy.com
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
