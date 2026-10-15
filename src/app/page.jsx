import { SpeedInsights } from "@vercel/speed-insights/next"
import nextDynamic from 'next/dynamic';
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AnimatedSection from "@/components/AnimatedSection";

const ProductCatalog = nextDynamic(() => import("@/components/ProductCatalog"));
const WhyUsSection = nextDynamic(() => import("@/components/WhyUsSection"));
const AboutSection = nextDynamic(() => import("@/components/AboutSection"));
const ProjectProcess = nextDynamic(() => import("@/components/ProjectProcess"));
const BenefitsSection = nextDynamic(() => import("@/components/BenefitsSection"));
const OurWorkMinimal = nextDynamic(() => import("@/components/OurWork"));
const ClienteleSection = nextDynamic(() => import("@/components/ClientelSection"));

const ManufacturingUnits = nextDynamic(
  () => import("@/components/ManufacturingUnits"),
  {
    loading: () => <div className="h-96 bg-slate-100 animate-pulse rounded-2xl my-8" />,
  }
);

const TestimonialsSection = nextDynamic(
  () => import("@/components/TestimonialsSection")
);

const FaqSection = nextDynamic(
  () => import("@/components/FaqSection")
);

const Footer = nextDynamic(
  () => import("@/components/Footer")
);

const BlogSection = nextDynamic(
  () => import("@/components/BlogSection")
);

import { getFaqs } from "@/lib/api/getFaqs";
import { getProjects } from "@/lib/api/getProjects";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const [faqs, projects] = await Promise.all([getFaqs(), getProjects()]);
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
          <OurWorkMinimal initialProjects={projects} />
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
