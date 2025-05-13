import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Image from "next/image";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Binance Security",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* header bar with on logo */}
        <header className="bg-white px-4 border-b">
          <div className="max-w-7xl mx-auto">
            <div className="text-yellow-500 font-bold text-xl flex items-center">
              <Image
                src="/binance-logo.png"
                alt="Binance Logo"
                width={150}
                height={50}
                className="mr-2"
              />
            </div>
          </div>
        </header>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
