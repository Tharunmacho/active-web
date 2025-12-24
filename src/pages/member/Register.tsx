import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { register as registerUser } from "@/services/authService";
import { INDIA_DISTRICTS } from "@/data/india-districts";
import axios from "axios";

const activLogo = "/logo_ACTIVian-removebg-preview.png";

const MemberRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Location API state
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<string[]>([]);
  const [loadingBlocks, setLoadingBlocks] = useState(false);

  const [partialData, setPartialData] = useState<any>({});

  // Location API base URL
  const LOCATION_API_BASE_URL = "http://localhost:4000/api";

  type Step1Form = {
    firstName?: string;
    mobile?: string;
    email: string;
    password: string;
    confirmPassword?: string;
  };

  type Step2Form = {
    stateName?: string;
    districtName?: string;
    block?: string;
    city?: string;
  };

  const { register: registerStep1, handleSubmit: handleSubmitStep1, formState: { errors: errorsStep1 } } = useForm<Step1Form>({ mode: 'onSubmit' });
  const { register: registerStep2, handleSubmit: handleSubmitStep2, control: controlStep2, watch: watchStep2, setValue: setValueStep2, formState: { errors: errorsStep2 } } = useForm<Step2Form>({
    mode: 'onSubmit',
    defaultValues: { stateName: '', districtName: '', block: '', city: '' },
  });

  // Watch for state and district changes
  const selectedState = watchStep2('stateName');
  const selectedDistrict = watchStep2('districtName');

  // Fetch states on mount
  useEffect(() => {
    const stateNames = Object.keys(INDIA_DISTRICTS);
    setStates(stateNames);
  }, []);

  // Fetch districts when state changes
  useEffect(() => {
    if (!selectedState) {
      setDistricts([]);
      setBlocks([]);
      return;
    }

    const districtList = INDIA_DISTRICTS[selectedState] || [];
    setDistricts(districtList);
    setValueStep2('districtName', '');
    setValueStep2('block', '');
    setBlocks([]);
  }, [selectedState, setValueStep2]);

  // Fetch blocks when district changes
  useEffect(() => {
    const fetchBlocks = async () => {
      if (!selectedState || !selectedDistrict) {
        setBlocks([]);
        return;
      }

      try {
        setLoadingBlocks(true);
        const response = await axios.get(
          `${LOCATION_API_BASE_URL}/locations/states/${encodeURIComponent(selectedState)}/districts/${encodeURIComponent(selectedDistrict)}/blocks`
        );

        if (response.data && response.data.data) {
          setBlocks(response.data.data);
        } else {
          setBlocks([]);
        }
        setValueStep2('block', '');
      } catch (error) {
        const fallbackBlocks = [`${selectedDistrict} Block 1`, `${selectedDistrict} Block 2`, `${selectedDistrict} Block 3`];
        setBlocks(fallbackBlocks);
        setValueStep2('block', '');
      } finally {
        setLoadingBlocks(false);
      }
    };

    fetchBlocks();
  }, [selectedState, selectedDistrict, setValueStep2]);

  const handleStep1Submit = (data: Step1Form) => {
    console.log('Step 1 form data:', data);
    if (data.confirmPassword && data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setPartialData(data);
    setStep(2);
  };

  const handleStep2Submit = async (data: Step2Form) => {
    try {
      if (partialData.confirmPassword && partialData.password !== partialData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      // Validate required fields
      if (!partialData.email || !partialData.password) {
        toast.error('Email and password are required');
        return;
      }

      const registrationData = {
        fullName: partialData.firstName || '',
        email: partialData.email,
        phoneNumber: partialData.mobile || '',
        password: partialData.password,
        confirmPassword: partialData.confirmPassword || partialData.password,
        state: data.stateName || '',
        district: data.districtName || '',
        block: data.block || '',
        city: data.city || ''
      };

      console.log('Sending registration data:', {
        ...registrationData,
        password: '***',
        confirmPassword: '***'
      });

      toast.loading('Registering your account...');
      const response = await registerUser(registrationData);
      toast.dismiss();

      console.log('Registration response:', response);

      if (response.success && response.data) {
        toast.success('Registration successful! Welcome to ACTIVian Portal');

        // Store authentication token
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }

        const completeUserData = {
          firstName: partialData.firstName || '',
          email: partialData.email,
          phone: partialData.mobile || '',
          mobile: partialData.mobile || '',
          state: data.stateName || '',
          district: data.districtName || '',
          block: data.block || '',
          city: data.city || '',
          memberId: response.data.user.id,
        };

        localStorage.setItem('userProfile', JSON.stringify(completeUserData));
        localStorage.setItem('registrationData', JSON.stringify(completeUserData));
        localStorage.setItem('memberId', response.data.user.id);

        console.log('Registration successful, navigating to dashboard...');
        
        // Navigate to unpaid dashboard
        setTimeout(() => {
          navigate('/member/unpaid-dashboard', { replace: true });
        }, 500);
      } else {
        // Show specific error messages
        if (response.message?.includes('already registered')) {
          toast.error('This email is already registered. Please login or use a different email.');
        } else {
          toast.error(response.message || 'Registration failed. Please try again.');
        }
      }
    } catch (error: any) {
      toast.dismiss();
      console.error('Registration exception:', error);
      toast.error(error.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left Panel - Blue Welcome Section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 p-8 flex-col justify-between text-white relative overflow-hidden">
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
                Join ACTIVian <br />Community! 👋
              </h1>
              <p className="text-lg text-blue-100 italic">
                "Your Journey to Empowerment Starts Here"
              </p>
            </div>

            <div className="text-blue-100 text-base">
              <p className="leading-relaxed mb-4">
                Become a member of ACTIVian and unlock access to exclusive benefits,
                community resources, and business opportunities designed to empower your growth.
              </p>

              {/* Registration Steps Indicator */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-white font-bold mb-4">Quick Registration</h3>
                <div className="space-y-3">
                  <div className={`flex items-center gap-3 ${step === 1 ? 'text-white' : 'text-blue-200'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 1 ? 'bg-white text-blue-600' : 'bg-white/20'
                      }`}>
                      1
                    </div>
                    <span className="font-semibold">Email & Password (Required)</span>
                  </div>
                  <div className={`flex items-center gap-3 ${step === 2 ? 'text-white' : 'text-blue-200'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 2 ? 'bg-white text-blue-600' : 'bg-white/20'
                      }`}>
                      2
                    </div>
                    <span className="font-semibold">Profile Details (Optional)</span>
                  </div>
                </div>
                <p className="text-blue-100 text-xs mt-4 italic">
                  💡 You can skip Step 2 and complete your profile later from the dashboard
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-blue-100 text-xs">
          © Copyright 2024 - All rights Reserved
        </div>
      </div>

      {/* Right Panel - Registration Form */}
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
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Create Your Account</h2>
            <p className="text-sm text-gray-600">Step {step} of 2</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>

          {/* Form Card */}
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
              <CardTitle className="text-xl">
                {step === 1 ? 'Account Credentials (Required)' : 'Profile Details'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {step === 1 ? (
                <form onSubmit={handleSubmitStep1(handleStep1Submit)} className="space-y-4">
                  <div>
                    <Label htmlFor="firstName">Full Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter your full name"
                      className="h-11"
                      {...registerStep1('firstName')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="mobile">Phone Number</Label>
                    <Input
                      id="mobile"
                      placeholder="+91 XXXXXXXXXX"
                      className="h-11"
                      {...registerStep1('mobile')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address*</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="h-11"
                      {...registerStep1('email', {
                        required: 'Email required',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
                      })}
                    />
                    {errorsStep1.email && <p className="text-xs text-red-600 mt-1">{errorsStep1.email.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="password">Password*</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter Password"
                      className="h-11"
                      {...registerStep1('password', {
                        required: 'Password required',
                        minLength: { value: 6, message: 'At least 6 characters' },
                      })}
                    />
                    {errorsStep1.password && <p className="text-xs text-red-600 mt-1">{errorsStep1.password.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm Password"
                      className="h-11"
                      {...registerStep1('confirmPassword')}
                    />
                  </div>

                  <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/" className="text-blue-600 hover:text-blue-700 font-semibold">
                      Sign in
                    </Link>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleSubmitStep2(handleStep2Submit)} className="space-y-4">
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Controller
                      control={controlStep2}
                      name="stateName"
                      render={({ field }) => (
                        <Select value={field.value || ''} onValueChange={(v: string) => field.onChange(v)}>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {states.map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="district">District</Label>
                    <Controller
                      control={controlStep2}
                      name="districtName"
                      render={({ field }) => (
                        <Select
                          value={field.value || ''}
                          onValueChange={(v: string) => field.onChange(v)}
                          disabled={!selectedState}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder={!selectedState ? 'Please select state first' : 'Select district'} />
                          </SelectTrigger>
                          <SelectContent>
                            {districts.map((d) => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="block">Block</Label>
                    <Controller
                      control={controlStep2}
                      name="block"
                      render={({ field }) => (
                        <Select
                          value={field.value || ''}
                          onValueChange={(v: string) => field.onChange(v)}
                          disabled={!selectedDistrict || loadingBlocks}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder={
                              !selectedDistrict ? 'Please select district first' : loadingBlocks ? 'Loading blocks...' : 'Select block'
                            } />
                          </SelectTrigger>
                          <SelectContent>
                            {blocks.map((b) => (
                              <SelectItem key={b} value={b}>{b}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Enter city name"
                      className="h-11"
                      {...registerStep2('city')}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 h-11"
                        onClick={() => setStep(1)}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button type="submit" className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                        Complete Registration
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full h-11 text-gray-600 hover:text-gray-900"
                      onClick={() => handleStep2Submit({ stateName: '', districtName: '', block: '', city: '' })}
                    >
                      Skip & Go to Dashboard
                    </Button>
                  </div>

                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/" className="text-blue-600 hover:text-blue-700 font-semibold">
                      Sign in
                    </Link>
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MemberRegister;
