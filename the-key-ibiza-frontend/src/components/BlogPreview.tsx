import React, { useState, useEffect } from 'react';
import { Language } from '../types';

interface BlogPreviewProps {
  onNavigate: (view: string, slug?: string) => void;
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

const BACKEND_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5001'
  : 'https://the-key-ibiza-backend.vercel.app';

const BlogPreview: React.FC<BlogPreviewProps> = ({ onNavigate, lang }) => {
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/blog`);
        if (res.ok) {
          const data = await res.json();
          setArticles(data.slice(0, 3)); // Only show 3 latest
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
      setLoading(false);
    };
    fetchArticles();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <section className="py-16 md:py-20 lg:py-24" style={{ backgroundColor: '#0B1C26' }}>
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) return null;

  return (
    <section id="blog-preview" className="py-16 md:py-20 lg:py-24" style={{ backgroundColor: '#0B1C26' }}>
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="text-luxury-gold uppercase tracking-[0.6em] text-[10px] font-medium block mb-6">
            {lang === 'es' ? 'Magazine' : 'Magazine'}
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif mb-4 text-white">
            {lang === 'es' ? 'The Key Insights' : 'The Key Insights'}
          </h2>
          <p className="text-white/40 text-sm md:text-base font-light tracking-wide max-w-2xl mx-auto">
            {lang === 'es'
              ? 'Narrativas curadas sobre arquitectura, gastronomía y los hilos invisibles del lujo que definen la temporada de Ibiza.'
              : 'Curated narratives on island architecture, gastronomy, and the invisible threads of luxury that define the Ibiza season.'}
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-12">
          {articles.map((article) => (
            <article
              key={article.id}
              onClick={() => onNavigate('blog-article', article.slug)}
              className="group cursor-pointer"
            >
              {/* Image */}
              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 border border-white/5">
                <img
                  src={article.image_url || 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=800'}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-luxury-gold uppercase tracking-widest text-[10px] font-bold">
                    {article.category}
                  </span>
                  <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                  <span className="text-white/30 text-xs">
                    {formatDate(article.published_at)}
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-serif text-white group-hover:text-luxury-gold transition-colors leading-tight">
                  {article.title}
                </h3>

                <p className="text-white/50 text-sm leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button
            onClick={() => onNavigate('blog')}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-transparent text-luxury-gold text-[10px] uppercase tracking-[0.2em] font-bold border border-luxury-gold/30 hover:border-luxury-gold hover:bg-luxury-gold/5 transition-all"
          >
            {lang === 'es' ? 'Ver todos los artículos' : 'View All Articles'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
