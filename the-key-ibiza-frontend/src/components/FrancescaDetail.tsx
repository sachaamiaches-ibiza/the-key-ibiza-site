
import React, { useState } from 'react';
import { Language } from '../types';

interface FrancescaDetailProps {
  onNavigate: (view: any) => void;
  lang: Language;
}

const FrancescaDetail: React.FC<FrancescaDetailProps> = ({ onNavigate, lang }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', details: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

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

  const openContactModal = (service: string) => {
    setSelectedService(service);
    setModalOpen(true);
    setFormStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');

    const formPayload = new FormData();
    formPayload.append('name', formData.name);
    formPayload.append('email', formData.email);
    formPayload.append('phone', formData.phone);
    formPayload.append('service', `Francesca - ${selectedService}`);
    formPayload.append('details', formData.details || 'No details provided');
    formPayload.append('_subject', `Yoga & Wellness Inquiry: ${selectedService} – The Key Ibiza`);
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
        setTimeout(() => {
          setModalOpen(false);
          setFormStatus('idle');
        }, 3000);
      } else {
        throw new Error('Failed');
      }
    } catch {
      const subject = encodeURIComponent(`Yoga & Wellness Inquiry: ${selectedService}`);
      const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nService: ${selectedService}\nDetails: ${formData.details || 'None'}`);
      window.open(`mailto:hello@thekey-ibiza.com?subject=${subject}&body=${body}`, '_blank');
      setFormStatus('success');
    }
  };

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
          {/* Text content - with higher z-index */}
          <div className="space-y-12 animate-slide-up relative z-10">
            <div className="space-y-6">
              <span className="text-luxury-gold uppercase tracking-[0.5em] text-xs font-bold block">Healer & Coach</span>
              <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif text-white leading-tight">ABOUT <br/><span className="italic text-white/40">FRANCESCA.</span></h1>
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

          {/* Image - lower z-index */}
          <div className="aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl border border-white/5 relative group animate-fade-in z-0 lg:mt-20">
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
                  onClick={() => openContactModal(section.title)}
                  className="bg-luxury-gold text-luxury-blue px-8 py-3.5 rounded-full font-bold uppercase tracking-widest text-[10px] border border-luxury-gold hover:bg-luxury-blue hover:text-luxury-gold transition-all w-full md:w-auto"
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
            onClick={() => openContactModal('General Wellness')}
            className="inline-block border border-white/30 text-white px-12 py-5 rounded-full hover:bg-luxury-gold hover:text-white transition-all uppercase tracking-widest text-xs font-bold"
          >
            Contact Francesca
          </button>
        </div>
      </div>

      {/* Contact Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100001] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-gradient-to-br from-[#0B1C26] to-[#0a1419] rounded-3xl border border-luxury-gold/20 shadow-2xl overflow-hidden animate-fadeIn max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-luxury-gold transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="px-8 pt-8 pb-4">
              <span className="text-luxury-gold uppercase tracking-[0.3em] text-[10px] font-bold block mb-2">Yoga & Wellness</span>
              <h2 className="text-2xl md:text-3xl font-serif text-white mb-2">Book {selectedService}</h2>
              <p className="text-white/50 text-sm">Fill in your details and we'll get back to you shortly.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-4">
              {formStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-white text-lg font-serif">Request Sent!</p>
                  <p className="text-white/50 text-sm mt-2">Francesca will contact you soon.</p>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Your name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-luxury-gold/50 transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Email address *"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-luxury-gold/50 transition-colors"
                  />
                  <input
                    type="tel"
                    placeholder="Phone number *"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-luxury-gold/50 transition-colors"
                  />
                  <textarea
                    placeholder="Tell us about your wellness goals, preferred schedule, experience level..."
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-luxury-gold/50 transition-colors resize-none"
                  />
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full bg-gradient-to-r from-luxury-gold to-amber-500 text-luxury-blue font-semibold py-3.5 rounded-xl hover:from-amber-500 hover:to-luxury-gold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {formStatus === 'submitting' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-luxury-blue/30 border-t-luxury-blue rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Request
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrancescaDetail;
