import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Menu, DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import MemberSidebar from "./MemberSidebar";

interface FinancialFormData {
  pan: string;
  gst: string;
  udyam: string;
  filedITR: string;
  itrYears: string;
  turnoverRange: string;
  turnover1: string;
  turnover2: string;
  turnover3: string;
  govtSchemes: string;
  scheme1: string;
  scheme2: string;
  scheme3: string;
}

const FinancialForm = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState<FinancialFormData>({
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

      const response = await fetch("http://localhost:4000/api/financial-form", {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/financial-form", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Financial information saved successfully!");
        setStatus("submitted");
        
        // Dispatch event to update dashboard percentage
        window.dispatchEvent(new Event('formSubmitted'));
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
          <h1 className="text-xl font-bold">Financial Information</h1>
          <div className="w-10" />
        </div>

        <div className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle>Financial & Compliance Form</CardTitle>
                      <CardDescription>Additional Form 3 - Financial Details</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge()}
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Registration Numbers */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="pan">PAN Number</Label>
                      <Input
                        id="pan"
                        value={formData.pan}
                        onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                        placeholder="ABCDE1234F"
                        maxLength={10}
                      />
                    </div>

                    <div>
                      <Label htmlFor="gst">GST Number</Label>
                      <Input
                        id="gst"
                        value={formData.gst}
                        onChange={(e) => setFormData({ ...formData, gst: e.target.value.toUpperCase() })}
                        placeholder="22AAAAA0000A1Z5"
                        maxLength={15}
                      />
                    </div>

                    <div>
                      <Label htmlFor="udyam">Udyam Registration</Label>
                      <Input
                        id="udyam"
                        value={formData.udyam}
                        onChange={(e) => setFormData({ ...formData, udyam: e.target.value })}
                        placeholder="UDYAM-XX-00-0000000"
                      />
                    </div>
                  </div>

                  {/* ITR Details */}
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-semibold mb-4">ITR Filing Details</h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Filed ITR in last 3 years?</Label>
                        <div className="flex gap-6">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              value="yes"
                              checked={formData.filedITR === "yes"}
                              onChange={(e) => setFormData({ ...formData, filedITR: e.target.value })}
                            />
                            <span>Yes</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              value="no"
                              checked={formData.filedITR === "no"}
                              onChange={(e) => setFormData({ ...formData, filedITR: e.target.value })}
                            />
                            <span>No</span>
                          </label>
                        </div>
                      </div>

                      {formData.filedITR === "yes" && (
                        <div>
                          <Label htmlFor="itrYears">Specify Years (e.g., 2021-22, 2022-23)</Label>
                          <Input
                            id="itrYears"
                            value={formData.itrYears}
                            onChange={(e) => setFormData({ ...formData, itrYears: e.target.value })}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Turnover Details */}
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-semibold mb-4">Annual Turnover</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="turnoverRange">Turnover Range</Label>
                        <Select value={formData.turnoverRange} onValueChange={(value) => setFormData({ ...formData, turnoverRange: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-10 Lakhs">0-10 Lakhs</SelectItem>
                            <SelectItem value="10-50 Lakhs">10-50 Lakhs</SelectItem>
                            <SelectItem value="50 Lakhs-1 Crore">50 Lakhs-1 Crore</SelectItem>
                            <SelectItem value="1-5 Crores">1-5 Crores</SelectItem>
                            <SelectItem value="5-10 Crores">5-10 Crores</SelectItem>
                            <SelectItem value="Above 10 Crores">Above 10 Crores</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="turnover1">FY 2023-24 (₹)</Label>
                          <Input
                            id="turnover1"
                            type="number"
                            value={formData.turnover1}
                            onChange={(e) => setFormData({ ...formData, turnover1: e.target.value })}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="turnover2">FY 2022-23 (₹)</Label>
                          <Input
                            id="turnover2"
                            type="number"
                            value={formData.turnover2}
                            onChange={(e) => setFormData({ ...formData, turnover2: e.target.value })}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="turnover3">FY 2021-22 (₹)</Label>
                          <Input
                            id="turnover3"
                            type="number"
                            value={formData.turnover3}
                            onChange={(e) => setFormData({ ...formData, turnover3: e.target.value })}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Government Schemes */}
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-semibold mb-4">Government Schemes</h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Availed any government schemes?</Label>
                        <div className="flex gap-6">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              value="yes"
                              checked={formData.govtSchemes === "yes"}
                              onChange={(e) => setFormData({ ...formData, govtSchemes: e.target.value })}
                            />
                            <span>Yes</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              value="no"
                              checked={formData.govtSchemes === "no"}
                              onChange={(e) => setFormData({ ...formData, govtSchemes: e.target.value })}
                            />
                            <span>No</span>
                          </label>
                        </div>
                      </div>

                      {formData.govtSchemes === "yes" && (
                        <div className="space-y-3">
                          <Input
                            placeholder="Scheme 1"
                            value={formData.scheme1}
                            onChange={(e) => setFormData({ ...formData, scheme1: e.target.value })}
                          />
                          <Input
                            placeholder="Scheme 2"
                            value={formData.scheme2}
                            onChange={(e) => setFormData({ ...formData, scheme2: e.target.value })}
                          />
                          <Input
                            placeholder="Scheme 3"
                            value={formData.scheme3}
                            onChange={(e) => setFormData({ ...formData, scheme3: e.target.value })}
                          />
                        </div>
                      )}
                    </div>
                  </div>

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

export default FinancialForm;
