import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { WorkHistoryFormDialog } from '../forms/WorkHistoryFormDialog';

const WorkHistoryCard: React.FC = () => {
  const handleAddWorkExperience = () => {
    console.log('Adding work experience');
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Work history</h2>
          <WorkHistoryFormDialog/>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Add your past work experience here. If you're just starting out, you can add internships 
            or volunteer experience instead.
          </p>
          
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
            <div className="space-y-2">
              <p className="text-gray-500">No work experience added yet</p>
              <Button 
                variant="outline" 
                onClick={handleAddWorkExperience}
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add your first work experience
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkHistoryCard;