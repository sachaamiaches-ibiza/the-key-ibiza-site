
import React from 'react';
import { Language } from '../types';

// Add lang to the props interface
interface FrancescaDetailProps {
  onNavigate: (view: any) => void;
  lang: Language;
}

const FrancescaDetail: React.FC<FrancescaDetailProps> = ({ onNavigate, lang }) => {
  const sections = [
    {
      title: "Yoga",
      subtitle: "Holistic and yóguic approach",
      desc: "My approach to yoga is holistic and has evolved over the years as my yogic path progressed. I began my practice with Anusara Yoga, then briefly focused on Ashtanga before diving into Vinyasa Yoga. During my first trip to India, everything changed: my ideas, my attitude, and my approach to yoga. I have explored different styles, focusing on Kundalini breath and Pranayama to better understand how to channel our vital energy and awaken the Kundalini (our sexual nerve energy).",
      cta: "Book Now"
    },
    {
      title: "Ayurveda",
      subtitle: "Eliminating impurities and restoring harmony",
      desc: "Ayurvedic treatments include a special diet, herbal remedies, massage therapy, yoga, meditation, a daily routine, detoxification treatments, and a deep cleansing of body and mind. Each person is different and has a unique constitution (Prakruti: Vata, Pitta, Kapha) based on the five elements (air, ether, fire, water, earth), so each treatment is fully personalized, with the same objective: eliminate impurities, reduce symptoms, stimulate the system, alleviate anxiety, and increase harmony.",
      cta: "Book Now"
    },
    {
      title: "Retreats",
      subtitle: "Returning to your pure and wild essence",
      desc: "Our mission is to offer you an interior life experience that leads to an intimate union with a different and superior reality—a union with the Divine—where you will feel out of your comfort zone, yet comfortable, because you are welcome and supported in your individual path. Everyone is welcome; no previous experience is required.",
      cta: "Book Now"
    },
    {
      title: "Corporate",
      subtitle: "Personalized events and retreat programs",
      desc: "We offer personalized events designed specifically to meet the needs of each company. My experience as an entrepreneur allows me to support both large and small companies, offering various options to bring harmony, awareness, and happiness to their lives and workplaces. Experiential learning is the most effective way to approach change, working on three levels: mental, physical, and emotional.",
      cta: "Book Now"
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
              <span className="text-luxury-gold uppercase tracking-[0.5em] text-xs font-bold block">Healer & Coach</span>
              <h1 className="text-6xl md:text-9xl font-serif text-white leading-tight">ABOUT <br/><span className="italic text-white/40">FRANCESCA.</span></h1>
            </div>
            
            <div className="space-y-8 text-xl font-light text-white/70 leading-relaxed text-justify">
              <p className="text-luxury-gold italic text-2xl font-serif">"Beyond yoga..."</p>
              <p>
                Yoga teacher, therapist, therapeutic masseuse, Ayurvedic Pranic healer, breath and meditation coach, who has taken the shamanic path, certifying as a Shamanic Yoga teacher and continues training as a spiritual advisor, imaginative family constellation facilitator, and past life regression facilitator.
              </p>
              <p>
                I use all the tools I have learned throughout my long journey to care for your physical, mental, and emotional well-being. My soul's purpose (my Dharma) is to care for you and help you reconnect with the true essence of your soul, overcome your fears and limitations, and guide you towards a new vision of life in total harmony with nature and beauty.
              </p>
              <p className="border-l-2 border-luxury-gold pl-8 py-4 italic text-white/90">
                With me, you can simply practice yoga or receive a regenerating massage, but also decide to undertake a path of great change and transformation, becoming the co-creator of your destiny.
              </p>
            </div>
          </div>
          
          <div className="aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl border border-white/5 relative group animate-fade-in">
             <img 
               src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200" 
               className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
               alt="Francesca Yoga"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-luxury-blue/40 to-transparent"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {sections.map((section, idx) => (
            <div 
              key={idx} 
              className="luxury-card p-12 rounded-[60px] border border-white/5 flex flex-col justify-between space-y-8 animate-slide-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="space-y-6">
                <h3 className="text-3xl font-serif text-white">{section.title}</h3>
                <h4 className="text-luxury-gold/60 italic font-serif text-xl">{section.subtitle}</h4>
                <p className="text-white/50 text-base leading-relaxed text-justify">
                  {section.desc}
                </p>
              </div>
              
              <div className="pt-6 border-t border-white/5">
                <button 
                  onClick={() => {
                    const el = document.getElementById('contact');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-luxury-gold text-luxury-blue px-8 py-3.5 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-white transition-all w-full md:w-auto"
                >
                  {section.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-32 text-center max-w-2xl mx-auto space-y-12">
          <div className="w-20 h-px bg-luxury-gold mx-auto"></div>
          <h2 className="text-4xl font-serif italic text-white">Co-create your destiny.</h2>
          <p className="text-white/40 font-light">
            Experiential learning is the most effective way to approach change. I will guide you on a therapeutic, spiritual, and educational path.
          </p>
          <button 
            onClick={() => {
              const el = document.getElementById('contact');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-block border border-white/30 text-white px-12 py-5 rounded-full hover:bg-luxury-gold hover:text-white transition-all uppercase tracking-widest text-xs font-bold"
          >
            Contact Francesca
          </button>
        </div>
      </div>
    </div>
  );
};

export default FrancescaDetail;
