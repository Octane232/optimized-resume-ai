import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQSection = () => {
  const faqs = [
    {
      question: "Do your resumes actually work with ATS systems?",
      answer: "Yes. All our templates are tested against major ATS platforms (Workday, Greenhouse, Lever, etc.). We use standard formatting, proper heading hierarchy, and avoid complex layouts that confuse ATS scanners. That said, the best way to pass ATS is to match the job description keywords, which our AI suggestions help with."
    },
    {
      question: "Can I actually use these resumes for free?",
      answer: "Yes, you can create and download resumes for free. The free plan includes access to all templates and basic editing. Pro features like AI content suggestions, unlimited downloads, and cover letter generation require a paid plan."
    },
    {
      question: "How is this different from Canva or Google Docs?",
      answer: "Unlike design tools, our templates are specifically built for ATS compatibility. We also provide AI suggestions for improving your content based on job descriptions. Think of it as a resume-specific tool rather than a general design platform."
    },
    {
      question: "What if I want a refund?",
      answer: "We offer a 7-day money-back guarantee on all paid plans. If you're not satisfied, just email us at contact@vaylance.com and we'll process your refund, no questions asked."
    },
    {
      question: "Do you sell my data?",
      answer: "No. We don't sell your data to anyone. Your resume information is yours. We use it only to provide the service and improve our AI suggestions. You can delete your account and all data anytime from settings."
    },
    {
      question: "Can I export to Word or just PDF?",
      answer: "Currently we support PDF export, which is what most companies prefer. Word export is on our roadmap. PDF ensures your formatting stays exactly as you designed it."
    },
    {
      question: "Does the AI write my resume for me?",
      answer: "Not quite. The AI suggests improvements to what you write - better phrasing, stronger action verbs, relevant keywords. You're still in control. Think of it as a writing assistant, not a ghostwriter."
    },
    {
      question: "What happens if I cancel my subscription?",
      answer: "You keep access to your resumes. You can still view and use them, but you'll lose access to AI features, unlimited downloads, and new templates. Your data isn't deleted unless you close your account."
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Questions people actually ask
          </h2>
          <p className="text-lg text-muted-foreground">
            Straight answers, no BS
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-border rounded-lg px-6 bg-card"
            >
              <AccordionTrigger className="text-left hover:no-underline py-5">
                <span className="font-semibold text-foreground pr-4">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Still have questions?
          </p>
          <a 
            href="/contact" 
            className="text-primary font-medium hover:underline"
          >
            Contact us →
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;