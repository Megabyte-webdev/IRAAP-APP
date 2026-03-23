import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./_context/Providers";
import { ToastContainer } from "react-toastify";
import { generatePageMetadata } from "./_lib/metadata";
import { RouteProtector } from "./_hocs/RouteProtector";

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
    <html lang="en">
      <body className={`antialiased`}>
        <Providers>
          <RouteProtector>
            {children}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
            />
          </RouteProtector>
        </Providers>

        {/* ALL MODALS WILL RENDER HERE, OUTSIDE THE DASHBOARD FLOW */}
        <div id="modal-root" className="relative z-9999" />
      </body>
    </html>
  );
}
