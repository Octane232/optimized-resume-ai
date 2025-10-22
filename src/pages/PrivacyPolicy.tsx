import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShieldCheck, Eye, Database, Lock, UserCheck, Globe } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 lg:px-8 py-24 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-6">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold gradient-text">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your privacy is important to us. Last updated: December 2024
          </p>
        </div>

        {/* Content */}
        <div className="glass-card p-8 md:p-12 space-y-10">
          <section className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">1. Information We Collect</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    PitchSora collects various types of information to provide and improve our AI-powered resume building service:
                  </p>
                  
                  <div className="space-y-3">
                    <p className="font-semibold text-foreground">Personal Information:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Name, email address, phone number, and professional details</li>
                      <li>Resume content including work history, education, skills, and achievements</li>
                      <li>Profile information and career preferences</li>
                      <li>Payment and billing information (processed securely through third-party providers)</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <p className="font-semibold text-foreground">Usage Information:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>How you interact with our Service and features</li>
                      <li>Pages visited, time spent, and navigation patterns</li>
                      <li>Device information, IP address, and browser type</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <p className="font-semibold text-foreground">AI Training Data:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Anonymized and aggregated resume data to improve AI algorithms</li>
                      <li>User feedback on AI-generated content</li>
                      <li>Job matching preferences and success metrics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">2. How We Use Your Information</h2>
                <div className="space-y-3 text-muted-foreground leading-relaxed">
                  <p>We use the collected information for the following purposes:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Service Delivery:</strong> To provide resume building, job matching, and career services</li>
                    <li><strong>AI Enhancement:</strong> To train and improve our AI algorithms for better resume suggestions</li>
                    <li><strong>Personalization:</strong> To customize your experience and provide relevant job recommendations</li>
                    <li><strong>Communication:</strong> To send service updates, newsletters, and marketing communications (with your consent)</li>
                    <li><strong>Payment Processing:</strong> To process subscriptions and transactions securely</li>
                    <li><strong>Analytics:</strong> To understand usage patterns and improve our Service</li>
                    <li><strong>Security:</strong> To detect and prevent fraud, abuse, and security threats</li>
                    <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our Terms</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">3. Information Sharing</h2>
                <div className="space-y-3 text-muted-foreground leading-relaxed">
                  <p>
                    We do not sell your personal information. We may share your information in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>With Your Consent:</strong> When you explicitly approve sharing your resume with potential employers</li>
                    <li><strong>Service Providers:</strong> With trusted third-party vendors who help us operate our Service (hosting, analytics, payment processing)</li>
                    <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                    <li><strong>Aggregated Data:</strong> We may share anonymized, aggregated statistics about resume trends and job market insights</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">4. Data Security</h2>
                <div className="space-y-3 text-muted-foreground leading-relaxed">
                  <p>
                    We implement industry-standard security measures to protect your information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>End-to-end encryption for sensitive data transmission</li>
                    <li>Secure data storage with regular backups</li>
                    <li>Multi-factor authentication options</li>
                    <li>Regular security audits and penetration testing</li>
                    <li>SOC 2 compliance and adherence to industry best practices</li>
                    <li>Limited employee access to personal data on a need-to-know basis</li>
                  </ul>
                  <p className="mt-3">
                    While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but are committed to maintaining the highest standards.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">5. Your Rights and Choices</h2>
                <div className="space-y-3 text-muted-foreground leading-relaxed">
                  <p>You have the following rights regarding your personal information:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                    <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
                    <li><strong>Export:</strong> Download your resume data in a portable format</li>
                    <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
                    <li><strong>Restrict Processing:</strong> Limit how we use your information</li>
                    <li><strong>Data Portability:</strong> Transfer your data to another service provider</li>
                  </ul>
                  <p className="mt-3">
                    To exercise these rights, please contact us at privacy@pitchsora.com. We will respond within 30 days.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold mb-4">6. Cookies and Tracking</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                We use cookies and similar technologies to enhance your experience:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Essential Cookies:</strong> Required for basic Service functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use our Service</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Marketing Cookies:</strong> Deliver relevant advertisements (with your consent)</li>
              </ul>
              <p className="mt-3">
                You can control cookies through your browser settings. Note that disabling certain cookies may affect Service functionality.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold mb-4">7. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our Service is not intended for individuals under 16 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately, and we will delete such information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold mb-4">8. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal information for as long as necessary to provide our Service and fulfill the purposes outlined in this Privacy Policy. When you delete your account, we will delete or anonymize your personal information within 90 days, except where we are required to retain it for legal compliance, dispute resolution, or fraud prevention.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold mb-4">9. International Data Transfers</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy, including standard contractual clauses approved by regulatory authorities.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold mb-4">10. Updates to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold mb-4">11. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy or how we handle your information, please contact us:
            </p>
            <div className="bg-primary/5 rounded-xl p-6 space-y-2">
              <p className="font-semibold text-foreground">PitchSora Privacy Team</p>
              <p className="text-muted-foreground">Email: privacy@pitchsora.com</p>
              <p className="text-muted-foreground">Data Protection Officer: dpo@pitchsora.com</p>
              <p className="text-muted-foreground">Address: [Your Business Address]</p>
            </div>
          </section>

          <div className="mt-12 p-6 bg-primary/5 rounded-xl border border-primary/10">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Your Trust Matters:</strong> At PitchSora, we are committed to transparency and protecting your privacy. We will never sell your personal information to third parties. Your resume data is yours, and you maintain full control over how it's used and shared.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;