import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { CreditCard, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { classifyIdentifier, getIdentifierErrorMessage } from '../utils/identifier.js';

export default function Signup() {
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || !identifier || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const identifierData = classifyIdentifier(identifier);

    if (!identifierData.isValid) {
      setError(getIdentifierErrorMessage());
      setLoading(false);
      return;
    }

    const { error } = await signUp(identifierData.value, password, name);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[url('/mobile-form-bg.webp')] lg:bg-[url('/form-bg.png')] bg-cover bg-center relative">
      <div className="w-[90%] lg:w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-4 lg:p-8 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 lg:left-auto -right-36 xl:-right-16 2xl:right-10">
        <div className="space-y-1 mb-4">
          {/* <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <CreditCard className="w-10 h-10 text-blue-600" />
            <span className="text-3xl font-bold text-slate-800">Visiting Links</span>
          </Link> */}
          <img src="/form-icon.svg" alt="logo" className="h-8 lg:h-12 object-contain mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Create Your Account</h1>
          <p className="text-slate-600">Start building your digital presence today</p>
        </div>

        <div className="bg-white">
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="John Doe"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address or Phone Number
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="Email or Phone Number"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Must be at least 6 characters</p>
            </div>

            <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 disabled:opacity-50 mt-6 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
