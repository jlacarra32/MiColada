import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "MiColada | Armario de lavandería",
  description: "Gestiona tu ropa limpia y tu colada desde el móvil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-[100dvh] bg-[#03111f] text-white antialiased">
        <div className="relative mx-auto min-h-[100dvh] max-w-md overflow-x-hidden bg-[#061728] text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)] selection:bg-cyan-400/30">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.22),_transparent_70%)]" />
          <div className="pointer-events-none absolute -right-12 top-24 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-12 top-72 h-44 w-44 rounded-full bg-emerald-400/8 blur-3xl" />
          <div className="relative min-h-[100dvh] pb-28">{children}</div>
          <BottomNav />
          <Analytics />
        </div>
      </body>
    </html>
  );
}
