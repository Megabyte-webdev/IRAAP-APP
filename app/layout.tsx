import type { Metadata } from "next";
import "./globals.css";
import Providers from "./_context/Providers";
import { generatePageMetadata } from "./_lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title:
    "Institutional Repository for Academic Projects | Department of Computer Engineering",
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
      <head>
        <meta name="theme-color" content="#0f172a" />
  <meta name="color-scheme" content="light" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Londrina+Shadow&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Pompiere&display=swap"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "IRAP",
      url: "https://iraap.com.ng",
      description:
        "Institutional Repository for the Department of Computer Engineering, Olabisi Onabanjo University.",
      publisher: {
        "@type": "CollegeOrUniversity",
        name: "Olabisi Onabanjo University",
      },
    }),
  }}
/>
      </head>
      <body className="antialiased font-inter">
        <Providers>{children}</Providers>

        {/* ALL MODALS WILL RENDER HERE, OUTSIDE THE DASHBOARD FLOW */}
        <div id="modal-root" className="relative z-9999" />
      </body>
    </html>
  );
}
