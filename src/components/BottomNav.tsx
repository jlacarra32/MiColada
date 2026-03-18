"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shirt, WashingMachine, PlusCircle } from "lucide-react";
import clsx from "clsx";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Armario", href: "/", icon: Shirt },
    { label: "Añadir", href: "/add", icon: PlusCircle, special: true },
    { label: "Lavandería", href: "/lavanderia", icon: WashingMachine },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-md mx-auto bg-zinc-900/80 backdrop-blur-xl border-t border-white/5 shadow-[0_-8px_30px_rgb(0,0,0,0.4)] pb-safe z-50">
      <div className="flex justify-around items-center h-[72px]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.special) {
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center -mt-7 group relative z-10 w-20">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-3.5 rounded-full shadow-lg shadow-cyan-500/30 transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-active:scale-95 border border-white/10">
                  <Icon size={30} strokeWidth={2.5} />
                </div>
                <span className="text-xs font-bold text-zinc-400 mt-1 transition-colors group-hover:text-cyan-400">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex flex-col items-center justify-center w-20 transition-all duration-300 ease-in-out group relative",
                isActive ? "text-cyan-400" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <div
                className={clsx(
                  "p-2.5 rounded-full transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-active:scale-95",
                  isActive && "bg-cyan-400/10"
                )}
              >
                <Icon size={27} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={clsx("text-xs mt-0.5 font-medium transition-colors", isActive && "font-bold text-cyan-400")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
