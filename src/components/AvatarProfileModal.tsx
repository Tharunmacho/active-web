import React, { useState, useEffect } from 'react';
import { X, Camera, User, Mail, Building2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AvatarProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail?: string;
  companyName?: string;
}

export default function AvatarProfileModal({
  isOpen,
  onClose,
  userName,
  userEmail,
  companyName,
}: AvatarProfileModalProps) {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Load profile photo from localStorage
    const savedPhoto = localStorage.getItem('userProfilePhoto');
    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePhoto(base64String);
        localStorage.setItem('userProfilePhoto', base64String);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    localStorage.removeItem('userProfilePhoto');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div
          className="p-6 relative"
          style={{
            background: 'linear-gradient(135deg, #0f766e 0%, #134e4a 100%)',
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-white mb-2">Profile Details</h2>
          <p className="text-teal-200 text-sm">View and manage your profile</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Profile Photo Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <Avatar className="w-32 h-32 ring-4 ring-teal-100">
                {profilePhoto ? (
                  <AvatarImage src={profilePhoto} className="object-cover" />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-teal-600 to-teal-800 text-white text-3xl font-bold">
                    {userName
                      ? userName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                      : 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 bg-teal-600 hover:bg-teal-700 text-white rounded-full p-2 cursor-pointer shadow-lg transition-all group-hover:scale-110"
              >
                <Camera className="w-5 h-5" />
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                />
              </label>
            </div>
            {profilePhoto && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemovePhoto}
                className="mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Remove Photo
              </Button>
            )}
            {uploading && (
              <p className="text-sm text-gray-500 mt-2">Uploading...</p>
            )}
          </div>

          {/* User Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Full Name</p>
                <p className="font-semibold text-gray-900">{userName || 'Not set'}</p>
              </div>
            </div>

            {userEmail && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-semibold text-gray-900 text-sm break-all">
                    {userEmail}
                  </p>
                </div>
              </div>
            )}

            {companyName && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Company</p>
                  <p className="font-semibold text-gray-900">{companyName}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Member Since</p>
                <p className="font-semibold text-gray-900">
                  {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                onClose();
                window.location.href = '/member/profile';
              }}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
