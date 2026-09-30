import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie, Shield, Settings, Eye } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ScrollArea } from '@/components/ui/scroll-area';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Link 
          to="/" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="bg-card rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
            <p className="text-muted-foreground">Last updated: October 28, 2025</p>
          </div>

          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-8">
              <section>
                <div className="flex items-center mb-4">
                  <Cookie className="h-6 w-6 mr-2 text-primary" />
                  <h2 className="text-2xl font-semibold">What Are Cookies</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                  They are widely used to make websites work more efficiently and provide information to website owners.
                </p>
              </section>

              <section>
                <div className="flex items-center mb-4">
                  <Settings className="h-6 w-6 mr-2 text-primary" />
                  <h2 className="text-2xl font-semibold">How We Use Cookies</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use cookies for the following purposes:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Analytics Cookies:</strong> We use these cookies to understand how visitors interact with our website, helping us improve user experience.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Preference Cookies:</strong> These cookies remember your settings and preferences to provide a personalized experience.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Marketing Cookies:</strong> These cookies track your browsing habits to show you relevant advertisements.</span>
                  </li>
                </ul>
              </section>

              <section>
                <div className="flex items-center mb-4">
                  <Shield className="h-6 w-6 mr-2 text-primary" />
                  <h2 className="text-2xl font-semibold">Types of Cookies We Use</h2>
                </div>
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Session Cookies</h3>
                    <p className="text-muted-foreground text-sm">
                      Temporary cookies that expire when you close your browser. They help us remember your actions during a browsing session.
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Persistent Cookies</h3>
                    <p className="text-muted-foreground text-sm">
                      Cookies that remain on your device for a set period or until you delete them. They help us recognize you as a returning visitor.
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">First-Party Cookies</h3>
                    <p className="text-muted-foreground text-sm">
                      Cookies set directly by our website. We use these to provide core functionality and improve your experience.
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Third-Party Cookies</h3>
                    <p className="text-muted-foreground text-sm">
                      Cookies set by third-party services we use, such as analytics providers and advertising partners.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center mb-4">
                  <Eye className="h-6 w-6 mr-2 text-primary" />
                  <h2 className="text-2xl font-semibold">Managing Your Cookie Preferences</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Browser Settings:</strong> Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or delete certain cookies.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Cookie Banner:</strong> When you first visit our website, you can choose which types of cookies to accept through our cookie consent banner.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Opt-Out Tools:</strong> You can opt out of third-party advertising cookies by visiting the Network Advertising Initiative opt-out page.</span>
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Please note that if you disable cookies, some features of our website may not function properly.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use the following third-party services that may set cookies:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Google Analytics - for website analytics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Supabase - for authentication and database services</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Stripe - for payment processing</span>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, 
                  legal, or regulatory reasons. We encourage you to review this policy periodically for any updates.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about our use of cookies, please contact us at:
                </p>
                <p className="text-muted-foreground mt-2">
                  Email: <a href="mailto:contact@vaylance.com" className="text-primary hover:underline">contact@vaylance.com</a>
                </p>
              </section>
            </div>
          </ScrollArea>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicy;
