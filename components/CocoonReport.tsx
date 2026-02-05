
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { CocoonReportData, Language, UserProfile } from '../types';
import { TRANSLATIONS, getTranslation } from '../translations';
import { Target, Compass, Layers, AlertCircle, Lightbulb, Crown, TrendingUp, Lock, Globe, User, Star } from 'lucide-react';

interface CocoonReportProps {
  data: CocoonReportData;
  language?: Language;
  userProfile?: UserProfile;
  onUpgradeClick?: () => void;
}

const CocoonReport: React.FC<CocoonReportProps> = ({ data, language = 'en', userProfile, onUpgradeClick }) => {
  const t = (key: keyof typeof TRANSLATIONS['en'], params?: any) => getTranslation(language as Language, key, params);
  const isPro = userProfile?.membership === 'Pro';

  const getDiversityColor = (level: string) => {
    switch (level) {
      case 'Echo Chamber': return 'text-red-500';
      case 'Filter Bubble': return 'text-amber-500';
      case 'Explorer': return 'text-blue-500';
      case 'Bridge Builder': return 'text-emerald-500';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 pb-10">
      
      {/* Top Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
           <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">{t('balanceScore')}</span>
           <div className="text-3xl font-bold text-slate-800">{data.cocoonScore}</div>
           <div className={`text-xs font-medium mt-1 ${getDiversityColor(data.diversityLevel)}`}>
             {data.diversityLevel}
           </div>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
           <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">{t('totalReads')}</span>
           <div className="text-3xl font-bold text-slate-800">{data.totalReads}</div>
           <div className="text-xs text-slate-400 mt-1">{t('articlesAnalyzed')}</div>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm relative overflow-hidden">
        <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
          <Layers size={16} className="text-purple-500" />
          {t('interestMap')}
        </h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Interest Level"
                dataKey="score"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="#8b5cf6"
                fillOpacity={0.3}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#6d28d9', fontSize: '12px' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Blind Spots & Recommendations */}
      <div className="space-y-3">
        {data.blindSpots.length > 0 ? (
          <div className="bg-red-50 p-4 rounded-xl border border-red-100">
             <div className="flex items-start gap-3">
               <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
               <div>
                 <h4 className="font-bold text-red-900 text-sm">{t('blindSpots')}</h4>
                 <p className="text-xs text-red-700 mt-1">
                   {t('blindSpotsDesc')} <span className="font-semibold">{data.blindSpots.join(', ')}</span>.
                 </p>
               </div>
             </div>
          </div>
        ) : (
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center gap-3">
             <Target size={20} className="text-emerald-600" />
             <p className="text-sm text-emerald-800 font-medium">{t('excellentBalance')}</p>
          </div>
        )}

        {data.recommendedTopic && (
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <div className="flex items-start gap-3">
              <Compass size={20} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-blue-900 text-sm">{t('explorationSuggestion')}</h4>
                <p className="text-xs text-blue-800 mt-1 mb-2">
                  {t('tryFinding')} <strong>{data.recommendedTopic}</strong>.
                </p>
                <div className="flex items-center gap-1 text-[10px] text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded w-fit">
                   <Lightbulb size={12} />
                   <span>{t('tipReadWidely')}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* NEW SECTION: Monthly Trend Briefing (Pro) */}
      <div className="relative mt-8 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl overflow-hidden">
         {/* Header */}
         <div className="p-5 border-b border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="bg-amber-500/20 p-1.5 rounded-lg text-amber-400">
                    <TrendingUp size={18} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white leading-none">{t('trendBriefingTitle')}</h3>
                    <p className="text-[10px] text-slate-400 mt-1">{t('trendBriefingDesc')}</p>
                </div>
            </div>
            {isPro ? (
                <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-500/30 uppercase tracking-wider flex items-center gap-1">
                    <Crown size={10} className="fill-amber-400" /> Pro Active
                </span>
            ) : (
                <Lock size={16} className="text-slate-500" />
            )}
         </div>

         {/* Content Area */}
         <div className={`p-5 grid gap-6 ${!isPro ? 'filter blur-sm select-none opacity-50' : ''}`}>
             
             {/* Global Summary */}
             <p className="text-xs text-slate-300 italic font-serif leading-relaxed border-l-2 border-amber-500 pl-3">
                "{data.trendInsights.globalSummary}"
             </p>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* Left: Global Pulse */}
                 <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                     <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Globe size={12} /> {t('globalPulse')}
                     </h4>
                     <ul className="space-y-3">
                        {data.trendInsights.globalThemes.map((theme, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <span className="text-amber-500 font-bold text-xs mt-0.5">{i+1}.</span>
                                <div>
                                    <p className="text-xs font-bold text-slate-200 leading-tight line-clamp-1">{theme.title}</p>
                                    <span className="text-[9px] text-slate-500 uppercase">{theme.category}</span>
                                </div>
                            </li>
                        ))}
                     </ul>
                 </div>

                 {/* Right: User Echo - Now shows specific topics */}
                 <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                     <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <User size={12} /> {t('yourEcho')}
                     </h4>
                     <div className="space-y-3">
                        <p className="text-xs text-slate-300 leading-relaxed">
                            {data.trendInsights.userFocusSummary}
                        </p>
                        
                        {/* List of specific topics user focused on */}
                        <div className="space-y-2">
                            {data.trendInsights.userTopTopics.length > 0 ? (
                                data.trendInsights.userTopTopics.map((topic, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-slate-700/50 p-1.5 rounded-lg border border-slate-600/50">
                                        <div className="bg-purple-500/20 p-1 rounded">
                                           <Star size={10} className="text-purple-400 fill-purple-400/20" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold text-slate-200 truncate">{topic.title}</p>
                                            <p className="text-[9px] text-slate-500">{topic.category}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[10px] text-slate-500 italic">No activity recorded yet.</p>
                            )}
                        </div>
                     </div>
                 </div>
             </div>
         </div>

         {/* Overlay for Free Users */}
         {!isPro && (
             <div className="absolute inset-0 top-[60px] z-10 flex items-center justify-center p-4">
                 <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-6 rounded-2xl text-center max-w-xs shadow-2xl">
                     <Crown size={32} className="text-amber-500 mx-auto mb-3 fill-amber-500" />
                     <h4 className="text-white font-bold text-sm mb-2">{t('unlockTrends')}</h4>
                     <p className="text-slate-400 text-xs mb-4 leading-relaxed">
                         {t('unlockTrendsDesc')}
                     </p>
                     <button 
                       onClick={onUpgradeClick}
                       className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-6 py-2 rounded-full text-xs font-bold transition-transform active:scale-95 shadow-lg shadow-amber-900/20 w-full"
                     >
                        Upgrade to Pro
                     </button>
                 </div>
             </div>
         )}
      </div>

    </div>
  );
};

export default CocoonReport;
