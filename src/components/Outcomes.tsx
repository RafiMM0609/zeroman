"use client";

export default function Outcomes() {
  return (
    <section id="outcomes" className="mb-32 md:mb-40">
      <div className="mb-8 md:mb-12 flex items-center justify-between">
        <h2 className="text-[10px] md:text-xs font-mono text-luminous uppercase tracking-[0.4em]">
          // Business Outcomes
        </h2>
        <div className="h-px bg-border flex-1 ml-4 md:ml-10"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-auto md:auto-rows-[200px]">
        {/* Result 1: Latency (-40%) */}
        <div className="bento-card md:col-span-2 md:row-span-2 justify-between group bg-gradient-to-br from-surface to-black border-l-4 border-l-luminous min-h-[300px]">
          <div>
            <div className="text-luminous text-xs font-mono mb-4">
              SYSTEM_OPTIMIZATION
            </div>
            <h3 className="text-4xl md:text-6xl font-bold text-white mb-4">
              -40% <span className="text-xl text-secondary">Latency</span>
            </h3>
            <p className="text-secondary text-sm md:text-base leading-relaxed">
              Reduced API response time across 12+ microservices using{" "}
              <span className="text-white">Redis Pub/Sub</span> and message
              queuing, directly increasing user retention for high-traffic
              platforms.
            </p>
          </div>
          <div className="mt-4 flex gap-2">
            <span className="text-[10px] font-mono bg-white/5 px-2 py-1 rounded">
              GO
            </span>
            <span className="text-[10px] font-mono bg-white/5 px-2 py-1 rounded">
              REDIS
            </span>
            <span className="text-[10px] font-mono bg-white/5 px-2 py-1 rounded">
              GRPC
            </span>
          </div>
        </div>

        {/* Result 2: 100 TPS */}
        <div className="bento-card md:col-span-2 flex justify-center border-l-4 border-l-luminousAlt min-h-[180px]">
          <div className="flex justify-between items-end mb-2">
            <h3 className="text-3xl md:text-4xl font-bold text-white">
              100+ TPS
            </h3>
            <span className="text-[10px] font-mono text-luminousAlt animate-pulse">
              LIVE_METRIC
            </span>
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            Engineered a transaction engine capable of handling{" "}
            <span className="text-white">100 Transactions Per Second</span>{" "}
            consistently under load. Implemented{" "}
            <span className="text-white">Read/Write Separation</span> to ensure
            zero lock contention during peak sales events.
          </p>
        </div>

        {/* Result 3: Fault Tolerance */}
        <div className="bento-card md:col-span-1 md:row-span-2 justify-between min-h-[220px]">
          <div>
            <h3 className="text-xl font-bold mb-2">100% Data Integrity</h3>
            <p className="text-[10px] text-secondary leading-loose">
              Zero data loss during outages using{" "}
              <span className="text-luminous">Guaranteed Delivery Protocols</span>{" "}
              (Store-and-Forward).
            </p>
          </div>
          <div className="h-20 bg-white/5 rounded-xl border border-dashed border-border flex items-center justify-center mt-4">
            <i className="fas fa-shield-alt text-luminousAlt text-2xl animate-pulse"></i>
          </div>
        </div>

        {/* Result 4: Dev Velocity */}
        <div className="bento-card md:col-span-1 justify-center min-h-[100px]">
          <h4 className="text-xs font-mono text-secondary mb-1">
            DEV_VELOCITY
          </h4>
          <p className="text-2xl font-bold text-luminous">3x Faster</p>
          <p className="text-[9px] text-secondary uppercase italic">
            AI-Augmented Deployment
          </p>
        </div>

        {/* Result 5: Architecture */}
        <div className="bento-card md:col-span-1 justify-between group relative min-h-[100px] md:min-h-0">
          <div>
            <span className="text-[10px] font-bold block text-luminousAlt uppercase tracking-wider mb-1">
              Architecture
            </span>
            <span className="text-xs text-secondary block leading-tight">
              Decoupled Event Mesh
            </span>
          </div>

          {/* Micro Diagram */}
          <div className="flex flex-col items-center justify-center mt-3 gap-1">
            <div className="flex items-center justify-between w-full px-1">
              {/* Backend */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded bg-white/5 border border-border flex items-center justify-center group-hover:border-white/20 transition-colors">
                  <i className="fas fa-server text-[10px] text-secondary group-hover:text-white"></i>
                </div>
              </div>

              {/* Arrow 1 */}
              <div className="h-px w-6 flow-dashed"></div>

              {/* RabbitMQ */}
              <div className="flex flex-col items-center gap-1 relative">
                <div className="w-8 h-8 rounded bg-rabbitmq/10 border border-rabbitmq/30 flex items-center justify-center group-hover:bg-rabbitmq/20 transition-colors">
                  <i className="fas fa-layer-group text-[10px] text-rabbitmq"></i>
                </div>
                <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rabbitmq opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rabbitmq"></span>
                </span>
              </div>

              {/* Arrow 2 */}
              <div className="h-px w-6 flow-dashed"></div>

              {/* Consumer */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded bg-white/5 border border-border flex items-center justify-center group-hover:border-white/20 transition-colors">
                  <i className="fas fa-microchip text-[10px] text-secondary group-hover:text-white"></i>
                </div>
              </div>
            </div>

            {/* Labels */}
            <div className="flex justify-between w-full text-[6px] font-mono text-secondary px-1 uppercase mt-1">
              <span>API</span>
              <span className="text-rabbitmq">Broker</span>
              <span>Worker</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
