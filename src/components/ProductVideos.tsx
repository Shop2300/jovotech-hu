// src/components/ProductVideos.tsx
'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  youtubeId: string;
}

const productVideos: Video[] = [
  {
    id: '1',
    title: 'Router CNC - Prezentacja działania',
    youtubeId: '6aLMNgElA6Q'
  },
  {
    id: '2',
    title: 'Laser grawerujący - Test materiałów',
    youtubeId: 'QH4L_qYfavw'
  },
  {
    id: '3',
    title: 'Prasa termotransferowa - Instrukcja',
    youtubeId: 'HqAqr5g76Zg'
  },
  {
    id: '4',
    title: 'Ultradźwięki - Czyszczenie części',
    youtubeId: 'uxWO4eM4nAM'
  },
  {
    id: '5',
    title: 'CNC 3040 - Pierwsze uruchomienie',
    youtubeId: 'DYdiWyO6Ct8'
  },
  {
    id: '6',
    title: 'Laser CO2 - Grawerowanie drewna',
    youtubeId: 'gaeh1sTsI70'
  }
];

export function ProductVideos() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' 
          ? currentScroll - scrollAmount 
          : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-screen-2xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-3 text-center text-black">
          Odkryj nasze filmy produktowe
        </h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Odkryj zalety naszych produktów, dowiedz się jak działają i zainspiruj się do ich używania.
        </p>
        
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 hidden md:block"
            aria-label="Przewiń w lewo"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 hidden md:block"
            aria-label="Przewiń w prawo"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Videos Container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {productVideos.map((video) => (
              <div 
                key={video.id} 
                className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <div className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
                  {/* Video Thumbnail with Play Button Overlay */}
                  <div className="relative aspect-video group cursor-pointer">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.youtubeId}`}
                      title={video.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile scroll indicator */}
        <div className="flex justify-center mt-4 gap-1 md:hidden">
          {productVideos.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-gray-300"
            />
          ))}
        </div>
      </div>
    </section>
  );
}