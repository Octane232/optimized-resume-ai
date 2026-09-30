import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// FAQ data for Pro/Elite tiers
const faqs = [
  {
    q: 'What is included in a Resume + ATS run?',
    a: 'One Resume + ATS run gives you a tailored resume optimized for a specific job description, a matching cover letter, and a detailed ATS score analysis — all generated together. Pro users get 40 runs/month. Elite users get 150 runs/month.',
  },
  {
    q: 'How does the 3-day free trial work?',
    a: 'Every new subscription starts with a 3-day free trial. You add a card at checkout but you are not charged until day 4. During the trial you get fair-use limits: 5 Resume + ATS runs, 3 Word rewrites, 5 Job Radar alerts and 3 interview sessions. Cancel before the trial ends and you pay nothing.',
  },
  {
    q: 'When do my monthly limits reset?',
    a: 'For paid plans (Pro and Elite), limits reset on your monthly billing date — the same day each month that you subscribed. For example, if you subscribed on the 15th, your limits reset on the 15th of each month.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel with one click from the billing portal. Your access stays active until the end of your billing period and you will never be charged again. No cancellation fees, no questions asked.',
  },
  {
    q: 'How do I upgrade my plan?',
    a: 'Click the "Get Pro" or "Get Elite" button on the pricing card. You will be taken to a secure Stripe checkout page. After payment, your limits are instantly updated and you can continue using all features.',
  },
  {
    q: 'What happens when I hit my monthly limit?',
    a: 'An upgrade prompt appears right inside the feature. You can still use unlimited application tracking and read the alerts you already have. Only AI-powered features pause until your next billing cycle or until you upgrade to a higher tier.',
  },
  {
    q: 'Can I switch between Pro and Elite?',
    a: 'Yes. You can upgrade or downgrade anytime from the billing portal. Upgrades take effect immediately. Downgrades will apply at the end of your current billing period.',
  },
  {
    q: 'Is there a refund policy?',
    a: 'If you are not satisfied, contact us at contact@vaylance.com within 7 days of your first charge and we will process a full refund, no questions asked.',
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
