import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { apiService } from '../lib/api.js';
import { Calendar, Mail, Phone, MessageSquare, Filter, User, CreditCard, Download, Calendar as CalendarIcon } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]); // Store all appointments for client-side filtering
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: ''
  });
  const [userCard, setUserCard] = useState(null); // Single card for the user
  const [loadingCard, setLoadingCard] = useState(false);

  // Fetch user's single card
  const fetchUserCard = async () => {
    if (!user) return;

    setLoadingCard(true);
    try {
      console.log('🔍 Fetching user card for user:', user._id);
      
      // Get complete user data to access inquiries
      const userResponse = await apiService.getUserById(user._id);
      
      if (userResponse.success && userResponse.data) {
        const userData = userResponse.data;
        console.log('🔍 User data:', userData);
        
        // Check if user has inquiries with generated cards
        if (userData.inquiries && Array.isArray(userData.inquiries) && userData.inquiries.length > 0) {
          console.log('🔍 User has inquiries:', userData.inquiries);
          
          // Get the latest inquiry with a generated card
          for (let i = userData.inquiries.length - 1; i >= 0; i--) {
            const inquiryRef = userData.inquiries[i];
            let inquiry;
            
            if (typeof inquiryRef === 'string') {
              // If it's an ID, fetch the inquiry data
              const inquiryResponse = await apiService.getInquiryById(inquiryRef);
              if (inquiryResponse.success && inquiryResponse.data) {
                inquiry = inquiryResponse.data;
              }
            } else {
              // If it's already a full object, use it directly
              inquiry = inquiryRef;
            }
            
            if (inquiry && inquiry.cardGenerated === true && inquiry.cardId) {
              console.log('🔍 Found card with ID:', inquiry.cardId);
              
              // Fetch the card data to get display information
              const cardResponse = await apiService.getCardById(inquiry.cardId);
              if (cardResponse.success && cardResponse.data) {
                const cardData = cardResponse.data;
                console.log('🔍 Card data:', cardData);
                const userCardData = {
                  id: inquiry.cardId,
                  name: cardData.card.data.companyName || cardData.card.data.storeName || 'Business Card',
                  businessType: cardData.card.categoryId || cardData.businessType || 'Business',
                  email: cardData.card.email,
                  createdAt: inquiry.createdAt || inquiry.created_at,
                  inquiryId: inquiry._id
                };
                
                console.log('🔍 Found user card:', userCardData);
                setUserCard(userCardData);
                setLoadingCard(false);
                return;
              }
            }
          }
          
          console.log('🔍 No generated cards found');
          setUserCard(null);
        } else {
          console.log('🔍 No inquiries found for user');
          setUserCard(null);
        }
      }
    } catch (error) {
      console.error('🔍 Error fetching user card:', error);
      setUserCard(null);
    } finally {
      setLoadingCard(false);
    }
  };

  const fetchAppointments = async (status = '') => {
    if (!user || !userCard) return;

    setLoading(true);
    
    try {
      // Fetch all appointments for user's card
      console.log('🎯 Calling getCardAppointments with:', { 
        cardId: userCard.id, 
        status
      });
      const response = await apiService.getCardAppointments(userCard.id, {
        page: 1,
        limit: 1000, // Fetch a large number to get all appointments
        status: status && status.trim() !== '' ? status : undefined
      });
      
      console.log('Appointments API response:', response);
      
      if (response.success && response.data) {
        if (response.data.appointments) {
          // Handle paginated response for card appointments
          const fetchedAppointments = Array.isArray(response.data.appointments) ? response.data.appointments : [];
          setAllAppointments(fetchedAppointments);
          setAppointments(fetchedAppointments);
        } else {
          // Handle non-paginated response
          const fetchedAppointments = Array.isArray(response.data) ? response.data : [];
          setAllAppointments(fetchedAppointments);
          setAppointments(fetchedAppointments);
        }
      } else {
        console.log('Appointments API failed:', response.error);
        setAllAppointments([]);
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAllAppointments([]);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering function
  const applyFilters = (status = '', startDate = '', endDate = '') => {
    console.log('🔍 Applying client-side filters:', { status, startDate, endDate });
    
    let filteredAppointments = [...allAppointments];
    
    // Filter by status
    if (status && status.trim() !== '') {
      filteredAppointments = filteredAppointments.filter(appointment => 
        appointment.status && appointment.status.toLowerCase() === status.toLowerCase()
      );
    }
    
    // Filter by date range
    if (startDate && startDate.trim() !== '') {
      const start = new Date(startDate);
      filteredAppointments = filteredAppointments.filter(appointment => {
        const appointmentDate = new Date(appointment.created_at || appointment.createdAt);
        return appointmentDate >= start;
      });
    }
    
    if (endDate && endDate.trim() !== '') {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the entire end date
      filteredAppointments = filteredAppointments.filter(appointment => {
        const appointmentDate = new Date(appointment.created_at || appointment.createdAt);
        return appointmentDate <= end;
      });
    }
    
    console.log('🔍 Filtered appointments:', filteredAppointments);
    setAppointments(filteredAppointments);
  };

  // Fetch appointments when user or card changes
  useEffect(() => {
    if (user && userCard) {
      fetchAppointments(filters.status);
    }
  }, [user, userCard]);

  // Apply client-side filters when filters change
  useEffect(() => {
    if (allAppointments.length > 0) {
      applyFilters(filters.status, filters.startDate, filters.endDate);
    }
  }, [filters.status, filters.startDate, filters.endDate, allAppointments]);

  // Fetch user's card when component mounts
  useEffect(() => {
    if (user) {
      fetchUserCard();
    }
  }, [user]);


  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }


  const handleStatusFilter = (status) => {
    console.log('📊 Status filter changed:', status);
    setFilters(prev => ({ ...prev, status }));
  };

  const handleDateFilter = (field, value) => {
    console.log('🗓️ Date filter changed:', { field, value });
    setFilters(prev => {
      const newFilters = { ...prev, [field]: value };
      console.log('🗓️ New filters state:', newFilters);
      return newFilters;
    });
  };

  const clearFilters = () => {
    console.log('🧹 Clearing all filters');
    setFilters({ status: '', startDate: '', endDate: '' });
  };


  // Export appointments to Excel using xlsx library
  const exportToExcel = () => {
    if (!appointments || appointments.length === 0) {
      alert('No appointments to export');
      return;
    }

    console.log('📊 Exporting appointments to Excel:', appointments);

    // Prepare data for Excel
    const excelData = appointments.map(appointment => ({
      'Name': appointment.name || '',
      'Email': appointment.email || '',
      'Phone': appointment.phone || '',
      'Status': appointment.status || '',
      'Message': appointment.message || '',
      'Date': new Date(appointment.created_at || appointment.createdAt).toLocaleDateString('en-US')
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const colWidths = [
      { wch: 20 }, // Name
      { wch: 30 }, // Email
      { wch: 15 }, // Phone
      { wch: 12 }, // Status
      { wch: 40 }, // Message
      { wch: 12 }  // Date
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Appointments');

    // Generate Excel file with proper format
    const fileName = `appointments_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Generate the Excel file as a buffer
    const excelBuffer = XLSX.write(wb, { 
      bookType: 'xlsx', 
      type: 'array' 
    });
    
    // Create blob and download
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('📊 Excel file generated and downloaded:', fileName);
  };

  return (
    <div className="max-w-[95rem] mx-auto font-poppins">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Appointments</h1>
            <p className="text-slate-600 text-lg">
              Manage your client inquiries and appointment requests
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {appointments.length > 0 && (
              <button
                onClick={exportToExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export to Excel
              </button>
            )}
          </div>
        </div>


        {/* Filter Controls */}
        <div className="mt-6 bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className='flex-1'>
                <label className="block text-sm font-normal text-slate-700 mb-2">
                  Status Filter
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              
              <div className='flex-1'>
                <label className="block text-sm font-normal text-slate-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleDateFilter('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className='flex-1'>
                <label className="block text-sm font-normal text-slate-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleDateFilter('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-end justify-between">
                <button
                  onClick={clearFilters}
                  className="px-4 py-[9px] text-base text-slate-600 hover:text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
            
            
            
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              {loadingCard ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-blue-700">Loading your card...</span>
                </div>
              ) : userCard ? (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-900" />
                    <span className="text-base font-normal text-black">
                      Showing appointments for: <span className="font-semibold">{userCard.name}</span> ({userCard.businessType})
                      {/* {console.log('userCard', userCard)} */}
                    </span>
                  </div>
                  <div>
                    {Array.isArray(appointments) && appointments.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Total Appointments: {appointments.length}
                          </h3>
                        </div>
                      )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700">
                    No card found. Create a business card first to view appointments.
                  </span>
                </div>
              )}
            </div>
          </div>
      </div>

      {!Array.isArray(appointments) || appointments.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No appointments found
          </h3>
          <p className="text-slate-600">
            {!userCard
              ? 'You need to create a business card first. Go to "My Card" to create one.'
              : 'No appointments have been booked for this card yet.'
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Message</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {Array.isArray(appointments) && appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-normal text-slate-900">
                      {appointment.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {appointment.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {appointment.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          appointment.status === 'pending' || appointment.status === 'Pending'
                            ? 'bg-amber-100 text-amber-700'
                            : appointment.status === 'confirmed' || appointment.status === 'Confirmed'
                            ? 'bg-green-100 text-green-700'
                            : appointment.status === 'cancelled' || appointment.status === 'Cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs">
                      {appointment.message ? (
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span className="truncate" title={appointment.message}>
                            {appointment.message}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(appointment.created_at || appointment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* {Array.isArray(appointments) && appointments.length > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            Total Appointments: {appointments.length}
          </h3>
          <p className="text-blue-700 text-sm">
            Keep track of all your client inquiries and follow up promptly to grow your business.
          </p>
        </div>
      )} */}
    </div>
  );
}
