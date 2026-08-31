import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { generatePageMetadata } from "./_lib/metadata";

export const metadata = generatePageMetadata({
  title: "Page Not Found · IRAAP Repository",
  description: "The requested IRAAP Repository page could not be found.",
});

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <FileQuestion className="mx-auto h-10 w-10 text-slate-400" />
        <h1 className="mt-4 text-xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-2 text-sm text-slate-500">The resource may have moved or is no longer available.</p>
        <Link href="/" className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white">Return home</Link>
      </div>
    </main>
  );
}
