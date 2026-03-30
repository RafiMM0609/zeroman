"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Briefcase, Code2, Rocket, Award } from "lucide-react";
import { prepare, layout } from "@chenglou/pretext";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface CareerNode {
  id: string;
  title: string;
  text: string;
  period?: string;
  icon?: React.ElementType;
  accentColor?: string;
  children?: CareerNode[];
}

// ─── Constants ─────────────────────────────────────────────────────────────

const FONT_TITLE = "600 15px Plus Jakarta Sans";
const FONT_TEXT = "400 14px Plus Jakarta Sans";
const LINE_HEIGHT = 22;
const DEFAULT_ACCENT = "#10B981";

// ─── useTextHeight – measures text with pretext ────────────────────────────

function useTextHeight(text: string, font: string, containerWidth: number) {
  const prepared = useMemo(() => {
    if (typeof window === "undefined" || !text) return null;
    return prepare(text, font);
  }, [text, font]);

  const height = useMemo(() => {
    if (!prepared || containerWidth <= 0) return 0;
    return layout(prepared, containerWidth, LINE_HEIGHT).height;
  }, [prepared, containerWidth]);

  return height;
}

// ─── CareerNodeItem ────────────────────────────────────────────────────────

interface CareerNodeItemProps {
  node: CareerNode;
  depth: number;
  isLast: boolean;
  parentAccent?: string;
}

function CareerNodeItem({ node, depth, isLast, parentAccent }: CareerNodeItemProps) {
  const [open, setOpen] = useState(depth === 0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);

  const accent = node.accentColor ?? parentAccent ?? DEFAULT_ACCENT;
  const Icon = node.icon;
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;

  // Observe container width for responsive text measurement
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 0) setContainerWidth(w);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const textHeight = useTextHeight(node.text, FONT_TEXT, containerWidth);
  const titleHeight = useTextHeight(node.title, FONT_TITLE, containerWidth);

  // Indentation step per depth level
  const indentPx = depth * 28;

  return (
    <div className="relative" style={{ paddingLeft: depth > 0 ? `${indentPx}px` : 0 }}>
      {/* Vertical connector line (drawn by parent, hidden for root) */}
      {depth > 0 && (
        <span
          className="absolute top-0 bottom-0"
          style={{
            left: `${indentPx - 16}px`,
            width: "1px",
            background: `linear-gradient(to bottom, ${accent}55, ${accent}11)`,
          }}
        />
      )}

      {/* Horizontal connector for children */}
      {depth > 0 && (
        <span
          className="absolute"
          style={{
            left: `${indentPx - 16}px`,
            top: "20px",
            width: "12px",
            height: "1px",
            background: accent + "88",
          }}
        />
      )}

      {/* Node card */}
      <div ref={containerRef} className="mb-4">
        <motion.div
          layout
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="group relative rounded-2xl border transition-all duration-400 overflow-hidden"
          style={{
            borderColor: open ? accent + "44" : "#1A1A1C",
            background: open ? `${accent}06` : "#0A0A0B",
          }}
        >
          {/* Glow accent bar */}
          <div
            className="absolute inset-y-0 left-0 w-[3px] rounded-full transition-opacity duration-300"
            style={{ background: accent, opacity: open ? 1 : 0.25 }}
          />

          {/* Header row (clickable to toggle) */}
          <button
            onClick={() => hasChildren && setOpen((v) => !v)}
            className="w-full flex items-start gap-3 px-5 py-4 text-left"
            style={{ cursor: hasChildren ? "pointer" : "default" }}
            aria-expanded={open}
          >
            {/* Icon */}
            {Icon && (
              <span
                className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: accent + "22", color: accent }}
              >
                <Icon size={15} />
              </span>
            )}

            {/* Title + period */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="font-semibold text-white leading-tight"
                  style={{
                    fontSize: "15px",
                    minHeight: titleHeight > 0 ? `${titleHeight}px` : undefined,
                    display: "block",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                >
                  {node.title}
                </span>
                {node.period && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: accent + "22", color: accent }}
                  >
                    {node.period}
                  </span>
                )}
              </div>

              {/* Body text – always visible, measured by pretext */}
              <p
                className="mt-1 text-sm leading-relaxed"
                style={{
                  color: "#88888E",
                  minHeight: textHeight > 0 ? `${textHeight}px` : undefined,
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {node.text}
              </p>
            </div>

            {/* Expand/collapse chevron */}
            {hasChildren && (
              <span className="flex-shrink-0 mt-1" style={{ color: accent }}>
                {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </span>
            )}
          </button>
        </motion.div>

        {/* Children */}
        <AnimatePresence initial={false}>
          {hasChildren && open && (
            <motion.div
              key="children"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden mt-2"
            >
              {node.children!.map((child, idx) => (
                <CareerNodeItem
                  key={child.id}
                  node={child}
                  depth={depth + 1}
                  isLast={idx === node.children!.length - 1}
                  parentAccent={accent}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────

const careerData: CareerNode[] = [
  {
    id: "education",
    title: "Pendidikan & Fondasi",
    text: "Membangun fondasi kuat dalam ilmu komputer, algoritma, dan rekayasa perangkat lunak.",
    period: "2018 – 2022",
    icon: Award,
    accentColor: "#818CF8",
    children: [
      {
        id: "edu-uni",
        title: "Sarjana Teknik Informatika",
        text: "Studi intensif di bidang struktur data, jaringan komputer, dan basis data. Lulus dengan predikat cum laude.",
        period: "2018 – 2022",
      },
      {
        id: "edu-cert",
        title: "Sertifikasi & Kursus Tambahan",
        text: "Google Associate Cloud Engineer, AWS Certified Developer, dan berbagai kursus backend intensif.",
      },
    ],
  },
  {
    id: "early-career",
    title: "Awal Karir – Junior Developer",
    text: "Memulai perjalanan profesional dengan fokus pada pengembangan backend menggunakan Python dan Node.js.",
    period: "2022 – 2023",
    icon: Code2,
    accentColor: "#10B981",
    children: [
      {
        id: "internship",
        title: "Magang Backend Engineer",
        text: "Berkontribusi pada layanan REST API internal perusahaan fintech. Menangani integrasi payment gateway dan optimasi query SQL.",
        period: "Feb 2022 – Jul 2022",
      },
      {
        id: "first-job",
        title: "Junior Backend Engineer",
        text: "Bergabung sebagai karyawan tetap pertama di startup e-commerce. Membangun fitur notifikasi real-time dengan WebSocket dan Redis Pub/Sub.",
        period: "Agu 2022 – Des 2022",
        children: [
          {
            id: "first-job-achievement",
            title: "Pencapaian Utama",
            text: "Mengurangi latensi API dari rata-rata 900 ms menjadi 120 ms dengan query optimization dan caching layer Redis.",
          },
          {
            id: "first-job-stack",
            title: "Tech Stack",
            text: "Node.js, Express, PostgreSQL, Redis, Docker, AWS EC2.",
          },
        ],
      },
    ],
  },
  {
    id: "growth",
    title: "Pertumbuhan – Mid-Level Engineer",
    text: "Transisi ke arsitektur microservices, mendalami Go, dan memimpin proyek skala medium.",
    period: "2023 – 2024",
    icon: Briefcase,
    accentColor: "#F59E0B",
    children: [
      {
        id: "backend-lead",
        title: "Backend Engineer – Produk SaaS B2B",
        text: "Merancang dan mengimplementasikan sistem antrian dengan RabbitMQ untuk memproses 500 ribu event per hari tanpa downtime.",
        period: "Jan 2023 – Jun 2023",
        children: [
          {
            id: "backend-lead-arch",
            title: "Arsitektur Sistem",
            text: "Event-driven architecture dengan dead-letter queue, retry policy otomatis, dan monitoring via Grafana + Prometheus.",
          },
        ],
      },
      {
        id: "go-migration",
        title: "Migrasi Layanan Kritis ke Go",
        text: "Memimpin migrasi layanan autentikasi dari Node.js ke Go, menghasilkan penurunan konsumsi memori sebesar 70% dan peningkatan throughput 3x lipat.",
        period: "Jul 2023 – Des 2023",
      },
    ],
  },
  {
    id: "senior",
    title: "Senior & Arsitektur Sistem Scalable",
    text: "Memimpin desain arsitektur untuk sistem berskala global, mentoring tim junior, dan berkontribusi pada proyek Web3.",
    period: "2024 – Sekarang",
    icon: Rocket,
    accentColor: "#EC4899",
    children: [
      {
        id: "senior-arch",
        title: "Lead Backend Architect",
        text: "Bertanggung jawab atas arsitektur multi-region untuk platform dengan 2 juta pengguna aktif bulanan. Implementasi circuit breaker, rate limiting, dan blue-green deployment.",
        period: "Jan 2024 – Kini",
        children: [
          {
            id: "senior-infra",
            title: "Infrastruktur & DevOps",
            text: "Kubernetes (EKS), Terraform untuk IaC, GitHub Actions CI/CD pipeline dengan automated rollback.",
          },
          {
            id: "senior-scale",
            title: "Pencapaian Skalabilitas",
            text: "Sistem mampu menangani lonjakan traffic 10x saat flash sale tanpa degradasi performa berkat auto-scaling dan pre-warming cache.",
          },
        ],
      },
      {
        id: "web3",
        title: "Web3 & DeFi Projects",
        text: "Mengeksplorasi ekosistem blockchain – membangun indexer on-chain dan smart contract interaction layer untuk protokol DeFi.",
        period: "Mid 2024",
      },
      {
        id: "open-source",
        title: "Open Source & Komunitas",
        text: "Berkontribusi pada beberapa proyek open source Go, menulis artikel teknis, dan menjadi pembicara di meetup backend Indonesia.",
      },
    ],
  },
];

export default function CareerJourney() {
  return (
    <section className="w-full">
      {/* Section header */}
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#10B981" }}>
          Perjalanan Karir
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
          Garis Besar<br />
          <span style={{ color: "#818CF8" }}>Perjalanan Profesional</span>
        </h1>
        <p className="text-base md:text-lg max-w-2xl" style={{ color: "#88888E" }}>
          Setiap langkah adalah fondasi untuk langkah berikutnya. Dari baris kode pertama
          hingga arsitektur sistem yang melayani jutaan pengguna.
        </p>
      </div>

      {/* Timeline tree */}
      <div className="flex flex-col gap-2">
        {careerData.map((node, idx) => (
          <CareerNodeItem
            key={node.id}
            node={node}
            depth={0}
            isLast={idx === careerData.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
