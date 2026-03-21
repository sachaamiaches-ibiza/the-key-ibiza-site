// src/components/VillaDetailSkeleton.tsx
import React from 'react';

const VillaDetailSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col animate-pulse bg-[#0B1C26] min-h-screen">
      {/* Hero Section Placeholder */}
      <div className="w-full h-[60vh] md:h-[80vh] bg-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C26] to-transparent opacity-80" />
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10 space-y-8 md:space-y-12 pb-20">
        {/* Title & Info Skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-32 bg-white/10 rounded-full mx-auto md:mx-0" /> {/* Location */}
          <div className="h-10 md:h-14 w-3/4 max-w-2xl bg-white/10 rounded-xl mx-auto md:mx-0" /> {/* Title */}
          <div className="flex gap-4 justify-center md:justify-start">
             <div className="h-6 w-20 bg-white/10 rounded-full" />
             <div className="h-6 w-20 bg-white/10 rounded-full" />
             <div className="h-6 w-20 bg-white/10 rounded-full" />
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Description Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <div className="h-4 w-full bg-white/5 rounded" />
              <div className="h-4 w-full bg-white/5 rounded" />
              <div className="h-4 w-3/4 bg-white/5 rounded" />
            </div>
            
            {/* Amenities Grid Skeleton */}
            <div className="grid grid-cols-2 gap-4 mt-8">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="h-12 bg-white/5 rounded-xl border border-white/5" />
               ))}
            </div>
          </div>

          {/* Sticky Sidebar / Booking Form Skeleton */}
          <div className="hidden md:block">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6 h-96">
               <div className="h-8 w-1/2 bg-white/10 rounded" />
               <div className="space-y-4">
                 <div className="h-12 w-full bg-white/5 rounded-xl" />
                 <div className="h-12 w-full bg-white/5 rounded-xl" />
               </div>
               <div className="h-12 w-full bg-luxury-gold/20 rounded-full mt-auto" />
            </div>
          </div>
        </div>

        {/* Calendar Section Skeleton */}
        <div className="space-y-6 py-8 border-t border-white/10">
           <div className="h-8 w-48 bg-white/10 rounded mx-auto" />
           <div className="h-64 w-full bg-white/5 rounded-2xl border border-white/5" />
        </div>

      </div>
    </div>
  );
};

export default VillaDetailSkeleton;

