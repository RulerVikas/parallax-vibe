import { useRef, useEffect, useState } from 'react';
import { Renderer, Program, Triangle, Mesh } from 'ogl';

interface LightRaysProps {
  raysOrigin?: 'top-center' | 'top-left' | 'top-right' | 'center';
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  pulsating?: boolean;
  fadeDistance?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  className?: string;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
};

export const LightRays = ({
  raysOrigin = 'top-center',
  raysColor = '#8a2be2',
  raysSpeed = 1,
  lightSpread = 1,
  rayLength = 2,
  pulsating = false,
  fadeDistance = 1.0,
  followMouse = true,
  mouseInfluence = 0.1,
  className = ''
}: LightRaysProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new Renderer({
      width: window.innerWidth,
      height: window.innerHeight,
      alpha: true,
      dpr: Math.min(window.devicePixelRatio, 2)
    });

    containerRef.current.appendChild(renderer.gl.canvas);

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const vertex = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0, 1);
      }
    `;

    const fragment = `
      precision highp float;
      uniform vec2 uResolution;
      uniform float uTime;
      uniform vec3 uColor;
      uniform vec2 uOrigin;
      uniform float uSpread;
      uniform float uLength;
      uniform float uFade;
      uniform vec2 uMouse;
      uniform float uMouseInfluence;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / uResolution;
        vec2 origin = uOrigin + (uMouse - vec2(0.5)) * uMouseInfluence;
        
        vec2 dir = st - origin;
        float dist = length(dir);
        float angle = atan(dir.y, dir.x);
        
        float rays = sin(angle * 20.0 * uSpread + uTime * 2.0) * 0.5 + 0.5;
        rays = pow(rays, 3.0);
        
        float fade = smoothstep(uLength, 0.0, dist) * smoothstep(0.0, uFade, dist);
        float intensity = rays * fade;
        
        vec3 color = uColor * intensity * 0.4;
        gl_FragColor = vec4(color, intensity * 0.3);
      }
    `;

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [window.innerWidth, window.innerHeight] },
        uColor: { value: hexToRgb(raysColor) },
        uOrigin: { value: [0.5, 1.0] },
        uSpread: { value: lightSpread },
        uLength: { value: rayLength },
        uFade: { value: fadeDistance },
        uMouse: { value: [mousePos.x, mousePos.y] },
        uMouseInfluence: { value: mouseInfluence }
      }
    });

    const geometry = new Triangle(gl);
    const mesh = new Mesh(gl, { geometry, program });

    // Set origin based on prop
    const origins: Record<string, [number, number]> = {
      'top-center': [0.5, 1.0],
      'top-left': [0.0, 1.0],
      'top-right': [1.0, 1.0],
      'center': [0.5, 0.5]
    };
    program.uniforms.uOrigin.value = origins[raysOrigin] || origins['top-center'];

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      program.uniforms.uResolution.value = [window.innerWidth, window.innerHeight];
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (followMouse) {
        setMousePos({
          x: e.clientX / window.innerWidth,
          y: 1 - e.clientY / window.innerHeight
        });
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrame: number;
    const animate = (time: number) => {
      program.uniforms.uTime.value = time * 0.001 * raysSpeed;
      if (pulsating) {
        program.uniforms.uLength.value = rayLength + Math.sin(time * 0.002) * 0.5;
      }
      program.uniforms.uMouse.value = [mousePos.x, mousePos.y];
      
      renderer.render({ scene: mesh });
      animationFrame = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (containerRef.current && renderer.gl.canvas.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.gl.canvas);
      }
    };
  }, [raysOrigin, raysColor, raysSpeed, lightSpread, rayLength, pulsating, fadeDistance, followMouse, mouseInfluence, mousePos]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
      style={{ overflow: 'hidden' }}
    />
  );
};
