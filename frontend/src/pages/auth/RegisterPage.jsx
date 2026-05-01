import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../stores/authStore';
import logo from '../../assets/Logo.PNG';
import SEO from '../../components/seo/SEO';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const RegisterPage = () => {
  const { register, googleLogin, isAuthenticated, requireGuest, error, clearError } = useAuth();
  const { loading } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    requireGuest('/profile');
  }, [requireGuest]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!email || !username || !password || !passwordConfirm) {
      setFormError('Please fill in all fields');
      return;
    }

    if (password !== passwordConfirm) {
      setFormError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }

    try {
      await register(email, username, password, passwordConfirm);
    } catch (err) {
      setFormError('Registration failed. Please try again.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
    } catch (err) {
      setFormError('Something went wrong with Google sign in');
    }
  };

  if (isAuthenticated && !loading) {
    return null;
  }

  return (
    <>
      <SEO 
        title="Register"
        description="Create your Zignature Semantics account to apply for jobs and access career opportunities."
        noindex={true}
      />
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-[calc(140vh-140px)] bg-primary-50 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <img 
                src={logo} 
                alt="Zignature" 
                className="h-16 mx-auto"
              />
            </Link>
            <h2 className="mt-6 text-3xl font-black text-primary-900 uppercase tracking-tighter">
              Create Account
            </h2>
            <p className="mt-2 text-primary-600 font-medium">
              Join Zignature to find your dream job
            </p>
          </div>

          <div className="bg-white border-4 border-primary-900 p-8 shadow-[8px_8px_0_0_#1e3a8a]">
            {formError && (
              <div className="mb-6 p-3 bg-red-50 border-2 border-red-500">
                <p className="text-red-700 font-mono text-sm">{formError}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="font-mono text-[10px] font-bold text-primary-900 uppercase tracking-widest mb-2 block" htmlFor="email">
                  Email Address
                </label>
                <input 
                  type="email" 
                  id="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border-2 border-primary-900/20 p-3 text-primary-900 font-medium focus:border-primary-900 focus:outline-none focus:ring-0 transition-colors shadow-[4px_4px_0_0_#1e3a8a15] focus:shadow-[4px_4px_0_0_#1e3a8a50]"
                  placeholder="Email Address"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] font-bold text-primary-900 uppercase tracking-widest mb-2 block" htmlFor="username">
                  Username
                </label>
                <input 
                  type="text" 
                  id="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white border-2 border-primary-900/20 p-3 text-primary-900 font-medium focus:border-primary-900 focus:outline-none focus:ring-0 transition-colors shadow-[4px_4px_0_0_#1e3a8a15] focus:shadow-[4px_4px_0_0_#1e3a8a50]"
                  placeholder="Choose a username"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] font-bold text-primary-900 uppercase tracking-widest mb-2 block" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border-2 border-primary-900/20 p-3 pr-12 text-primary-900 font-medium focus:border-primary-900 focus:outline-none focus:ring-0 transition-colors shadow-[4px_4px_0_0_#1e3a8a15] focus:shadow-[4px_4px_0_0_#1e3a8a50]"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-900/50 hover:text-primary-900 font-mono text-xs uppercase"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] font-bold text-primary-900 uppercase tracking-widest mb-2 block" htmlFor="passwordConfirm">
                  Confirm Password
                </label>
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="passwordConfirm"
                  autoComplete="new-password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full bg-white border-2 border-primary-900/20 p-3 text-primary-900 font-medium focus:border-primary-900 focus:outline-none focus:ring-0 transition-colors shadow-[4px_4px_0_0_#1e3a8a15] focus:shadow-[4px_4px_0_0_#1e3a8a50]"
                  placeholder="Confirm your password"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full boxy-btn py-4 text-base"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            {/* Google Oauth */}
            {/* <div className="mt-6 pt-6 border-t-2 border-primary-900/20">
              <p className="text-primary-900/60 font-mono text-xs uppercase tracking-widest mb-4 text-center">Or continue with</p>
              {GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'your-google-client-id' ? (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    setFormError('Something went wrong with Google sign in');
                  }}
                  type="standard"
                  shape="rectangular"
                  theme="outline"
                  text="signup_with"
                  size="large"
                  width="100%"
                />
              ) : (
                <button
                  type="button"
                  className="w-full boxy-btn-secondary py-4 flex items-center justify-center gap-3"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
              )}
            </div> */}
          </div>

          <p className="mt-6 text-center text-primary-900">
            <span className="text-primary-600 font-medium">Already have an account? </span>
            <Link to="/login" className="font-bold hover:underline">
              Sign In
            </Link>
          </p>
         </div>
       </div>
     </GoogleOAuthProvider>
    </>
  );
};

export default RegisterPage;