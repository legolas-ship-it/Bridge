
import React, { useState, useEffect } from 'react';
import { UserProfile, TopicData, TopicCategory, Language, MembershipTier } from '../types';
import { INCENTIVE_GOALS } from '../constants';
import { X, Save, UserCircle, ShieldCheck, BookOpen, BrainCircuit, Activity, PieChart, Star, Search, Trash2, Globe, Crown, Award, CheckCircle2 } from 'lucide-react';
import { generateCocoonReport } from '../services/cocoonService';
import CocoonReport from './CocoonReport';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  readHistory: TopicData[];
  favorites: TopicData[];
  onToggleFavorite: (topic: TopicData) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, profile, onSave, readHistory, favorites, onToggleFavorite }) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'report' | 'favorites' | 'membership'>('settings');
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [favSearch, setFavSearch] = useState('');

  // Reset form data when modal opens or profile changes
  useEffect(() => {
    setFormData(profile);
  }, [profile, isOpen]);

  // Generate Report Data on the fly (now using favorites for Trend calculation)
  const reportData = generateCocoonReport(readHistory, favorites);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };
  
  const handleUpgrade = () => {
     setFormData(prev => ({ ...prev, membership: 'Pro' }));
     // Not persisting immediately here, relies on handleSave, but for demo UI feedback:
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${formData.membership === 'Pro' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
              {formData.membership === 'Pro' ? <Crown size={24} className="fill-amber-500" /> : <UserCircle size={24} />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Personal Center</h2>
              <div className="flex items-center gap-2">
                 <p className="text-xs text-slate-500">Manage profile & cognitive health</p>
                 {formData.membership === 'Pro' && (
                   <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">PRO</span>
                 )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 shrink-0 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors px-4 whitespace-nowrap ${activeTab === 'settings' ? 'border-blue-500 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <Activity size={16} />
            Settings
          </button>
          <button 
            onClick={() => setActiveTab('report')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors px-4 whitespace-nowrap ${activeTab === 'report' ? 'border-purple-500 text-purple-600 bg-purple-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <PieChart size={16} />
            Report
          </button>
          <button 
            onClick={() => setActiveTab('membership')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors px-4 whitespace-nowrap ${activeTab === 'membership' ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <Award size={16} />
            Incentives
          </button>
           <button 
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors px-4 whitespace-nowrap ${activeTab === 'favorites' ? 'border-amber-500 text-amber-600 bg-amber-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <Star size={16} />
            Favorites
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in slide-in-from-left-4 duration-200">
              <div className="space-y-4">
                {/* Language Switcher */}
                <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-1">Interface Language</label>
                   <div className="relative">
                     <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                     <select
                       name="language"
                       value={formData.language}
                       onChange={handleChange}
                       className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                     >
                       <option value="en">English</option>
                     </select>
                   </div>
                </div>

                <hr className="border-slate-100" />

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Age</label>
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
                    Used for safety filtering & sensitivity grading
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Occupation / Role</label>
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
                    Used to adjust topic relevance & examples
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Education Background</label>
                  <select
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
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
                    Used to adjust vocabulary complexity & depth
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
                <p className="font-medium mb-1">AI Adaptation Preview:</p>
                <ul className="list-disc list-inside text-xs space-y-1 opacity-80">
                  <li>Output Language: {formData.language.toUpperCase()}</li>
                  <li>Safety filters applied for age group.</li>
                  <li>Summary complexity matches education.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'report' && (
            <CocoonReport 
                data={reportData} 
                userProfile={formData} 
                onUpgradeClick={handleUpgrade}
            />
          )}

          {activeTab === 'membership' && (
             <div className="animate-in slide-in-from-right-4 duration-200">
               <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 text-white mb-6">
                 <div className="flex justify-between items-start">
                   <div>
                     <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">Current Tier</p>
                     <h3 className="text-2xl font-bold flex items-center gap-2">
                       {formData.membership} Member
                       {formData.membership === 'Pro' && <Crown size={24} className="fill-amber-500" /> : <UserCircle size={24} />}
                     </h3>
                   </div>
                   {formData.membership === 'Free' && (
                     <button className="text-xs bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1.5 rounded-full font-bold transition-colors">
                       Upgrade to Pro
                     </button>
                   )}
                 </div>
                 
                 {formData.membership === 'Pro' ? (
                   <p className="text-xs text-slate-300 mt-3">
                     You have access to <span className="text-white font-bold">Expert Roleplays</span>, <span className="text-white font-bold">Academic Citations</span>, and <span className="text-white font-bold">Industry Reports</span>.
                   </p>
                 ) : (
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                       <p className="text-xs text-slate-300 mb-1">Complete challenges to earn free Pro time:</p>
                    </div>
                 )}
               </div>

               {formData.membership === 'Free' && (
                 <div className="space-y-1">
                   <h4 className="font-bold text-slate-800 text-sm mb-3">Road to Membership (Earn Pro)</h4>
                   <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-2">
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
                   <p className="text-[10px] text-slate-400 text-center pt-2">
                     *Pro benefits are automatically unlocked for 30 days upon completing any 3 goals.
                   </p>
                 </div>
               )}

               <div className="mt-6">
                 <h4 className="font-bold text-slate-800 text-sm mb-3">Pro-Exclusive Features</h4>
                 <div className="grid grid-cols-2 gap-3">
                   <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                      <div className="flex items-center gap-2 text-purple-700 font-bold text-xs mb-1">
                        <BrainCircuit size={14} />
                        Expert Sim
                      </div>
                      <p className="text-[10px] text-purple-900/70">Roleplay with historical figures & top industry experts.</p>
                   </div>
                   <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-2 text-blue-700 font-bold text-xs mb-1">
                        <BookOpen size={14} />
                        Academic Refs
                      </div>
                      <p className="text-[10px] text-blue-900/70">Access citations, deep papers, and official reports.</p>
                   </div>
                 </div>
               </div>
             </div>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-200 h-full flex flex-col">
              <div className="relative shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search favorites..."
                  value={favSearch}
                  onChange={(e) => setFavSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300"
                />
              </div>

              <div className="flex-1 space-y-6">
                {favorites.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center text-slate-400 text-sm">
                    <Star size={32} className="mb-2 opacity-20" />
                    <p>No favorites yet.</p>
                  </div>
                ) : Object.keys(groupedFavorites).length === 0 ? (
                   <div className="text-center text-slate-400 text-sm py-4">
                     No matches found.
                   </div>
                ) : (
                  // Fix: Explicitly type map arguments to avoid 'unknown' inference
                  Object.entries(groupedFavorites).map(([category, items]: [string, TopicData[]]) => (
                    <div key={category}>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{category}</h4>
                      <div className="space-y-2">
                        {items.map(topic => (
                          <div key={topic.id} className="bg-white border border-slate-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex justify-between items-start gap-3">
                              <h5 className="font-semibold text-slate-800 text-sm leading-tight">{topic.title}</h5>
                              <button 
                                onClick={() => onToggleFavorite(topic)}
                                className="text-slate-300 hover:text-red-400 transition-colors"
                                title="Remove favorite"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{topic.summary}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer (Only for Settings) */}
        {activeTab === 'settings' && (
          <div className="bg-slate-50 border-t border-slate-100 p-4 flex justify-end shrink-0">
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm active:scale-95 transform"
            >
              <Save size={18} />
              Save Configuration
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
