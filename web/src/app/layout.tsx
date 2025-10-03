import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

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
    template: "%s | Adventure Tours",
    default: "Adventure Tours - Explore the World",
  },
  description:
    "Custom tour packages eCommerce: browse, search, and book adventures securely.",
  metadataBase: new URL("https://example.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white text-gray-900`}>
        <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight">Adventure Tours</Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/tours" className="hover:text-blue-600">All Tours</Link>
              <Link href="/admin" className="hover:text-blue-600">Admin</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
        <footer className="border-t py-10 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Adventure Tours. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
