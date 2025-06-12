import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import FeaturedProperties from "@/components/FeaturedProperties";
import InvestorSection from "@/components/InvestorSection";
import Footer from "@/components/Footer";
import SaraChatbot from "@/components/SaraChatbot";

export default function Home() {
  const { user } = useAuth();

  return (
    <Layout>
      <HeroSection />
      <FeaturedProperties />
      {user?.userType === 'host' && <InvestorSection />}
      <Footer />
      <SaraChatbot />
    </Layout>
  );
}
