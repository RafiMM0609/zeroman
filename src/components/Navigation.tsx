"use client";

import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-5xl">
      <div className="bg-surface/80 backdrop-blur-2xl border border-border rounded-full px-6 py-3 md:px-8 md:py-4 flex items-center justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]">
        <div className="flex flex-col cursor-default">
          <span className="font-mono font-bold text-sm tracking-tighter">
            RAFI MAHRUS
          </span>
          <span className="text-[8px] text-luminous uppercase tracking-widest font-bold">
            Backend Systems Expert
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
          <Link
            href="#outcomes"
            className="hover:text-white transition-colors"
          >
            Results
          </Link>
          <Link
            href="#projects"
            className="hover:text-white transition-colors"
          >
            Vault
          </Link>
          <Link
            href="#social-proof"
            className="hover:text-white transition-colors"
          >
            Testimonials
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/6282322607990?text=Halo%20Rafi!%20%F0%9F%91%8B%20Saya%20tertarik%20dengan%20layanan%20Sistem%20Aplikasi%20kamu.%20Boleh%20tahu%20lebih%20lanjut%20soal%20jasa%20yang%20kamu%20tawarkan%3F"
            className="text-whatsapp hover:scale-110 transition-transform"
            aria-label="Contact on WhatsApp"
          >
            <i className="fab fa-whatsapp text-xl"></i>
          </a>
          <a
            href="#contact"
            className="bg-white text-black text-[10px] font-bold px-4 py-2 rounded-full hover:bg-luminous transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            BOOK CALL
          </a>
        </div>
      </div>
    </nav>
  );
}
