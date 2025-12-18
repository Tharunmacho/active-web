import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EnhancedLoginPage from "./components/EnhancedLoginPage";
import MemberLogin from "./pages/member/Login";
import ForgotPassword from "./pages/member/ForgotPassword";

import MemberRegister from "./pages/member/Register";
import MemberDashboard from "./pages/member/Dashboard";
import Explore from "./pages/member/Explore";
import Notifications from "./pages/member/Notifications";
import ADFForm from "./pages/member/ADF";
import MemberCertificate from "./pages/member/Certificate";
import MemberProfile from "./pages/member/Profile";
import PersonalForm from "./pages/member/PersonalForm";
import BusinessForm from "./pages/member/BusinessForm";
import FinancialForm from "./pages/member/FinancialForm";
import DeclarationForm from "./pages/member/DeclarationForm";
import ApplicationSubmitted from "./pages/member/ApplicationSubmitted";
import ApplicationStatus from "./pages/member/ApplicationStatus";
import PaymentPage from "./pages/member/Payment";
import PaymentSuccess from "./pages/member/PaymentSuccess";
import MemberHelp from "./pages/member/Help";
import MemberEvents from "./pages/member/Events";
import BusinessProfile from "./pages/business/BusinessProfile";
import BusinessDashboard from "./pages/business/Dashboard";
import Products from "./pages/business/Products";
import AddProduct from "./pages/business/AddProduct";
import EditProduct from "./pages/business/EditProduct";
import Discover from "./pages/business/Discover";
import Analytics from "./pages/business/Analytics";
import Settings from "./pages/business/Settings";
import MyCompanies from "./pages/business/MyCompanies";
import AddEditCompany from "./pages/business/AddEditCompany";
import CompanyDetails from "./pages/business/CompanyDetails";
import Account from "./pages/member/Account";
import PaymentHistory from "./pages/member/PaymentHistory";
// Block Admin Imports
import BlockDashboard from "./pages/block-admin/Dashboard";
import BlockApprovals from "./pages/block-admin/Approvals";
import BlockMembers from "./pages/block-admin/Members";
import BlockSettings from "./pages/block-admin/Settings";

// District Admin Imports
import DistrictDashboard from "./pages/district-admin/Dashboard";
import DistrictApprovals from "./pages/district-admin/Approvals";
import DistrictMembers from "./pages/district-admin/Members";
import DistrictSettings from "./pages/district-admin/Settings";

// State Admin Imports
import StateDashboard from "./pages/state-admin/Dashboard";
import StateApprovals from "./pages/state-admin/Approvals";
import StateMembers from "./pages/state-admin/Members";
import StateSettings from "./pages/state-admin/Settings";

// Super Admin Imports
import SuperDashboard from "./pages/super-admin/Dashboard";
import SuperApprovals from "./pages/super-admin/Approvals";
import SuperMembers from "./pages/super-admin/Members";
import SuperSettings from "./pages/super-admin/Settings";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<EnhancedLoginPage />} />
          {/* Aliases for member-specific paths used in some pages */}
          <Route path="/member/login" element={<MemberLogin />} />
          <Route path="/member/register" element={<MemberRegister />} />
          <Route path="/member/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<MemberRegister />} />



          {/* Member Routes */}
          <Route path="/member/dashboard" element={<MemberDashboard />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/member/adf" element={<ADFForm />} />
          <Route path="/member/certificate" element={<MemberCertificate />} />
          <Route path="/member/profile" element={<MemberProfile />} />
          <Route path="/member/forms/personal" element={<PersonalForm />} />
          <Route path="/member/forms/business" element={<BusinessForm />} />
          <Route path="/member/forms/financial" element={<FinancialForm />} />
          <Route path="/member/forms/declaration" element={<DeclarationForm />} />
          <Route path="/business/create-profile" element={<BusinessProfile />} />
          <Route path="/member/account" element={<Account />} />
          <Route path="/member/payment-history" element={<PaymentHistory />} />
          <Route path="/member/application-submitted" element={<ApplicationSubmitted />} />
          <Route path="/member/application-status" element={<ApplicationStatus />} />
          <Route path="/member/payment" element={<PaymentPage />} />
          <Route path="/member/payment-success" element={<PaymentSuccess />} />
          <Route path="/member/help" element={<MemberHelp />} />
          <Route path="/member/events" element={<MemberEvents />} />

          {/* Business Routes */}
          <Route path="/business/dashboard" element={<BusinessDashboard />} />
          <Route path="/business/products" element={<Products />} />
          <Route path="/business/add-product" element={<AddProduct />} />
          <Route path="/business/edit-product/:id" element={<EditProduct />} />
          <Route path="/business/discover" element={<Discover />} />
          <Route path="/business/analytics" element={<Analytics />} />
          <Route path="/business/settings" element={<Settings />} />
          <Route path="/business/companies" element={<MyCompanies />} />
          <Route path="/business/companies/add" element={<AddEditCompany />} />
          <Route path="/business/companies/edit/:id" element={<AddEditCompany />} />
          <Route path="/business/companies/:id" element={<CompanyDetails />} />

          {/* Block Admin Routes */}
          <Route path="/block-admin/dashboard" element={<BlockDashboard />} />
          <Route path="/block-admin/approvals" element={<BlockApprovals />} />
          <Route path="/block-admin/applications" element={<BlockApprovals />} />
          <Route path="/block-admin/members" element={<BlockMembers />} />
          <Route path="/block-admin/settings" element={<BlockSettings />} />

          {/* District Admin Routes */}
          <Route path="/district-admin/dashboard" element={<DistrictDashboard />} />
          <Route path="/district-admin/approvals" element={<DistrictApprovals />} />
          <Route path="/district-admin/applications" element={<DistrictApprovals />} />
          <Route path="/district-admin/members" element={<DistrictMembers />} />
          <Route path="/district-admin/settings" element={<DistrictSettings />} />

          {/* State Admin Routes */}
          <Route path="/state-admin/dashboard" element={<StateDashboard />} />
          <Route path="/state-admin/approvals" element={<StateApprovals />} />
          <Route path="/state-admin/applications" element={<StateApprovals />} />
          <Route path="/state-admin/members" element={<StateMembers />} />
          <Route path="/state-admin/settings" element={<StateSettings />} />

          {/* Super Admin Routes */}
          <Route path="/super-admin/dashboard" element={<SuperDashboard />} />
          <Route path="/super-admin/approvals" element={<SuperApprovals />} />
          <Route path="/super-admin/applications" element={<SuperApprovals />} />
          <Route path="/super-admin/members" element={<SuperMembers />} />
          <Route path="/super-admin/settings" element={<SuperSettings />} />

          {/* Legacy Admin Routes - Redirect to Block Admin */}
          <Route path="/admin/dashboard" element={<BlockDashboard />} />
          <Route path="/admin/block/dashboard" element={<BlockDashboard />} />
          <Route path="/admin/applications" element={<BlockApprovals />} />
          <Route path="/admin/approvals" element={<BlockApprovals />} />
          <Route path="/admin/members" element={<BlockMembers />} />
          <Route path="/admin/settings" element={<BlockSettings />} />


          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;