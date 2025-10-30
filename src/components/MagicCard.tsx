import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
  particleCount?: number;
  spotlightRadius?: number;
  glowColor?: string;
}

export const MagicCard = ({
  children,
  className = '',
  particleCount = 12,
  spotlightRadius = 300,
  glowColor = '132, 0, 255'
}: MagicCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const card = cardRef.current;
    const canvas = canvasRef.current;
    if (!card || !canvas) return;

    const updateDimensions = () => {
      const rect = card.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Particle system
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;

      constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      update(width: number, height: number) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${glowColor}, ${this.opacity})`;
        ctx.fill();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(dimensions.width, dimensions.height));
    }

    let mouseX = -1000;
    let mouseY = -1000;
    let animationId: number;

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw spotlight
      if (mouseX > 0 && mouseY > 0) {
        const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, spotlightRadius);
        gradient.addColorStop(0, `rgba(${glowColor}, 0.15)`);
        gradient.addColorStop(0.5, `rgba(${glowColor}, 0.05)`);
        gradient.addColorStop(1, 'rgba(132, 0, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Update and draw particles
      particles.forEach(particle => {
        particle.update(canvas.width, canvas.height);
        particle.draw(ctx);
      });

      animationId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      // Update CSS variable for glow position
      card.style.setProperty('--glow-x', `${mouseX}px`);
      card.style.setProperty('--glow-y', `${mouseY}px`);
      card.style.setProperty('--glow-intensity', '1');
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
      card.style.setProperty('--glow-intensity', '0');
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    animate();

    return () => {
      window.removeEventListener('resize', updateDimensions);
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, [dimensions.width, dimensions.height, particleCount, spotlightRadius, glowColor]);

  return (
    <div
      ref={cardRef}
      className={`magic-card ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        '--glow-x': '50%',
        '--glow-y': '50%',
        '--glow-intensity': '0',
        '--glow-radius': `${spotlightRadius}px`,
      } as React.CSSProperties}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{ opacity: 0.8 }}
      />
      <div className="relative z-10">{children}</div>
      <div
        className="magic-card-glow"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          background: `radial-gradient(circle ${spotlightRadius}px at var(--glow-x) var(--glow-y), rgba(${glowColor}, 0.2), transparent)`,
          opacity: 'var(--glow-intensity)',
          transition: 'opacity 0.3s ease',
        }}
      />
    </div>
  );
};
