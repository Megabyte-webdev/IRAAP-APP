import type { Metadata } from "next";
import "./globals.css";
import Providers from "./_context/Providers";
import { generatePageMetadata } from "./_lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title:
    "OOU · Institutional Repository for Academic Projects | Department of Computer Engineering",
  description:
    "The official digital repository for final year project submissions, facilitating seamless collaboration between students and supervisors at the Department of Computer Engineering, Olabisi Onabanjo University.",
  path: "/",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <Providers>{children}</Providers>

        {/* ALL MODALS WILL RENDER HERE, OUTSIDE THE DASHBOARD FLOW */}
        <div id="modal-root" className="relative z-9999" />
      </body>
    </html>
  );
}
