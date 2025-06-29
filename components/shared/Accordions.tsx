import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type AccordionItemType = {
  value: string;
  question: string;
  answer: string;
};

type AccordionsProps = {
  items: AccordionItemType[];
};

const Accordions = ({ items }: AccordionsProps) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger className="p-medium-16">{item.question}</AccordionTrigger>
          <AccordionContent className="p-medium-14 text-[#5E5E5E]">{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default Accordions;