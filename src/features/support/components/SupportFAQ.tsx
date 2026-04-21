import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { faqs } from "../data/supportData";
import { GoogleSearchResults } from "./GoogleSearchResults";

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-600 rounded-xl overflow-hidden bg-gray-800 bg-opacity-80">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left bg-gray-800 bg-opacity-80 hover:bg-gray-700 transition-all duration-200"
      >
        <span className="font-medium text-white pr-4">{question}</span>
        {open ? (
          <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-6 py-4 bg-gray-700 bg-opacity-80 border-t border-gray-600">
          <p className="text-gray-300 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export function SupportFAQ({ searchQuery = "" }: { searchQuery?: string }) {
  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const googleSearchUrl = searchQuery 
    ? `https://www.google.com/search?q=${encodeURIComponent(`ViaLife Coach ${searchQuery} support help FAQ`)}`
    : '';

  return (
    <section id="faq" className="py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-300">Find quick answers to common questions</p>
        </div>
        {searchQuery && (
          <div className="text-center bg-gray-800 bg-opacity-60 border border-gray-600 rounded-lg p-4 mb-6">
            <p className="text-gray-300">
              Found {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
          </div>
        )}
        <div className="space-y-4">
          {filteredFAQs.length > 0 && (
            filteredFAQs.map((faq, index) => (
              <div key={index} itemScope itemType="https://schema.org/Question">
                <FAQItem question={faq.question} answer={faq.answer} />
                <meta itemProp="name" content={faq.question} />
                <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  <meta itemProp="text" content={faq.answer} />
                </div>
              </div>
            ))
          )}
          
          {/* Always show Google search results when there's a search query */}
          {searchQuery && <GoogleSearchResults query={searchQuery} />}
          
          {/* Show no results message only if no FAQs and no search query */}
          {!searchQuery && filteredFAQs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No FAQs available.</p>
              <p className="text-gray-500 text-sm mt-2">Check back later for updated content.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
