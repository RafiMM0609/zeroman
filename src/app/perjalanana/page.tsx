import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CareerJourney from "@/components/CareerJourney";

export const metadata: Metadata = {
  title: "Perjalanan Karir",
  description:
    "Garis besar perjalanan karir Rafi Mahrus — dari pendidikan hingga arsitektur sistem scalable skala global.",
};

export default function PerjalananPage() {
  return (
    <>
      <Navigation />
      <main className="max-w-4xl mx-auto px-6 pt-32 md:pt-48 pb-32 relative z-50">
        <CareerJourney />
      </main>
      <Footer />
    </>
  );
}
