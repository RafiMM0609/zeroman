"use client";

export default function CTA() {
  return (
    <section className="text-center py-20 bg-gradient-to-b from-transparent to-luminous/5 border-t border-border">
      <h2 className="text-4xl md:text-6xl font-bold mb-10 tracking-tighter">
        Ready for Scalable <br /> Growth?
      </h2>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4">
        <a
          href="#contact"
          className="w-full md:w-auto bg-white text-black font-bold px-10 py-4 rounded-full hover:bg-luminous transition-all transform hover:scale-105"
        >
          BOOK A SYSTEM AUDIT
        </a>
        <a
          href="https://wa.me/6281234567890"
          className="w-full md:w-auto border border-border bg-surface text-white font-bold px-10 py-4 rounded-full flex items-center justify-center gap-3 hover:border-whatsapp hover:text-whatsapp transition-colors"
        >
          <i className="fab fa-whatsapp text-xl"></i> FAST RESPONSE
        </a>
      </div>
    </section>
  );
}
