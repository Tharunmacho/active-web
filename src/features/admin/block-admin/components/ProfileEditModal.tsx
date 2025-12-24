import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Eye, EyeOff, User, Camera } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileEditModalProps {
    open: boolean;
    onClose: () => void;
    adminData: any;
    onProfileUpdate: () => void;
}

const ProfileEditModal = ({ open, onClose, adminData, onProfileUpdate }: ProfileEditModalProps) => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        avatarUrl: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Update form when adminData changes
    useEffect(() => {
        if (adminData) {
            setFormData(prev => ({
                ...prev,
                fullName: adminData.fullName || "",
                email: adminData.email || "",
                avatarUrl: adminData.avatarUrl || ""
            }));
            setAvatarPreview(adminData.avatarUrl || "");
        }
    }, [adminData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image size should be less than 2MB");
                return;
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                toast.error("Please select an image file");
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setAvatarPreview(base64String);
                setFormData(prev => ({
                    ...prev,
                    avatarUrl: base64String
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateProfileForm = () => {
        if (!formData.fullName.trim()) {
            toast.error("Please enter your full name");
            return false;
        }

        if (!formData.email.trim()) {
            toast.error("Please enter your email");
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return false;
        }

        return true;
    };

    const validatePasswordForm = () => {
        if (!formData.currentPassword) {
            toast.error("Please enter your current password");
            return false;
        }

        if (!formData.newPassword) {
            toast.error("Please enter a new password");
            return false;
        }

        if (formData.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return false;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New password and confirm password do not match");
            return false;
        }

        if (formData.currentPassword === formData.newPassword) {
            toast.error("New password must be different from current password");
            return false;
        }

        return true;
    };

    const handleUpdateProfile = async () => {
        if (!validateProfileForm()) {
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('adminToken');

            if (!token) {
                toast.error("Authentication token not found. Please login again.");
                return;
            }

            const response = await fetch('http://localhost:4000/api/admin/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    avatarUrl: formData.avatarUrl
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Update localStorage with new email
                localStorage.setItem('userEmail', formData.email);
                localStorage.setItem('userName', formData.fullName);
                
                // Trigger parent refresh FIRST
                await onProfileUpdate();
                
                toast.success("Profile updated successfully!");
                
                // Close modal after refresh
                setTimeout(() => {
                    onClose();
                }, 500);
            } else {
                toast.error(data.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("An error occurred while updating profile");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (!validatePasswordForm()) {
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('adminToken');

            if (!token) {
                toast.error("Authentication token not found. Please login again.");
                return;
            }

            const response = await fetch('http://localhost:4000/api/admin/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success("Password updated successfully! Please login with your new password.");
                
                // Clear password fields
                setFormData(prev => ({
                    ...prev,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                }));

                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                toast.error(data.message || "Failed to update password");
            }
        } catch (error) {
            console.error("Error updating password:", error);
            toast.error("An error occurred while updating password");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        // Reset form on close
        if (adminData) {
            setFormData({
                fullName: adminData.fullName || "",
                email: adminData.email || "",
                avatarUrl: adminData.avatarUrl || "",
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
            setAvatarPreview(adminData.avatarUrl || "");
        }
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
        onClose();
    };

    const avatarInitials = formData.fullName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'AD';

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Lock className="w-6 h-6 text-blue-600" />
                        Update Profile
                    </DialogTitle>
                    <DialogDescription>
                        Update your profile information and password
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative">
                            <Avatar className="w-24 h-24 ring-4 ring-blue-100 cursor-pointer" onClick={handleAvatarClick}>
                                {avatarPreview ? (
                                    <AvatarImage src={avatarPreview} className="object-cover" />
                                ) : (
                                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-2xl">
                                        {avatarInitials}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <button
                                type="button"
                                onClick={handleAvatarClick}
                                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                        <p className="text-xs text-gray-500 text-center">
                            Click avatar or camera icon to change photo<br />
                            (Max 2MB, JPG/PNG)
                        </p>
                    </div>

                    {/* Profile Information Section */}
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            Profile Information
                        </h3>
                        
                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Full Name
                            </Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <Button
                            type="button"
                            onClick={handleUpdateProfile}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? "Updating Profile..." : "Update Profile"}
                        </Button>
                    </div>

                    {/* Change Password Section */}
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Lock className="w-5 h-5 text-blue-600" />
                            Change Password
                        </h3>

                        {/* Current Password */}
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword" className="flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Current Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    placeholder="Enter current password"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="newPassword" className="flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                New Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500">Must be at least 6 characters</p>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Confirm New Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="button"
                            onClick={handleUpdatePassword}
                            className="w-full bg-purple-600 hover:bg-purple-700"
                            disabled={loading}
                        >
                            {loading ? "Updating Password..." : "Update Password"}
                        </Button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1"
                            disabled={loading}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProfileEditModal;
