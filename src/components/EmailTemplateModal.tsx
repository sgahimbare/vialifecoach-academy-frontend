import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Send, 
  Eye, 
  X, 
  Edit,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'welcome' | 'application' | 'approval' | 'rejection' | 'reminder' | 'waitlisted' | 'shortlisted' | 'admitted' | 'under_review' | 'custom';
  isActive: boolean;
  variables: string[];
}

interface Application {
  id: string;
  applicant: {
    name: string;
    email: string;
    phone: string;
    age: number;
    nationality: string;
    refugeeStatus: string;
  };
  program: {
    name: string;
    type: string;
  };
  status: string;
}

interface EmailTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
  emailType: 'status' | 'rejection' | 'approval' | 'waitlisted' | 'shortlisted' | 'admitted' | 'under_review' | 'reminder';
  onSendEmail: (emailData: {
    to: string;
    subject: string;
    content: string;
    templateName: string;
  }) => void;
}

const EmailTemplateModal: React.FC<EmailTemplateModalProps> = ({
  isOpen,
  onClose,
  application,
  emailType,
  onSendEmail
}) => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customSubject, setCustomSubject] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
      setDefaultEmailContent();
    }
  }, [isOpen, emailType, application]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      // Mock templates - in real app, fetch from API
      const mockTemplates: EmailTemplate[] = [
        {
          id: '1',
          name: 'Application Under Review',
          subject: 'Your Application to {{programName}} is Under Review',
          content: 'Dear {{firstName}},\n\nThank you for submitting your application to {{programName}}.\n\nWe are pleased to inform you that your application has successfully passed the initial screening and is now under review by our evaluation committee.\n\nWhat happens next:\n- Your application will be carefully evaluated by our selection panel\n- We will assess your qualifications, experience, and motivation\n- You can expect a decision within 2-3 weeks\n\nWe appreciate your interest in {{programName}} and will notify you as soon as a decision has been made.\n\nIf you have any questions in the meantime, please don\'t hesitate to contact us.\n\nBest regards,\nVialifecoach Global Foundation Academy',
          type: 'under_review',
          isActive: true,
          variables: ['firstName', 'programName']
        },
        {
          id: '2',
          name: 'Application Shortlisted',
          subject: 'Great News! You Have Been Shortlisted for {{programName}}',
          content: 'Dear {{firstName}},\n\nCongratulations! We are delighted to inform you that you have been shortlisted for {{programName}}.\n\nYour application stood out among many qualified candidates, and our selection committee would like to move forward with the next steps in the evaluation process.\n\nWhat this means:\n- You are among the top candidates being considered\n- We will be conducting final reviews and interviews\n- A final decision will be made shortly\n\nOur team is very impressed with your background and qualifications. We believe you could be an excellent fit for {{programName}}.\n\nWe will be in touch soon with the final decision. Thank you for your patience throughout this process.\n\nWarm regards,\nVialifecoach Global Foundation Academy',
          type: 'shortlisted',
          isActive: true,
          variables: ['firstName', 'programName']
        },
        {
          id: '3',
          name: 'Application Waitlisted',
          subject: 'Update on Your Application to {{programName}} - Waitlist Status',
          content: 'Dear {{firstName}},\n\nThank you for your patience as we completed the evaluation process for {{programName}}.\n\nAfter careful consideration of all applications, we would like to inform you that you have been placed on our waitlist.\n\nWhat does being waitlisted mean?\n- Your application was strong and competitive\n- You are qualified for the program\n- You may be offered a position if space becomes available\n- We will contact you if a spot opens up\n\nThe selection process was highly competitive this year, and being placed on the waitlist reflects the quality of your application.\n\nWe will keep your application active and will notify you immediately if a position becomes available. There is no need to reapply.\n\nWe appreciate your interest in {{programName}} and hope to have positive news for you soon.\n\nBest regards,\nVialifecoach Global Foundation Academy',
          type: 'waitlisted',
          isActive: true,
          variables: ['firstName', 'programName']
        },
        {
          id: '4',
          name: 'Application Approved',
          subject: 'Congratulations! Your Application to {{programName}} Has Been Approved',
          content: 'Dear {{firstName}},\n\nWe are absolutely thrilled to inform you that your application to {{programName}} has been approved!\n\nCongratulations on this achievement! After a comprehensive review process, our selection committee was highly impressed with your qualifications, experience, and passion for this program.\n\nYour Journey Begins Here:\n\nNext Steps:\n1. Accept Your Offer - Please confirm your acceptance by replying to this email within 7 days\n2. Complete Registration - We\'ll send you a link to complete the official registration process\n3. Prepare for Onboarding - Get ready for an incredible learning experience\n4. Join Our Community - Connect with fellow participants and mentors\n\nProgram Details:\n- Program: {{programName}}\n- Start Date: [To be confirmed]\n- Duration: [Program duration]\n- Format: [Online/In-person]\n\nWe believe you have the potential to make a significant impact, and we\'re excited to support you on this journey. {{programName}} will provide you with the skills, knowledge, and network to achieve your goals.\n\nWelcome to the Vialifecoach Family!\n\nIf you have any questions or need assistance with the next steps, please don\'t hesitate to reach out.\n\nWe can\'t wait to see you succeed!\n\nWarm regards,\nVialifecoach Global Foundation Academy',
          type: 'approval',
          isActive: true,
          variables: ['firstName', 'programName']
        },
        {
          id: '5',
          name: 'Application Admitted',
          subject: 'Welcome Aboard! You Have Been Admitted to {{programName}}',
          content: 'Dear {{firstName}},\n\nWelcome to {{programName}}!\n\nWe are absolutely delighted to officially welcome you as an admitted participant in {{programName}}. Your admission number is: {{applicationId}}\n\nYour Admission is Confirmed:\n\nWhat This Means:\n- You have successfully completed all admission requirements\n- Your place in the program is secured\n- You are now part of our esteemed community\n- Your journey to transformation begins now!\n\nYour Next Steps:\n1. Complete Onboarding - Check your email for the onboarding portal link\n2. Join Orientation - Attend the mandatory orientation session\n3. Connect with Mentors - Get ready to meet your dedicated mentors\n4. Access Resources - Gain access to all program materials and resources\n\nWhat Awaits You:\n- World-class curriculum and instruction\n- Personalized mentorship and guidance\n- Networking opportunities with industry leaders\n- Career development and support services\n- Lifetime access to our alumni network\n\nImportant Information:\n- Admission Number: {{applicationId}}\n- Program: {{programName}}\n- Status: Fully Admitted\n- Community: Vialifecoach Global Network\n\nYou were selected because we believe in your potential to create meaningful change. {{programName}} is designed to empower you with the tools, knowledge, and confidence to achieve your dreams.\n\nWelcome to a Life-Changing Experience!\n\nWe are here to support you every step of the way. If you have any questions or need assistance, please reach out to our support team.\n\nLet\'s begin this incredible journey together!\n\nWith excitement and warm wishes,\nVialifecoach Global Foundation Academy\n\nP.S. Get ready to transform your life!',
          type: 'admitted',
          isActive: true,
          variables: ['firstName', 'programName', 'applicationId']
        },
        {
          id: '6',
          name: 'Application Rejected',
          subject: 'Regarding Your Application to {{programName}}',
          content: 'Dear {{firstName}},\n\nThank you for your interest in {{programName}} and for the time and effort you invested in submitting your application.\n\nAfter careful consideration and thorough evaluation of all applications, we regret to inform you that your application was not selected for this cohort of {{programName}}.\n\nWe Understand This May Be Disappointing\n\nPlease know that the selection process was extremely competitive this year. We received many exceptional applications from qualified candidates like yourself, making the decision process very challenging.\n\nWhat This Doesn\'t Mean:\n- It doesn\'t reflect on your worth or potential\n- It doesn\'t diminish your achievements or qualifications\n- It doesn\'t mean you shouldn\'t pursue similar opportunities\n\nWe Encourage You To:\n- Continue pursuing opportunities aligned with your goals\n- Apply again for future cohorts of {{programName}}\n- Stay connected with our community for other opportunities\n- Reach out if you\'d like feedback on your application\n\nYour Strengths:\n\nOur team noted several strengths in your application, and we believe you have significant potential to make a positive impact in your chosen field.\n\nStay Connected:\n\nWe would love to stay in touch and keep you informed about future programs, workshops, and opportunities that might be a great fit for you.\n\nMoving Forward:\n\nWe sincerely appreciate your interest in Vialifecoach and encourage you to continue pursuing your goals with determination and confidence. Your journey is unique, and the right opportunity is waiting for you.\n\nWe wish you every success in your future endeavors and hope our paths cross again.\n\nWith respect and best wishes,\nVialifecoach Global Foundation Academy',
          type: 'rejection',
          isActive: true,
          variables: ['firstName', 'programName']
        }
        ,
        {
          id: '7',
          name: 'Application Deadline Reminder',
          subject: 'Reminder: Complete Your Application for {{programName}}',
          content: 'Dear {{firstName}},\n\nThis is a friendly reminder that your application to {{programName}} is still incomplete.\n\nIf you wish to be considered, please return to the application portal and submit your application before the deadline.\n\nIf you do not plan to continue, you can safely ignore this message.\n\nThank you,\nVialifecoach Global Foundation Academy',
          type: 'reminder',
          isActive: true,
          variables: ['firstName', 'programName']
        }
      ];
      setTemplates(mockTemplates);
      
      // Auto-select template based on email type
      const relevantTemplate = mockTemplates.find(t => t.type === emailType);
      if (relevantTemplate) {
        setSelectedTemplate(relevantTemplate);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const setDefaultEmailContent = () => {
    // Set default custom content based on email type
    if (emailType === 'status' || emailType === 'under_review') {
      setCustomSubject('Update on Your Application Status');
      setCustomContent(`Dear ${application.applicant.name},\n\nThank you for submitting your application to ${application.program.name}.\n\nWe would like to inform you that your application is currently under review...`);
    } else if (emailType === 'approval') {
      setCustomSubject(`Congratulations! Your Application to ${application.program.name} Has Been Approved`);
      setCustomContent(`Dear ${application.applicant.name},\n\nCongratulations! We are pleased to inform you that your application has been approved...`);
    } else if (emailType === 'admitted') {
      setCustomSubject(`Welcome Aboard! You Have Been Admitted to ${application.program.name}`);
      setCustomContent(`Dear ${application.applicant.name},\n\nWe are absolutely delighted to officially welcome you as an admitted participant...`);
    } else if (emailType === 'shortlisted') {
      setCustomSubject(`Great News! You Have Been Shortlisted for ${application.program.name}`);
      setCustomContent(`Dear ${application.applicant.name},\n\nCongratulations! We are delighted to inform you that you have been shortlisted...`);
    } else if (emailType === 'waitlisted') {
      setCustomSubject(`Update on Your Application to ${application.program.name} - Waitlist Status`);
      setCustomContent(`Dear ${application.applicant.name},\n\nThank you for your patience as we completed the evaluation process...`);
    } else if (emailType === 'rejection') {
      setCustomSubject(`Regarding Your Application to ${application.program.name}`);
      setCustomContent(`Dear ${application.applicant.name},\n\nThank you for your interest in ${application.program.name}...`);
    }
  };

  const replaceVariables = (text: string): string => {
    return text
      .replace(/\{\{firstName\}\}/g, application.applicant.name)
      .replace(/\{\{lastName\}\}/g, application.applicant.name.split(' ').pop() || '')
      .replace(/\{\{email\}\}/g, application.applicant.email)
      .replace(/\{\{phone\}\}/g, application.applicant.phone)
      .replace(/\{\{programName\}\}/g, application.program.name)
      .replace(/\{\{applicationId\}\}/g, application.id)
      .replace(/\{\{status\}\}/g, application.status)
      .replace(/\{\{date\}\}/g, new Date().toLocaleDateString());
  };

  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsCustomMode(false);
    setPreviewMode(false);
  };

  const handleCustomMode = () => {
    setIsCustomMode(true);
    setSelectedTemplate(null);
    setPreviewMode(false);
  };

  const handleSendEmail = () => {
    const emailData = {
      to: application.applicant.email,
      subject: isCustomMode ? customSubject : replaceVariables(selectedTemplate?.subject || ''),
      content: isCustomMode ? customContent : replaceVariables(selectedTemplate?.content || ''),
      templateName: isCustomMode ? 'Custom Email' : selectedTemplate?.name || 'Unknown Template'
    };

    onSendEmail(emailData);
    onClose();
  };

  const getCurrentSubject = () => {
    if (isCustomMode) return customSubject;
    if (selectedTemplate) return replaceVariables(selectedTemplate.subject);
    return '';
  };

  const getCurrentContent = () => {
    if (isCustomMode) return customContent;
    if (selectedTemplate) return replaceVariables(selectedTemplate.content);
    return '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-blue-400" />
            <div>
              <h2 className="text-xl font-semibold text-white">Send Email to {application.applicant.name}</h2>
              <p className="text-sm text-slate-400">{application.applicant.email}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex h-[calc(90vh-200px)]">
          {/* Templates Sidebar */}
          <div className="w-1/3 border-r border-slate-700 p-4 overflow-y-auto">
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Email Templates</h3>
                <Button
                  variant={isCustomMode ? "default" : "outline"}
                  size="sm"
                  onClick={handleCustomMode}
                  className={isCustomMode ? "" : "border-slate-600 text-slate-300 hover:bg-slate-700"}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Custom
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-sm text-slate-400 mt-2">Loading templates...</p>
                </div>
              ) : (
                templates
                  .filter(template => {
                    // Show ALL templates plus custom option for maximum flexibility
                    return template.type === 'custom' || 
                           ['under_review', 'shortlisted', 'waitlisted', 'approval', 'admitted', 'rejection', 'reminder'].includes(template.type);
                  })
                  .map(template => (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-colors ${
                        selectedTemplate?.id === template.id && !isCustomMode
                          ? 'ring-2 ring-blue-500 bg-blue-900/30 border-blue-600'
                          : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700'
                      }`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm text-white">{template.name}</CardTitle>
                          <Badge variant="secondary" className="text-xs bg-slate-600 text-slate-200">
                            {template.type}
                          </Badge>
                        </div>
                        <CardDescription className="text-xs text-slate-400">
                          {template.subject}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))
              )}
            </div>
          </div>

          {/* Email Content */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-800">
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject" className="text-white">Subject</Label>
                <Input
                  id="subject"
                  value={getCurrentSubject()}
                  onChange={(e) => {
                    if (isCustomMode) {
                      setCustomSubject(e.target.value);
                    }
                  }}
                  disabled={!isCustomMode}
                  placeholder="Enter email subject"
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                />
              </div>

              <div>
                <Label htmlFor="content" className="text-white">Message</Label>
                <Textarea
                  id="content"
                  value={getCurrentContent()}
                  onChange={(e) => {
                    if (isCustomMode) {
                      setCustomContent(e.target.value);
                    }
                  }}
                  disabled={!isCustomMode}
                  placeholder="Enter email content"
                  rows={12}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                />
              </div>

              {selectedTemplate && !isCustomMode && (
                <div className="bg-blue-900/30 border border-blue-700 p-3 rounded-lg">
                  <p className="text-sm text-blue-300">
                    <strong>Template:</strong> {selectedTemplate.name}
                  </p>
                  <p className="text-xs text-blue-400 mt-1">
                    Variables used: {selectedTemplate.variables.join(', ')}
                  </p>
                </div>
              )}

              {/* Preview */}
              <div className="border-t border-slate-700 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-semibold text-white">Preview</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewMode(!previewMode)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    {previewMode ? 'Hide' : 'Show'} Preview
                  </Button>
                </div>

                {previewMode && (
                  <Card className="bg-slate-700 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-base text-white">{getCurrentSubject()}</CardTitle>
                      <CardDescription className="text-slate-400">
                        To: {application.applicant.email}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="whitespace-pre-wrap text-sm text-slate-200">
                        {getCurrentContent()}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-slate-700 bg-slate-900">
          <div className="text-sm text-slate-400">
            {isCustomMode ? (
              <span className="flex items-center gap-1">
                <Edit className="h-4 w-4" />
                Custom email mode
              </span>
            ) : selectedTemplate ? (
              <span className="flex items-center gap-1 text-green-400">
                <CheckCircle className="h-4 w-4" />
                Template: {selectedTemplate.name}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                Select a template or write custom email
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="border-slate-600 text-slate-300 hover:bg-slate-700">
              Cancel
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={!isCustomMode && !selectedTemplate}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Send Email
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateModal;
