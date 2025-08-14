// src/components/ProductVideos.tsx
'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface VideoData {
  id: string;
  title: string;
  youtubeId: string;
}

const productVideos: VideoData[] = [
  {
    id: '1',
    title: 'Product Video 1',
    youtubeId: '6aLMNgElA6Q'
  },
  {
    id: '2',
    title: 'Product Video 2',
    youtubeId: 'QH4L_qYfavw'
  },
  {
    id: '3',
    title: 'Product Video 3',
    youtubeId: 'HqAqr5g76Zg'
  },
  {
    id: '4',
    title: 'Product Video 4',
    youtubeId: 'uxWO4eM4nAM'
  },
  {
    id: '5',
    title: 'Product Video 5',
    youtubeId: 'DYdiWyO6Ct8'
  },
  {
    id: '6',
    title: 'Product Video 6',
    youtubeId: 'gaeh1sTsl70'
  }
];

interface VideoThumbnailProps {
  video: VideoData;
}

function VideoThumbnail({ video }: VideoThumbnailProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (isLoaded) {
    return (
      <div className="relative w-full h-full">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
          title={video.title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;

  return (
    <div
      className="relative w-full h-full cursor-pointer group overflow-hidden bg-gray-900"
      onClick={() => setIsLoaded(true)}
    >
      {!imageError ? (
        <Image
          src={thumbnailUrl}
          alt={video.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          quality={75}
          onError={() => setImageError(true)}
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 bg-gray-800" />
      )}
      
      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-red-600 bg-opacity-90 rounded-full p-4 shadow-2xl transform group-hover:scale-110 transition-transform">
          <Play className="w-8 h-8 text-white fill-white ml-0.5" />
        </div>
      </div>
    </div>
  );
}

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
          Fedezze fel termékvideóinkat
        </h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Fedezze fel termékeink előnyeit, ismerje meg működésüket és inspirálódjon használatukhoz.
        </p>

        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 hidden md:block"
            aria-label="Görgetés balra"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 hidden md:block"
            aria-label="Görgetés jobbra"
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
                  <div className="relative aspect-video bg-black">
                    <VideoThumbnail video={video} />
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