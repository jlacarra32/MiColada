"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shirt, WashingMachine, Home } from "lucide-react";
import clsx from "clsx";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Armario", href: "/armario", icon: Shirt },
    { label: "Inicio", href: "/inicio", icon: Home },
    { label: "Lavandería", href: "/lavanderia", icon: WashingMachine },
  ];

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-4"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.85rem)" }}
    >
      <div className="flex h-[76px] items-center justify-around rounded-[28px] border border-white/10 bg-[#07192b]/92 px-2 shadow-[0_18px_45px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={clsx(
                "group relative flex w-20 flex-col items-center justify-center transition-all duration-300 ease-out",
                isActive ? "text-cyan-300" : "text-zinc-500 hover:text-zinc-200"
              )}
            >
              <div
                className={clsx(
                  "rounded-2xl p-2.5 transition-all duration-300 ease-out group-active:scale-95",
                  isActive && "bg-cyan-400/12 shadow-[inset_0_0_0_1px_rgba(103,232,249,0.12)]"
                )}
              >
                <Icon size={27} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={clsx("mt-0.5 text-[11px] font-semibold transition-colors", isActive && "font-bold text-cyan-200")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
