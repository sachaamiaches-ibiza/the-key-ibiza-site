
import React, { useState, useEffect } from 'react';
import { Language } from '../types';

interface BlogArticlePageProps {
  slug: string;
  onNavigate: (view: any) => void;
  lang: Language;
}

interface BlogPost {
  id: number;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  author: string;
  published_at: string;
}

// Auto-detect environment
const BACKEND_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5001'
  : 'https://the-key-ibiza-backend.vercel.app';

const BlogArticlePage: React.FC<BlogArticlePageProps> = ({ slug, onNavigate, lang }) => {
  const [article, setArticle] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/blog/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setArticle(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError(true);
      }
      setLoading(false);
    };
    fetchArticle();
    window.scrollTo(0, 0);
  }, [slug]);

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Parse content into paragraphs
  const renderContent = (content: string) => {
    if (!content) return null;
    return content.split('\n\n').map((paragraph, idx) => (
      <p key={idx} className="text-white/70 text-lg leading-relaxed mb-6">
        {paragraph}
      </p>
    ));
  };

  if (loading) {
    return (
      <div className="pt-40 pb-24 min-h-screen">
        <div className="container mx-auto px-6">
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/40 text-sm">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="pt-40 pb-24 min-h-screen">
        <div className="container mx-auto px-6">
          <div className="text-center py-20">
            <h2 className="text-4xl font-serif text-white mb-4">Article Not Found</h2>
            <p className="text-white/40 mb-8">The article you're looking for doesn't exist.</p>
            <button
              onClick={() => onNavigate('blog')}
              className="px-8 py-3 rounded-full bg-luxury-gold text-luxury-blue text-sm uppercase tracking-wider font-medium hover:bg-luxury-blue hover:text-luxury-gold border border-luxury-gold transition-all"
            >
              Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-24">
      <div className="container mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('blog')}
          className="flex items-center space-x-3 text-white/40 hover:text-luxury-gold transition-colors mb-12 uppercase tracking-widest text-[10px] font-bold"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span>Back to Blog</span>
        </button>

        {/* Article Header */}
        <div className="max-w-4xl mx-auto mb-16">
          <span className="text-luxury-gold uppercase tracking-widest text-[10px] font-bold block mb-6">
            {article.category}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-tight mb-8">
            {article.title}
          </h1>
          <div className="flex items-center space-x-6 text-white/40 text-sm">
            {article.author && (
              <>
                <span>By {article.author}</span>
                <span className="w-1 h-1 bg-white/20 rounded-full"></span>
              </>
            )}
            <span>{formatDate(article.published_at)}</span>
          </div>
        </div>

        {/* Featured Image */}
        {article.image_url && (
          <div className="max-w-5xl mx-auto mb-16">
            <div className="aspect-[16/9] rounded-[40px] overflow-hidden border border-white/5">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="max-w-3xl mx-auto">
          {article.excerpt && (
            <p className="text-2xl text-white/80 font-light leading-relaxed mb-12 italic border-l-2 border-luxury-gold pl-6">
              {article.excerpt}
            </p>
          )}

          <div className="prose prose-invert prose-lg">
            {renderContent(article.content)}
          </div>

          {/* Share / Contact Section */}
          <div className="mt-20 pt-12 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div>
                <p className="text-white/40 text-sm uppercase tracking-wider mb-2">Enjoyed this article?</p>
                <p className="text-white text-lg font-serif italic">Share it with your network</p>
              </div>
              <button
                onClick={() => onNavigate('contact')}
                className="px-10 py-4 rounded-full bg-luxury-gold text-luxury-blue text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-luxury-blue hover:text-luxury-gold border border-luxury-gold transition-all"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogArticlePage;
