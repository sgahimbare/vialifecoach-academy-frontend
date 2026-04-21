import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, GraduationCap, Award, Edit2, Info } from 'lucide-react';
import { EducationFormDialog } from '../forms/EducationFormDialog';

const EducationCredentialsCard: React.FC = () => {
  const handleAddEducation = () => {
    console.log('Adding education');
  };

  const handleBrowseCertificates = () => {
    console.log('Browsing professional certificates');
  };

  return (
    <div className="space-y-6">
      {/* Education Section */}
      <Card className="w-full">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Education</h2>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-5 w-5 text-gray-600" />
              <span className="text-gray-900 font-medium">Bachelor's degree</span>
            </div>
            <EducationFormDialog/>
          </div>
        </CardContent>
      </Card>

      {/* Credentials Section */}
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold text-gray-900">Credentials</h2>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
            {/* <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button> */}
            <EducationFormDialog/>
          </div>
          
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-4">
                Get job-ready with role-based training from industry-leading companies like Google, Meta, and IBM.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="bg-white border border-gray-200">
                  <img 
                    src="https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=20&h=20&fit=crop&crop=face" 
                    alt="Google" 
                    className="w-4 h-4 mr-1 rounded"
                  />
                  Google
                </Badge>
                <Badge variant="secondary" className="bg-white border border-gray-200">
                  <img 
                    src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=20&h=20&fit=crop&crop=face" 
                    alt="Meta" 
                    className="w-4 h-4 mr-1 rounded"
                  />
                  Meta
                </Badge>
                <Badge variant="secondary" className="bg-white border border-gray-200">
                  <img 
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=20&h=20&fit=crop&crop=face" 
                    alt="IBM" 
                    className="w-4 h-4 mr-1 rounded"
                  />
                  IBM
                </Badge>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleBrowseCertificates}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Award className="h-4 w-4 mr-2" />
                Browse Professional Certificates
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EducationCredentialsCard;