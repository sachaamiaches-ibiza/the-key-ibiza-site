
import React, { useState, useRef, useEffect } from 'react';
import { Message, Language } from '../types';
import { LogoTheKey } from './Navbar';
import { translations } from '../translations';

interface AIConciergeProps {
  lang: Language;
}

type RequestType = 'villa' | 'boat' | 'service' | 'property' | null;
type Mode = 'options' | 'guided' | 'contact' | 'complete';

interface CollectedData {
  requestType: RequestType;
  dates?: string;
  guests?: string;
  budget?: string;
  boatType?: string;
  serviceType?: string;
  propertyType?: string;
  area?: string;
  fullName?: string;
  phone?: string;
  email?: string;
}

interface QuickOption {
  label: string;
  value: string;
}

interface Step {
  key: string;
  question: string;
  options: QuickOption[];
  allowCustom?: boolean;
}

const VILLA_STEPS: Step[] = [
  {
    key: 'dates',
    question: 'When are you planning your stay?',
    options: [
      { label: '📅 This month', value: 'This month' },
      { label: '🌴 Next month', value: 'Next month' },
      { label: '☀️ Summer 2026', value: 'Summer 2026' },
      { label: '🗓️ Flexible', value: 'Flexible dates' },
    ]
  },
  {
    key: 'guests',
    question: 'How many guests?',
    options: [
      { label: '👫 2-4', value: '2-4 guests' },
      { label: '👨‍👩‍👧‍👦 5-8', value: '5-8 guests' },
      { label: '👥 9-12', value: '9-12 guests' },
      { label: '🎉 12+', value: '12+ guests' },
    ]
  },
  {
    key: 'budget',
    question: 'Weekly budget range?',
    options: [
      { label: '💰 < €10k', value: 'Under €10,000/week' },
      { label: '💎 €10-25k', value: '€10,000-25,000/week' },
      { label: '👑 €25-50k', value: '€25,000-50,000/week' },
      { label: '🏆 €50k+', value: 'Over €50,000/week' },
    ]
  },
];

const BOAT_STEPS: Step[] = [
  {
    key: 'boatType',
    question: 'What type of charter?',
    options: [
      { label: '🛥️ Day trip', value: 'Day trip (8h)' },
      { label: '🌅 Sunset cruise', value: 'Sunset cruise (4h)' },
      { label: '⛵ Multi-day', value: 'Multi-day charter' },
      { label: '🎊 Party boat', value: 'Party/Event charter' },
    ]
  },
  {
    key: 'guests',
    question: 'How many guests?',
    options: [
      { label: '👫 2-6', value: '2-6 guests' },
      { label: '👥 7-12', value: '7-12 guests' },
      { label: '🎉 12-20', value: '12-20 guests' },
      { label: '🛳️ 20+', value: '20+ guests' },
    ]
  },
  {
    key: 'budget',
    question: 'Budget range?',
    options: [
      { label: '💰 < €2k', value: 'Under €2,000' },
      { label: '💎 €2-5k', value: '€2,000-5,000' },
      { label: '👑 €5-15k', value: '€5,000-15,000' },
      { label: '🏆 €15k+', value: 'Over €15,000' },
    ]
  },
];

const SERVICE_STEPS: Step[] = [
  {
    key: 'serviceType',
    question: 'What service do you need?',
    options: [
      { label: '👨‍🍳 Private Chef', value: 'Private Chef' },
      { label: '🎉 Event Planning', value: 'Event Planning' },
      { label: '💆 Wellness & Spa', value: 'Wellness & Spa' },
      { label: '🚗 Driver & Security', value: 'Driver & Security' },
    ]
  },
  {
    key: 'guests',
    question: 'How many people?',
    options: [
      { label: '👫 2-4', value: '2-4 people' },
      { label: '👥 5-10', value: '5-10 people' },
      { label: '🎊 10-30', value: '10-30 people' },
      { label: '🎪 30+', value: '30+ people' },
    ]
  },
  {
    key: 'dates',
    question: 'When?',
    options: [
      { label: '📅 This week', value: 'This week' },
      { label: '🗓️ Next week', value: 'Next week' },
      { label: '🌴 This month', value: 'This month' },
      { label: '⏳ Planning ahead', value: 'Planning ahead' },
    ]
  },
];

const PROPERTY_STEPS: Step[] = [
  {
    key: 'propertyType',
    question: 'What are you looking for?',
    options: [
      { label: '🏡 Villa', value: 'Villa' },
      { label: '🏢 Apartment', value: 'Apartment' },
      { label: '🏝️ Land', value: 'Land' },
      { label: '🏨 Commercial', value: 'Commercial property' },
    ]
  },
  {
    key: 'area',
    question: 'Preferred area?',
    options: [
      { label: '🌅 Ibiza Town', value: 'Ibiza Town' },
      { label: '🏖️ San José', value: 'San José' },
      { label: '🌊 Santa Eulalia', value: 'Santa Eulalia' },
      { label: '🗺️ Open to all', value: 'Open to all areas' },
    ]
  },
  {
    key: 'budget',
    question: 'Investment range?',
    options: [
      { label: '💰 < €1M', value: 'Under €1M' },
      { label: '💎 €1-3M', value: '€1-3M' },
      { label: '👑 €3-10M', value: '€3-10M' },
      { label: '🏆 €10M+', value: 'Over €10M' },
    ]
  },
];

const CONTACT_STEPS: Step[] = [
  {
    key: 'fullName',
    question: 'Your name?',
    options: [],
    allowCustom: true
  },
  {
    key: 'phone',
    question: 'Phone number?',
    options: [],
    allowCustom: true
  },
  {
    key: 'email',
    question: 'Email address?',
    options: [],
    allowCustom: true
  },
];

const AIConcierge: React.FC<AIConciergeProps> = ({ lang }) => {
  const t = translations[lang].concierge;
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Welcome to The Key Ibiza ✨\nHow can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<Mode>('options');
  const [requestType, setRequestType] = useState<RequestType>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [collectedData, setCollectedData] = useState<CollectedData>({ requestType: null });
  const [currentOptions, setCurrentOptions] = useState<QuickOption[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentOptions]);

  const resetFlow = () => {
    setMode('options');
    setRequestType(null);
    setCurrentStep(0);
    setCollectedData({ requestType: null });
    setCurrentOptions([]);
    setMessages([{ role: 'assistant', content: 'Welcome to The Key Ibiza ✨\nHow can I help you today?' }]);
  };

  const getSteps = (): Step[] => {
    switch (requestType) {
      case 'villa': return VILLA_STEPS;
      case 'boat': return BOAT_STEPS;
      case 'service': return SERVICE_STEPS;
      case 'property': return PROPERTY_STEPS;
      default: return [];
    }
  };

  const sendEmail = async (data: CollectedData) => {
    const typeLabels: Record<string, string> = {
      villa: 'Villa Rental',
      boat: 'Yacht Charter',
      service: 'Concierge Service',
      property: 'Property Purchase'
    };
    const typeLabel = typeLabels[data.requestType || ''] || 'Inquiry';

    let messageContent = `🔑 NEW ${typeLabel.toUpperCase()} REQUEST\n\n`;

    const fieldLabels: Record<string, string> = {
      dates: '📅 Dates',
      guests: '👥 Guests',
      budget: '💰 Budget',
      boatType: '🛥️ Charter Type',
      serviceType: '✨ Service',
      propertyType: '🏡 Property Type',
      area: '📍 Area',
      fullName: '👤 Name',
      phone: '📞 Phone',
      email: '✉️ Email'
    };

    Object.entries(data).forEach(([key, value]) => {
      if (value && key !== 'requestType') {
        const label = fieldLabels[key] || key;
        messageContent += `${label}: ${value}\n`;
      }
    });

    const formData = new FormData();
    formData.append('name', data.fullName || '');
    formData.append('email', data.email || '');
    formData.append('phone', data.phone || '');
    formData.append('_subject', `🔑 ${typeLabel} Request - ${data.fullName}`);
    formData.append('message', messageContent);
    formData.append('_captcha', 'false');
    formData.append('_template', 'table');

    try {
      await fetch('https://formsubmit.co/ajax/hello@thekey-ibiza.com', {
        method: 'POST',
        body: formData,
      });
    } catch {
      const subject = encodeURIComponent(`${typeLabel} Request`);
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

    const labels: Record<string, string> = {
      villa: '🏡 Villa rental',
      boat: '⛵ Yacht charter',
      service: '✨ Services',
      property: '🔑 Property'
    };

    setMessages(prev => [...prev, { role: 'user', content: labels[option] }]);

    const steps = option === 'villa' ? VILLA_STEPS
      : option === 'boat' ? BOAT_STEPS
      : option === 'service' ? SERVICE_STEPS
      : PROPERTY_STEPS;

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: steps[0].question }]);
      setCurrentOptions(steps[0].options);
    }, 300);
  };

  const handleQuickReply = (value: string) => {
    const steps = mode === 'contact' ? CONTACT_STEPS : getSteps();
    const currentKey = steps[currentStep].key as keyof CollectedData;
    const newData = { ...collectedData, [currentKey]: value };
    setCollectedData(newData);
    setCurrentOptions([]);

    setMessages(prev => [...prev, { role: 'user', content: value }]);

    setTimeout(() => {
      if (mode === 'contact') {
        if (currentStep < CONTACT_STEPS.length - 1) {
          setCurrentStep(currentStep + 1);
          setMessages(prev => [...prev, { role: 'assistant', content: CONTACT_STEPS[currentStep + 1].question }]);
        } else {
          setMode('complete');
          sendEmail(newData);
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: '🔑 Perfect! Our team will contact you within 2 hours with personalized recommendations.\n\nThank you for choosing The Key Ibiza!'
          }]);
        }
      } else {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
          setMessages(prev => [...prev, { role: 'assistant', content: steps[currentStep + 1].question }]);
          setCurrentOptions(steps[currentStep + 1].options);
        } else {
          // Move to contact
          setMode('contact');
          setCurrentStep(0);
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: '✨ Excellent choices! Just a few details to reach you:'
          }]);
          setTimeout(() => {
            setMessages(prev => [...prev, { role: 'assistant', content: CONTACT_STEPS[0].question }]);
          }, 500);
        }
      }
    }, 300);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    handleQuickReply(input.trim());
    setInput('');
  };

  const showMainOptions = mode === 'options';
  const showQuickReplies = mode === 'guided' && currentOptions.length > 0;
  const needsTextInput = mode === 'contact';
  const isComplete = mode === 'complete';

  return (
    <div className="fixed bottom-8 right-8 lg:bottom-12 lg:right-12 z-[100]">
      {isOpen ? (
        <div className="bg-luxury-blue/98 border border-white/10 w-[340px] md:w-96 lg:w-[400px] rounded-[32px] overflow-hidden shadow-2xl backdrop-blur-3xl animate-slide-up ring-1 ring-white/5">
          {/* Header */}
          <div className="bg-luxury-gold/5 p-5 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <LogoTheKey className="w-7 h-10 text-luxury-gold" />
              <div>
                <h3 className="font-serif text-base text-luxury-gold tracking-wide leading-none">{t.title}</h3>
                <p className="text-[8px] uppercase tracking-[0.2em] text-white/40 mt-1">{t.subtitle}</p>
              </div>
            </div>
            <button onClick={() => { setIsOpen(false); resetFlow(); }} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="h-72 lg:h-80 overflow-y-auto p-4 space-y-3 text-sm font-light no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl whitespace-pre-wrap ${m.role === 'user'
                  ? 'bg-luxury-gold text-luxury-blue font-medium'
                  : 'bg-white/5 text-white/90 border border-white/10'}`}>
                  {m.content}
                </div>
              </div>
            ))}

            {/* Main Options */}
            {showMainOptions && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                {[
                  { id: 'villa' as const, emoji: '🏡', label: 'Villa' },
                  { id: 'boat' as const, emoji: '⛵', label: 'Yacht' },
                  { id: 'service' as const, emoji: '✨', label: 'Services' },
                  { id: 'property' as const, emoji: '🔑', label: 'Buy' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionSelect(opt.id)}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-luxury-gold/10 hover:border-luxury-gold/30 transition-all text-center"
                  >
                    <span className="text-2xl block mb-1">{opt.emoji}</span>
                    <span className="text-white/80 text-xs">{opt.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Quick Reply Buttons */}
            {showQuickReplies && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {currentOptions.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickReply(opt.value)}
                    className="p-3 rounded-xl bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold text-xs hover:bg-luxury-gold/20 transition-all text-left"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 px-4 py-3 rounded-2xl flex items-center space-x-2">
                  <div className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Input - only for contact info */}
          {needsTextInput && !isComplete && (
            <div className="p-3 bg-white/5 border-t border-white/5 flex space-x-2">
              <input
                type={currentStep === 2 ? 'email' : currentStep === 1 ? 'tel' : 'text'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={currentStep === 0 ? 'John Smith' : currentStep === 1 ? '+34 600 000 000' : 'email@example.com'}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-luxury-gold/50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-luxury-gold text-luxury-blue w-12 h-12 rounded-xl flex items-center justify-center hover:bg-luxury-gold/80 transition-all disabled:opacity-40"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </button>
            </div>
          )}

          {/* Restart button when complete */}
          {isComplete && (
            <div className="p-3 bg-white/5 border-t border-white/5">
              <button
                onClick={resetFlow}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 transition-all"
              >
                Start new conversation
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 lg:w-18 lg:h-18 rounded-2xl flex items-center justify-center transition-all duration-500 group border border-luxury-gold/30 hover:border-luxury-gold/60 hover:scale-105 shadow-xl"
          style={{ backgroundColor: 'rgba(8, 20, 28, 0.95)' }}
        >
          <LogoTheKey className="w-8 h-11 text-luxury-gold transition-all duration-500 group-hover:scale-110" />
        </button>
      )}
    </div>
  );
};

export default AIConcierge;
