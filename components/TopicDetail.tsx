
import React, { useState } from 'react';
import { TopicData, Language, UserProfile } from '../types';
import { TRANSLATIONS, getTranslation } from '../translations';
import { Clock, BarChart2, BookOpen, AlertCircle, CheckCircle2, Star, Loader2, TrendingUp, HelpCircle, GraduationCap, Newspaper, Zap, ExternalLink, Library, History, FileText, Layers, Globe, Crown, Lock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SituationMap from './SituationMap';
import RolePlayGame from './RolePlayGame';

interface TopicDetailProps {
  topic: TopicData;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  language: Language;
  userProfile?: UserProfile;
  onUpgradeClick?: () => void;
}

const TopicDetail: React.FC<TopicDetailProps> = ({ topic, onBack, isFavorite, onToggleFavorite, language, userProfile, onUpgradeClick }) => {
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);
  const t = (key: keyof typeof TRANSLATIONS['en'], params?: any) => getTranslation(language, key, params);

  // Helper to show loading state
  const LoadingPlaceholder = ({ text, subtext }: { text: string, subtext: string }) => (
    <div className="flex flex-col items-center justify-center py-24 text-slate-400 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
      <Loader2 size={32} className="animate-spin mb-4 text-blue-400" />
      <p className="font-medium animate-pulse text-slate-600">{text}</p>
      <p className="text-xs mt-2 text-slate-400">{subtext}</p>
    </div>
  );

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'bg-rose-500 text-white shadow-rose-200 shadow-sm';
      case 'High': return 'bg-orange-500 text-white shadow-orange-200 shadow-sm';
      case 'Medium': return 'bg-amber-400 text-slate-900 shadow-amber-200 shadow-sm';
      default: return 'bg-emerald-500 text-white shadow-emerald-200 shadow-sm';
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
        case 'Critical': return t('riskCritical');
        case 'High': return t('riskHigh');
        case 'Medium': return t('riskMedium');
        case 'Low': return t('riskLow');
        default: return level;
    }
  }

  // Consistent Header Style
  const cardHeaderStyle = "text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2 mb-3";
  const cardContainerStyle = "bg-white rounded-2xl border border-slate-200 p-5 shadow-sm";

  // Helpers for Pro Feature
  const academicExt = topic.extensions?.find(e => e.type === 'Academic');
  const reportExt = topic.extensions?.find(e => e.type === 'Report');
  const caseExt = topic.extensions?.find(e => e.type === 'Case');
  const historyExt = topic.historicalParallels?.[0];

  const hasExpansionData = academicExt || reportExt || caseExt || historyExt;
  const isPro = userProfile?.membership === 'Pro';

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in zoom-in-95 duration-300">
      
      <div className="mb-8 px-2 mt-6">
        <div className="flex flex-wrap items-center gap-3 mb-3">
           {topic.category && (
            <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              {topic.category}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Clock size={12} />
            {t('updated')}: {topic.lastUpdated}
          </span>
           {topic.isAiGenerated && (
             <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100 text-[10px] font-bold shadow-sm">
             {t('aiGenerated')}
           </span>
          )}
        </div>
        
        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight tracking-tight">{topic.title}</h1>
        
        <div className="flex items-center gap-3">
           <span className="bg-white px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 border border-slate-200 shadow-sm flex items-center gap-2">
            <Newspaper size={14} className="text-slate-400" />
            {topic.sourceCount} {t('sources')}
          </span>
          
          <button
            onClick={onToggleFavorite}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all shadow-sm text-xs font-semibold ${
              isFavorite 
                ? 'bg-amber-50 border-amber-200 text-amber-600' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Star size={14} className={isFavorite ? 'fill-amber-500 text-amber-500' : ''} />
            <span>{isFavorite ? t('saved') : t('saveTopic')}</span>
          </button>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="sticky top-[64px] z-30 bg-[#f8fafc]/90 backdrop-blur-md border-b border-slate-200 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 transition-all">
        <div className="flex gap-1 sm:gap-6 overflow-x-auto no-scrollbar">
          {/* Tab 0: The Map */}
          <button
            onClick={() => setActiveTab(0)}
            className={`relative py-3 px-4 text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 0 
                ? 'text-blue-600' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 rounded-t-lg'
            }`}
          >
            <BarChart2 size={16} />
            {t('tabViewpoint')}
            {activeTab === 0 && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
          </button>
          
          {/* Tab 1: Facts */}
          <button
            onClick={() => setActiveTab(1)}
            className={`relative py-3 px-4 text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 1 
                ? 'text-blue-600' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 rounded-t-lg'
            }`}
          >
             <AlertCircle size={16} />
            {t('tabSummary')}
            {activeTab === 1 && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
          </button>
          
          {/* Tab 2: Expand */}
          <button
            onClick={() => setActiveTab(2)}
            className={`relative py-3 px-4 text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 2 
                ? 'text-blue-600' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 rounded-t-lg'
            }`}
          >
            <BookOpen size={16} />
            {t('tabExtended')}
            {activeTab === 2 && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {/* Active Tab 0: The Map (Was formerly Tab 1) */}
        {activeTab === 0 && (
          <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-2 fade-in duration-300 pb-10">
            {(!topic.stakeholders || !topic.divergenceRating) ? (
              <LoadingPlaceholder text={t('loadingMapping')} subtext={t('loadingReading')} />
            ) : (
              <>
                {/* TOP ROW: Compact Indicators (Grid of 3) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                    
                    {/* 1. Core Conflict */}
                    <div className={`${cardContainerStyle} flex flex-col relative overflow-hidden group hover:border-rose-200 transition-colors`}>
                        <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                        <h3 className={cardHeaderStyle}>
                           <AlertCircle size={16} className="text-rose-500" /> 
                           {t('coreConflict')}
                        </h3>
                        <p className="text-slate-800 text-sm leading-snug font-serif font-medium flex-1 flex items-center">
                            "{topic.perspectiveSummary}"
                        </p>
                    </div>

                    {/* 2. Trend Analysis */}
                    <div className={`${cardContainerStyle} flex flex-col`}>
                        <h3 className={cardHeaderStyle}>
                            <TrendingUp size={16} className="text-blue-500" />
                            {t('opinionTrend')}
                        </h3>
                        {topic.trendAnalysis && (
                          <div className="flex-1 w-full min-h-[60px]">
                              <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={topic.trendAnalysis}>
                                  <Line type="monotone" dataKey="sentiment" stroke="#3b82f6" strokeWidth={2} dot={{r: 2}} />
                              </LineChart>
                              </ResponsiveContainer>
                          </div>
                        )}
                         <div className="flex justify-between items-end mt-1">
                            <span className="text-[10px] text-slate-400">30 Days</span>
                            <span className="text-xs font-bold text-blue-600">
                               {topic.trendAnalysis?.[topic.trendAnalysis.length-1].sentiment}% Positive
                            </span>
                         </div>
                    </div>

                    {/* 3. Missing Intel */}
                    <div className={`${cardContainerStyle} flex flex-col`}>
                        <h3 className={cardHeaderStyle}>
                             <HelpCircle size={16} className="text-amber-500" />
                             {t('missingKeyInfo')}
                        </h3>
                        <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-1 max-h-[100px] md:max-h-none">
                            {topic.missingIntel?.map((item, i) => (
                                <div key={i} className="flex flex-col gap-0.5 border-b border-slate-100 last:border-0 pb-2 last:pb-0">
                                    <p className="font-bold text-slate-800 text-xs leading-tight">{item.question}</p>
                                    <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase">
                                        <span>Source:</span>
                                        <span className="text-amber-600 bg-amber-50 px-1 rounded">{item.trustedSource}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* BOTTOM ROW: Map & Sim (Grid of 12) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[500px]">
                    
                    {/* Situation Map (8 Cols) */}
                    <div className="lg:col-span-8 h-[500px] lg:h-full">
                        <SituationMap stakeholders={topic.stakeholders} language={language} />
                    </div>

                    {/* Role Play (4 Cols) */}
                    <div className="lg:col-span-4 h-auto lg:h-full">
                         {/* Pass full topic to allow chat context */}
                         <RolePlayGame 
                           data={topic.rolePlay} 
                           topic={topic} 
                           language={language} 
                           userProfile={userProfile}
                           onUpgradeClick={onUpgradeClick}
                         />
                    </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Active Tab 1: Facts (Was formerly Tab 0) */}
        {activeTab === 1 && (
          <div className="grid md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
            
            {/* Left Column: Narrative (2/3 width) */}
            <div className="md:col-span-2 space-y-6">
              
              {/* News Summary Card */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                 <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                    <div className="bg-slate-50 p-2 rounded-lg text-slate-500">
                      <Newspaper size={18} />
                    </div>
                    <div>
                      <h3 className="text-slate-900 font-bold text-lg leading-none">The Briefing</h3>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">AI-Synthesized</p>
                    </div>
                 </div>
                 
                 <div className="prose prose-slate max-w-none text-base md:text-lg text-slate-800 leading-relaxed font-serif">
                   <p className="whitespace-pre-line first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:mr-2 first-letter:float-left first-letter:text-slate-900 first-letter:leading-none">
                     {topic.newsNarrative || topic.summary}
                   </p>
                 </div>
              </div>
            </div>

            {/* Right Column: Facts & Risk (1/3 width) */}
            <div className="md:col-span-1 space-y-4">
              
               {/* Controversy Prediction */}
               {topic.controversyPrediction && (
                 <div className={cardContainerStyle}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2 mb-0">
                        <TrendingUp size={16} />
                        Risk Monitor
                      </h4>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${getRiskColor(topic.controversyPrediction.riskLevel)}`}>
                        {getRiskLabel(topic.controversyPrediction.riskLevel)}
                      </span>
                    </div>
                    
                    <div className="relative mb-3">
                       <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                         <div 
                           className={`h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full transition-all duration-1000 ease-out`} 
                           style={{ width: `${topic.controversyPrediction.score}%` }} 
                         />
                       </div>
                       <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-mono uppercase tracking-wider font-semibold">
                         <span>{t('stable')}</span>
                         <span>{t('volatile')}</span>
                       </div>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded border border-slate-100">
                      {topic.controversyPrediction.reasoning}
                    </p>
                 </div>
              )}

              {/* Facts List */}
              <div className={cardContainerStyle}>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2 mb-3">
                  <CheckCircle2 size={16} />
                  {t('objectiveFacts')}
                </h3>
                
                <div className="space-y-2">
                  {topic.facts.map((fact, i) => (
                    <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-100 hover:border-emerald-200 transition-colors">
                      <div className="flex justify-between items-start gap-2 mb-1">
                         <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide border ${
                            fact.confidence === 'High' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            {fact.confidence}
                        </span>
                      </div>
                      <p className="text-slate-800 text-sm font-medium leading-relaxed">{fact.content}</p>
                    </div>
                  ))}
                </div>
              </div>

               {/* Key Insight */}
               <div className={cardContainerStyle}>
                 <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2 mb-3">
                    <Zap size={16} />
                    The Bottom Line
                 </h3>
                 <p className="text-slate-800 text-base font-medium leading-relaxed italic border-l-2 border-blue-400 pl-3">
                   "{topic.whyMatters}"
                 </p>
               </div>

            </div>
          </div>
        )}

        {activeTab === 2 && (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 fade-in duration-300 pb-10">
             
             {(!topic.terms || !topic.extensions) ? (
                <LoadingPlaceholder text={t('loadingContext')} subtext={t('loadingReading')} />
             ) : (
                <>
                    {/* ROW 1: Contextual Foundation - Key Terms Only */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h3 className={cardHeaderStyle}>
                            <BookOpen size={16} /> {t('keyTerms')}
                        </h3>
                        {/* Streamlined Layout: Concise list instead of cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {topic.terms?.map((term, i) => (
                                    <div key={i} className="group">
                                    <dt className="font-bold text-slate-900 text-sm mb-1.5 font-serif group-hover:text-blue-700 transition-colors flex items-center gap-2">
                                        <span className="w-1 h-4 bg-blue-200 rounded-full group-hover:bg-blue-500 transition-colors"></span>
                                        {term.term}
                                    </dt>
                                    <dd className="text-sm text-slate-600 leading-relaxed pl-3 border-l border-slate-100 group-hover:border-blue-50 transition-colors">
                                        {term.definition}
                                    </dd>
                                    </div>
                            ))}
                        </div>
                    </div>

                    {/* ROW 2: Disciplinary Lens (Updated to match Key Terms layout) */}
                    {topic.disciplinaryPerspectives && (
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                           <h3 className={cardHeaderStyle}>
                            <GraduationCap size={16} className="text-purple-600" />
                            {t('multiDisciplinary')}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {topic.disciplinaryPerspectives.map((dp, i) => (
                              <div key={i} className="group">
                                <h4 className="font-bold text-slate-900 text-sm mb-1.5 font-serif group-hover:text-purple-700 transition-colors flex items-center gap-2">
                                    <span className="w-1 h-4 bg-purple-200 rounded-full group-hover:bg-purple-500 transition-colors"></span>
                                    {dp.discipline}
                                </h4>
                                <p className="text-sm text-slate-600 leading-relaxed pl-3 border-l border-slate-100 group-hover:border-purple-50 transition-colors whitespace-pre-line">
                                    "{dp.insight}"
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                     )}

                    {/* ROW 3: Knowledge Expansion (Member Feature) */}
                    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl">
                        
                        {/* Header */}
                        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                                    <Crown size={16} className="fill-amber-400" />
                                    {t('knowledgeExpansion')}
                                </h3>
                                <p className="text-xs text-slate-400">{t('knowledgeExpansionDesc')}</p>
                            </div>
                            
                            {/* Pro Status Indicator */}
                            {isPro ? (
                                <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5">
                                    <CheckCircle2 size={12} />
                                    Pro Unlocked
                                </div>
                            ) : (
                                <button onClick={onUpgradeClick} className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-amber-900/20">
                                    <Lock size={12} />
                                    {t('unlockPro')}
                                </button>
                            )}
                        </div>

                        {/* Content Grid */}
                        <div className={`grid md:grid-cols-2 gap-px bg-slate-700/50 ${!isPro ? 'opacity-40 blur-sm pointer-events-none select-none' : ''}`}>
                            
                            {/* 1. Academic Citations */}
                            <div className="bg-slate-900/90 p-6 hover:bg-slate-800/80 transition-colors">
                                <div className="flex items-center gap-2 mb-3 text-blue-300">
                                    <BookOpen size={18} />
                                    <span className="text-xs font-bold uppercase tracking-wider">{t('catAcademic') || "Professional Citations"}</span>
                                </div>
                                <h4 className="font-serif text-lg font-medium leading-tight mb-2 text-slate-200">
                                    {academicExt?.title || "No citation available."}
                                </h4>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {academicExt?.description}
                                </p>
                            </div>

                            {/* 2. Industry Reports */}
                            <div className="bg-slate-900/90 p-6 hover:bg-slate-800/80 transition-colors">
                                <div className="flex items-center gap-2 mb-3 text-emerald-300">
                                    <FileText size={18} />
                                    <span className="text-xs font-bold uppercase tracking-wider">{t('catReport') || "Industry Reports"}</span>
                                </div>
                                <h4 className="font-serif text-lg font-medium leading-tight mb-2 text-slate-200">
                                    {reportExt?.title || "No report available."}
                                </h4>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {reportExt?.description}
                                </p>
                            </div>

                            {/* 3. International Cases */}
                            <div className="bg-slate-900/90 p-6 hover:bg-slate-800/80 transition-colors">
                                <div className="flex items-center gap-2 mb-3 text-purple-300">
                                    <Globe size={18} />
                                    <span className="text-xs font-bold uppercase tracking-wider">{t('catCase') || "International Cases"}</span>
                                </div>
                                <h4 className="font-serif text-lg font-medium leading-tight mb-2 text-slate-200">
                                    {caseExt?.title || "No case available."}
                                </h4>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {caseExt?.description}
                                </p>
                            </div>

                            {/* 4. Historical Parallels */}
                            <div className="bg-slate-900/90 p-6 hover:bg-slate-800/80 transition-colors">
                                <div className="flex items-center gap-2 mb-3 text-amber-300">
                                    <History size={18} />
                                    <span className="text-xs font-bold uppercase tracking-wider">{t('extHistory') || "Historical Parallels"}</span>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono">{historyExt?.year}</span>
                                    <h4 className="font-serif text-lg font-medium leading-tight text-slate-200">
                                        {historyExt?.event || "No history available."}
                                    </h4>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed mb-3">
                                    {historyExt?.similarity}
                                </p>
                                <div className="pt-3 border-t border-slate-700/50">
                                    <p className="text-xs text-amber-500/80 italic">
                                        Lesson: {historyExt?.lesson}
                                    </p>
                                </div>
                            </div>

                        </div>
                        
                        {/* Overlay for Non-Pro Members */}
                        {!isPro && (
                            <div className="absolute inset-0 top-[80px] flex items-center justify-center z-10">
                                <div className="bg-slate-900/90 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 text-center max-w-sm shadow-2xl">
                                    <Crown size={32} className="fill-amber-500 mx-auto mb-3" />
                                    <h4 className="text-white font-bold text-lg mb-2">Member Exclusive</h4>
                                    <p className="text-slate-400 text-sm mb-4">
                                        Upgrade to unlock full academic citations, industry reports, and deep historical context.
                                    </p>
                                    <button 
                                        onClick={onUpgradeClick}
                                        className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-6 py-2.5 rounded-full font-bold transition-transform active:scale-95 shadow-lg shadow-amber-900/20 w-full"
                                    >
                                        Unlock Now
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicDetail;
