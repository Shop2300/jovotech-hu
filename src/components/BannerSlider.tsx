// src/components/BannerSlider.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  link: string | null;
}

interface BannerSliderProps {
  banners: Banner[];
  autoPlay?: boolean;
  interval?: number;
}

export function BannerSlider({ 
  banners, 
  autoPlay = true, 
  interval = 5000 
}: BannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!autoPlay || banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, banners.length, interval]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative overflow-hidden">
      <div className="relative h-[400px] md:h-[600px]">
        {/* Loading skeleton */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />
        )}
        
        {currentBanner.link ? (
          <Link href={currentBanner.link}>
            <BannerContent 
              banner={currentBanner} 
              priority={currentIndex === 0}
              onLoad={() => setIsLoading(false)} 
            />
          </Link>
        ) : (
          <BannerContent 
            banner={currentBanner} 
            priority={currentIndex === 0}
            onLoad={() => setIsLoading(false)} 
          />
        )}
      </div>

      {banners.length > 1 && (
        <>
          {/* Navigation buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition"
            aria-label="Previous banner"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition"
            aria-label="Next banner"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition ${
                  index === currentIndex ? 'bg-white w-8' : 'bg-white/50'
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function BannerContent({ 
  banner, 
  priority = false,
  onLoad 
}: { 
  banner: Banner;
  priority?: boolean;
  onLoad?: () => void;
}) {
  return (
    <div className="relative h-full">
      <Image
        src={banner.imageUrl}
        alt={banner.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1920px"
        className="object-cover"
        priority={priority}
        quality={85}
        onLoad={onLoad}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent">
        <div className="w-full h-full flex items-center">
          <div className="max-w-screen-2xl mx-auto px-6 w-full">
            <div className="text-white max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-bold mb-4">
                {banner.title}
              </h2>
              {banner.subtitle && (
                <p className="text-xl md:text-2xl">
                  {banner.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}