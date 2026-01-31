import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { apiService } from '../lib/api.js';
import { CreditCard, Calendar, Users, Share2, Heart, Download } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('User');
  const [stats, setStats] = useState({
    cardAppointments: 0,
    hasCard: false,
    cardViews: 0,
    cardShares: 0,
    cardLikes: 0,
    cardDownloads: 0,
    cardData: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // If user has no inquiries, send them to My Card to submit one (no need to fetch)
      if (!user.inquiries || !Array.isArray(user.inquiries) || user.inquiries.length === 0) {
        setLoading(false);
        navigate('/my-card', { replace: true });
        return;
      }

      console.log('Dashboard - User object:', user);
      console.log('Dashboard - User ID:', user._id);

      try {
        // Get complete user data
        const userResponse = await apiService.getUserById(user._id);
        console.log('Dashboard - getUserById response:', userResponse);

        if (userResponse.success && userResponse.data) {
          const userData = userResponse.data;
          console.log('Dashboard - User data:', userData);
          console.log('Dashboard - Complete user data from API:', JSON.stringify(userData, null, 2));

          // If user has no inquiries, send them to My Card to submit one
          if (!userData.inquiries || !Array.isArray(userData.inquiries) || userData.inquiries.length === 0) {
            setLoading(false);
            navigate('/my-card', { replace: true });
            return;
          }

          // Get user name
          setUserName(userData.name || 'User');

          // Check if user has a card by looking for inquiries with cardId (same approach as My Card page)
          let userCard = null;
          let cardAppointments = 0;
          let cardViews = 0;
          let cardShares = 0;
          let cardLikes = 0;
          let cardDownloads = 0;

          console.log('Dashboard - User inquiries:', userData.inquiries);

          if (userData.inquiries && Array.isArray(userData.inquiries) && userData.inquiries.length > 0) {
            // Get the latest inquiry (same as My Card page)
            const latestInquiry = userData.inquiries[userData.inquiries.length - 1];
            console.log('Dashboard - Latest inquiry:', latestInquiry);

            let inquiry;
            if (typeof latestInquiry === 'string') {
              // If it's an ID, fetch the inquiry data
              console.log('Dashboard - Fetching inquiry data for ID:', latestInquiry);
              const inquiryResponse = await apiService.getInquiryById(latestInquiry);
              console.log('Dashboard - inquiryResponse:', inquiryResponse);

              if (inquiryResponse.success && inquiryResponse.data) {
                inquiry = inquiryResponse.data;
              }
            } else {
              // If it's already a full object, use it directly
              console.log('Dashboard - Using inquiry object directly');
              inquiry = latestInquiry;
            }

            if (inquiry) {
              console.log('Dashboard - inquiry data:', inquiry);
              console.log('Dashboard - cardGenerated:', inquiry.cardGenerated);
              console.log('Dashboard - cardId:', inquiry.cardId);

              // Check if inquiry has cardGenerated and cardId (same logic as My Card page)
              if (inquiry.cardGenerated === true && inquiry.cardId) {
                console.log('Dashboard - Found generated inquiry with cardId:', inquiry);

                userCard = {
                  id: inquiry.cardId,
                  inquiryId: inquiry._id
                };

                // Fetch the card data (same as My Card page)
                console.log('Dashboard - Fetching card with ID:', inquiry.cardId);
                const cardResponse = await apiService.getCardById(inquiry.cardId);
                console.log('Dashboard - cardResponse:', cardResponse);

                if (cardResponse.success && cardResponse.data) {
                  console.log('Dashboard - Successfully fetched card data:', cardResponse.data);
                  userCard.data = cardResponse.data;

                  const cardStatsSource = cardResponse.data.card || cardResponse.data;

                  cardViews =
                    cardStatsSource?.views ??
                    cardStatsSource?.totalViews ??
                    0;
                  cardShares =
                    cardStatsSource?.shares ??
                    cardStatsSource?.totalShares ??
                    0;
                  cardLikes =
                    cardStatsSource?.likes ??
                    cardStatsSource?.totalLikes ??
                    0;
                  cardDownloads =
                    cardStatsSource?.downloads ??
                    cardStatsSource?.totalDownloads ??
                    0;

                  console.log('Dashboard - Card views:', cardViews);
                  console.log('Dashboard - Card shares:', cardShares);
                  console.log('Dashboard - Card likes:', cardLikes);
                  console.log('Dashboard - Card downloads:', cardDownloads);
                }

                // Fetch appointments for this card
                const appointmentsResponse = await apiService.getCardAppointments(inquiry.cardId, {
                  page: 1,
                  limit: 1000
                });

                console.log('Dashboard - Appointments response:', appointmentsResponse);

                if (appointmentsResponse.success && appointmentsResponse.data) {
                  if (appointmentsResponse.data.appointments) {
                    cardAppointments = appointmentsResponse.data.appointments.length;
                  } else if (Array.isArray(appointmentsResponse.data)) {
                    cardAppointments = appointmentsResponse.data.length;
                  }
                  console.log('Dashboard - Card appointments:', cardAppointments);
                }
              }
            }
          }

          setStats({
            cardAppointments,
            hasCard: !!userCard,
            cardViews,
            cardShares,
            cardLikes,
            cardDownloads,
            cardData: userCard,
          });

        } else {
          // Fallback to basic user data
          setUserName(user.name || 'User');
          setStats({
            cardAppointments: 0,
            hasCard: false,
            cardViews: 0,
            cardShares: 0,
            cardLikes: 0,
            cardDownloads: 0,
            cardData: null,
          });
        }
      } catch (error) {
        console.log('Dashboard - Error fetching user data:', error);
        // Fallback to basic user data
        setUserName(user.name || 'User');
        setStats({
          cardAppointments: 0,
          hasCard: false,
          cardViews: 0,
          cardShares: 0,
          cardLikes: 0,
          cardDownloads: 0,
          cardData: null,
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
    <div className="w-full mx-auto font-poppins px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Welcome back, {userName}!
        </h1>
        <p className="text-slate-600 text-lg">
          Here's an overview of your account
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${stats.hasCard
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
          {stats.hasCard && stats.cardData && (
            <p className="text-xs text-slate-500 mt-1">
              {stats.cardData.data?.name || 'Active Card'}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-slate-600 text-sm font-medium mb-1">Card Appointments</h3>
          <p className="text-2xl font-bold text-slate-900">{stats.cardAppointments}</p>
          <p className="text-xs text-slate-500 mt-1">Appointments for your card</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <h3 className="text-slate-600 text-sm font-medium mb-1">Card Views</h3>
          <p className="text-2xl font-bold text-slate-900">{stats.cardViews}</p>
          <p className="text-xs text-slate-500 mt-1">Times your card was viewed</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Share2 className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <h3 className="text-slate-600 text-sm font-medium mb-1">Card Shares</h3>
          <p className="text-2xl font-bold text-slate-900">{stats.cardShares}</p>
          <p className="text-xs text-slate-500 mt-1">Times your card link was shared</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-rose-600" />
            </div>
          </div>
          <h3 className="text-slate-600 text-sm font-medium mb-1">Card Likes</h3>
          <p className="text-2xl font-bold text-slate-900">{stats.cardLikes}</p>
          <p className="text-xs text-slate-500 mt-1">People who liked your card</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-slate-600 text-sm font-medium mb-1">Contact Downloads</h3>
          <p className="text-2xl font-bold text-slate-900">{stats.cardDownloads}</p>
          <p className="text-xs text-slate-500 mt-1">Downloads of your contact</p>
        </div>
      </div>

    </div>
  );
}
