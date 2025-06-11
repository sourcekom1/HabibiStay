import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturedProperties from "@/components/FeaturedProperties";
import InvestorSection from "@/components/InvestorSection";
import Footer from "@/components/Footer";
import SaraChatbot from "@/components/SaraChatbot";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HeroSection />
      <FeaturedProperties />
      <InvestorSection />
      <Footer />
      <SaraChatbot />
    </div>
  );
}
