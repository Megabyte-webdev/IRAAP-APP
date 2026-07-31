"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    id: 1,
    question: "How are accounts provisioned for new students?",
    answer:
      "Accounts are automatically provisioned at the start of each semester based on the official registration list from the department. If you cannot log in, please ensure your registration is complete or contact the department admin via the form above.",
  },
  {
    id: 2,
    question: "What are the guidelines for hardware and software uploads?",
    answer:
      "Software projects require a public or private GitHub repository link alongside documentation. Hardware projects must include complete schematic diagrams, component bill of materials (BOM), and demonstration media.",
  },
  {
    id: 3,
    question: "Who can view my project uploads?",
    answer:
      "Approved project uploads are indexed in the public department archive. Drafts, pending submissions, and restricted technical files are only visible to you and your assigned project supervisor.",
  },
  {
    id: 4,
    question: "How do I reset my password?",
    answer:
      "You can request a password reset link through the login page using your university email address. Alternatively, contact your department administrator for credential verification.",
  },
];

export default function FAQSection() {
  // Set default open item to ID 1 to match design preview
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleFaq = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="w-full bg-white py-16 px-6">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center tracking-tight">
          Frequently Asked Questions
        </h2>

        {/* Accordion Container */}
        <div className="space-y-4">
          {faqData.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-[#EBF5FF] border-[#BBE1FA]/70"
                    : "bg-white border-slate-200/90 hover:border-slate-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`text-base md:text-lg font-bold tracking-tight ${
                      isOpen ? "text-[#0F3256]" : "text-slate-800"
                    }`}
                  >
                    {faq.question}
                  </span>

                  <div className="shrink-0 text-[#0F3256]">
                    {isOpen ? (
                      <Minus className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      <Plus className="w-5 h-5 stroke-[2.5] text-slate-600" />
                    )}
                  </div>
                </button>

                {/* Expanded Answer Content */}
                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-sm md:text-[15px] leading-relaxed text-[#2B547E] font-medium">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
