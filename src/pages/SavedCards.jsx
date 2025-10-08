import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { apiService } from '../lib/api.js';
import { 
  CreditCard, 
  Eye, 
  Calendar, 
  Share2, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Trash2,
  Edit
} from 'lucide-react';

export default function SavedCards() {
  const { user } = useAuth();
  const [savedCards, setSavedCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedCardId, setCopiedCardId] = useState(null);
  const [deletingCardId, setDeletingCardId] = useState(null);

  useEffect(() => {
    const fetchSavedCards = async () => {
      if (!user) return;

      try {
        console.log('SavedCards - Fetching user data for user:', user._id);
        
        // Prefer dedicated endpoint for saved cards
        const savedCardsResponse = await apiService.getUserSavedCards(user._id);
        console.log('SavedCards - getUserSavedCards response:', savedCardsResponse);

        if (savedCardsResponse.success && Array.isArray(savedCardsResponse.data)) {
          setSavedCards(savedCardsResponse.data);
          console.log('SavedCards - Set saved cards (dedicated endpoint):', savedCardsResponse.data);

          if (savedCardsResponse.data.length > 0) {
            console.log('SavedCards - First card structure:', JSON.stringify(savedCardsResponse.data[0], null, 2));
            console.log('SavedCards - First card shareable link:', getShareableLink(savedCardsResponse.data[0]));
          }
        } else if (savedCardsResponse.success && savedCardsResponse.data && savedCardsResponse.data.savedCards) {
          // Some backends might wrap in an object
          const cards = savedCardsResponse.data.savedCards;
          setSavedCards(cards);
          console.log('SavedCards - Set saved cards (wrapped):', cards);
        } else {
          setSavedCards([]);
          setError(savedCardsResponse.error || 'Failed to fetch saved cards');
        }
      } catch (error) {
        console.error('SavedCards - Error fetching saved cards:', error);
        setError('Error loading saved cards');
        setSavedCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedCards();
  }, [user]);

  const copyToClipboard = async (card) => {
    try {
      const link = getShareableLink(card);
      if (link) {
        await navigator.clipboard.writeText(link);
        setCopiedCardId(card._id);
        setTimeout(() => setCopiedCardId(null), 2000);
      } else {
        console.warn('No shareable link found for card:', card);
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const getCardName = (card) => {
    // Try different possible paths for card name
    return card.data?.companyName || 
           card.data?.storeName || 
           card.companyName || 
           card.storeName || 
           card.name || 
           'Unnamed Card';
  };

  const getCardType = (card) => {
    // Try different possible paths for card type
    return card.data?.categoryId || 
           card.data?.business_type || 
           card.categoryId || 
           card.business_type || 
           'Business';
  };

  const getShareableLink = (card) => {
    // Try different possible paths for shareable link
    return 'http://localhost:5173' + card.shareableLink
  };

  const handleDeleteCard = async (cardId) => {
    if (!user || !cardId) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this saved card? This action cannot be undone.');
    if (!confirmed) return;

    setDeletingCardId(cardId);
    
    try {
      console.log('Deleting saved card:', cardId);
      const response = await apiService.deleteSavedCard(user._id, cardId);
      
      if (response.success) {
        // Remove the card from the local state
        setSavedCards(prevCards => prevCards.filter(card => card._id !== cardId));
        console.log('Card deleted successfully');
      } else {
        console.error('Failed to delete card:', response.error);
        alert('Failed to delete card: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Error deleting card: ' + error.message);
    } finally {
      setDeletingCardId(null);
    }
  };

  const handleShare = async (card) => {
    const cardData = card.card?.data || card.data || {};
    const companyName = cardData.companyName || cardData.storeName || getCardName(card);
    const shareableLink = getShareableLink(card);
    
    if (!shareableLink) {
      alert('No shareable link available for this card');
      return;
    }
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${companyName}'s Digital Business Card`,
          text: `Check out ${companyName}'s digital business card`,
          url: shareableLink,
        });
      } catch (err) {
        console.log('Error sharing:', err);
        // Fallback to clipboard if share was cancelled or failed
        try {
          await navigator.clipboard.writeText(shareableLink);
          setCopiedCardId(card._id);
          setTimeout(() => setCopiedCardId(null), 2000);
        } catch (clipboardErr) {
          console.log('Error copying to clipboard:', clipboardErr);
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareableLink);
        setCopiedCardId(card._id);
        setTimeout(() => setCopiedCardId(null), 2000);
      } catch (err) {
        console.log('Error copying to clipboard:', err);
        alert('Unable to share or copy link');
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

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Saved Cards</h1>
          <p className="text-slate-600 text-lg">Manage your saved business cards</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-semibold">Error Loading Cards</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[95rem] mx-auto font-poppins">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Saved Cards</h1>
        <p className="text-slate-600 text-lg">
          {savedCards.length > 0 
            ? `You have ${savedCards.length} saved business card${savedCards.length > 1 ? 's' : ''}`
            : 'You haven\'t saved any business cards yet'
          }
        </p>
      </div>

      {savedCards.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <CreditCard className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No Saved Cards</h3>
          <p className="text-slate-600 mb-6">
            You haven't saved any business cards yet. Create your first card to get started.
          </p>
        
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {savedCards.map((card, index) => (
            <div key={card._id || index} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="">
                <h3 className="text-lg font-bold text-slate-900 uppercase">
                  {getCardName(card)}
                </h3>
                <p className="text-sm text-slate-600 font-normal capitalize">
                {/* {getCardName(card)} */}
                  {getCardType(card)}
                </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => copyToClipboard(card)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Copy link"
                  >
                    {copiedCardId === card._id ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteCard(card._id)}
                    disabled={deletingCardId === card._id}
                    className={`p-2 rounded-lg transition-colors ${
                      deletingCardId === card._id
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                    }`}
                    title={deletingCardId === card._id ? "Deleting..." : "Delete card"}
                  >
                    {deletingCardId === card._id ? (
                      <div className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                {/* <h3 className="text-lg font-bold text-slate-900 mb-1 uppercase">
                  {getCardName(card)}
                </h3>
                <p className="text-sm text-slate-600 mb-2 capitalize">
                  {getCardType(card)}
                </p> */}
                {/* <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3 h-3" />
                  <span>Created {new Date(card.createdAt || card.created_at).toLocaleDateString()}</span>
                </div> */}
              </div>

               <div className="space-y-2 mb-6">
                 {/* <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2 text-slate-600">
                     <Eye className="w-4 h-4" />
                     <span className="text-sm">Views</span>
                   </div>
                   <span className="font-semibold text-slate-900">{card.views || 0}</span>
                 </div> */}
                 
                 {(card.data?.email || card.email) && (
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-slate-800 font-normal">Email</span>
                     <a href={`mailto:${card.data?.email || card.email}`} className="text-sm font-normal text-blue-700 underline truncate max-w-32">
                       {card.data?.email || card.email}
                     </a>
                   </div>
                 )}
                 
                 {(card.data?.phoneNumber || card.data?.phone || card.phone) && (
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-slate-800 font-normal">Phone</span>
                      <a href={`tel:${card.data?.phoneNumber || card.data?.phone || card.phone}`} className="text-sm font-normal text-blue-700 underline">
                       {card.data?.phoneNumber || card.data?.phone || card.phone}
                     </a>
                   </div>
                 )}
                 
                 {(card.data?.website || card.website) && (
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-slate-800 font-normal">Website</span>
                     <a href={card.data?.website || card.website} className="text-sm font-normal text-blue-700 underline">
                       {card.data?.website || card.website}
                     </a>
                   </div>
                 )}

                 {/* {getShareableLink(card) && (
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-slate-600">Link</span>
                     <span className="text-xs font-normal text-blue-600 truncate max-w-32">
                       {getShareableLink(card).substring(0, 30)}...
                     </span>
                   </div>
                 )} */}
               </div>

               <div className="flex gap-2">
                 {getShareableLink(card) ? (
                   <a
                     href={getShareableLink(card)}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-normal hover:bg-blue-700 transition-colors"
                   >
                     <ExternalLink className="w-4 h-4" />
                     View Card
                   </a>
                 ) : (
                   <button
                     disabled
                     className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-300 text-slate-500 rounded-lg text-sm font-normal cursor-not-allowed"
                   >
                     <ExternalLink className="w-4 h-4" />
                     No Link
                   </button>
                 )}
                <button
                  onClick={() => handleShare(card)}
                  disabled={!getShareableLink(card)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-normal transition-colors ${
                    getShareableLink(card)
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>

              {copiedCardId === card._id && (
                <div className="mt-3 text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Link copied to clipboard!
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* {savedCards.length > 0 && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Manage Your Cards
          </h3>
          <p className="text-blue-700 text-sm">
            Use the share buttons to distribute your business cards. Each card has its own unique link 
            that you can share with clients and colleagues. Track views and manage your cards from this page.
          </p>
        </div>
      )} */}
    </div>
  );
}
