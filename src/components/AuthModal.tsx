import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register, triggerToast } = useGlobal();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!isLogin && !name) {
      setError('Please enter your name.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setEmail('');
        setPassword('');
        setName('');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-rose-50/20 transform transition-transform duration-300 scale-100">
        
        {/* Decorative background accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100/30 rounded-full blur-2xl -z-10" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-100/20 rounded-full blur-xl -z-10" />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-800 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <span className="font-serif tracking-widest text-sm text-amber-700/80 uppercase font-semibold">
              Zivora
            </span>
            <h3 className="font-serif text-2xl font-semibold text-zinc-900 mt-1">
              {success ? 'Welcome' : isLogin ? 'Welcome Back' : 'Create Account'}
            </h3>
            <p className="text-sm text-zinc-500 mt-1">
              {success 
                ? 'Authentication successful!' 
                : isLogin 
                  ? 'Sign in to access your orders, cart, and rewards.' 
                  : 'Join Zivora for 15% off your first purchase.'
              }
            </p>
          </div>

          {success ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-200">
                <CheckCircle className="w-8 h-8 text-emerald-500 animate-bounce" />
              </div>
              <p className="text-sm font-medium text-emerald-600">
                Signing you in, please wait...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-600 tracking-wider uppercase block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-amber-600/50 focus:ring-1 focus:ring-amber-600/20 bg-zinc-50/50"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-600 tracking-wider uppercase block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-amber-600/50 focus:ring-1 focus:ring-amber-600/20 bg-zinc-50/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-zinc-600 tracking-wider uppercase block">
                    Password
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      className="text-xs text-amber-700 hover:underline cursor-pointer"
                      onClick={() => triggerToast('Password reset code sent to your email.', 'success')}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-amber-600/50 focus:ring-1 focus:ring-amber-600/20 bg-zinc-50/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm rounded-lg transition-colors shadow-sm duration-200 mt-6 flex items-center justify-center space-x-2 cursor-pointer disabled:bg-zinc-400"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : isLogin ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-zinc-100 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-xs text-zinc-600 hover:text-amber-700 cursor-pointer"
            >
              {isLogin ? (
                <>
                  Don't have an account?{' '}
                  <span className="font-semibold text-zinc-900 hover:text-amber-700 underline underline-offset-4">
                    Sign up now
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <span className="font-semibold text-zinc-900 hover:text-amber-700 underline underline-offset-4">
                    Sign in here
                  </span>
                </>
              )}
            </button>
          </div>

          <div className="mt-4 text-[10px] text-center text-zinc-400">
            By continuing, you agree to Zivora's Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
}
