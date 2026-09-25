import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Image from "next/image";
import { getPlatform } from "@/lib/platform";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const platform = getPlatform();

export const metadata: Metadata = {
  title: `${platform.name} Security`,
  icons: { icon: platform.icon },
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
        style={
          {
            "--primary": platform.primary,
            ...platform.theme,
          } as React.CSSProperties
        }
      >
        {/* header bar with platform logo */}
        <header className="bg-background px-4 border-b">
          <div className="max-w-7xl mx-auto">
            <div className="font-bold text-xl flex items-center h-16">
              {platform.logo ? (
                <Image
                  src={platform.logo}
                  alt={`${platform.name} Logo`}
                  width={150}
                  height={50}
                />
              ) : (
                <span style={{ color: platform.hex }}>{platform.name}</span>
              )}
            </div>
          </div>
        </header>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
