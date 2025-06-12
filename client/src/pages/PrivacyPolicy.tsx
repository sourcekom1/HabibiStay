import { useEffect, useState } from "react";
import { Shield, Lock, Eye, Database, UserCheck, Globe } from "lucide-react";
import Layout from "@/components/Layout";

export default function PrivacyPolicy() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-green-600 to-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Lock className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl opacity-90">
              Your privacy is our priority
            </p>
            <p className="text-sm opacity-75 mt-4">
              Last updated: December 12, 2025
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            
            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Shield className="h-6 w-6 mr-3 text-green-600" />
                Our Commitment to Privacy
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                At HabibiStay, we understand that privacy is fundamental to building trust. This Privacy Policy explains 
                how we collect, use, protect, and share your personal information when you use our platform.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We are committed to transparency and compliance with Saudi Arabian data protection regulations and 
                international privacy standards.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Database className="h-6 w-6 mr-3 text-blue-600" />
                Information We Collect
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">Information You Provide</h3>
                  <ul className="space-y-2 text-blue-700 dark:text-blue-300">
                    <li>• Account registration details (name, email, phone)</li>
                    <li>• Profile information and preferences</li>
                    <li>• Booking and payment information</li>
                    <li>• Property listing details (for Hosts)</li>
                    <li>• Communications and reviews</li>
                    <li>• Identity verification documents</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-4">Automatically Collected</h3>
                  <ul className="space-y-2 text-purple-700 dark:text-purple-300">
                    <li>• Device and browser information</li>
                    <li>• IP address and location data</li>
                    <li>• Usage patterns and preferences</li>
                    <li>• Cookies and tracking technologies</li>
                    <li>• Performance and analytics data</li>
                    <li>• Communication metadata</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Eye className="h-6 w-6 mr-3 text-green-600" />
                How We Use Your Information
              </h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Service Delivery</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Processing bookings, facilitating payments, enabling communication between Guests and Hosts, 
                    and providing customer support.
                  </p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Safety and Security</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Verifying identities, preventing fraud, detecting suspicious activities, 
                    and maintaining platform security and integrity.
                  </p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Personalization</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Customizing your experience, providing relevant recommendations, 
                    and improving our services based on your preferences.
                  </p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Legal Compliance</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Meeting regulatory requirements, responding to legal requests, 
                    and enforcing our Terms of Service.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Information Sharing</h2>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">We Never Sell Your Data</h3>
                <p className="text-yellow-700 dark:text-yellow-300">
                  HabibiStay does not sell, rent, or trade your personal information to third parties for marketing purposes.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">With Other Users</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Limited profile information is shared between Guests and Hosts to facilitate bookings and communication.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Service Providers</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Trusted partners who help us operate our platform, including payment processors, 
                    cloud hosting providers, and customer support tools.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Legal Requirements</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    When required by law, court order, or government regulation, 
                    or to protect the rights and safety of our users and platform.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Lock className="h-6 w-6 mr-3 text-red-600" />
                Data Security Measures
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Encryption</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    All data is encrypted in transit and at rest using industry-standard protocols
                  </p>
                </div>
                
                <div className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <UserCheck className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Access Control</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Strict access controls and authentication for all team members
                  </p>
                </div>
                
                <div className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <Eye className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Monitoring</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    24/7 security monitoring and regular security audits
                  </p>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <UserCheck className="h-6 w-6 mr-3 text-green-600" />
                Your Privacy Rights
              </h2>
              
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                <p className="text-green-800 dark:text-green-200 font-semibold mb-4">
                  You have the following rights regarding your personal data:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-green-700 dark:text-green-300">
                    <li>• Access your personal information</li>
                    <li>• Correct inaccurate data</li>
                    <li>• Delete your account and data</li>
                    <li>• Export your data</li>
                  </ul>
                  <ul className="space-y-2 text-green-700 dark:text-green-300">
                    <li>• Restrict data processing</li>
                    <li>• Object to data use</li>
                    <li>• Withdraw consent</li>
                    <li>• File complaints with authorities</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Cookies and Tracking</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
                and provide personalized content. You can control cookie preferences through your browser settings.
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Types of Cookies We Use:</h3>
                <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-1">
                  <li>• Essential cookies for platform functionality</li>
                  <li>• Performance cookies for analytics and optimization</li>
                  <li>• Functional cookies for personalization</li>
                  <li>• Marketing cookies for relevant advertising</li>
                </ul>
              </div>
            </section>

            {/* International Transfers */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Globe className="h-6 w-6 mr-3 text-blue-600" />
                International Data Transfers
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Your data may be transferred to and processed in countries outside Saudi Arabia where our 
                service providers operate. We ensure appropriate safeguards are in place to protect your 
                information in accordance with this Privacy Policy and applicable laws.
              </p>
            </section>

            {/* Data Retention */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Data Retention</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                We retain your personal information only for as long as necessary to provide our services, 
                comply with legal obligations, resolve disputes, and enforce our agreements.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  Account data is typically retained for 3 years after account closure, 
                  while transaction records may be kept longer to comply with financial regulations.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Privacy Questions?</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                For questions about this Privacy Policy or to exercise your privacy rights:
              </p>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p>Email: privacy@habibistay.com</p>
                <p>Phone: +966 11 XXX XXXX</p>
                <p>Address: Data Protection Officer, HabibiStay, Riyadh, Saudi Arabia</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}