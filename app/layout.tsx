import type { Metadata } from "next";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ClientProviders from "../components/ClientProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Teachers Tools Hub | Free AI Tools for K-12 Educators",
  description:
    "Discover 25+ verified, genuinely free AI tools designed to save educators 7-10 hours weekly. Built for K-12 classrooms.",
  keywords: [
    "AI tools",
    "teachers",
    "education",
    "K-12",
    "free tools",
    "lesson planning",
    "educational technology",
  ],
  authors: [{ name: "Teachers Tools Hub" }],
  openGraph: {
    title: "Teachers Tools Hub | Free AI Tools for K-12 Educators",
    description:
      "Discover 25+ verified, genuinely free AI tools designed to save educators 7-10 hours weekly.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Teachers Tools Hub",
    description: "Free AI tools for K-12 educators",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const initialTheme = theme || (prefersDark ? 'dark' : 'light');
                  if (initialTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
