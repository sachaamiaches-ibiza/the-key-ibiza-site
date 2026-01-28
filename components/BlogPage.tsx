
import React from 'react';
import { Language } from '../types';

// Add lang to the props interface
interface BlogPageProps {
  onNavigate: (view: any) => void;
  lang: Language;
}

const BlogPage: React.FC<BlogPageProps> = ({ onNavigate, lang }) => {
  const articles = [
    {
      id: 1,
      category: "Architecture",
      title: "The Silent Geometry of Es Vedrà Houses",
      excerpt: "Exploring the minimalism of island-inspired modernist retreats that blend into the rocky landscape.",
      img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200",
      date: "Spring 2026"
    },
    {
      id: 2,
      category: "Lifestyle",
      title: "Midnight at Lio: Beyond the Red Curtain",
      excerpt: "A behind-the-scenes look at the world's most sophisticated cabaret experience and the secrets of the VIP table.",
      img: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&q=80&w=1200",
      date: "May 2026"
    }
  ];

  return (
    <div className="pt-40 pb-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mb-24 animate-slide-up">
          <span className="text-luxury-gold uppercase tracking-[0.5em] text-xs font-bold block mb-6">Magazine</span>
          <h1 className="text-6xl md:text-9xl font-serif text-white leading-tight mb-8">
            The Key <br/> <span className="italic text-white/50">Insights.</span>
          </h1>
          <p className="text-xl text-white/40 font-light max-w-2xl leading-relaxed">
            Curated narratives on island architecture, gastronomy, and the invisible threads of luxury that define the Ibiza season.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
          {articles.map((article) => (
            <div key={article.id} className="group cursor-pointer">
              <div className="aspect-[16/9] rounded-[40px] overflow-hidden mb-10 border border-white/5">
                <img src={article.img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="" />
              </div>
              <span className="text-luxury-gold uppercase tracking-widest text-[10px] font-bold block mb-4">{article.category}</span>
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6 group-hover:text-luxury-gold transition-colors">{article.title}</h2>
              <p className="text-white/50 font-light text-lg mb-8 leading-relaxed">{article.excerpt}</p>
              <div className="flex items-center space-x-4">
                 <div className="w-8 h-px bg-white/20"></div>
                 <span className="text-[10px] uppercase tracking-widest text-white/30">{article.date}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="luxury-card rounded-[60px] p-20 text-center border border-luxury-gold/20">
          <h3 className="text-3xl md:text-5xl font-serif text-white mb-8 italic">Coming June 2026</h3>
          <p className="text-white/40 text-lg mb-12 max-w-xl mx-auto font-light">
            Our exclusive digital magazine is currently being curated. Join our waitlist to receive the first edition.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
             <input 
               type="email" 
               placeholder="Your e-mail address" 
               className="bg-transparent border border-white/10 rounded-full px-10 py-5 text-white focus:outline-none focus:border-luxury-gold transition-colors w-full md:w-96"
             />
             <button className="bg-luxury-gold text-luxury-blue px-12 py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white transition-all shadow-xl">
               Subscribe
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
