import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EnhancedLoginPage from "./shared/components/EnhancedLoginPage";

// Member Feature Imports
import MemberRegister from "./pages/member/Register";
import MemberDashboard from "./pages/member/Dashboard";
import Notifications from "./pages/member/Notifications";
import ADFForm from "./pages/member/ADF";
import MemberCertificate from "./pages/member/Certificate";
import MemberProfile from "./pages/member/Profile";
import ProfileView from "./features/member/pages/ProfileView";
import PersonalForm from "./pages/member/PersonalForm";
import BusinessForm from "./pages/member/BusinessForm";
import FinancialForm from "./pages/member/FinancialForm";
import DeclarationForm from "./pages/member/DeclarationForm";
import ApplicationSubmitted from "./pages/member/ApplicationSubmitted";
import ApplicationStatus from "./pages/member/ApplicationStatus";
import PaymentPage from "./pages/member/Payment";
import PaymentSuccess from "./pages/member/PaymentSuccess";
import UnpaidDashboard from "./features/member/pages/UnpaidDashboard";
import MemberHelp from "./features/member/pages/Help";
import MemberEvents from "./features/member/pages/Events";
import Explore from "./features/member/pages/Explore";
import Account from "./pages/member/Account";
import PaymentHistory from "./pages/member/PaymentHistory";
import MemberSettings from "./pages/member/Settings";

// Feature Pages Imports (New UI from day-3)
import Catalog from "./pages/member/features/Catalog";
import Cart from "./pages/member/features/Cart";
import Inquiry from "./pages/member/features/Inquiry";
import Showcase from "./pages/member/features/Showcase";
import SellerDashboard from "./pages/member/features/SellerDashboard";
import WhatsAppCatalog from "./pages/member/features/WhatsAppCatalog";
import Inventory from "./pages/member/features/Inventory";

// Payment Feature Imports
import PaymentRegistration from "./pages/payment/PaymentRegistration";
import PaymentGateway from "./pages/payment/PaymentGateway";
import PaymentConfirmation from "./pages/payment/PaymentConfirmation";
import MockPayment from "./pages/payment/MockPayment";
import PaymentMemberDashboard from "./pages/payment/OldMemberDashboard";
import MembershipPlans from "./pages/payment/MembershipPlans";

// Business Feature Imports
import BusinessProfile from "./pages/business/BusinessProfile";
import BusinessDashboard from "./pages/business/Dashboard";
import Products from "./pages/business/Products";
import AddProduct from "./pages/business/AddProduct";
import EditProduct from "./pages/business/EditProduct";
import Discover from "./pages/business/Discover";
import Analytics from "./pages/business/Analytics";
import BusinessSettings from "./pages/business/Settings";
import MyCompanies from "./pages/business/MyCompanies";
import AddEditCompany from "./pages/business/AddEditCompany";
import CompanyDetails from "./pages/business/CompanyDetails";

// Block Admin Imports
import BlockDashboard from "./features/admin/block-admin/pages/Dashboard";
import BlockApprovals from "./features/admin/block-admin/pages/Approvals";
import BlockMembers from "./features/admin/block-admin/pages/Members";
import BlockSettings from "./features/admin/block-admin/pages/Settings";

// District Admin Imports
import DistrictDashboard from "./features/admin/district-admin/pages/Dashboard";
import DistrictApprovals from "./features/admin/district-admin/pages/Approvals";
import DistrictMembers from "./features/admin/district-admin/pages/Members";
import DistrictSettings from "./features/admin/district-admin/pages/Settings";

// State Admin Imports
import StateDashboard from "./features/admin/state-admin/pages/Dashboard";
import StateApprovals from "./features/admin/state-admin/pages/Approvals";
import StateMembers from "./features/admin/state-admin/pages/Members";
import StateSettings from "./features/admin/state-admin/pages/Settings";

// Super Admin Imports
import SuperDashboard from "./features/admin/super-admin/pages/Dashboard";
import SuperApprovals from "./features/admin/super-admin/pages/Approvals";
import SuperMembers from "./features/admin/super-admin/pages/Members";
import SuperSettings from "./features/admin/super-admin/pages/Settings";

// E-commerce Feature Imports
import ProductCatalog from "./features/ecommerce/pages/ProductCatalog";
import ProductDetails from "./features/ecommerce/pages/ProductDetails";
import ShoppingCart from "./features/ecommerce/pages/ShoppingCart";
import Checkout from "./features/ecommerce/pages/Checkout";
import OrderSuccess from "./features/ecommerce/pages/OrderSuccess";
import B2BInquiry from "./features/ecommerce/pages/B2BInquiry";
import BusinessShowcase from "./features/ecommerce/pages/BusinessShowcase";
import InventoryTracking from "./features/ecommerce/pages/InventoryTracking";

// EDA Playground Feature Imports
import EdaPlayground from "./pages/eda/EdaPlayground";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <ProfileProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<EnhancedLoginPage />} />
              <Route path="/register" element={<MemberRegister />} />

              {/* Member Routes */}
              <Route path="/member/dashboard" element={<MemberDashboard />} />
              <Route path="/member/unpaid-dashboard" element={<UnpaidDashboard />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/member/notifications" element={<Notifications />} />
              <Route path="/member/adf" element={<ADFForm />} />
              <Route path="/member/certificate" element={<MemberCertificate />} />
              <Route path="/member/profile-view" element={<ProfileView />} />
              <Route path="/member/profile" element={<MemberProfile />} />
              <Route path="/member/settings" element={<MemberSettings />} />
              <Route path="/member/help" element={<MemberHelp />} />
              <Route path="/member/events" element={<MemberEvents />} />
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

              {/* Feature Pages Routes (New UI) */}
              <Route path="/member/catalog" element={<Catalog />} />
              <Route path="/member/cart" element={<Cart />} />
              <Route path="/member/inquiry" element={<Inquiry />} />
              <Route path="/member/showcase" element={<Showcase />} />
              <Route path="/member/seller-dashboard" element={<SellerDashboard />} />
              <Route path="/member/whatsapp-catalog" element={<WhatsAppCatalog />} />
              <Route path="/member/inventory" element={<Inventory />} />

              {/* E-commerce Routes */}
              <Route path="/member/product-catalog" element={<ProductCatalog />} />
              <Route path="/member/product/:id" element={<ProductDetails />} />
              <Route path="/member/shopping-cart" element={<ShoppingCart />} />
              <Route path="/member/checkout" element={<Checkout />} />
              <Route path="/member/order-success" element={<OrderSuccess />} />
              <Route path="/member/b2b-inquiry" element={<B2BInquiry />} />
              <Route path="/member/business-showcase" element={<BusinessShowcase />} />
              <Route path="/member/inventory-tracking" element={<InventoryTracking />} />

              {/* New Payment Routes */}
              <Route path="/payment/membership-plan" element={<PaymentRegistration />} />
              <Route path="/payment/confirmation" element={<PaymentConfirmation />} />
              <Route path="/payment/mock" element={<MockPayment />} />
              <Route path="/payment/member-dashboard" element={<PaymentMemberDashboard />} />
              <Route path="/payment/membership-plans" element={<MembershipPlans />} />

              {/* Business Routes */}
              <Route path="/business/dashboard" element={<BusinessDashboard />} />
              <Route path="/business/products" element={<Products />} />
              <Route path="/business/add-product" element={<AddProduct />} />
              <Route path="/business/edit-product/:id" element={<EditProduct />} />
              <Route path="/business/discover" element={<Discover />} />
              <Route path="/business/analytics" element={<Analytics />} />
              <Route path="/business/settings" element={<BusinessSettings />} />
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

              {/* E-commerce Routes - Using member feature implementations */}
              <Route path="/ecommerce/catalog" element={<Catalog />} />
              <Route path="/ecommerce/product/:id" element={<ProductDetails />} />
              <Route path="/ecommerce/cart" element={<ShoppingCart />} />
              <Route path="/ecommerce/checkout" element={<Checkout />} />
              <Route path="/ecommerce/order-success" element={<OrderSuccess />} />
              <Route path="/ecommerce/b2b-inquiry" element={<B2BInquiry />} />
              <Route path="/ecommerce/showcase" element={<BusinessShowcase />} />
              <Route path="/ecommerce/seller-dashboard" element={<SellerDashboard />} />
              <Route path="/ecommerce/whatsapp-catalog" element={<WhatsAppCatalog />} />
              <Route path="/ecommerce/inventory" element={<InventoryTracking />} />

              {/* EDA Playground Routes */}
              <Route path="/eda" element={<EdaPlayground />} />
              <Route path="/eda/playground" element={<EdaPlayground />} />


              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ProfileProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;