import { useEffect, useRef } from 'react';

interface SplashCursorProps {
  simResolution?: number;
  dyeResolution?: number;
  densityDissipation?: number;
  velocityDissipation?: number;
  pressure?: number;
  curl?: number;
  splatRadius?: number;
  splatForce?: number;
  colorUpdateSpeed?: number;
  transparent?: boolean;
}

export const SplashCursor = ({
  simResolution = 128,
  dyeResolution = 1024,
  densityDissipation = 3.5,
  velocityDissipation = 2,
  pressure = 0.1,
  curl = 3,
  splatRadius = 0.2,
  splatForce = 6000,
  colorUpdateSpeed = 10,
  transparent = true
}: SplashCursorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return;

    let width: number, height: number;
    const resizeCanvas = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const getWebGLContext = () => gl;
    const ext = gl.getExtension('OES_texture_float_linear');

    // Shaders
    const vertexShader = `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const splatShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `;

    const displayShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      void main () {
        vec3 C = texture2D(uTexture, vUv).rgb;
        gl_FragColor = vec4(C, 1.0);
      }
    `;

    const advectionShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform float dt;
      uniform float dissipation;
      void main () {
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        gl_FragColor = dissipation * texture2D(uSource, coord);
      }
    `;

    // Simple program creation
    const createProgram = (vertexSrc: string, fragmentSrc: string) => {
      const program = gl.createProgram()!;
      const vs = gl.createShader(gl.VERTEX_SHADER)!;
      const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
      
      gl.shaderSource(vs, vertexSrc);
      gl.compileShader(vs);
      gl.shaderSource(fs, fragmentSrc);
      gl.compileShader(fs);
      
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      
      return program;
    };

    const programs = {
      splat: createProgram(vertexShader, splatShader),
      display: createProgram(vertexShader, displayShader),
      advection: createProgram(vertexShader, advectionShader)
    };

    // Buffer setup
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);

    let pointers: any[] = [];
    let splatStack: any[] = [];

    const updatePointerDownData = (pointer: any, id: number, posX: number, posY: number) => {
      pointer.id = id;
      pointer.down = true;
      pointer.moved = false;
      pointer.texcoordX = posX / canvas.width;
      pointer.texcoordY = 1.0 - posY / canvas.height;
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.deltaX = 0;
      pointer.deltaY = 0;
      pointer.color = [Math.random() * 0.3 + 0.5, Math.random() * 0.3 + 0.2, Math.random() * 0.3 + 0.7];
    };

    pointers.push({
      id: -1,
      texcoordX: 0,
      texcoordY: 0,
      prevTexcoordX: 0,
      prevTexcoordY: 0,
      deltaX: 0,
      deltaY: 0,
      down: false,
      moved: false,
      color: [0, 0, 0]
    });

    canvas.addEventListener('mousedown', (e) => {
      const pointer = pointers[0];
      updatePointerDownData(pointer, -1, e.offsetX, e.offsetY);
    });

    canvas.addEventListener('mousemove', (e) => {
      const pointer = pointers[0];
      if (pointer.down) {
        const posX = e.offsetX;
        const posY = e.offsetY;
        pointer.prevTexcoordX = pointer.texcoordX;
        pointer.prevTexcoordY = pointer.texcoordY;
        pointer.texcoordX = posX / canvas.width;
        pointer.texcoordY = 1.0 - posY / canvas.height;
        pointer.deltaX = (pointer.texcoordX - pointer.prevTexcoordX) * splatForce;
        pointer.deltaY = (pointer.texcoordY - pointer.prevTexcoordY) * splatForce;
        pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
      }
    });

    canvas.addEventListener('mouseup', () => {
      pointers[0].down = false;
    });

    // Simple animation loop
    const render = () => {
      gl.viewport(0, 0, width, height);
      gl.clearColor(0, 0, 0, transparent ? 0 : 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      pointers.forEach(pointer => {
        if (pointer.moved) {
          gl.useProgram(programs.splat);
          gl.uniform1i(gl.getUniformLocation(programs.splat, 'uTarget'), 0);
          gl.uniform1f(gl.getUniformLocation(programs.splat, 'aspectRatio'), width / height);
          gl.uniform2f(gl.getUniformLocation(programs.splat, 'point'), pointer.texcoordX, pointer.texcoordY);
          gl.uniform3f(gl.getUniformLocation(programs.splat, 'color'), pointer.color[0], pointer.color[1], pointer.color[2]);
          gl.uniform1f(gl.getUniformLocation(programs.splat, 'radius'), splatRadius / 100);
          
          const posAttrib = gl.getAttribLocation(programs.splat, 'aPosition');
          gl.enableVertexAttribArray(posAttrib);
          gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);
          gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
          
          pointer.moved = false;
        }
      });

      requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [simResolution, dyeResolution, densityDissipation, velocityDissipation, pressure, curl, splatRadius, splatForce, colorUpdateSpeed, transparent]);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ opacity: 0.6 }}
      />
    </div>
  );
};
