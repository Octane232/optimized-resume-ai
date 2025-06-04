
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Contact Us
              </h1>
              <p className="text-xl text-gray-600">
                Have questions? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: <Mail className="w-6 h-6" />,
                  title: "Email Support",
                  description: "support@airesumepro.com",
                  subtitle: "We typically respond within 24 hours"
                },
                {
                  icon: <Phone className="w-6 h-6" />,
                  title: "Phone Support",
                  description: "+1 (555) 123-4567",
                  subtitle: "Monday - Friday, 9 AM - 6 PM EST"
                },
                {
                  icon: <MapPin className="w-6 h-6" />,
                  title: "Office",
                  description: "123 Business Ave, Suite 100",
                  subtitle: "San Francisco, CA 94105"
                }
              ].map((contact, index) => (
                <Card key={index} className="text-center p-8">
                  <CardContent className="p-0">
                    <div className="text-blue-600 mb-4 flex justify-center">{contact.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{contact.title}</h3>
                    <p className="text-gray-900 font-medium mb-1">{contact.description}</p>
                    <p className="text-gray-600 text-sm">{contact.subtitle}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="max-w-2xl mx-auto">
              <Card className="p-8">
                <CardContent className="p-0">
                  <h2 className="text-2xl font-bold mb-6 text-center">Send us a message</h2>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name</label>
                        <input type="text" className="w-full p-3 border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name</label>
                        <input type="text" className="w-full p-3 border border-gray-300 rounded-lg" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input type="email" className="w-full p-3 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Message</label>
                      <textarea rows={5} className="w-full p-3 border border-gray-300 rounded-lg"></textarea>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Send Message</Button>
                  </form>
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
