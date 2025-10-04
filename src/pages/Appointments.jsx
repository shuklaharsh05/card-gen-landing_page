import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { apiService } from '../lib/api.js';
import { Calendar, Mail, Phone, MessageSquare } from 'lucide-react';

export default function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;

      const response = await apiService.getAppointments(user._id);
      console.log('Appointments API response:', response);
      
      if (response.success && response.data) {
        // Ensure appointments is always an array
        setAppointments(Array.isArray(response.data) ? response.data : []);
      } else {
        // If API call fails, set empty array
        console.log('Appointments API failed:', response.error);
        setAppointments([]);
      }

      setLoading(false);
    };

    fetchAppointments();
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
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Appointments</h1>
        <p className="text-slate-600 text-lg">
          Manage your client inquiries and appointment requests
        </p>
      </div>

      {!Array.isArray(appointments) || appointments.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No appointments yet</h3>
          <p className="text-slate-600">
            When people request appointments through your business card, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Array.isArray(appointments) && appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-slate-900">
                      {appointment.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        appointment.status === 'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : appointment.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-4 h-4" />
                      <span>{appointment.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-4 h-4" />
                      <span>{appointment.phone}</span>
                    </div>
                  </div>

                  {appointment.message && (
                    <div className="flex items-start gap-2 text-slate-600 bg-slate-50 p-3 rounded-lg">
                      <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{appointment.message}</p>
                    </div>
                  )}
                </div>

                <div className="text-sm text-slate-500">
                  {new Date(appointment.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {Array.isArray(appointments) && appointments.length > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            Total Appointments: {appointments.length}
          </h3>
          <p className="text-blue-700 text-sm">
            Keep track of all your client inquiries and follow up promptly to grow your business.
          </p>
        </div>
      )}
    </div>
  );
}
