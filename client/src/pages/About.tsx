import { useEffect, useState } from "react";
import { Building, Users, TrendingUp, Award, Globe, Heart, Shield } from "lucide-react";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 opacity-30"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center max-w-4xl mx-auto ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
              Local Roots, Global Standards.
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Founded in the heart of Riyadh, HabibiStay was born from a passion for genuine Saudi hospitality and a vision to elevate the short-term rental experience.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`${isVisible ? 'animate-slide-left' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                We merge deep local understanding with cutting-edge technology and international best practices to create unforgettable stays for our guests and steady, reliable wealth for our partners.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Our commitment is to showcase the best of Riyadh while delivering exceptional value and service to every stakeholder in our ecosystem.
              </p>
            </div>
            <div className={`glass-card p-8 ${isVisible ? 'animate-slide-right' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue/10 rounded-full mb-4">
                    <Building className="h-8 w-8 text-brand-blue" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">500+</h3>
                  <p className="text-gray-600 dark:text-gray-300">Properties</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue/10 rounded-full mb-4">
                    <Users className="h-8 w-8 text-brand-blue" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">10,000+</h3>
                  <p className="text-gray-600 dark:text-gray-300">Happy Guests</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue/10 rounded-full mb-4">
                    <TrendingUp className="h-8 w-8 text-brand-blue" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">76%</h3>
                  <p className="text-gray-600 dark:text-gray-300">Average NOI Increase</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue/10 rounded-full mb-4">
                    <Award className="h-8 w-8 text-brand-blue" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">4.9★</h3>
                  <p className="text-gray-600 dark:text-gray-300">Guest Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Founders Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet the Visionaries Behind HabibiStay
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`glass-card p-8 text-center ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              <div className="w-24 h-24 bg-gradient-to-br from-brand-blue to-brand-blue-dark rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                AM
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Abdullah Mirza</h3>
              <p className="text-brand-blue font-semibold mb-4">Tech Visionary</p>
              <p className="text-gray-600 dark:text-gray-300">
                Driving innovation and ensuring a seamless digital experience for all users through cutting-edge technology solutions.
              </p>
            </div>

            <div className={`glass-card p-8 text-center ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
              <div className="w-24 h-24 bg-gradient-to-br from-brand-blue to-brand-blue-dark rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                VR
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Vladimir Radchenko</h3>
              <p className="text-brand-blue font-semibold mb-4">Finance Lead</p>
              <p className="text-gray-600 dark:text-gray-300">
                Structuring sound investments and financial strategies for sustainable growth and exceptional returns.
              </p>
            </div>

            <div className={`glass-card p-8 text-center ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
              <div className="w-24 h-24 bg-gradient-to-br from-brand-blue to-brand-blue-dark rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                AM
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Anna Miroshenchinko</h3>
              <p className="text-brand-blue font-semibold mb-4">Experience Curator</p>
              <p className="text-gray-600 dark:text-gray-300">
                Passionate about creating exceptional guest journeys and maintaining the highest standards of hospitality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Guided by Our Core Values
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`glass-card p-8 text-center ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue/10 rounded-full mb-6">
                <Shield className="h-8 w-8 text-brand-blue" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Trust</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Building lasting relationships through transparency, integrity, and reliability in every interaction.
              </p>
            </div>

            <div className={`glass-card p-8 text-center ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue/10 rounded-full mb-6">
                <Award className="h-8 w-8 text-brand-blue" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Excellence</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Striving for the highest standards in everything we do, from property care to guest service.
              </p>
            </div>

            <div className={`glass-card p-8 text-center ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue/10 rounded-full mb-6">
                <Heart className="h-8 w-8 text-brand-blue" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Shared Growth</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Creating win-win scenarios where our guests, owners, investors, and community thrive together.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}