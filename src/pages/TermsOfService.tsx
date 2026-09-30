import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, FileText, Users, Lock } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 lg:px-8 py-24 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-6">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold gradient-text">
            Terms of Service
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Last updated: December 2024
          </p>
        </div>

        {/* Content */}
        <div className="glass-card p-8 md:p-12 space-y-10">
          <section className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using Vaylance (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our Service. Our Service is a comprehensive AI-powered resume building and career acceleration platform designed to help professionals create compelling resumes, find job opportunities, and advance their careers.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">2. User Accounts</h2>
                <div className="space-y-3 text-muted-foreground leading-relaxed">
                  <p>
                    When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password and for all activities that occur under your account.
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You must be at least 16 years old to use this Service</li>
                    <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                    <li>You must notify us immediately of any unauthorized use of your account</li>
                    <li>We reserve the right to refuse service or terminate accounts at our discretion</li>
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
                <h2 className="text-3xl font-bold mb-4">3. Intellectual Property</h2>
                <div className="space-y-3 text-muted-foreground leading-relaxed">
                  <p>
                    The Service and its original content, features, and functionality are owned by Vaylance and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                  </p>
                  <p className="font-semibold text-foreground">User Content:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You retain ownership of all resume content you create using our Service</li>
                    <li>By uploading content, you grant us a license to use, modify, and display your content solely for providing the Service</li>
                    <li>You are responsible for ensuring your content does not infringe on third-party rights</li>
                    <li>We may use anonymized, aggregated data to improve our AI algorithms and services</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold mb-4">4. AI-Generated Content</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                Our Service uses artificial intelligence to generate resume content, cover letters, and career suggestions. While we strive for accuracy:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>AI-generated content is provided as suggestions and recommendations</li>
                <li>You are responsible for reviewing and verifying all content before use</li>
                <li>We do not guarantee the accuracy or suitability of AI-generated content</li>
                <li>You should customize and personalize all AI suggestions to reflect your unique experience</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold mb-4">5. Subscription and Payments</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                Some aspects of the Service are provided on a subscription basis. By purchasing a subscription:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You agree to pay the fees associated with your chosen subscription plan</li>
                <li>Subscriptions automatically renew unless cancelled before the renewal date</li>
                <li>We may change subscription fees with 30 days' notice</li>
                <li>Refunds are provided in accordance with our refund policy</li>
                <li>All payments are processed securely through third-party payment processors</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold mb-4">6. Prohibited Uses</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>You agree not to use the Service:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>For any unlawful purpose or to violate any laws</li>
                <li>To create false or misleading resumes or professional profiles</li>
                <li>To impersonate others or misrepresent your affiliation with any person or entity</li>
                <li>To transmit malicious code, viruses, or any harmful technology</li>
                <li>To scrape, data mine, or use automated tools to access the Service</li>
                <li>To attempt to gain unauthorized access to our systems</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold mb-4">7. Limitation of Liability</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                To the maximum extent permitted by law, Vaylance shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses resulting from:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your use or inability to use the Service</li>
                <li>Any conduct of third parties on the Service</li>
                <li>Unauthorized access to or alteration of your content</li>
                <li>Job search outcomes or employment decisions</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold mb-4">8. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may terminate or suspend your account and access to the Service immediately, without prior notice, for any breach of these Terms. Upon termination, your right to use the Service will cease immediately. You may also terminate your account at any time through your account settings.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold mb-4">9. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify or replace these Terms at any time at our sole discretion. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. Material changes will be communicated via email or a prominent notice on our Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold mb-4">10. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Vaylance operates, without regard to its conflict of law provisions. Any disputes arising from these Terms or the Service will be subject to the exclusive jurisdiction of the courts in that jurisdiction.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold mb-4">11. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-primary/5 rounded-xl p-6 space-y-2">
              <p className="font-semibold text-foreground">Vaylance Support Team</p>
              <p className="text-muted-foreground">Email: contact@vaylance.com</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;