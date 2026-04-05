import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { HowWeWorkSection } from "@/components/how-we-work-section"
import { WhyTeqadeSection } from "@/components/why-teqade-section"
import { FeaturedWorkSection } from "@/components/featured-work-section"
import { TrustSection } from "@/components/trust-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <HowWeWorkSection />
      <WhyTeqadeSection />
      <FeaturedWorkSection />
      <TrustSection />
      <CTASection />
      <Footer />
    </main>
  )
}
