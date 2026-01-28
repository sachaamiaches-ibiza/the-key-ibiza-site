
import React, { useState, useRef, useEffect } from 'react';
import { getAIConciergeResponse } from '../services/gemini';
import { Message, Language } from '../types';
import { LogoTheKey } from './Navbar';
import { translations } from '../translations';

interface AIConciergeProps {
  lang: Language;
}

const AIConcierge: React.FC<AIConciergeProps> = ({ lang }) => {
  const t = translations[lang].concierge;
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t.welcome }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset welcome message on language change if no user chat started
    if (messages.length === 1) {
      setMessages([{ role: 'assistant', content: t.welcome }]);
    }
  }, [lang]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await getAIConciergeResponse(input, messages, lang);
    setMessages(prev => [...prev, { role: 'assistant', content: response || '...' }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 lg:bottom-12 lg:right-12 z-[100]">
      {isOpen ? (
        <div className="bg-luxury-blue/98 border border-white/10 w-85 md:w-96 lg:w-[420px] rounded-[40px] overflow-hidden shadow-2xl backdrop-blur-3xl animate-slide-up ring-1 ring-white/5">
          <div className="bg-luxury-gold/5 p-8 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center space-x-5">
              <LogoTheKey className="w-8 h-12 text-luxury-gold" />
              <div>
                <h3 className="font-serif text-xl text-luxury-gold tracking-wide leading-none">{t.title}</h3>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-1.5 font-bold">{t.subtitle}</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div ref={scrollRef} className="h-96 lg:h-[450px] overflow-y-auto p-8 space-y-6 text-sm lg:text-base font-light no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-5 lg:p-6 rounded-[24px] ${m.role === 'user' ? 'bg-luxury-gold text-luxury-blue font-bold shadow-xl' : 'bg-white/5 text-white/80 border border-white/10 leading-relaxed'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-5 rounded-2xl animate-pulse flex items-center space-x-3">
                  <div className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-white/5 border-t border-white/5 flex space-x-4">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t.placeholder}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm lg:text-base py-3 text-white placeholder-white/20"
            />
            <button 
              onClick={handleSend}
              className="bg-luxury-gold text-luxury-blue w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-white hover:scale-105 transition-all shadow-xl active:scale-95"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-luxury-blue border border-luxury-gold/40 w-24 h-32 lg:w-28 lg:h-40 rounded-[32px] flex flex-col items-center justify-center shadow-[0_0_50px_rgba(196,164,97,0.3)] hover:shadow-[0_0_80px_rgba(196,164,97,0.5)] transition-all duration-700 group relative overflow-hidden ring-1 ring-white/5"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <LogoTheKey className="w-12 h-18 lg:w-14 lg:h-22 text-luxury-gold transition-all duration-700 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(196,164,97,0.4)]" />
        </button>
      )}
    </div>
  );
};

export default AIConcierge;
