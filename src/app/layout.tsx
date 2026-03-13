import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MiColada - Lavandería",
  description: "Gestor de inventario personal de ropa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="mx-auto max-w-md min-h-[100dvh] bg-gradient-to-br from-[#0a192f] via-[#0f172a] to-[#1e293b] shadow-2xl shadow-black relative pb-20 overflow-x-hidden selection:bg-cyan-500/30 text-white">
          {children}
          <BottomNav />
          <Analytics />
        </div>
      </body>
    </html>
  );
}
