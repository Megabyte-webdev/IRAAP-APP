import { Suspense } from "react";
import Footer from "../_components/Footer";
import { generatePageMetadata } from "../_lib/metadata";
import Nav from "../_components/Nav";
import ContactForm from "./_components/ContactForm";

export const metadata = generatePageMetadata({
  title: "Contact IRAAP",
  description:
    "Get in touch with the IRAAP team for questions, support, feedback, or inquiries about the academic research platform.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <Nav />
      <ContactForm />
      <Footer />
    </Suspense>
  );
}
