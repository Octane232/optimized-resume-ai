import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const Contact = () => {
  const [copied, setCopied] = React.useState(false);
  const emailAddress = 'contact@vaylance.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    toast.success('Email address copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        <section className="py-20 bg-gradient-to-br from-primary/5 to-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                Get in Touch
              </h1>
              <p className="text-xl text-muted-foreground">
                Questions about pricing, features, or need help? Send us a message and we'll respond within 24 hours.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card className="text-center p-12 bg-card border-border">
                <CardContent className="p-0">
                  <div className="text-primary mb-6 flex justify-center">
                    <Mail className="w-16 h-16" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">Email Support</h2>
                  <p className="text-muted-foreground mb-8 text-lg">
                    Send us an email at the address below and we'll respond within 24 hours
                  </p>
                  <div className="bg-secondary rounded-lg p-6 mb-6">
                    <p className="text-2xl font-semibold text-foreground mb-4">{emailAddress}</p>
                    <Button 
                      onClick={handleCopyEmail}
                      className="gap-2"
                      size="lg"
                    >
                      {copied ? (
                        <>
                          <Check className="w-5 h-5" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5" />
                          Copy Email Address
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    You can use your preferred email client to send us a message
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
