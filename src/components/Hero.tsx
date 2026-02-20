"use client";

export default function Hero() {
  return (
    <section className="mb-24 md:mb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12">
        <div className="max-w-4xl">
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8 md:mb-10">
            I BUILD SYSTEMS <br />
            THAT SCALE{" "}
            <span className="kinetic-scroll">
              <span className="kinetic-list">
                <span>RELIABLY</span>
                <span>GLOBALLY</span>
                <span>FASTER</span>
                <span>SECURELY</span>
              </span>
            </span>
          </h1>
          <p className="text-secondary text-lg md:text-2xl font-light leading-relaxed max-w-2xl">
            Helping companies reduce{" "}
            <span className="text-white font-medium">infrastructure costs</span>{" "}
            and eliminate{" "}
            <span className="text-white font-medium">bottlenecks</span>. Expert
            in handling high-concurrency traffic.
          </p>
        </div>
      </div>
    </section>
  );
}
