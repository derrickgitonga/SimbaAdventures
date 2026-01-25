import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function HeroSection() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videos = [
    "/The enchanted blackforest 🫶… - Schweinbachtal - Calw - Germany   -  more nature vibes   -  exploring the world w-   -.mp4",
    "/mundo.selvagem.wild - 7560162126136921366.mp4"
  ];

  const handleVideoEnd = () => {
    setCurrentVideo((prev) => (prev + 1) % videos.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(err => console.log('Autoplay prevented:', err));
    }
  }, [currentVideo]);

  return (
    <section className="relative min-h-[90vh] flex items-start justify-center overflow-hidden pt-24 md:pt-32">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        className="absolute inset-0 w-full h-full object-cover"
        key={currentVideo}
      >
        <source src={videos[currentVideo]} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="font-heading font-black text-5xl md:text-7xl lg:text-8xl text-white mb-4 leading-tight">
            Discover the
            <span className="block text-accent">Wild Heart of Africa</span>
          </h1>
        </motion.div>
      </div>
    </section>
  );
}
