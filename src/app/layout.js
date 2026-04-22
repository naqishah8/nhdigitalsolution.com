import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import PromoBanner from "@/components/PromoBanner";
import Navbar from "@/components/Navbar";
import ScrollBackground from "@/components/ScrollBackground";
import AIChat from "@/components/AIChat";
import BackToTop from "@/components/BackToTop";
import { COMPANY, buildOrganizationSchema } from "@/data/company";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

const TITLE = `${COMPANY.brand} | ${COMPANY.tagline}`;
const DESCRIPTION = COMPANY.description;

export const metadata = {
  metadataBase: new URL(COMPANY.url),
  title: {
    default: TITLE,
    template: `%s | ${COMPANY.brand}`,
  },
  description: DESCRIPTION,
  applicationName: COMPANY.brand,
  authors: [{ name: COMPANY.legalName, url: COMPANY.url }],
  creator: COMPANY.legalName,
  publisher: COMPANY.legalName,
  keywords: [
    'web development', 'website design', 'Next.js agency', 'React developer',
    'graphic design', 'logo design', 'brand identity',
    'SEO optimization', 'local SEO', 'Google ranking',
    'social media marketing', 'Instagram marketing',
    'app development', 'React Native', 'iOS app', 'Android app',
    'logistics software', 'supply chain platform',
    'NH International', 'NH Digital Services',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: COMPANY.url,
    siteName: COMPANY.brand,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: COMPANY.ogImage,
        width: 1200,
        height: 630,
        alt: `${COMPANY.brand}: ${COMPANY.tagline}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [COMPANY.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [{ url: '/logo/icon.png', type: 'image/png' }],
    shortcut: '/logo/icon.png',
    apple: '/logo/icon.png',
  },
  category: 'technology',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport = {
  themeColor: '#151b2e',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  const orgSchema = buildOrganizationSchema();

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} data-scroll-behavior="smooth">
      <body style={{ margin: 0, position: 'relative' }}>
        <ScrollBackground />
        <a href="#main-content" className="skip-link">Skip to content</a>
        <PromoBanner />
        <Navbar />
        <main id="main-content" style={{ position: 'relative', zIndex: 1 }}>{children}</main>
        <AIChat />
        <BackToTop />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </body>
    </html>
  );
}
