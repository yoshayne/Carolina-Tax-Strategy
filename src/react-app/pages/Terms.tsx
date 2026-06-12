import Header from '@/react-app/components/Header';
import Footer from '@/react-app/components/Footer';
import { FileText } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 py-12 lg:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-teal/20 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-teal" />
              </div>
              <h1 className="font-serif text-3xl md:text-4xl text-white">Terms of Service</h1>
            </div>
            <p className="text-white/70">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 lg:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <div className="bg-teal/5 border border-teal/20 rounded-xl p-6 mb-8">
                <p className="text-navy-700 mb-0">
                  These Terms of Service govern your use of the Carolina Tax Strategy website and services. By accessing our website or engaging our services, you agree to be bound by these terms.
                </p>
              </div>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-navy-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-navy-700 mb-4">
                  By accessing or using our website (carolinataxstrategy.com) or services, you agree to comply with and be bound by these Terms of Service and our Privacy Policy. If you do not agree with these terms, please do not use our website or services.
                </p>
                <p className="text-navy-700 mb-6">
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of our services after changes are posted constitutes acceptance of the modified terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-navy-900 mb-4">2. Services Description</h2>
                <p className="text-navy-700 mb-4">
                  Carolina Tax Strategy provides tax planning, strategy, and consulting services for business owners, investors, and high-income earners. Our services include, but are not limited to:
                </p>
                <ul className="text-navy-700 space-y-2 mb-6">
                  <li>Tax strategy consultations and planning sessions</li>
                  <li>Business structure optimization recommendations</li>
                  <li>Tax reduction strategy development</li>
                  <li>Year-round tax planning and guidance</li>
                  <li>Educational resources and materials</li>
                </ul>
                <p className="text-navy-700 mb-6">
                  Carolina Tax Strategy provides professional tax preparation and filing services for both businesses and individuals, as well as strategic tax planning and consulting services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-navy-900 mb-4">3. Professional Relationship</h2>
                
                <h3 className="font-semibold text-xl text-navy-900 mb-3">3.1 Nature of Services</h3>
                <p className="text-navy-700 mb-6">
                  Our services include professional tax preparation and filing for both businesses and individuals, as well as strategic tax planning and advisory services. We do not provide legal advice. You are responsible for providing accurate information and may wish to consult with legal professionals regarding specific legal matters.
                </p>

                <h3 className="font-semibold text-xl text-navy-900 mb-3">3.2 Client Responsibilities</h3>
                <p className="text-navy-700 mb-4">
                  As a client, you agree to:
                </p>
                <ul className="text-navy-700 space-y-2 mb-6">
                  <li>Provide accurate, complete, and timely information necessary for our services</li>
                  <li>Review all recommendations with your tax professional before implementation</li>
                  <li>Maintain proper documentation of all tax strategies implemented</li>
                  <li>Comply with all applicable tax laws and regulations</li>
                  <li>Inform us of any material changes to your financial situation</li>
                  <li>Make timely payment for services rendered</li>
                </ul>

                <h3 className="font-semibold text-xl text-navy-900 mb-3">3.3 Limitations</h3>
                <p className="text-navy-700 mb-6">
                  We do not guarantee specific tax outcomes or savings amounts. Tax results depend on numerous factors including accurate information provided, proper implementation by qualified professionals, compliance with tax laws, and future changes in tax legislation. Past client results do not guarantee similar outcomes for your situation.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-navy-900 mb-4">4. Fees and Payment</h2>
                
                <h3 className="font-semibold text-xl text-navy-900 mb-3">4.1 Service Fees</h3>
                <p className="text-navy-700 mb-6">
                  Service fees are outlined in our pricing tiers and engagement agreements. Fees are due as specified in your service agreement. We accept payment via credit card, ACH transfer, or other agreed-upon methods.
                </p>

                <h3 className="font-semibold text-xl text-navy-900 mb-3">4.2 Refund Policy</h3>
                <p className="text-navy-700 mb-6">
                  Initial consultation sessions are complimentary. Once paid services have been rendered and deliverables provided, fees are non-refundable. If you are dissatisfied with our services, please contact us immediately to discuss your concerns.
                </p>

                <h3 className="font-semibold text-xl text-navy-900 mb-3">4.3 Late Payments</h3>
                <p className="text-navy-700 mb-6">
                  Late payments may be subject to interest charges and may result in suspension of services until payment is received. We reserve the right to pursue collection of unpaid fees.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-navy-900 mb-4">5. Intellectual Property</h2>
                <p className="text-navy-700 mb-6">
                  All content on our website, including text, graphics, logos, images, videos, software, and materials provided as part of our services, is the property of Carolina Tax Strategy and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission.
                </p>
                <p className="text-navy-700 mb-6">
                  Materials provided to you as part of our services (tax plans, guides, worksheets) are for your personal use only and may not be shared, sold, or distributed without authorization.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-navy-900 mb-4">6. Confidentiality</h2>
                <p className="text-navy-700 mb-6">
                  We maintain strict confidentiality of all client information. We will not disclose your personal or financial information to third parties except as necessary to provide our services, as required by law, or with your express consent. See our Privacy Policy for detailed information about how we handle your data.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-navy-900 mb-4">7. Disclaimers and Limitations of Liability</h2>
                
                <h3 className="font-semibold text-xl text-navy-900 mb-3">7.1 No Guarantees</h3>
                <p className="text-navy-700 mb-6">
                  Our services are provided "as is" without warranties of any kind. We do not guarantee specific tax savings, outcomes, or results. Tax laws are complex and subject to change. Individual results vary based on circumstances, implementation, and compliance.
                </p>

                <h3 className="font-semibold text-xl text-navy-900 mb-3">7.2 Tax Return Preparation</h3>
                <p className="text-navy-700 mb-6">
                  We provide professional tax preparation and filing services for businesses and individuals. While we take great care in preparing accurate returns, you are responsible for reviewing all information for accuracy before filing. We are not responsible for penalties or issues arising from inaccurate information provided by clients.
                </p>

                <h3 className="font-semibold text-xl text-navy-900 mb-3">7.3 Limitation of Liability</h3>
                <p className="text-navy-700 mb-6">
                  To the maximum extent permitted by law, Carolina Tax Strategy and its owners, employees, and affiliates shall not be liable for any indirect, incidental, consequential, or punitive damages arising from your use of our services or website, including but not limited to loss of profits, business interruption, or tax penalties. Our total liability for any claims related to our services shall not exceed the amount you paid for those services.
                </p>

                <h3 className="font-semibold text-xl text-navy-900 mb-3">7.4 IRS Audits and Penalties</h3>
                <p className="text-navy-700 mb-6">
                  While we provide audit-ready documentation standards and strategies designed for legal tax reduction, we cannot guarantee you will not be audited or face IRS scrutiny. We are not responsible for penalties, interest, or additional taxes that may result from IRS examinations, improper implementation of strategies, or changes in tax law.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-navy-900 mb-4">8. User Conduct</h2>
                <p className="text-navy-700 mb-4">
                  When using our website or services, you agree not to:
                </p>
                <ul className="text-navy-700 space-y-2 mb-6">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Transmit harmful code, viruses, or malware</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Harass, abuse, or harm other users or our staff</li>
                  <li>Use our services for fraudulent or illegal purposes</li>
                  <li>Misrepresent your identity or affiliation</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-navy-900 mb-4">9. Third-Party Services</h2>
                <p className="text-navy-700 mb-6">
                  Our website may contain links to third-party websites or integrate with third-party services. We are not responsible for the content, privacy practices, or terms of service of these external sites. Your use of third-party services is governed by their respective terms and policies.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-navy-900 mb-4">10. Termination</h2>
                <p className="text-navy-700 mb-6">
                  We reserve the right to terminate or suspend your access to our website or services at any time, with or without notice, for conduct that we believe violates these terms or is harmful to our business, other users, or third parties. You may terminate your use of our services at any time by contacting us, subject to any outstanding payment obligations.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-navy-900 mb-4">11. Indemnification</h2>
                <p className="text-navy-700 mb-6">
                  You agree to indemnify, defend, and hold harmless Carolina Tax Strategy and its owners, employees, and affiliates from any claims, damages, losses, liabilities, and expenses (including attorney fees) arising from your use of our services, violation of these terms, or infringement of any rights of third parties.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-navy-900 mb-4">12. Dispute Resolution</h2>
                
                <h3 className="font-semibold text-xl text-navy-900 mb-3">12.1 Governing Law</h3>
                <p className="text-navy-700 mb-6">
                  These Terms of Service shall be governed by and construed in accordance with the laws of the State of North Carolina, without regard to conflict of law principles.
                </p>

                <h3 className="font-semibold text-xl text-navy-900 mb-3">12.2 Arbitration</h3>
                <p className="text-navy-700 mb-6">
                  Any disputes arising from these terms or our services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, except where prohibited by law. Arbitration shall take place in Charlotte, North Carolina.
                </p>

                <h3 className="font-semibold text-xl text-navy-900 mb-3">12.3 Class Action Waiver</h3>
                <p className="text-navy-700 mb-6">
                  You agree to resolve disputes with us on an individual basis and waive any right to participate in class action lawsuits or class-wide arbitration.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-navy-900 mb-4">13. Miscellaneous</h2>
                
                <h3 className="font-semibold text-xl text-navy-900 mb-3">13.1 Entire Agreement</h3>
                <p className="text-navy-700 mb-6">
                  These Terms of Service, together with our Privacy Policy and any signed engagement agreements, constitute the entire agreement between you and Carolina Tax Strategy regarding our services.
                </p>

                <h3 className="font-semibold text-xl text-navy-900 mb-3">13.2 Severability</h3>
                <p className="text-navy-700 mb-6">
                  If any provision of these terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
                </p>

                <h3 className="font-semibold text-xl text-navy-900 mb-3">13.3 Waiver</h3>
                <p className="text-navy-700 mb-6">
                  Our failure to enforce any right or provision of these terms shall not constitute a waiver of that right or provision.
                </p>

                <h3 className="font-semibold text-xl text-navy-900 mb-3">13.4 Assignment</h3>
                <p className="text-navy-700 mb-6">
                  You may not assign or transfer these terms or your rights hereunder without our prior written consent. We may assign these terms without restriction.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-navy-900 mb-4">14. Contact Information</h2>
                <p className="text-navy-700 mb-4">
                  If you have questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-navy-700 mb-2">
                    <strong>Carolina Tax Strategy</strong>
                  </p>
                  <p className="text-navy-700 mb-2">
                    Email: info@carolinataxstrategy.com
                  </p>
                  <p className="text-navy-700 mb-2">
                    Phone: (844) 641-1040
                  </p>
                  <p className="text-navy-700">
                    Address: Charlotte, NC
                  </p>
                </div>
              </section>

              <div className="bg-gold/10 border border-gold/30 rounded-xl p-6 mt-8">
                <p className="text-navy-700 font-medium mb-2">
                  By using Carolina Tax Strategy services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
                <p className="text-navy-700 text-sm mb-0">
                  These terms were last updated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. Please review periodically for updates.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
