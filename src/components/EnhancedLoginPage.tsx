import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { authenticateAdmin, setAdminSession } from "@/utils/authService";

const activLogo = "/logo_ACTIVian-removebg-preview.png";

export default function EnhancedLoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    toast.info(`Social login with ${provider} coming soon!`);
  };

  // Unified login: try admin auth first, then member flow
  const handleUnifiedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!identifier || !password) {
      toast.error('Please enter both ID and password');
      setIsLoading(false);
      return;
    }
    try {
      // Attempt admin authentication (supports IDs like block_admin_001)
      try {
        const adminAuth = await authenticateAdmin(identifier, password);
        if (adminAuth.success) {
          const role = (adminAuth.role as string) || '';
          const label = (role.split('_')[0] || 'Admin');
          setAdminSession(
            identifier,
            role || 'member',
            `${label.charAt(0).toUpperCase() + label.slice(1)} Admin`
          );

          // Navigate to the appropriate admin dashboard based on role
          let adminPath = '/block-admin/dashboard';
          if (role === 'district_admin') adminPath = '/district-admin/dashboard';
          else if (role === 'state_admin') adminPath = '/state-admin/dashboard';
          else if (role === 'super_admin') adminPath = '/super-admin/dashboard';

          navigate(adminPath);
          toast.success('Login successful!');
          return;
        }
      } catch { }

      // Member/backend authentication
      try {
        const res = await fetch('http://localhost:4000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: identifier, password }),
        });
        if (res.ok) {
          const json = await res.json();
          const found = json.data?.user || json.user;
          localStorage.setItem('userName', found.fullName || found.firstName || found.email || found.memberId);
          localStorage.setItem('memberId', found.id || found._id || found.memberId);
          localStorage.setItem('token', json.data?.token || json.token);
          const role = (typeof found.role === 'string' && found.role) || 'member';
          localStorage.setItem('role', role);
          localStorage.setItem('isLoggedIn', 'true');
          const isAdmin = ['super_admin', 'state_admin', 'district_admin', 'block_admin'].includes(role);

          let adminPath = '/block-admin/dashboard';
          if (role === 'district_admin') adminPath = '/district-admin/dashboard';
          else if (role === 'state_admin') adminPath = '/state-admin/dashboard';
          else if (role === 'super_admin') adminPath = '/super-admin/dashboard';

          navigate(isAdmin ? adminPath : '/member/dashboard');
          return;
        }
      } catch { }

      // Local users fallback
      const usersJson = localStorage.getItem('users');
      if (!usersJson) {
        toast.error('No registered users found. Please register first.');
        setIsLoading(false);
        return;
      }
      const users = JSON.parse(usersJson) as Array<any>;
      const found = users.find((u) => u.email === identifier || u.memberId === identifier);
      if (!found) {
        toast.error('No account matches that email or member ID');
        setIsLoading(false);
        return;
      }
      if (found.password !== password) {
        toast.error('Invalid credentials');
        setIsLoading(false);
        return;
      }
      localStorage.setItem('userName', found.firstName || found.email || found.memberId);
      localStorage.setItem('memberId', found.memberId);
      const role = (typeof found.role === 'string' && found.role) || '';
      localStorage.setItem('role', role || 'member');
      localStorage.setItem('isLoggedIn', 'true');
      const isAdminFallback = ['super_admin', 'state_admin', 'district_admin', 'block_admin'].includes(role);

      let adminPath = '/block-admin/dashboard';
      if (role === 'district_admin') adminPath = '/district-admin/dashboard';
      else if (role === 'state_admin') adminPath = '/state-admin/dashboard';
      else if (role === 'super_admin') adminPath = '/super-admin/dashboard';

      navigate(isAdminFallback ? adminPath : '/member/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Login failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // if already logged in, redirect to dashboard
  useEffect(() => {
    const logged = localStorage.getItem('isLoggedIn');
    if (logged === 'true') {
      const role = localStorage.getItem('role') || '';
      let adminPath = '/block-admin/dashboard';
      if (role === 'district_admin') adminPath = '/district-admin/dashboard';
      else if (role === 'state_admin') adminPath = '/state-admin/dashboard';
      else if (role === 'super_admin') adminPath = '/super-admin/dashboard';

      navigate(role.endsWith('_admin') ? adminPath : '/member/dashboard');
    }
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left Panel - Blue Welcome Section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-8 flex-col justify-between text-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full filter blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <img
              src={activLogo}
              alt="ACTIV logo"
              className="w-20 h-20 object-contain brightness-0 invert"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold mb-3">
                Welcome to <br />ACTIVian Platform! 👋
              </h1>
              <p className="text-lg text-blue-100 italic">
                "Empowering Communities, Simplifying Lives"
              </p>
            </div>

            <div className="text-blue-100 text-base">
              <p className="leading-relaxed">
                Our digital platform connects communities with essential services and resources.
                Whether you're managing applications, accessing member benefits, or exploring business
                opportunities, we're here to make your journey seamless and transparent.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-blue-100 text-xs">
          © Copyright 2024 - All rights Reserved
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-white overflow-auto">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Logo */}
          <div className="md:hidden text-center">
            <img
              src={activLogo}
              alt="ACTIV logo"
              className="w-20 h-20 object-contain mx-auto mb-3"
            />
          </div>

          {/* Logo and Title */}
          <div className="text-center space-y-3">
            <div className="hidden md:flex items-center justify-center gap-3 mb-3">
              <img
                src={activLogo}
                alt="ACTIV logo"
                className="w-14 h-14 object-contain"
              />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Log In to your Account</h2>
          </div>

          {/* Login Form */}
          <form onSubmit={handleUnifiedSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email or Member ID
              </label>
              <Input
                type="text"
                placeholder="Enter your email or ID"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full h-11 px-4 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Continue"}
            </Button>

            {/* Terms and Privacy */}
            <p className="text-xs text-center text-gray-500 leading-relaxed">
              By clicking on proceed, you have read and agree to the{" "}
              <Link to="/terms" className="text-blue-600 hover:underline">
                Terms of Use
              </Link>{" "}
              &{" "}
              <Link to="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </form>

          {/* Social Login Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or Login with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin("Google")}
              className="w-11 h-11 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              <FaGoogle className="w-5 h-5 text-red-500" />
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("Facebook")}
              className="w-11 h-11 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              <FaFacebook className="w-5 h-5 text-blue-600" />
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("Apple")}
              className="w-11 h-11 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              <FaApple className="w-5 h-5 text-gray-900" />
            </button>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
              Create new account now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
