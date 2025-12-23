import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, Lock } from "lucide-react";
import { toast } from "sonner";
import { login as loginUser } from "@/services/authService";

const MemberLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string; password: string }>({ mode: 'onBlur' });

  // Map special admin emails to roles (also supports prefix formats like block., district., state., super.)
  const emailToRole = (e: string): string => {
    const n = (e || '').trim().toLowerCase();
    if (n.startsWith('block.')) return 'block_admin';
    if (n.startsWith('district.')) return 'district_admin';
    if (n.startsWith('state.')) return 'state_admin';
    if (n.startsWith('super.')) return 'super_admin';
    if (n === 'blockadmin@activ.com') return 'block_admin';
    if (n === 'districtadmin@activ.com') return 'district_admin';
    if (n === 'stateadmin@activ.com') return 'state_admin';
    if (n === 'superadmin@activ.com') return 'super_admin';
    return 'member';
  };
  
  const idToRole = (id: string): string => {
    const s = (id || '').toUpperCase();
    if (s.startsWith('BA')) return 'block_admin';
    if (s.startsWith('DA')) return 'district_admin';
    if (s.startsWith('SA')) return 'state_admin';
    if (s.startsWith('SU')) return 'super_admin';
    return 'member';
  };

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      toast.loading('Logging in...');

      // Call backend API
      const response = await loginUser({
        email: data.email,
        password: data.password
      });

      toast.dismiss();
      setIsLoading(false);

      if (response.success && response.data) {
        toast.success('Login successful!');
        
        // Navigate based on role
        const role = response.data.user.role;
        
        if (role === 'member') {
          navigate('/member/dashboard');
        } else if (role.includes('admin')) {
          navigate('/admin/dashboard');
        } else {
          navigate('/member/dashboard');
        }
      } else {
        toast.error(response.message || 'Invalid email or password');
      }
    } catch (error: any) {
      toast.dismiss();
      setIsLoading(false);
      toast.error(error.message || 'Login failed. Please try again.');
    }
  };

  const handleLegacyLogin = async (data: { email: string; password: string }) => {
    try {
      // Fallback for old localStorage-based login if needed
      try {
        console.log('🔐 Attempting login with:', data.email);
        const res = await fetch('http://localhost:4000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email, password: data.password }),
        });

        console.log('📡 Login response status:', res.status);
        
        if (res.ok) {
          const json = await res.json();
          console.log('✅ Login response:', json);
          const found = json.data?.user || json.user;
          
          // Store token
          if (json.data?.token) {
            localStorage.setItem('token', json.data.token);
          }
          
          // Set memberId for compatibility
          const memberId = found.id || found._id || found.memberId;
          localStorage.setItem('memberId', memberId);

          // Fetch full profile from backend
          try {
            const profileRes = await fetch(`http://localhost:4000/api/profile/${memberId}`);
            if (profileRes.ok) {
              const profileJson = await profileRes.json();
              if (profileJson.profile) {
                localStorage.setItem('userProfile', JSON.stringify({ ...found, ...profileJson.profile }));
              } else {
                // No profile stored on backend yet â€” try to upsert from local registration data
                try {
                  const regJson = localStorage.getItem('registrationData');
                  if (regJson) {
                    const reg = JSON.parse(regJson);
                    const payload = {
                      userId: found.memberId,
                      firstName: reg.firstName || found.firstName,
                      lastName: reg.lastName,
                      email: reg.email || found.email,
                      phone: reg.mobile || reg.phone,
                      dateOfBirth: reg.dob || reg.dateOfBirth,
                      gender: reg.gender,
                      state: reg.state || reg.stateName,
                      district: reg.district || reg.districtName,
                      block: reg.block,
                      address: reg.address,
                    };
                    await fetch('http://localhost:4000/api/profile', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(payload),
                    });
                    localStorage.setItem('userProfile', JSON.stringify({ ...found, ...payload }));
                  } else {
                    localStorage.setItem('userProfile', JSON.stringify(found));
                  }
                } catch (e) {
                  localStorage.setItem('userProfile', JSON.stringify(found));
                }
              }
            } else {
              localStorage.setItem('userProfile', JSON.stringify(found));
            }
          } catch (e) {
            localStorage.setItem('userProfile', JSON.stringify(found));
          }

          // Fetch additional profile details from backend
          try {
            const detailsRes = await fetch(`http://localhost:4000/api/profile/additional-details/${found.memberId}`);
            if (detailsRes.ok) {
              const detailsJson = await detailsRes.json();
              if (detailsJson.record?.details) {
                localStorage.setItem('userProfileDetails', JSON.stringify(detailsJson.record.details));
              }
            }
          } catch (e) {
            // ignore if additional details not found
          }

          // keep registrationData key and ensure it contains merged profile (with district/state if present)
          try {
            const up = localStorage.getItem('userProfile');
            if (up) {
              localStorage.setItem('registrationData', up);
            } else {
              localStorage.setItem('registrationData', JSON.stringify(found));
            }
          } catch {
            localStorage.setItem('registrationData', JSON.stringify(found));
          }

          localStorage.setItem('userName', found.fullName || found.firstName || found.email || data.email);
          const fromEmail = emailToRole(found.email || '');
          const fromId = idToRole(found.memberId || data.email);
          const roleDerived = (typeof found.role === 'string' && found.role)
            || (fromEmail !== 'member' ? fromEmail : (fromId !== 'member' ? fromId : 'member'));
          localStorage.setItem('role', roleDerived || 'member');

          const isAdmin = ['super_admin', 'state_admin', 'district_admin', 'block_admin'].includes(roleDerived);
          if (isAdmin) {
            localStorage.setItem('isAdminLoggedIn', 'true');
            const adminPath = roleDerived === 'block_admin' ? '/admin/block/dashboard' : '/admin/dashboard';
            navigate(adminPath);
          } else {
            localStorage.setItem('isLoggedIn', 'true');
            navigate('/member/dashboard');
          }
          return;
        } else {
          // Login failed - show error from backend
          const errorJson = await res.json();
          console.error('❌ Login failed:', errorJson);
          toast.error(errorJson.message || 'Login failed. Please check your credentials.');
          return;
        }
      } catch (err) {
        console.error('❌ Login error:', err);
        toast.error('Unable to connect to server. Please try again.');
        return;
      }

      const usersJson = localStorage.getItem("users");
      if (!usersJson) {
        toast.error("No registered users found. Please register first.");
        return;
      }

      const users = JSON.parse(usersJson) as Array<any>;
      const found = users.find((u) => u.email === data.email || u.memberId === data.email);
      if (!found) {
        toast.error("No account found with that email");
        return;
      }

      if (found.password !== data.password) {
        toast.error("Invalid credentials");
        return;
      }

      // Persist any available profile data to `userProfile` / `registrationData`
      try {
        // if there is a detailed registrationData stored and it belongs to this member, use that
        const regJson = localStorage.getItem('registrationData');
        if (regJson) {
          try {
            const reg = JSON.parse(regJson);
            if (reg.memberId === found.memberId) {
              localStorage.setItem('userProfile', JSON.stringify(reg));
            } else {
              localStorage.setItem('userProfile', JSON.stringify(found));
            }
          } catch (e) {
            localStorage.setItem('userProfile', JSON.stringify(found));
          }
        } else {
          localStorage.setItem('userProfile', JSON.stringify(found));
        }

        // Also keep a registrationData key (compatibility) â€” prefer the same data stored in userProfile
        try {
          const up = localStorage.getItem('userProfile');
          if (up) {
            localStorage.setItem('registrationData', up);
          } else {
            localStorage.setItem('registrationData', JSON.stringify(found));
          }
        } catch {
          localStorage.setItem('registrationData', JSON.stringify(found));
        }
      } catch (e) {
        // ignore
      }

      // Set logged-in session info (local fallback)
      localStorage.setItem("userName", found.firstName || found.email || data.email);
      localStorage.setItem("memberId", found.memberId || found.email);
      const fromEmail = emailToRole(found.email || '');
      const fromId = idToRole(found.memberId || data.email);
      const roleDerived = (typeof found.role === 'string' && (found.role as string))
        || (fromEmail !== 'member' ? fromEmail : (fromId !== 'member' ? fromId : 'member'));
      localStorage.setItem("role", roleDerived || 'member');

      const isAdmin = ["super_admin", "state_admin", "district_admin", "block_admin"].includes(roleDerived);
      if (isAdmin) {
        localStorage.setItem("isAdminLoggedIn", "true");
        const adminPath = roleDerived === 'block_admin' ? '/admin/block/dashboard' : '/admin/dashboard';
        navigate(adminPath);
      } else {
        localStorage.setItem("isLoggedIn", "true");
        navigate("/member/dashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-strong gradient-card border-0">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-2">
            <UserCircle className="w-10 h-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold">Member Login</CardTitle>
          <CardDescription>Access your Actv member portal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email"
                placeholder="Enter your email" 
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Please enter a valid email'
                  }
                })} 
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" {...register('password', { required: 'Password is required' })} />
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
            </div>
            <div className="flex justify-end">
              <Link to="/member/forgot-password" className="text-sm text-primary hover:underline">
                Forgot Password?
              </Link>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              <Lock className="w-4 h-4 mr-2" />
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            <div className="text-center text-sm">
              <span className="text-muted-foreground">New Member? </span>
              <Link to="/member/register" className="text-primary hover:underline font-medium">
                Register Here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberLogin;

