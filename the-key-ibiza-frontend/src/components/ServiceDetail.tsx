
import React, { useEffect, useState } from 'react';
import { Language } from '../types';

// Add lang to the props interface
interface ServiceDetailProps {
  serviceId: string;
  onNavigate: (view: any) => void;
  lang: Language;
}

// Service-specific questions for the contact form
const SERVICE_QUESTIONS: Record<string, { label: string; placeholder: string }> = {
  villas: {
    label: "What type of villa are you looking for?",
    placeholder: "Number of guests, preferred area, style preferences, dates..."
  },
  yacht: {
    label: "Tell us about your charter needs",
    placeholder: "Type of boat, number of guests, preferred dates, special requests..."
  },
  security: {
    label: "What security services do you require?",
    placeholder: "Type of protection, duration, specific concerns..."
  },
  nightlife: {
    label: "What nightlife experience are you looking for?",
    placeholder: "Clubs, VIP tables, dates, group size, special occasions..."
  },
  events: {
    label: "Tell us about your event",
    placeholder: "Type of event, date, number of guests, venue preferences..."
  },
  catering: {
    label: "What catering services do you need?",
    placeholder: "Type of event, cuisine preferences, dietary requirements, number of guests..."
  },
  furniture: {
    label: "What furniture are you interested in?",
    placeholder: "Type of pieces, style, rental or purchase, delivery location..."
  },
  health: {
    label: "What wellness program interests you?",
    placeholder: "Type of treatment, health goals, preferred schedule..."
  },
  yoga: {
    label: "What type of yoga or wellness session do you prefer?",
    placeholder: "Yoga style, individual or group, location preferences, experience level..."
  },
  cleaning: {
    label: "What cleaning services do you need?",
    placeholder: "Villa size, frequency, specific areas, pool/garden included..."
  },
  driver: {
    label: "What transportation do you require?",
    placeholder: "Type of service, dates, destinations, vehicle preferences..."
  },
  deliveries: {
    label: "What would you like us to deliver?",
    placeholder: "Type of items, delivery address, special instructions..."
  },
  babysitting: {
    label: "Tell us about your childcare needs",
    placeholder: "Children's ages, dates/times, special requirements, activities..."
  },
  photographer: {
    label: "What type of photo session do you need?",
    placeholder: "Style of shoot, location, number of people, occasion..."
  }
};

const SERVICE_DATA: Record<string, any> = {
  villas: {
    badge: "Real Estate & Architecture",
    title: "Prestige Villas",
    subtitle: "An invisible collection.",
    description: [
      "Beyond standard luxury, we open the doors to 'Off-Market' properties, inaccessible to the general public. Our selection favors organic architecture, rare locations, and absolute privacy.",
      "Whether you are looking for a tastefully renovated traditional Finca or a modernist masterpiece suspended over the sea, each villa is rigorously selected for its unique character.",
      "Our heritage ensures we guarantee unparalleled quality in furnishing and maintenance."
    ],
    features: ["Off-Market Properties", "Private Chefs & Butlers", "Exceptional Architecture", "Es Vedra Views"],
    imageMain: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200",
    imageGrid1: "https://images.unsplash.com/photo-1600596542815-e32c2159f828?auto=format&fit=crop&q=80&w=800",
    imageGrid2: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
  },
  yacht: {
    badge: "Maritime",
    title: "Yachting & Charters",
    subtitle: "The horizon is your only limit.",
    description: [
      "Experience Ibiza from the sea. Our exclusive fleet of yachts and superyachts is ready to take you to the crystal-clear waters of Formentera or the secret coves of the island's north.",
      "From sporty day-charters to extended stays on a 50-meter vessel, every detail is orchestrated: experienced captain, dedicated crew, and gourmet catering on board.",
      "We organize your maritime transfers to the most sought-after beach clubs for a high-profile arrival."
    ],
    features: ["Premium Fleet", "Gourmet Catering", "Formentera Transfers", "Seabobs & Toys"],
    imageMain: "https://images.unsplash.com/photo-1567899378494-47b22a2bb96a?auto=format&fit=crop&q=80&w=1200",
    imageGrid1: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&q=80&w=800",
    imageGrid2: "https://images.unsplash.com/photo-1605281317010-fe5ffe79ba02?auto=format&fit=crop&q=80&w=800"
  },
  security: {
    badge: "Protection",
    title: "Personalized Security",
    subtitle: "Your safety and peace of mind are our absolute priority. Our bespoke services are designed to provide discreet, reliable protection—so you can enjoy every moment in total serenity.",
    description: [
      "🛡️ Tailor-Made Protection for Every Situation: Whether you’re hosting a private event, require personal protection, or need property surveillance while away, our team of experienced professionals is here to support you with utmost discretion.",
      "🤝 Discreet, Efficient & Integrated: We understand the value of a seamless and unobtrusive security experience. Our team blends into your lifestyle and works behind the scenes to provide visible results with an invisible presence.",
      "Your Trusted Security Partner on the Island: Whether you need short-term protection for a special occasion or long-term peace of mind during your stay, The Key Ibiza provides a trusted, flexible solution tailored to your unique needs."
    ],
    features: [
      "Close Protection", 
      "24/7 Property Surveillance", 
      "Event Security Coordination", 
      "Secure Transportation", 
      "Multilingual Staff", 
      "Advanced Technology",
      "Customized Strategies",
      "Total Confidentiality"
    ],
    imageMain: "https://images.unsplash.com/photo-1551135049-8a33b5883817?auto=format&fit=crop&q=80&w=1200",
    imageGrid1: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800",
    imageGrid2: "https://images.unsplash.com/photo-1614713568397-b30b779d0031?auto=format&fit=crop&q=80&w=800"
  },
  nightlife: {
    badge: "VIP & Concierge",
    title: "Night Life",
    subtitle: "Experience Ibiza’s Nightlife Like Never Before",
    description: [
      "Ibiza’s nightlife isn’t just legendary — it’s a sensory journey, a thrilling adventure that transforms every night into a story worth telling. At The Key Ibiza, we open the doors to the island’s most exclusive scenes.",
      "✨ Access the Unreachable: Guided by an expert concierge team, guests gain privileged access to iconic clubs like Pacha, Hï Ibiza, and Amnesia, including VIP tables and ultra-private guest list management.",
      "🎉 Beyond the Club: The experience continues with private villa parties, full staffing, and luxury chauffeur services to ensure every movement is made in style and total comfort.",
      "🗝 The Key to the Elite: Whether celebrating a milestone or seeking a spontaneous night of magic, the mission is to make Ibiza nights effortless, luxurious, and completely unforgettable."
    ],
    features: ["VIP Club Tables", "Backstage Access", "Private Villa Parties", "Luxury Transport", "Guest List Management", "Iconic Venue Access"],
    imageMain: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&q=80&w=1200",
    imageGrid1: "https://images.unsplash.com/photo-1574391884720-38528073d6dd?auto=format&fit=crop&q=80&w=800",
    imageGrid2: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80&w=1200"
  },
  events: {
    badge: "Celebrations & Events",
    title: "Personalized Events",
    subtitle: "Celebrate Life’s Best Moments in Ibiza with The Key",
    description: [
      "Specializing in turning milestones into unforgettable experiences. Whether it is a luxury birthday party, a bespoke hen or stag getaway, or a dream wedding, every detail is managed seamlessly and stylishly.",
      "🎉 Luxury Birthdays: From intimate gatherings to lavish parties under the stars, we offer full-service planning, event design, and high-end catering in private villas or chic restaurants.",
      "🥂 Tailor-Made Itineraries: Hen and stag parties are elevated with private yachts, sun-soaked boat trips, and exclusive beach club access, paired with holistic wellness experiences for the perfect balance.",
      "💍 Ibiza Weddings: Design bespoke ceremonies that reflect a unique love story, from romantic cliffside views to bohemian beach events, supported by full vendor selection and legal coordination."
    ],
    features: ["Bespoke Weddings", "Luxury Birthdays", "Hen & Stag Itineraries", "Exclusive Venues", "Full Planning Service", "Bilingual Team (EN/FR/ES)"],
    imageMain: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1200",
    imageGrid1: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
    imageGrid2: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200"
  },
  catering: {
    badge: "Gastronomy & Lifestyle",
    title: "Catering & Bottle Service",
    subtitle: "Gourmet Catering & Exclusive Bottle Service in Ibiza – Curated by The Key",
    description: [
      "Immerse yourself in a world of elevated taste and bespoke hospitality. We turn every moment into a culinary celebration, where every flavor is an invitation to indulge in Mediterranean and global gastronomy.",
      "🍽️ Exquisite Private Catering: World-class chefs craft refined menus for intimate dinners or elegant celebrations, using seasonal, locally sourced ingredients. Services include private chef experiences, full-service setup, and specialized staff for both villa and event settings.",
      "🍾 Luxury Bottle Service: To complete the gourmet experience, we provide high-end delivery of prestigious champagnes, curated fine wines, and rare spirit labels directly to any villa or venue.",
      "✨ Limitless Luxury: From poolside gatherings to all-night parties, The Key Ibiza ensures impeccable quality. Every aspect of the dining experience is perfectly orchestrated, allowing guests to relax and savor every divine flavor and toast."
    ],
    features: ["Private Star Chefs", "Champagne & Fine Wines", "Villa Drink Delivery", "Bespoke Wine Catalogs", "Seasonal Ingredients", "Restaurant Partnerships"],
    imageMain: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1200",
    imageGrid1: "https://images.unsplash.com/photo-1534533983688-c7b8e13fd3b6?auto=format&fit=crop&q=80&w=1200",
    imageGrid2: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=1200"
  },
  furniture: {
    badge: "Furniture & Interior Design",
    title: "La Villa Garden",
    subtitle: "Timeless Outdoor Elegance & Bespoke Design",
    description: [
      "Founded in 2010, La Villa Garden is a family story built around a shared passion for design and the art of outdoor living. They are a trusted benchmark in luxury outdoor furniture, combining modern aesthetics with exceptional durability.",
      "🌿 A Family Passion: Each piece designed—from contemporary lounges to artisanal teak sets—tells a story of quality and sustainability, aimed at bringing harmony and timeless beauty to every terrace, garden, or poolside retreat.",
      "🔨 Masterful Materials: Resilience and charm are ensured through top-tier materials: Teak for natural warmth, Aluminum for modernity, and Ceramic or stone finishes for a sophisticated touch.",
      "🤝 Preferred Partner: As a preferred partner of The Key Ibiza, La Villa Garden offers clients refined living experiences through family-driven values and a commitment to excellence down to the very last detail."
    ],
    features: ["Family Business", "Resilient Teak & Aluminum", "Bespoke Outdoor Styling", "Premium Craftsmanship", "Trusted Ibiza Partner", "Timeless Aesthetics"],
    imageMain: "/la-villa-furniture.jpg",
    imageGrid1: "/la-villa-furniture.jpg",
    imageGrid2: "/la-villa-furniture.jpg"
  },
  health: {
    badge: "Vitality & Holistic Health",
    title: "Health & Beauty Program",
    subtitle: "Meet the Wellness Guide: Naturopath, Coach & Chef",
    description: [
      "Building on seven years of professional experience as a nurse in France, the program offers a unique method of holistic support that nourishes both body and soul, guiding guests toward their best possible selves.",
      "🌱 Holistic Approach: This personalized care blends natural nutrition, yoga, healing massages, and restorative hikes. Each session is customized to target goals like improved digestion, natural weight management, and stress relief.",
      "👩‍🍳 Chef & Nutritionist Services: Certified specialists create gourmet recipes using only organic and natural ingredients. Guests receive expert nutritional advice tailored to energy balance and health objectives.",
      "💫 Holistic Coaching: The mission focuses on building a balanced life through naturopathy for physical vitality, coaching for goal attainment, and EFT (Emotional Freedom Technique) to cultivate deep inner calm."
    ],
    features: ["Naturopathy & Nursing Expertise", "Certified Nutritionist & Chef", "EFT Emotional Release", "Holistic Goal Coaching", "Organic Gourmet Recipes", "Stress Management"],
    imageMain: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1200",
    imageGrid1: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800",
    imageGrid2: "https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&q=80&w=1200"
  },
  yoga: {
    badge: "Mindfulness & Vitality",
    title: "Yoga & Wellness Journey",
    subtitle: "Discover Wellness with The Key Ibiza: Yoga & Reiki in Harmony",
    description: [
      "The Key Ibiza offers a transformative wellness experience that blends the ancient wisdom of yoga with energy healing. Set against the serene backdrop of Ibiza’s natural beauty, these programs invite a soulful journey of balance and revitalization.",
      "🧘‍♀️ Guided by Experts: Sessions are led by world-class professionals like Valérie and Francesca. Valérie focuses on harmonization and inner alignment, while Francesca brings a unique blend of Yoga, Ayurveda, and immersive retreats.",
      "✨ A Holistic Sanctuary: Programs are tailor-made and flow at the guest's own rhythm. Whether seeking physical renewal or spiritual awakening, sessions are held in peaceful locations surrounded by nature.",
      "🌿 Reconnect and Renew: Every journey is designed around personal goals, ensuring a perfect balance between body, mind, and energy for both beginners and advanced practitioners."
    ],
    features: ["Yoga & Reiki Healing", "Valérie: Inner Alignment", "Francesca: Ayurveda", "Custom Wellness Programs", "Nature-surrounded Sessions", "Beginner to Advanced"],
    imageMain: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200",
    imageGrid1: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
    imageGrid2: "https://images.unsplash.com/photo-1593811167562-9cef47bffca4?auto=format&fit=crop&q=80&w=1200",
    profiles: [
      {
        id: 'valerie-detail',
        rubric: "ABOUT VALÉRIE",
        intro: "Valérie is a radiant, joyful, and epicurean soul. Based in Ibiza for over six years, her motto is to enjoy life in harmony with nature and share what inspires her: well-being in joy and simplicity. She discovered yoga in India twenty years ago and has since trained in multiple styles (Hatha, Vinyasa, Ashtanga). She offers profound guided meditations that facilitate a deep journey within and harmony with the soul.",
        cta: "Learn More"
      },
      {
        id: 'francesca-detail',
        rubric: "ABOUT FRANCESCA",
        intro: "Beyond yoga... A yoga teacher, therapist, therapeutic masseuse, Ayurvedic Pranic healer, breath and meditation coach who has taken the shamanic path. Her purpose is to help you reconnect with the true essence of your soul, overcome your fears, and guide you towards a new vision of life in total harmony with nature and beauty.",
        cta: "Learn More"
      }
    ]
  },
  cleaning: {
    badge: "Property Maintenance",
    title: "Cleaning & Upkeep",
    subtitle: "Enjoy a pristine, well-kept environment with The Key Ibiza. Our luxury cleaning and maintenance services ensure your villa and its exteriors always look impeccable—so you can relax and fully enjoy your stay on the island.",
    description: [
      "🧼 Complete Villa Cleaning & Upkeep: We provide professional, detail-oriented cleaning services adapted to your needs. From daily housekeeping to deep one-time cleans, our discreet and trustworthy staff uses high-end products to maintain the luxury standard of your residence.",
      "💦 Pool Cleaning Services – Sparkling & Safe: Our pool specialists ensure your swimming pool is always in perfect condition through regular water quality analysis, balanced chemical treatment, vacuuming, and deep filter inspections.",
      "🌿 Garden Maintenance – Year-Round Beauty: Our expert landscapers and gardeners keep your outdoor spaces lush and healthy. We handle pruning, irrigation system checks, and seasonal planting to enhance your villa's natural surroundings."
    ],
    features: [
        "Daily & Deep Cleaning", 
        "Pool Quality Analysis", 
        "Chemical Treatment", 
        "Lawn & Garden Care", 
        "Irrigation Maintenance", 
        "Discreet Staff", 
        "High-end Products", 
        "Filter Inspections"
    ],
    imageMain: "https://images.unsplash.com/photo-1581578731548-c64695cc6954?auto=format&fit=crop&q=80&w=1200",
    imageGrid1: "https://images.unsplash.com/photo-1562133567-b6a0a9c7e6eb?auto=format&fit=crop&q=80&w=800",
    imageGrid2: "https://images.unsplash.com/photo-1558904541-efa8c1965f1e?auto=format&fit=crop&q=80&w=800"
  },
  driver: {
    badge: "Mobility",
    title: "Luxury Chauffeur Services",
    subtitle: "Discover the Island in Style with The Key Ibiza. We redefine island transportation with a premium chauffeur service that blends luxury, discretion, and personalized attention.",
    description: [
      "🚘 Elite Vehicles. Exceptional Service: Travel in absolute comfort and style with our exclusive fleet of high-end vehicles — from sleek sedans to spacious SUVs and stylish vans for group travel. Each car is meticulously maintained, offering the highest standards of safety, elegance, and performance.",
      "👨‍✈️ Professional Chauffeurs: Our handpicked drivers provide a seamless experience, ensuring you’re always on time and well taken care of — whether you’re attending a wedding, hosting VIP guests, or exploring hidden island gems.",
      "⏱️ Flexible & Always Available: We know your plans may change — that’s why we offer 24/7 availability, allowing you to move freely and spontaneously. From sunrise beach drives to late-night events, we adapt to your pace and schedule."
    ],
    features: [
      "Airport Pickups & Drop-offs", 
      "All-day Chauffeur Availability", 
      "Private Ibiza & Formentera Tours", 
      "Nightlife & VIP Club Transfers", 
      "Business & Event Transportation",
      "Professional & Handpicked Drivers",
      "Elite SUV & Sedan Fleet",
      "24/7 Spontaneous Availability"
    ],
    imageMain: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1200",
    imageGrid1: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800",
    imageGrid2: "https://images.unsplash.com/photo-1551522435-a13afa10f103?auto=format&fit=crop&q=80&w=800"
  },
  deliveries: {
    badge: "Convenience",
    title: "Premium Delivery Services",
    subtitle: "Comfort Delivered by The Key Ibiza. Experience seamless luxury and total convenience during your stay on the island with our exclusive personalized delivery services.",
    description: [
      "🛒 Daily Comfort, Elevated: Your vacation is meant for relaxation, not errands. We offer a tailor-made delivery experience covering everything from daily essentials and fresh local produce to specialty international products, ensuring your pantry is always stocked to your preference.",
      "🍽️ Curated by Experts, Delivered with Care: We work with a hand-picked network of trusted local partners—organic farms, artisanal shops, and Ibiza’s finest restaurants. Every item is carefully selected and delivered with precision, discretion, and VIP-level reliability.",
      "✨ From Pantry to Private Chef — It’s All Possible: Whether you are stocking the villa before arrival, surprising a guest with a luxury gift, or craving a gourmet meal prepared by top chefs, we bring the best of the island directly to your doorstep."
    ],
    features: [
      "Fresh Local Produce", 
      "Gourmet Chef Meals", 
      "Specialty & International Items", 
      "Luxury Goods & Gifts", 
      "Villa Pre-stocking", 
      "VIP Coordination", 
      "100% Discretion", 
      "Artisanal Shop Sourcing"
    ],
    imageMain: "https://images.unsplash.com/photo-1520038410233-7141f77e47aa?auto=format&fit=crop&q=80&w=1200",
    imageGrid1: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=800",
    imageGrid2: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?auto=format&fit=crop&q=80&w=1200"
  },
  babysitting: {
    badge: "Family",
    title: "Luxury Babysitting Services",
    subtitle: "Peace of Mind for You, Joy for Your Children. At The Key Ibiza, we provide high-end babysitting services, allowing you to fully enjoy your holiday while ensuring your children are safe, happy, and entertained.",
    description: [
      "At The Key Ibiza, we know that traveling with children requires special care and flexibility. Whether you’re planning a romantic dinner, attending a private event, or simply craving a quiet moment, our luxury childcare services are tailored to your lifestyle.",
      "Our trusted and experienced babysitters are carefully selected for their qualifications and kindness. Fluent in multiple languages and passionate about working with children, they are trained to provide age-appropriate, fun, and educational activities.",
      "We are committed to creating a safe and stimulating environment, matching families with the ideal sitter for their needs. We deliver a discreet and flexible service, whether for a few hours or full days, ensuring your little ones are in excellent hands."
    ],
    features: [
        "Vetted & Qualified Sitters", 
        "Multilingual Caregivers", 
        "Age-appropriate Activities", 
        "Discreet & Flexible Service", 
        "Safe & Stimulating Environment", 
        "Romantic Dinner Support", 
        "Private Event Childcare", 
        "Full-day or Hourly Support"
    ],
    imageMain: "https://images.unsplash.com/photo-1587532939404-9aa3c1f82d1f?auto=format&fit=crop&q=80&w=1200",
    imageGrid1: "https://images.unsplash.com/photo-1510154221590-ff63e90a136f?auto=format&fit=crop&q=80&w=800",
    imageGrid2: "https://images.unsplash.com/photo-1536640712247-c575393a86c9?auto=format&fit=crop&q=80&w=1200"
  }
};

const ServiceDetail: React.FC<ServiceDetailProps> = ({ serviceId, onNavigate, lang }) => {
  const data = SERVICE_DATA[serviceId];

  // Contact modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', details: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceId]);

  // Get service-specific question
  const serviceQuestion = SERVICE_QUESTIONS[serviceId] || {
    label: "Tell us more about your request",
    placeholder: "Please describe what you're looking for..."
  };

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Required';
    if (!formData.email.trim()) errors.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email';
    if (!formData.phone.trim()) errors.phone = 'Required';
    return errors;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormStatus('submitting');

    const formPayload = new FormData();
    formPayload.append('name', formData.name);
    formPayload.append('email', formData.email);
    formPayload.append('phone', formData.phone);
    formPayload.append('service', data.title);
    formPayload.append('details', formData.details || 'No details provided');
    formPayload.append('_subject', `Service Inquiry: ${data.title} – The Key Ibiza`);
    formPayload.append('_captcha', 'false');
    formPayload.append('_template', 'table');

    try {
      const response = await fetch('https://formsubmit.co/ajax/hello@thekey-ibiza.com', {
        method: 'POST',
        body: formPayload,
      });
      const result = await response.json();
      if (result.success) {
        setFormStatus('success');
        setFormData({ name: '', email: '', phone: '', details: '' });
      } else {
        throw new Error('Failed');
      }
    } catch {
      // Fallback to mailto
      const subject = encodeURIComponent(`Service Inquiry: ${data.title}`);
      const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nService: ${data.title}\nDetails: ${formData.details || 'None'}`);
      window.open(`mailto:hello@thekey-ibiza.com?subject=${subject}&body=${body}`, '_blank');
      setFormStatus('success');
    }
  };

  if (!data) return <div className="pt-40 text-center">Service not found</div>;

  return (
    <div className="pt-40 pb-24">
      <div className="container mx-auto px-6">
        <button 
          onClick={() => onNavigate('services')}
          className="flex items-center space-x-3 text-white/40 hover:text-luxury-gold transition-colors mb-20 uppercase tracking-widest text-[10px] font-bold"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          <span>Back to Services</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <div className="space-y-16 animate-slide-up">
            <div className="space-y-8">
              <span className="text-luxury-gold uppercase tracking-[0.5em] text-xs font-bold block">{data.badge}</span>
              <h1 className="text-5xl md:text-8xl font-serif text-white leading-tight">
                {serviceId === 'furniture' ? (
                  <a
                    href="https://www.lavillagardendesign.com/es/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-luxury-gold transition-colors cursor-pointer"
                  >
                    {data.title}
                  </a>
                ) : (
                  data.title
                )}
              </h1>
              <p className="text-2xl md:text-3xl font-serif italic text-white/80 leading-relaxed">
                {data.subtitle}
              </p>
            </div>

            <div className="space-y-8 text-white/60 text-lg font-light leading-relaxed text-justify">
              {data.description.map((paragraph: string, idx: number) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Profiles (Valérie, Francesca, etc.) - Placed AFTER the main text */}
            {data.profiles && data.profiles.map((profile: any, pIdx: number) => (
               <div key={profile.id} className="bg-luxury-gold/5 border-l-2 border-luxury-gold p-10 rounded-r-[32px] space-y-6 animate-fade-in" style={{ animationDelay: `${pIdx * 200}ms` }}>
                  <h4 className="text-luxury-gold uppercase tracking-[0.3em] text-xs font-bold">{profile.rubric}</h4>
                  <p className="text-white/80 italic leading-relaxed text-lg text-justify">
                    {profile.intro}
                  </p>
                  <div className="pt-4">
                    <button 
                      onClick={() => onNavigate(profile.id)}
                      className="flex items-center space-x-3 text-luxury-gold hover:text-white transition-colors group"
                    >
                      <span className="uppercase tracking-widest text-[11px] font-bold">
                        {profile.cta}
                      </span>
                      <div className="w-8 h-px bg-luxury-gold group-hover:bg-white group-hover:w-16 transition-all duration-500"></div>
                    </button>
                  </div>
               </div>
            ))}

            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
              {data.features.map((feature: string, idx: number) => (
                <div key={idx} className="flex items-center space-x-4">
                  <div className="w-1.5 h-1.5 bg-luxury-gold rounded-full"></div>
                  <span className="text-white text-[10px] uppercase tracking-wider font-bold">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-10">
              <button
                onClick={() => setModalOpen(true)}
                className="bg-luxury-gold text-luxury-blue px-12 py-6 rounded-full font-bold border border-luxury-gold hover:bg-luxury-blue hover:text-luxury-gold transition-all shadow-2xl uppercase tracking-widest text-[11px]"
              >
                Inquire Now
              </button>
            </div>
          </div>

          <div className="space-y-8 animate-fade-in lg:sticky lg:top-40">
            <div className="aspect-[4/3] rounded-[60px] overflow-hidden shadow-2xl border border-white/5 relative group">
              <img 
                src={data.imageMain} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                alt={data.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-blue/50 to-transparent opacity-60"></div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="aspect-square rounded-[40px] overflow-hidden border border-white/5 group">
                <img src={data.imageGrid1} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="View 1" />
              </div>
              <div className="aspect-square rounded-[40px] overflow-hidden border border-white/5 group">
                <img src={data.imageGrid2} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="View 2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(11,28,38,0.95)' }}>
          <div
            className="relative w-full max-w-lg p-6 md:p-8 rounded-[24px] border border-white/10 max-h-[90vh] overflow-y-auto"
            style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' }}
          >
            <button
              onClick={() => { setModalOpen(false); setFormStatus('idle'); setFormErrors({}); }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            {formStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-luxury-gold/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="text-xl font-serif text-white mb-2">Request Sent</h3>
                <p className="text-white/60 text-sm">We'll contact you shortly about your inquiry.</p>
                <button
                  onClick={() => { setModalOpen(false); setFormStatus('idle'); }}
                  className="mt-6 px-6 py-2 rounded-full bg-luxury-gold/20 text-luxury-gold text-xs uppercase tracking-wider hover:bg-luxury-gold hover:text-luxury-blue transition-all"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <span className="text-luxury-gold/60 text-[10px] uppercase tracking-[0.2em] font-medium">{data.badge}</span>
                  <h3 className="text-xl md:text-2xl font-serif text-white mt-1">{data.title}</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.15em] text-white/40 block mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setFormErrors({ ...formErrors, name: '' }); }}
                      className={`w-full bg-white/5 border ${formErrors.name ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-luxury-gold transition-colors`}
                      placeholder="Your name"
                    />
                    {formErrors.name && <span className="text-red-400 text-xs mt-1">{formErrors.name}</span>}
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.15em] text-white/40 block mb-1.5">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setFormErrors({ ...formErrors, email: '' }); }}
                      className={`w-full bg-white/5 border ${formErrors.email ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-luxury-gold transition-colors`}
                      placeholder="your@email.com"
                    />
                    {formErrors.email && <span className="text-red-400 text-xs mt-1">{formErrors.email}</span>}
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.15em] text-white/40 block mb-1.5">Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); setFormErrors({ ...formErrors, phone: '' }); }}
                      className={`w-full bg-white/5 border ${formErrors.phone ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-luxury-gold transition-colors`}
                      placeholder="+34 600 000 000"
                    />
                    {formErrors.phone && <span className="text-red-400 text-xs mt-1">{formErrors.phone}</span>}
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.15em] text-white/40 block mb-1.5">{serviceQuestion.label}</label>
                    <textarea
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-luxury-gold transition-colors resize-none"
                      placeholder={serviceQuestion.placeholder}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full py-4 rounded-full bg-luxury-gold text-luxury-blue text-xs uppercase tracking-[0.2em] font-bold hover:bg-luxury-blue hover:text-luxury-gold border border-luxury-gold transition-all duration-500 disabled:opacity-50"
                  >
                    {formStatus === 'submitting' ? 'Sending...' : 'Send Inquiry'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetail;
