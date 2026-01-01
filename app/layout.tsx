import type { Metadata } from "next";
import { Geist, Geist_Mono,Caveat } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  title: "MedAlert",
  description: "Medicine Reminder System, Never Miss Your Medication Again",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
          <Toaster/>
        </Providers>
      </body>
    </html>
  );
}
