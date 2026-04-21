import { Helmet } from "react-helmet-async";
import { SupportBookingForm } from "@/features/support/components/SupportBookingForm";

export function SupportBookingPage() {
  return (
    <>
      <Helmet>
        <title>Book Coaching Session - ViaLife Coach Support</title>
        <meta name="description" content="Schedule a personalized one-on-one coaching session with our certified life coaches." />
        <meta name="keywords" content="ViaLife Coach booking, coaching session, life coach appointment, personal coaching" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vialifecoach.org/support/booking" />
        <meta property="og:title" content="Book Coaching Session - ViaLife Coach Support" />
        <meta property="og:description" content="Schedule a personalized one-on-one coaching session with our certified life coaches." />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:url" content="https://vialifecoach.org/support/booking" />
        <meta property="twitter:title" content="Book Coaching Session - ViaLife Coach Support" />
        <meta property="twitter:description" content="Schedule a personalized one-on-one coaching session with our certified life coaches." />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://vialifecoach.org/support/booking" />
      </Helmet>

      <main className="min-h-screen" style={{
        background: "linear-gradient(135deg, #1f2937 0%, #4b5563 50%, #111827 100%)"
      }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Book a Coaching Session</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Schedule a personalized one-on-one session with our certified life coaches and take your journey to the next level.
            </p>
          </div>

          {/* Booking Form */}
          <SupportBookingForm />
        </div>
      </main>
    </>
  );
}
