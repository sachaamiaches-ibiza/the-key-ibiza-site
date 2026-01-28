
import React from 'react';
import { Language } from '../types';

// Add lang to the props interface
interface ValerieDetailProps {
  onNavigate: (view: any) => void;
  lang: Language;
}

const ValerieDetail: React.FC<ValerieDetailProps> = ({ onNavigate, lang }) => {
  const services = [
    {
      title: "Yoga",
      duration: "1 hour 30 minutes",
      subtitle: "Intuitive yoga suitable for all levels",
      desc: "The session begins with breathing exercises and a short meditation to connect with your inner self. This is followed by fluid sun salutations with variations. Postures are practiced to improve alignment, strength, and focus, helping to quiet the mind. The session concludes with a guided meditation to release physical and mental tension.",
      footer: "Valérie's yoga is deep and works the whole being. A moment of well-being accessible to all."
    },
    {
      title: "Half-day Retreat",
      duration: "Approximately 4 hours",
      subtitle: "Absolute well-being immersed in nature",
      desc: "Valérie will guide you through a half-day of absolute well-being. A walk will lead you to mystical and hidden corners of the island. There, you will enjoy an hour and a half of yoga with powerful energy. Guided meditation in harmony with the forces of nature. A rejuvenating journey to disconnect and dive within in a dreamlike setting. Includes a swim in crystal clear waters and an optional picnic.",
      footer: "A perfect way to combine well-being with island exploration."
    },
    {
      title: "Group Harmonization",
      duration: "Approximately 1 hour",
      subtitle: "Energy rebalancing with sound and voice",
      desc: "Valérie performs a sage cleansing after you lie down and guides you with her voice and drum. It helps release stress, clearing your mind of heavy burdens. It places you in a state of luminous energy, rebalancing your chakras and programming your being for joy, beauty, and peace, ensuring a restorative holiday.",
      footer: "Programming for success and deep well-being."
    },
    {
      title: "Individualized Attention",
      duration: "Approximately 1 hour 30 minutes",
      subtitle: "Deep healing and spiritual reconnection",
      desc: "Take advantage of your holidays to nourish yourself and advance on your life path by releasing traumatic cellular memories and reconnecting with your soul. This deep yet gentle energetic work allows you to resume life with renewed energy. Sage cleansing, intuitive and personalized energy healing, percussion... everything is tailored to you: clearing, harmonization, transgenerational release.",
      footer: "A deep reset for your life's purpose."
    }
  ];

  return (
    <div className="pt-40 pb-24">
      <div className="container mx-auto px-6">
        <button 
          onClick={() => onNavigate('service-yoga')}
          className="flex items-center space-x-3 text-white/40 hover:text-luxury-gold transition-colors mb-20 uppercase tracking-widest text-[10px] font-bold"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          <span>Back to Yoga</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32 items-start">
          <div className="space-y-12 animate-slide-up">
            <div className="space-y-6">
              <span className="text-luxury-gold uppercase tracking-[0.5em] text-xs font-bold block">Holistic Guide</span>
              <h1 className="text-6xl md:text-9xl font-serif text-white leading-tight">ABOUT <br/><span className="italic text-white/40">VALÉRIE.</span></h1>
            </div>
            
            <div className="space-y-8 text-xl font-light text-white/70 leading-relaxed text-justify">
              <p>
                Valérie is a radiant, joyful, and epicurean person. She has lived in Ibiza for over six years and her motto is to enjoy life in harmony with nature and share what inspires her: well-being in joy and simplicity.
              </p>
              <p>
                She discovered yoga in India twenty years ago and has since trained in all styles (Hatha, Vinyasa, Ashtanga). For several years, she has also been conscious of a gift for healing. She offers beautiful guided meditations that allow for a deep journey into oneself and in harmony with the soul.
              </p>
              <p className="border-l-2 border-luxury-gold pl-8 py-4 italic text-white/90">
                She offers energy balancing sessions to help you release stress and accumulated negative energy, allowing you to fully enjoy your holidays. This is especially beneficial at the start of your stay.
              </p>
            </div>
          </div>
          
          <div className="aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl border border-white/5 relative group animate-fade-in">
             <img 
               src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200" 
               className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
               alt="Valérie Yoga"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-luxury-blue/40 to-transparent"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {services.map((service, idx) => (
            <div 
              key={idx} 
              className="luxury-card p-12 rounded-[60px] border border-white/5 flex flex-col justify-between space-y-8 animate-slide-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-3xl font-serif text-white">{service.title}</h3>
                  <span className="text-[9px] uppercase tracking-[0.3em] text-luxury-gold font-bold bg-white/5 px-4 py-1.5 rounded-full border border-luxury-gold/20">
                    {service.duration}
                  </span>
                </div>
                <h4 className="text-luxury-gold/60 italic font-serif text-xl">{service.subtitle}</h4>
                <p className="text-white/50 text-base leading-relaxed text-justify">
                  {service.desc}
                </p>
              </div>
              
              <div className="pt-6 border-t border-white/5 space-y-6">
                <p className="text-white/40 text-xs italic">{service.footer}</p>
                <button 
                  onClick={() => {
                    const el = document.getElementById('contact');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-luxury-gold text-luxury-blue px-8 py-3.5 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-white transition-all w-full md:w-auto"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-32 text-center max-w-2xl mx-auto space-y-12">
          <div className="w-20 h-px bg-luxury-gold mx-auto"></div>
          <h2 className="text-4xl font-serif italic text-white">A profound reset.</h2>
          <p className="text-white/40 font-light">
            Individual energy healing sessions are ideal if you want to use your holidays to go deeper within, reconnect with your soul, and align with your purpose.
          </p>
          <button 
            onClick={() => {
              const el = document.getElementById('contact');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-block border border-white/30 text-white px-12 py-5 rounded-full hover:bg-luxury-gold hover:text-white transition-all uppercase tracking-widest text-xs font-bold"
          >
            Contact Valérie
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValerieDetail;
