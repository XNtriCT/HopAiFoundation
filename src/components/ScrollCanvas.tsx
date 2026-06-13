import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ScrollCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const totalFrames = 192;
    const images: HTMLImageElement[] = [];
    const playhead = { frame: 0 };
    let loadedCount = 0;
    let isUnmounted = false;
    let playheadTween: gsap.core.Tween | null = null;
    let scrollTriggerInstance: ScrollTrigger | null = null;

    const drawFrame = (img: HTMLImageElement) => {
      if (isUnmounted || !canvas || !ctx) return;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgWidth = img.naturalWidth || img.width || 1920;
      const imgHeight = img.naturalHeight || img.height || 1080;

      const canvasRatio = canvasWidth / canvasHeight;
      const imgRatio = imgWidth / imgHeight;

      let drawWidth = canvasWidth;
      let drawHeight = canvasHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        drawHeight = drawWidth / imgRatio;
        offsetY = (canvasHeight - drawHeight) / 2;
      } else {
        drawWidth = drawHeight * imgRatio;
        offsetX = (canvasWidth - drawWidth) / 2;
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    const initGSAPAnimation = () => {
      if (isUnmounted) return;

      // Draw first frame immediately once loaded
      if (images[0]) {
        drawFrame(images[0]);
      }

      // Animate custom playhead index with GSAP tween
      playheadTween = gsap.to(playhead, {
        frame: totalFrames - 1,
        ease: 'none',
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1, // inertia catch-up
        },
        onUpdate: () => {
          const frameIndex = Math.round(playhead.frame);
          const img = images[frameIndex];
          if (img && img.complete) {
            drawFrame(img);
          }
        }
      });

      scrollTriggerInstance = playheadTween.scrollTrigger || null;

      // Recalculate ScrollTrigger measurements after loading
      setTimeout(() => {
        if (!isUnmounted) {
          ScrollTrigger.refresh();
        }
      }, 100);
    };

    const handleImageLoad = () => {
      if (isUnmounted) return;
      loadedCount++;
      const prog = Math.round((loadedCount / totalFrames) * 100);
      setLoadingProgress(prog);

      if (loadedCount === totalFrames) {
        setLoaded(true);
        initGSAPAnimation();
      }
    };

    const handleImageError = () => {
      // Even if loading fails for a frame, count it to prevent blocking initialization
      handleImageLoad();
    };

    // Preload all WebP frames into memory on mount
    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      const idx = String(i).padStart(6, '0');
      img.src = `/webp_frames/frame_${idx}.webp`;
      img.onload = handleImageLoad;
      img.onerror = handleImageError;
      images.push(img);
    }

    const resizeCanvas = () => {
      if (!canvas || isUnmounted) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Draw the current playhead frame
      const currentFrameIndex = Math.round(playhead.frame);
      const currentImg = images[currentFrameIndex];
      if (currentImg && currentImg.complete) {
        drawFrame(currentImg);
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // initial sizing

    return () => {
      isUnmounted = true;
      window.removeEventListener('resize', resizeCanvas);
      if (playheadTween) {
        playheadTween.kill();
      }
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
    };
  }, []);

  return (
    <>
      <div 
        className="fixed inset-0 w-full h-full z-0 pointer-events-none"
        style={{ transition: 'none' }}
      >
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-cover opacity-45 dark:opacity-55 mix-blend-normal"
          style={{ transition: 'none', willChange: 'transform' }}
        />
        {/* Soft vignette/color overlay blending it nicely */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/30 to-background/80 pointer-events-none"
          style={{ transition: 'none' }}
        />
      </div>
      
      {/* Premium, neural-themed glassmorphic loader overlay */}
      {!loaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md transition-opacity duration-700 ease-out">
          <div className="flex flex-col items-center gap-6 p-8 rounded-2xl liquid-glass max-w-sm w-full mx-4">
            <div className="relative w-16 h-16 flex items-center justify-center">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
              {/* Inner spinning ring */}
              <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              {/* Center dot */}
              <div className="absolute w-3 h-3 bg-primary rounded-full" />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="font-display text-lg font-bold tracking-wider text-foreground">
                INITIALIZING SYSTEM
              </h3>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                Caching Neural Assets
              </p>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full bg-secondary/15 h-1.5 rounded-full overflow-hidden border border-secondary/5">
              <div 
                className="bg-primary h-full transition-all duration-100 ease-out shadow-[0_0_8px_rgba(114,191,74,0.6)]"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>

            <div className="flex justify-between w-full text-[10px] font-mono font-bold text-muted-foreground">
              <span>SYSTEM ONLINE</span>
              <span className="text-primary">{loadingProgress}%</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
