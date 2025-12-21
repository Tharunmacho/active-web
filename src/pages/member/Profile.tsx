import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Menu, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import MemberSidebar from "./MemberSidebar";
import { INDIA_DISTRICTS } from "@/data/india-districts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ProfileData = {
  // Step 1: Personal, Account, Demographic
  name: string;
  block?: string;
  state?: string;
  district?: string;
  city?: string;
  phone: string;
  email: string;
  currentPassword?: string;
  password?: string;
  confirmPassword?: string;
  religion?: string;
  socialCategory?: string;
  
  // Step 2: Business Information
  doingBusiness?: string;
  organization?: string;
  constitution?: string;
  businessTypes?: string[];
  businessYear?: string;
  employees?: string;
  chamber?: string;
  chamberDetails?: string;
  govtOrgs?: string[];
  
  // Step 3: Financial & Compliance
  pan?: string;
  gst?: string;
  udyam?: string;
  filedITR?: string;
  itrYears?: string;
  turnoverRange?: string;
  turnover1?: string;
  turnover2?: string;
  turnover3?: string;
  govtSchemes?: string;
  scheme1?: string;
  scheme2?: string;
  scheme3?: string;
  
  // Step 4: Declaration
  sisterConcerns?: string;
  companyNames?: string;
  declarationAccepted?: boolean;
};

const defaultProfile: ProfileData = {
  name: "",
  block: "",
  state: "",
  district: "",
  city: "",
  phone: "",
  email: "",
  currentPassword: "",
  password: "",
  confirmPassword: "",
  religion: "",
  socialCategory: "",
  doingBusiness: "",
  organization: "",
  constitution: "",
  businessTypes: [],
  businessYear: "",
  employees: "",
  chamber: "",
  chamberDetails: "",
  govtOrgs: [],
  pan: "",
  gst: "",
  udyam: "",
  filedITR: "",
  itrYears: "",
  turnoverRange: "",
  turnover1: "",
  turnover2: "",
  turnover3: "",
  govtSchemes: "",
  scheme1: "",
  scheme2: "",
  scheme3: "",
  sisterConcerns: "",
  companyNames: "",
  declarationAccepted: false,
};

export default function Profile() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [districts, setDistricts] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [hasExistingProfile, setHasExistingProfile] = useState(false);
  const [companyNames, setCompanyNames] = useState<string[]>([""]);
  const [showSeparateFields, setShowSeparateFields] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProfileData>({ defaultValues: defaultProfile });

  // Auto-save disabled - Data is saved manually when clicking Save/Next buttons

  // Load profile data from backend on mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // If authenticated, load from backend
        if (!token) return;

        console.log("Fetching personal form data...");
        // Load personal form data
        const personalFormResponse = await fetch("http://localhost:4000/api/personal-form", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        console.log("Personal form response status:", personalFormResponse.status);
        
        if (personalFormResponse.ok) {
          const personalResult = await personalFormResponse.json();
          console.log("Personal form result:", personalResult);
          
          if (personalResult.data) {
            const formData = personalResult.data;
            console.log("Loading personal form from backend:", formData);
            
            setHasExistingProfile(true);
            setIsLocked(formData.isLocked || false);
            
            const formValues = {
              name: formData.name || "",
              phone: formData.phoneNumber || "",
              email: formData.email || "",
              state: formData.state || "",
              district: formData.district || "",
              block: formData.block || "",
              city: formData.city || "",
              religion: formData.religion || "",
              socialCategory: formData.socialCategory || "",
              password: "",
              confirmPassword: "",
              currentPassword: ""
            };
            
            console.log("Setting form values:", formValues);
            reset(formValues);

            // Load districts if state exists
            if (formData.state) {
              console.log("Setting districts for state:", formData.state);
              setDistricts(INDIA_DISTRICTS[formData.state] ?? []);
              
              // Load blocks if district exists
              if (formData.district) {
                const blocksUrl = `http://localhost:4000/api/locations/states/${encodeURIComponent(formData.state)}/districts/${encodeURIComponent(formData.district)}/blocks`;
                console.log("Fetching blocks from:", blocksUrl);
                
                fetch(blocksUrl)
                  .then(res => res.ok ? res.json() : { data: [] })
                  .then(result => {
                    console.log("Blocks loaded:", result.data);
                    setBlocks(result.data || []);
                  })
                  .catch(err => {
                    console.error("Error fetching blocks:", err);
                    setBlocks([]);
                  });
              }
            }
            return;
          }
        }

        // Load business form data
        console.log("Fetching business form data...");
        const businessFormResponse = await fetch("http://localhost:4000/api/business-form", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        console.log("Business form response status:", businessFormResponse.status);
        
        if (businessFormResponse.ok) {
          const businessResult = await businessFormResponse.json();
          console.log("Business form result:", businessResult);
          
          if (businessResult.data) {
            const businessData = businessResult.data;
            console.log("Loading business form from backend:", businessData);
            
            reset(prev => ({
              ...prev,
              doingBusiness: businessData.doingBusiness || "",
              organization: businessData.organization || "",
              constitution: businessData.constitution || "",
              businessTypes: businessData.businessTypes || [],
              businessYear: businessData.businessYear || "",
              employees: businessData.employees || "",
              chamber: businessData.chamber || "",
              chamberDetails: businessData.chamberDetails || "",
              govtOrgs: businessData.govtOrgs || []
            }));
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    loadUserProfile();
  }, [reset]);

  // Load districts when state changes
  const selectedState = watch("state");
  useEffect(() => {
    if (selectedState) {
      setDistricts(INDIA_DISTRICTS[selectedState] ?? []);
    } else {
      setDistricts([]);
    }
  }, [selectedState]);

  // Load blocks when state and district change
  const selectedDistrict = watch("district");
  useEffect(() => {
    const loadBlocks = async () => {
      if (selectedState && selectedDistrict) {
        try {
          const url = `http://localhost:4000/api/locations/states/${encodeURIComponent(selectedState)}/districts/${encodeURIComponent(selectedDistrict)}/blocks`;
          console.log("🔍 Loading blocks for:", selectedState, selectedDistrict);
          console.log("📡 Blocks API URL:", url);
          
          const response = await fetch(url);
          console.log("📊 Blocks API response status:", response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log("✅ Blocks API success! Data:", data);
            console.log("📦 Number of blocks:", data.data?.length || 0);
            if (data.data && data.data.length > 0) {
              console.log("🏘️ First 5 blocks:", data.data.slice(0, 5));
            }
            setBlocks(data.data || []);
          } else {
            const errorText = await response.text();
            console.error("❌ Blocks API failed:", response.statusText, errorText);
            setBlocks([]);
          }
        } catch (error) {
          console.error("❌ Error loading blocks:", error);
          setBlocks([]);
        }
      } else {
        console.log("⚠️ Clearing blocks - state:", selectedState, "district:", selectedDistrict);
        setBlocks([]);
      }
    };
    loadBlocks();
  }, [selectedState, selectedDistrict]);

  const saveCurrentStepData = (data: ProfileData) => {
    const currentData = JSON.parse(localStorage.getItem("userProfile") || "{}");
    const updatedData = { ...currentData, ...data };
    localStorage.setItem("userProfile", JSON.stringify(updatedData));
    localStorage.setItem("registrationData", JSON.stringify(updatedData));
    return updatedData;
  };

  const saveStep1 = async (data: ProfileData) => {
    // Validate all required fields
    if (!data.name || !data.name.trim()) {
      toast.error("Name is required");
      return false;
    }

    if (!data.phone || !data.phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }

    if (!data.email || !data.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!data.state || !data.state.trim()) {
      toast.error("State is required");
      return false;
    }

    if (!data.district || !data.district.trim()) {
      toast.error("District is required");
      return false;
    }

    if (!data.block || !data.block.trim()) {
      toast.error("Block is required");
      return false;
    }

    if (!data.city || !data.city.trim()) {
      toast.error("City is required");
      return false;
    }

    if (!data.religion || !data.religion.trim()) {
      toast.error("Religion is required");
      return false;
    }

    if (!data.socialCategory || !data.socialCategory.trim()) {
      toast.error("Social Category is required");
      return false;
    }

    try {
      const token = localStorage.getItem("token");
      
      // Check if user wants to change password
      const wantsToChangePassword = data.password && data.password.trim() !== "";
      
      if (wantsToChangePassword && token) {
        // Validate password fields
        if (data.password.length < 6) {
          toast.error("New password must be at least 6 characters");
          return false;
        }

        if (data.password !== data.confirmPassword) {
          toast.error("New password and confirm password do not match");
          return false;
        }

        // Current password is required when changing password
        if (!data.currentPassword || data.currentPassword.trim() === "") {
          toast.error("Please enter your current password to change it");
          return false;
        }

        console.log("Attempting password change...");
        const passwordResponse = await fetch("http://localhost:4000/api/auth/change-password", {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            currentPassword: data.currentPassword,
            newPassword: data.password
          })
        });

        const passwordResult = await passwordResponse.json();
        console.log("Password change response:", passwordResult);

        if (!passwordResponse.ok) {
          toast.error(passwordResult.message || "Failed to update password");
          return false;
        }

        toast.success("Password updated successfully");
      }

      if (token) {
        // Save Step 1 fields to "additional form for personal information 1" collection
        const step1Data = {
          name: data.name,
          phoneNumber: data.phone,
          email: data.email,
          state: data.state,
          district: data.district,
          block: data.block,
          city: data.city,
          religion: data.religion,
          socialCategory: data.socialCategory,
          isLocked: true
        };

        const saveResponse = await fetch("http://localhost:4000/api/personal-form", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(step1Data)
        });

        if (!saveResponse.ok) {
          toast.error("Failed to save profile");
          return false;
        }
        
        // Mark that profile now exists and lock it
        setHasExistingProfile(true);
        setIsLocked(true);
      }

      saveCurrentStepData(data);
      toast.success(hasExistingProfile ? "Profile updated successfully!" : "Profile saved successfully!");
      
      return true;
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
      return false;
    }
  };

  const handleNext = async () => {
    const data = watch();
    if (currentStep === 1) {
      const saved = await saveStep1(data);
      if (saved) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (data.doingBusiness === "no") {
        // Check if declaration is accepted
        if (!data.declarationAccepted) {
          toast.error("Please accept the declaration to continue");
          return;
        }
        
        // Save business form with "no" status (Aspirant)
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Authentication required");
          return;
        }
        
        try {
          console.log("💾 Saving business form for ASPIRANT (doingBusiness: no)");
          
          const businessResponse = await fetch("http://localhost:4000/api/business-form", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ doingBusiness: "no" })
          });
          
          console.log("📡 Business form save response status:", businessResponse.status);
          const businessResult = await businessResponse.json();
          console.log("📥 Business form save result:", businessResult);
          
          if (!businessResponse.ok) {
            console.error("❌ Failed to save business form:", businessResult);
            toast.error("Failed to save business information");
            return;
          }
          
          console.log("✅ Business form saved successfully for aspirant!");
          
          // Also save declaration form for aspirant
          console.log("💾 Saving declaration form for ASPIRANT");
          
          const declarationResponse = await fetch("http://localhost:4000/api/declaration-form", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              remarks: "Aspirant application",
              declarationAccepted: true
            })
          });
          
          console.log("📡 Declaration form save response status:", declarationResponse.status);
          const declarationResult = await declarationResponse.json();
          console.log("📥 Declaration form save result:", declarationResult);
          
          if (!declarationResponse.ok) {
            console.error("❌ Failed to save declaration:", declarationResult);
            toast.error("Failed to submit declaration");
            return;
          }
          
          console.log("✅ Declaration saved successfully for aspirant!");
          
        } catch (error) {
          console.error("❌ Error saving forms:", error);
          toast.error("Failed to save information");
          return;
        }
        
        toast.success("Application submitted successfully!");
        saveCurrentStepData(data);
        
        // Generate application ID and redirect to application submitted screen
        const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        localStorage.setItem('applicationId', applicationId);
        navigate('/member/application-submitted');
        return;
      } else if (data.doingBusiness === "yes") {
        if (!data.organization || !data.constitution || !data.businessTypes?.length) {
          toast.error("Please fill in all required business information");
          return;
        }
        
        // Save business form to business_profiles collection
        try {
          const token = localStorage.getItem("token");
          if (token) {
            const businessData = {
              doingBusiness: data.doingBusiness,
              organization: data.organization,
              constitution: data.constitution,
              businessTypes: data.businessTypes,
              businessActivities: data.businessYear, // Using businessYear field for activities
              businessYear: data.businessYear,
              employees: data.employees,
              chamber: data.chamber,
              chamberDetails: data.chamberDetails || "",
              govtOrgs: data.govtOrgs || []
            };
            
            console.log("📤 Submitting business form data:", businessData);
            
            console.log("🚀 Sending POST request to /api/business-form");
            
            const response = await fetch("http://localhost:4000/api/business-form", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify(businessData)
            });
            
            console.log("📡 Response status:", response.status);
            const result = await response.json();
            console.log("📥 Response data:", result);
            
            if (!response.ok) {
              console.error("❌ Failed to save:", result);
              toast.error("Failed to save business information");
              return;
            }
            
            console.log("✅ Business form saved successfully!");
            toast.success("Business information saved!");
          }
        } catch (error) {
          console.error("Error saving business form:", error);
          toast.error("Failed to save business information");
          return;
        }
        
        saveCurrentStepData(data);
        setCurrentStep(3);
      } else {
        toast.error("Please select if you are doing business");
      }
    } else if (currentStep === 3) {
      // Save financial form to "additional form for financial 3" collection
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const financialData = {
            pan: data.pan,
            gst: data.gst,
            udyam: data.udyam,
            filedITR: data.filedITR,
            itrYears: data.itrYears,
            turnoverRange: data.turnoverRange,
            turnover1: data.turnover1,
            turnover2: data.turnover2,
            turnover3: data.turnover3,
            govtSchemes: data.govtSchemes,
            scheme1: data.scheme1 || "",
            scheme2: data.scheme2 || "",
            scheme3: data.scheme3 || ""
          };
          
          const response = await fetch("http://localhost:4000/api/financial-form", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(financialData)
          });
          
          if (!response.ok) {
            toast.error("Failed to save financial information");
            return;
          }
          
          toast.success("Financial information saved!");
        }
      } catch (error) {
        console.error("Error saving financial form:", error);
        toast.error("Failed to save financial information");
        return;
      }
      
      saveCurrentStepData(data);
      setCurrentStep(4);
    }
  };

  const handleFinalSubmit = async () => {
    const data = watch();
    saveCurrentStepData(data);

    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Save Step 4 to "additional form for declaration 4" collection
        const declarationData = {
          sisterConcerns: data.sisterConcerns || "",
          companyNames: companyNames.filter(name => name.trim() !== ""),
          declarationAccepted: true
        };

        const response = await fetch("http://localhost:4000/api/declaration-form", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(declarationData)
        });

        if (!response.ok) {
          toast.error("Failed to submit declaration");
          return;
        }
      }
    } catch (error) {
      console.error("Error saving declaration:", error);
      toast.error("Failed to submit application");
      return;
    }

    toast.success("Application submitted successfully!");
    
    // Generate application ID and store it, then redirect to application submitted screen
    const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    localStorage.setItem('applicationId', applicationId);
    navigate('/member/application-submitted');
  };

  const toggleBusinessType = (type: string) => {
    const currentTypes = watch("businessTypes") || [];
    const updated = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    return updated;
  };

  const toggleGovtOrg = (org: string) => {
    const currentOrgs = watch("govtOrgs") || [];
    const updated = currentOrgs.includes(org)
      ? currentOrgs.filter(o => o !== org)
      : [...currentOrgs, org];
    return updated;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <MemberSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden">
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold">My Profile</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    s <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {s}
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-gray-600">Step {currentStep} of 4</p>
            </div>

            <Card className="rounded-2xl border-0 shadow-lg">
              <div className="bg-blue-600 text-white py-4 px-6 rounded-t-2xl">
                <h2 className="text-xl font-bold">ACTIV</h2>
              </div>

              <CardContent className="p-6">
                {isLocked && currentStep === 1 && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                    <p className="text-sm text-green-800">
                      ✓ Profile saved successfully
                    </p>
                    <Button
                      type="button"
                      onClick={() => setIsLocked(false)}
                      variant="outline"
                      size="sm"
                      className="border-green-600 text-green-600 hover:bg-green-50"
                    >
                      Edit Profile
                    </Button>
                  </div>
                )}
                
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Personal details</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            placeholder="Enter your full name"
                            {...register("name", { required: true })}
                            className="mt-1"
                            disabled={isLocked}
                          />
                          {errors.name && <p className="text-red-500 text-sm mt-1">Name is required</p>}
                        </div>

                        <div>
                          <Label htmlFor="state">State *</Label>
                          <Controller
                            name="state"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Select 
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  const currentData = watch();
                                  reset({ ...currentData, state: value, district: '', block: '' });
                                }} 
                                value={field.value}
                                disabled={isLocked}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.keys(INDIA_DISTRICTS).map((state) => (
                                    <SelectItem key={state} value={state}>
                                      {state}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.state && <p className="text-red-500 text-sm mt-1">State is required</p>}
                        </div>

                        <div>
                          <Label htmlFor="district">District *</Label>
                          <Controller
                            name="district"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Select 
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  const currentData = watch();
                                  reset({ ...currentData, district: value, block: '' });
                                }} 
                                value={field.value} 
                                disabled={!selectedState || isLocked}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder={selectedState ? "Select district" : "Select state first"} />
                                </SelectTrigger>
                                <SelectContent>
                                  {districts.map((district) => (
                                    <SelectItem key={district} value={district}>
                                      {district}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.district && <p className="text-red-500 text-sm mt-1">District is required</p>}
                        </div>

                        <div>
                          <Label htmlFor="block">Block *</Label>
                          <Controller
                            name="block"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value} disabled={!selectedDistrict || isLocked}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder={selectedDistrict ? "Select block" : "Select district first"} />
                                </SelectTrigger>
                                <SelectContent>
                                  {blocks.length > 0 ? (
                                    blocks.map((block) => (
                                      <SelectItem key={block} value={block}>
                                        {block}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <div className="px-2 py-1.5 text-sm text-gray-500">No blocks available</div>
                                  )}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.block && <p className="text-red-500 text-sm mt-1">Block is required</p>}
                        </div>

                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            placeholder="Enter city"
                            {...register("city", { required: true })}
                            className="mt-1"
                            disabled={isLocked}
                          />
                          {errors.city && <p className="text-red-500 text-sm mt-1">City is required</p>}
                        </div>

                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="Enter phone number"
                            {...register("phone", { required: true })}
                            className="mt-1"
                            disabled={isLocked}
                          />
                          {errors.phone && <p className="text-red-500 text-sm mt-1">Phone number is required</p>}
                        </div>

                        <div>
                          <Label htmlFor="email">Email ID *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter email"
                            {...register("email", { required: true })}
                            className="mt-1"
                            disabled={isLocked}
                          />
                          {errors.email && <p className="text-red-500 text-sm mt-1">Email is required</p>}
                        </div>

                        <div>
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <div className="relative mt-1">
                            <Input
                              id="currentPassword"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your current login password"
                              {...register("currentPassword")}
                              disabled={isLocked}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={isLocked}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Required only if you want to change your password. Enter the password you use to login.</p>
                        </div>

                        <div>
                          <Label htmlFor="password">New Password</Label>
                          <div className="relative mt-1">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter new password (optional)"
                              {...register("password")}
                              disabled={isLocked}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={isLocked}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Leave blank to keep your current password.</p>
                        </div>

                        <div>
                          <Label htmlFor="confirmPassword">Confirm Password</Label>
                          <div className="relative mt-1">
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm new password"
                              {...register("confirmPassword")}
                              disabled={isLocked}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              disabled={isLocked}
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6 pb-6">
                      <Button
                        type="button"
                        onClick={async () => {
                          const data = watch();
                          await saveStep1(data);
                        }}
                        className={`w-full ${isLocked ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                        disabled={isLocked}
                      >
                        {isLocked ? 'Profile Saved ✓' : (hasExistingProfile ? 'Update Personal Details' : 'Save Personal Details')}
                      </Button>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">Demographic details</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="religion">Religion</Label>
                          <Input
                            id="religion"
                            placeholder="Enter religion"
                            {...register("religion")}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="socialCategory">Social Category</Label>
                          <Controller
                            name="socialCategory"
                            control={control}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="General">General</SelectItem>
                                  <SelectItem value="OBC">OBC</SelectItem>
                                  <SelectItem value="SC">SC</SelectItem>
                                  <SelectItem value="ST">ST</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Next &gt;
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold mb-4">Business Information</h3>
                    
                    <div>
                      <Label className="text-sm font-medium">Doing Business</Label>
                      <div className="flex gap-6 mt-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="yes"
                            {...register("doingBusiness", { required: true })}
                          />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="no"
                            {...register("doingBusiness", { required: true })}
                          />
                          <span>No</span>
                        </label>
                      </div>
                    </div>

                    {watch("doingBusiness") === "yes" && (
                      <>
                        <div>
                          <Label htmlFor="organization">Name of the Organization</Label>
                          <Input
                            id="organization"
                            placeholder="Enter organization name"
                            {...register("organization")}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="constitution">Constitution of the Company</Label>
                          <Controller
                            name="constitution"
                            control={control}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select constitution type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Proprietorship">Proprietorship</SelectItem>
                                  <SelectItem value="Partnership">Partnership</SelectItem>
                                  <SelectItem value="Private Limited">Private Limited</SelectItem>
                                  <SelectItem value="Public Limited">Public Limited</SelectItem>
                                  <SelectItem value="LLP">LLP</SelectItem>
                                  <SelectItem value="Others">Others</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>

                        <div>
                          <Label>Type of Business</Label>
                          <div className="mt-2 space-y-2">
                            {["Agriculture", "Manufacturing", "Trader", "Retailer", "Service Provider", "Others"].map((type) => (
                              <label key={type} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  value={type}
                                  checked={watch("businessTypes")?.includes(type)}
                                  onChange={(e) => {
                                    const updated = toggleBusinessType(type);
                                    reset({ ...watch(), businessTypes: updated });
                                  }}
                                />
                                <span>{type}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="businessActivities">Business Activities</Label>
                          <textarea
                            id="businessActivities"
                            placeholder="Describe your business activities"
                            {...register("businessYear")}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md min-h-[100px]"
                          />
                        </div>

                        <div>
                          <Label htmlFor="businessYear">Business Commencement Year</Label>
                          <Controller
                            name="businessYear"
                            control={control}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                    <SelectItem key={year} value={year.toString()}>
                                      {year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>

                        <div>
                          <Label htmlFor="employees">Number of Employees</Label>
                          <Input
                            id="employees"
                            type="number"
                            placeholder="Enter number of employees"
                            {...register("employees")}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Member of any other Chamber/Association</Label>
                          <div className="flex gap-6 mt-2">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                value="yes"
                                {...register("chamber")}
                              />
                              <span>Yes</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                value="no"
                                {...register("chamber")}
                              />
                              <span>No</span>
                            </label>
                          </div>
                        </div>

                        {watch("chamber") === "yes" && (
                          <div>
                            <textarea
                              placeholder="Please specify chamber/association details"
                              {...register("chamberDetails")}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md min-h-[80px]"
                            />
                          </div>
                        )}

                        <div>
                          <Label>Registered with Govt. Organization</Label>
                          <div className="mt-2 space-y-2">
                            {["MSME", "KVIC", "NABARD", "None", "Others"].map((org) => (
                              <label key={org} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  value={org}
                                  checked={watch("govtOrgs")?.includes(org)}
                                  onChange={(e) => {
                                    const updated = toggleGovtOrg(org);
                                    reset({ ...watch(), govtOrgs: updated });
                                  }}
                                />
                                <span>{org}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {watch("doingBusiness") === "no" && (
                      <>
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                          <div className="flex items-start gap-3">
                            <div className="text-blue-600 mt-1">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-semibold text-blue-900 mb-1">Registering as Aspirant</h4>
                              <p className="text-sm text-blue-800">
                                You are registering as an Aspirant (Student / Non-business member). Financial information is not required.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Declaration for Aspirants */}
                        <div className="p-6 bg-amber-50 border-2 border-amber-200 rounded-xl">
                          <div className="flex items-start gap-3 mb-4">
                            <div className="text-amber-600 mt-1">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-amber-900 mb-2">Declaration</h4>
                              <p className="text-sm text-amber-800 mb-3">
                                This application is under the Verification and Screening Process. We have every right to ACCEPT or REJECT this application according to our membership policy.
                              </p>
                              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                                <input
                                  type="checkbox"
                                  {...register("declarationAccepted")}
                                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label className="text-sm text-gray-700">
                                  I hereby declare that all the information provided above is true and correct to the best of my knowledge. I understand that providing false information may result in rejection of my application.
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="border-t pt-6 flex gap-4">
                      <Button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="flex-1 bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
                      >
                        Previous
                      </Button>
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        {watch("doingBusiness") === "no" ? "Next →" : "Next →"}
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold mb-4">Financial & Compliance Information</h3>
                    
                    <div>
                      <Label htmlFor="pan">PAN Number</Label>
                      <Input
                        id="pan"
                        placeholder="Enter PAN number"
                        {...register("pan")}
                        className="mt-1"
                        maxLength={10}
                      />
                      <p className="text-xs text-gray-500 mt-1">Validate PAN Number (10 chars Alphanumeric)</p>
                    </div>

                    <div>
                      <Label htmlFor="gst">GST Number</Label>
                      <Input
                        id="gst"
                        placeholder="Enter GST number"
                        {...register("gst")}
                        className="mt-1"
                        maxLength={15}
                      />
                      <p className="text-xs text-gray-500 mt-1">Validate GSTIN Number (15 chars)</p>
                    </div>

                    <div>
                      <Label htmlFor="udyam">Udyam Number</Label>
                      <Input
                        id="udyam"
                        placeholder="Enter Udyam number"
                        {...register("udyam")}
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">Optional</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Filed Income Tax Returns</Label>
                      <div className="flex gap-6 mt-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="yes"
                            {...register("filedITR")}
                          />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="no"
                            {...register("filedITR")}
                          />
                          <span>No</span>
                        </label>
                      </div>
                    </div>

                    {watch("filedITR") === "yes" && (
                      <div>
                        <Label htmlFor="itrYears">How many continuous years have you filed ITR?</Label>
                        <Input
                          id="itrYears"
                          type="number"
                          placeholder="Enter number of years"
                          {...register("itrYears")}
                          className="mt-1"
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="turnoverRange">Turnover</Label>
                      <Controller
                        name="turnoverRange"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select turnover range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0-1cr">0 - 1 Crore</SelectItem>
                              <SelectItem value="1-5cr">1 - 5 Crores</SelectItem>
                              <SelectItem value="5-10cr">5 - 10 Crores</SelectItem>
                              <SelectItem value="10-25cr">10 - 25 Crores</SelectItem>
                              <SelectItem value="25-50cr">25 - 50 Crores</SelectItem>
                              <SelectItem value="50cr+">Above 50 Crores</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block">Turnover for Last 3 Yrs</Label>
                      
                      <div className="space-y-4">
                        <div>
                          <Input
                            placeholder="Enter turnover amount"
                            {...register("turnover1")}
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">FY 2024-25</p>
                        </div>

                        <div>
                          <Input
                            placeholder="Enter turnover amount"
                            {...register("turnover2")}
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">FY 2023-24</p>
                        </div>

                        <div>
                          <Input
                            placeholder="Enter turnover amount"
                            {...register("turnover3")}
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">FY 2022-23</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Have you got benefitted through any Govt. Schemes to your Business?</Label>
                      <div className="flex gap-6 mt-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="yes"
                            {...register("govtSchemes")}
                          />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="no"
                            {...register("govtSchemes")}
                          />
                          <span>No</span>
                        </label>
                      </div>
                    </div>

                    {watch("govtSchemes") === "yes" && (
                      <div className="space-y-3">
                        <Input
                          placeholder="Scheme 1"
                          {...register("scheme1")}
                          className="mt-1"
                        />
                        <Input
                          placeholder="Scheme 2"
                          {...register("scheme2")}
                          className="mt-1"
                        />
                        <Input
                          placeholder="Scheme 3"
                          {...register("scheme3")}
                          className="mt-1"
                        />
                      </div>
                    )}

                    <div className="border-t pt-6 flex gap-4">
                      <Button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="flex-1 bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
                      >
                        Previous
                      </Button>
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold mb-4">Declaration</h3>
                    
                    <div>
                      <Label htmlFor="sisterConcerns">No. of Sister Concerns</Label>
                      <Input
                        id="sisterConcerns"
                        type="number"
                        placeholder="Enter number"
                        {...register("sisterConcerns")}
                        className="mt-1"
                        onChange={(e) => {
                          const num = parseInt(e.target.value) || 0;
                          if (num > 0) {
                            setCompanyNames(Array(num).fill(""));
                          } else {
                            setCompanyNames([""]);
                          }
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">Positive integers only</p>
                    </div>

                    <div>
                      <Label htmlFor="companyNames">Name(s) of Company</Label>
                      {showSeparateFields ? (
                        <div className="space-y-3 mt-2">
                          {companyNames.map((_, index) => (
                            <Input
                              key={index}
                              placeholder={`Enter company name ${index + 1}`}
                              value={companyNames[index]}
                              onChange={(e) => {
                                const updated = [...companyNames];
                                updated[index] = e.target.value;
                                setCompanyNames(updated);
                              }}
                              className="mt-1"
                            />
                          ))}
                        </div>
                      ) : (
                        <Input
                          id="companyNames"
                          placeholder="Enter company name"
                          {...register("companyNames")}
                          className="mt-1"
                        />
                      )}
                      
                      <Button
                        type="button"
                        onClick={() => setCompanyNames([...companyNames, ""])}
                        className="mt-3 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      >
                        Add Another Company
                      </Button>

                      <div className="mt-3">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={showSeparateFields}
                            onChange={(e) => setShowSeparateFields(e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-600">Show one field per name entered above</span>
                        </label>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <Label className="text-sm font-semibold mb-3 block">Declaration</Label>
                      <p className="text-sm text-gray-700 mb-4">
                        This application is under the Verification and Screening Process. We have every right to ACCEPT or REJECT this application according to our membership policy.
                      </p>
                      
                      <p className="text-sm font-medium text-gray-900">
                        I confirm the above information is true and correct
                      </p>
                    </div>

                    <div className="border-t pt-6 flex gap-4">
                      <Button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="flex-1 bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
                      >
                        Previous
                      </Button>
                      <Button
                        type="button"
                        onClick={handleFinalSubmit}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        Submit Application
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
