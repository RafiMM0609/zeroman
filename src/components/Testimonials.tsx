"use client";

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "Rafi consistently delivers high-integrity systems. His approach to microservices helped us handle a 300% traffic surge without a single millisecond of downtime.",
      initial: "A",
      name: "Alex - CTO",
      company: "Singapore FinTech Startup",
      gradient: "from-luminous to-luminousAlt",
    },
    {
      quote:
        "The most efficient backend engineer I've worked with. The 100 TPS optimization he implemented saved us significant infrastructure costs.",
      initial: "S",
      name: "Sarah - Product Lead",
      company: "Enterprise Solutions Co.",
      gradient: "from-luminousAlt to-white",
    },
    {
      quote:
        "Clear communication and solid architecture. Rafi doesn't just write code, he solves business problems.",
      initial: "M",
      name: "Michael - Founder",
      company: "ARES Project",
      gradient: "from-white to-secondary",
    },
  ];

  return (
    <section id="social-proof" className="mb-40">
      <h2 className="text-xs font-mono text-luminous uppercase tracking-[0.4em] text-center mb-16">
        // Professional Endorsements
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-surface border border-border p-8 rounded-[32px] relative group hover:border-luminous/30 transition-colors"
          >
            <i className="fas fa-quote-left text-luminous/20 text-4xl absolute top-6 left-6 group-hover:text-luminous/40 transition-colors"></i>
            <p className="text-sm text-secondary italic leading-relaxed mb-6 relative z-10">
              {testimonial.quote}
            </p>
            <div className="flex items-center gap-4 border-t border-border pt-6">
              <div
                className={`w-10 h-10 bg-gradient-to-tr ${testimonial.gradient} rounded-full flex items-center justify-center text-black font-bold text-xs`}
              >
                {testimonial.initial}
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  {testimonial.name}
                </p>
                <p className="text-[10px] text-secondary">
                  {testimonial.company}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
