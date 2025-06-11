import { TrendingUp, HandHeart, Globe, Shield, BarChart3, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";

export default function InvestorSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const sectionElement = document.getElementById('investor-section');
    if (sectionElement) {
      observer.observe(sectionElement);
    }

    return () => observer.disconnect();
  }, []);

  const highlights = [
    {
      icon: TrendingUp,
      title: "17% Average ROI",
      description: "Proven annual returns on your investment",
      metric: "17%",
      detail: "Annual Return"
    },
    {
      icon: HandHeart,
      title: "Full Management",
      description: "Completely hands-off property control",
      metric: "100%",
      detail: "Managed"
    },
    {
      icon: Globe,
      title: "Diverse Portfolio",
      description: "Prime tourist and emerging markets",
      metric: "25+",
      detail: "Locations"
    },
    {
      icon: Shield,
      title: "Security & Trust",
      description: "Secure payments and real-time reporting",
      metric: "24/7",
      detail: "Monitoring"
    }
  ];

  return (
    <section id="investor-section" className="relative overflow-hidden py-20">
      {/* Background Orbs */}
      <div className="bg-orb w-56 h-56 top-20 right-10 opacity-10" style={{ animationDelay: '4s' }}></div>
      <div className="bg-orb w-40 h-40 bottom-20 left-20 opacity-15" style={{ animationDelay: '9s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            Why Investors Choose Habibistay
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Proven returns and comprehensive property management with cutting-edge technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((highlight, index) => {
            const IconComponent = highlight.icon;
            return (
              <div 
                key={index} 
                className={`glass-card p-8 text-center group cursor-pointer transition-all duration-500 hover:scale-105 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.2}s` }}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className="relative mb-6">
                  <div className={`glass-button w-20 h-20 rounded-3xl flex items-center justify-center mx-auto transition-all duration-300 ${activeCard === index ? 'scale-110' : ''}`}>
                    <IconComponent className="h-10 w-10 text-brand-blue group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className={`absolute -top-2 -right-2 glass-button px-3 py-1 rounded-2xl transition-all duration-300 ${activeCard === index ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                    <div className="text-center">
                      <div className="text-lg font-bold text-brand-blue">{highlight.metric}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">{highlight.detail}</div>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-brand-blue transition-colors duration-300">
                  {highlight.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {highlight.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Investment CTA Section */}
        <div className={`mt-16 text-center ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
          <div className="glass-card p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <BarChart3 className="h-8 w-8 text-brand-blue" />
              <h3 className="text-2xl font-bold gradient-text">Ready to Start Investing?</h3>
              <DollarSign className="h-8 w-8 text-brand-blue" />
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of investors who trust Habibistay for consistent returns and professional property management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="glass-button px-8 py-4 rounded-2xl text-brand-blue hover:text-white font-semibold border-2 border-brand-blue hover:bg-brand-blue transition-all duration-300 hover:scale-105">
                View Investment Opportunities
              </button>
              <button className="glass-button px-8 py-4 rounded-2xl text-gray-700 dark:text-gray-200 hover:text-brand-blue font-medium transition-all duration-300 hover:scale-105">
                Download Investment Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
