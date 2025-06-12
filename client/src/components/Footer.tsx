import { Linkedin, Twitter, Instagram, Sparkles, Mail, Phone, MapPin, Globe } from "lucide-react";
import { useState, useEffect } from "react";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const footerElement = document.getElementById('footer');
    if (footerElement) {
      observer.observe(footerElement);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer id="footer" className="relative overflow-hidden">
      {/* Background Orbs */}
      <div className="bg-orb w-64 h-64 top-10 left-10 opacity-10" style={{ animationDelay: '3s' }}></div>
      <div className="bg-orb w-48 h-48 bottom-10 right-20 opacity-15" style={{ animationDelay: '8s' }}></div>
      
      <div className="glass-card border-t-2 border-brand-blue/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className={`${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center space-x-2 mb-6">
                <div className="relative">
                  <Sparkles className="h-8 w-8 text-brand-blue animate-pulse" />
                  <div className="absolute inset-0 bg-brand-blue/20 rounded-full blur-lg opacity-50"></div>
                </div>
                <h3 className="text-2xl font-bold gradient-text">HabibiStay</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-base mb-6 leading-relaxed">
                Building Wealth, Creating Memories. Local roots, global standards.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="glass-button p-3 rounded-2xl text-brand-blue hover:text-white transition-all duration-300 hover:scale-110">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="glass-button p-3 rounded-2xl text-brand-blue hover:text-white transition-all duration-300 hover:scale-110">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="glass-button p-3 rounded-2xl text-brand-blue hover:text-white transition-all duration-300 hover:scale-110">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div className={`${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              <h4 className="text-lg font-bold gradient-text mb-6">Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="glass-button px-4 py-2 rounded-xl text-gray-700 dark:text-gray-200 hover:text-brand-blue transition-all duration-300 hover:scale-105 block">Help Center</a></li>
                <li><a href="#" className="glass-button px-4 py-2 rounded-xl text-gray-700 dark:text-gray-200 hover:text-brand-blue transition-all duration-300 hover:scale-105 block">Safety Information</a></li>
                <li><a href="#" className="glass-button px-4 py-2 rounded-xl text-gray-700 dark:text-gray-200 hover:text-brand-blue transition-all duration-300 hover:scale-105 block">Cancellation Options</a></li>
                <li><a href="#" className="glass-button px-4 py-2 rounded-xl text-gray-700 dark:text-gray-200 hover:text-brand-blue transition-all duration-300 hover:scale-105 block">Contact Us</a></li>
              </ul>
            </div>

            <div className={`${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
              <h4 className="text-lg font-bold gradient-text mb-6">Community</h4>
              <ul className="space-y-3">
                <li><a href="#" className="glass-button px-4 py-2 rounded-xl text-gray-700 dark:text-gray-200 hover:text-brand-blue transition-all duration-300 hover:scale-105 block">Blog</a></li>
                <li><a href="#" className="glass-button px-4 py-2 rounded-xl text-gray-700 dark:text-gray-200 hover:text-brand-blue transition-all duration-300 hover:scale-105 block">Forum</a></li>
                <li><a href="#" className="glass-button px-4 py-2 rounded-xl text-gray-700 dark:text-gray-200 hover:text-brand-blue transition-all duration-300 hover:scale-105 block">Invite Friends</a></li>
                <li><a href="#" className="glass-button px-4 py-2 rounded-xl text-gray-700 dark:text-gray-200 hover:text-brand-blue transition-all duration-300 hover:scale-105 block">Gift Cards</a></li>
              </ul>
            </div>

            <div className={`${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
              <h4 className="text-lg font-bold gradient-text mb-6">Hosting</h4>
              <ul className="space-y-3">
                <li><a href="#" className="glass-button px-4 py-2 rounded-xl text-gray-700 dark:text-gray-200 hover:text-brand-blue transition-all duration-300 hover:scale-105 block">Host Your Home</a></li>
                <li><a href="#" className="glass-button px-4 py-2 rounded-xl text-gray-700 dark:text-gray-200 hover:text-brand-blue transition-all duration-300 hover:scale-105 block">Host Resources</a></li>
                <li><a href="#" className="glass-button px-4 py-2 rounded-xl text-gray-700 dark:text-gray-200 hover:text-brand-blue transition-all duration-300 hover:scale-105 block">Community Forum</a></li>
                <li><a href="#" className="glass-button px-4 py-2 rounded-xl text-gray-700 dark:text-gray-200 hover:text-brand-blue transition-all duration-300 hover:scale-105 block">Hosting Responsibly</a></li>
              </ul>
            </div>
          </div>

          <div className={`border-t-2 border-brand-blue/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
            <p className="text-gray-600 dark:text-gray-300 font-medium">&copy; 2025 HabibiStay. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-brand-blue font-medium transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-brand-blue font-medium transition-colors duration-300">Terms of Service</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-brand-blue font-medium transition-colors duration-300">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
