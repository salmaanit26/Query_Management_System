import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { authAPI } from "../services/api";
import { Building, Mail, Lock, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Load Google Identity Services
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            callback: handleGoogleSignIn,
            auto_select: false,
            cancel_on_tap_outside: false,
            use_fedcm_for_prompt: false, // Disable FedCM to avoid abort errors
          });

          // Render the Google Sign-In button
          setTimeout(() => {
            const buttonDiv = document.getElementById('google-signin-button');
            if (buttonDiv && window.google) {
              window.google.accounts.id.renderButton(buttonDiv, {
                theme: 'outline',
                size: 'large',
                text: 'signin_with',
                width: '100%',
                logo_alignment: 'left'
              });
            }
          }, 500);
        } catch (error) {
          console.error('Google Sign-In initialization error:', error);
          setError("Google Sign-In failed to initialize. Please refresh the page.");
        }
      }
    };

    script.onerror = () => {
      console.error('Failed to load Google GSI script');
      setError("Google Sign-In service is unavailable. Please try again later.");
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleGoogleSignIn = async (response) => {
    try {
      setLoading(true);
      setError("");
      
      console.log('Google Sign-In Response received');
      
      // Send the Google token to your backend
      const result = await authAPI.googleLogin(response.credential);
      
      if (result.data.success) {
        const user = result.data.user;
        login(user);
        
        // Navigate to generic dashboard for all users
        navigate('/dashboard');
      } else {
        setError(result.data.message || "Google sign-in failed");
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login(email, password);
      if (response.data.success) {
        const user = response.data.user;
        login(user);
        
        // Navigate to generic dashboard for all users
        navigate('/dashboard');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Server error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center">
              <Building className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Compliance Portal</h1>
          <p className="text-primary-600">Hi, Welcome Back!</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Google Sign-In for Users */}
          <div className="mb-6">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 mb-3">Sign in with Google</p>
              
              {/* Official Google Sign-In Button */}
              <div id="google-signin-button" className="w-full"></div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          {/* Admin/Worker Login Form */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 text-center">For Admin & Workers</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
