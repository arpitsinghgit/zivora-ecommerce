import { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, RefreshCw, Leaf, Sparkles } from 'lucide-react';

interface HeroProps {
  onExplore: (category: 'all' | 'press-on' | 'polish' | 'art-care') => void;
}

export default function Hero({ onExplore }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: '/hero/hero_press_on.png',
      tagline: 'The Ultimate Salon-Quality Press-On Nails',
      title: 'Glazed & Glamorous at Your Fingertips',
      subtitle: 'Achieve pristine, mirror-glazed manicures in under 10 minutes. Reusable, non-damaging, and lasts up to 14 days.',
      ctaText: 'Shop Press-Ons',
      category: 'press-on' as const,
    },
    {
      id: 2,
      image: '/hero/hero_gel_polish.png',
      tagline: '10-Free, Cruelty-Free Gel Polish Formula',
      title: 'Rich Pigment. Infinite Shine.',
      subtitle: 'Indulge in vibrant, streak-free gel shades that cure in 60 seconds and deliver professional chip-resistant wear for up to 3 weeks.',
      ctaText: 'Explore Gel Shades',
      category: 'polish' as const,
    },
    {
      id: 3,
      image: '/hero/hero_nail_care.png',
      tagline: 'Professional Accessories & Nail Care',
      title: 'Elevate Your Nail Ritual',
      subtitle: 'From Smart UV lamps to cold-pressed botanical cuticle elixirs, unlock the secrets of premium salon care at home.',
      ctaText: 'Shop Nail Care',
      category: 'art-care' as const,
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative flex flex-col">
      {/* Slider Hero */}
      <div className="relative h-[480px] sm:h-[600px] bg-zinc-100 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image with elegant overlay */}
            <div className="absolute inset-0 bg-neutral-900/30 mix-blend-multiply z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-[6000ms]"
            />

            {/* Slide Content */}
            <div className="absolute inset-0 flex items-center z-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-xl text-white space-y-4 sm:space-y-6">
                  <span className="inline-flex items-center space-x-1 text-xs font-semibold tracking-[0.2em] text-amber-200 uppercase bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 animate-fade-in">
                    <Sparkles className="w-3 h-3" />
                    <span>{slide.tagline}</span>
                  </span>
                  
                  <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                    {slide.title}
                  </h1>
                  
                  <p className="text-sm sm:text-base text-zinc-100/90 font-light leading-relaxed max-w-lg">
                    {slide.subtitle}
                  </p>
                  
                  <div className="pt-2 flex flex-wrap gap-4">
                    <button
                      onClick={() => onExplore(slide.category)}
                      className="px-7 py-3.5 bg-white text-zinc-950 hover:bg-rose-50 hover:scale-102 font-medium text-xs tracking-wider uppercase rounded-full shadow-lg transition-all duration-200 flex items-center space-x-2 cursor-pointer"
                    >
                      <span>{slide.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    
                    <button
                      onClick={() => onExplore('all')}
                      className="px-7 py-3.5 bg-black/40 hover:bg-black/60 text-white font-medium text-xs tracking-wider uppercase rounded-full border border-white/20 hover:border-white/40 transition-colors duration-200 cursor-pointer backdrop-blur-xs"
                    >
                      View Catalog
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white border border-white/10 backdrop-blur-xs transition-colors duration-150 z-30 cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white border border-white/10 backdrop-blur-xs transition-colors duration-150 z-30 cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2.5 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Brand Value Pillars */}
      <div className="bg-rose-50/50 py-6 border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            
            <div className="flex flex-col items-center space-y-1.5 p-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-900">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-semibold tracking-wider text-zinc-900 uppercase">Vegan & Cruelty-Free</h3>
              <p className="text-[11px] text-zinc-500 max-w-xs">
                10-free certified toxin-free ingredients safe for nails, cuticles, and the environment.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-1.5 p-3 border-t md:border-t-0 md:border-x border-rose-100">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-900">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-semibold tracking-wider text-zinc-900 uppercase">14-Day Chip-Proof Strength</h3>
              <p className="text-[11px] text-zinc-500 max-w-xs">
                Reinforced polymer tech keeps press-ons intact and polishes shining like freshly cured acrylic.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-1.5 p-3 border-t md:border-t-0">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-900">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-semibold tracking-wider text-zinc-900 uppercase">Reusable & Easy Fit</h3>
              <p className="text-[11px] text-zinc-500 max-w-xs">
                Carefully remove to re-wear up to 5 times. Over 30 tips per kit for customized snug matching.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
