import { Helmet } from "react-helmet-async";
import { SupportTicketForm } from "@/features/support/components/SupportTicketForm";

export function SupportTicketPage() {
  return (
    <>
      <Helmet>
        <title>Submit Support Ticket - ViaLife Coach Support</title>
        <meta name="description" content="Submit a support ticket to get help with ViaLife Coach services, technical issues, or account problems." />
        <meta name="keywords" content="ViaLife Coach support ticket, help request, technical support, customer service" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vialifecoach.org/support/ticket" />
        <meta property="og:title" content="Submit Support Ticket - ViaLife Coach Support" />
        <meta property="og:description" content="Submit a support ticket to get help with ViaLife Coach services." />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:url" content="https://vialifecoach.org/support/ticket" />
        <meta property="twitter:title" content="Submit Support Ticket - ViaLife Coach Support" />
        <meta property="twitter:description" content="Submit a support ticket to get help with ViaLife Coach services." />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://vialifecoach.org/support/ticket" />
      </Helmet>

      <main className="min-h-screen" style={{
        background: "linear-gradient(135deg, #1f2937 0%, #4b5563 50%, #111827 100%)"
      }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Submit Support Ticket</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Need help with something? Submit a support ticket and our team will respond within 24 hours.
            </p>
          </div>

          {/* Ticket Form */}
          <SupportTicketForm />
        </div>
      </main>
    </>
  );
}
