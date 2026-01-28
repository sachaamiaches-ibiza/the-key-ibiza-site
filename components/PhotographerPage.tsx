
import React from 'react';
import { Language } from '../types';

// Add lang to the props interface
interface PhotographerPageProps {
  onNavigate: (view: any) => void;
  lang: Language;
}

const PhotographerPage: React.FC<PhotographerPageProps> = ({ onNavigate, lang }) => {
  return (
    <div className="pt-40 pb-24">
      <div className="container mx-auto px-6">
        {/* Breadcrumb */}
        <button 
          onClick={() => onNavigate('services')}
          className="flex items-center space-x-3 text-white/40 hover:text-luxury-gold transition-colors mb-20 uppercase tracking-widest text-[10px] font-bold"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          <span>Back to Services</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          {/* Text Content */}
          <div className="space-y-16 animate-slide-up">
            <div className="space-y-8">
              <span className="text-luxury-gold uppercase tracking-[0.5em] text-xs font-bold block">Art & Lifestyle</span>
              <h1 className="text-5xl md:text-8xl font-serif text-white leading-tight">About Our Photographer...</h1>
              <p className="text-2xl md:text-3xl font-serif italic text-white/80 leading-relaxed">
                Capturing the Essence of Ibiza with <span className="text-luxury-gold">Tamas Kooning Lansbergen</span>.
              </p>
            </div>

            <div className="space-y-10 text-white/60 text-lg font-light leading-relaxed text-justify">
              <p>
                Meet Tamas Kooning Lansbergen, a talented Dutch photographer who has been based in Ibiza since 2002. With over two decades of experience behind the lens, Tamas has become one of the island’s most sought-after names in wedding and lifestyle photography.
              </p>
              
              <div className="p-10 bg-luxury-gray/10 rounded-[40px] border-l-4 border-luxury-gold">
                <h4 className="text-white font-serif text-2xl mb-4">A Passionate Visual Storyteller</h4>
                <p>
                  Specializing in intimate weddings, family portraits, and lifestyle shoots, Tamas has a natural ability to capture emotion, light, and the breathtaking backdrops of Ibiza. His photographs reflect not only technical skill, but a deep connection to the island and its unique energy.
                </p>
              </div>

              <div className="space-y-6">
                <h4 className="text-white font-serif text-2xl">A Trusted Partner in Luxury</h4>
                <p>
                  Beyond private clients, Tamas regularly collaborates with prestigious luxury magazines, showcasing the beauty of Ibiza and Formentera through his refined and artistic style. His work is a harmonious blend of elegance, authenticity, and creativity.
                </p>
              </div>

              <p className="text-white font-medium italic">
                Entrust your most cherished memories to a master photographer. Let the magic of Ibiza live forever through his lens.
              </p>
            </div>

            <div className="pt-10">
              <button 
                onClick={() => {
                  const el = document.getElementById('contact');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white text-luxury-blue px-12 py-6 rounded-full font-bold text-xl hover:bg-luxury-gold hover:text-white transition-all shadow-2xl uppercase tracking-widest text-xs"
              >
                Book a Session
              </button>
            </div>
          </div>

          {/* Visual Content */}
          <div className="sticky top-40 space-y-8 animate-fade-in">
            <div className="aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl border border-white/5 relative group">
              <img 
                src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&q=80&w=1200" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                alt="Photography Art"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-blue/40 to-transparent"></div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="aspect-square rounded-[40px] overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Wedding" />
              </div>
              <div className="aspect-square rounded-[40px] overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Lifestyle" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotographerPage;
