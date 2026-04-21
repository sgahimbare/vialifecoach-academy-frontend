import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { AdditionalInfoFormDialog } from '../forms/AdditionalInfoFormDialog';

const AdditionalInfoCard: React.FC = () => {
  const [qualifications, setQualifications] = useState('');
  const [externalLink, setExternalLink] = useState('');

  const handleAddInfo = () => {
    console.log('Adding additional info:', { qualifications, externalLink });
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Additional info</h2>
        
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Help recruiters get to know you better by describing what makes you a great candidate and sharing other links.
            </p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="qualifications" className="text-sm font-medium text-gray-700">
                  Describe your qualifications
                </Label>
                <Textarea
                  id="qualifications"
                  placeholder="Tell recruiters what makes you a great candidate..."
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  className="mt-2"
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="external-link" className="text-sm font-medium text-gray-700">
                  External links (e.g., GitHub, portfolio)
                </Label>
                <Input
                  id="external-link"
                  type="url"
                  placeholder="https://github.com/username"
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
          
          {/* <Button 
            onClick={handleAddInfo}
            className="w-full"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add additional info
          </Button> */}
          <AdditionalInfoFormDialog/>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdditionalInfoCard;