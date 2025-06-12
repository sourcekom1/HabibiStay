import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Users, Home, DollarSign, Shield, MessageCircle } from "lucide-react";
import Layout from "@/components/Layout";

export default function FAQ() {
  const [isVisible, setIsVisible] = useState(false);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const faqCategories = [
    {
      icon: Users,
      title: "For Guests",
      color: "blue",
      questions: [
        {
          q: "How do I book a stay on HabibiStay?",
          a: "Simply search for your desired location and dates, browse available properties, and click 'Book Now'. You'll need to create an account and provide payment information. Your booking is confirmed once payment is processed."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept major credit cards, PayPal, and local Saudi banking methods including SADAD and mada cards. All payments are processed securely through encrypted payment gateways."
        },
        {
          q: "Can I cancel my booking?",
          a: "Cancellation policies vary by property and are clearly displayed during booking. Most hosts offer flexible, moderate, or strict cancellation policies. You can view your specific cancellation terms in your booking confirmation."
        },
        {
          q: "What if I have issues during my stay?",
          a: "Our 24/7 support team is available to help resolve any issues. You can contact us through the app, website, or by calling our emergency hotline. We also have local support teams in major Saudi cities."
        },
        {
          q: "Are the properties verified?",
          a: "Yes, all properties undergo our verification process including identity verification of hosts, property inspection (where possible), and review of legal documentation. We also monitor guest reviews and ratings."
        }
      ]
    },
    {
      icon: Home,
      title: "For Hosts",
      color: "green",
      questions: [
        {
          q: "How do I list my property?",
          a: "Start by creating a host account, then complete our property listing form with photos, description, amenities, and pricing. Our team will review your listing within 24-48 hours before it goes live."
        },
        {
          q: "What are the hosting requirements in Saudi Arabia?",
          a: "Hosts must comply with local regulations, which may include obtaining necessary permits, following safety standards, and adhering to local zoning laws. We provide guidance on compliance requirements."
        },
        {
          q: "How much commission does HabibiStay charge?",
          a: "Our host service fee is competitive with the market, typically ranging from 3-5% depending on your hosting volume and services used. There are no upfront listing fees."
        },
        {
          q: "When do I receive payments?",
          a: "Payments are typically released 24 hours after guest check-in, minus our service fee. We offer multiple payout methods including bank transfer to Saudi banks and international payment services."
        },
        {
          q: "What support do you provide to hosts?",
          a: "We offer 24/7 host support, professional photography services, dynamic pricing tools, guest screening, and insurance coverage options. Our local teams provide on-ground support in major cities."
        }
      ]
    },
    {
      icon: DollarSign,
      title: "Investment Opportunities",
      color: "purple",
      questions: [
        {
          q: "What investment options are available?",
          a: "HabibiStay offers various investment opportunities including property co-investment, portfolio investments, and our managed property programs. Returns typically range from 8-15% annually."
        },
        {
          q: "What is the minimum investment amount?",
          a: "Minimum investments start from SAR 50,000 for our co-investment opportunities. We also offer fractional ownership options for premium properties starting from SAR 25,000."
        },
        {
          q: "How are returns calculated and paid?",
          a: "Returns are based on actual rental income minus operating expenses and management fees. Distributions are typically made quarterly, with detailed financial reports provided to all investors."
        },
        {
          q: "What are the risks involved?",
          a: "Like all investments, short-term rental properties carry risks including market fluctuations, regulatory changes, and vacancy periods. We provide detailed risk assessments for each investment opportunity."
        },
        {
          q: "Can I visit the properties I invest in?",
          a: "Absolutely! We encourage investors to visit properties and provide regular property tours. You'll also receive detailed reports on property performance and maintenance."
        }
      ]
    },
    {
      icon: Shield,
      title: "Safety & Security",
      color: "red",
      questions: [
        {
          q: "How do you ensure guest safety?",
          a: "We implement multiple safety measures including host identity verification, property safety checks, 24/7 emergency support, and guest screening. All properties must meet our safety standards."
        },
        {
          q: "What insurance coverage is provided?",
          a: "We provide comprehensive insurance coverage including property damage protection, liability insurance, and guest accident coverage. Additional coverage options are available for hosts."
        },
        {
          q: "How do you handle disputes?",
          a: "Our resolution center helps mediate disputes between guests and hosts. We have a fair and transparent process with escalation to our support team when needed. Most issues are resolved within 48 hours."
        },
        {
          q: "What security measures protect my data?",
          a: "We use bank-level security including SSL encryption, secure payment processing, and regular security audits. Your personal and financial information is never shared with unauthorized parties."
        },
        {
          q: "How do you verify user identities?",
          a: "All users must provide government-issued ID and undergo identity verification. For hosts, we also verify property ownership or authorization to rent. Additional verification may be required for high-value transactions."
        }
      ]
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <HelpCircle className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl opacity-90">
              Find answers to common questions about using HabibiStay
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <div className="flex items-center mb-8">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-${category.color}-100 dark:bg-${category.color}-900/30`}>
                  <category.icon className={`h-6 w-6 text-${category.color}-600`} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{category.title}</h2>
              </div>

              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const sectionKey = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openSections[sectionKey];

                  return (
                    <div key={questionIndex} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => toggleSection(sectionKey)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                          {faq.q}
                        </h3>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                              {faq.a}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support Section */}
        <section className="py-16 bg-brand-blue text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
            <p className="text-xl opacity-90 mb-8">
              Our friendly support team is here to help you 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/contact'}
                className="bg-white text-brand-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Contact Support
              </button>
              <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors duration-200">
                Chat with Sara AI
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}