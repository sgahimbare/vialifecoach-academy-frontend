import { useState } from "react";
import { MessageSquare, Copy, Check } from "lucide-react";

interface QuickResponseTemplatesProps {
  onTemplateSelect: (template: string) => void;
}

const quickResponses = {
  acknowledgement: {
    title: "Acknowledgement",
    message: "Thank you for reaching out to us. We have received your message and will get back to you shortly with a comprehensive response.",
    icon: "✅"
  },
  escalation: {
    title: "Escalation",
    message: "Your ticket has been escalated to our senior support team for specialized attention. We'll provide you with a detailed response within 24 hours.",
    icon: "⬆️"
  },
  resolved: {
    title: "Resolved",
    message: "We believe we have successfully resolved your issue. Please review our solution and let us know if you need any further assistance or have additional questions.",
    icon: "✨"
  },
  information: {
    title: "Information Request",
    message: "Thank you for your inquiry. Here's the information you requested. Please review the details below and let us know if you need any clarification.",
    icon: "📋"
  },
  follow_up: {
    title: "Follow Up",
    message: "We're following up on your previous support request. Is there anything else we can help you with or any additional information you need?",
    icon: "🔄"
  },
  technical: {
    title: "Technical Support",
    message: "Our technical team has reviewed your issue and we're working on a solution. We'll provide you with an update as soon as possible.",
    icon: "🔧"
  },
  billing: {
    title: "Billing Support",
    message: "We've received your billing inquiry and our finance team is reviewing your account. We'll get back to you within one business day.",
    icon: "💳"
  },
  welcome: {
    title: "Welcome",
    message: "Welcome to ViaLifeCoach! We're excited to have you as part of our community. Please don't hesitate to reach out if you need any assistance getting started.",
    icon: "👋"
  }
};

export function QuickResponseTemplates({ onTemplateSelect }: QuickResponseTemplatesProps) {
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  const handleTemplateClick = (templateKey: string, message: string) => {
    onTemplateSelect(message);
    setCopiedTemplate(templateKey);
    setTimeout(() => setCopiedTemplate(null), 2000);
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="h-5 w-5 text-sky-400" />
        <h3 className="text-lg font-semibold text-slate-100">Quick Response Templates</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {Object.entries(quickResponses).map(([key, template]) => (
          <button
            key={key}
            onClick={() => handleTemplateClick(key, template.message)}
            className="text-left p-3 bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-600 transition-colors group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{template.icon}</span>
                  <span className="text-sm font-medium text-slate-100">{template.title}</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{template.message}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {copiedTemplate === key ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4 text-slate-400" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t border-slate-700">
        <p className="text-xs text-slate-400">
          💡 Click any template to use it in your reply. Templates help maintain consistent and professional communication.
        </p>
      </div>
    </div>
  );
}
