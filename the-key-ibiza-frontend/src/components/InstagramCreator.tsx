
import React, { useState, useEffect } from 'react';
import { vipAuth } from '../services/vipAuth';

const BACKEND_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5001'
  : 'https://the-key-ibiza-backend.vercel.app';

interface InstagramPost {
  id: number;
  image_url: string;
  caption: string;
  hashtags: string[];
  status: 'draft' | 'scheduled' | 'published';
  instagram_post_id?: string;
  scheduled_for?: string;
  published_at?: string;
  created_at: string;
}

interface InstagramTemplate {
  id: number;
  name: string;
  category: string;
  caption_template: string;
  default_hashtags: string[];
}

interface InstagramAccount {
  id: string;
  username: string;
  profile_picture_url?: string;
  media_count?: number;
  followers_count?: number;
  follows_count?: number;
  canPublish: boolean;
}

interface InstagramCreatorProps {
  onNavigate: (view: string) => void;
}

const InstagramCreator: React.FC<InstagramCreatorProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'drafts' | 'published' | 'templates'>('create');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Account info
  const [account, setAccount] = useState<InstagramAccount | null>(null);

  // Posts
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [templates, setTemplates] = useState<InstagramTemplate[]>([]);

  // Create form state
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Edit modal
  const [editingPost, setEditingPost] = useState<InstagramPost | null>(null);

  // Auth helper
  const getAuthHeaders = (extra?: Record<string, string>) => {
    const token = localStorage.getItem('vip_token') || sessionStorage.getItem('vip_token');
    return { 'Authorization': `Bearer ${token}`, ...extra };
  };

  // Check if user is admin
  useEffect(() => {
    if (!vipAuth.isAdmin()) {
      onNavigate('home');
    }
  }, [onNavigate]);

  // Fetch account info
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/instagram/account`, {
          headers: getAuthHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          setAccount(data);
        }
      } catch (err) {
        console.error('Failed to fetch Instagram account:', err);
      }
    };
    fetchAccount();
  }, []);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/instagram/posts`, {
          headers: getAuthHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
        } else {
          setError('Failed to load posts');
        }
      } catch (err) {
        setError('Connection error');
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  // Fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/instagram/templates`, {
          headers: getAuthHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          setTemplates(data.templates || []);
        }
      } catch (err) {
        console.error('Failed to fetch templates:', err);
      }
    };
    fetchTemplates();
  }, []);

  // Generate AI caption
  const handleGenerateCaption = async () => {
    if (!imageUrl) {
      setError('Please enter an image URL first');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}/instagram/generate-caption`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ imageUrl })
      });

      if (res.ok) {
        const data = await res.json();
        setCaption(data.caption || '');
        if (data.hashtags) {
          setHashtags(data.hashtags.join(' '));
        }
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to generate caption');
      }
    } catch (err) {
      setError('Connection error');
    }

    setIsGenerating(false);
  };

  // Apply template
  const handleApplyTemplate = (template: InstagramTemplate) => {
    setSelectedTemplate(template.id);
    setCaption(template.caption_template);
    setHashtags(template.default_hashtags.join(' '));
  };

  // Save as draft
  const handleSaveDraft = async () => {
    if (!imageUrl || !caption) {
      setError('Please provide image URL and caption');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}/instagram/posts`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          image_url: imageUrl,
          caption,
          hashtags: hashtags.split(/\s+/).filter(h => h.startsWith('#') || h.length > 0).map(h => h.startsWith('#') ? h : `#${h}`),
          status: 'draft'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setPosts(prev => [data.post, ...prev]);
        // Reset form
        setImageUrl('');
        setCaption('');
        setHashtags('');
        setSelectedTemplate(null);
        setActiveTab('drafts');
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to save draft');
      }
    } catch (err) {
      setError('Connection error');
    }

    setIsSaving(false);
  };

  // Publish to Instagram
  const handlePublish = async (post?: InstagramPost) => {
    const postToPublish = post || {
      image_url: imageUrl,
      caption,
      hashtags: hashtags.split(/\s+/).filter(h => h.length > 0).map(h => h.startsWith('#') ? h : `#${h}`)
    };

    if (!postToPublish.image_url || !postToPublish.caption) {
      setError('Please provide image URL and caption');
      return;
    }

    setIsPublishing(true);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}/instagram/publish`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(postToPublish)
      });

      if (res.ok) {
        const data = await res.json();
        // Update post status if it was a draft
        if (post?.id) {
          setPosts(prev => prev.map(p =>
            p.id === post.id
              ? { ...p, status: 'published', instagram_post_id: data.id, published_at: new Date().toISOString() }
              : p
          ));
        } else {
          // Add new published post
          setPosts(prev => [{
            id: Date.now(),
            image_url: postToPublish.image_url,
            caption: postToPublish.caption,
            hashtags: postToPublish.hashtags as string[],
            status: 'published',
            instagram_post_id: data.id,
            published_at: new Date().toISOString(),
            created_at: new Date().toISOString()
          }, ...prev]);
        }
        // Reset form
        setImageUrl('');
        setCaption('');
        setHashtags('');
        setSelectedTemplate(null);
        setActiveTab('published');
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to publish to Instagram');
      }
    } catch (err) {
      setError('Connection error');
    }

    setIsPublishing(false);
  };

  // Delete post
  const handleDeletePost = async (postId: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`${BACKEND_URL}/instagram/posts/${postId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== postId));
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to delete post');
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  // Update post
  const handleUpdatePost = async () => {
    if (!editingPost) return;

    try {
      const res = await fetch(`${BACKEND_URL}/instagram/posts/${editingPost.id}`, {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          caption: editingPost.caption,
          hashtags: editingPost.hashtags
        })
      });

      if (res.ok) {
        const data = await res.json();
        setPosts(prev => prev.map(p => p.id === editingPost.id ? data.post : p));
        setEditingPost(null);
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to update post');
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const draftPosts = posts.filter(p => p.status === 'draft');
  const publishedPosts = posts.filter(p => p.status === 'published');

  if (loading && activeTab !== 'create') {
    return (
      <div className="pt-40 pb-24 min-h-screen" style={{ backgroundColor: '#0B1C26' }}>
        <div className="container mx-auto px-6 text-center">
          <div className="w-12 h-12 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading Instagram Creator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-24 min-h-screen" style={{ backgroundColor: '#0B1C26' }}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center text-white/40 hover:text-pink-400 transition-colors mb-4 text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">Instagram Creator</h1>
            <p className="text-white/40">Create, manage, and publish Instagram content</p>
          </div>

          {/* Account Info */}
          {account && (
            <div className="mt-4 md:mt-0 flex items-center gap-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl px-4 py-3 border border-pink-500/30">
              {account.profile_picture_url && (
                <img src={account.profile_picture_url} alt={account.username} className="w-10 h-10 rounded-full" />
              )}
              <div>
                <p className="text-white font-medium">@{account.username}</p>
                <p className="text-white/50 text-xs">
                  {account.followers_count?.toLocaleString()} followers
                  {account.canPublish && <span className="text-green-400 ml-2">Can publish</span>}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm">
            {error}
            <button onClick={() => setError(null)} className="ml-4 text-red-400 hover:text-red-200">Dismiss</button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(['create', 'drafts', 'published', 'templates'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-xs uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                  : 'bg-transparent border border-white/20 text-white/60 hover:border-pink-500/50'
              }`}
            >
              {tab === 'drafts' ? `Drafts (${draftPosts.length})` :
               tab === 'published' ? `Published (${publishedPosts.length})` :
               tab === 'templates' ? `Templates (${templates.length})` : tab}
            </button>
          ))}
        </div>

        {/* Create Tab */}
        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Form */}
            <div className="space-y-6">
              {/* Image URL */}
              <div>
                <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-pink-500/50 transition-colors"
                />
                <p className="text-white/30 text-xs mt-2">Enter a publicly accessible image URL (Cloudinary, etc.)</p>
              </div>

              {/* AI Generate Button */}
              <button
                onClick={handleGenerateCaption}
                disabled={isGenerating || !imageUrl}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Caption with AI
                  </>
                )}
              </button>

              {/* Template Selector */}
              <div>
                <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Or use a template</label>
                <div className="grid grid-cols-2 gap-2">
                  {templates.slice(0, 4).map(template => (
                    <button
                      key={template.id}
                      onClick={() => handleApplyTemplate(template)}
                      className={`p-3 rounded-xl text-left transition-all ${
                        selectedTemplate === template.id
                          ? 'bg-pink-500/20 border-pink-500/50'
                          : 'bg-white/5 border-white/10 hover:border-pink-500/30'
                      } border`}
                    >
                      <p className="text-white text-sm font-medium">{template.name}</p>
                      <p className="text-white/40 text-xs">{template.category}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Caption</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={6}
                  placeholder="Write your caption here..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-pink-500/50 transition-colors resize-none"
                />
                <p className="text-white/30 text-xs mt-2">{caption.length}/2,200 characters</p>
              </div>

              {/* Hashtags */}
              <div>
                <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Hashtags</label>
                <input
                  type="text"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder="#ibiza #luxury #villa #concierge"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-pink-500/50 transition-colors"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleSaveDraft}
                  disabled={isSaving || !imageUrl || !caption}
                  className="flex-1 bg-white/10 border border-white/20 text-white py-3 rounded-xl font-medium hover:bg-white/20 transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save as Draft'}
                </button>
                <button
                  onClick={() => handlePublish()}
                  disabled={isPublishing || !imageUrl || !caption || !account?.canPublish}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-medium hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50"
                >
                  {isPublishing ? 'Publishing...' : 'Publish Now'}
                </button>
              </div>

              {!account?.canPublish && (
                <p className="text-amber-400 text-xs text-center">Publishing is disabled. Check Instagram API permissions.</p>
              )}
            </div>

            {/* Right: Preview */}
            <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl border border-white/10 p-6">
              <h3 className="text-white/50 text-xs uppercase tracking-wider mb-4">Preview</h3>

              {/* Instagram-style post preview */}
              <div className="bg-black rounded-xl overflow-hidden max-w-md mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 p-3 border-b border-white/10">
                  {account?.profile_picture_url ? (
                    <img src={account.profile_picture_url} alt="" className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500"></div>
                  )}
                  <span className="text-white text-sm font-medium">{account?.username || 'thekeyibiza'}</span>
                </div>

                {/* Image */}
                <div className="aspect-square bg-white/5 flex items-center justify-center">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-white/30 text-center p-8">
                      <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">Image preview will appear here</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-4 p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>

                {/* Caption */}
                <div className="p-3 pt-0">
                  <p className="text-white text-sm">
                    <span className="font-medium">{account?.username || 'thekeyibiza'}</span>{' '}
                    {caption || <span className="text-white/30">Your caption will appear here...</span>}
                  </p>
                  {hashtags && (
                    <p className="text-blue-400 text-sm mt-1">{hashtags}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Drafts Tab */}
        {activeTab === 'drafts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {draftPosts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <svg className="w-16 h-16 mx-auto text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-white/40">No drafts yet</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="mt-4 text-pink-400 hover:text-pink-300 text-sm"
                >
                  Create your first post
                </button>
              </div>
            ) : (
              draftPosts.map(post => (
                <div key={post.id} className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                  <img src={post.image_url} alt="" className="w-full aspect-square object-cover" />
                  <div className="p-4">
                    <p className="text-white text-sm line-clamp-3 mb-2">{post.caption}</p>
                    <p className="text-white/30 text-xs mb-4">{formatDate(post.created_at)}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingPost(post)}
                        className="flex-1 py-2 bg-white/10 rounded-lg text-white text-xs hover:bg-white/20 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handlePublish(post)}
                        disabled={!account?.canPublish}
                        className="flex-1 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white text-xs hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50"
                      >
                        Publish
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="py-2 px-3 bg-red-500/20 rounded-lg text-red-400 text-xs hover:bg-red-500/30 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Published Tab */}
        {activeTab === 'published' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedPosts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <svg className="w-16 h-16 mx-auto text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <p className="text-white/40">No published posts yet</p>
              </div>
            ) : (
              publishedPosts.map(post => (
                <div key={post.id} className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                  <div className="relative">
                    <img src={post.image_url} alt="" className="w-full aspect-square object-cover" />
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] px-2 py-1 rounded-full">
                      Published
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-white text-sm line-clamp-3 mb-2">{post.caption}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {post.hashtags?.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-pink-400 text-xs">{tag}</span>
                      ))}
                    </div>
                    <p className="text-white/30 text-xs">
                      Published: {post.published_at ? formatDate(post.published_at) : 'Unknown'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map(template => (
              <div key={template.id} className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-medium text-lg">{template.name}</h3>
                    <span className="text-pink-400 text-xs uppercase tracking-wider">{template.category}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleApplyTemplate(template);
                      setActiveTab('create');
                    }}
                    className="px-4 py-1.5 bg-pink-500/20 text-pink-400 rounded-full text-xs hover:bg-pink-500/30 transition-all"
                  >
                    Use Template
                  </button>
                </div>
                <p className="text-white/60 text-sm mb-4 whitespace-pre-wrap">{template.caption_template}</p>
                <div className="flex flex-wrap gap-2">
                  {template.default_hashtags.map((tag, i) => (
                    <span key={i} className="text-blue-400 text-xs bg-blue-500/10 px-2 py-1 rounded">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-[100001] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setEditingPost(null)}
          />
          <div className="relative w-full max-w-lg bg-gradient-to-br from-[#0B1C26] to-[#0a1419] rounded-3xl border border-pink-500/20 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingPost(null)}
              className="absolute top-4 right-4 text-white/40 hover:text-pink-400 transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6">
              <h2 className="text-2xl font-serif text-white mb-6">Edit Post</h2>

              <img src={editingPost.image_url} alt="" className="w-full aspect-video object-cover rounded-xl mb-4" />

              <div className="space-y-4">
                <div>
                  <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Caption</label>
                  <textarea
                    value={editingPost.caption}
                    onChange={(e) => setEditingPost({ ...editingPost, caption: e.target.value })}
                    rows={6}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Hashtags</label>
                  <input
                    type="text"
                    value={editingPost.hashtags?.join(' ') || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, hashtags: e.target.value.split(/\s+/) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 transition-colors"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setEditingPost(null)}
                    className="flex-1 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdatePost}
                    className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white hover:from-pink-600 hover:to-purple-600 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstagramCreator;
