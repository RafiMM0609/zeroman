"use client";

import {
  Activity,
  Cloud,
  Database,
  Gauge,
  Globe,
  Layers,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { BentoCard } from "./BentoCard";
import {
  DatabaseClusterVisual,
  GlobalEdgeVisual,
  MonitoringVisual,
  WorkQueueVisual,
} from "./BentoVisuals";
import { motion } from "framer-motion";

export default function Outcomes() {
  return (
    <section id="outcomes" className="mb-32 md:mb-40">
      <div className="mb-8 md:mb-12 flex items-center justify-between">
        <h2 className="text-[10px] md:text-xs font-mono text-luminous uppercase tracking-[0.4em]">
          // Business Outcomes
        </h2>
        <div className="h-px bg-border flex-1 ml-4 md:ml-10"></div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px]">
        {/* Row 1: Work Queues & Observability */}
        <BentoCard
          subtitle="Efficiency"
          title="Async Work Queues"
          icon={Share2}
          accentColor="orange"
          className="md:col-span-2"
        >
          <div className="w-full flex flex-col items-center">
            <WorkQueueVisual />
            <div className="grid grid-cols-3 gap-8 w-full px-4 mt-2">
              <div className="text-center">
                <p className="text-[9px] text-zinc-600 uppercase font-bold">
                  Latency
                </p>
                <p className="text-sm font-mono text-zinc-300">&lt; 12ms</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] text-zinc-600 uppercase font-bold">
                  Reliability
                </p>
                <p className="text-sm font-mono text-zinc-300">DLX Config</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] text-zinc-600 uppercase font-bold">
                  Mode
                </p>
                <p className="text-sm font-mono text-zinc-300">Prefetch: 1</p>
              </div>
            </div>
          </div>
        </BentoCard>

        <BentoCard
          subtitle="Health"
          title="Observability"
          icon={Activity}
          accentColor="blue"
        >
          <div className="w-full">
            <MonitoringVisual />
            <div className="mt-4 flex flex-col items-center gap-1">
              <span className="text-[10px] text-blue-400 font-mono tracking-tighter">
                METRICS COLLECTOR ACTIVE
              </span>
              <span className="text-[8px] text-zinc-600 font-mono">
                Prometheus / Grafana Stack
              </span>
            </div>
          </div>
        </BentoCard>

        {/* Row 2: Scalability & Security */}
        <BentoCard
          subtitle="Scaling"
          title="Elastic Mesh"
          icon={Layers}
          accentColor="green"
        >
          <div className="relative flex flex-col items-center gap-1">
            {[1.0, 0.8, 0.6].map((opacity, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                className="w-24 h-4 bg-emerald-500/20 border border-emerald-500/40 rounded shadow-lg shadow-emerald-500/5"
                style={{ opacity }}
              />
            ))}
            <div className="mt-4 text-[10px] text-zinc-500 text-center font-mono">
              K8S AUTO-SCALING
            </div>
          </div>
        </BentoCard>

        <BentoCard
          subtitle="Security"
          title="ShieldPay Engine"
          icon={ShieldCheck}
          accentColor="purple"
          className="md:col-span-2"
        >
          <div className="flex items-center gap-8 w-full px-6">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-dashed border-purple-500/30 flex items-center justify-center animate-[spin_15s_linear_infinite] z-0" />
              <div className="w-12 h-12 rounded-full border border-purple-500/50 flex items-center justify-center z-10">
                <ShieldCheck size={24} className="text-purple-400" />
              </div>
              <div className="absolute inset-0 bg-purple-500/20 blur-2xl -z-10" />
            </div>
            <div className="space-y-2">
              {[
                "AES-256 Payload Encryption",
                "PCI-DSS Compliance Ready",
                "Zero-Trust Architecture",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-purple-500" />
                  <p className="text-[11px] text-zinc-400 font-mono uppercase">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </BentoCard>

        {/* Row 3: Database Cluster (New) & Edge Network (New) */}
        <BentoCard
          subtitle="Availability"
          title="DB Cluster & Replication"
          icon={Database}
          accentColor="amber"
          className="md:col-span-2"
        >
          <div className="w-full flex items-center justify-around px-4">
            <DatabaseClusterVisual />
            <div className="h-20 w-[1px] bg-zinc-800 hidden md:block" />
            <div className="space-y-3 hidden md:block">
              <div className="bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
                <p className="text-[8px] text-zinc-500 font-bold uppercase mb-1">
                  Failover Time
                </p>
                <p className="text-xs text-amber-500 font-mono font-bold">
                  &lt; 2.5 Seconds
                </p>
              </div>
              <div className="bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
                <p className="text-[8px] text-zinc-500 font-bold uppercase mb-1">
                  Read Scaling
                </p>
                <p className="text-xs text-amber-500 font-mono font-bold">
                  100k+ IOPS
                </p>
              </div>
            </div>
          </div>
        </BentoCard>

        <BentoCard
          subtitle="Latency"
          title="Global Edge"
          icon={Globe}
          accentColor="blue"
        >
          <div className="w-full flex flex-col items-center">
            <GlobalEdgeVisual />
            <div className="mt-4 text-[10px] text-blue-400 font-mono text-center tracking-tighter">
              MULTI-REGION DEPLOYMENT
              <br />
              <span className="text-zinc-600 uppercase tracking-widest text-[8px]">
                SG / US / EU
              </span>
            </div>
          </div>
        </BentoCard>

        {/* Row 4: Performance Show-off (New) */}
        <BentoCard
          subtitle="Performance"
          title="API Throughput"
          icon={Gauge}
          accentColor="green"
        >
          <div className="flex flex-col items-center">
            <div className="text-4xl font-black text-emerald-500 font-mono tracking-tighter">
              120k<span className="text-xs text-emerald-900">/s</span>
            </div>
            <div className="w-full h-1 bg-zinc-900 mt-4 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "85%" }}
                transition={{ duration: 2, delay: 1 }}
                className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"
              />
            </div>
            <p className="mt-4 text-[9px] text-zinc-600 uppercase font-bold">
              gRPC Peak Load
            </p>
          </div>
        </BentoCard>

        <BentoCard
          subtitle="Cloud"
          title="Hybrid Infrastructure"
          icon={Cloud}
          accentColor="blue"
          className="md:col-span-2"
        >
          <div className="flex justify-between w-full px-8 items-center">
            <div className="flex gap-4">
              {["AWS", "GCP", "On-Premise"].map((cloud) => (
                <div
                  key={cloud}
                  className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] text-zinc-400 font-bold uppercase tracking-widest"
                >
                  {cloud}
                </div>
              ))}
            </div>
            <div className="hidden md:block text-right">
              <p className="text-[9px] text-zinc-600 font-bold uppercase">
                Cloud Orchestration
              </p>
              <p className="text-xs text-zinc-400 font-mono">
                Terraform / Ansible
              </p>
            </div>
          </div>
        </BentoCard>
      </div>
    </section>
  );
}

