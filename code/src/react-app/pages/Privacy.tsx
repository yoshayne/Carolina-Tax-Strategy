import Header from '@/react-app/components/Header';
import Footer from '@/react-app/components/Footer';
import { Shield } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 py-12 lg:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-teal/20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-teal" />
              </div>
              <h1 className="font-serif text-3xl md:text-4xl text-white">Privacy Policy</h1>
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
                  At Carolina Tax Strategy, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                </p>
              </div>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-navy-900 mb-4">Information We Collect</h2>
                
                <h3 className="font-semibold text-xl text-navy-900 mb-3">Personal Information</h3>
                <p className="text-navy-700 mb-4">
                  We collect information that you voluntarily provide to us when you:
                </p>
                <ul className="text-navy-700 space-y-2 mb-6">
                  <li>Book a consultation or strategy session</li>
                  <li>Request information or download resources</li>
                  <li>Subscribe to our newsletter or email updates</li>
                  <li>Contact us through our website or email</li>
                  <li>Engage our services for tax planning</li>
                </ul>
                <p className="text-navy-700 mb-4">
                  This information may include:
                </p>
                <ul className="text-navy-700 space-y-2 mb-6">
                  <li>Name and contact information (email, phone number, mailing address)</li>
                  <li>Business information (business name, structure, revenue)</li>
                  <li>Financial information relevant to tax planning services</li>
                  <li>Tax documents and records you provide for our services</li>
                </ul>

                <h3 className="font-semibold text-xl text-navy-900 mb-3">Automatically Collected Information</h3>
                <p className="text-navy-700 mb-4">
                  When you visit our website, we may automatically collect certain information about your device and browsing activity, including:
                </p>
                <ul className="text-navy-700 space-y-2 mb-6">
                  <li>IP address and browser type</li>
                  <li>Operating system and device information</li>
                  <li>Pages visited and time spent on pages</li>
                  <li>Referring website addresses</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-navy-900 mb-4">How We Use Your Information</h2>
                <p className="text-navy-700 mb-4">
                  We use the information we collect to:
                </p>
                <ul className="text-navy-700 space-y-2 mb-6">
                  <li>Provide, maintain, and improve our tax planning services</li>
                  <li>Schedule and conduct consultations and strategy sessions</li>
                  <li>Communicate with you about our services, including responding to inquiries</li>
                  <li>Send you relevant tax planning information, updates, and educational content</li>
                  <li>Process payments and manage client accounts</li>
                  <li>Analyze and improve our website functionality and user experience</li>
                  <li>Comply with legal obligations and protect our legal rights</li>
                  <li>Prevent fraud and enhance security</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-navy-900 mb-4">Information Sharing and Disclosure</h2>
                <p className="text-navy-700 mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                </p>
                
                <h3 className="font-semibold text-xl text-navy-900 mb-3">Service Providers</h3>
                <p className="text-navy-700 mb-4">
                  We may share information with trusted third-party service providers who assist us in operating our website and delivering our services, including:
                </p>
                <ul className="text-navy-700 space-y-2 mb-6">
                  <li>Email service providers</li>
                  <li>Payment processors</li>
                  <li>Calendar and scheduling tools</li>
                  <li>Document storage and management systems</li>
                  <li>Website analytics providers</li>
                </ul>
                <p className="text-navy-700 mb-6">
                  These service providers are contractually obligated to protect your information and use it only for the purposes we specify.
                </p>

                <h3 className="font-semibold text-xl text-navy-900 mb-3">Professional Advisors</h3>
                <p className="text-navy-700 mb-6">
                  With your consent, we may share information with your CPA, attorney, or other financial professionals as necessary to provide comprehensive tax planning services.
                </p>

                <h3 className="font-semibold text-xl text-navy-900 mb-3">Legal Requirements</h3>
                <p className="text-navy-700 mb-6">
                  We may disclose your information if required by law, court order, or governmental regulation, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-navy-900 mb-4">Data Security</h2>
                <p className="text-navy-700 mb-4">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="text-navy-700 space-y-2 mb-6">
                  <li>Encrypted data transmission (SSL/TLS)</li>
                  <li>Secure document portals for file sharing</li>
                  <li>Access controls and authentication procedures</li>
                  <li>Regular security assessments and updates</li>
                  <li>Employee training on data protection</li>
                </ul>
                <p className="text-navy-700 mb-6">
                  However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-navy-900 mb-4">Your Privacy Rights</h2>
                <p className="text-navy-700 mb-4">
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>
                <ul className="text-navy-700 space-y-2 mb-6">
                  <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Objection:</strong> Object to our processing of your information</li>
                  <li><strong>Portability:</strong> Request transfer of your information to another service</li>
                  <li><strong>Withdraw Consent:</strong> Withdraw consent where we rely on consent to process your information</li>
                </ul>
                <p className="text-navy-700 mb-6">
                  To exercise these rights, please contact us at info@carolinataxstrategy.com. We will respond to your request within 30 days.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-navy-900 mb-4">Cookies and Tracking Technologies</h2>
                <p className="text-navy-700 mb-4">
                  We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small data files stored on your device that help us:
                </p>
                <ul className="text-navy-700 space-y-2 mb-6">
                  <li>Remember your preferences and settings</li>
                  <li>Understand how you use our website</li>
                  <li>Improve website performance and functionality</li>
                  <li>Deliver relevant content and advertisements</li>
                </ul>
                <p className="text-navy-700 mb-6">
                  You can control cookie settings through your browser preferences. Note that disabling cookies may affect website functionality.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-navy-900 mb-4">Email Communications</h2>
                <p className="text-navy-700 mb-6">
                  If you subscribe to our email list, we will send you tax planning tips, educational content, and service updates. You can unsubscribe at any time by clicking the unsubscribe link in any email or by contacting us directly. Please note that you may still receive transactional emails related to services you have purchased.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-navy-900 mb-4">Data Retention</h2>
                <p className="text-navy-700 mb-6">
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When information is no longer needed, we will securely delete or anonymize it.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-navy-900 mb-4">Children's Privacy</h2>
                <p className="text-navy-700 mb-6">
                  Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-navy-900 mb-4">Third-Party Links</h2>
                <p className="text-navy-700 mb-6">
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-navy-900 mb-4">Changes to This Privacy Policy</h2>
                <p className="text-navy-700 mb-6">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website and updating the "Last Updated" date. Your continued use of our services after changes are posted constitutes acceptance of the updated policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-navy-900 mb-4">Contact Us</h2>
                <p className="text-navy-700 mb-4">
                  If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
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
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
