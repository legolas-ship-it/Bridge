
import React, { useState, useEffect } from 'react';
import { ViewState, TopicData, UserProfile, TopicCategory } from './types';
import { MOCK_TOPICS, INCENTIVE_GOALS } from './constants';
import { TRANSLATIONS, getTranslation } from './translations';
import { generateTopicSummary, generateTopicDeepDive } from './services/geminiService';
import TopicDetail from './components/TopicDetail';
import ProfilePage from './components/ProfilePage';
import AudioFeed from './components/AudioFeed';
import { Search, Loader2, RefreshCw, AlertTriangle, Newspaper, ExternalLink, UserCircle, Star, Globe, ArrowRight, Clock, Sparkles, Eye, TrendingUp, Layers } from 'lucide-react';

// Define the sub-categories list
const SUB_CATEGORIES: { id: TopicCategory | 'All', labelKey: keyof typeof TRANSLATIONS['en'] }[] = [
  { id: 'All', labelKey: 'all' },
  { id: 'Agriculture', labelKey: 'catAgriculture' },
  { id: 'Tech', labelKey: 'catTech' },
  { id: 'Economy', labelKey: 'catEconomy' },
  { id: 'Society', labelKey: 'catSociety' },
  { id: 'Culture', labelKey: 'catCulture' },
  { id: 'Entertainment', labelKey: 'catEntertainment' },
  { id: 'Politics', labelKey: 'catPolitics' },
  { id: 'Gaming', labelKey: 'catGaming' },
  { id: 'History', labelKey: 'catHistory' },
  { id: 'Space', labelKey: 'catSpace' },
];

function App() {
  const [viewState, setViewState] = useState<ViewState>(ViewState.HOME);
  const [selectedTopic, setSelectedTopic] = useState<TopicData | null>(null);
  
  // Feed Filter State
  const [activeFeedTab, setActiveFeedTab] = useState<'trending' | 'perspective' | 'underreported' | 'curiosity'>('trending');
  const [activeSubTab, setActiveSubTab] = useState<TopicCategory | 'All'>('All');

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

  // Lens SVG Component
  const LensIcon = ({ scope = 0, diversity = 0, controversy = 0 }) => {
    // 3 Rings: Scope (Outer), Diversity (Middle), Controversy (Inner)
    // Center 24, 24
    const r1 = 20; // Scope
    const r2 = 14; // Diversity
    const r3 = 8;  // Controversy
    const c1 = 2 * Math.PI * r1;
    const c2 = 2 * Math.PI * r2;
    const c3 = 2 * Math.PI * r3;

    // Helper to get text labels
    const getScopeLabel = (v: number) => v > 70 ? 'Wide' : v > 40 ? 'Med' : 'Narrow';
    const getLevelLabel = (v: number) => v > 70 ? 'High' : v > 40 ? 'Med' : 'Low';

    return (
      <div className="flex items-center gap-3">
        <svg width="46" height="46" viewBox="0 0 48 48" className="-rotate-90 shrink-0">
           {/* Background Rings */}
           <circle cx="24" cy="24" r={r1} stroke="#f1f5f9" strokeWidth="3" fill="none" />
           <circle cx="24" cy="24" r={r2} stroke="#f1f5f9" strokeWidth="3" fill="none" />
           <circle cx="24" cy="24" r={r3} stroke="#f1f5f9" strokeWidth="3" fill="none" />
           
           {/* Data Rings - Using Higher Saturation Colors (600 series) */}
           {/* Scope: Indigo 600 */}
           <circle cx="24" cy="24" r={r1} stroke="#4f46e5" strokeWidth="3" fill="none" 
             strokeDasharray={c1} strokeDashoffset={c1 - (scope/100)*c1} strokeLinecap="round" className="transition-all duration-1000" />
           
           {/* Diversity: Sky 600 */}
           <circle cx="24" cy="24" r={r2} stroke="#0284c7" strokeWidth="3" fill="none" 
             strokeDasharray={c2} strokeDashoffset={c2 - (diversity/100)*c2} strokeLinecap="round" className="transition-all duration-1000" />
           
           {/* Controversy: Rose 600 */}
           <circle cx="24" cy="24" r={r3} stroke="#e11d48" strokeWidth="3" fill="none" 
             strokeDasharray={c3} strokeDashoffset={c3 - (controversy/100)*c3} strokeLinecap="round" className="transition-all duration-1000" />
        </svg>
        <div className="flex flex-col text-[11px] font-bold uppercase tracking-wider gap-1.5 leading-none min-w-[100px]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-indigo-600">Scope</span>
            <span className="text-slate-400">{getScopeLabel(scope)}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sky-600">Diversity</span>
            <span className="text-slate-400">{getLevelLabel(diversity)}</span>
          </div>
           <div className="flex items-center justify-between gap-2">
            <span className="text-rose-600">Conflict</span>
            <span className="text-slate-400">{getLevelLabel(controversy)}</span>
          </div>
        </div>
      </div>
    );
  };

  // Helper to determine if profile is set (for visual indicator)
  const isProfileActive = userProfile.age || userProfile.occupation || userProfile.education;

  // Filter Topics Logic
  const getFilteredTopics = () => {
    let filtered = topics;

    // 1. Primary Feed Filter
    switch (activeFeedTab) {
      case 'perspective':
        // Strict Filter: Only topics with High Diversity OR High Controversy. 
        // This ensures the "Change Angle" list feels significantly different from "Trending".
        filtered = filtered.filter(t => 
          (t.lensMetrics?.diversity || 0) >= 60 || 
          (t.lensMetrics?.controversy || 0) >= 60
        );
        break;
      
      case 'underreported':
        // Filter for "Hidden Gems": Low source count (< 80)
        filtered = filtered.filter(t => t.sourceCount < 80);
        break;
      
      case 'curiosity':
        // Show specific discovery categories that are often non-mainstream news
        filtered = filtered.filter(t => 
           ['Space', 'History', 'Science', 'Culture', 'Gaming', 'Entertainment'].includes(t.category)
        );
        break;
      
      case 'trending':
      default:
        // "Trending" implies popularity, so filter out very low signal items (> 40 sources)
        // to keep the main feed feeling "alive" and "major".
        filtered = filtered.filter(t => t.sourceCount > 40);
        break;
    }

    // 2. Secondary Sub-Category Filter
    if (activeSubTab !== 'All') {
        filtered = filtered.filter(t => t.category === activeSubTab);
    }

    return filtered;
  };

  const displayedTopics = getFilteredTopics();

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

          {/* Audio Feed & Search Container */}
          <div className="flex-1 max-w-lg hidden sm:flex items-center gap-3">
             {/* Audio Feed (Podcast) */}
             <AudioFeed topics={topics} />

             {/* Search Bar */}
             <form onSubmit={handleSearch} className="flex-1 relative mt-4">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                 {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={userProfile.age ? t('analyzePlaceholderWithAge', { age: userProfile.age }) : t('analyzePlaceholder')}
                  className="w-full bg-slate-100 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-full pl-10 pr-4 h-10 text-sm transition-all outline-none text-slate-700"
                  disabled={isSearching}
                />
             </form>
          </div>

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
         <div className="sm:hidden px-4 py-3 bg-white border-b border-slate-200 sticky top-16 z-40 space-y-3">
          <div className="flex items-center gap-2">
            <AudioFeed topics={topics} />
            <form onSubmit={handleSearch} className="relative flex-1">
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
            
            {/* Feed Category Tabs (Level 1) */}
            <div className="mb-4">
               <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                 
                 <button 
                   onClick={() => setActiveFeedTab('trending')}
                   className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${activeFeedTab === 'trending' ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                 >
                   <div className="flex items-center gap-1.5">
                     <TrendingUp size={14} />
                     {t('feedTrending')}
                   </div>
                 </button>

                 <button 
                   onClick={() => setActiveFeedTab('perspective')}
                   className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${activeFeedTab === 'perspective' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                 >
                   <div className="flex items-center gap-1.5">
                     <Layers size={14} />
                     {t('feedPerspective')}
                   </div>
                 </button>

                 <button 
                   onClick={() => setActiveFeedTab('underreported')}
                   className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${activeFeedTab === 'underreported' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                 >
                   <div className="flex items-center gap-1.5">
                     <Eye size={14} />
                     {t('feedUnderreported')}
                   </div>
                 </button>

                 <button 
                   onClick={() => setActiveFeedTab('curiosity')}
                   className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${activeFeedTab === 'curiosity' ? 'bg-amber-500 text-white border-amber-500 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                 >
                   <div className="flex items-center gap-1.5">
                     <Sparkles size={14} />
                     {t('feedCuriosity')}
                   </div>
                 </button>
               </div>

               {/* Dynamic Tab Description */}
               <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-300">
                  <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-medium ${
                     activeFeedTab === 'trending' ? 'bg-slate-100 text-slate-600' :
                     activeFeedTab === 'perspective' ? 'bg-indigo-50 text-indigo-700' :
                     activeFeedTab === 'underreported' ? 'bg-emerald-50 text-emerald-700' :
                     'bg-amber-50 text-amber-800'
                  }`}>
                     {activeFeedTab === 'trending' && t('descTrending')}
                     {activeFeedTab === 'perspective' && t('descPerspective')}
                     {activeFeedTab === 'underreported' && t('descUnderreported')}
                     {activeFeedTab === 'curiosity' && t('descCuriosity')}
                  </span>
               </div>
            </div>

            {/* Sub-Category Filter (Level 2) - New lightweight scrollable bar */}
            <div className="mb-6 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-6 overflow-x-auto no-scrollbar px-1 py-1">
                   {SUB_CATEGORIES.map(cat => (
                     <button
                       key={cat.id}
                       onClick={() => setActiveSubTab(cat.id)}
                       className={`text-xs font-medium whitespace-nowrap transition-all duration-300 px-2 py-1 ${
                         activeSubTab === cat.id 
                           ? 'text-slate-900 font-bold scale-105' 
                           : 'text-slate-400 hover:text-slate-600'
                       }`}
                     >
                       {t(cat.labelKey)}
                     </button>
                   ))}
                </div>
            </div>

            <div className="grid gap-6">
              {displayedTopics.map((topic) => {
                const isFav = favorites.some(f => f.id === topic.id);
                return (
                  <div 
                    key={topic.id}
                    onClick={() => handleTopicClick(topic)}
                    className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row gap-5">
                      
                      {/* Left Column: Context (70%) */}
                      <div className="w-full sm:w-[70%] flex flex-col justify-between gap-3">
                         
                         {/* Row 1: Narrative Title */}
                         <div>
                            <h2 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-tight">
                              {topic.title}
                            </h2>
                         </div>

                         {/* Row 2: Human-Centric Story Hook */}
                         <div className="flex-1">
                           <p className="text-sm font-serif text-slate-600 leading-relaxed whitespace-pre-line">
                             {topic.whyMatters}
                           </p>
                         </div>

                         {/* Row 3: Footer Stats */}
                         <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-50 mt-1">
                            <div className="flex items-center gap-1 font-medium text-slate-500">
                               <Clock size={12} />
                               <span>{topic.readingTime || 3} min read</span>
                            </div>
                            {topic.impactHint && (
                               <span className="italic text-slate-400 hidden sm:inline-block">
                                 {topic.impactHint}
                               </span>
                            )}
                         </div>

                      </div>

                      {/* Divider for Mobile */}
                      <div className="w-full h-px bg-slate-100 sm:hidden"></div>

                      {/* Right Column: Lens (30%) - Optimized Layout */}
                      <div className="w-full sm:w-[30%] flex flex-col justify-between items-end gap-3 pl-0 sm:pl-5 pr-0 sm:border-l border-slate-100 relative min-h-[140px]">
                         
                         {/* Row 1: Favorite Icon */}
                         <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(topic);
                            }}
                            className="absolute top-10 right-[15px] text-slate-300 hover:text-amber-400 hover:bg-amber-50 rounded-full transition-colors p-1 z-10"
                            title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                          >
                            <Star size={20} className={isFav ? "fill-amber-400 text-amber-400" : ""} />
                          </button>

                         {/* Row 2: Lens SVG - Centered Vertically in upper space */}
                         <div className="flex-1 flex items-center justify-end w-full py-2 pr-[70px]">
                            <LensIcon 
                              scope={topic.lensMetrics?.scope || 50} 
                              diversity={topic.lensMetrics?.diversity || 50} 
                              controversy={topic.lensMetrics?.controversy || 50} 
                            />
                         </div>

                         {/* Row 3: Tension Tag (Centered Box) */}
                         {topic.coreTension && (
                           <div className="bg-blue-50/80 w-full rounded-lg py-2 px-3 text-center border border-blue-100/50">
                              <span className="block text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">{topic.tensionLabel || "Core Tension"}</span>
                              <span className="text-xs font-bold text-blue-900 font-mono tracking-tight">{topic.coreTension}</span>
                           </div>
                         )}
                      </div>

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
