
import React, { useState } from 'react';
import { Language } from '../types';

// Add lang to the props interface
interface PhotographerPageProps {
  onNavigate: (view: any) => void;
  lang: Language;
}

const PhotographerPage: React.FC<PhotographerPageProps> = ({ onNavigate, lang }) => {
  // Contact modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', details: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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
    formPayload.append('service', 'Professional Photographer');
    formPayload.append('details', formData.details || 'No details provided');
    formPayload.append('_subject', 'Photo Session Inquiry – The Key Ibiza');
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
      const subject = encodeURIComponent('Photo Session Inquiry');
      const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nDetails: ${formData.details || 'None'}`);
      window.open(`mailto:hello@thekey-ibiza.com?subject=${subject}&body=${body}`, '_blank');
      setFormStatus('success');
    }
  };

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
                onClick={() => setModalOpen(true)}
                className="bg-luxury-gold text-luxury-blue px-12 py-6 rounded-full font-bold border border-luxury-gold hover:bg-luxury-blue hover:text-luxury-gold transition-all shadow-2xl uppercase tracking-widest text-xs"
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
                <p className="text-white/60 text-sm">We'll contact you shortly to discuss your session.</p>
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
                  <span className="text-luxury-gold/60 text-[10px] uppercase tracking-[0.2em] font-medium">Art & Lifestyle</span>
                  <h3 className="text-xl md:text-2xl font-serif text-white mt-1">Book a Photo Session</h3>
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
                    <label className="text-[10px] uppercase tracking-[0.15em] text-white/40 block mb-1.5">What type of photo session do you need?</label>
                    <textarea
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-luxury-gold transition-colors resize-none"
                      placeholder="Style of shoot, location, number of people, occasion..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full py-4 rounded-full bg-luxury-gold text-luxury-blue text-xs uppercase tracking-[0.2em] font-bold hover:bg-luxury-blue hover:text-luxury-gold border border-luxury-gold transition-all duration-500 disabled:opacity-50"
                  >
                    {formStatus === 'submitting' ? 'Sending...' : 'Send Request'}
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

export default PhotographerPage;
