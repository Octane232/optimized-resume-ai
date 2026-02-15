import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel with one click from the billing portal. Your access stays active until the end of your billing period, and you will never be charged again.',
  },
  {
    q: 'What exactly is an AI Credit?',
    a: 'One AI Credit powers a single AI action: generating a tailored resume, writing a cover letter, running a mock interview round, or optimising your LinkedIn profile. Free users get 5 credits per month.',
  },
  {
    q: 'What happens when I run out of credits?',
    a: 'You can still use all free features like resume scoring, skill gap overview, job scout, and the application tracker. AI-powered generation pauses until your credits reset on the 2nd of each month or you upgrade.',
  },
  {
    q: 'How do I upgrade or change my plan?',
    a: 'Click the upgrade button on the plan you want. You will be taken to a secure Stripe checkout page. After payment, your credits are instantly updated.',
  },
];

const BillingFAQ = () => {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Frequently Asked Questions</h3>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="border-border/40">
            <AccordionTrigger className="text-sm font-medium text-foreground/90 hover:no-underline">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default BillingFAQ;
