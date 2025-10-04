import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { apiService } from '../lib/api.js';
import { CreditCard, Calendar, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [userName, setUserName] = useState('User');
  const [stats, setStats] = useState({
    totalAppointments: 0,
    hasCard: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // Get user name from user object
      setUserName(user.user_metadata?.name || 'User');

      // Get dashboard stats
      const response = await apiService.getDashboardStats(user.id);
      if (response.success && response.data) {
        setStats({
          totalAppointments: response.data.totalAppointments,
          hasCard: response.data.hasCard,
        });
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Welcome back, {userName}!
        </h1>
        <p className="text-slate-600 text-lg">
          Here's an overview of your CardPro account
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                stats.hasCard
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {stats.hasCard ? 'Active' : 'Not Created'}
            </span>
          </div>
          <h3 className="text-slate-600 text-sm font-medium mb-1">Business Card</h3>
          <p className="text-2xl font-bold text-slate-900">
            {stats.hasCard ? '1' : '0'}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-slate-600 text-sm font-medium mb-1">Total Appointments</h3>
          <p className="text-2xl font-bold text-slate-900">{stats.totalAppointments}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <h3 className="text-slate-600 text-sm font-medium mb-1">Card Views</h3>
          <p className="text-2xl font-bold text-slate-900">0</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-slate-600 text-sm font-medium mb-1">Growth</h3>
          <p className="text-2xl font-bold text-slate-900">+0%</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-3">
            {stats.hasCard ? 'Update Your Card' : 'Create Your Business Card'}
          </h2>
          <p className="text-blue-100 mb-6">
            {stats.hasCard
              ? 'Keep your business card information up to date and share it with potential clients.'
              : 'Get started by creating your digital business card. It only takes a minute!'}
          </p>
          <Link
            to="/my-card"
            className="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            {stats.hasCard ? 'View Card' : 'Create Card'}
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/my-card"
              className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <CreditCard className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-semibold text-slate-900">Manage Card</p>
                <p className="text-sm text-slate-600">View and edit your business card</p>
              </div>
            </Link>
            <Link
              to="/appointments"
              className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Calendar className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold text-slate-900">View Appointments</p>
                <p className="text-sm text-slate-600">Check your recent inquiries</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
