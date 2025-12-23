import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Star, Building2, Phone, MapPin, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import BusinessSidebar from './BusinessSidebar';

interface Company {
  _id: string;
  businessName: string;
  description: string;
  businessType: string;
  mobileNumber: string;
  area: string;
  location: string;
  logo: string;
  status: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const CompanyDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchCompany();
  }, [id]);

  const fetchCompany = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/companies/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (result.success) {
        setCompany(result.data);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch company details',
          variant: 'destructive'
        });
        navigate('/business/companies');
      }
    } catch (error) {
      console.error('Error fetching company:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch company details',
        variant: 'destructive'
      });
      navigate('/business/companies');
    } finally {
      setLoading(false);
    }
  };

  const handleSetActive = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/companies/${id}/set-active`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Company set as active'
        });
        fetchCompany();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to set company as active',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error setting active company:', error);
      toast({
        title: 'Error',
        description: 'Failed to set company as active',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/companies/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Company deleted successfully'
        });
        navigate('/business/companies');
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete company',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error deleting company:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete company',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <BusinessSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading company details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <BusinessSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/business/companies')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Companies
            </Button>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg bg-white shadow-sm flex items-center justify-center overflow-hidden">
                  {company.logo ? (
                    <img src={company.logo} alt={company.businessName} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="h-10 w-10 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {company.businessName}
                    </h1>
                    {company.isActive && (
                      <Badge className="bg-primary">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(company.status)}
                    <span className="text-sm text-gray-500">
                      {company.businessType}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/business/companies/edit/${company._id}`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                {!company.isActive && (
                  <Button
                    variant="outline"
                    onClick={handleSetActive}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Set as Active
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-6">
            {/* Description */}
            {company.description && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-2">About</h2>
                  <p className="text-gray-600">{company.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Mobile Number</p>
                      <p className="text-gray-900">{company.mobileNumber}</p>
                    </div>
                  </div>
                  {(company.area || company.location) && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="text-gray-900">
                          {[company.area, company.location].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">Statistics</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">0</div>
                    <div className="text-sm text-gray-600">Products</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">0</div>
                    <div className="text-sm text-gray-600">Views</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">0</div>
                    <div className="text-sm text-gray-600">Connections</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">Timeline</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created</span>
                    <span className="text-gray-900">
                      {new Date(company.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="text-gray-900">
                      {new Date(company.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Company</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{company.businessName}"? This action cannot be undone.
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

export default CompanyDetails;
