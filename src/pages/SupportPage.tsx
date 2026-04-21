import { useState, useEffect } from "react";
import { Search, HelpCircle, Send, Calendar } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 fill-green-500">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.428a.75.75 0 0 0 .916.916l5.573-1.471A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 0 1-4.953-1.355l-.355-.211-3.676.97.983-3.594-.232-.37A9.713 9.713 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
    </svg>
  );
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// helper used by quick action cards; repeats logic from the form helpers
function openMailtoImmediate(to: string, subject = "", body = "") {
  const url = `mailto:${to}?subject=${encodeURIComponent(subject)}` +
    (body ? `&body=${encodeURIComponent(body)}` : "");
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export default function SupportPage() {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: "faq-card",
      icon: <HelpCircle className="h-7 w-7 text-sky-600" />,
      iconBg: "bg-gradient-to-br from-blue-50 to-slate-100",
      title: "FAQ & Help Center",
      desc: "Browse our most frequently asked questions.",
      btnLabel: "View FAQs →",
      btnClass: "text-sky-600 hover:text-sky-700",
      onClick: () => navigate("/support/faq"),
    },
    {
      id: "whatsapp-card",
      icon: <WhatsAppIcon />,
      iconBg: "bg-gradient-to-br from-green-50 to-emerald-100",
      title: "WhatsApp Chat",
      desc: "Chat with us directly on WhatsApp for quick help.",
      btnLabel: "Open WhatsApp →",
      btnClass: "text-green-600 hover:text-green-700",
      onClick: () => navigate("/support/whatsapp"),
    },
    {
      id: "ticket-card",
      icon: <Send className="h-7 w-7 text-sky-600" />,
      iconBg: "bg-gradient-to-br from-blue-50 to-slate-100",
      title: "Submit a Ticket",
      desc: "Send us a detailed support request via email.",
      btnLabel: "Submit Ticket →",
      btnClass: "text-sky-600 hover:text-sky-700",
      onClick: () => navigate("/support/ticket"),
    },
    {
      id: "booking-card",
      icon: <Calendar className="h-7 w-7 text-sky-600" />,
      iconBg: "bg-gradient-to-br from-blue-50 to-slate-100",
      title: "Book a Session",
      desc: "Schedule a one-on-one coaching session with our team.",
      btnLabel: "Book Now →",
      btnClass: "text-sky-700 hover:text-sky-800",
      onClick: () => navigate("/support/booking"),
    },
  ];

  // Tawk.to Live Chat injection
  // ⚠️ Replace YOUR_PROPERTY_ID and YOUR_WIDGET_ID with your actual Tawk.to credentials
  // from your Tawk.to dashboard → Administration → Chat Widget
  useEffect(() => {
    const PROPERTY_ID = "YOUR_PROPERTY_ID";
    const WIDGET_ID = "YOUR_WIDGET_ID";
    if (PROPERTY_ID === "YOUR_PROPERTY_ID") return;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>ViaLife Coach Support - Get Help with Coaching, Courses & Technical Issues</title>
        <meta name="description" content="Find answers, get support, and connect with our coaching team. Browse FAQs, knowledge base, video tutorials, or submit a support ticket. We're here to help you succeed." />
        <meta name="keywords" content="ViaLife Coach support, coaching help, technical support, FAQ, knowledge base, video tutorials, customer service, academic coaching, course assistance" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vialifecoach.org/support" />
        <meta property="og:title" content="ViaLife Coach Support - Get Help with Coaching, Courses & Technical Issues" />
        <meta property="og:description" content="Find answers, get support, and connect with our coaching team. Browse FAQs, knowledge base, video tutorials, or submit a support ticket." />
        <meta property="og:image" content="https://vialifecoach.org/images/support-hero.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://vialifecoach.org/support" />
        <meta property="twitter:title" content="ViaLife Coach Support - Get Help with Coaching, Courses & Technical Issues" />
        <meta property="twitter:description" content="Find answers, get support, and connect with our coaching team. Browse FAQs, knowledge base, video tutorials, or submit a support ticket." />
        <meta property="twitter:image" content="https://vialifecoach.org/images/support-hero.jpg" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://vialifecoach.org/support" />
        <meta name="author" content="ViaLife Coach" />
        <meta name="language" content="English" />
        
        {/* Structured Data for Google */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "ViaLife Coach Support",
            "description": "Find answers, get support, and connect with our coaching team. Browse FAQs, knowledge base, video tutorials, or submit a support ticket.",
            "url": "https://vialifecoach.org/support",
            "mainEntity": {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How do I access my coaching courses?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can access your courses through your dashboard after logging in. Navigate to My Courses to see all available content."
                  }
                },
                {
                  "@type": "Question", 
                  "name": "How do I schedule a coaching session?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Use the booking form on our support page to schedule a coaching session. Choose your preferred date and time, and we'll confirm your appointment."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What if I have technical issues?",
                  "acceptedAnswer": {
                    "@type": "Answer", 
                    "text": "Submit a support ticket through our support page or check our knowledge base for common technical solutions. Our team typically responds within 24 hours."
                  }
                }
              ]
            },
            "provider": {
              "@type": "Organization",
              "name": "ViaLife Coach",
              "url": "https://vialifecoach.org"
            }
          })}
        </script>
      </Helmet>

      <main className="min-h-screen" style={{
        background: "linear-gradient(135deg, #1f2937 0%, #4b5563 50%, #111827 100%)"
      }}>

        {/* Hero */}
        <section className="bg-gradient-to-br from-sky-700 to-sky-900 text-white py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-3">How Can We Help You?</h1>
            <p className="text-sky-100 text-lg mb-8">
              Find answers, get support, and connect with our coaching team — we're here for you.
            </p>
          </div>
        </section>

        {/* Quick Action Cards */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {quickActions.map((card) => (
              <div
                key={card.id}
                className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-300 shadow-lg p-6 flex flex-col items-start gap-3 hover:shadow-xl hover:border-sky-300 hover:from-slate-50 hover:to-blue-50 transition-all duration-300"
              >
                <div className={`p-2 ${card.iconBg} rounded-xl`}>{card.icon}</div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">{card.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{card.desc}</p>
                </div>
                <button
                  onClick={card.onClick}
                  className={`mt-auto text-sm font-medium hover:underline transition-colors ${card.btnClass}`}
                >
                  {card.btnLabel}
                </button>
              </div>
            ))}
          </div>
        </div>

      </main>
    </>
  );
}
