import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Menu, FileCheck, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import MemberSidebar from "./MemberSidebar";

interface DeclarationFormData {
  sisterConcerns: string;
  companyNames: string[];
  declarationAccepted: boolean;
}

const DeclarationForm = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState<DeclarationFormData>({
    sisterConcerns: "",
    companyNames: [],
    declarationAccepted: false,
  });

  const [status, setStatus] = useState<"pending" | "submitted" | "approved">("pending");
  const [companyInputs, setCompanyInputs] = useState<string[]>([""]);

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

      const response = await fetch("http://localhost:4000/api/declaration-form", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data) {
          setFormData(result.data);
          if (result.data.companyNames && result.data.companyNames.length > 0) {
            setCompanyInputs(result.data.companyNames);
          }
          setStatus("submitted");
        }
      }
    } catch (error) {
      console.error("Error loading form:", error);
      toast.error("Failed to load form data");
    }
  };

  const handleCompanyNameChange = (index: number, value: string) => {
    const newInputs = [...companyInputs];
    newInputs[index] = value;
    setCompanyInputs(newInputs);
    setFormData({ ...formData, companyNames: newInputs.filter((name) => name.trim() !== "") });
  };

  const addCompanyInput = () => {
    setCompanyInputs([...companyInputs, ""]);
  };

  const removeCompanyInput = (index: number) => {
    const newInputs = companyInputs.filter((_, i) => i !== index);
    setCompanyInputs(newInputs.length > 0 ? newInputs : [""]);
    setFormData({ ...formData, companyNames: newInputs.filter((name) => name.trim() !== "") });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.declarationAccepted) {
      toast.error("Please accept the declaration to proceed");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/declaration-form", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Declaration submitted successfully!");
        setStatus("submitted");
        // Navigate to application submitted page
        setTimeout(() => {
          navigate("/member/application-submitted");
        }, 1000);
      } else {
        toast.error(result.message || "Failed to submit declaration");
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
          <h1 className="text-xl font-bold">Declaration</h1>
          <div className="w-10" />
        </div>

        <div className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FileCheck className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle>Declaration Form</CardTitle>
                      <CardDescription>Additional Form 4 - Final Declaration</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge()}
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Sister Concerns */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Do you have any sister concerns?</Label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="yes"
                          checked={formData.sisterConcerns === "yes"}
                          onChange={(e) => setFormData({ ...formData, sisterConcerns: e.target.value })}
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="no"
                          checked={formData.sisterConcerns === "no"}
                          onChange={(e) => setFormData({ ...formData, sisterConcerns: e.target.value })}
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>

                  {/* Company Names */}
                  {formData.sisterConcerns === "yes" && (
                    <div className="space-y-3">
                      <Label>Company Names</Label>
                      {companyInputs.map((value, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={value}
                            onChange={(e) => handleCompanyNameChange(index, e.target.value)}
                            placeholder={`Company ${index + 1}`}
                            className="flex-1"
                          />
                          {companyInputs.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => removeCompanyInput(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addCompanyInput}
                        className="w-full"
                      >
                        + Add Another Company
                      </Button>
                    </div>
                  )}

                  {/* Declaration Statement */}
                  <div className="pt-4 border-t">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                      <h3 className="font-semibold text-lg mb-3">Declaration</h3>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p>I hereby declare that:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>All the information provided by me is true and correct to the best of my knowledge.</li>
                          <li>I understand that any false information may lead to rejection of my application.</li>
                          <li>I agree to abide by the rules and regulations of the organization.</li>
                          <li>I authorize the organization to verify the information provided.</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="declaration"
                        checked={formData.declarationAccepted}
                        onCheckedChange={(checked) => setFormData({ ...formData, declarationAccepted: checked as boolean })}
                        className="mt-1"
                      />
                      <label htmlFor="declaration" className="text-sm cursor-pointer">
                        I have read and agree to the above declaration. I understand that this submission is final and any
                        false information may result in termination of membership. *
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-6 border-t">
                    <Button type="button" variant="outline" onClick={() => navigate("/member/dashboard")} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!formData.declarationAccepted} className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Submit Declaration
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

export default DeclarationForm;
