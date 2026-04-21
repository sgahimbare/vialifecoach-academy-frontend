import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Share2, Edit2 } from 'lucide-react';
import { PersonalDetails } from '../forms/PersonalDetailsFormDialog';

const ProfileVisibilityCard: React.FC = () => {
  const [profileVisible, setProfileVisible] = useState(true);

  const handleShareProfile = () => {
    // Handle share profile logic
    console.log('Sharing profile link');
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Personal details</h2>
          <PersonalDetails/>
        </div>
        
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Avatar */}
          <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-3xl font-bold">m</span>
          </div>
          
          {/* User Name */}
          <h3 className="text-xl font-semibold text-gray-900">master programmer</h3>
          
          {/* Share Profile Button */}
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleShareProfile}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share profile link
          </Button>
          
          {/* Profile Visibility Toggle */}
          <div className="flex items-center space-x-2 w-full justify-center">
            <Switch
              id="profile-visibility"
              checked={profileVisible}
              onCheckedChange={setProfileVisible}
            />
            <Label 
              htmlFor="profile-visibility" 
              className="text-sm text-blue-600 cursor-pointer"
            >
              Update profile visibility
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileVisibilityCard;