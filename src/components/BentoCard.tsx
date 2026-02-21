"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

type BentoCardProps = {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
  accentColor?: "orange" | "blue" | "green" | "purple" | "amber";
};

export const BentoCard = ({
  title,
  subtitle,
  icon: Icon,
  children,
  className,
  accentColor = "orange",
}: BentoCardProps) => {
  const accentClasses = {
    orange: "text-orange-500 border-orange-500/20 bg-orange-500/5",
    blue: "text-blue-400 border-blue-400/20 bg-blue-400/5",
    green: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
    purple: "text-purple-400 border-purple-400/20 bg-purple-400/5",
    amber: "text-amber-500 border-amber-500/20 bg-amber-500/5",
  };

  return (
    <div
      className={`bg-zinc-950 border border-zinc-800 rounded-3xl p-6 flex flex-col overflow-hidden transition-all duration-500 hover:border-zinc-700 group ${className}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">
            {subtitle}
          </h4>
          <h3 className="text-white text-xl font-semibold">{title}</h3>
        </div>
        <div className={`p-2 rounded-xl border ${accentClasses[accentColor]}`}>
          <Icon size={20} />
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center py-4">
        {children}
      </div>

      <div className="mt-4 flex items-center gap-2 text-zinc-500 text-[10px] font-bold tracking-widest group-hover:text-zinc-300 transition-colors uppercase">
        <span>Architect Details</span>
        <ArrowRight
          size={12}
          className="group-hover:translate-x-1 transition-transform"
        />
      </div>
    </div>
  );
};
