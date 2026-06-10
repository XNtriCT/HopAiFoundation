import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ScrollCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const totalFrames = 240;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Preload all frames
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    // Object to tween for playhead
    const playhead = { frame: 0 };

    // Load first frame instantly to show something right away
    const firstImg = new Image();
    firstImg.src = `/video-frames/ezgif-frame-001.jpg`;
    
    const drawFrame = (img: HTMLImageElement) => {
      if (!canvas || !ctx) return;
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

    firstImg.onload = () => {
      if (playhead.frame === 0) {
        drawFrame(firstImg);
      }
    };

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const currentFrameIndex = Math.round(playhead.frame);
      const currentImg = images[currentFrameIndex] || firstImg;
      if (currentImg && (currentImg.complete || currentImg === firstImg)) {
        drawFrame(currentImg);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.2, // fast response scrub
      onUpdate: (self) => {
        // Calculate raw frame progress based on scroll position
        const frameIndex = Math.round(self.progress * (totalFrames - 1));
        playhead.frame = frameIndex;

        let img = images[frameIndex];
        if (img && img.complete && img.naturalWidth > 0) {
          drawFrame(img);
        } else {
          // Find closest loaded frame to avoid black flickers
          let closestImg = null;
          let minDiff = Infinity;
          for (let i = 0; i < totalFrames; i++) {
            const tempImg = images[i];
            if (tempImg && tempImg.complete && tempImg.naturalWidth > 0) {
              const diff = Math.abs(i - frameIndex);
              if (diff < minDiff) {
                minDiff = diff;
                closestImg = tempImg;
              }
            }
          }
          if (closestImg) {
            drawFrame(closestImg);
          } else if (firstImg.complete) {
            drawFrame(firstImg);
          }
        }
      }
    });

    // Start background preloading
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const idx = i.toString().padStart(3, '0');
      img.src = `/video-frames/ezgif-frame-${idx}.jpg`;
      img.onload = () => {
        loadedCount++;
        const prog = Math.round((loadedCount / totalFrames) * 100);
        setLoadingProgress(prog);
        if (loadedCount === totalFrames) {
          setLoaded(true);
        }

        // If this loaded frame is the current frame, draw it
        const currentFrameIndex = Math.round(playhead.frame);
        if (i - 1 === currentFrameIndex) {
          drawFrame(img);
        }
      };
      images.push(img);
    }
    framesRef.current = images;

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      scrollTriggerInstance.kill();
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-full object-cover opacity-45 dark:opacity-55 mix-blend-normal" />
        {/* Soft vignette/color overlay blending it nicely */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/30 to-background/80 pointer-events-none" />
      </div>
      
      {/* Subtle bottom-right loader for first visit */}
      {!loaded && loadingProgress < 95 && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-secondary/10 backdrop-blur-md px-4 py-2 rounded-full border border-secondary/20 transition-opacity duration-500">
          <div className="w-4.5 h-4.5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-xs font-mono font-bold text-foreground">
            Loading: {loadingProgress}%
          </span>
        </div>
      )}
    </>
  );
}
