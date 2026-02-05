import React, { useState, useRef, useEffect } from 'react';
import { RolePlayData, Language, ChatMessage, TopicData, UserProfile } from '../types';
import { TRANSLATIONS, getTranslation } from '../translations';
import { User, CheckCircle, RefreshCcw, ArrowRight, Send, Loader2, Crown, MessageSquare } from 'lucide-react';
import { chatWithExpert } from '../services/geminiService';

interface RolePlayGameProps {
  data: RolePlayData | undefined;
  topic?: TopicData;
  language?: Language;
  userProfile?: UserProfile;
  onUpgradeClick?: () => void;
}

const RolePlayGame: React.FC<RolePlayGameProps> = ({ data, topic, language = 'en', userProfile, onUpgradeClick }) => {
  // Fix: Cast language to Language type to satisfy getTranslation
  const t = (key: keyof typeof TRANSLATIONS['en'], params?: any) => getTranslation(language as Language, key, params);

  // --- Common State ---
  const [forceChatMode, setForceChatMode] = useState(false);
  
  // Determine if we are in Dilemma or Chat mode
  // If data is missing mode but has rounds -> dilemma
  // If user forces chat (Pro feature on Dilemma topic) -> chat
  const mode = forceChatMode 
    ? 'chat' 
    : (data?.mode || (data?.rounds ? 'dilemma' : 'chat'));

  const isPro = userProfile?.membership === 'Pro';

  // --- Dilemma (Free) Mode State ---
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // --- Chat (Pro) Mode State ---
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat logic
  useEffect(() => {
    if (mode === 'chat' && messages.length === 0) {
      // If we have an initial message from data, use it
      if (data?.initialMessage) {
        setMessages([{ role: 'model', text: data.initialMessage }]);
      } 
      // If we switched from Dilemma to Chat, generate a greeting based on context
      else if (data?.roleName) {
        setMessages([{ 
          role: 'model', 
          text: `Hello. I am the ${data.roleName}. We can discuss the situation in depth. What is on your mind?` 
        }]);
      }
    }
  }, [mode, data, messages.length]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (mode === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, mode]);

  // Safety check
  if (!data) {
    return (
        <div className="h-full bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
            <User size={32} className="mb-2 opacity-20" />
            <p className="text-sm font-medium">{t('simUnavailable')}</p>
        </div>
    );
  }

  // ==========================================
  // Mode 1: Dilemma Game (Free/Default)
  // ==========================================
  if (mode === 'dilemma') {
    
    // Safety check for rounds
    if (!data.rounds || data.rounds.length === 0) {
        return (
            <div className="h-full bg-slate-50 rounded-xl border border-slate-200 p-4 text-center text-slate-400 text-xs">
                Incomplete simulation data.
            </div>
        );
    }

    const currentRound = data.rounds[currentRoundIndex];

    const handleOptionSelect = (index: number) => {
      if (showFeedback) return;
      setSelectedOption(index);
      setShowFeedback(true);
    };

    const handleNext = () => {
      if (currentRoundIndex < (data.rounds?.length || 0) - 1) {
        setCurrentRoundIndex(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        setIsComplete(true);
      }
    };

    const handleReset = () => {
      setCurrentRoundIndex(0);
      setSelectedOption(null);
      setShowFeedback(false);
      setIsComplete(false);
    };

    if (isComplete) {
      return (
        <div className="h-full bg-slate-900 text-white rounded-xl p-8 text-center animate-in zoom-in-95 duration-300 flex flex-col items-center justify-center shadow-sm border border-slate-700 relative overflow-hidden">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-4 text-slate-900 relative z-10">
            <CheckCircle size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2 relative z-10">{t('simulationComplete')}</h3>
          <p className="text-slate-300 mb-6 text-sm leading-relaxed relative z-10">
            {t('simulationCompleteDesc', { role: data.roleName })}
          </p>
          
          <div className="flex flex-col gap-3 w-full max-w-xs relative z-10">
              <button 
                onClick={handleReset}
                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2.5 rounded-full font-medium transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <RefreshCcw size={16} />
                {t('playAgain')}
              </button>
              
              {isPro && (
                  <button 
                    onClick={() => setForceChatMode(true)}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
                  >
                    <MessageSquare size={16} />
                    Debate this Character
                  </button>
              )}
          </div>

          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl overflow-hidden shadow-sm border border-slate-700 relative">
        {/* Header - Compact */}
        <div className="bg-slate-950/50 px-4 py-3 border-b border-slate-700 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg">
              <User size={16} />
            </div>
            <div>
               <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{t('empathySimulator')}</div>
               <div className="font-bold text-sm line-clamp-1">{data.roleName}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
             {isPro && (
                 <button 
                   onClick={() => setForceChatMode(true)}
                   className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md transition-all active:scale-95"
                 >
                    <MessageSquare size={12} className="fill-white/20" />
                    Debate Character
                 </button>
             )}
             <div className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                {currentRoundIndex + 1} / {data.rounds.length}
             </div>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
          <p className="text-slate-400 text-xs mb-3 italic border-l-2 border-slate-600 pl-2 shrink-0">
            {data.context}
          </p>

          <h4 className="text-base font-semibold mb-4 leading-relaxed shrink-0">
            {currentRound.situation}
          </h4>

          <div className="space-y-2 flex-1">
            {currentRound.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isOther = selectedOption !== null && !isSelected;

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={showFeedback}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 relative group
                    ${isSelected 
                      ? 'bg-blue-600/20 border-blue-500 text-white' 
                      : isOther 
                        ? 'opacity-50 border-slate-700' 
                        : 'bg-slate-800 border-slate-700 hover:bg-slate-750 hover:border-slate-500'
                    }
                  `}
                >
                  <span className="relative z-10 text-sm leading-snug block">{option.text}</span>
                  {isSelected && showFeedback && (
                    <div className="mt-2 pt-2 border-t border-blue-500/30 text-blue-200 text-xs animate-in fade-in slide-in-from-top-1">
                      <span className="font-bold uppercase text-[10px] tracking-wider block mb-0.5 text-blue-400">{t('consequence')}:</span>
                      {option.consequence}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div className="mt-4 flex justify-end animate-in fade-in shrink-0">
              <button 
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors text-sm"
              >
                {t('nextRound')}
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
        
        {/* Upgrade Hint for Free Users */}
        {!isPro && (
           <div className="bg-slate-950 px-4 py-2 text-[10px] text-slate-500 text-center border-t border-slate-800">
             Want to debate this character? 
             <button 
               onClick={onUpgradeClick}
               className="text-amber-500 font-bold hover:underline hover:text-amber-400 ml-1 transition-colors"
             >
               Upgrade to Pro
             </button> 
             to unlock chat.
           </div>
        )}
      </div>
    );
  }

  // ==========================================
  // Mode 2: Chat with Expert (Pro)
  // ==========================================
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isChatLoading) return;

    const newMsg: ChatMessage = { role: 'user', text: inputText };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setIsChatLoading(true);

    try {
      const responseText = await chatWithExpert(
        newMsg.text, 
        messages, 
        data.roleName, 
        topic?.title || "Current Topic",
        { language } as any
      );
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Connection interrupted. Please try again." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 relative animate-in fade-in duration-300">
      {/* Pro Badge Background */}
      <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
        <Crown size={120} />
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 border-b border-indigo-700 flex items-center justify-between shrink-0 text-white">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
            <User size={16} className="text-white" />
          </div>
          <div>
             <div className="text-[10px] text-indigo-100 uppercase tracking-wider font-bold flex items-center gap-1">
               {t('expertSim')} 
               <span className="bg-amber-400 text-amber-900 text-[9px] px-1 rounded font-bold">PRO</span>
             </div>
             <div className="font-bold text-sm line-clamp-1">{data.roleName}</div>
          </div>
        </div>
        
        {/* Back to Dilemma Mode Button (only if pure dilemma data exists) */}
        {data.rounds && (
            <button 
                onClick={() => setForceChatMode(false)} 
                className="text-xs text-indigo-200 hover:text-white underline"
            >
                Back to Scenario
            </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-slate-50">
        {data.context && (
           <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg text-xs text-indigo-800 italic mb-4">
             {data.context}
           </div>
        )}

        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  isUser 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        
        {isChatLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-indigo-500" />
              <span className="text-xs text-slate-400">Typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 shrink-0 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Ask ${data.roleName}...`}
          className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-full px-4 py-2 text-sm outline-none transition-all text-slate-800"
        />
        <button 
          type="submit" 
          disabled={!inputText.trim() || isChatLoading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-full transition-colors flex items-center justify-center aspect-square"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default RolePlayGame;