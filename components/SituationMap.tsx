import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Stakeholder, Language } from '../types';
import { TRANSLATIONS, getTranslation } from '../translations';
import { User, Shield, Zap, EyeOff, Scale } from 'lucide-react';

interface SituationMapProps {
  stakeholders: Stakeholder[];
  language?: Language;
}

const SituationMap: React.FC<SituationMapProps> = ({ stakeholders, language = 'en' }) => {
  const [activeStakeholder, setActiveStakeholder] = useState<Stakeholder | null>(null);
  // Fix: Cast language to Language type to satisfy getTranslation
  const t = (key: keyof typeof TRANSLATIONS['en'], params?: any) => getTranslation(language as Language, key, params);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-slate-200 shadow-md rounded text-xs text-slate-600">
          <p className="font-semibold">{payload[0].payload.name}</p>
          <p>{t('clickDot')}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      {/* Chart Section - Takes more space (3/5) */}
      <div className="md:flex-[3] h-full relative bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 absolute top-4 left-4 z-10">
          {t('situationMapTitle')}
        </h3>
        
        {/* Axis Labels Overlay */}
        <div className="absolute bottom-3 right-4 text-[9px] text-slate-300 font-bold uppercase tracking-wider">{t('interestRelevance')} →</div>
        <div className="absolute top-10 left-4 text-[9px] text-slate-300 font-bold uppercase tracking-wider rotate-0">↑ {t('powerResources')}</div>

        <div className="flex-1 w-full h-full min-h-[200px] [&_.recharts-wrapper]:outline-none">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 40, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis type="number" dataKey="x" domain={[0, 100]} tick={false} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis type="number" dataKey="y" domain={[0, 100]} tick={false} axisLine={{ stroke: '#e2e8f0' }} />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              <Scatter 
                name="Stakeholders" 
                data={stakeholders} 
                onClick={(node) => setActiveStakeholder(node.payload)}
                className="cursor-pointer transition-all duration-300"
              >
                {stakeholders.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={activeStakeholder?.id === entry.id ? '#0f172a' : '#94a3b8'} 
                    stroke={activeStakeholder?.id === entry.id ? '#3b82f6' : 'white'}
                    strokeWidth={activeStakeholder?.id === entry.id ? 2 : 2}
                    r={activeStakeholder?.id === entry.id ? 8 : 6}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        {!activeStakeholder && (
            <div className="absolute bottom-4 left-4 text-[9px] text-slate-400 max-w-[150px]">
                {t('clickDot')}
            </div>
        )}
      </div>

      {/* Stakeholder Profile Panel - Takes less space (2/5) */}
      <div className="md:flex-[2] h-full bg-white rounded-xl border border-slate-200 p-4 shadow-sm overflow-hidden flex flex-col relative">
        {activeStakeholder ? (
          <div className="animate-in fade-in slide-in-from-right-2 duration-300 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-50 pb-3 shrink-0">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <User size={18} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm leading-tight line-clamp-1">{activeStakeholder.name}</h4>
                <div className="flex gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                   <span>I: {activeStakeholder.x}</span>
                   <span>P: {activeStakeholder.y}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-1">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1.5 text-amber-600 mb-1 font-bold text-[10px] uppercase tracking-wide">
                  <Zap size={12} />
                  <span>{t('mainFears')}</span>
                </div>
                <p className="text-slate-700 text-xs leading-relaxed">{activeStakeholder.fears}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1.5 text-emerald-600 mb-1 font-bold text-[10px] uppercase tracking-wide">
                  <Shield size={12} />
                  <span>{t('coreValues')}</span>
                </div>
                <p className="text-slate-700 text-xs leading-relaxed">{activeStakeholder.values}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1.5 text-purple-600 mb-1 font-bold text-[10px] uppercase tracking-wide">
                  <EyeOff size={12} />
                  <span>{t('blindSpotsLabel')}</span>
                </div>
                <p className="text-slate-700 text-xs leading-relaxed">{activeStakeholder.blindSpots}</p>
              </div>

               <div className="bg-slate-900 text-white p-3 rounded-lg shadow-sm mt-1">
                <div className="flex items-center gap-1.5 text-blue-300 mb-1 font-bold text-[10px] uppercase tracking-wide">
                  <Scale size={12} />
                  <span>{t('internalLogic')}</span>
                </div>
                <p className="text-slate-300 text-xs italic font-serif leading-relaxed">"{activeStakeholder.rationality}"</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 text-center p-4">
            <User size={48} className="mb-2 opacity-20" />
            <p className="font-bold text-sm text-slate-400">{t('selectStakeholder')}</p>
            <p className="text-[10px] mt-1 opacity-70">{t('understandWhy')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SituationMap;