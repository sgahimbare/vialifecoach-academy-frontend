import { Helmet } from "react-helmet-async";
import { Phone, MessageCircle, Clock, CheckCircle } from "lucide-react";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 fill-green-500">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.428a.75.75 0 0 0 .916.916l5.573-1.471A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 0 1-4.953-1.355l-.355-.211-3.676.97.983-3.594-.232-.37A9.713 9.713 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
    </svg>
  );
}

export function SupportWhatsAppPage() {
  const whatsappNumber = "+254792965970";
  const whatsappMessage = "Hi ViaLife Coach! I need help with...";

  const openWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <Helmet>
        <title>WhatsApp Support - ViaLife Coach Support</title>
        <meta name="description" content="Get instant support via WhatsApp chat with ViaLife Coach team. Quick responses for urgent queries." />
        <meta name="keywords" content="ViaLife Coach WhatsApp, chat support, instant help, WhatsApp coaching" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vialifecoach.org/support/whatsapp" />
        <meta property="og:title" content="WhatsApp Support - ViaLife Coach Support" />
        <meta property="og:description" content="Get instant support via WhatsApp chat with ViaLife Coach team." />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:url" content="https://vialifecoach.org/support/whatsapp" />
        <meta property="twitter:title" content="WhatsApp Support - ViaLife Coach Support" />
        <meta property="twitter:description" content="Get instant support via WhatsApp chat with ViaLife Coach team." />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://vialifecoach.org/support/whatsapp" />
      </Helmet>

      <main className="min-h-screen" style={{
        background: "linear-gradient(135deg, #1f2937 0%, #4b5563 50%, #111827 100%)"
      }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">WhatsApp Support</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Get instant support via WhatsApp chat. Our team is ready to help you with quick responses to your questions.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Info */}
            <div className="space-y-8">
              {/* WhatsApp Card */}
              <div className="bg-gray-900 bg-opacity-80 border border-gray-600 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-green-600 rounded-full">
                    <WhatsAppIcon />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Chat with Us</h2>
                    <p className="text-gray-300">Instant support via WhatsApp</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Phone className="h-5 w-5 text-green-400" />
                    <span>{whatsappNumber}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Clock className="h-5 w-5 text-green-400" />
                    <span>Available: Mon-Fri, 9 AM - 6 PM EAT</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <MessageCircle className="h-5 w-5 text-green-400" />
                    <span>Average response time: 5-10 minutes</span>
                  </div>
                </div>

                <button
                  onClick={openWhatsApp}
                  className="w-full mt-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <WhatsAppIcon />
                  Start WhatsApp Chat
                </button>
              </div>

              {/* Benefits */}
              <div className="bg-gray-900 bg-opacity-80 border border-gray-600 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">Why WhatsApp Support?</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">Instant Responses</h4>
                      <p className="text-gray-400 text-sm">Get quick answers to your questions without waiting</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">Convenient</h4>
                      <p className="text-gray-400 text-sm">Chat from anywhere using the WhatsApp app</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">Media Sharing</h4>
                      <p className="text-gray-400 text-sm">Share screenshots, documents, and voice notes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - What to Expect */}
            <div className="bg-gray-900 bg-opacity-80 border border-gray-600 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">What to Expect</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-green-400 font-medium mb-2">1. Click the WhatsApp Button</h4>
                  <p className="text-gray-300">This will open WhatsApp with a pre-filled message to get you started.</p>
                </div>

                <div>
                  <h4 className="text-green-400 font-medium mb-2">2. Introduce Yourself</h4>
                  <p className="text-gray-300">Let us know your name and what you need help with.</p>
                </div>

                <div>
                  <h4 className="text-green-400 font-medium mb-2">3. Get Support</h4>
                  <p className="text-gray-300">Our support team will respond quickly and help resolve your issue.</p>
                </div>

                <div>
                  <h4 className="text-green-400 font-medium mb-2">4. Follow Up</h4>
                  <p className="text-gray-300">Continue the conversation in WhatsApp until your issue is resolved.</p>
                </div>
              </div>

              {/* Emergency Note */}
              <div className="mt-8 p-4 bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg">
                <h4 className="text-yellow-400 font-medium mb-2">For Urgent Issues</h4>
                <p className="text-yellow-200 text-sm">
                  If you have an urgent matter that cannot wait, please include "URGENT" in your message.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
