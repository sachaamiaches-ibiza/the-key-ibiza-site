
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
  question: Record<Language, string>;
  options: { label: string; value: Record<Language, string> }[];
  allowCustom?: boolean;
}

// Translations for the concierge
const conciergeStrings = {
  welcome: {
    en: 'Welcome to The Key Ibiza ✨\nHow can I help you today?',
    fr: 'Bienvenue chez The Key Ibiza ✨\nComment puis-je vous aider?',
    es: 'Bienvenido a The Key Ibiza ✨\n¿Cómo puedo ayudarte?',
    de: 'Willkommen bei The Key Ibiza ✨\nWie kann ich Ihnen helfen?',
  },
  mainOptions: {
    villa: { en: 'Villa', fr: 'Villa', es: 'Villa', de: 'Villa' },
    boat: { en: 'Yacht', fr: 'Yacht', es: 'Yate', de: 'Yacht' },
    service: { en: 'Services', fr: 'Services', es: 'Servicios', de: 'Services' },
    property: { en: 'Buy', fr: 'Acheter', es: 'Comprar', de: 'Kaufen' },
  },
  excellent: {
    en: '✨ Excellent choices! Just a few details to reach you:',
    fr: '✨ Excellents choix! Quelques détails pour vous contacter:',
    es: '✨ ¡Excelentes opciones! Unos detalles para contactarte:',
    de: '✨ Ausgezeichnete Wahl! Noch ein paar Details:',
  },
  complete: {
    en: '🔑 Perfect! Our team will contact you within 2 hours with personalized recommendations.\n\nThank you for choosing The Key Ibiza!',
    fr: '🔑 Parfait! Notre équipe vous contactera sous 2 heures avec des recommandations personnalisées.\n\nMerci d\'avoir choisi The Key Ibiza!',
    es: '🔑 ¡Perfecto! Nuestro equipo te contactará en 2 horas con recomendaciones personalizadas.\n\n¡Gracias por elegir The Key Ibiza!',
    de: '🔑 Perfekt! Unser Team wird Sie innerhalb von 2 Stunden mit personalisierten Empfehlungen kontaktieren.\n\nVielen Dank, dass Sie The Key Ibiza gewählt haben!',
  },
  newConversation: {
    en: 'Start new conversation',
    fr: 'Nouvelle conversation',
    es: 'Nueva conversación',
    de: 'Neues Gespräch',
  },
  contactQuestions: {
    name: { en: 'Your name?', fr: 'Votre nom?', es: '¿Tu nombre?', de: 'Ihr Name?' },
    phone: { en: 'Phone number?', fr: 'Numéro de téléphone?', es: '¿Número de teléfono?', de: 'Telefonnummer?' },
    email: { en: 'Email address?', fr: 'Adresse email?', es: '¿Correo electrónico?', de: 'E-Mail-Adresse?' },
  },
};

const VILLA_STEPS: Step[] = [
  {
    key: 'dates',
    question: { en: 'When are you planning your stay?', fr: 'Quand prévoyez-vous votre séjour?', es: '¿Cuándo planeas tu estancia?', de: 'Wann planen Sie Ihren Aufenthalt?' },
    options: [
      { label: '📅', value: { en: 'This month', fr: 'Ce mois-ci', es: 'Este mes', de: 'Diesen Monat' } },
      { label: '🌴', value: { en: 'Next month', fr: 'Mois prochain', es: 'Próximo mes', de: 'Nächsten Monat' } },
      { label: '☀️', value: { en: 'Summer 2026', fr: 'Été 2026', es: 'Verano 2026', de: 'Sommer 2026' } },
      { label: '🗓️', value: { en: 'Flexible', fr: 'Flexible', es: 'Flexible', de: 'Flexibel' } },
    ]
  },
  {
    key: 'guests',
    question: { en: 'How many guests?', fr: 'Combien de personnes?', es: '¿Cuántos huéspedes?', de: 'Wie viele Gäste?' },
    options: [
      { label: '👫 2-4', value: { en: '2-4 guests', fr: '2-4 personnes', es: '2-4 huéspedes', de: '2-4 Gäste' } },
      { label: '👨‍👩‍👧‍👦 5-8', value: { en: '5-8 guests', fr: '5-8 personnes', es: '5-8 huéspedes', de: '5-8 Gäste' } },
      { label: '👥 9-12', value: { en: '9-12 guests', fr: '9-12 personnes', es: '9-12 huéspedes', de: '9-12 Gäste' } },
      { label: '🎉 12+', value: { en: '12+ guests', fr: '12+ personnes', es: '12+ huéspedes', de: '12+ Gäste' } },
    ]
  },
  {
    key: 'budget',
    question: { en: 'Weekly budget range?', fr: 'Budget hebdomadaire?', es: '¿Presupuesto semanal?', de: 'Wochenbudget?' },
    options: [
      { label: '💰 < €10k', value: { en: 'Under €10,000/week', fr: 'Moins de 10 000€/semaine', es: 'Menos de 10.000€/semana', de: 'Unter 10.000€/Woche' } },
      { label: '💎 €10-25k', value: { en: '€10,000-25,000/week', fr: '10 000-25 000€/semaine', es: '10.000-25.000€/semana', de: '10.000-25.000€/Woche' } },
      { label: '👑 €25-50k', value: { en: '€25,000-50,000/week', fr: '25 000-50 000€/semaine', es: '25.000-50.000€/semana', de: '25.000-50.000€/Woche' } },
      { label: '🏆 €50k+', value: { en: 'Over €50,000/week', fr: 'Plus de 50 000€/semaine', es: 'Más de 50.000€/semana', de: 'Über 50.000€/Woche' } },
    ]
  },
];

const BOAT_STEPS: Step[] = [
  {
    key: 'boatType',
    question: { en: 'What type of charter?', fr: 'Quel type de location?', es: '¿Qué tipo de charter?', de: 'Welche Art von Charter?' },
    options: [
      { label: '🛥️', value: { en: 'Day trip (8h)', fr: 'Journée (8h)', es: 'Día completo (8h)', de: 'Tagestour (8h)' } },
      { label: '🌅', value: { en: 'Sunset cruise (4h)', fr: 'Croisière coucher de soleil (4h)', es: 'Crucero atardecer (4h)', de: 'Sonnenuntergang (4h)' } },
      { label: '⛵', value: { en: 'Multi-day charter', fr: 'Plusieurs jours', es: 'Varios días', de: 'Mehrtägig' } },
      { label: '🎊', value: { en: 'Party/Event', fr: 'Fête/Événement', es: 'Fiesta/Evento', de: 'Party/Event' } },
    ]
  },
  {
    key: 'guests',
    question: { en: 'How many guests?', fr: 'Combien de personnes?', es: '¿Cuántos invitados?', de: 'Wie viele Gäste?' },
    options: [
      { label: '👫 2-6', value: { en: '2-6 guests', fr: '2-6 personnes', es: '2-6 invitados', de: '2-6 Gäste' } },
      { label: '👥 7-12', value: { en: '7-12 guests', fr: '7-12 personnes', es: '7-12 invitados', de: '7-12 Gäste' } },
      { label: '🎉 12-20', value: { en: '12-20 guests', fr: '12-20 personnes', es: '12-20 invitados', de: '12-20 Gäste' } },
      { label: '🛳️ 20+', value: { en: '20+ guests', fr: '20+ personnes', es: '20+ invitados', de: '20+ Gäste' } },
    ]
  },
  {
    key: 'budget',
    question: { en: 'Budget range?', fr: 'Budget?', es: '¿Presupuesto?', de: 'Budget?' },
    options: [
      { label: '💰 < €2k', value: { en: 'Under €2,000', fr: 'Moins de 2 000€', es: 'Menos de 2.000€', de: 'Unter 2.000€' } },
      { label: '💎 €2-5k', value: { en: '€2,000-5,000', fr: '2 000-5 000€', es: '2.000-5.000€', de: '2.000-5.000€' } },
      { label: '👑 €5-15k', value: { en: '€5,000-15,000', fr: '5 000-15 000€', es: '5.000-15.000€', de: '5.000-15.000€' } },
      { label: '🏆 €15k+', value: { en: 'Over €15,000', fr: 'Plus de 15 000€', es: 'Más de 15.000€', de: 'Über 15.000€' } },
    ]
  },
];

const SERVICE_STEPS: Step[] = [
  {
    key: 'serviceType',
    question: { en: 'What service do you need?', fr: 'Quel service recherchez-vous?', es: '¿Qué servicio necesitas?', de: 'Welchen Service benötigen Sie?' },
    options: [
      { label: '👨‍🍳', value: { en: 'Private Chef', fr: 'Chef Privé', es: 'Chef Privado', de: 'Privatkoch' } },
      { label: '💆', value: { en: 'Wellness & Spa', fr: 'Bien-être & Spa', es: 'Bienestar & Spa', de: 'Wellness & Spa' } },
      { label: '🚗', value: { en: 'Driver & Security', fr: 'Chauffeur & Sécurité', es: 'Conductor & Seguridad', de: 'Fahrer & Sicherheit' } },
      { label: '👶', value: { en: 'Babysitting', fr: 'Babysitting', es: 'Niñera', de: 'Babysitter' } },
      { label: '🛒', value: { en: 'Deliveries', fr: 'Livraisons', es: 'Entregas', de: 'Lieferungen' } },
      { label: '💇', value: { en: 'Hair & Beauty', fr: 'Coiffeur & Beauté', es: 'Peluquería & Belleza', de: 'Friseur & Beauty' } },
      { label: '🧘', value: { en: 'Yoga & Fitness', fr: 'Yoga & Fitness', es: 'Yoga & Fitness', de: 'Yoga & Fitness' } },
      { label: '🧹', value: { en: 'Cleaning', fr: 'Ménage', es: 'Limpieza', de: 'Reinigung' } },
    ]
  },
  {
    key: 'guests',
    question: { en: 'How many people?', fr: 'Combien de personnes?', es: '¿Cuántas personas?', de: 'Wie viele Personen?' },
    options: [
      { label: '👫 2-4', value: { en: '2-4 people', fr: '2-4 personnes', es: '2-4 personas', de: '2-4 Personen' } },
      { label: '👥 5-10', value: { en: '5-10 people', fr: '5-10 personnes', es: '5-10 personas', de: '5-10 Personen' } },
      { label: '🎊 10-30', value: { en: '10-30 people', fr: '10-30 personnes', es: '10-30 personas', de: '10-30 Personen' } },
      { label: '🎪 30+', value: { en: '30+ people', fr: '30+ personnes', es: '30+ personas', de: '30+ Personen' } },
    ]
  },
  {
    key: 'dates',
    question: { en: 'When?', fr: 'Quand?', es: '¿Cuándo?', de: 'Wann?' },
    options: [
      { label: '📅', value: { en: 'This week', fr: 'Cette semaine', es: 'Esta semana', de: 'Diese Woche' } },
      { label: '🗓️', value: { en: 'Next week', fr: 'Semaine prochaine', es: 'Próxima semana', de: 'Nächste Woche' } },
      { label: '🌴', value: { en: 'This month', fr: 'Ce mois-ci', es: 'Este mes', de: 'Diesen Monat' } },
      { label: '⏳', value: { en: 'Planning ahead', fr: 'À planifier', es: 'Planificando', de: 'Vorausplanung' } },
    ]
  },
];

const PROPERTY_STEPS: Step[] = [
  {
    key: 'propertyType',
    question: { en: 'What are you looking for?', fr: 'Que recherchez-vous?', es: '¿Qué buscas?', de: 'Was suchen Sie?' },
    options: [
      { label: '🏡', value: { en: 'Villa', fr: 'Villa', es: 'Villa', de: 'Villa' } },
      { label: '🏢', value: { en: 'Apartment', fr: 'Appartement', es: 'Apartamento', de: 'Wohnung' } },
      { label: '🏝️', value: { en: 'Land', fr: 'Terrain', es: 'Terreno', de: 'Grundstück' } },
      { label: '🏨', value: { en: 'Commercial', fr: 'Commercial', es: 'Comercial', de: 'Gewerbe' } },
    ]
  },
  {
    key: 'area',
    question: { en: 'Preferred area?', fr: 'Zone préférée?', es: '¿Zona preferida?', de: 'Bevorzugte Gegend?' },
    options: [
      { label: '🌅 Ibiza Town', value: { en: 'Ibiza Town', fr: 'Ibiza Town', es: 'Ibiza Town', de: 'Ibiza-Stadt' } },
      { label: '🏖️ San José', value: { en: 'San José', fr: 'San José', es: 'San José', de: 'San José' } },
      { label: '🌊 Santa Eulalia', value: { en: 'Santa Eulalia', fr: 'Santa Eulalia', es: 'Santa Eulalia', de: 'Santa Eulalia' } },
      { label: '🗺️', value: { en: 'Open to all', fr: 'Ouvert à tout', es: 'Abierto a todo', de: 'Überall' } },
    ]
  },
  {
    key: 'budget',
    question: { en: 'Investment range?', fr: 'Budget d\'investissement?', es: '¿Rango de inversión?', de: 'Investitionsrahmen?' },
    options: [
      { label: '💰 < €1M', value: { en: 'Under €1M', fr: 'Moins de 1M€', es: 'Menos de 1M€', de: 'Unter 1M€' } },
      { label: '💎 €1-3M', value: { en: '€1-3M', fr: '1-3M€', es: '1-3M€', de: '1-3M€' } },
      { label: '👑 €3-10M', value: { en: '€3-10M', fr: '3-10M€', es: '3-10M€', de: '3-10M€' } },
      { label: '🏆 €10M+', value: { en: 'Over €10M', fr: 'Plus de 10M€', es: 'Más de 10M€', de: 'Über 10M€' } },
    ]
  },
];

const AIConcierge: React.FC<AIConciergeProps> = ({ lang }) => {
  const t = translations[lang].concierge;
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: conciergeStrings.welcome[lang] }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<Mode>('options');
  const [requestType, setRequestType] = useState<RequestType>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [collectedData, setCollectedData] = useState<CollectedData>({ requestType: null });
  const [currentOptions, setCurrentOptions] = useState<{ label: string; value: string }[]>([]);

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
    setMessages([{ role: 'assistant', content: conciergeStrings.welcome[lang] }]);
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

  const getTranslatedOptions = (step: Step): { label: string; value: string }[] => {
    return step.options.map(opt => ({
      label: `${opt.label} ${opt.value[lang]}`,
      value: opt.value[lang]
    }));
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
    messageContent += `Language: ${lang.toUpperCase()}\n\n`;

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

    const labels: Record<string, Record<Language, string>> = {
      villa: { en: '🏡 Villa rental', fr: '🏡 Location villa', es: '🏡 Alquiler villa', de: '🏡 Villa mieten' },
      boat: { en: '⛵ Yacht charter', fr: '⛵ Location yacht', es: '⛵ Alquiler yate', de: '⛵ Yacht charter' },
      service: { en: '✨ Services', fr: '✨ Services', es: '✨ Servicios', de: '✨ Services' },
      property: { en: '🔑 Property', fr: '🔑 Immobilier', es: '🔑 Inmueble', de: '🔑 Immobilie' },
    };

    setMessages(prev => [...prev, { role: 'user', content: labels[option][lang] }]);

    const steps = option === 'villa' ? VILLA_STEPS
      : option === 'boat' ? BOAT_STEPS
      : option === 'service' ? SERVICE_STEPS
      : PROPERTY_STEPS;

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: steps[0].question[lang] }]);
      setCurrentOptions(getTranslatedOptions(steps[0]));
    }, 300);
  };

  const handleQuickReply = (value: string) => {
    const steps = getSteps();
    const currentKey = steps[currentStep]?.key as keyof CollectedData;

    if (mode === 'contact') {
      const contactKeys = ['fullName', 'phone', 'email'];
      const key = contactKeys[currentStep] as keyof CollectedData;
      const newData = { ...collectedData, [key]: value };
      setCollectedData(newData);
      setCurrentOptions([]);

      setMessages(prev => [...prev, { role: 'user', content: value }]);

      setTimeout(() => {
        if (currentStep < 2) {
          setCurrentStep(currentStep + 1);
          const questions = [
            conciergeStrings.contactQuestions.name,
            conciergeStrings.contactQuestions.phone,
            conciergeStrings.contactQuestions.email
          ];
          setMessages(prev => [...prev, { role: 'assistant', content: questions[currentStep + 1][lang] }]);
        } else {
          setMode('complete');
          sendEmail(newData);
          setMessages(prev => [...prev, { role: 'assistant', content: conciergeStrings.complete[lang] }]);
        }
      }, 300);
      return;
    }

    const newData = { ...collectedData, [currentKey]: value };
    setCollectedData(newData);
    setCurrentOptions([]);

    setMessages(prev => [...prev, { role: 'user', content: value }]);

    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setMessages(prev => [...prev, { role: 'assistant', content: steps[currentStep + 1].question[lang] }]);
        setCurrentOptions(getTranslatedOptions(steps[currentStep + 1]));
      } else {
        setMode('contact');
        setCurrentStep(0);
        setMessages(prev => [...prev, { role: 'assistant', content: conciergeStrings.excellent[lang] }]);
        setTimeout(() => {
          setMessages(prev => [...prev, { role: 'assistant', content: conciergeStrings.contactQuestions.name[lang] }]);
        }, 500);
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

  const placeholders: Record<Language, string[]> = {
    en: ['John Smith', '+34 600 000 000', 'email@example.com'],
    fr: ['Jean Dupont', '+33 6 00 00 00 00', 'email@example.com'],
    es: ['Juan García', '+34 600 000 000', 'email@example.com'],
    de: ['Max Müller', '+49 170 000 0000', 'email@example.com'],
  };

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
                  { id: 'villa' as const, emoji: '🏡', label: conciergeStrings.mainOptions.villa[lang] },
                  { id: 'boat' as const, emoji: '⛵', label: conciergeStrings.mainOptions.boat[lang] },
                  { id: 'service' as const, emoji: '✨', label: conciergeStrings.mainOptions.service[lang] },
                  { id: 'property' as const, emoji: '🔑', label: conciergeStrings.mainOptions.property[lang] },
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
                placeholder={placeholders[lang][currentStep]}
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
                {conciergeStrings.newConversation[lang]}
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
