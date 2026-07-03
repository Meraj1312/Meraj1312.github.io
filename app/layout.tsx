import { AuroraBackground } from "@/components/aurora-background";
import { Analytics } from "@vercel/analytics/next";
import { NetworkBackground } from "@/components/network-background";
import { BackgroundGrid } from "@/components/background-grid";
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
    default: "Meraj Khan",
    template: "%s • Meraj Khan",
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
    >
      <body className="bg-background text-foreground">

        <AuroraBackground />

        <BackgroundGrid />

        <NetworkBackground />

        <div className="scanlines" />

        <main className="relative z-10">
          {children}
        </main>

      </body>
    </html>
  );
}