import { SpeedInsights } from "@vercel/speed-insights/next"
import dynamic from 'next/dynamic';
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AnimatedSection from "@/components/AnimatedSection";

const ProductCatalog = dynamic(() => import("@/components/ProductCatalog"));
const WhyUsSection = dynamic(() => import("@/components/WhyUsSection"));
const AboutSection = dynamic(() => import("@/components/AboutSection"));
const ProjectProcess = dynamic(() => import("@/components/ProjectProcess"));
const BenefitsSection = dynamic(() => import("@/components/BenefitsSection"));
const OurWorkMinimal = dynamic(() => import("@/components/OurWork"));
const ClienteleSection = dynamic(() => import("@/components/ClientelSection"));

const ManufacturingUnits = dynamic(
  () => import("@/components/ManufacturingUnits"),
  {
    loading: () => <div className="h-96 bg-slate-100 animate-pulse rounded-2xl my-8" />,
  }
);

const TestimonialsSection = dynamic(
  () => import("@/components/TestimonialsSection")
);

const FaqSection = dynamic(
  () => import("@/components/FaqSection")
);

const Footer = dynamic(
  () => import("@/components/Footer")
);

const BlogSection = dynamic(
  () => import("@/components/BlogSection")
);

import { getFaqs } from "@/lib/api/getFaqs";

export const revalidate = 60;

export default async function Home() {
  const faqs = await getFaqs();
  return (
    <>
      <SpeedInsights />
      <div className="min-h-screen text-slate-900 font-sans">

        {/* 1. TOP HEADER / CONTACT BAR */}
        <Header />

        {/* 2. NAVIGATION BAR */}
        <Navbar />

        {/* 3. HERO SECTION */}
        <HeroSection />
        <main className="home-wall-background">
          <ProductCatalog />
          <OurWorkMinimal />
          <ClienteleSection />
          <ManufacturingUnits />
          <WhyUsSection />
          <ProjectProcess />
          <BenefitsSection />
          <AnimatedSection delay={0.1}>
            <AboutSection />
          </AnimatedSection>
          <TestimonialsSection />

          <BlogSection />
          <FaqSection initialFaqs={faqs} />
        </main>
        {/* 5. FOOTER */}
        <Footer />

      </div>
    </>
  );

}
