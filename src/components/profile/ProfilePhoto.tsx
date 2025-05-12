
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types';

interface ProfilePhotoProps {
  user: User | null;
  photoPreview: string | null;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ 
  user, 
  photoPreview, 
  handlePhotoChange 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Photo</CardTitle>
        <CardDescription>Update your profile picture</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <Avatar className="h-32 w-32 mb-4">
          <AvatarImage src={photoPreview || undefined} />
          <AvatarFallback className="text-2xl">{user?.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="space-y-2 w-full">
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
          />
          <p className="text-xs text-gray-500 text-center">
            JPG or PNG. Maximum 5MB.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePhoto;
