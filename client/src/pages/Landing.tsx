import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import FeaturedProperties from "@/components/FeaturedProperties";
import InvestorSection from "@/components/InvestorSection";
import Footer from "@/components/Footer";
import SaraChatbot from "@/components/SaraChatbot";

export default function Landing() {
  return (
    <Layout>
      <HeroSection />
      <FeaturedProperties />
      <InvestorSection />
      <Footer />
      <SaraChatbot />
    </Layout>
  );
}
