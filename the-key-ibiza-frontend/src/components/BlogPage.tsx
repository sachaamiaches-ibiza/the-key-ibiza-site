
import React, { useState, useEffect } from 'react';
import { Language } from '../types';

interface BlogPageProps {
  onNavigate: (view: any) => void;
  lang: Language;
}

interface BlogPost {
  id: number;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image_url: string;
  author: string;
  published_at: string;
}

// Auto-detect environment
const BACKEND_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5001'
  : 'https://the-key-ibiza-backend.vercel.app';

const BlogPage: React.FC<BlogPageProps> = ({ onNavigate, lang }) => {
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique categories from articles
  const categories = Array.from(new Set(articles.map(a => a.category).filter(Boolean)));

  // Filter articles by selected category
  const filteredArticles = selectedCategory
    ? articles.filter(a => a.category === selectedCategory)
    : articles;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/blog`);
        if (res.ok) {
          const data = await res.json();
          setArticles(data);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
      setLoading(false);
    };
    fetchArticles();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="pt-40 pb-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mb-24 animate-slide-up">
          <span className="text-luxury-gold uppercase tracking-[0.5em] text-xs font-bold block mb-6">Magazine</span>
          <h1 className="text-5xl md:text-7xl font-serif text-white leading-tight mb-8">
            The Key <span className="italic text-white/50">Insights.</span>
          </h1>
          <p className="text-xl text-white/40 font-light max-w-2xl leading-relaxed">
            Curated narratives on island architecture, gastronomy, and the invisible threads of luxury that define the Ibiza season.
          </p>
        </div>

        {/* Category Filter Bubbles */}
        {!loading && categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-16">
            {/* All Categories Button */}
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-3 rounded-full text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 ${
                selectedCategory === null
                  ? 'bg-luxury-gold text-luxury-blue border border-luxury-gold'
                  : 'bg-transparent text-white/60 border border-white/20 hover:border-luxury-gold/50 hover:text-luxury-gold'
              }`}
            >
              All
            </button>
            {/* Category Buttons */}
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-luxury-gold text-luxury-blue border border-luxury-gold'
                    : 'bg-transparent text-white/60 border border-white/20 hover:border-luxury-gold/50 hover:text-luxury-gold'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/40 text-sm">Loading articles...</p>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="group cursor-pointer"
                onClick={() => onNavigate(`blog-${article.slug}`)}
              >
                <div className="aspect-[16/9] rounded-[40px] overflow-hidden mb-10 border border-white/5">
                  <img
                    src={article.image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200'}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    alt={article.title}
                  />
                </div>
                <span className="text-luxury-gold uppercase tracking-widest text-[10px] font-bold block mb-4">{article.category}</span>
                <h2 className="text-3xl md:text-4xl font-serif text-white mb-6 group-hover:text-luxury-gold transition-colors">{article.title}</h2>
                <p className="text-white/50 font-light text-lg mb-8 leading-relaxed">{article.excerpt}</p>
                <div className="flex items-center space-x-4">
                   <div className="w-8 h-px bg-white/20"></div>
                   <span className="text-[10px] uppercase tracking-widest text-white/30">{formatDate(article.published_at)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          /* No articles for selected category */
          <div className="text-center py-20 mb-32">
            <p className="text-white/40 text-lg mb-6">No articles found in this category.</p>
            <button
              onClick={() => setSelectedCategory(null)}
              className="px-8 py-3 rounded-full bg-luxury-gold text-luxury-blue text-xs uppercase tracking-wider font-medium hover:bg-luxury-blue hover:text-luxury-gold border border-luxury-gold transition-all"
            >
              View All Articles
            </button>
          </div>
        ) : (
          /* No articles at all - Coming Soon */
          <div className="luxury-card rounded-[60px] p-20 text-center border border-luxury-gold/20 mb-32">
            <h3 className="text-3xl md:text-5xl font-serif text-white mb-8 italic">Coming Soon</h3>
            <p className="text-white/40 text-lg mb-12 max-w-xl mx-auto font-light">
              Our exclusive digital magazine is currently being curated. Join our waitlist to receive the first edition.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
               <input
                 type="email"
                 placeholder="Your e-mail address"
                 className="bg-transparent border border-white/10 rounded-full px-10 py-5 text-white focus:outline-none focus:border-luxury-gold transition-colors w-full md:w-96"
               />
               <button className="bg-luxury-gold text-luxury-blue px-12 py-5 rounded-full font-bold uppercase tracking-widest text-xs border border-luxury-gold hover:bg-luxury-blue hover:text-luxury-gold transition-all shadow-xl">
                 Subscribe
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
