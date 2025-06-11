import { TrendingUp, HandHeart, Globe, Shield } from "lucide-react";

export default function InvestorSection() {
  const highlights = [
    {
      icon: TrendingUp,
      title: "17% Average ROI",
      description: "Proven annual returns on your investment"
    },
    {
      icon: HandHeart,
      title: "Full Management",
      description: "Completely hands-off property control"
    },
    {
      icon: Globe,
      title: "Diverse Portfolio",
      description: "Prime tourist and emerging markets"
    },
    {
      icon: Shield,
      title: "Security & Trust",
      description: "Secure payments and real-time reporting"
    }
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Investors Choose Habibistay</h2>
          <p className="text-lg text-gray-600">Proven returns and comprehensive property management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((highlight, index) => {
            const IconComponent = highlight.icon;
            return (
              <div key={index} className="text-center">
                <div className="bg-brand-blue bg-opacity-10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="h-8 w-8 text-brand-blue" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{highlight.title}</h3>
                <p className="text-gray-600">{highlight.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
