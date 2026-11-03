"use client";

import { CircleHelp } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const questions = [
  {
    question: "What is BookNook?",
    answer:
      "BookNook is an online community library where readers can discover books, share titles from their shelves, and borrow books from other members.",
  },
  {
    question: "How do I find a book?",
    answer:
      "Browse the All Books page to explore the catalog. Open a book’s details to read its description and check its availability.",
  },
  {
    question: "Do I need an account to borrow a book?",
    answer:
      "Yes. Sign in to your BookNook account to borrow books and keep track of your borrowing activity.",
  },
  {
    question: "How can I add a book to the library?",
    answer:
      "Sign in and open Add Book. Enter the book’s details, then optionally add a cover using an image URL or a file from your device.",
  },
  {
    question: "Where can I see the books I have shared?",
    answer:
      "Visit My Books while signed in to see the books you have added and manage their details.",
  },
  {
    question: "How do I check my borrowed books?",
    answer:
      "Open My Borrows while signed in to review the books you have borrowed and their return information.",
  },
];

export default function FaqSection() {
  return (
    <section
      aria-labelledby="faq-heading"
      className="bg-[#f9f3ec] px-4 py-16 text-[#102a3f] sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#d7c8b7] bg-[#ebe3d8] px-5 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
        <h2
          id="faq-heading"
          className="mb-8 flex items-center gap-3 text-3xl font-semibold sm:mb-10 sm:text-4xl"
        >
          <CircleHelp
            aria-hidden="true"
            className="shrink-0 text-[#c29261]"
            size={30}
          />
          Frequently Asked Questions
        </h2>

        <Accordion
          multiple
          className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 md:gap-5"
        >
          {questions.map(({ question, answer }, index) => (
            <AccordionItem
              key={question}
              value={`faq-${index}`}
              className="rounded-2xl border border-[#d7c8b7] bg-[#fffdf9] px-5 py-2 shadow-[0_8px_24px_rgba(16,42,63,0.05)] sm:px-6"
            >
              <AccordionTrigger className="min-h-14 items-center gap-4 py-4 text-lg font-medium text-[#102a3f] hover:no-underline sm:text-xl">
                {question}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm leading-6 text-[#53657b] sm:text-base sm:leading-7">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
