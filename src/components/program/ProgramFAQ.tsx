import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export function ProgramFAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: "How long does the complete program take?",
      answer: "The full Women Refugee Rise Program typically takes 3-9 months to complete, depending on your pace. Each pillar is designed to take 1-3 months. You can work at your own pace, and many women complete the program while working or caring for family.",
      category: "General"
    },
    {
      id: 2,
      question: "Do I need to complete the pillars in order?",
      answer: "Yes, the program is designed as a linear progression for maximum benefit. Pillar 1 (Mental Health) builds the emotional foundation needed for success in Pillar 2 (Entrepreneurship) and Pillar 3 (Virtual Assistant). However, if you have specific needs, we can discuss alternative paths.",
      category: "Structure"
    },
    {
      id: 3,
      question: "Is the program really free for refugee women?",
      answer: "Yes! The Women Refugee Rise Program is completely free for women who identify as refugees or asylum seekers. We believe in providing opportunities without financial barriers. All materials, mentoring, and support are included at no cost.",
      category: "Cost"
    },
    {
      id: 4,
      question: "What kind of support will I receive?",
      answer: "You'll receive comprehensive support including: personal mentoring, peer support groups, access to counselors, business coaching, and job placement assistance. We also provide childcare support vouchers and technology access when needed.",
      category: "Support"
    },
    {
      id: 5,
      question: "Can I work while participating in the program?",
      answer: "Absolutely! The program is designed to be flexible. You can complete modules in the evenings, on weekends, or during whatever hours work for you. Many participants work part-time or full-time while completing the program.",
      category: "Schedule"
    },
    {
      id: 6,
      question: "What happens after I complete the program?",
      answer: "After completion, you'll join our alumni network with ongoing support, networking opportunities, and advanced workshops. We also provide continued mentorship and help with career advancement or business growth. Many graduates become mentors themselves.",
      category: "After Program"
    },
    {
      id: 7,
      question: "Do I need previous business or tech experience?",
      answer: "No experience necessary! The program starts with foundational skills and builds up gradually. Whether you're starting from scratch or have some experience, our personalized approach ensures you learn at the right level for you.",
      category: "Requirements"
    },
    {
      id: 8,
      question: "What language is the program offered in?",
      answer: "We currently offer the program in English, French, and Arabic, with plans to add more languages. We also provide translation support and have multilingual mentors available.",
      category: "Language"
    },
    {
      id: 9,
      question: "How do I enroll in the program?",
      answer: "Simply click the 'Begin Your Journey' button on this page, fill out a short application form, and attend a brief orientation session. We'll help you every step of the way, from enrollment to completion.",
      category: "Enrollment"
    },
    {
      id: 10,
      question: "What kind of certificate will I receive?",
      answer: "You'll receive individual certificates for each completed pillar and a comprehensive program certificate. These are recognized by employers and can help with job applications and business registrations.",
      category: "Certification"
    }
  ];

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const categories = Array.from(new Set(faqItems.map(item => item.category)));

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Everything you need to know about the Women Refugee Rise Program
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category}
            className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            {category}
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="max-w-3xl mx-auto space-y-4">
        {faqItems.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">
                    {item.category[0]}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">{item.question}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {item.category}
                </span>
                {openItems.includes(item.id) ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </button>
            
            {openItems.includes(item.id) && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-gray-700 leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Additional Help Section */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Our program coordinators are here to help. Reach out and we'll personally answer any questions you have.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Contact Support
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Schedule a Call
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">500+</div>
          <div className="text-sm text-gray-600">Women Helped</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">95%</div>
          <div className="text-sm text-gray-600">Success Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">25+</div>
          <div className="text-sm text-gray-600">Countries</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">4.9/5</div>
          <div className="text-sm text-gray-600">Satisfaction</div>
        </div>
      </div>
    </div>
  );
}
