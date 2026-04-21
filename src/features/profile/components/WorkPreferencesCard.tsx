import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit2, User } from 'lucide-react';

const roles = [
  'Machine Learning Engineer',
  'Data Scientist', 
  'Back End Developer / Engineer',
  'Full Stack Developer'
];

const WorkPreferencesCard: React.FC = () => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([
    'Machine Learning Engineer',
    'Data Scientist',
    'Back End Developer / Engineer', 
    'Full Stack Developer'
  ]);

  const handleRoleToggle = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Work preferences</h2>
          <Button variant="ghost" size="sm" className="p-2">
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-4">Desired roles</h3>
            <div className="space-y-3">
              {roles.map((role) => (
                <div key={role} className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <Checkbox
                    id={role}
                    checked={selectedRoles.includes(role)}
                    onCheckedChange={() => handleRoleToggle(role)}
                  />
                  <label
                    htmlFor={role}
                    className="text-sm text-gray-700 cursor-pointer flex-1"
                  >
                    {role}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkPreferencesCard;