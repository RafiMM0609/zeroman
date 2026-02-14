import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://rafimahrus.com"),
  title: {
    default: "Rafi Mahrus | Backend Expert in Scalable Systems",
    template: "%s | Rafi Mahrus",
  },
  description:
    "Backend Systems Expert specializing in scalable architectures, microservices, and high-performance systems. Helping companies reduce infrastructure costs and eliminate bottlenecks.",
  keywords: [
    "Backend Developer",
    "Systems Architect",
    "Microservices",
    "Scalable Systems",
    "High Performance",
    "Go Developer",
    "Redis",
    "RabbitMQ",
    "API Development",
    "Cloud Architecture",
    "Web3",
    "DeFi",
  ],
  authors: [{ name: "Rafi Mahrus" }],
  creator: "Rafi Mahrus",
  publisher: "Rafi Mahrus",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rafimahrus.com",
    siteName: "Rafi Mahrus Portfolio",
    title: "Rafi Mahrus | Backend Expert in Scalable Systems",
    description:
      "Backend Systems Expert specializing in scalable architectures, microservices, and high-performance systems.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rafi Mahrus - Backend Systems Expert",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rafi Mahrus | Backend Expert in Scalable Systems",
    description:
      "Backend Systems Expert specializing in scalable architectures, microservices, and high-performance systems.",
    images: ["/og-image.png"],
    creator: "@rafimahrus",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
  alternates: {
    canonical: "https://rafimahrus.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#030303" />
      </head>
      <body className="font-sans">
        <div className="grain" />
        {children}

        {/* JSON-LD Structured Data for SEO */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Rafi Mahrus",
              url: "https://rafimahrus.com",
              jobTitle: "Backend Systems Expert",
              description:
                "Backend Systems Expert specializing in scalable architectures, microservices, and high-performance systems.",
              knowsAbout: [
                "Backend Development",
                "Systems Architecture",
                "Microservices",
                "Go Programming",
                "Redis",
                "RabbitMQ",
                "API Development",
                "Cloud Computing",
                "Web3",
                "DeFi",
              ],
              sameAs: [
                "https://github.com/rafimahrus",
                "https://linkedin.com/in/rafimahrus",
                "https://twitter.com/rafimahrus",
              ],
              address: {
                "@type": "PostalAddress",
                addressCountry: ["SG", "ID"],
                addressRegion: "Singapore & Indonesia",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
