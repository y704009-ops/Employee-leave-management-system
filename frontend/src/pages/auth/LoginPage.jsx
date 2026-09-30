import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  Shield,
  X,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth, getDashboardForRole } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { validateEmail, validateRequired } from '../../validation/formValidators';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showSuccess } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const errors = {};
    const emailErr = validateEmail(email);
    const passErr = validateRequired(password, 'Password');

    if (emailErr) errors.email = emailErr;
    if (passErr) errors.password = passErr;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);

    try {
      const authUser = await login(email, password);
      showSuccess(`Welcome back, ${authUser.name}!`);

      // Redirect to previous requested page or role-specific dashboard
      const from = location.state?.from?.pathname;
      const targetPath = from && from !== '/login' ? from : getDashboardForRole(authUser.role);
      navigate(targetPath, { replace: true });
    } catch (err) {
      setSubmitError(err.message || 'Invalid email or password. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative selection:bg-brand-500 selection:text-white overflow-hidden">
      {/* Background Architectural Layer: Deep navy radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(30,58,138,0.22),rgba(15,23,42,0.96),#020617)] pointer-events-none" />

      {/* Background Architectural Layer: Subtle technical grid texture */}
      <div className="absolute inset-0 bg-enterprise-dark-grid opacity-35 pointer-events-none [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_40%,transparent_100%)]" />

      {/* Soft atmospheric blue glow centered behind login card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[420px] relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2.5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all duration-200 shadow-2xs group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            title="Return to SkillMate Landing Page"
          >
            <div className="w-5 h-5 rounded-md bg-brand-600 flex items-center justify-center text-white text-[10px] font-mono font-bold shadow-2xs group-hover:scale-105 transition-transform">
              E
            </div>
            <span className="font-mono text-xs font-semibold tracking-wider text-slate-200">
              ELMS PLATFORM
            </span>
          </Link>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              ELMS Enterprise
            </h1>
            <p className="text-xs text-slate-400 font-normal">
              Employee Leave Management System
            </p>
          </div>
        </div>

        {/* Authentication Card */}
        <div className="relative bg-white rounded-2xl border border-slate-200/90 shadow-2xl shadow-slate-950/50 p-6 sm:p-8 backdrop-blur-xs">
          <form noValidate onSubmit={handleSubmit} className="space-y-4">
            {/* Card Header & Security Badge */}
            <div className="space-y-1 pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Sign In to Your Workspace
                </h2>
                <span className="inline-flex items-center gap-1 font-mono text-[9px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full uppercase shrink-0">
                  <Shield className="w-2.5 h-2.5 text-brand-600" />
                  <span>SECURE WORKSPACE</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Enter your official work credentials to access your leave portal.
              </p>
            </div>

            {/* Error Banner */}
            {submitError && (
              <div
                role="alert"
                className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/90 text-rose-900 flex items-start space-x-2.5 animate-in fade-in slide-in-from-top-1 duration-200"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-xs">
                  <div className="font-bold uppercase tracking-wider text-[10px] text-rose-800">
                    Authentication Failed
                  </div>
                  <p className="text-rose-700 mt-0.5 leading-relaxed">{submitError}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitError(null)}
                  className="text-rose-400 hover:text-rose-700 p-0.5 cursor-pointer"
                  aria-label="Dismiss error"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Work Email Field */}
            <Input
              label="Work Email"
              type="email"
              placeholder="e.g. employee@elms.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: null }));
              }}
              error={fieldErrors.email}
              icon={Mail}
              required
              disabled={isLoading}
              autoComplete="email"
            />

            {/* Password Field */}
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: null }));
              }}
              error={fieldErrors.password}
              icon={Lock}
              required
              disabled={isLoading}
              autoComplete="current-password"
            />

            {/* Submit Button */}
            <div className="pt-1.5">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full text-sm font-semibold shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 cursor-pointer"
                isLoading={isLoading}
                disabled={isLoading}
                icon={isLoading ? null : ArrowRight}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>
          </form>
        </div>

        {/* Security Footer Notice & Landing Page Link */}
        <div className="text-center space-y-2">
          <p className="text-[11px] text-slate-400 flex items-center justify-center space-x-1.5 font-normal">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secured with Spring Security &amp; 256-bit JWT Encryption</span>
          </p>
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors py-1 px-2 rounded-md hover:bg-slate-900/60"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to SkillMate Landing Page</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
