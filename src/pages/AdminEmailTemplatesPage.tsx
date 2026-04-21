import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye, 
  Copy,
  Send,
  Mail,
  Users,
  FileText,
  Settings
} from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'welcome' | 'application' | 'approval' | 'rejection' | 'reminder' | 'custom';
  isActive: boolean;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

const AdminEmailTemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('templates');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    type: 'custom' as EmailTemplate['type'],
    isActive: true
  });

  useEffect(() => {
    // Load templates (mock data for now)
    const mockTemplates: EmailTemplate[] = [
      {
        id: '1',
        name: 'Welcome Email',
        subject: 'Welcome to ViaLifeCoach Academy',
        content: 'Dear {{firstName}},\n\nWelcome to ViaLifeCoach Academy! We\'re excited to have you join our community.\n\nBest regards,\nViaLifeCoach Team',
        type: 'welcome',
        isActive: true,
        variables: ['firstName'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        name: 'Application Received',
        subject: 'Your Application Has Been Received',
        content: 'Dear {{firstName}},\n\nWe have received your application for {{programName}}. We will review it and get back to you soon.\n\nBest regards,\nViaLifeCoach Team',
        type: 'application',
        isActive: true,
        variables: ['firstName', 'programName'],
        createdAt: '2024-01-16T10:00:00Z',
        updatedAt: '2024-01-16T10:00:00Z'
      }
    ];
    setTemplates(mockTemplates);
  }, []);

  const handleCreateTemplate = () => {
    setIsCreating(true);
    setSelectedTemplate(null);
    setFormData({
      name: '',
      subject: '',
      content: '',
      type: 'custom',
      isActive: true
    });
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      subject: template.subject,
      content: template.content,
      type: template.type,
      isActive: template.isActive
    });
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleSaveTemplate = () => {
    if (isCreating) {
      const newTemplate: EmailTemplate = {
        id: Date.now().toString(),
        ...formData,
        variables: extractVariables(formData.content),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setTemplates([...templates, newTemplate]);
    } else if (selectedTemplate) {
      const updatedTemplates = templates.map(t =>
        t.id === selectedTemplate.id
          ? {
              ...t,
              ...formData,
              variables: extractVariables(formData.content),
              updatedAt: new Date().toISOString()
            }
          : t
      );
      setTemplates(updatedTemplates);
    }

    setIsEditing(false);
    setIsCreating(false);
    setSelectedTemplate(null);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    if (selectedTemplate?.id === id) {
      setSelectedTemplate(null);
      setIsEditing(false);
    }
  };

  const extractVariables = (content: string): string[] => {
    const matches = content.match(/\{\{(\w+)\}\}/g);
    return matches ? matches.map(match => match.replace(/[{}]/g, '')) : [];
  };

  const getTypeColor = (type: EmailTemplate['type']) => {
    const colors = {
      welcome: 'bg-green-100 text-green-800',
      application: 'bg-blue-100 text-blue-800',
      approval: 'bg-emerald-100 text-emerald-800',
      rejection: 'bg-red-100 text-red-800',
      reminder: 'bg-yellow-100 text-yellow-800',
      custom: 'bg-gray-100 text-gray-800'
    };
    return colors[type];
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Email Templates</h1>
          <p className="text-gray-600">Manage email templates for automated communications</p>
        </div>
        <Button onClick={handleCreateTemplate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Template
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge className={getTypeColor(template.type)}>
                          {template.type}
                        </Badge>
                        {template.isActive ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                        )}
                      </div>
                      <CardDescription>{template.subject}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTemplate(template)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      <strong>Variables:</strong> {template.variables.join(', ') || 'None'}
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Last updated:</strong> {new Date(template.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="editor" className="space-y-4">
          {(isEditing || isCreating) && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {isCreating ? 'Create New Template' : 'Edit Template'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Template Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter template name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Template Type</Label>
                    <Select value={formData.type} onValueChange={(value: EmailTemplate['type']) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="welcome">Welcome</SelectItem>
                        <SelectItem value="application">Application</SelectItem>
                        <SelectItem value="approval">Approval</SelectItem>
                        <SelectItem value="rejection">Rejection</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Enter email subject"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Enter email content. Use {{variableName}} for dynamic content."
                    rows={10}
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Available variables: {'{firstName}'}, {'{lastName}'}, {'{email}'}, {'{programName}'}, {'{date}'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveTemplate} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Template
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setIsCreating(false);
                      setSelectedTemplate(null);
                    }}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!isEditing && !isCreating && (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Template Selected</h3>
                  <p className="text-gray-600 mb-4">Select a template to edit or create a new one</p>
                  <Button onClick={handleCreateTemplate}>Create New Template</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure email sending preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fromEmail">From Email</Label>
                <Input
                  id="fromEmail"
                  placeholder="noreply@vialifecoach.com"
                  defaultValue="noreply@vialifecoach.com"
                />
              </div>
              <div>
                <Label htmlFor="fromName">From Name</Label>
                <Input
                  id="fromName"
                  placeholder="ViaLifeCoach Academy"
                  defaultValue="ViaLifeCoach Academy"
                />
              </div>
              <div>
                <Label htmlFor="replyTo">Reply-To Email</Label>
                <Input
                  id="replyTo"
                  placeholder="support@vialifecoach.com"
                  defaultValue="support@vialifecoach.com"
                />
              </div>
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminEmailTemplatesPage;
