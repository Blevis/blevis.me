import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";
import { SmoothScroll } from "@/components/SmoothScroll";
import { IntroProvider } from "@/components/Intro";
import { Cursor } from "@/components/Cursor";
import { Aurora } from "@/components/Aurora";
import { CommandPalette } from "@/components/CommandPalette";
import { profile } from "@/data/cv";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const title = `${profile.name} — ${profile.headline}`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title,
  description: profile.summary,
  openGraph: {
    title,
    description: profile.summary,
    type: "website",
    url: profile.siteUrl,
    siteName: profile.name,
  },
  twitter: {
    card: "summary",
    title,
    description: profile.summary,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: profile.siteUrl },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} h-full`}>
      <body className="relative flex min-h-full flex-col bg-obsidian text-fg">
        <Aurora />
        <div aria-hidden className="dot-grid pointer-events-none fixed inset-0 -z-10" />
        <div aria-hidden className="dot-grid-spot pointer-events-none fixed inset-0 -z-10" />
        <SmoothScroll>
          <IntroProvider>
            <ToastProvider>
              {children}
              <CommandPalette />
            </ToastProvider>
          </IntroProvider>
        </SmoothScroll>
        <Cursor />
      </body>
    </html>
  );
}
