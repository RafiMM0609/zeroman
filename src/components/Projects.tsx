"use client";

export default function Projects() {
  return (
    <section id="projects" className="mb-40">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-[10px] md:text-xs font-mono text-secondary uppercase tracking-[0.4em]">
          // Project Vault
        </h2>
        <p className="text-[10px] font-mono text-secondary hidden md:block">
          HOVER TO REVEAL SYSTEM FLOW
        </p>
      </div>

      <div className="space-y-6">
        {/* Project 1: ARES */}
        <div className="group relative bg-surface border border-border rounded-[32px] p-6 md:p-8 hover:border-luminousAlt/50 transition-all duration-500 overflow-hidden cursor-default">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
            <div className="max-w-md">
              <span className="text-[10px] font-mono text-luminousAlt mb-2 block tracking-widest uppercase">
                Web3 / Decentralized Freelance
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                ARES Ecosystem
              </h3>
              <p className="text-secondary text-sm leading-relaxed">
                A decentralized platform connecting talent globally. <br />
                <span className="text-white font-medium mt-2 block">
                  Outcome: Achieved 0% synchronization lag across 50k+ active
                  nodes using a high-performance Go sync-layer.
                </span>
              </p>
            </div>

            {/* Visual */}
            <div className="w-full lg:w-auto bg-black/50 border border-border rounded-2xl p-6 transition-all duration-700 group-hover:scale-105 group-hover:bg-luminousAlt/5">
              <div className="flex flex-wrap justify-center items-center gap-4 font-mono text-[10px]">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 border border-border rounded flex items-center justify-center">
                    <i className="fas fa-users"></i>
                  </div>
                  <span>CLIENT</span>
                </div>
                <div className="hidden sm:block h-px w-8 bg-border border-dashed"></div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 border border-luminousAlt rounded flex items-center justify-center bg-luminousAlt/10">
                    <i className="fas fa-scroll"></i>
                  </div>
                  <span className="text-luminousAlt">CONTRACT</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project 2: MantleRidge */}
        <div className="group relative bg-surface border border-border rounded-[32px] p-6 md:p-8 hover:border-luminous/50 transition-all duration-500 overflow-hidden cursor-default">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
            <div className="max-w-md">
              <span className="text-[10px] font-mono text-luminous mb-2 block tracking-widest uppercase">
                DeFi / Lending Protocol
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                MantleRidge
              </h3>
              <p className="text-secondary text-sm leading-relaxed">
                High-liquidity lending protocol. <br />
                <span className="text-white font-medium mt-2 block">
                  Outcome: Secured $10M+ in assets by implementing sub-second
                  liquidation monitoring with Redis Streams.
                </span>
              </p>
            </div>

            {/* Visual */}
            <div className="w-full lg:w-auto bg-black/50 border border-border rounded-2xl p-6 transition-all duration-700 group-hover:scale-105 group-hover:bg-luminous/5">
              <div className="flex flex-wrap justify-center items-center gap-4 font-mono text-[10px]">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 border border-border rounded flex items-center justify-center">
                    <i className="fas fa-wallet"></i>
                  </div>
                  <span>ASSETS</span>
                </div>
                <div className="hidden sm:block h-px w-8 bg-border border-dashed"></div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="w-10 h-10 border border-border rounded flex items-center justify-center">
                    <i className="fas fa-bolt"></i>
                  </div>
                  <span>REDIS_STREAMS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project 3: HROMIS */}
        <div className="group relative bg-surface border border-border rounded-[32px] p-6 md:p-8 hover:border-white/50 transition-all duration-500 overflow-hidden cursor-default">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
            <div className="max-w-md">
              <span className="text-[10px] font-mono text-secondary mb-2 block tracking-widest uppercase">
                Enterprise / HR Management
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                HROMIS Bridge
              </h3>
              <p className="text-secondary text-sm leading-relaxed">
                Legacy system integration layer. <br />
                <span className="text-white font-medium mt-2 block">
                  Outcome: Zero data corruption during migration of 500k+
                  sensitive employee records.
                </span>
              </p>
            </div>

            {/* Visual */}
            <div className="w-full lg:w-auto bg-black/50 border border-border rounded-2xl p-6 transition-all duration-700 group-hover:scale-105">
              <div className="flex flex-wrap justify-center items-center gap-4 font-mono text-[10px]">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 border border-border rounded flex items-center justify-center">
                    <i className="fas fa-database text-secondary"></i>
                  </div>
                  <span>LEGACY_DB</span>
                </div>
                <div className="hidden sm:block h-px w-8 bg-border border-dashed"></div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 border border-border rounded flex items-center justify-center">
                    <i className="fas fa-cloud"></i>
                  </div>
                  <span>MODERN_API</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
