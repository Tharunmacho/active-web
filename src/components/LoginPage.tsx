import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { FaGoogle, FaFacebook, FaLinkedin } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSocialLogin = (provider: string) => {
    // Implement social login logic here
    console.log(`Logging in with ${provider}`);
  };

  const navigate = useNavigate();

  // Map special admin emails to roles
  
  const idToRole = (id: string): string => {
    const s = (id || '').toUpperCase();
    if (s.startsWith('BA')) return 'block_admin';
    if (s.startsWith('DA')) return 'district_admin';
    if (s.startsWith('SA')) return 'state_admin';
    if (s.startsWith('SU')) return 'super_admin';
    return 'member';
  };
const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Try backend login first
      try {
        const res = await fetch('http://localhost:4000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, password }),
        });

        if (res.ok) {
          const json = await res.json();
          const found = json.user;
          localStorage.setItem('userName', found.firstName || found.email || found.memberId);
          localStorage.setItem('memberId', found.memberId);
if (found && found.role) localStorage.setItem('role', found.role);
const roleDerived: string = (found && typeof found.role === 'string' && found.role) || emailToRole((found && found.email) ? found.email : email);
localStorage.setItem('role', roleDerived);
localStorage.setItem('isLoggedIn', 'true');
const isAdmin = ['super_admin','state_admin','district_admin','block_admin'].includes(roleDerived);
const adminPath = roleDerived === 'block_admin' ? '/admin/block/dashboard' : '/admin/dashboard';
navigate(isAdmin ? adminPath : '/member/dashboard');
return;
        }
      } catch (err) {
        // no backend â€” fallback to localStorage
      }

      const usersJson = localStorage.getItem('users');
      if (!usersJson) {
        toast.error('No registered users found. Please register first.');
        return;
      }

      const users = JSON.parse(usersJson) as Array<any>;
      // allow login by email or memberId
      const found = users.find((u) => u.email === email || u.memberId === email);
      if (!found) {
        toast.error('No account matches that email or member ID');
        return;
      }

      if (found.password !== password) {
        toast.error('Invalid credentials');
        return;
      }

      localStorage.setItem('userName', found.firstName || found.email || found.memberId);
localStorage.setItem('memberId', found.memberId);
if (found && found.role) localStorage.setItem('role', found.role);
const roleDerived: string = (found && typeof found.role === 'string' && found.role) || emailToRole((found && found.email) ? found.email : email);
localStorage.setItem('role', roleDerived);
localStorage.setItem('isLoggedIn', 'true');
const isAdminFallback = ['super_admin','state_admin','district_admin','block_admin'].includes(roleDerived);
const adminPath = roleDerived === 'block_admin' ? '/admin/block/dashboard' : '/admin/dashboard';
navigate(isAdminFallback ? adminPath : '/member/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Login failed. Please try again later.');
    }
  };

  // if already logged in, redirect to dashboard
  useEffect(() => {
    const logged = localStorage.getItem('isLoggedIn');
    if (logged === 'true') {
  const role = localStorage.getItem('role') || '';
  const adminPath = role === 'block_admin' ? '/admin/block/dashboard' : '/admin/dashboard';
  navigate(role.endsWith('_admin') ? adminPath : '/member/dashboard');
}
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6 bg-white/95 backdrop-blur shadow-xl rounded-2xl">
        <div className="text-center space-y-2">
          <div className="inline-block p-2 rounded-full bg-blue-100 mb-2">
            <img
              src="/placeholder.svg"
              alt="Logo"
              className="w-12 h-12"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ACTIV Portal</h1>
          <p className="text-gray-500">Sign in to your account or create a new one</p>
        </div>
                <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="w-full hover:bg-transparent"
              onClick={() => handleSocialLogin("Google")}
            >
              <FaGoogle className="w-5 h-5 text-red-500" />
            </Button>
            <Button
              variant="outline"
              className="w-full hover:bg-transparent"
              onClick={() => handleSocialLogin("Facebook")}
            >
              <FaFacebook className="w-5 h-5 text-blue-600" />
            </Button>
            <Button
              variant="outline"
              className="w-full hover:bg-transparent"
              onClick={() => handleSocialLogin("LinkedIn")}
            >
              <FaLinkedin className="w-5 h-5 text-blue-700" />
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                Forget Password?
              </a>
            </div>
            <Button type="submit" className="w-full bg-blue-600 text-white">
              Sign In
            </Button>
          </form>
        </div>

        <div className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 hover:text-blue-500">
            Register as member
          </a>
        </div>
      </Card>
    </div>
  );
}







