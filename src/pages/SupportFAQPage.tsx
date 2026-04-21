import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { SupportFAQ } from "@/features/support/components/SupportFAQ";
import { useLocation } from "react-router-dom";

export function SupportFAQPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  return (
    <>
      <Helmet>
        <title>FAQ & Help Center - ViaLife Coach Support</title>
        <meta name="description" content="Find quick answers to frequently asked questions about ViaLife Coach services, courses, and technical support." />
        <meta name="keywords" content="ViaLife Coach FAQ, help center, support questions, coaching answers, technical help" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vialifecoach.org/support/faq" />
        <meta property="og:title" content="FAQ & Help Center - ViaLife Coach Support" />
        <meta property="og:description" content="Find quick answers to frequently asked questions about ViaLife Coach services." />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:url" content="https://vialifecoach.org/support/faq" />
        <meta property="twitter:title" content="FAQ & Help Center - ViaLife Coach Support" />
        <meta property="twitter:description" content="Find quick answers to frequently asked questions about ViaLife Coach services." />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://vialifecoach.org/support/faq" />
      </Helmet>

      <main className="min-h-screen" style={{
        background: "linear-gradient(135deg, #1f2937 0%, #4b5563 50%, #111827 100%)"
      }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">FAQ & Help Center</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Find quick answers to common questions about our coaching services, courses, and platform.
            </p>
          </div>

          {/* FAQ Component */}
          <SupportFAQ searchQuery={searchQuery} />
        </div>
      </main>
    </>
  );
}
