import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FaqItem {
  question: string;
  answer: string;
}

interface EditionFaqProps {
  faqs: FaqItem[];
}

const EditionFaq = ({ faqs }: EditionFaqProps) => (
  <section className="editorial-narrow my-14">
    <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">Common Questions</h2>
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, i) => (
        <AccordionItem key={i} value={`faq-${i}`}>
          <AccordionTrigger className="text-left font-sans text-base font-medium">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="editorial-prose text-sm leading-relaxed">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </section>
);

export default EditionFaq;
