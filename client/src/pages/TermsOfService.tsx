import { useEffect, useState } from "react";
import { Shield, FileText, Scale, Users } from "lucide-react";
import Layout from "@/components/Layout";

export default function TermsOfService() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-brand-blue to-blue-700 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Shield className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl opacity-90">
              Transparent terms for a trusted community
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
                <FileText className="h-6 w-6 mr-3 text-brand-blue" />
                Agreement Overview
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Welcome to HabibiStay. These Terms of Service ("Terms") govern your use of our platform, 
                including our website, mobile applications, and services (collectively, the "Service"). 
                By accessing or using HabibiStay, you agree to be bound by these Terms.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                HabibiStay operates under Saudi Arabian law and is committed to providing a safe, 
                reliable platform for short-term rental accommodations throughout the Kingdom of Saudi Arabia.
              </p>
            </section>

            {/* Definitions */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Definitions</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-brand-blue pl-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Guest</h3>
                  <p className="text-gray-600 dark:text-gray-300">Individual who books and stays at accommodations listed on HabibiStay</p>
                </div>
                <div className="border-l-4 border-brand-blue pl-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Host</h3>
                  <p className="text-gray-600 dark:text-gray-300">Property owner or authorized representative who lists accommodations on our platform</p>
                </div>
                <div className="border-l-4 border-brand-blue pl-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Investor</h3>
                  <p className="text-gray-600 dark:text-gray-300">Individual who participates in HabibiStay's property investment opportunities</p>
                </div>
                <div className="border-l-4 border-brand-blue pl-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Listing</h3>
                  <p className="text-gray-600 dark:text-gray-300">Accommodation or experience offered by Hosts through the HabibiStay platform</p>
                </div>
              </div>
            </section>

            {/* Eligibility */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Eligibility</h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  To use HabibiStay, you must:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Be at least 18 years of age</li>
                  <li>Have legal capacity to enter into binding agreements</li>
                  <li>Comply with all applicable laws and regulations in Saudi Arabia</li>
                  <li>Provide accurate and complete information during registration</li>
                  <li>Maintain the security of your account credentials</li>
                </ul>
              </div>
            </section>

            {/* User Responsibilities */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Users className="h-6 w-6 mr-3 text-brand-blue" />
                User Responsibilities
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">For Guests</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• Provide accurate booking information</li>
                    <li>• Respect property rules and local customs</li>
                    <li>• Report any issues promptly</li>
                    <li>• Leave properties in good condition</li>
                    <li>• Comply with local laws and regulations</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">For Hosts</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• Provide accurate listing descriptions</li>
                    <li>• Maintain property safety and cleanliness</li>
                    <li>• Respond to guest inquiries promptly</li>
                    <li>• Honor confirmed reservations</li>
                    <li>• Comply with local hosting regulations</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Booking and Payment */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Booking and Payment</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Booking Process</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    All bookings are subject to Host acceptance. Guests receive booking confirmation upon successful payment processing. 
                    Prices are displayed in Saudi Riyals (SAR) and include applicable taxes unless otherwise specified.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Payment Terms</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Payment is processed through secure payment gateways including PayPal and local Saudi banking systems. 
                    Full payment is required at the time of booking. HabibiStay may charge service fees as disclosed during booking.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cancellation Policy</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Cancellation policies vary by listing and are clearly displayed during booking. 
                    Refunds are processed according to the specific cancellation policy of each reservation.
                  </p>
                </div>
              </div>
            </section>

            {/* Investment Terms */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Investment Opportunities</h2>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                <p className="text-yellow-800 dark:text-yellow-200 mb-4 font-semibold">
                  Important Investment Disclaimer
                </p>
                <p className="text-yellow-700 dark:text-yellow-300 leading-relaxed">
                  Investment opportunities offered through HabibiStay carry inherent risks. Past performance does not guarantee future results. 
                  All investors must conduct due diligence and consider their financial situation before investing. 
                  HabibiStay is not a licensed financial advisor and does not provide investment advice.
                </p>
              </div>
            </section>

            {/* Prohibited Activities */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Prohibited Activities</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">Strictly Prohibited</h3>
                  <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
                    <li>• Illegal activities or substance use</li>
                    <li>• Discrimination or harassment</li>
                    <li>• Unauthorized commercial activities</li>
                    <li>• Damage to property or belongings</li>
                    <li>• Violation of local customs or laws</li>
                  </ul>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Platform Misuse</h3>
                  <ul className="text-orange-700 dark:text-orange-300 text-sm space-y-1">
                    <li>• False or misleading information</li>
                    <li>• Circumventing platform fees</li>
                    <li>• Spam or unwanted communications</li>
                    <li>• Intellectual property violations</li>
                    <li>• System interference or hacking</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Scale className="h-6 w-6 mr-3 text-brand-blue" />
                Limitation of Liability
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                HabibiStay acts as a platform connecting Guests and Hosts. We do not own, create, sell, resell, 
                provide, control, manage, offer, deliver, or supply any listings or experiences.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                To the maximum extent permitted by law, HabibiStay shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages arising from your use of the Service.
              </p>
            </section>

            {/* Governing Law */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Governing Law</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                These Terms are governed by the laws of the Kingdom of Saudi Arabia. Any disputes arising from 
                these Terms or your use of HabibiStay will be subject to the jurisdiction of Saudi Arabian courts.
              </p>
            </section>

            {/* Contact Information */}
            <section className="bg-brand-blue/10 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p>Email: legal@habibistay.com</p>
                <p>Phone: +966 11 XXX XXXX</p>
                <p>Address: Riyadh, Kingdom of Saudi Arabia</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}