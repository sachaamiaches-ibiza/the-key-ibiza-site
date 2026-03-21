import React, {useState, useEffect, useRef} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import Navbar from './components/Navbar';
import AIConcierge from './components/AIConcierge';
import ScrollToTop from './components/ScrollToTop';
import VipLogin from './components/VipLogin';
import ContactModal from './components/ContactModal';
import WishlistBadge from './components/WishlistBadge';
import WishlistDrawer from './components/WishlistDrawer';
import WishlistShareModal from './components/WishlistShareModal';
import WishlistMapModal from './components/WishlistMapModal';
import {getServices} from './constants';
import {translations} from './translations';
import {Language, Villa, View} from './types';
import {fetchVillas, fetchVillaBySlug, getPublicVillas, getAllVillas} from './services/villaService';
import {vipAuth} from './services/vipAuth';
import {usePageTracking} from './hooks/useAudit';
import {initGA, trackPageView} from './hooks/useGoogleAnalytics';
import {useWishlist} from './hooks/useWishlist';
import AppRouter from './Router';

import {nameToUrlSlug, getLangFromPath, SUPPORTED_LANG_PREFIXES, LangPrefix} from './utils/urlHelpers';


// URL routing helpers
function viewToPath(view: View, lang: Language = 'en'): string {
    const langPrefix = lang !== 'en' ? `/${lang}` : '';

    if (view === 'home') return langPrefix || '/';
    if (view === 'contact') return `${langPrefix}/contact`;

    if (view === 'villas-holiday') return `${langPrefix}/holiday-rentals`;
    if (view === 'villas-longterm') return `${langPrefix}/long-term`;
    if (view === 'villas-sale') return `${langPrefix}/for-sale`;

    if (view === 'service-villas') return `${langPrefix}/villas`;
    if (view === 'service-yacht') return `${langPrefix}/boats`;

    if (view === 'boats-yachts') return `${langPrefix}/yachts`;
    if (view === 'boats-catamarans') return `${langPrefix}/catamarans`;

    // Clean paths for dynamic entities
    if (view.startsWith('villa-')) {
        const slug = view.replace('villa-', '');
        return `${langPrefix}/villa/${slug}`;
    }
    if (view.startsWith('yacht-')) {
        const id = view.replace('yacht-', '');
        return `${langPrefix}/yacht/${id}`;
    }
    if (view.startsWith('blog-')) {
        const slug = view.replace('blog-', '');
        return `${langPrefix}/blog/${slug}`;
    }

    if (view.startsWith('wishlist/')) return `/${view}`;

    if (view.startsWith('service-')) return `${langPrefix}/${view.replace('service-', '')}`;

    return `${langPrefix}/${view}`;
}

// Maps URL path to Navbar "View ID" for highlighting active menu
function getActiveNavView(path: string): View {
    const cleanPath = path.replace(/^\//, '').toLowerCase(); // e.g. "villa/cool-house" or "fr/villa/cool-house" usually passed here without lang if using getLangFromPath helper?
    // Actually App uses `pathWithoutLang` passed to `getActiveNavView`.
    // So if url is `/fr/villa/foo`, `pathWithoutLang` is `/villa/foo`.
    // `cleanPath` becomes `villa/foo`.

    const MAPPING: Record<string, View> = {
        '': 'home',
        'home': 'home',
        'contact': 'contact',
        'holiday-rentals': 'villas-holiday',
        'long-term': 'villas-longterm',
        'for-sale': 'villas-sale',
        'villas': 'service-villas',
        'boats': 'service-yacht',
        'charters': 'service-yacht',
        'yachts': 'boats-yachts',
        'catamarans': 'boats-catamarans'
    };

    if (MAPPING[cleanPath]) return MAPPING[cleanPath];

    // Logic to reverse the clean path structure
    if (cleanPath.startsWith('villa/')) {
        return `villa-${cleanPath.replace('villa/', '')}` as View;
    }
    if (cleanPath.startsWith('yacht/')) {
        return `yacht-${cleanPath.replace('yacht/', '')}` as View;
    }
    if (cleanPath.startsWith('blog/')) {
        return `blog-${cleanPath.replace('blog/', '')}` as View;
    }

    if (cleanPath.startsWith('wishlist/')) return cleanPath as View;

    // Generic services
    const services = ['security', 'wellness', 'nightlife', 'events', 'catering', 'furniture', 'health', 'yoga', 'cleaning', 'driver', 'deliveries', 'babysitting'];
    if (services.includes(cleanPath)) {
        return `service-${cleanPath}` as View;
    }

    return cleanPath as View;
}

// Wrapper to handle language prefix logic inside Routes
const LangWrapper: React.FC<{
    component: React.ComponentType<any>;
    langProp?: Language;
    [key: string]: any;
}> = ({component: Component, langProp, ...rest}) => {
    const {lang: paramLang} = useParams<{ lang?: Language }>();
    // Use param lang if available and valid, otherwise fallback to prop or 'en'
    const effectiveLang = (paramLang && SUPPORTED_LANG_PREFIXES.includes(paramLang as any))
        ? (paramLang as Language)
        : (langProp || 'en');

    return <Component lang={effectiveLang} {...rest} />;
};


interface ContactFormProps {
    lang: Language;
}

const ContactForm: React.FC<ContactFormProps> = ({lang}) => {
    const t = translations[lang].contact;
    const [formData, setFormData] = useState({name: '', email: '', phone: '', message: ''});
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = 'Required';
        if (!formData.email) newErrors.email = 'Required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
        if (!formData.phone) newErrors.phone = 'Required';
        return newErrors;
    };

    const sendEmail = async () => {
        const messageContent = `New Contact Form Submission\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nMessage: ${formData.message || 'No message provided'}`;

        // Send via Formsubmit.co (free email service, no registration required)
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('message', formData.message || 'No message provided');
        formDataToSend.append('_subject', 'New Contact Form Submission – The Key Ibiza');
        formDataToSend.append('_captcha', 'false');
        formDataToSend.append('_template', 'table');

        try {
            const response = await fetch('https://formsubmit.co/ajax/hello@thekey-ibiza.com', {
                method: 'POST',
                body: formDataToSend,
            });
            const result = await response.json();
            if (!result.success) {
                throw new Error('Email failed');
            }
        } catch (error) {
            // Fallback: open mailto
            const subject = encodeURIComponent('New Contact Form Submission');
            const body = encodeURIComponent(messageContent);
            window.open(`mailto:hello@thekey-ibiza.com?subject=${subject}&body=${body}`, '_blank');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setStatus('submitting');
        await sendEmail();
        setStatus('success');
        setFormData({name: '', email: '', phone: '', message: ''});
    };

    if (status === 'success') {
        return (
            <div className="text-center py-8">
                <div className="w-12 h-12 bg-luxury-gold/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h3 className="text-lg font-serif text-white mb-2">{t.success}</h3>
                <p className="text-white/40 text-sm mb-4">{t.successDesc}</p>
                <button onClick={() => setStatus('idle')}
                        className="text-luxury-gold text-[9px] uppercase tracking-widest">
                    {t.another}
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                required
                className={`w-full bg-transparent border-b ${errors.name ? 'border-red-500/50' : 'border-white/20'} px-0 py-3 text-white text-sm focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-white/30`}
                placeholder={t.name}
                value={formData.name}
                onChange={(e) => {
                    setFormData({...formData, name: e.target.value});
                    if (errors.name) setErrors({...errors, name: ''});
                }}
            />
            <input
                type="email"
                required
                className={`w-full bg-transparent border-b ${errors.email ? 'border-red-500/50' : 'border-white/20'} px-0 py-3 text-white text-sm focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-white/30`}
                placeholder={t.email}
                value={formData.email}
                onChange={(e) => {
                    setFormData({...formData, email: e.target.value});
                    if (errors.email) setErrors({...errors, email: ''});
                }}
            />
            <input
                type="tel"
                required
                className={`w-full bg-transparent border-b ${errors.phone ? 'border-red-500/50' : 'border-white/20'} px-0 py-3 text-white text-sm focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-white/30`}
                placeholder={t.phone}
                value={formData.phone}
                onChange={(e) => {
                    setFormData({...formData, phone: e.target.value});
                    if (errors.phone) setErrors({...errors, phone: ''});
                }}
            />
            <textarea
                rows={3}
                className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white text-sm focus:outline-none focus:border-luxury-gold transition-colors resize-none placeholder:text-white/30"
                placeholder={t.message}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
            <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-luxury-gold text-luxury-blue py-3 rounded-full text-[10px] uppercase tracking-[0.3em] font-semibold hover:bg-luxury-blue hover:text-luxury-gold border border-luxury-gold transition-all mt-4"
            >
                {status === 'submitting' ? '...' : t.send}
            </button>
        </form>
    );
};

const App: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Initialize view state for Navbar active state and Analytics
    const {lang: urlLang, pathWithoutLang} = getLangFromPath(location.pathname);
    const currentView = getActiveNavView(pathWithoutLang);

    // Use URL language if present, otherwise default to 'en'
    const lang = urlLang;

    // White label detection - check if we're on the white label domain
    const isWhiteLabelDomain = typeof window !== 'undefined' && (
        window.location.hostname === 'elegantcollection.store' ||
        window.location.hostname === 'www.elegantcollection.store' ||
        window.location.hostname.includes('elegantcollection')
    );

    // White label: Change title and favicon
    useEffect(() => {
        if (isWhiteLabelDomain) {
            document.title = 'Luxury Villa Collection';
            // Change favicon to a neutral one (diamond emoji as data URI)
            const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            if (link) {
                link.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💎</text></svg>';
            }
        }
    }, [isWhiteLabelDomain]);

    // Navigate handler used by components
    const onNavigate = (newView: View, ...args: any[]) => {
        // Handle special cases if any from args (like slug)
        // Actually components call it like onNavigate('blog-slug')
        const newPath = viewToPath(newView, lang);
        if (location.pathname !== newPath) {
            navigate(newPath);
        }
    };

    // Handle language change from Navbar
    const handleLanguageChange = (newLang: Language) => {
        const newPath = viewToPath(currentView, newLang);
        navigate(newPath);
    };

    // Handle browser back/forward buttons (with language support)
    // REACT-ROUTER handles popstates naturally.
    // We just react to location changes via the derived state above.

    // Clean up ?loaded=true from URL (used by OG redirect system)
    // This ensures shared links go through the backend for correct meta tags
    useEffect(() => {
        const url = new URL(window.location.href);
        if (url.searchParams.has('loaded')) {
            url.searchParams.delete('loaded');
            navigate(url.pathname + url.search, {replace: true});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // Villa data from Backend API
    const [allVillas, setAllVillas] = useState<Villa[]>([]);
    const [isVip, setIsVip] = useState(vipAuth.isAuthenticated());
    const [villasLoading, setVillasLoading] = useState(true);
    const [directVilla, setDirectVilla] = useState<Villa | null>(null);

    // Search dates persistence
    const [searchCheckIn, setSearchCheckIn] = useState<string>('');
    const [searchCheckOut, setSearchCheckOut] = useState<string>('');

    // Legal modals
    const [disclaimerModalOpen, setDisclaimerModalOpen] = useState(false);
    const [imprintModalOpen, setImprintModalOpen] = useState(false);

    // Yacht detail state
    const [selectedYacht, setSelectedYacht] = useState<any>(null);
    const [yachtLoading, setYachtLoading] = useState(false);

    // VIP villa password modal state
    const [villaPasswordModalOpen, setVillaPasswordModalOpen] = useState(false);
    const [villaPassword, setVillaPassword] = useState('');
    const [villaPasswordError, setVillaPasswordError] = useState('');
    const [villaPasswordVerifying, setVillaPasswordVerifying] = useState(false);
    const [verifiedVillaSlugs, setVerifiedVillaSlugs] = useState<string[]>([]);

    // Contact modal state
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    // Wishlist state
    const wishlistHook = useWishlist();
    const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false);
    const [isWishlistShareModalOpen, setIsWishlistShareModalOpen] = useState(false);
    const [isWishlistMapModalOpen, setIsWishlistMapModalOpen] = useState(false);
    const [yachtSearchDate, setYachtSearchDate] = useState<string>('');

    // Sync wishlist dates with search dates
    useEffect(() => {
        if (searchCheckIn && searchCheckOut) {
            wishlistHook.setDates(searchCheckIn, searchCheckOut);
        }
    }, [searchCheckIn, searchCheckOut]);

    // Calculate price for a period
    const calculatePriceForPeriod = (villa: Villa, checkIn: string, checkOut: string): number | null => {
        if (!checkIn || !checkOut) return null;

        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const totalNights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

        if (totalNights <= 0) return null;

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const monthlyPrices: { [monthIndex: number]: number } = {};

        villa.seasonalPrices?.forEach(sp => {
            const monthKey = monthNames.find(m => sp.month.includes(m));
            if (monthKey) {
                const monthIdx = monthNames.indexOf(monthKey);
                const price = parseInt(sp.price.replace(/[^\d]/g, '')) || villa.numericPrice || 15000;
                monthlyPrices[monthIdx] = price;
            }
        });

        const defaultWeeklyPrice = villa.numericPrice || 15000;
        let total = 0;

        for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
            const monthIdx = d.getMonth();
            const weeklyRate = monthlyPrices[monthIdx] || defaultWeeklyPrice;
            total += weeklyRate / 7;
        }

        return Math.round(total);
    };

    // Calculate wishlist total
    const wishlistTotalPrice = wishlistHook.wishlist.villaSlugs.reduce((total, slug) => {
        const villa = allVillas.find(v => nameToUrlSlug(v.name) === slug || v.id === slug);
        if (villa) {
            const price = calculatePriceForPeriod(villa, wishlistHook.wishlist.checkIn, wishlistHook.wishlist.checkOut);
            return total + (price || 0);
        }
        return total;
    }, 0);

    // Sync contact modal with view state
    useEffect(() => {
        if (currentView === 'contact') {
            setIsContactModalOpen(true);
        } else {
            setIsContactModalOpen(false);
        }
    }, [currentView]);

    const handleOpenContact = () => {
        setIsContactModalOpen(true);
        // Push state for history support of modal
        const contactPath = viewToPath('contact', lang);
        navigate(contactPath);
    };

    const handleCloseContact = () => {
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            onNavigate('home');
        }
    };

    // Audit tracking
    usePageTracking(currentView);

    // Handler to update search dates
    const handleSearchDatesChange = (checkIn: string, checkOut: string) => {
        setSearchCheckIn(checkIn);
        setSearchCheckOut(checkOut);
    };

    // Fetch villas
    useEffect(() => {
        const loadVillas = async () => {
            setVillasLoading(true);
            try {
                const villas = await fetchVillas(lang);
                setAllVillas(villas);
                console.log('✅ ALL VILLAS FROM BACKEND:', villas.length, isVip ? '(VIP)' : '(public)');
            } catch (error) {
                console.error('Failed to load villas:', error);
            }
            setVillasLoading(false);
        };
        loadVillas();
    }, [isVip, lang]);

    // Fetch single villa logic...
    // Updated constraint: logic depends on currentView being correct (villa-slug). 
    // Since we updated getActiveNavView, currentView should still be 'villa-slug' even for path '/villa/slug'.
    // So the fetch logic in App should still work!
    useEffect(() => {
        if (currentView.startsWith('villa-') && !villasLoading) {
            const villaUrlSlug = currentView.replace('villa-', '');
            // Try to find by URL slug matching the name
            const villaInState = allVillas.find(v => nameToUrlSlug(v.name) === villaUrlSlug)
                || allVillas.find(v => v.id === villaUrlSlug || v.id === `invenio-${villaUrlSlug}`);

            if (!villaInState && !directVilla) {
                // Villa not in state, fetch directly from Backend by name slug
                fetchVillaBySlug(villaUrlSlug, lang).then(villa => {
                    if (villa) setDirectVilla(villa);
                    else fetchVillaBySlug(`invenio-${villaUrlSlug}`, lang).then(v => {
                        if (v) setDirectVilla(v);
                    });
                });
            } else if (villaInState) {
                // Clear direct villa if we found it in state
                setDirectVilla(null);
            }
        } else {
            // Clear direct villa when navigating away
            setDirectVilla(null);
        }
    }, [currentView, allVillas, villasLoading]);

    // Fetch yacht detail logic
    useEffect(() => {
        if (currentView.startsWith('yacht-')) {
            const yachtId = currentView.replace('yacht-', '');
            setYachtLoading(true);
            const BACKEND_URL = window.location.hostname === 'localhost'
                ? 'http://localhost:5001'
                : 'https://the-key-ibiza-backend.vercel.app';
            fetch(`${BACKEND_URL}/yachts/${yachtId}`)
                .then(res => res.json())
                .then(data => {
                    setSelectedYacht(data);
                    setYachtLoading(false);
                })
                .catch(() => {
                    setSelectedYacht(null);
                    setYachtLoading(false);
                });
        } else {
            setSelectedYacht(null);
        }
    }, [currentView]);

    // Filter villas based on VIP status
    const VILLAS = isVip ? getAllVillas(allVillas) : getPublicVillas(allVillas);
    const SERVICES = getServices(lang);

    const handleVipAuthChange = (authenticated: boolean) => {
        setIsVip(authenticated);
    };

    // Save language
    useEffect(() => {
        localStorage.setItem('thekey-language', lang);
    }, [lang]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentView]);

    // Initialize GA and SEO
    useEffect(() => {
        initGA();
    }, []);

    useEffect(() => {
        // Remove existing hreflang tags
        document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());

        const baseUrl = 'https://thekey-ibiza.com';
        const currentPath = viewToPath(currentView, 'en'); // Get path without language prefix

        // Languages to include
        const languages = ['en', 'fr', 'es', 'de'] as const;

        languages.forEach(langCode => {
            const link = document.createElement('link');
            link.rel = 'alternate';
            link.hreflang = langCode;
            link.href = langCode === 'en'
                ? `${baseUrl}${currentPath}`
                : `${baseUrl}/${langCode}${currentPath === '/' ? '' : currentPath}`;
            document.head.appendChild(link);
        });

        // Add x-default (fallback for unmatched languages)
        const defaultLink = document.createElement('link');
        defaultLink.rel = 'alternate';
        defaultLink.hreflang = 'x-default';
        defaultLink.href = `${baseUrl}${currentPath}`;
        document.head.appendChild(defaultLink);
    }, [currentView]);

    useEffect(() => {
        const path = viewToPath(currentView);
        trackPageView(path, document.title);
    }, [currentView]);

    // Common Props for Routes -> Passed to AppRouter
    const routerProps = {
        onNavigate,
        lang,
        villas: VILLAS,
        isVip,
        isInWishlist: wishlistHook.isInWishlist,
        onWishlistToggle: wishlistHook.toggleVilla,
        onOpenContact: handleOpenContact,

        // Search
        searchCheckIn,
        searchCheckOut,
        handleSearchDatesChange,
        yachtSearchDate,
        setYachtSearchDate,

        // Data
        allVillas,
        directVilla,
        villasLoading,
        selectedYacht,
        yachtLoading,

        // VIP
        verifiedVillaSlugs,
        setVerifiedVillaSlugs
    };

    return (
        <div className="min-h-screen selection:bg-luxury-gold selection:text-white overflow-x-hidden">
            {/* Golden Top Bar - visible on all pages EXCEPT white label domain */}
            {!isWhiteLabelDomain && (
                <div data-navbar="true" className="fixed top-0 left-0 right-0 z-[100]"
                     style={{backgroundColor: '#C9B27C'}}>
                    <div className="container mx-auto px-6 py-1.5 flex justify-between items-center">
               <span
                   className="hidden md:inline"
                   style={{
                       fontFamily: 'Plus Jakarta Sans, sans-serif',
                       fontSize: '8px',
                       letterSpacing: '0.18em',
                       color: '#0B1C26',
                       textTransform: 'uppercase',
                       fontWeight: 500,
                       marginLeft: '8px',
                   }}
               >
                 The Key that opens all the doors to an unforgettable experience.
               </span>
                        <div className="flex items-center gap-3 md:gap-5 mx-auto md:mx-0" style={{marginRight: '14px'}}>
                            <a
                                href="https://wa.me/34660153207"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5"
                                style={{
                                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                                    fontSize: '8px',
                                    letterSpacing: '0.12em',
                                    color: '#0B1C26',
                                    fontWeight: 500,
                                }}
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                    <path
                                        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                                +34 660 153 207
                            </a>
                            <a
                                href="mailto:hello@thekey-ibiza.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5"
                                style={{
                                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                                    fontSize: '8px',
                                    letterSpacing: '0.06em',
                                    color: '#0B1C26',
                                    fontWeight: 500,
                                }}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                     className="w-3 h-3">
                                    <path
                                        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                    <polyline points="22,6 12,13 2,6"/>
                                </svg>
                                hello@thekey-ibiza.com
                            </a>
                        </div>
                    </div>
                </div>
            )}
            {!isWhiteLabelDomain && <Navbar currentView={currentView} onNavigate={onNavigate} lang={lang}
                                            onLanguageChange={handleLanguageChange} onOpenContact={handleOpenContact}/>}

            <main className="animate-fade-in relative z-[1]">
                <AppRouter {...routerProps} />
            </main>

            {!isWhiteLabelDomain && (
                <>
                    <section id="contact" className="py-20 md:py-28 lg:py-32 relative overflow-hidden"
                             style={{backgroundColor: '#0B1C26'}}>
                        <div
                            className="container mx-auto px-6 lg:px-12 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 items-center">

                            {/* LEFT - Logo + Contact Info */}
                            <div className="text-center md:text-left">
                                {/* Logo */}
                                <div className="flex flex-col items-center md:items-start mb-8">
                                    <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg"
                                         className="w-10 h-14 mb-4">
                                        <circle cx="50" cy="35" r="32" stroke="#C9B27C" strokeWidth="3.5"/>
                                        <circle cx="50" cy="35" r="18" stroke="#C9B27C" strokeWidth="2.5"
                                                strokeDasharray="80 20"/>
                                        <path d="M50 35V130" stroke="#C9B27C" strokeWidth="5" strokeLinecap="round"/>
                                        <path d="M50 65H70" stroke="#C9B27C" strokeWidth="5" strokeLinecap="round"/>
                                        <path d="M50 82H82" stroke="#C9B27C" strokeWidth="5" strokeLinecap="round"/>
                                        <path d="M50 99H75" stroke="#C9B27C" strokeWidth="5" strokeLinecap="round"/>
                                        <path d="M50 116H88" stroke="#C9B27C" strokeWidth="5" strokeLinecap="round"/>
                                        <path d="M50 130H65" stroke="#C9B27C" strokeWidth="5" strokeLinecap="round"/>
                                    </svg>
                                    <span className="text-xl tracking-[0.25em]" style={{
                                        fontFamily: 'Playfair Display, serif',
                                        color: '#C9B27C'
                                    }}>THE KEY</span>
                                    <span className="text-sm tracking-[0.3em] italic" style={{
                                        fontFamily: 'Playfair Display, serif',
                                        color: 'rgba(201,178,124,0.7)'
                                    }}>Ibiza</span>
                                </div>
                                {/* Contact Info */}
                                <div className="space-y-3 mb-6">
                                    <a href="https://wa.me/34660153207" target="_blank" rel="noopener noreferrer"
                                       className="text-white text-base font-light hover:text-luxury-gold transition-colors flex items-center justify-center md:justify-start gap-2">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                            <path
                                                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                        </svg>
                                        +34 660 153 207
                                    </a>
                                    <a href="mailto:hello@thekey-ibiza.com"
                                       className="text-white/50 text-sm hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                             className="w-4 h-4">
                                            <path
                                                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                            <polyline points="22,6 12,13 2,6"/>
                                        </svg>
                                        hello@thekey-ibiza.com
                                    </a>
                                </div>
                                <div className="flex justify-center md:justify-start space-x-5">
                                    {['Instagram', 'WhatsApp', 'LinkedIn'].map(social => (
                                        <a key={social} href="#"
                                           className="text-[9px] uppercase tracking-[0.15em] text-white/30 hover:text-luxury-gold transition-colors">{social}</a>
                                    ))}
                                </div>
                            </div>

                            {/* MIDDLE - VIP Access */}
                            <VipLogin onAuthChange={handleVipAuthChange} onNavigate={onNavigate}/>

                            {/* RIGHT - Contact Form */}
                            <div className="text-center md:text-left">
                                <h3 className="text-luxury-gold text-[10px] uppercase tracking-[0.4em] font-semibold mb-6">Bespoke
                                    Inquiry</h3>
                                <ContactForm lang={lang}/>
                            </div>

                        </div>
                    </section>
                    <footer className="py-12" style={{backgroundColor: '#0B1C26'}}>
                        <div className="container mx-auto px-6 lg:px-12">
                            {/* Legal Links */}
                            <div className="flex justify-center gap-8 mb-8">
                                <button
                                    onClick={() => setDisclaimerModalOpen(true)}
                                    className="text-[9px] lg:text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-luxury-gold transition-colors"
                                >
                                    Disclaimer
                                </button>
                                <button
                                    onClick={() => setImprintModalOpen(true)}
                                    className="text-[9px] lg:text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-luxury-gold transition-colors"
                                >
                                    Imprint
                                </button>
                                <button
                                    onClick={() => setDisclaimerModalOpen(true)}
                                    className="text-[9px] lg:text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-luxury-gold transition-colors"
                                >
                                    Privacy Policy
                                </button>
                            </div>
                            {/* Copyright */}
                            <div
                                className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                                <p className="text-[9px] lg:text-[10px] uppercase tracking-[0.4em] text-white/30">
                                    &copy; {new Date().getFullYear()} THE KEY IBIZA
                                </p>
                                <p className="text-[9px] lg:text-[10px] uppercase tracking-[0.4em] text-white/30">
                                    Excellence & Discretion — All Rights Reserved
                                </p>
                            </div>
                        </div>
                    </footer>
                </>
            )}

            {/* ===== DISCLAIMER MODAL ===== */}
            {disclaimerModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/90 backdrop-blur-md z-[9998]"
                        onClick={() => setDisclaimerModalOpen(false)}
                    />
                    <div
                        className="relative z-[9999] bg-gradient-to-b from-[#1a2634] to-[#0f1923] rounded-2xl p-6 md:p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto"
                        style={{border: '1px solid rgba(196,164,97,0.2)'}}
                    >
                        <button
                            onClick={() => setDisclaimerModalOpen(false)}
                            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>

                        <h2 className="text-2xl font-serif text-luxury-gold mb-6">Disclaimer & Privacy Policy</h2>

                        <div className="text-white/70 text-sm leading-relaxed space-y-4">
                            <h3 className="text-luxury-gold text-base font-semibold mt-4">1. General Information</h3>
                            <p>
                                The content of this website is for general information purposes only. The Key Ibiza
                                makes no representations or warranties of any kind, express or implied, about the
                                completeness, accuracy, reliability, suitability, or availability of the information,
                                products, services, or related graphics contained on the website.
                            </p>

                            <h3 className="text-luxury-gold text-base font-semibold mt-4">2. Privacy Policy</h3>
                            <p>
                                We are committed to protecting your privacy. Any personal information collected through
                                this website will be used solely for the purpose of providing our services and will not
                                be shared with third parties without your consent, except as required by law.
                            </p>

                            <h3 className="text-luxury-gold text-base font-semibold mt-4">3. Data Collection</h3>
                            <p>
                                We collect information you provide directly to us, such as when you fill out a contact
                                form, request information about our services, or communicate with us. This may include
                                your name, email address, phone number, and any other information you choose to provide.
                            </p>

                            <h3 className="text-luxury-gold text-base font-semibold mt-4">4. Cookies</h3>
                            <p>
                                This website uses cookies to enhance your browsing experience. By continuing to use this
                                site, you consent to our use of cookies in accordance with our privacy policy.
                            </p>

                            <h3 className="text-luxury-gold text-base font-semibold mt-4">5. Your Rights</h3>
                            <p>
                                You have the right to access, correct, or delete your personal data. To exercise these
                                rights, please contact us at hello@thekey-ibiza.com.
                            </p>

                            <h3 className="text-luxury-gold text-base font-semibold mt-4">6. Third-Party Links</h3>
                            <p>
                                This website may contain links to external sites. We are not responsible for the content
                                or privacy practices of these sites.
                            </p>

                            <h3 className="text-luxury-gold text-base font-semibold mt-4">7. Contact</h3>
                            <p>
                                For any questions regarding this disclaimer or privacy policy, please contact us
                                at:<br/>
                                <span className="text-luxury-gold">hello@thekey-ibiza.com</span>
                            </p>
                        </div>

                        <button
                            onClick={() => setDisclaimerModalOpen(false)}
                            className="mt-8 w-full py-3 bg-luxury-gold text-luxury-blue rounded-full text-xs uppercase tracking-wider font-semibold hover:bg-white transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* ===== IMPRINT MODAL ===== */}
            {imprintModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/90 backdrop-blur-md z-[9998]"
                        onClick={() => setImprintModalOpen(false)}
                    />
                    <div
                        className="relative z-[9999] bg-gradient-to-b from-[#1a2634] to-[#0f1923] rounded-2xl p-6 md:p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto"
                        style={{border: '1px solid rgba(196,164,97,0.2)'}}
                    >
                        <button
                            onClick={() => setImprintModalOpen(false)}
                            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>

                        <h2 className="text-2xl font-serif text-luxury-gold mb-6">Imprint</h2>

                        <div className="text-white/70 text-sm leading-relaxed space-y-4">
                            <h3 className="text-luxury-gold text-base font-semibold">Company Information</h3>
                            <p>
                                <strong className="text-white">The Key Ibiza</strong><br/>
                                Luxury Concierge Services
                            </p>

                            <h3 className="text-luxury-gold text-base font-semibold mt-4">Address</h3>
                            <p>
                                Ibiza, Balearic Islands<br/>
                                Spain
                            </p>

                            <h3 className="text-luxury-gold text-base font-semibold mt-4">Contact</h3>
                            <p>
                                Email: <span className="text-luxury-gold">hello@thekey-ibiza.com</span><br/>
                                Website: <span className="text-luxury-gold">www.thekey-ibiza.com</span>
                            </p>

                            <h3 className="text-luxury-gold text-base font-semibold mt-4">Responsible for Content</h3>
                            <p>
                                The Key Ibiza<br/>
                                In accordance with § 55 Abs. 2 RStV
                            </p>

                            <h3 className="text-luxury-gold text-base font-semibold mt-4">Dispute Resolution</h3>
                            <p>
                                The European Commission provides a platform for online dispute resolution (ODR):
                                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer"
                                   className="text-luxury-gold hover:underline ml-1">
                                    https://ec.europa.eu/consumers/odr
                                </a>
                            </p>
                            <p>
                                We are not willing or obliged to participate in dispute resolution proceedings before a
                                consumer arbitration board.
                            </p>

                            <h3 className="text-luxury-gold text-base font-semibold mt-4">Liability for Content</h3>
                            <p>
                                As a service provider, we are responsible for our own content on these pages according
                                to general laws. However, we are not obligated to monitor transmitted or stored
                                third-party information or to investigate circumstances that indicate illegal activity.
                            </p>

                            <h3 className="text-luxury-gold text-base font-semibold mt-4">Copyright</h3>
                            <p>
                                The content and works created by the site operators on these pages are subject to
                                copyright law. Reproduction, editing, distribution, and any kind of exploitation outside
                                the limits of copyright require the written consent of the respective author or creator.
                            </p>
                        </div>

                        <button
                            onClick={() => setImprintModalOpen(false)}
                            className="mt-8 w-full py-3 bg-luxury-gold text-luxury-blue rounded-full text-xs uppercase tracking-wider font-semibold hover:bg-white transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {!isWhiteLabelDomain && <AIConcierge lang={lang}/>}

            {/* Contact Modal - Shareable via URL */}
            <ContactModal
                isOpen={isContactModalOpen}
                onClose={handleCloseContact}
            />

            {/* Wishlist Badge - Fixed button at bottom right */}
            <WishlistBadge
                count={wishlistHook.count}
                hasDates={wishlistHook.hasDates}
                onClick={() => setIsWishlistDrawerOpen(true)}
            />

            {/* Wishlist Drawer - Side panel with selected villas */}
            <WishlistDrawer
                isOpen={isWishlistDrawerOpen}
                onClose={() => setIsWishlistDrawerOpen(false)}
                villaSlugs={wishlistHook.wishlist.villaSlugs}
                villas={VILLAS}
                checkIn={wishlistHook.wishlist.checkIn}
                checkOut={wishlistHook.wishlist.checkOut}
                onRemoveVilla={wishlistHook.removeVilla}
                onClearAll={() => {
                    wishlistHook.clearWishlist();
                    setIsWishlistDrawerOpen(false);
                }}
                onShare={() => {
                    setIsWishlistDrawerOpen(false);
                    setIsWishlistShareModalOpen(true);
                }}
                onViewMap={() => {
                    setIsWishlistDrawerOpen(false);
                    setIsWishlistMapModalOpen(true);
                }}
                onNavigate={onNavigate}
                calculatePrice={calculatePriceForPeriod}
            />

            {/* Wishlist Share Modal - Create and share link */}
            <WishlistShareModal
                isOpen={isWishlistShareModalOpen}
                onClose={() => setIsWishlistShareModalOpen(false)}
                villaSlugs={wishlistHook.wishlist.villaSlugs}
                checkIn={wishlistHook.wishlist.checkIn}
                checkOut={wishlistHook.wishlist.checkOut}
                totalPrice={wishlistTotalPrice}
                villaCount={wishlistHook.count}
                isVip={isVip}
            />

            {/* Wishlist Map Modal - View selected villas on map */}
            <WishlistMapModal
                isOpen={isWishlistMapModalOpen}
                onClose={() => setIsWishlistMapModalOpen(false)}
                villas={VILLAS.filter(v => {
                    const villaSlug = v.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
                    return wishlistHook.wishlist.villaSlugs.includes(villaSlug) || wishlistHook.wishlist.villaSlugs.includes(v.id);
                })}
                onNavigate={onNavigate}
            />

            {/* Scroll to Top Button */}
            <ScrollToTop/>

            {/* WhatsApp Floating Button - positioned above AI Concierge */}
            {!isWhiteLabelDomain && (
                <a
                    href="https://wa.me/34660153207"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-24 right-8 lg:bottom-28 lg:right-12 z-[100] w-11 h-11 lg:w-12 lg:h-12 bg-[#0B1C26] border border-[#C9B27C]/40 rounded-full flex items-center justify-center shadow-lg hover:border-[#C9B27C] hover:shadow-[#C9B27C]/20 hover:shadow-xl transition-all duration-300 group"
                    aria-label="Contact us on WhatsApp"
                >
                    <svg className="w-5 h-5 lg:w-5 lg:h-5 text-[#C9B27C] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                </a>
            )}
        </div>
    );
};

export default App;
