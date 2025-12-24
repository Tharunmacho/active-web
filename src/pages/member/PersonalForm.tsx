import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Menu, User, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import MemberSidebar from "./MemberSidebar";
import { INDIA_DISTRICTS } from "@/data/india-districts";

interface PersonalFormData {
  name: string;
  phoneNumber: string;
  email: string;
  state: string;
  district: string;
  block: string;
  city: string;
  religion: string;
  socialCategory: string;
}

const PersonalInformationForm = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState<PersonalFormData>({
    name: "",
    phoneNumber: "",
    email: "",
    state: "",
    district: "",
    block: "",
    city: "",
    religion: "",
    socialCategory: "",
  });

  const [status, setStatus] = useState<"pending" | "submitted" | "approved">("pending");
  const [districts, setDistricts] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<string[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    loadFormData();
  }, []);

  useEffect(() => {
    if (formData.state) {
      setDistricts(INDIA_DISTRICTS[formData.state] ?? []);
    } else {
      setDistricts([]);
    }
  }, [formData.state]);

  useEffect(() => {
    const loadBlocks = async () => {
      if (formData.state && formData.district) {
        try {
          const url = `http://localhost:4000/api/locations/states/${encodeURIComponent(formData.state)}/districts/${encodeURIComponent(formData.district)}/blocks`;
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            setBlocks(data.data || []);
          }
        } catch (error) {
          console.error("Error loading blocks:", error);
        }
      } else {
        setBlocks([]);
      }
    };
    loadBlocks();
  }, [formData.state, formData.district]);

  const loadFormData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // First, try to get user profile data for pre-population
      let userProfileData = null;
      try {
        const userResponse = await fetch("http://localhost:4000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (userResponse.ok) {
          const userResult = await userResponse.json();
          if (userResult.success && userResult.data) {
            userProfileData = userResult.data;
          }
        }
      } catch (error) {
        console.log("Could not fetch user profile for pre-population");
      }

      const response = await fetch("http://localhost:4000/api/personal-form", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data) {
          setFormData(result.data);
          setIsLocked(result.data.isLocked || false);
          setStatus(result.data.isLocked ? "submitted" : "pending");
        } else if (userProfileData) {
          // Pre-populate with user registration data if form is empty
          setFormData({
            name: userProfileData.fullName || "",
            phoneNumber: userProfileData.phoneNumber || "",
            email: userProfileData.email || "",
            state: userProfileData.state || "",
            district: userProfileData.district || "",
            block: userProfileData.block || "",
            city: userProfileData.city || "",
            religion: "",
            socialCategory: "",
          });
        }
      } else if (userProfileData) {
        // If form doesn't exist yet, pre-populate with user registration data
        setFormData({
          name: userProfileData.fullName || "",
          phoneNumber: userProfileData.phoneNumber || "",
          email: userProfileData.email || "",
          state: userProfileData.state || "",
          district: userProfileData.district || "",
          block: userProfileData.block || "",
          city: userProfileData.city || "",
          religion: "",
          socialCategory: "",
        });
      }
    } catch (error) {
      console.error("Error loading form:", error);
      toast.error("Failed to load form data");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) {
      toast.error("Form is locked and cannot be edited");
      return;
    }

    // Validation
    if (!formData.name || !formData.phoneNumber || !formData.email || !formData.state || !formData.district || !formData.block || !formData.city || !formData.religion || !formData.socialCategory) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/personal-form", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Personal information saved successfully!");
        setStatus("submitted");
        setIsLocked(true);
        
        // Dispatch event to update dashboard percentage
        window.dispatchEvent(new Event('formSubmitted'));
        
        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
          navigate("/member/dashboard");
        }, 1500);
      } else {
        toast.error(result.message || "Failed to save form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form");
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case "submitted":
        return <Badge className="bg-blue-500"><Clock className="w-3 h-3 mr-1" />Submitted</Badge>;
      default:
        return <Badge variant="outline"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <MemberSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">Personal Information</h1>
          <div className="w-10" />
        </div>

        <div className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>Personal Information Form</CardTitle>
                      <CardDescription>Additional Form 1 - Personal Details</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge()}
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={isLocked}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        disabled={isLocked}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={isLocked}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="religion">Religion *</Label>
                      <Select value={formData.religion} onValueChange={(value) => setFormData({ ...formData, religion: value })} disabled={isLocked}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select religion" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Hindu">Hindu</SelectItem>
                          <SelectItem value="Muslim">Muslim</SelectItem>
                          <SelectItem value="Christian">Christian</SelectItem>
                          <SelectItem value="Sikh">Sikh</SelectItem>
                          <SelectItem value="Buddhist">Buddhist</SelectItem>
                          <SelectItem value="Jain">Jain</SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="socialCategory">Social Category *</Label>
                      <Select value={formData.socialCategory} onValueChange={(value) => setFormData({ ...formData, socialCategory: value })} disabled={isLocked}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Christian SC">Christian SC</SelectItem>
                          <SelectItem value="Christian ST">Christian ST</SelectItem>
                          <SelectItem value="SC">SC</SelectItem>
                          <SelectItem value="ST">ST</SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Location Details */}
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-semibold mb-4">Location Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value, district: "", block: "" })} disabled={isLocked}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(INDIA_DISTRICTS).map((state) => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="district">District *</Label>
                        <Select value={formData.district} onValueChange={(value) => setFormData({ ...formData, district: value, block: "" })} disabled={isLocked || !formData.state}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select district" />
                          </SelectTrigger>
                          <SelectContent>
                            {districts.map((district) => (
                              <SelectItem key={district} value={district}>{district}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="block">Block *</Label>
                        <Select value={formData.block} onValueChange={(value) => setFormData({ ...formData, block: value })} disabled={isLocked || !formData.district}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select block" />
                          </SelectTrigger>
                          <SelectContent>
                            {blocks.map((block) => (
                              <SelectItem key={block} value={block}>{block}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          disabled={isLocked}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-6 border-t">
                    <Button type="button" variant="outline" onClick={() => navigate("/member/dashboard")} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLocked} className="flex-1 bg-blue-600 hover:bg-blue-700">
                      {isLocked ? "Form Locked" : "Save & Submit"}
                    </Button>
                  </div>

                  {isLocked && (
                    <p className="text-sm text-amber-600 text-center">
                      This form has been submitted and is locked. Contact admin to make changes.
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationForm;
