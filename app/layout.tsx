
import { BackgroundGrid } from "@/components/background-grid";
import { Analytics } from "@vercel/analytics/next";
import { CyberNav } from "@/components/cyber-nav";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mohammad Meraj",
    template: "%s • Mohammad Meraj",
  },

  description:
    "Security research, penetration testing, Active Directory, exploit development, detection engineering, SIEM projects, and offensive security documentation.",

  metadataBase: new URL("https://your-domain.com"),
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground antialiased">
        <BackgroundGrid />

        <div className="scanlines pointer-events-none" />

        <CyberNav />

        <main className="relative z-10 pt-16">
          {children}
        </main>

        <Analytics />
      </body>
    </html>
  );
}