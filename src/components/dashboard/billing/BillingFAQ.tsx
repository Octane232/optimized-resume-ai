import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// FAQ data
const faqs = [
  {
    q: 'What is an application bundle?',
    a: 'One application bundle gives you a tailored resume and a matching cover letter for a specific job — generated together in one go. Free users get 5 bundles total. Starter gets 20 per month. Pro gets 60 per month.',
  },
  {
    q: 'Do free plan limits reset every month?',
    a: 'No. Free plan limits are lifetime — they do not reset. Once you use your 5 free bundles they are gone. Paid plan limits reset on the 1st of each month.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel with one click from the billing portal. Your access stays active until the end of your billing period and you will never be charged again.',
  },
  {
    q: 'How do I upgrade my plan?',
    a: 'Click the upgrade button next to the plan you want. You will be taken to a secure Stripe checkout page. After payment your limits are instantly updated.',
  },
  {
    q: 'What is the Live Interview Copilot?',
    a: 'It is a real-time AI assistant you open during your actual video call interview. You type the question the interviewer asks and instantly get a tailored answer guide — bullet points on how to structure your response. Available on Pro only.',
  },
  {
    q: 'Is there a refund policy?',
    a: 'If you are not satisfied contact us at contact@vaylance.com within 7 days of your first charge and we will process a full refund, no questions asked.',
  },
  {
    q: 'What happens when I hit my monthly limit?',
    a: 'An upgrade prompt appears right inside the feature. You can still use unlimited application tracking and browse Job Radar. Only AI-powered features pause until the 1st of next month or you upgrade.',
  },
];

const BillingFAQ = () => {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-6">
      {/* Section Title */}
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Frequently Asked Questions
      </h3>

      {/* FAQ Accordion */}
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`faq-${index}`}
            className="border-border/40"
          >
            {/* Question */}
            <AccordionTrigger className="text-sm font-medium text-foreground/90 hover:no-underline">
              {faq.q}
            </AccordionTrigger>

            {/* Answer */}
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
