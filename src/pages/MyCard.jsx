import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { apiService } from '../lib/api.js';
import { QRCodeSVG } from 'qrcode.react';
import {
  CreditCard,
  Mail,
  Phone,
  Briefcase,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  Copy,
} from 'lucide-react';

const businessTypes = [
  'E-commerce',
  'Interior Designer', 
  'Makeup Artist',
  'Travel Agent',
  'Other'
];

export default function MyCard() {
  const { user } = useAuth();
  const [card, setCard] = useState(null);
  const [inquiryData, setInquiryData] = useState(null);
  const [cardGenerated, setCardGenerated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completeUserData, setCompleteUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business_type: '',
    message: '',
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchCard = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      // ensure we don't flash form while fetching
      setLoading(true);

      console.log('MyCard - User object:', user);
      console.log('MyCard - User ID:', user._id);
      console.log('MyCard - User ID type:', typeof user._id);
      console.log('MyCard - Full user data:', JSON.stringify(user, null, 2));

      // Fetch complete user data and immediately use it (avoid waiting for state)
      try {
        const userResponse = await apiService.getUserById(user._id);
        console.log('MyCard - getUserById response:', userResponse);
        const userDataToCheck = (userResponse.success && userResponse.data) ? userResponse.data : user;
        if (userResponse.success && userResponse.data) {
          console.log('MyCard - Complete user data from API:', JSON.stringify(userResponse.data, null, 2));
          setCompleteUserData(userResponse.data);
        }
        console.log('MyCard - Using user data:', userDataToCheck);
        
        // Check if user has inquiries in their profile
        if (userDataToCheck.inquiries && Array.isArray(userDataToCheck.inquiries) && userDataToCheck.inquiries.length > 0) {
          console.log('MyCard - User has inquiries:', userDataToCheck.inquiries);
          
          // Check if inquiries are full objects or just IDs
          const latestInquiry = userDataToCheck.inquiries[userDataToCheck.inquiries.length - 1];
          console.log('MyCard - Latest inquiry:', latestInquiry);
          
          let inquiry;
          if (typeof latestInquiry === 'string') {
            // If it's an ID, fetch the inquiry data
            console.log('MyCard - Fetching inquiry data for ID:', latestInquiry);
            const inquiryResponse = await apiService.getInquiryById(latestInquiry);
            console.log('MyCard - inquiryResponse:', inquiryResponse);
            console.log('MyCard - inquiryResponse success:', inquiryResponse.success);
            console.log('MyCard - inquiryResponse data:', inquiryResponse.data);
            
            if (inquiryResponse.success && inquiryResponse.data) {
              inquiry = inquiryResponse.data;
            }
          } else {
            // If it's already a full object, use it directly
            console.log('MyCard - Using inquiry object directly');
            inquiry = latestInquiry;
          }
          
          if (inquiry) {
            console.log('MyCard - inquiry data:', inquiry);
            console.log('MyCard - cardGenerated:', inquiry.cardGenerated);
            console.log('MyCard - cardId:', inquiry.cardId);
            
            // Check if inquiry has cardGenerated and cardId
            if (inquiry.cardGenerated === true && inquiry.cardId) {
              console.log('MyCard - Found generated inquiry with cardId:', inquiry);
              console.log('MyCard - CardId to fetch:', inquiry.cardId);
              
              setInquiryData(inquiry);
              setCardGenerated(true);
              
              // Fetch the generated card using cardId
              console.log('MyCard - Fetching card with ID:', inquiry.cardId);
              const cardResponse = await apiService.getCardById(inquiry.cardId);
              console.log('MyCard - cardResponse:', cardResponse);
              console.log('MyCard - cardResponse success:', cardResponse.success);
              console.log('MyCard - cardResponse data:', cardResponse.data);
              
              if (cardResponse.success && cardResponse.data) {
                console.log('MyCard - Successfully fetched card data:', cardResponse.data);
                setCard(cardResponse.data);
              } else {
                console.log('MyCard - Failed to fetch card data:', cardResponse);
                console.log('MyCard - Card fetch error details:', cardResponse.error);
              }
              setLoading(false);
              return;
            } else if (inquiry.cardGenerated === true && !inquiry.cardId) {
              console.log('MyCard - Inquiry has cardGenerated=true but no cardId. This might be a backend issue.');
              console.log('MyCard - Full inquiry object:', inquiry);
              
              // Try to find the card by other means - maybe by inquiry ID or user ID
              console.log('MyCard - Attempting to find card by inquiry ID:', inquiry._id);
              
              // Try to get card by inquiry ID as a fallback
              const cardResponse = await apiService.getCardById(inquiry._id);
              console.log('MyCard - Card response by inquiry ID:', cardResponse);
              
              if (cardResponse.success && cardResponse.data) {
                console.log('MyCard - Found card using inquiry ID as cardId');
                setInquiryData(inquiry);
                setCardGenerated(true);
                setCard(cardResponse.data);
                setLoading(false);
                return;
              }
            } else {
              console.log('MyCard - Inquiry found but no generated card yet:', {
                cardGenerated: inquiry.cardGenerated,
                cardId: inquiry.cardId
              });
            }
          } else {
            console.log('MyCard - Failed to get inquiry data');
          }
        } else {
          console.log('MyCard - No inquiries found on user profile');
        }
        
        // No additional fallbacks; rely on inquiry presence only
      } catch (error) {
        console.log('MyCard - Error fetching inquiries:', error);
      }

      // No card found through inquiries
      console.log('No generated card found for user:', user._id);
      setCard(null);
      setLoading(false);
    };

    fetchCard();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setCreating(true);

    if (!formData.name || !formData.email || !formData.phone || !formData.business_type) {
      setError('Please fill in all fields');
      setCreating(false);
      return;
    }

    const response = await apiService.createCard(formData, user?._id);

    if (!response.success) {
      console.log('Create card error details:', response);
      setError(response.error || 'Failed to create card');
      if (response.details) {
        console.log('Server error details:', response.details);
      }
      setCreating(false);
    } else {
      setCard(response.data);
      setSuccess('Business card created successfully!');
      setCreating(false);
    }
  };

  const copyToClipboard = async () => {
    if (card) {
      await navigator.clipboard.writeText(card.shareable_link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  console.log('MyCard - Render check:', { card, cardGenerated, inquiryData, loading });
  
  if (card) {
    console.log('MyCard - Rendering card display');
    return (
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Business Card</h1>
          <p className="text-slate-600 text-lg">
            {cardGenerated ? 'Your business card has been generated and is ready to share' : 'Your digital business card is ready to share'}
          </p>
          {cardGenerated && inquiryData && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Generated from inquiry:</strong> Submitted on {new Date(inquiryData.createdAt || inquiryData.created_at).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800">{success}</p>
          </div>
        )}

        <div className="flex gap-8">
          {/* <div className="bg-white rounded-xl border border-slate-200 p-8 w-full"> */}
            {/* <h2 className="text-2xl font-bold text-slate-900 mb-6">Card Preview</h2> */}
            {/* <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-8 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-8 h-8" />
                <span className="text-xl font-bold">CardPro</span>
              </div>
              <h3 className="text-3xl font-bold mb-2">{card.name}</h3>
              <p className="text-blue-100 mb-6">{card.business_type}</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{card.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{card.phone}</span>
                </div>
              </div>
            </div> */}
            {/* <iframe src={card.publicUrl} className="w-full h-full"></iframe> */}
            {/* {console.log("my log",card)} */}
          {/* </div> */}

          <div className="space-x-6 flex">
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Shareable Link</h2>
              <p className="text-slate-600 mb-4">Share this link to let others view your card</p>
              <div className="flex gap-2">
                <a href={card.publicUrl} className="flex-1 px-4 py-3 bg-slate-50 text-blue-600 hover:text-blue-800 underline transition-colors duration-300">{card.publicUrl}</a>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">QR Code</h2>
              <p className="text-slate-600 mb-6">
                Scan this code to instantly access your business card
              </p>
              <div className="bg-white p-6 rounded-lg border-2 border-slate-200 inline-block">
                <QRCodeSVG value={card.shareable_link} size={200} level="H" />
              </div>
              <p className="text-sm text-slate-500 mt-4">
                Save or print this QR code for easy sharing at events
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Share Your Card
          </h3>
          <p className="text-blue-700 text-sm">
            Use the shareable link or QR code to share your business card with clients and
            colleagues. They can view your information and book appointments directly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Create Your Business Card</h1>
        <p className="text-slate-600 text-lg">
          {cardGenerated ? 'Your card has been generated! You can create another one below.' : 'Fill in your information to create your digital business card'}
        </p>
        {cardGenerated && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              <strong>Your business card is ready!</strong> Check the "My Card" section to view and share it.
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              placeholder="John Doe"
              disabled={creating}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              placeholder="john@example.com"
              disabled={creating}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              placeholder="+1 (555) 123-4567"
              disabled={creating}
            />
          </div>

          <div>
            <label
              htmlFor="business_type"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Business Type
            </label>
            <select
              id="business_type"
              value={formData.business_type}
              onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              disabled={creating}
            >
              <option value="">Select a business type</option>
              {businessTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Additional Message (Optional)
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Tell us about your specific requirements or any additional information..."
              disabled={creating}
            />
          </div>

          <button
            type="submit"
            disabled={creating}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            {creating ? 'Creating...' : 'Create Business Card'}
          </button>
        </form>
      </div>
    </div>
  );
}
