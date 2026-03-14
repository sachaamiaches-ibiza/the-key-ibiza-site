
import React, { useState, useRef, useEffect } from 'react';
import { Message, Language } from '../types';
import { LogoTheKey } from './Navbar';
import { translations } from '../translations';
import { getAIConciergeResponse, getAISuggestion } from '../services/gemini';

interface AIConciergeProps {
  lang: Language;
}

type RequestType = 'villa' | 'boat' | 'service' | 'property' | null;
type Mode = 'options' | 'guided' | 'ai-chat' | 'contact' | 'complete';

interface CollectedData {
  requestType: RequestType;
  dates?: string;
  guests?: string;
  budget?: string;
  specific?: string;
  boatDate?: string;
  boatGuests?: string;
  boatBudget?: string;
  serviceDate?: string;
  serviceGuests?: string;
  serviceType?: string;
  serviceDescription?: string;
  propertyType?: string;
  propertyArea?: string;
  propertyBudget?: string;
  propertyUse?: string;
  propertySpecific?: string;
  fullName?: string;
  phone?: string;
  email?: string;
}

const VILLA_STEPS = [
  { key: 'dates', question: 'Which dates are you considering for your stay in Ibiza?' },
  { key: 'guests', question: 'How many guests, or how many bedrooms would you prefer?' },
  { key: 'budget', question: 'Do you have a budget range in mind?' },
  { key: 'specific', question: 'Any special wishes for your stay? (sea view, pool, location...)' },
];

const BOAT_STEPS = [
  { key: 'boatDate', question: 'Which date are you thinking for your charter?' },
  { key: 'boatGuests', question: 'How many guests will be joining you?' },
  { key: 'boatBudget', question: 'Do you have a budget range in mind?' },
];

const SERVICE_STEPS = [
  { key: 'serviceDate', question: 'Which date do you have in mind?' },
  { key: 'serviceGuests', question: 'Approximately how many guests?' },
  { key: 'serviceType', question: 'What type of service or event?' },
  { key: 'serviceDescription', question: 'Could you share more details about what you envision?' },
];

const PROPERTY_STEPS = [
  { key: 'propertyType', question: 'Villa, apartment, or land?' },
  { key: 'propertyArea', question: 'Which area of Ibiza interests you?' },
  { key: 'propertyBudget', question: 'What is your budget range?' },
  { key: 'propertyUse', question: 'For personal use or investment?' },
  { key: 'propertySpecific', question: 'Anything specific you are looking for?' },
];

const CONTACT_STEPS = [
  { key: 'fullName', question: 'May I have your full name?' },
  { key: 'phone', question: 'And the best phone number to reach you?' },
  { key: 'email', question: 'Finally, your email address?' },
];

const AIConcierge: React.FC<AIConciergeProps> = ({ lang }) => {
  const t = translations[lang].concierge;
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Welcome to The Key Ibiza. How may I assist you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Flow state
  const [mode, setMode] = useState<Mode>('options');
  const [requestType, setRequestType] = useState<RequestType>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [collectedData, setCollectedData] = useState<CollectedData>({ requestType: null });
  const [aiSuggestionShown, setAiSuggestionShown] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const resetFlow = () => {
    setMode('options');
    setRequestType(null);
    setCurrentStep(0);
    setCollectedData({ requestType: null });
    setAiSuggestionShown(false);
    setMessages([{ role: 'assistant', content: 'Welcome to The Key Ibiza. How may I assist you today?' }]);
  };

  const getSteps = () => {
    switch (requestType) {
      case 'villa': return VILLA_STEPS;
      case 'boat': return BOAT_STEPS;
      case 'service': return SERVICE_STEPS;
      case 'property': return PROPERTY_STEPS;
      default: return [];
    }
  };

  const sendEmail = async (data: CollectedData) => {
    const typeLabel = data.requestType === 'villa' ? 'Villa rental'
      : data.requestType === 'boat' ? 'Boat charter'
      : data.requestType === 'service' ? 'Service / Event'
      : 'Property purchase';

    let messageContent = `Request Type: ${typeLabel}\n\n`;

    Object.entries(data).forEach(([key, value]) => {
      if (value && key !== 'requestType') {
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        messageContent += `${label}: ${value}\n`;
      }
    });

    const formData = new FormData();
    formData.append('name', data.fullName || '');
    formData.append('email', data.email || '');
    formData.append('phone', data.phone || '');
    formData.append('_subject', `AI Concierge Request – ${typeLabel}`);
    formData.append('message', messageContent);
    formData.append('_captcha', 'false');
    formData.append('_template', 'table');

    try {
      await fetch('https://formsubmit.co/ajax/hello@thekey-ibiza.com', {
        method: 'POST',
        body: formData,
      });
    } catch {
      const subject = encodeURIComponent(`AI Concierge Request – ${typeLabel}`);
      const body = encodeURIComponent(messageContent);
      window.open(`mailto:hello@thekey-ibiza.com?subject=${subject}&body=${body}`, '_blank');
    }
  };

  const handleOptionSelect = (option: RequestType) => {
    if (!option) return;

    setRequestType(option);
    setCollectedData({ ...collectedData, requestType: option });
    setMode('guided');
    setCurrentStep(0);

    const userLabel = option === 'villa' ? 'Villa rental'
      : option === 'boat' ? 'Boat charter'
      : option === 'service' ? 'Service / Event'
      : 'Property purchase';

    setMessages(prev => [...prev, { role: 'user', content: userLabel }]);

    const steps = option === 'villa' ? VILLA_STEPS
      : option === 'boat' ? BOAT_STEPS
      : option === 'service' ? SERVICE_STEPS
      : PROPERTY_STEPS;

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: steps[0].question }]);
    }, 400);
  };

  const handleAskAI = () => {
    setMode('ai-chat');
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: 'Feel free to ask me anything about Ibiza, our villas, yachts, or services. I\'m here to help!'
    }]);
  };

  const fetchAISuggestion = async () => {
    if (!requestType || aiSuggestionShown) return;

    setIsLoading(true);
    setAiSuggestionShown(true);

    try {
      const suggestion = await getAISuggestion(requestType, collectedData as Record<string, string>, lang);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `✨ Based on your preferences:\n\n${suggestion}\n\nWould you like to proceed with your contact details, or ask me anything else?`
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I have noted your preferences. Would you like to leave your contact details so our team can prepare personalized recommendations?'
      }]);
    }

    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userInput = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userInput }]);
    setInput('');
    setIsLoading(true);

    if (mode === 'ai-chat') {
      // Free AI chat
      try {
        const response = await getAIConciergeResponse(userInput, messages, lang, {
          requestType: requestType || undefined,
          collectedData: collectedData as Record<string, string>
        });
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      } catch {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'I apologize, I encountered an issue. Please try again.'
        }]);
      }
      setIsLoading(false);
      return;
    }

    if (mode === 'contact') {
      const contactSteps = CONTACT_STEPS;
      const currentKey = contactSteps[currentStep].key as keyof CollectedData;
      const newData = { ...collectedData, [currentKey]: userInput };
      setCollectedData(newData);

      setTimeout(() => {
        if (currentStep < contactSteps.length - 1) {
          setCurrentStep(currentStep + 1);
          setMessages(prev => [...prev, { role: 'assistant', content: contactSteps[currentStep + 1].question }]);
        } else {
          setMode('complete');
          sendEmail(newData);
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: '🔑 Thank you! Our team will contact you shortly with personalized recommendations. We look forward to making your Ibiza experience unforgettable.'
          }]);
        }
        setIsLoading(false);
      }, 400);
      return;
    }

    if (mode === 'guided') {
      const steps = getSteps();
      const currentKey = steps[currentStep].key as keyof CollectedData;
      const newData = { ...collectedData, [currentKey]: userInput };
      setCollectedData(newData);

      setTimeout(async () => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
          setMessages(prev => [...prev, { role: 'assistant', content: steps[currentStep + 1].question }]);
          setIsLoading(false);
        } else {
          // All questions answered - get AI suggestion then move to contact
          setIsLoading(true);
          await fetchAISuggestion();
          setMode('contact');
          setCurrentStep(0);
          setTimeout(() => {
            setMessages(prev => [...prev, { role: 'assistant', content: CONTACT_STEPS[0].question }]);
            setIsLoading(false);
          }, 2000);
        }
      }, 400);
    }
  };

  const showOptions = mode === 'options';
  const isComplete = mode === 'complete';
  const canType = !showOptions && !isComplete;

  return (
    <div className="fixed bottom-8 right-8 lg:bottom-12 lg:right-12 z-[100]">
      {isOpen ? (
        <div className="bg-luxury-blue/98 border border-white/10 w-[340px] md:w-96 lg:w-[420px] rounded-[40px] overflow-hidden shadow-2xl backdrop-blur-3xl animate-slide-up ring-1 ring-white/5">
          {/* Header */}
          <div className="bg-luxury-gold/5 p-6 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <LogoTheKey className="w-8 h-12 text-luxury-gold" />
              <div>
                <h3 className="font-serif text-lg text-luxury-gold tracking-wide leading-none">{t.title}</h3>
                <p className="text-[9px] uppercase tracking-[0.25em] text-white/40 mt-1 font-medium">{t.subtitle}</p>
              </div>
            </div>
            <button onClick={() => { setIsOpen(false); resetFlow(); }} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="h-80 lg:h-[400px] overflow-y-auto p-6 space-y-4 text-sm font-light no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-[20px] ${m.role === 'user'
                  ? 'bg-luxury-gold text-luxury-blue font-medium'
                  : 'bg-white/5 text-white/80 border border-white/10 leading-relaxed whitespace-pre-wrap'}`}>
                  {m.content}
                </div>
              </div>
            ))}

            {/* Options */}
            {showOptions && (
              <div className="space-y-2.5 pt-2">
                {[
                  { id: 'villa' as const, label: '🏡 Villa rental', desc: 'Luxury villas with pool' },
                  { id: 'boat' as const, label: '⛵ Yacht charter', desc: 'Yachts & catamarans' },
                  { id: 'service' as const, label: '✨ Services', desc: 'Chef, events, wellness...' },
                  { id: 'property' as const, label: '🔑 Buy property', desc: 'Investment & lifestyle' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionSelect(opt.id)}
                    className="w-full p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-luxury-gold/10 hover:border-luxury-gold/30 transition-all group"
                  >
                    <span className="text-white/90 group-hover:text-luxury-gold transition-colors">{opt.label}</span>
                    <span className="text-white/40 text-xs ml-2">{opt.desc}</span>
                  </button>
                ))}
                <button
                  onClick={handleAskAI}
                  className="w-full p-3.5 rounded-2xl bg-luxury-gold/10 border border-luxury-gold/30 text-left hover:bg-luxury-gold/20 transition-all"
                >
                  <span className="text-luxury-gold">💬 Ask me anything</span>
                  <span className="text-white/40 text-xs ml-2">Free conversation</span>
                </button>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-4 rounded-2xl flex items-center space-x-2">
                  <div className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white/5 border-t border-white/5 flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isComplete ? 'Conversation ended' : (showOptions ? 'Select an option above...' : t.placeholder)}
              disabled={!canType}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2.5 text-white placeholder-white/25 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!canType || !input.trim()}
              className="bg-luxury-gold text-luxury-blue w-11 h-11 rounded-xl flex items-center justify-center border border-luxury-gold hover:bg-luxury-blue hover:text-luxury-gold transition-all disabled:opacity-40"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center transition-all duration-500 group border border-luxury-gold/30 hover:border-luxury-gold/60 hover:scale-105"
          style={{ backgroundColor: 'rgba(8, 20, 28, 0.95)' }}
        >
          <LogoTheKey className="w-8 h-12 lg:w-10 lg:h-14 text-luxury-gold transition-all duration-500 group-hover:scale-110" />
        </button>
      )}
    </div>
  );
};

export default AIConcierge;
