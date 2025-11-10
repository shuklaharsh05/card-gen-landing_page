import { useEffect, useRef, useState } from 'react';
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
  Download,
  Share2,
} from 'lucide-react';

const businessTypes = [
  'E-commerce',
  'Interior Designer', 
  'Makeup Artist',
  'Travel Agent',
  'Other'
];

export default function MyCard() {
  const { user, refreshUser } = useAuth();
  const [card, setCard] = useState(null);
  const [inquiryData, setInquiryData] = useState(null);
  const [cardGenerated, setCardGenerated] = useState(false);
  const [loading, setLoading] = useState(true);
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
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const qrContainerRef = useRef(null);

  // Build site URL variants from a backend share URL using fixed domain mask
  const toSiteUrlFromBackend = (rawUrl) => {
    if (!rawUrl) return { relative: '', absolute: '' };
    const baseOrigin = 'https://visitinglink.com';
    try {
      const parsed = new URL(rawUrl);
      let path = parsed.pathname || '';
      // Normalize to preferred rewrite path: /cards/:id
      if (path.startsWith('/card/')) {
        path = path.replace('/card/', '/cards/');
      }
      // Keep existing /cards/ as-is
      const relative = path + (parsed.search || '') + (parsed.hash || '');
      const absolute = `${baseOrigin}${relative}`;
      return { relative, absolute };
    } catch (_e) {
      // If it's not an absolute URL, assume it's already a path
      const relative = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`;
      const absolute = `${baseOrigin}${relative}`;
      return { relative, absolute };
    }
  };

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

      // First check if user object already has inquiries populated
      let inquiries = [];
      if (user.inquiries && Array.isArray(user.inquiries) && user.inquiries.length > 0) {
        console.log('MyCard - User object has inquiries:', user.inquiries);
        inquiries = user.inquiries;
      } else {
        // Fallback: Check if user has any inquiries using getUserInquiries API
        try {
          const inquiriesResponse = await apiService.getUserInquiries(user._id);
          console.log('MyCard - getUserInquiries response:', inquiriesResponse);
          
          if (inquiriesResponse.success && inquiriesResponse.data && Array.isArray(inquiriesResponse.data) && inquiriesResponse.data.length > 0) {
            inquiries = inquiriesResponse.data;
          }
        } catch (error) {
          console.log('MyCard - Error fetching inquiries:', error);
        }
      }

      // If user has ANY inquiries, they should not see the form
      if (inquiries.length > 0) {
        console.log('MyCard - User has inquiries:', inquiries);
        
        // Get the latest inquiry (most recent)
        const latestInquiry = inquiries[inquiries.length - 1];
        console.log('MyCard - Latest inquiry:', latestInquiry);
        
        if (latestInquiry) {
          console.log('MyCard - inquiry data:', latestInquiry);
          console.log('MyCard - cardGenerated:', latestInquiry.cardGenerated);
          console.log('MyCard - cardId:', latestInquiry.cardId);
          
          // Check if inquiry has cardGenerated and cardId
          if (latestInquiry.cardGenerated === true && latestInquiry.cardId) {
            console.log('MyCard - Found generated inquiry with cardId:', latestInquiry);
            console.log('MyCard - CardId to fetch:', latestInquiry.cardId);
            
            setInquiryData(latestInquiry);
            setCardGenerated(true);
            
            // Fetch the generated card using cardId
            console.log('MyCard - Fetching card with ID:', latestInquiry.cardId);
            const cardResponse = await apiService.getCardById(latestInquiry.cardId);
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
          } else if (latestInquiry.cardGenerated === true && !latestInquiry.cardId) {
            console.log('MyCard - Inquiry has cardGenerated=true but no cardId. This might be a backend issue.');
            console.log('MyCard - Full inquiry object:', latestInquiry);
            
            // Try to find the card by other means - maybe by inquiry ID or user ID
            console.log('MyCard - Attempting to find card by inquiry ID:', latestInquiry._id);
            
            // Try to get card by inquiry ID as a fallback
            const cardResponse = await apiService.getCardById(latestInquiry._id);
            console.log('MyCard - Card response by inquiry ID:', cardResponse);
            
            if (cardResponse.success && cardResponse.data) {
              console.log('MyCard - Found card using inquiry ID as cardId');
              setInquiryData(latestInquiry);
              setCardGenerated(true);
              setCard(cardResponse.data);
              setLoading(false);
              return;
            }
          }
          
          // If inquiry exists but card not generated yet, show inquiry submitted message
          console.log('MyCard - Inquiry found but no generated card yet:', {
            cardGenerated: latestInquiry.cardGenerated,
            cardId: latestInquiry.cardId
          });
          setInquirySubmitted(true);
          setInquiryData(latestInquiry);
          setLoading(false);
          return;
        }
      }

      // No inquiries found - user can submit inquiry form
      console.log('MyCard - No inquiries found for user - showing inquiry form');
      setCard(null);
      setInquirySubmitted(false);
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
      setError('Please fill in all required fields (Name, Email, Phone, and Business Type)');
      setCreating(false);
      return;
    }

    const response = await apiService.createCard(formData, user?._id);

    if (!response.success) {
      console.log('Create inquiry error details:', response);
      
      // Parse error message from response for better user experience
      let errorMessage = 'Failed to submit inquiry';
      
      if (response.error) {
        errorMessage = response.error;
      }
      
      // Check for validation errors in details
      if (response.details) {
        // Check if it's a validation error object
        if (response.details.errors) {
          // Handle Mongoose validation errors
          const validationErrors = response.details.errors;
          const errorMessages = Object.keys(validationErrors).map(
            key => `${key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}: ${validationErrors[key].message || validationErrors[key]}`
          );
          errorMessage = errorMessages.join('. ');
        } else if (response.details.message) {
          errorMessage = response.details.message;
        } else if (typeof response.details === 'string') {
          errorMessage = response.details;
        } else if (response.details.error) {
          errorMessage = response.details.error;
        }
      }
      
      setError(errorMessage);
      setCreating(false);
    } else {
      setInquirySubmitted(true);
      setInquiryData(response.data);
      setSuccess('Inquiry sent! Your card is on the way.');
      setCreating(false);
      
      // Refresh user data to include the new inquiry so it persists after refresh
      try {
        await refreshUser();
      } catch (refreshError) {
        console.log('Error refreshing user data:', refreshError);
        // Non-critical error, user will see updated data on next refresh
      }
    }
  };

  const copyToClipboard = async () => {
    if (!card) return;
    const backendUrl = card.shareableLink || card.shareable_link || card.publicUrl || card.public_url || card.publicURL || '';
    const { absolute } = toSiteUrlFromBackend(backendUrl);
    if (!absolute) return;
    await navigator.clipboard.writeText(absolute);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getQrDataUrl = async () => {
    const container = qrContainerRef.current;
    if (!container) return '';
    const svg = container.querySelector('svg');
    if (!svg) return '';
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    try {
      const img = new Image();
      const size = parseInt(svg.getAttribute('width') || '200', 10);
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      await new Promise((resolve, reject) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          resolve();
        };
        img.onerror = reject;
        img.src = url;
      });
      const dataUrl = canvas.toDataURL('image/png');
      return dataUrl;
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  // Build a branded QR poster: title (business name), QR in middle, link below
  const getBrandedQrDataUrl = async (siteUrl) => {
    const baseQr = await getQrDataUrl();
    if (!baseQr) return '';

    // Determine title from available card data
    const title = (card?.name) || (card?.card?.data?.companyName) || (card?.card?.data?.storeName) || 'My Business Card';

    // Load QR image
    const qrImg = new Image();
    await new Promise((resolve, reject) => {
      qrImg.onload = resolve;
      qrImg.onerror = reject;
      qrImg.src = baseQr;
    });

    // Canvas dimensions
    const posterWidth = 800;
    const padding = 48;
    const titleSize = 36;
    const urlSize = 22;
    const gap = 24;
    const qrSize = 520; // fixed QR draw size

    const posterHeight = padding + titleSize + gap + qrSize + gap + urlSize + padding;
    const canvas = document.createElement('canvas');
    canvas.width = posterWidth;
    canvas.height = posterHeight;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, posterWidth, posterHeight);

    // Title
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.font = `600 ${titleSize}px system-ui, -apple-system, Segoe UI, Roboto`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(title, posterWidth / 2, padding);

    // QR image
    const qrX = (posterWidth - qrSize) / 2;
    const qrY = padding + titleSize + gap;
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

    // Link
    ctx.fillStyle = '#2563eb'; // blue-600
    ctx.font = `500 ${urlSize}px system-ui, -apple-system, Segoe UI, Roboto`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    const urlY = qrY + qrSize + gap + urlSize;
    ctx.fillText(siteUrl, posterWidth / 2, urlY);

    return canvas.toDataURL('image/png');
  };

  const handleDownloadQR = async () => {
    const backendUrl = card?.shareableLink || card?.shareable_link || card?.publicUrl || card?.public_url || card?.publicURL || '';
    const { absolute } = toSiteUrlFromBackend(backendUrl);
    const dataUrl = await getBrandedQrDataUrl(absolute);
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'card-qr.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShareQR = async () => {
    const backendUrl = card?.shareableLink || card?.shareable_link || card?.publicUrl || card?.public_url || card?.publicURL || '';
    // Try sharing the image file if supported
    try {
      const { absolute } = toSiteUrlFromBackend(backendUrl);
      const dataUrl = await getBrandedQrDataUrl(absolute);
      if (navigator.canShare && navigator.canShare({ files: [] }) && dataUrl) {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], 'card-qr.png', { type: 'image/png' });
        await navigator.share({ files: [file], title: 'My Business Card', text: 'Scan to view my card' });
        return;
      }
    } catch (_) {
      // fall through to URL share
    }
    const { absolute } = toSiteUrlFromBackend(backendUrl);
    if (navigator.share && absolute) {
      try {
        await navigator.share({ url: absolute, title: 'My Business Card' });
      } catch (_) {
        // ignore cancel
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  console.log('MyCard - Render check:', { card, cardGenerated, inquiryData, loading, inquirySubmitted });
  
  if (card) {
    const backendUrl = card.shareableLink || card.shareable_link || card.publicUrl || card.public_url || card.publicURL || '';
    const { absolute: siteUrl } = toSiteUrlFromBackend(backendUrl);
    console.log('MyCard - Rendering card display');
    return (
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 mx-auto font-poppins">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">My Business Card</h1>
          <p className="text-slate-600 text-base sm:text-lg">
            {cardGenerated ? 'Your business card has been generated and is ready to share' : 'Your digital business card is ready to share'}
          </p>
          {cardGenerated && inquiryData && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <p className="text-blue-800 text-xs sm:text-sm">
                <strong>Generated from inquiry:</strong> Submitted on {new Date(inquiryData.createdAt || inquiryData.created_at).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {success && (
          <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800 text-sm sm:text-base">{success}</p>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
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

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">Shareable Link</h2>
              <p className="text-slate-600 mb-3 sm:mb-4 text-sm sm:text-base">Share this link to let others view your card</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <a href={siteUrl} className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-slate-50 text-blue-600 hover:text-blue-800 underline transition-colors duration-300 text-xs sm:text-sm break-all">{siteUrl || 'Link unavailable'}</a>
                <button
                  onClick={copyToClipboard}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center w-10 h-10 flex-shrink-0 self-start sm:self-auto"
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

            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">QR Code</h2>
              <p className="text-slate-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Scan this code to instantly access your business card
              </p>
              <div className="bg-white p-4 sm:p-6 rounded-lg border-2 border-slate-200 inline-block" ref={qrContainerRef}>
                <QRCodeSVG value={siteUrl} size={160} level="H" />
              </div>
              <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  onClick={handleDownloadQR}
                  className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center gap-2 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download QR
                </button>
                <button
                  onClick={handleShareQR}
                  className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 transition-colors text-sm"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 break-all">URL: {siteUrl}</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-4">
                Save or print this QR code for easy sharing at events
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2 text-base sm:text-lg">
            <LinkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            Share Your Card
          </h3>
          <p className="text-blue-700 text-xs sm:text-sm">
            Use the shareable link or QR code to share your business card with clients and
            colleagues. They can view your information and book appointments directly.
          </p>
        </div>
      </div>
    );
  }

  // Check if user has inquiries - either from state or directly from user object
  // This ensures form is never shown if user has already submitted an inquiry
  const hasInquiries = (user?.inquiries && Array.isArray(user.inquiries) && user.inquiries.length > 0) || inquirySubmitted;
  
  // Show inquiry submitted message if inquiry is submitted but card not generated
  if (hasInquiries && !card) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">Inquiry Sent!</h1>
          <p className="text-slate-600 text-base sm:text-lg">Your card is on the way</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 lg:p-8">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">Thank You!</h2>
            <p className="text-slate-600 mb-4 sm:mb-6 text-sm sm:text-base">
              We've received your inquiry and are working on creating your business card. 
              You'll be notified once it's ready!
            </p>

            {inquiryData && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="text-blue-800 text-xs sm:text-sm">
                  <strong>Inquiry submitted:</strong> {new Date(inquiryData.createdAt || inquiryData.created_at).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="bg-slate-50 rounded-lg p-3 sm:p-4">
              <h3 className="font-semibold text-slate-900 mb-2 text-sm sm:text-base">What happens next?</h3>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-1 text-left">
                <li>• Our team will review your inquiry</li>
                <li>• Your business card will be generated</li>
                <li>• You'll receive a notification when it's ready</li>
                <li>• You can then share your card with clients</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Only show form if user has no inquiries (one inquiry per user rule)
  // hasInquiries check ensures form is never shown if user already submitted inquiry
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">Submit Your Inquiry</h1>
        <p className="text-slate-600 text-base sm:text-lg">
          Fill in your information to submit an inquiry for your business card
        </p>
        {cardGenerated && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
            <p className="text-green-800 text-xs sm:text-sm">
              <strong>Your business card is ready!</strong> Check the "My Card" section to view and share it.
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm sm:text-base">{error}</p>
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
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm sm:text-base"
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
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm sm:text-base"
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
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm sm:text-base"
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
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm sm:text-base"
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
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none text-sm sm:text-base"
              placeholder="Tell us about your specific requirements or any additional information..."
              disabled={creating}
            />
          </div>

          <button
            type="submit"
            disabled={creating}
            className="w-full py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
            {creating ? 'Submitting...' : 'Submit Inquiry'}
          </button>
        </form>
      </div>
    </div>
  );
}
