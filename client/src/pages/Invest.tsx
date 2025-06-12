import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, PieChart, Building2, Globe, FileText, Shield, BarChart3, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";

export default function Invest() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-blue-900/10 via-blue-800/5 to-blue-700/10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')] bg-cover bg-center opacity-10"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center max-w-4xl mx-auto ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
              Invest in Saudi Arabia's Vision 2030
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Join the Kingdom's tourism revolution. With 100+ million visitors expected by 2030, NEOM rising, and AlUla opening to the world - Saudi real estate offers unprecedented growth opportunities. HabibiStay provides expert-managed investment access to this transformation.
            </p>
            <Button className="glass-button bg-brand-blue text-white px-8 py-4 text-lg font-semibold hover:bg-brand-blue-dark">
              Request Investor Deck
            </Button>
          </div>
        </div>
      </section>

      {/* Investment Options Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Path to Real Estate Returns
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Capital Investor */}
            <Card className={`glass-card border-brand-blue/20 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue/10 rounded-full mb-4">
                  <PieChart className="h-8 w-8 text-brand-blue" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  Capital Investor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Pool your capital with other discerning investors into our existing, high-performing property portfolio. Enjoy passive income through regular quarterly dividends and benefit from professional asset management.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Quarterly dividend distributions</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Professional asset management</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Diversified portfolio exposure</span>
                  </div>
                </div>
                <Badge variant="secondary" className="mb-4">
                  Expected IRR: 12-18%
                </Badge>
              </CardContent>
            </Card>

            {/* International Investor */}
            <Card className={`glass-card border-brand-blue/20 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue/10 rounded-full mb-4">
                  <Globe className="h-8 w-8 text-brand-blue" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  International Investor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Looking to own property in Riyadh? We leverage our local expertise to source, acquire, and fully manage prime real estate on your behalf, delivering turnkey investment solutions for international clients.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Property sourcing & acquisition</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Full property management</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Local market expertise</span>
                  </div>
                </div>
                <Badge variant="secondary" className="mb-4">
                  Custom Solutions
                </Badge>
              </CardContent>
            </Card>

            {/* Buy-to-Let Partnership */}
            <Card className={`glass-card border-brand-blue/20 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
              <CardHeader>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue/10 rounded-full mb-4">
                  <Building2 className="h-8 w-8 text-brand-blue" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  Buy-to-Let Partnership
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Acquire a property in Riyadh, and let HabibiStay operate it. We manage the entire rental process, ensuring it's optimized for maximum returns while you retain full ownership.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Full ownership retention</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Professional rental management</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Optimized revenue streams</span>
                  </div>
                </div>
                <Badge variant="secondary" className="mb-4">
                  Partnership Model
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Invest with HabibiStay Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Your Trusted Partner in Real Estate Investment
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`glass-card p-8 text-center ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue/10 rounded-full mb-6">
                <TrendingUp className="h-8 w-8 text-brand-blue" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Proven Track Record</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We have a history of delivering strong, consistent returns for our investment partners through strategic property selection and management.
              </p>
            </div>

            <div className={`glass-card p-8 text-center ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue/10 rounded-full mb-6">
                <BarChart3 className="h-8 w-8 text-brand-blue" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Data-Driven Underwriting</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our investment decisions are backed by rigorous market analysis, financial modeling, and comprehensive due diligence to minimize risk and maximize profitability.
              </p>
            </div>

            <div className={`glass-card p-8 text-center ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue/10 rounded-full mb-6">
                <FileText className="h-8 w-8 text-brand-blue" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Transparent Quarterly Reporting</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Stay informed with clear, detailed quarterly reports on your investment's performance, financials, and market outlook.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Investment Performance
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Track record of delivering exceptional returns in Riyadh's dynamic market
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className={`glass-card p-8 text-center ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl font-bold gradient-text mb-2">15%</div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Average IRR</p>
            </div>
            
            <div className={`glass-card p-8 text-center ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
              <div className="text-3xl font-bold gradient-text mb-2">76%</div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">NOI Increase</p>
            </div>
            
            <div className={`glass-card p-8 text-center ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
              <div className="text-3xl font-bold gradient-text mb-2">95%</div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Occupancy Rate</p>
            </div>
            
            <div className={`glass-card p-8 text-center ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
              <div className="text-3xl font-bold gradient-text mb-2">$50M+</div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Assets Under Management</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-brand-blue to-brand-blue-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Investment Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Download our comprehensive investor deck and discover how HabibiStay can help you build wealth through Riyadh real estate.
            </p>
            <Button 
              size="lg" 
              className="glass-button bg-white text-brand-blue px-8 py-4 text-lg font-semibold hover:bg-gray-100"
            >
              <FileText className="h-5 w-5 mr-2" />
              Request Investor Deck
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}