"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Server, Database, RefreshCw, Globe } from "lucide-react";

export const WorkQueueVisual = () => {
  return (
    <div className="relative w-full h-32 flex items-center justify-between px-4 overflow-hidden">
      <div className="z-10 flex flex-col items-center gap-1">
        <div className="p-2 bg-zinc-800 rounded-lg border border-zinc-700 shadow-lg">
          <Cpu size={20} className="text-zinc-400" />
        </div>
        <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">
          Producer
        </span>
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3/5 h-[2px] bg-zinc-800">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "2000%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-4 h-[2px] bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"
        />
      </div>

      <div className="z-10 flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[8px] text-zinc-600">Worker 0{i}</span>
            <motion.div
              animate={{
                backgroundColor: ["#27272a", "#3f3f46", "#27272a"],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
              className="p-1.5 bg-zinc-800 rounded border border-zinc-700"
            >
              <Server size={14} className="text-zinc-400" />
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DatabaseClusterVisual = () => (
  <div className="relative w-full h-32 flex items-center justify-center gap-8">
    {/* Primary Node */}
    <div className="relative flex flex-col items-center gap-1">
      <div className="p-3 bg-zinc-800 rounded-xl border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
        <Database size={24} className="text-amber-500" />
      </div>
      <span className="text-[9px] text-amber-500 font-bold uppercase tracking-widest">
        Primary
      </span>

      {/* Replication Lines */}
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -right-8 top-1/2 w-8 h-[1px] bg-zinc-700"
      />
    </div>

    {/* Secondary Nodes */}
    <div className="flex flex-col gap-4">
      {[1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">
            <RefreshCw
              size={16}
              className="text-zinc-500 animate-[spin_4s_linear_infinite]"
            />
          </div>
          <div className="text-[8px] text-zinc-500 leading-tight">
            REPLICA_0{i}
            <br />
            <span className="text-emerald-500">SYNCED</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const GlobalEdgeVisual = () => (
  <div className="relative w-full h-24 flex items-center justify-center">
    <Globe size={48} className="text-zinc-800 absolute" />
    {[1, 2, 3].map((i) => (
      <motion.div
        key={i}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 2, opacity: [0, 0.5, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: i * 1 }}
        className="absolute w-12 h-12 border border-blue-500/30 rounded-full"
      />
    ))}
    <div className="z-10 flex gap-1">
      <div className="w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_5px_#60a5fa]" />
      <div className="w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_5px_#60a5fa] translate-y-4 -translate-x-6" />
      <div className="w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_5px_#60a5fa] -translate-y-2 translate-x-4" />
    </div>
  </div>
);

export const MonitoringVisual = () => (
  <div className="flex items-end justify-between h-16 w-full gap-1 px-2">
    {[40, 70, 45, 90, 65, 80, 50, 85, 100, 75].map((h, i) => (
      <motion.div
        key={i}
        initial={{ height: 0 }}
        animate={{ height: `${h}%` }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse",
          delay: i * 0.1,
        }}
        className="w-full bg-blue-500/40 rounded-t-sm border-t border-blue-400"
      />
    ))}
  </div>
);
