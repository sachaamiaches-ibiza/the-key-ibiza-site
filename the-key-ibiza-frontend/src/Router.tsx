import React, {useState} from 'react';
import {Routes, Route, Navigate, useParams} from 'react-router-dom';
import {Language, Villa} from './types';
import {nameToUrlSlug, SUPPORTED_LANG_PREFIXES} from './utils/urlHelpers';

// Components
import HomePage from './components/HomePage';
import ServicesPageNew from './components/ServicesPageNew';
import PhotographerPage from './components/PhotographerPage';
import AboutPage from './components/AboutPage';
import BlogPage from './components/BlogPage';
import BlogArticlePage from './components/BlogArticlePage';
import VillaDetailPage from './components/VillaDetailPage';
import VillaListingPage from './components/VillaListingPage';
import ValerieDetail from './components/ValerieDetail';
import FrancescaDetail from './components/FrancescaDetail';
import AdminDashboard from './components/AdminDashboard';
import InstagramCreator from './components/InstagramCreator';
import ComingSoon from './components/ComingSoon';
import BoatsPage from './components/BoatsPage';
import YachtsPage from './components/YachtsPage';
import YachtDetailPage from './components/YachtDetailPage';
import CatamaransPage from './components/CatamaransPage';
import VillasPage from './components/VillasPage';
import ServiceDetail from './components/ServiceDetail';
import WishlistPage from './components/WishlistPage';

// --- Types ---
interface AppRouterProps {
    lang: Language;
    onNavigate: (view: any, ...args: any[]) => void;
    onOpenContact: () => void;

    // Data & State
    villas: Villa[];
    isVip: boolean;
    allVillas: Villa[];
    directVilla: Villa | null;
    villasLoading: boolean;

    // Wishlist
    isInWishlist: (id: string) => boolean;
    onWishlistToggle: (villaSlug: string) => void;

    // Search State
    searchCheckIn: string;
    searchCheckOut: string;
    handleSearchDatesChange: (checkIn: string, checkOut: string) => void;
    yachtSearchDate: string;
    setYachtSearchDate: (date: string) => void;

    // Detail State
    selectedYacht: any;
    yachtLoading: boolean;

    // VIP Auth
    verifiedVillaSlugs: string[];
    setVerifiedVillaSlugs: React.Dispatch<React.SetStateAction<string[]>>;
}


// Wrapper to handle language prefix logic inside Routes
const LangWrapper: React.FC<{
    component: React.ComponentType<any>;
    langProp?: Language;
    [key: string]: any;
}> = ({component: Component, langProp, ...rest}) => {
    const {lang: paramLang} = useParams<{ lang?: Language }>();

    // Allow any lang param, but fallback effectively
    const effectiveLang = (paramLang && SUPPORTED_LANG_PREFIXES.includes(paramLang as any))
        ? (paramLang as Language)
        : (langProp || 'en');

    return <Component lang={effectiveLang} {...rest} />;
};

// --- Wrapper Components for Details ---

const VillaDetailRoute: React.FC<AppRouterProps> = (props) => {
    const {slug} = useParams<{ slug: string }>();
    const villaUrlSlug = slug || '';
    const {
        allVillas,
        directVilla,
        villasLoading,
        onNavigate,
        lang,
        isVip,
        verifiedVillaSlugs,
        setVerifiedVillaSlugs
    } = props;

    const [villaPassword, setVillaPassword] = useState('');
    const [villaPasswordError, setVillaPasswordError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    const isReady = !villasLoading && (directVilla || allVillas.length > 0);

    const villa = directVilla || allVillas.find(v => nameToUrlSlug(v.name) === villaUrlSlug)
        || allVillas.find(v => v.id === villaUrlSlug || v.id === `invenio-${villaUrlSlug}`);

    if (!isReady) {
        return (
            <div className="pt-40 pb-20 min-h-screen" style={{backgroundColor: '#0B1C26'}}>
                <div className="container mx-auto px-6 text-center">
                    <div
                        className="w-12 h-12 border-2 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white/60">Loading villa...</p>
                </div>
            </div>
        );
    }

    if (villa) {
        const requiresPasswordAccess = (villa as any).requiresPassword === true
            && !verifiedVillaSlugs.includes(villaUrlSlug);

        if (requiresPasswordAccess) {
            return (
                <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: '#0A0E14'}}>
                    <div className="relative w-full max-w-md p-8 rounded-[24px] border border-luxury-gold/20"
                         style={{background: 'linear-gradient(145deg, #0B1C26 0%, #0A0E14 100%)'}}>
                        <h2 className="text-2xl font-serif text-white mb-2 text-center">VIP Access Required</h2>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            setVillaPasswordError('');
                            setIsVerifying(true);
                            try {
                                const res = await fetch('https://the-key-ibiza-backend.vercel.app/vip/verify-villa-password', {
                                    method: 'POST', body: JSON.stringify({password: villaPassword})
                                });
                                if ((await res.json()).success) {
                                    setVerifiedVillaSlugs(prev => [...prev, villaUrlSlug]);
                                } else setVillaPasswordError('Invalid access code');
                            } catch {
                                setVillaPasswordError('Connection error');
                            }
                            setIsVerifying(false);
                        }} className="space-y-4">
                            <input type="password" value={villaPassword}
                                   onChange={e => setVillaPassword(e.target.value)}
                                   className="w-full px-4 py-3 bg-white/5 text-white" placeholder="Code"/>
                            {villaPasswordError &&
                                <p className="text-red-400 text-xs text-center">{villaPasswordError}</p>}
                            <button type="submit" disabled={isVerifying}
                                    className="w-full py-3 bg-luxury-gold text-luxury-blue font-semibold uppercase tracking-widest hover:bg-white transition-colors">
                                {isVerifying ? 'Checking...' : 'Access'}
                            </button>
                        </form>
                    </div>
                </div>
            );
        }

        return (
            <VillaDetailPage
                villa={villa}
                onNavigate={onNavigate}
                lang={lang}
                initialCheckIn={props.searchCheckIn}
                initialCheckOut={props.searchCheckOut}
                onDatesChange={props.handleSearchDatesChange}
                isVip={isVip}
            />
        );
    }

    return (
        <div className="pt-40 pb-20 min-h-screen" style={{backgroundColor: '#0B1C26'}}>
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-4xl font-serif text-white mb-4">Villa Not Found</h1>
                <button onClick={() => onNavigate('villas-holiday')}
                        className="px-8 py-3 bg-luxury-gold text-luxury-blue">All Villas
                </button>
            </div>
        </div>
    );
};

const YachtDetailRoute: React.FC<AppRouterProps> = ({
                                                        selectedYacht,
                                                        yachtLoading,
                                                        onNavigate,
                                                        lang,
                                                        yachtSearchDate,
                                                        setYachtSearchDate
                                                    }) => {
    // Logic relies on App.tsx fetching based on URL location or state. 
    // Ideally this component should fetch its own data based on useParams() id, like VillaDetailRoute.
    // For now, we reuse props to minimize refactor risk, assuming App.tsx syncs state.

    if (yachtLoading) return <div className="pt-40 text-center text-white">Loading...</div>;
    if (selectedYacht) return <YachtDetailPage yacht={selectedYacht} onNavigate={onNavigate} lang={lang}
                                               initialDate={yachtSearchDate} onDateChange={setYachtSearchDate}/>;
    return <div className="pt-40 text-center text-white">Yacht Not Found</div>;
};

const BlogDetailRoute: React.FC<AppRouterProps> = ({onNavigate, lang}) => {
    const {slug} = useParams<{ slug: string }>();
    return <BlogArticlePage slug={slug!} onNavigate={onNavigate} lang={lang}/>;
};

const ServiceGenericRoute: React.FC<AppRouterProps & { serviceId?: string }> = ({onNavigate, lang, serviceId}) => {
    // If serviceId prop is passed (static route), use it. Else extract from URL if needed.
    return <ServiceDetail serviceId={serviceId!} onNavigate={onNavigate} lang={lang}/>;
};


// --- Main Router ---

const AppRouter: React.FC<AppRouterProps> = (props) => {
    const {
        onNavigate,
        lang,
        searchCheckIn,
        searchCheckOut,
        handleSearchDatesChange,
        yachtSearchDate,
        setYachtSearchDate
    } = props;

    // Common props shorthand
    const common = {
        onNavigate,
        lang,
        villas: props.villas,
        isVip: props.isVip,
        isInWishlist: props.isInWishlist,
        onWishlistToggle: props.onWishlistToggle,
    };

    const listProps = {
        ...common,
        initialCheckIn: searchCheckIn,
        initialCheckOut: searchCheckOut,
        onDatesChange: handleSearchDatesChange
    };
    const yachtProps = {...common, initialDate: yachtSearchDate, onDateChange: setYachtSearchDate};

    return (
        <Routes>
            {/* --- Home & Static Pages --- */}
            <Route path="/" element={<HomePage {...common} onOpenContact={props.onOpenContact}/>}/>
            <Route path="/services" element={<ServicesPageNew {...common} />}/>
            <Route path="/photographer" element={<PhotographerPage {...common} />}/>
            <Route path="/about" element={<AboutPage {...common} />}/>
            <Route path="/blog" element={<BlogPage {...common} />}/>
            <Route path="/contact" element={<HomePage {...common} onOpenContact={props.onOpenContact}/>}/>

            {/* --- Specific Detail Pages --- */}
            <Route path="/valerie-detail" element={<ValerieDetail {...common} />}/>
            <Route path="/francesca-detail" element={<FrancescaDetail {...common} />}/>

            {/* --- Listings --- */}
            <Route path="/holiday-rentals" element={<VillaListingPage {...listProps} category="villas-holiday"/>}/>
            <Route path="/long-term" element={<ComingSoon title="Long Term Rentals" {...common} />}/>
            <Route path="/for-sale" element={<ComingSoon title="Properties for Sale" {...common} />}/>

            <Route path="/villas" element={<VillasPage {...common} />}/>
            <Route path="/boats" element={<BoatsPage {...common} />}/>
            <Route path="/charters" element={<BoatsPage {...common} />}/>
            <Route path="/yachts" element={<YachtsPage {...yachtProps} />}/>
            <Route path="/catamarans" element={<CatamaransPage {...common} />}/>

            {/* --- Admin --- */}
            <Route path="/admin-dashboard" element={<AdminDashboard onNavigate={onNavigate}/>}/>
            <Route path="/instagram-creator" element={<InstagramCreator onNavigate={onNavigate}/>}/>

            {/* --- Dynamic Routes (Clean Paths) --- */}
            <Route path="/villa/:slug" element={<VillaDetailRoute {...props} />}/>
            <Route path="/yacht/:id" element={<YachtDetailRoute {...props} />}/>
            <Route path="/blog/:slug" element={<BlogDetailRoute {...props} />}/>
            <Route path="/wishlist/:code" element={<WishlistPage shareCode="" onNavigate={onNavigate} lang={lang}/>}/>

            {/* --- Generic Services --- */}
            {['security', 'wellness', 'nightlife', 'events', 'catering', 'furniture', 'health', 'yoga', 'cleaning', 'driver', 'deliveries', 'babysitting'].map(s => (
                <Route key={s} path={`/${s}`} element={<ServiceGenericRoute {...props} serviceId={s}/>}/>
            ))}


            {/* ================================================================================== */}
            {/* LOCALIZED ROUTES                                                                   */}
            {/* ================================================================================== */}

            <Route path="/:lang"
                   element={<LangWrapper component={HomePage} {...common} onOpenContact={props.onOpenContact}/>}/>
            <Route path="/:lang/services" element={<LangWrapper component={ServicesPageNew} {...common} />}/>
            <Route path="/:lang/photographer" element={<LangWrapper component={PhotographerPage} {...common} />}/>
            <Route path="/:lang/about" element={<LangWrapper component={AboutPage} {...common} />}/>
            <Route path="/:lang/blog" element={<LangWrapper component={BlogPage} {...common} />}/>

            <Route path="/:lang/valerie-detail" element={<LangWrapper component={ValerieDetail} {...common} />}/>
            <Route path="/:lang/francesca-detail" element={<LangWrapper component={FrancescaDetail} {...common} />}/>

            <Route path="/:lang/holiday-rentals"
                   element={<LangWrapper component={VillaListingPage} {...listProps} category="villas-holiday"/>}/>
            <Route path="/:lang/long-term"
                   element={<LangWrapper component={ComingSoon} title="Long Term Rentals" {...common} />}/>
            <Route path="/:lang/for-sale"
                   element={<LangWrapper component={ComingSoon} title="Properties for Sale" {...common} />}/>

            <Route path="/:lang/villas" element={<LangWrapper component={VillasPage} {...common} />}/>
            <Route path="/:lang/boats" element={<LangWrapper component={BoatsPage} {...common} />}/>
            <Route path="/:lang/charters" element={<LangWrapper component={BoatsPage} {...common} />}/>
            <Route path="/:lang/yachts" element={<LangWrapper component={YachtsPage} {...yachtProps} />}/>
            <Route path="/:lang/catamarans" element={<LangWrapper component={CatamaransPage} {...common} />}/>

            {/* Clean Dynamic Routes with Lang */}
            <Route path="/:lang/villa/:slug" element={<LangWrapper component={VillaDetailRoute} {...props} />}/>
            <Route path="/:lang/yacht/:id" element={<LangWrapper component={YachtDetailRoute} {...props} />}/>
            <Route path="/:lang/blog/:slug" element={<LangWrapper component={BlogDetailRoute} {...props} />}/>

            {/* Generic Services with Lang */}
            {['security', 'wellness', 'nightlife', 'events', 'catering', 'furniture', 'health', 'yoga', 'cleaning', 'driver', 'deliveries', 'babysitting'].map(s => (
                <Route key={`lang-${s}`} path={`/:lang/${s}`}
                       element={<LangWrapper component={ServiceGenericRoute} {...props} serviceId={s}/>}/>
            ))}

            {/* Legacy Fallbacks (optional, to catch old links during migration) */}
            <Route path="/villa-:slug" element={<Navigate to="/villa/:slug" replace/>}/>
            <Route path="/yacht-:id" element={<Navigate to="/yacht/:id" replace/>}/>
            <Route path="/blog-:slug" element={<Navigate to="/blog/:slug" replace/>}/>

            <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
    );
};

export default AppRouter;

