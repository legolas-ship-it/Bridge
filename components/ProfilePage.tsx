
import React, { useState, useEffect } from 'react';
import { UserProfile, TopicData, Language, MembershipTier } from '../types';
import { INCENTIVE_GOALS } from '../constants';
import { TRANSLATIONS, getTranslation } from '../translations';
import { Save, UserCircle, ShieldCheck, BookOpen, BrainCircuit, Activity, PieChart, Star, Search, Trash2, Globe, Crown, Award, CheckCircle2, ArrowLeft, Zap, History, Clock } from 'lucide-react';
import { generateCocoonReport } from '../services/cocoonService';
import CocoonReport from './CocoonReport';

interface ProfilePageProps {
  onBack: () => void;
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  readHistory: TopicData[];
  favorites: TopicData[];
  onToggleFavorite: (topic: TopicData) => void;
  onTopicClick: (topic: TopicData) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack, profile, onSave, readHistory, favorites, onToggleFavorite, onTopicClick }) => {
  // Tab Order: Report -> Favorites -> History -> Incentives -> Settings
  const [activeTab, setActiveTab] = useState<'report' | 'favorites' | 'history' | 'membership' | 'settings'>('report');
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [favSearch, setFavSearch] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Translation helper
  const t = (key: keyof typeof TRANSLATIONS['en'], params?: any) => getTranslation(formData.language, key, params);

  // Reset form data when profile changes
  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  // Generate Report Data on the fly (now using favorites for Trend calculation)
  const reportData = generateCocoonReport(readHistory, favorites);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleUpgrade = () => {
    const newProfile = { ...formData, membership: 'Pro' as MembershipTier };
    setFormData(newProfile);
    onSave(newProfile);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  // Filter and Group Favorites
  const filteredFavorites = favorites.filter(t => 
    t.title.toLowerCase().includes(favSearch.toLowerCase()) || 
    t.summary.toLowerCase().includes(favSearch.toLowerCase())
  );

  const groupedFavorites = filteredFavorites.reduce((acc, topic) => {
    const cat = topic.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(topic);
    return acc;
  }, {} as Record<string, TopicData[]>);

  // Incentive Progress Bar Component
  const IncentiveBar = ({ label, current, target }: { label: string, current: number, target: number }) => {
    const progress = Math.min(100, (current / target) * 100);
    const isMet = current >= target;

    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1 text-sm">
           <span className={`font-medium ${isMet ? 'text-emerald-600' : 'text-slate-600'}`}>{label}</span>
           <span className="text-xs text-slate-400">{current} / {target}</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${isMet ? 'bg-emerald-500' : 'bg-blue-500'}`} 
            style={{ width: `${progress}%` }} 
          />
        </div>
        {isMet && <div className="text-[10px] text-emerald-600 mt-0.5 flex items-center gap-1"><CheckCircle2 size={10} /> Goal Met</div>}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-300 relative">
        
        {showCelebration && (
          <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
             <div className="bg-amber-100 text-amber-800 px-6 py-3 rounded-full font-bold shadow-xl animate-bounce border-2 border-amber-300 flex items-center gap-2">
               <Crown size={24} className="fill-amber-500" />
               Welcome to Pro!
             </div>
          </div>
        )}

        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
           <button 
             onClick={onBack}
             className="p-2 -ml-2 text-slate-400 hover:text-slate-800 transition-colors"
           >
             <ArrowLeft size={24} />
           </button>
           <div className="flex items-center gap-3">
             <div className={`p-2 rounded-xl shadow-sm transition-colors duration-500 ${formData.membership === 'Pro' ? 'bg-amber-100 text-amber-600' : 'bg-white border border-slate-200 text-slate-600'}`}>
               {formData.membership === 'Pro' ? <Crown size={28} className="fill-amber-500" /> : <UserCircle size={28} />}
             </div>
             <div>
               <h1 className="text-2xl font-bold text-slate-900">{t('personalCenter')}</h1>
               <div className="flex items-center gap-2">
                  <p className="text-sm text-slate-500">{t('manageProfile')}</p>
                  {formData.membership === 'Pro' && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 animate-in zoom-in">{t('proMember')}</span>
                  )}
               </div>
             </div>
           </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px] flex flex-col md:flex-row">
          
          {/* Sidebar Tabs (Desktop) / Top Tabs (Mobile) */}
          <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100 flex md:flex-col shrink-0 overflow-x-auto md:overflow-visible">
            {/* 1. Cocoon Report */}
            <button 
              onClick={() => setActiveTab('report')}
              className={`flex-1 md:flex-none px-6 py-4 text-sm font-medium flex items-center gap-3 border-l-4 transition-colors whitespace-nowrap ${activeTab === 'report' ? 'border-purple-500 bg-white text-purple-600 shadow-sm' : 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
            >
              <PieChart size={18} />
              {t('cocoonReport')}
            </button>

            {/* 2. Favorites */}
            <button 
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 md:flex-none px-6 py-4 text-sm font-medium flex items-center gap-3 border-l-4 transition-colors whitespace-nowrap ${activeTab === 'favorites' ? 'border-amber-500 bg-white text-amber-600 shadow-sm' : 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
            >
              <Star size={18} />
              {t('favorites')}
            </button>

            {/* 3. History (New) */}
            <button 
              onClick={() => setActiveTab('history')}
              className={`flex-1 md:flex-none px-6 py-4 text-sm font-medium flex items-center gap-3 border-l-4 transition-colors whitespace-nowrap ${activeTab === 'history' ? 'border-indigo-500 bg-white text-indigo-600 shadow-sm' : 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
            >
              <History size={18} />
              {t('history')}
            </button>

            {/* 4. Incentives */}
            <button 
              onClick={() => setActiveTab('membership')}
              className={`flex-1 md:flex-none px-6 py-4 text-sm font-medium flex items-center gap-3 border-l-4 transition-colors whitespace-nowrap ${activeTab === 'membership' ? 'border-emerald-500 bg-white text-emerald-600 shadow-sm' : 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
            >
              <Award size={18} />
              {t('incentives')}
            </button>

            {/* 5. Settings */}
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex-1 md:flex-none px-6 py-4 text-sm font-medium flex items-center gap-3 border-l-4 transition-colors whitespace-nowrap ${activeTab === 'settings' ? 'border-blue-500 bg-white text-blue-600 shadow-sm' : 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
            >
              <Activity size={18} />
              {t('settings')}
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[800px] custom-scrollbar">
            
            {activeTab === 'report' && (
              <CocoonReport 
                data={reportData} 
                language={formData.language} 
                userProfile={formData}
                onUpgradeClick={handleUpgrade}
              />
            )}

            {activeTab === 'favorites' && (
              <div className="h-full flex flex-col animate-in fade-in duration-300">
                <div className="relative shrink-0 mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder={t('searchFavorites')}
                    value={favSearch}
                    onChange={(e) => setFavSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition-all"
                  />
                </div>

                <div className="flex-1 space-y-8">
                  {favorites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-slate-400 text-sm py-20 border-2 border-dashed border-slate-100 rounded-xl">
                      <Star size={48} className="mb-4 opacity-10" />
                      <p>{t('noFavorites')}</p>
                      <button onClick={onBack} className="mt-4 text-blue-600 font-medium hover:underline">
                        {t('goExplore')}
                      </button>
                    </div>
                  ) : Object.keys(groupedFavorites).length === 0 ? (
                     <div className="text-center text-slate-400 text-sm py-10">
                       {t('noMatches')}
                     </div>
                  ) : (
                    // Fix: Explicitly type map arguments to avoid 'unknown' inference
                    Object.entries(groupedFavorites).map(([category, items]: [string, TopicData[]]) => (
                      <div key={category}>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">{category}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {items.map(topic => (
                            <div key={topic.id} onClick={() => onTopicClick(topic)} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-amber-200 transition-all group relative cursor-pointer">
                              <div className="pr-8">
                                <h5 className="font-bold text-slate-800 text-base mb-2 leading-tight">{topic.title}</h5>
                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{topic.summary}</p>
                              </div>
                              <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleFavorite(topic);
                                }}
                                className="absolute top-4 right-4 text-slate-300 hover:text-red-400 transition-colors p-1"
                                title="Remove favorite"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="h-full flex flex-col animate-in fade-in duration-300">
                <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold text-lg">
                  <History size={20} className="text-indigo-500" />
                  {t('recentlyViewed')}
                </div>
                
                {readHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-slate-400 text-sm py-20 border-2 border-dashed border-slate-100 rounded-xl">
                      <Clock size={48} className="mb-4 opacity-10" />
                      <p>{t('noHistory')}</p>
                      <button onClick={onBack} className="mt-4 text-blue-600 font-medium hover:underline">
                        {t('startReading')}
                      </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* Show history in reverse order (newest first) */}
                        {[...readHistory].reverse().map((topic, index) => (
                            <div 
                                key={`${topic.id}-${index}`} 
                                onClick={() => onTopicClick(topic)}
                                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer flex items-center justify-between group"
                            >
                                <div className="flex-1 pr-4">
                                     <div className="flex items-center gap-2 mb-1">
                                         {topic.category && (
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border border-slate-100 rounded px-1.5 py-0.5">
                                                {topic.category}
                                            </span>
                                         )}
                                         <span className="text-[10px] text-slate-300 flex items-center gap-1">
                                             <Clock size={10} />
                                             {topic.lastUpdated}
                                         </span>
                                     </div>
                                     <h5 className="font-bold text-slate-800 text-sm">{topic.title}</h5>
                                </div>
                                <div className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowLeft size={16} className="rotate-180" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
              </div>
            )}

            {activeTab === 'membership' && (
               <div className="animate-in fade-in duration-300 max-w-xl">
                 <div className={`rounded-2xl p-6 text-white mb-8 shadow-lg transition-all duration-500 ${formData.membership === 'Pro' ? 'bg-gradient-to-r from-amber-600 to-orange-500' : 'bg-gradient-to-br from-slate-900 to-slate-800'}`}>
                   <div className="flex justify-between items-start">
                     <div>
                       <p className="text-white/60 text-xs uppercase tracking-wider font-bold mb-1">{t('currentTier')}</p>
                       <h3 className="text-3xl font-bold flex items-center gap-2">
                         {formData.membership} Member
                         {formData.membership === 'Pro' && <Crown size={24} className="fill-white text-white animate-bounce" />}
                       </h3>
                     </div>
                     {formData.membership === 'Free' && (
                       <button 
                        onClick={handleUpgrade}
                        className="text-xs bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-full font-bold transition-colors shadow-lg flex items-center gap-2"
                       >
                         <Zap size={14} className="fill-white" />
                         {t('upgradePro')}
                       </button>
                     )}
                   </div>
                   
                   {formData.membership === 'Pro' ? (
                     <p className="text-sm text-white/90 mt-4 leading-relaxed font-medium">
                       {t('proAccess')}
                     </p>
                   ) : (
                      <div className="mt-6 pt-4 border-t border-slate-700/50">
                         <p className="text-sm text-slate-300 font-medium">{t('completeChallenges')}</p>
                      </div>
                   )}
                 </div>

                 {formData.membership === 'Free' && (
                   <div className="space-y-6">
                     <div>
                        <h4 className="font-bold text-slate-800 text-lg mb-4">{t('roadToMembership')}</h4>
                        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-2 shadow-sm">
                          <IncentiveBar 
                            label="7-Day Reading Streak" 
                            current={formData.incentives.currentStreak} 
                            target={INCENTIVE_GOALS.streak} 
                          />
                          <IncentiveBar 
                            label="Read 'Outside Cocoon'" 
                            current={formData.incentives.totalOutsideCocoonReads} 
                            target={INCENTIVE_GOALS.reads} 
                          />
                          <IncentiveBar 
                            label="Correct Information Errors" 
                            current={formData.incentives.errorsCorrected} 
                            target={INCENTIVE_GOALS.errors} 
                          />
                          <IncentiveBar 
                            label="Suggestions Adopted" 
                            current={formData.incentives.suggestionsAdopted} 
                            target={INCENTIVE_GOALS.suggestions} 
                          />
                          <IncentiveBar 
                            label="Invite Friends" 
                            current={formData.incentives.referrals} 
                            target={INCENTIVE_GOALS.referrals} 
                          />
                        </div>
                        <p className="text-xs text-slate-500 text-center pt-3">
                          *Pro benefits are automatically unlocked for 30 days upon completing any 3 goals.
                        </p>
                     </div>
                   </div>
                 )}

                 <div className="mt-8">
                   <h4 className="font-bold text-slate-800 text-lg mb-4">{t('proFeatures')}</h4>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className={`p-5 rounded-xl border flex flex-col gap-2 transition-colors ${formData.membership === 'Pro' ? 'bg-amber-50 border-amber-200' : 'bg-purple-50 border-purple-100'}`}>
                        <div className={`flex items-center gap-2 font-bold text-sm ${formData.membership === 'Pro' ? 'text-amber-700' : 'text-purple-700'}`}>
                          <BrainCircuit size={18} />
                          {t('expertSim')}
                        </div>
                        <p className={`text-xs leading-relaxed ${formData.membership === 'Pro' ? 'text-amber-900/70' : 'text-purple-900/70'}`}>{t('expertSimDesc')}</p>
                     </div>
                     <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                          <BookOpen size={18} />
                          {t('academicRefs')}
                        </div>
                        <p className="text-xs text-blue-900/70 leading-relaxed">{t('academicRefsDesc')}</p>
                     </div>
                   </div>
                 </div>
               </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-8 animate-in fade-in duration-300 max-w-lg">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4">{t('localization')}</h3>
                     <label className="block text-sm font-semibold text-slate-700 mb-2">{t('interfaceLanguage')}</label>
                     <div className="relative">
                       <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                       <select
                         name="language"
                         value={formData.language}
                         onChange={handleChange}
                         className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer hover:bg-slate-100"
                       >
                         <option value="en">English</option>
                       </select>
                     </div>
                  </div>

                  <hr className="border-slate-100" />

                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4">{t('cognitiveProfile')}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">{t('age')}</label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          placeholder="e.g. 25"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                        <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                          <ShieldCheck size={10} />
                          {t('ageHint')}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">{t('occupation')}</label>
                        <input
                          type="text"
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleChange}
                          placeholder="e.g. Student, Engineer, Policy Maker"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                        <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                          <BrainCircuit size={10} />
                          {t('occupationHint')}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">{t('education')}</label>
                        <select
                          name="education"
                          value={formData.education}
                          onChange={handleChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer hover:bg-slate-100"
                        >
                          <option value="">Select Level...</option>
                          <option value="Elementary">Elementary / Primary</option>
                          <option value="High School">High School</option>
                          <option value="Undergraduate">Undergraduate</option>
                          <option value="Postgraduate">Postgraduate / PhD</option>
                          <option value="Self-Taught">Self-Taught / General Interest</option>
                        </select>
                        <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                          <BookOpen size={10} />
                          {t('educationHint')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-bold transition-all shadow-md active:scale-95 transform"
                  >
                    <Save size={18} />
                    {t('saveConfig')}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
    </div>
  );
};

export default ProfilePage;
