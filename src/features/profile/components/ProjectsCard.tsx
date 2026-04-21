import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Info, Eye } from 'lucide-react';
import { ProjectFormDialog } from '../forms/ProjectFormDialog';

const ProjectsCard: React.FC = () => {
  const handleAddProject = () => {
    console.log('Adding project');
  };

  const handleBrowseProjects = () => {
    console.log('Browsing projects');
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
            <Info className="h-4 w-4 text-gray-400" />
          </div>
          <ProjectFormDialog/> 
        </div>
        
        <div className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="text-blue-800">
              It looks like you have 1 project that hasn't been added yet.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-2">
                Showcase your skills to recruiters with job-relevant projects
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Add projects here to demonstrate your technical expertise and ability to solve real-world problems.
              </p>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleBrowseProjects}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Eye className="h-4 w-4 mr-2" />
              Browse Projects
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectsCard;