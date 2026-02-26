import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { apiService } from '../lib/api.js';
import { QRCodeSVG } from 'qrcode.react';
import {
  CreditCard,
  Mail,
  Phone,
  User,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  Copy,
  Download,
  Share2,
} from 'lucide-react';

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
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const qrContainerRef = useRef(null);
  const errorRef = useRef(null);

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

      // No inquiries found - user can submit inquiry form; pre-fill from profile where available
      // Inquiry phone: initially show user's login number if available (editable); else empty, required
      console.log('MyCard - No inquiries found for user - showing inquiry form');
      setCard(null);
      setInquirySubmitted(false);
      const userPhone = user?.phone ? String(user.phone) : '';
      setFormData((prev) => ({
        ...prev,
        name: user?.name ?? prev.name,
        email: user?.email ?? prev.email,
        phone: userPhone ? (prev.phone === '' || prev.phone === userPhone ? userPhone : prev.phone) : prev.phone,
      }));
      setLoading(false);
    };

    fetchCard();
  }, [user]);

  // Map backend field names to user-friendly messages
  const fieldToFriendlyMessage = {
    name: 'Please enter your name.',
    email: 'Please enter a valid email address.',
    phone: 'Please enter a valid phone number.',
  };

  const getErrorMessage = (response) => {
    if (!response) return 'Something went wrong. Please try again.';

    const details = response.details || response;
    // Express-validator returns errors as array: [{ path, msg }, ...]
    if (Array.isArray(details.errors) && details.errors.length > 0) {
      const first = details.errors[0];
      const path = (first.path || first.param || '').trim();
      const friendly = fieldToFriendlyMessage[path];
      if (friendly) return friendly;
      const msg = first.msg || first.message;
      if (msg && !msg.toLowerCase().includes('validation')) return msg;
      return friendly || 'Please check the highlighted fields and try again.';
    }
    // Mongoose-style errors object: { fieldName: { message: '...' } }
    if (details.errors && typeof details.errors === 'object' && !Array.isArray(details.errors)) {
      const entries = Object.entries(details.errors);
      if (entries.length > 0) {
        const [key, val] = entries[0];
        const friendly = fieldToFriendlyMessage[key];
        if (friendly) return friendly;
        const msg = val?.message || val?.msg || (typeof val === 'string' ? val : null);
        if (msg) return msg;
      }
    }

    if (typeof response.error === 'string' && response.error && !response.error.toLowerCase().includes('validation')) {
      return response.error;
    }
    if (details.message && !String(details.message).toLowerCase().includes('validation')) {
      return details.message;
    }
    if (details.error) return details.error;
    if (response.message) return response.message;
    return 'Please check your entries and try again.';
  };

  const showError = (message) => {
    setError(message);
    setCreating(false);
    setSuccess('');
    setTimeout(() => {
      errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setCreating(true);

    if (!formData.name?.trim()) {
      showError('Please enter your full name.');
      return;
    }
    if (!formData.phone?.trim()) {
      showError('Please enter your phone number.');
      return;
    }

    try {
      const response = await apiService.createCard(formData, user?._id);

      if (!response.success) {
        const errorMessage = getErrorMessage(response);
        showError(errorMessage);
        return;
      }

      setInquirySubmitted(true);
      setInquiryData(response.data);
      setSuccess('Inquiry sent! Your card is on the way.');
      setCreating(false);

      try {
        await refreshUser();
      } catch (refreshError) {
        console.log('Error refreshing user data:', refreshError);
      }
    } catch (err) {
      const message = err?.message || (err?.networkError && 'Network error. Please check your connection and try again.');
      showError(message || 'Something went wrong. Please try again.');
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


          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            

<div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
  {/* Header */}
  <div className="mb-4 sm:mb-5">
    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
      Your QR Code
    </h2>
    <p className="mt-1 text-sm sm:text-base text-slate-600">
      Scan to instantly open your digital business card
    </p>
  </div>

  {/* QR Section */}
  <div className="flex flex-col items-center">
    <div
      ref={qrContainerRef}
      className="relative bg-gradient-to-br from-slate-50 to-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm"
    >
      <QRCodeSVG value={siteUrl} size={170} level="H" />
    </div>

    <p className="mt-3 text-xs sm:text-sm text-slate-500 text-center">
      Point your camera at the code to open the link
    </p>
  </div>

  {/* Actions */}
  <div className="mt-5 flex flex-col sm:flex-row gap-2">
    <button
      onClick={handleDownloadQR}
      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 transition"
    >
      <Download className="w-4 h-4" />
      Download
    </button>

    <button
      onClick={handleShareQR}
      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-sm font-medium text-white transition"
    >
      <Share2 className="w-4 h-4" />
      Share
    </button>
  </div>

  {/* Link + Copy */}
  <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
    <a
      href={siteUrl}
      className="flex-1 text-xs sm:text-sm text-blue-600 hover:text-blue-800 truncate"
    >
      {siteUrl || "Link unavailable"}
    </a>

    <button
      onClick={copyToClipboard}
      className={`p-2 rounded-lg transition ${
        copied
          ? "bg-green-100 text-green-600"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
      title="Copy link"
    >
      {copied ? (
        <CheckCircle className="w-4 h-4" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  </div>

  {/* Footer Hint */}
  <p className="mt-4 text-xs sm:text-sm text-slate-500 text-center">
    Perfect for sharing at meetings, events, or on printed material
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
    <div className='h-full w-full flex items-center justify-center'>
      <div className="w-[90%] lg:w-full max-w-5xl 2xl:max-w-[66rem] mx-auto p-4 sm:p-6 lg:px-16 2xl:px-24 lg:py-10 2xl:py-16 bg-gradient-to-t from-[#BED6EC] to-white rounded-2xl sm:rounded-3xl lg:rounded-[40px] flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-20 border border-[#6600FF]">
      {/* Image: hidden on phone, visible from lg */}
      <div className="hidden lg:block lg:flex-shrink-0 lg:w-[min(50%,26rem)] lg:min-w-0">
        <img src="inquiry-img.png" alt="" className="w-full h-auto max-w-[23.5rem] mx-auto object-cover rounded-xl" />
      </div>

      <div className="w-full min-w-0 lg:w-1/2 lg:max-w-xl flex flex-col">
        <div className="mb-4 sm:mb-6">
          <p className="text-lg sm:text-xl text-black font-bold">Confirm info, your</p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black to-[#004DFF] mb-3 mt-2 my-4">Card ready in 60 min By Experts</h1>
        <p className="text-slate-800 text-xs sm:text-sm lg:leading-tight">
        Our experts design your card. You’ll receive a call after form submission. Your information is used for contact purposes only.
        </p>
        {cardGenerated && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
            <p className="text-green-800 text-xs sm:text-sm">
              <strong>Your business card is ready!</strong> Check the "My Card" section to view and share it.
            </p>
          </div>
        )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4 w-full">
          {error && (
            <div
              ref={errorRef}
              role="alert"
              className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex gap-3"
            >
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm sm:text-base">{error}</p>
            </div>
          )}

          <div className="space-y-1 sm:space-y-2 mb-8 mt-2">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 pointer-events-none" strokeWidth={1.5}/>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => { setError(''); setFormData({ ...formData, name: e.target.value }); }}
                className="w-full pl-10 pr-3 sm:pl-11 sm:pr-4 py-2 border border-slate-700 rounded-xl focus:ring-1 focus:ring-black focus:border-transparent outline-none transition-all text-sm sm:text-base"
                placeholder="Your Name"
                disabled={creating}
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 pointer-events-none" strokeWidth={1.5}/>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => { setError(''); setFormData({ ...formData, email: e.target.value }); }}
                className="w-full pl-10 pr-3 sm:pl-11 sm:pr-4 py-2 border border-slate-700 rounded-xl focus:ring-1 focus:ring-black focus:border-transparent outline-none transition-all text-sm sm:text-base"
                placeholder="Your Email"
                disabled={creating}
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 pointer-events-none" strokeWidth={1.5}/>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => { setError(''); setFormData({ ...formData, phone: e.target.value }); }}
                className="w-full pl-10 pr-3 sm:pl-11 sm:pr-4 py-2 border border-slate-700 rounded-xl focus:ring-1 focus:ring-black focus:border-transparent outline-none transition-all text-sm sm:text-base"
                placeholder={user?.phone ? undefined : "Your Phone Number"}
                disabled={creating}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={creating}
            className="w-full py-2.5 sm:py-3 bg-black text-white rounded-[15px] font-semibold transition-all shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            {/* <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" /> */}
            {creating ? 'Sending...' : 'Create My Vistinglink Card'}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}
