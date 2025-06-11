import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturedProperties from "@/components/FeaturedProperties";
import InvestorSection from "@/components/InvestorSection";
import Footer from "@/components/Footer";
import SaraChatbot from "@/components/SaraChatbot";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HeroSection />
      <FeaturedProperties />
      {user?.userType === 'host' && <InvestorSection />}
      <Footer />
      <SaraChatbot />
    </div>
  );
}
