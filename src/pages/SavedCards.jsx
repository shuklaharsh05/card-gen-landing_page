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
  Edit,
  ChevronRight,
  Search,
  X
} from 'lucide-react';

export default function SavedCards() {
  const { user } = useAuth();
  const [savedCards, setSavedCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedCardId, setCopiedCardId] = useState(null);
  const [deletingCardId, setDeletingCardId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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
           card.data?.customCardData?.companyName ||
           card.data?.storeName || 
           card.companyName || 
           card.storeName || 
           card.name || 
           'Unnamed Card';
  };

  // const getCardType = (card) => {
  //   // Try different possible paths for card type
  //   return card.data?.categoryId || 
  //          card.data?.customCardData?.business_type ||
  //          card.data?.business_type || 
  //          card.categoryId || 
  //          card.business_type || 
  //          'Business';
  // };
  const getCardTagline = (card) => {
    // Try different possible paths for card type
    return card.data?.tagline || 
           card.data?.customCardData?.tagline ||
           card.data?.tagline || 
           'No tagline';
  }

  const getCardLogo = (card) => {
    return card.data?.logo || 
           card.data?.customCardData?.profilePicture || 
           card.data?.customCardData?.profileImage || 
           card.data?.logo || 
           'No logo';
  }

  const getCardAbout = (card) => {
    const about = card.data?.about || 
           card.data?.customCardData?.about.description || 
           card.data?.about.description || 
           card.data?.customCardData?.about || 
           card.data?.about || 
           'No about';
    return about.length > 100 ? about.substring(0, 100) + '...' : about;
  }

  const getCardEmail = (card) => {
    return card.data?.email || 
           card.email || 
           card.data?.customCardData?.contact?.email ||
           '';
  }

  const getCardPhone = (card) => {
    return card.data?.phoneNumber || 
           card.data?.phone || 
           card.phone || 
           card.data?.customCardData?.contact?.phone ||
           '';
  }

  const getShareableLink = (card) => {
    // Try different possible paths for shareable link
    if (!card.shareableLink) return null;
    
    // Replace teamserver.cloud with www.visitinglink.com
    return card.shareableLink.replace('teamserver.cloud', 'www.visitinglink.com');
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

  // Filter cards based on search query
  const filteredCards = savedCards.filter((card) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase().trim();
    const companyName = getCardName(card).toLowerCase();
    const email = getCardEmail(card).toLowerCase();
    const phone = getCardPhone(card).toLowerCase();
    
    return companyName.includes(query) || 
           email.includes(query) || 
           phone.includes(query);
  });

  return (
    <div className="max-w-[95rem] mx-auto font-poppins px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">Saved Cards</h1>
            <p className="text-slate-600 text-base sm:text-lg">
              {savedCards.length > 0 
                ? `You have ${savedCards.length} saved business card${savedCards.length > 1 ? 's' : ''}`
                : 'You haven\'t saved any business cards yet'
              }
            </p>
          </div>
          
          {savedCards.length > 0 && (
            <div className="relative w-full sm:w-auto sm:min-w-[300px] lg:min-w-[500px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-800" />
              <input
                type="text"
                placeholder="Search your saved cards"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-full focus:outline-1 focus:outline-black transition-all text-sm sm:text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
        
        {searchQuery && (
          <p className="text-sm text-slate-600">
            {filteredCards.length === 0 
              ? 'No cards found matching your search.'
              : `Found ${filteredCards.length} card${filteredCards.length > 1 ? 's' : ''} matching "${searchQuery}"`
            }
          </p>
        )}
      </div>

      {savedCards.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <CreditCard className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No Saved Cards</h3>
          <p className="text-slate-600 mb-6">
            You haven't saved any business cards yet. Create your first card to get started.
          </p>
        
        </div>
      ) : filteredCards.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Search className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No Cards Found</h3>
          <p className="text-slate-600 mb-6">
            No cards match your search criteria. Try a different search term.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card, index) => (
            <div key={card._id || index} className="bg-white rounded-3xl p-6 relative" style={{ boxShadow: '0 4px 2px 0 rgba(0, 0, 0, 0.1)' }}>
              <div className="flex items-center gap-4 mb-4">

                <div className="p-1.5 bg-gradient-to-b from-[#e6e5e5] to-[#bfbfbf] rounded-full aspect-square">
                <img src={getCardLogo(card)} alt={getCardName(card)} className="w-28 min-w-20 border-2 border-white rounded-full object-contain object-center aspect-square" />
                </div>
                <div className="">
                <h3 className="text-lg font-bold text-slate-900 uppercase">
                  {getCardName(card)}
                </h3>
                <p className="text-sm text-slate-600 font-normal capitalize mb-1">
                {/* {getCardName(card)} */}
                  {/* {getCardType(card)} */}
                  {getCardTagline(card)}
                </p>
                <p className="text-[12px] text-slate-600 font-normal capitalize leading-tight">
                  {getCardAbout(card)}
                </p>
                </div>
                <div className="absolute top-2 right-2">
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

                <div className="absolute bottom-3 right-4">
                 {getShareableLink(card) ? (
                   <a
                     href={getShareableLink(card)}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="w-4 h-4"
                   >
                     <img src="/arrow.svg" alt="View Card" className="w-[18px]" />
                   </a>
                 ) : (
                   <button
                     disabled
                     className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-300 text-slate-500 rounded-lg text-sm font-normal cursor-not-allowed"
                   >
                     No Link
                   </button>
                 )}
                 </div>
              </div>


               {/* <div className="space-y-2 mb-6">
                 
                 {(card.data?.email || card.email || card.data?.customCardData?.contact.email) && (
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-slate-800 font-normal">Email</span>
                     <a href={`mailto:${card.data?.email || card.email || card.data?.customCardData?.contact.email}`} className="text-sm font-normal text-blue-700 underline truncate max-w-32">
                       {card.data?.email || card.email || card.data?.customCardData?.contact.email}
                     </a>
                   </div>
                 )}
                 
                 {(card.data?.phoneNumber || card.data?.phone || card.phone || card.data?.customCardData?.contact.phone) && (
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-slate-800 font-normal">Phone</span>
                      <a href={`tel:${card.data?.phoneNumber || card.data?.phone || card.phone || card.data?.customCardData?.contact.phone}`} className="text-sm font-normal text-blue-700 underline">
                       {card.data?.phoneNumber || card.data?.phone || card.phone || card.data?.customCardData?.contact.phone}
                     </a>
                   </div>
                 )}
                 
                 {(card.data?.website || card.website || card.data?.customCardData?.contact.website) && (
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-slate-800 font-normal">Website</span>
                     <a href={card.data?.website || card.website || card.data?.customCardData?.contact.website} className="text-sm font-normal text-blue-700 underline">
                       {card.data?.website || card.website || card.data?.customCardData?.contact.website}
                     </a>
                   </div>
                 )}

               </div> */}

               
                {/* <button
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
                </button> */}


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
