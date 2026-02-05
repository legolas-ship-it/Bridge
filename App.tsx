
import React, { useState, useEffect } from 'react';
import { ViewState, TopicData, UserProfile } from './types';
import { MOCK_TOPICS, INCENTIVE_GOALS } from './constants';
import { TRANSLATIONS, getTranslation } from './translations';
import { generateTopicSummary, generateTopicDeepDive } from './services/geminiService';
import TopicDetail from './components/TopicDetail';
import ProfilePage from './components/ProfilePage';
import { Search, Loader2, RefreshCw, AlertTriangle, Newspaper, ExternalLink, UserCircle, Star, Globe, ArrowRight } from 'lucide-react';

function App() {
  const [viewState, setViewState] = useState<ViewState>(ViewState.HOME);
  const [selectedTopic, setSelectedTopic] = useState<TopicData | null>(null);
  
  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    age: '',
    occupation: '',
    education: '',
    language: 'en',
    membership: 'Free',
    incentives: {
      currentStreak: 2, // Mock start
      totalOutsideCocoonReads: 5,
      errorsCorrected: 0,
      suggestionsAdopted: 0,
      referrals: 1
    }
  });

  // Translation helper
  const t = (key: keyof typeof TRANSLATIONS['en'], params?: any) => getTranslation(userProfile.language, key, params);

  // History State for Cocoon Report
  const [readHistory, setReadHistory] = useState<TopicData[]>([]);

  // Favorites State
  const [favorites, setFavorites] = useState<TopicData[]>([]);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Home Feed State
  const [topics, setTopics] = useState<TopicData[]>(MOCK_TOPICS);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState(0);

  // Simulate periodic background "fetching" every minute
  useEffect(() => {
    const checkUpdates = () => {
      // Logic: Compare latest server timestamp with current local data
      // For simulation, we assume a 70% chance of new content appearing every minute
      const hasNewContent = Math.random() > 0.3; 
      
      if (hasNewContent) {
        setPendingUpdates(prev => prev + 1);
      }
    };

    const interval = setInterval(checkUpdates, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate network fetch to sync the pending background updates
    setTimeout(() => {
      setLastRefresh(new Date());
      setPendingUpdates(0); // Clear the pending count after manual refresh
      setRefreshing(false);
      // In a real app, this would merge new items
    }, 1500);
  };

  const handleTopicClick = (topic: TopicData) => {
    // 1. Add to history
    setReadHistory(prev => [...prev, topic]);

    // 2. Logic to track "Cocoon Breaking" Incentives
    if (topic.isInternational || (topic.category && topic.category !== 'Tech')) {
       setUserProfile(prev => ({
         ...prev,
         incentives: {
           ...prev.incentives,
           totalOutsideCocoonReads: prev.incentives.totalOutsideCocoonReads + 1
         }
       }));
    }

    setSelectedTopic(topic);
    setViewState(ViewState.DETAIL);
    window.scrollTo(0,0);
  };

  const handleToggleFavorite = (topic: TopicData) => {
    setFavorites(prev => {
      const exists = prev.find(t => t.id === topic.id);
      if (exists) {
        return prev.filter(t => t.id !== topic.id);
      } else {
        return [...prev, topic];
      }
    });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setViewState(ViewState.SEARCHING);

    try {
      // Stage 1: Fast Summary (with User Profile -> passes Language & Membership)
      const summaryData = await generateTopicSummary(searchQuery, userProfile);
      
      // Add generated topic to history
      setReadHistory(prev => [...prev, summaryData]);

      setSelectedTopic(summaryData);
      setViewState(ViewState.DETAIL);
      setSearchQuery(''); 
      setIsSearching(false); // Stop main spinner, detail view handles deeper loading

      // Stage 2: Deep Dive (Background) (with User Profile -> triggers Expert Mode for Pros)
      generateTopicDeepDive(searchQuery, summaryData, userProfile)
        .then((deepDiveData) => {
          setSelectedTopic(prev => {
             if (prev && prev.id === summaryData.id) {
               return { ...prev, ...deepDiveData };
             }
             return prev;
          });
          // Also update favorites if this topic is favorited
          setFavorites(prev => prev.map(f => {
            if (f.id === summaryData.id) {
              return { ...f, ...deepDiveData };
            }
            return f;
          }));
        })
        .catch(err => {
          console.error("Deep dive generation failed", err);
          // Optional: handle partial error state in UI
        });

    } catch (error) {
      console.error(error);
      setSearchError("Unable to analyze this topic. Please check your API key or try a different query.");
      setViewState(ViewState.HOME); 
      setIsSearching(false);
    }
  };

  const handleBack = () => {
    setViewState(ViewState.HOME);
    setSelectedTopic(null);
  };

  const handleSaveProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    // In a real app, we would save to localStorage here
  };

  // Helper to determine if profile is set (for visual indicator)
  const isProfileActive = userProfile.age || userProfile.occupation || userProfile.education;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      {/* Persistent Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer shrink-0" 
            onClick={handleBack}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">B</div>
            <span className="font-bold text-slate-800 text-xl tracking-tight hidden sm:block">Bridge</span>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-md relative hidden sm:block">
             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
             </div>
             <input
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder={userProfile.age ? t('analyzePlaceholderWithAge', { age: userProfile.age }) : t('analyzePlaceholder')}
               className="w-full bg-slate-100 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-full pl-10 pr-4 py-2 text-sm transition-all outline-none text-slate-700"
               disabled={isSearching}
             />
          </form>

          <div className="flex items-center gap-2">
             <button 
               onClick={handleRefresh}
               className={`relative p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-all ${refreshing ? 'animate-spin' : ''}`}
               title={pendingUpdates > 0 ? `${pendingUpdates} ${t('newUpdates')}` : t('refreshFeed')}
             >
               <RefreshCw size={20} />
               {pendingUpdates > 0 && !refreshing && (
                 <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
               )}
             </button>

             <button
               onClick={() => setViewState(ViewState.PROFILE)}
               className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all border ${viewState === ViewState.PROFILE ? 'bg-blue-100 border-blue-200 text-blue-800' : isProfileActive ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
             >
                <UserCircle size={20} className={isProfileActive ? 'fill-blue-200' : ''} />
                <span className="text-sm font-medium hidden md:block">
                  {isProfileActive ? t('center') : t('personalize')}
                </span>
                {userProfile.membership === 'Pro' && (
                  <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-1.5 rounded-full ml-1">{t('proTag')}</span>
                )}
             </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Search Bar (visible only on small screens below header) */}
       {viewState !== ViewState.PROFILE && (
         <div className="sm:hidden px-4 py-3 bg-white border-b border-slate-200 sticky top-16 z-40">
          <form onSubmit={handleSearch} className="relative">
               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
               </div>
               <input
                 type="text"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder={t('analyzePlaceholder')}
                 className="w-full bg-slate-100 border border-transparent focus:bg-white focus:border-blue-500 rounded-full pl-10 pr-4 py-2 text-sm outline-none text-slate-700"
                 disabled={isSearching}
               />
            </form>
         </div>
       )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        
        {searchError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
            <AlertTriangle size={20} />
            <p className="text-sm">{searchError}</p>
            <button onClick={() => setSearchError(null)} className="ml-auto text-xs font-bold hover:underline">Dismiss</button>
          </div>
        )}

        {viewState === ViewState.SEARCHING && (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 relative">
              <Loader2 size={32} className="animate-spin" />
              <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-transparent animate-spin duration-1000"></div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{t('loadingReading')}</h2>
            <p className="text-slate-500 text-center max-w-md">
              {t('loadingExtracting')}...
            </p>
          </div>
        )}

        {viewState === ViewState.PROFILE && (
          <ProfilePage 
            onBack={handleBack}
            profile={userProfile}
            onSave={handleSaveProfile}
            readHistory={readHistory}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onTopicClick={handleTopicClick}
          />
        )}

        {viewState === ViewState.DETAIL && selectedTopic && (
          <TopicDetail 
            topic={selectedTopic} 
            onBack={handleBack} 
            isFavorite={favorites.some(f => f.id === selectedTopic.id)}
            onToggleFavorite={() => handleToggleFavorite(selectedTopic)}
            language={userProfile.language}
            userProfile={userProfile}
            onUpgradeClick={() => setViewState(ViewState.PROFILE)}
          />
        )}

        {viewState === ViewState.HOME && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="grid gap-4">
              {topics.map((topic) => {
                const isFav = favorites.some(f => f.id === topic.id);
                return (
                  <div 
                    key={topic.id}
                    onClick={() => handleTopicClick(topic)}
                    className="group bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Time & Favorite Button - Aligned with Padding top-5 right-5 */}
                    <div className="absolute top-5 right-5 z-10 flex items-center">
                      <span className="text-xs font-medium text-slate-400 mr-2 bg-slate-50 px-2 py-1 rounded border border-slate-100 hidden sm:block">
                        {topic.lastUpdated}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(topic);
                        }}
                        className="p-2 text-slate-300 hover:text-amber-400 hover:bg-amber-50 rounded-full transition-colors"
                        title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                      >
                        <Star size={18} className={isFav ? "fill-amber-400 text-amber-400" : ""} />
                      </button>
                    </div>

                    <div className="flex flex-col gap-2.5 pr-28 sm:pr-32">
                      {/* Header Row */}
                      <div className="flex items-center gap-2 flex-wrap">
                          {/* Sources */}
                          <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full shrink-0">
                             <Newspaper size={10} />
                             {topic.sourceCount} {t('sources')}
                          </span>

                          {/* Category Tag */}
                          {topic.category && (
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border border-slate-200 rounded px-1.5 py-0.5 shrink-0">
                               {topic.category}
                             </span>
                           )}

                           {/* Global Tag (Placed after Category) */}
                          {topic.isInternational && (
                             <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-indigo-100 uppercase tracking-wider shrink-0">
                               <Globe size={10} />
                               {t('global')}
                             </span>
                           )}
                      </div>

                      {/* Title & Summary */}
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-tight mb-1.5">
                           {topic.title}
                        </h2>
                        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                          <span className="font-semibold text-slate-700 mr-1">{t('impact')}:</span>
                          {topic.whyMatters}
                        </p>
                      </div>
                    </div>
                    
                    <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                      <ArrowRight size={20} className="text-blue-500" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 text-center text-slate-400 text-sm pb-8">
              <p>{t('footer')}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
