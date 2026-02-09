
import React, { useState, useRef, useEffect } from 'react';
import { Message, Language } from '../types';
import { LogoTheKey } from './Navbar';
import { translations } from '../translations';

interface AIConciergeProps {
  lang: Language;
}

type RequestType = 'villa' | 'boat' | 'service' | 'property' | null;

interface CollectedData {
  requestType: RequestType;
  // Villa fields
  dates?: string;
  guests?: string;
  budget?: string;
  specific?: string;
  // Boat fields
  boatDate?: string;
  boatGuests?: string;
  boatBudget?: string;
  // Service fields
  serviceDate?: string;
  serviceGuests?: string;
  serviceType?: string;
  serviceDescription?: string;
  // Property fields
  propertyType?: string;
  propertyArea?: string;
  propertyBudget?: string;
  propertyUse?: string;
  propertySpecific?: string;
  // Contact fields
  fullName?: string;
  phone?: string;
  email?: string;
}

const VILLA_STEPS = [
  'What dates are you planning to stay?',
  'How many people are you OR how many bedrooms do you need?',
  'What is your estimated budget?',
  'Is there anything specific you are looking for?',
];

const BOAT_STEPS = [
  'What date would you like to go out?',
  'How many people will be on board?',
  'What is your estimated budget?',
];

const SERVICE_STEPS = [
  'What date do you need the service or event?',
  'Approximately how many people will be involved?',
  'What type of service or celebration is it?',
  'Please write a short description of what you need.',
];

const PROPERTY_STEPS = [
  'Are you looking for a villa, apartment, or land?',
  'In which area are you interested?',
  'What is your estimated budget range?',
  'Is this for personal use or investment?',
  'Is there anything specific you are looking for?',
];

const CONTACT_STEPS = [
  'Full name',
  'Phone number',
  'Email',
];

const AIConcierge: React.FC<AIConciergeProps> = ({ lang }) => {
  const t = translations[lang].concierge;
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'How can we help you?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Flow state
  const [requestType, setRequestType] = useState<RequestType>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [inContactPhase, setInContactPhase] = useState(false);
  const [contactStep, setContactStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [collectedData, setCollectedData] = useState<CollectedData>({ requestType: null });
  const [showOptions, setShowOptions] = useState(true);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const resetFlow = () => {
    setRequestType(null);
    setCurrentStep(0);
    setInContactPhase(false);
    setContactStep(0);
    setIsComplete(false);
    setCollectedData({ requestType: null });
    setShowOptions(true);
    setMessages([{ role: 'assistant', content: 'How can we help you?' }]);
  };

  const sendEmail = async (data: CollectedData) => {
    const typeLabel = data.requestType === 'villa' ? 'Villa rental'
      : data.requestType === 'boat' ? 'Boat charter'
      : data.requestType === 'service' ? 'Service / Event organization'
      : 'Property purchase';

    let bodyContent = `Selected option: ${typeLabel}\n\n`;

    if (data.requestType === 'villa') {
      bodyContent += `Dates: ${data.dates}\n`;
      bodyContent += `Guests/Bedrooms: ${data.guests}\n`;
      bodyContent += `Budget: ${data.budget}\n`;
      bodyContent += `Specific Requirements: ${data.specific}\n`;
    } else if (data.requestType === 'boat') {
      bodyContent += `Date: ${data.boatDate}\n`;
      bodyContent += `Guests: ${data.boatGuests}\n`;
      bodyContent += `Budget: ${data.boatBudget}\n`;
    } else if (data.requestType === 'service') {
      bodyContent += `Date: ${data.serviceDate}\n`;
      bodyContent += `Guests: ${data.serviceGuests}\n`;
      bodyContent += `Type: ${data.serviceType}\n`;
      bodyContent += `Description: ${data.serviceDescription}\n`;
    } else if (data.requestType === 'property') {
      bodyContent += `Property Type: ${data.propertyType}\n`;
      bodyContent += `Area: ${data.propertyArea}\n`;
      bodyContent += `Budget Range: ${data.propertyBudget}\n`;
      bodyContent += `Use: ${data.propertyUse}\n`;
      bodyContent += `Specific Requirements: ${data.propertySpecific}\n`;
    }

    bodyContent += `\nFull name: ${data.fullName}\n`;
    bodyContent += `Phone number: ${data.phone}\n`;
    bodyContent += `Email: ${data.email}\n`;

    // Send via EmailJS or backend endpoint
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: 'service_thekey',
          template_id: 'template_concierge',
          user_id: 'YOUR_EMAILJS_PUBLIC_KEY',
          template_params: {
            to_email: 'hello@thekey-ibiza.com',
            subject: `New Concierge Request – ${typeLabel}`,
            message: bodyContent,
            from_name: data.fullName,
            from_email: data.email,
            from_phone: data.phone,
          }
        })
      });
      console.log('Email sent:', response.ok);
    } catch (error) {
      console.error('Email error:', error);
      // Fallback: open mailto
      const subject = encodeURIComponent(`New Concierge Request – ${typeLabel}`);
      const body = encodeURIComponent(bodyContent);
      window.open(`mailto:hello@thekey-ibiza.com?subject=${subject}&body=${body}`, '_blank');
    }
  };

  const handleOptionSelect = (option: RequestType) => {
    if (!option) return;

    setShowOptions(false);
    setRequestType(option);
    setCollectedData({ ...collectedData, requestType: option });

    const userLabel = option === 'villa' ? 'Villa rental'
      : option === 'boat' ? 'Boat charter'
      : option === 'service' ? 'Service / Event organization'
      : 'Property purchase';
    setMessages(prev => [...prev, { role: 'user', content: userLabel }]);

    // Ask first question based on type
    setTimeout(() => {
      let firstQuestion = '';
      if (option === 'villa') {
        firstQuestion = VILLA_STEPS[0];
      } else if (option === 'boat') {
        firstQuestion = BOAT_STEPS[0];
      } else if (option === 'service') {
        firstQuestion = SERVICE_STEPS[0];
      } else {
        firstQuestion = PROPERTY_STEPS[0];
      }
      setMessages(prev => [...prev, { role: 'assistant', content: firstQuestion }]);
    }, 500);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || isComplete) return;

    const userInput = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userInput }]);
    setInput('');
    setIsLoading(true);

    // Determine current steps array
    const steps = requestType === 'villa' ? VILLA_STEPS
      : requestType === 'boat' ? BOAT_STEPS
      : requestType === 'service' ? SERVICE_STEPS
      : PROPERTY_STEPS;

    // Store the answer
    const newData = { ...collectedData };

    if (inContactPhase) {
      // Contact phase
      if (contactStep === 0) {
        newData.fullName = userInput;
      } else if (contactStep === 1) {
        newData.phone = userInput;
      } else if (contactStep === 2) {
        newData.email = userInput;
      }
      setCollectedData(newData);

      setTimeout(() => {
        if (contactStep < CONTACT_STEPS.length - 1) {
          // Next contact question
          setContactStep(contactStep + 1);
          setMessages(prev => [...prev, { role: 'assistant', content: CONTACT_STEPS[contactStep + 1] }]);
        } else {
          // Complete - send email and show thank you
          setIsComplete(true);
          sendEmail(newData);
          setMessages(prev => [...prev, { role: 'assistant', content: 'Thank you. We will contact you as soon as possible.' }]);
        }
        setIsLoading(false);
      }, 500);
    } else {
      // Flow questions phase
      if (requestType === 'villa') {
        if (currentStep === 0) newData.dates = userInput;
        else if (currentStep === 1) newData.guests = userInput;
        else if (currentStep === 2) newData.budget = userInput;
        else if (currentStep === 3) newData.specific = userInput;
      } else if (requestType === 'boat') {
        if (currentStep === 0) newData.boatDate = userInput;
        else if (currentStep === 1) newData.boatGuests = userInput;
        else if (currentStep === 2) newData.boatBudget = userInput;
      } else if (requestType === 'service') {
        if (currentStep === 0) newData.serviceDate = userInput;
        else if (currentStep === 1) newData.serviceGuests = userInput;
        else if (currentStep === 2) newData.serviceType = userInput;
        else if (currentStep === 3) newData.serviceDescription = userInput;
      } else if (requestType === 'property') {
        if (currentStep === 0) newData.propertyType = userInput;
        else if (currentStep === 1) newData.propertyArea = userInput;
        else if (currentStep === 2) newData.propertyBudget = userInput;
        else if (currentStep === 3) newData.propertyUse = userInput;
        else if (currentStep === 4) newData.propertySpecific = userInput;
      }
      setCollectedData(newData);

      setTimeout(() => {
        if (currentStep < steps.length - 1) {
          // Next flow question
          setCurrentStep(currentStep + 1);
          setMessages(prev => [...prev, { role: 'assistant', content: steps[currentStep + 1] }]);
        } else {
          // Move to contact phase
          setInContactPhase(true);
          setContactStep(0);
          setMessages(prev => [...prev, { role: 'assistant', content: CONTACT_STEPS[0] }]);
        }
        setIsLoading(false);
      }, 500);
    }
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
            <button onClick={() => { setIsOpen(false); resetFlow(); }} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all">
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

            {/* Option buttons - only show at start */}
            {showOptions && !requestType && (
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => handleOptionSelect('villa')}
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white/80 hover:bg-luxury-gold/20 hover:border-luxury-gold/40 hover:text-luxury-gold transition-all text-left"
                >
                  Villa rental
                </button>
                <button
                  onClick={() => handleOptionSelect('boat')}
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white/80 hover:bg-luxury-gold/20 hover:border-luxury-gold/40 hover:text-luxury-gold transition-all text-left"
                >
                  Boat charter
                </button>
                <button
                  onClick={() => handleOptionSelect('service')}
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white/80 hover:bg-luxury-gold/20 hover:border-luxury-gold/40 hover:text-luxury-gold transition-all text-left"
                >
                  Service / Event organization
                </button>
                <button
                  onClick={() => handleOptionSelect('property')}
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white/80 hover:bg-luxury-gold/20 hover:border-luxury-gold/40 hover:text-luxury-gold transition-all text-left"
                >
                  Property purchase
                </button>
              </div>
            )}

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
              placeholder={isComplete ? '' : (showOptions ? 'Select an option above...' : t.placeholder)}
              disabled={showOptions || isComplete}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm lg:text-base py-3 text-white placeholder-white/20 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={showOptions || isComplete}
              className="bg-luxury-gold text-luxury-blue w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-white hover:scale-105 transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg flex items-center justify-center transition-all duration-500 group border border-luxury-gold/30 hover:border-luxury-gold/60"
          style={{ backgroundColor: 'rgba(8, 20, 28, 1)' }}
        >
          <LogoTheKey className="w-8 h-12 lg:w-10 lg:h-14 text-luxury-gold transition-all duration-500 group-hover:scale-110" />
        </button>
      )}
    </div>
  );
};

export default AIConcierge;
