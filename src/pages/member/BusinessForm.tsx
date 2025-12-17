import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Menu, Briefcase, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import MemberSidebar from "./MemberSidebar";

interface BusinessFormData {
  doingBusiness: string;
  organization: string;
  constitution: string;
  businessTypes: string[];
  businessActivities: string;
  businessYear: string;
  employees: string;
  chamber: string;
  chamberDetails: string;
  govtOrgs: string[];
}

const BusinessInformationForm = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState<BusinessFormData>({
    doingBusiness: "",
    organization: "",
    constitution: "",
    businessTypes: [],
    businessActivities: "",
    businessYear: "",
    employees: "",
    chamber: "",
    chamberDetails: "",
    govtOrgs: [],
  });

  const [status, setStatus] = useState<"pending" | "submitted" | "approved">("pending");

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:4000/api/business-form", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data) {
          setFormData(result.data);
          setStatus("submitted");
        }
      }
    } catch (error) {
      console.error("Error loading form:", error);
      toast.error("Failed to load form data");
    }
  };

  const toggleBusinessType = (type: string) => {
    setFormData({
      ...formData,
      businessTypes: formData.businessTypes.includes(type)
        ? formData.businessTypes.filter((t) => t !== type)
        : [...formData.businessTypes, type],
    });
  };

  const toggleGovtOrg = (org: string) => {
    setFormData({
      ...formData,
      govtOrgs: formData.govtOrgs.includes(org)
        ? formData.govtOrgs.filter((o) => o !== org)
        : [...formData.govtOrgs, org],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.doingBusiness) {
      toast.error("Please select if you are doing business");
      return;
    }

    if (formData.doingBusiness === "yes" && (!formData.organization || !formData.constitution || formData.businessTypes.length === 0)) {
      toast.error("Please fill in all required business fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/business-form", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Business information saved successfully!");
        setStatus("submitted");
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
          <h1 className="text-xl font-bold">Business Information</h1>
          <div className="w-10" />
        </div>

        <div className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Briefcase className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>Business Information Form</CardTitle>
                      <CardDescription>Additional Form 2 - Business Details</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge()}
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Doing Business */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Are you doing business? *</Label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="yes"
                          checked={formData.doingBusiness === "yes"}
                          onChange={(e) => setFormData({ ...formData, doingBusiness: e.target.value })}
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="no"
                          checked={formData.doingBusiness === "no"}
                          onChange={(e) => setFormData({ ...formData, doingBusiness: e.target.value })}
                        />
                        <span>No (Aspirant)</span>
                      </label>
                    </div>
                  </div>

                  {formData.doingBusiness === "yes" && (
                    <>
                      {/* Business Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="organization">Organization Name *</Label>
                          <Input
                            id="organization"
                            value={formData.organization}
                            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="constitution">Constitution *</Label>
                          <Select value={formData.constitution} onValueChange={(value) => setFormData({ ...formData, constitution: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
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
                        </div>

                        <div>
                          <Label htmlFor="businessYear">Business Commencement Year</Label>
                          <Select value={formData.businessYear} onValueChange={(value) => setFormData({ ...formData, businessYear: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="employees">Number of Employees</Label>
                          <Input
                            id="employees"
                            type="number"
                            value={formData.employees}
                            onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* Business Types */}
                      <div>
                        <Label className="mb-2 block">Type of Business *</Label>
                        <div className="space-y-2">
                          {["Agriculture", "Manufacturing", "Trader", "Retailer", "Service Provider", "Others"].map((type) => (
                            <label key={type} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={formData.businessTypes.includes(type)}
                                onChange={() => toggleBusinessType(type)}
                              />
                              <span>{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Business Activities */}
                      <div>
                        <Label htmlFor="businessActivities">Business Activities</Label>
                        <Textarea
                          id="businessActivities"
                          value={formData.businessActivities}
                          onChange={(e) => setFormData({ ...formData, businessActivities: e.target.value })}
                          placeholder="Describe your business activities"
                          className="min-h-[100px]"
                        />
                      </div>

                      {/* Chamber Membership */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Member of any Chamber/Association?</Label>
                        <div className="flex gap-6 mb-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              value="yes"
                              checked={formData.chamber === "yes"}
                              onChange={(e) => setFormData({ ...formData, chamber: e.target.value })}
                            />
                            <span>Yes</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              value="no"
                              checked={formData.chamber === "no"}
                              onChange={(e) => setFormData({ ...formData, chamber: e.target.value })}
                            />
                            <span>No</span>
                          </label>
                        </div>
                        {formData.chamber === "yes" && (
                          <Textarea
                            placeholder="Please specify chamber/association details"
                            value={formData.chamberDetails}
                            onChange={(e) => setFormData({ ...formData, chamberDetails: e.target.value })}
                            className="mt-2"
                          />
                        )}
                      </div>

                      {/* Government Organizations */}
                      <div>
                        <Label className="mb-2 block">Registered with Govt. Organization</Label>
                        <div className="space-y-2">
                          {["MSME", "KVIC", "NABARD", "None", "Others"].map((org) => (
                            <label key={org} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={formData.govtOrgs.includes(org)}
                                onChange={() => toggleGovtOrg(org)}
                              />
                              <span>{org}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-6 border-t">
                    <Button type="button" variant="outline" onClick={() => navigate("/member/dashboard")} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Save & Submit
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessInformationForm;
