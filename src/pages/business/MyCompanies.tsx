import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, Plus, Building2, Eye, Edit, Trash2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import BusinessSidebar from "./BusinessSidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Company {
  _id: string;
  businessName: string;
  description: string;
  businessType: string;
  mobileNumber: string;
  area: string;
  location: string;
  logo: string;
  status: string;
  isActive: boolean;
  createdAt: string;
}

const MyCompanies = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:4000/api/companies", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setCompanies(result.data || []);
      }
    } catch (error) {
      console.error("Error loading companies:", error);
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/companies/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Company deleted successfully");
        loadCompanies();
      } else {
        toast.error("Failed to delete company");
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error("Failed to delete company");
    } finally {
      setDeleteId(null);
    }
  };

  const handleSetActive = async (companyId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/companies/${companyId}/set-active`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Company set as active");
        loadCompanies();
        // Dispatch event to update sidebar
        window.dispatchEvent(new Event('companyUpdated'));
      } else {
        toast.error("Failed to set company as active");
      }
    } catch (error) {
      console.error("Error setting active company:", error);
      toast.error("Failed to set company as active");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-amber-500";
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <BusinessSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">My Companies</h1>
          <Button size="icon" className="bg-blue-600" onClick={() => navigate("/business/companies/add")}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Desktop Content */}
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Companies</h1>
                <p className="text-gray-600 mt-1">{companies.length} {companies.length === 1 ? 'company' : 'companies'}</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate("/business/companies/add")}>
                <Plus className="h-5 w-5 mr-2" />
                Add Company
              </Button>
            </div>

            {/* Info Card */}
            <Card className="mb-6 bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">
                      Manage multiple companies under your account. Each company can have its own products and profile.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Companies List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading companies...</p>
              </div>
            ) : companies.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Companies Yet</h3>
                  <p className="text-gray-600 mb-6">Create your first company to get started</p>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate("/business/companies/add")}>
                    <Plus className="h-5 w-5 mr-2" />
                    Add First Company
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company) => (
                  <Card key={company._id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                    {company.isActive && (
                      <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-3 py-1 rounded-bl-lg flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Active
                      </div>
                    )}
                    <CardContent className="p-6">
                      {/* Company Logo */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          {company.logo ? (
                            <img src={company.logo} alt={company.businessName} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-gray-900 truncate">{company.businessName}</h3>
                          <p className="text-sm text-gray-600 capitalize">{company.businessType}</p>
                          <p className="text-sm text-gray-500">{company.mobileNumber}</p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <Badge className={`${getStatusColor(company.status)} text-white mb-4 capitalize`}>
                        {company.status}
                      </Badge>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">0</p>
                          <p className="text-xs text-gray-600">Products</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">0</p>
                          <p className="text-xs text-gray-600">Views</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">0</p>
                          <p className="text-xs text-gray-600">Connections</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/business/companies/${company._id}`)}
                            className="w-full"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/business/companies/edit/${company._id}`)}
                            className="w-full"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                        {!company.isActive && (
                          <Button
                            size="sm"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleSetActive(company._id)}
                          >
                            Set as Active
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteId(company._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Company?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the company and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyCompanies;
