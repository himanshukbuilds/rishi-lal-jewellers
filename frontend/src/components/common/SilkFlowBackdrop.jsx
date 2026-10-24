'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const VERTEX_SHADER = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `
precision highp float;
uniform sampler2D artwork;
uniform vec2 resolution;
uniform float imageAspect;
uniform float time;
uniform float isIntro;
varying vec2 vUv;

float smoothMask(float a, float b, float value) {
  return smoothstep(a, b, value);
}

void main() {
  // 1. Maintain aspect ratio cover matching Next.js object-cover
  vec2 uv = vUv;
  float viewportAspect = resolution.x / resolution.y;
  if (viewportAspect > imageAspect) {
    float visibleHeight = imageAspect / viewportAspect;
    uv.y = (uv.y - 0.5) * visibleHeight + 0.5;
  } else {
    float visibleWidth = viewportAspect / imageAspect;
    uv.x = (uv.x - 0.5) * visibleWidth + 0.5;
  }
  vec2 imageUv = uv;

  // 2. Sample original base texture to detect ruby silk fabric zones
  vec4 baseSample = texture2D(artwork, imageUv);
  
  // Ruby silk fabric detection:
  // In the approved Rishi Lal Jewellers palette, silk ribbons have high red chrominance:
  // R channel is significantly higher than G and B, with rich saturation.
  float redExcess = baseSample.r - max(baseSample.g, baseSample.b);
  float silkPresence = smoothMask(0.028, 0.11, redExcess) * smoothMask(0.035, 0.14, baseSample.r);
  
  // Suppress green/bright neutral areas
  float greenRatio = baseSample.g / max(baseSample.r, 0.001);
  silkPresence *= (1.0 - smoothMask(0.62, 0.85, greenRatio));

  // 3. Zone Protection & Spatial Modulation
  // In Splash screen (isIntro < 0.5):
  // Keep the central RL crest & RISHI LAL JEWELLERS wordmark 100% still and razor-sharp.
  float distCenter = length((imageUv - vec2(0.5, 0.48)) * vec2(1.0, 1.25));
  float splashProtection = smoothMask(0.18, 0.38, distCenter);

  // In Bridal Intro (isIntro > 0.5):
  // The dark editorial background behind the text remains calm, while the left ribbons,
  // lower waves, and right backdrop ribbons undulate with full majestic motion.
  float textVignette = smoothMask(0.06, 0.24, length((imageUv - vec2(0.32, 0.52)) * vec2(1.2, 1.0)));
  float introModulation = mix(0.40, 1.0, textVignette);

  // Modulate silk mask with screen-specific protection
  float silkMask = silkPresence * mix(splashProtection, introModulation, isIntro);

  // 4. Multi-Layer Non-Linear Cloth Wave Kinematics
  // Layer A: Macro Sweeping Wave (Broad fluid vertical undulation)
  float waveA = sin(imageUv.x * 4.2 - time * 0.95 + imageUv.y * 2.1);
  float waveA_cross = cos(imageUv.x * 2.8 + time * 0.70 - imageUv.y * 3.4);

  // Layer B: Traveling Diagonal Folds (Satin creases rolling along the ribbon curves)
  float waveB = sin(imageUv.x * 7.5 + imageUv.y * 6.2 - time * 1.35 + waveA * 1.4);
  float waveB_cross = cos(imageUv.x * 5.2 - imageUv.y * 8.0 + time * 1.10);

  // Layer C: Fine Satin Micro-Flutter & Crease Ripples
  float waveC = sin(imageUv.x * 16.5 + imageUv.y * 14.0 - time * 2.10 + waveB * 0.9);

  // Independent Phase Modulation for Overlapping Layers:
  // Lower sweeping ribbon wave (imageUv.y < 0.46 in flipped texture coords):
  float bottomZone = 1.0 - smoothMask(0.08, 0.46, imageUv.y);
  float bottomWave = sin(imageUv.x * 5.5 - time * 1.20) * 0.042 
                   + cos(imageUv.x * 10.5 + time * 0.85) * 0.018;

  // Left cascading ribbon wave (imageUv.x < 0.45):
  float leftZone = 1.0 - smoothMask(0.10, 0.45, imageUv.x);
  float leftWave = sin(imageUv.y * 6.8 + imageUv.x * 4.2 - time * 1.40) * 0.038
                 + cos(imageUv.y * 13.0 - time * 0.90) * 0.016;

  // Right-side framing ribbon wave (imageUv.x > 0.55):
  float rightZone = smoothMask(0.55, 0.90, imageUv.x);
  float rightWave = cos(imageUv.x * 4.8 - imageUv.y * 5.5 + time * 0.95) * 0.032;

  // Combine regional kinematics
  float regionalDy = (bottomWave * bottomZone + leftWave * leftZone + rightWave * rightZone);

  // Total Displacement Vector (Generous amplitude: 35-55px for clearly visible organic flow)
  vec2 displacement = vec2(
    (waveA_cross * 0.018 + waveB * 0.014 + leftWave * 0.012) * silkMask,
    (waveA * 0.035 + waveB_cross * 0.018 + waveC * 0.005 + regionalDy) * silkMask
  );

  // 5. Sample Artwork with Displaced Texture Coordinates
  vec2 displacedUv = clamp(imageUv + displacement, vec2(0.001), vec2(0.999));
  vec4 fabric = texture2D(artwork, displacedUv);

  // 6. Dynamic 3D Silk Specular Lighting & Normal Shift
  // Local fold gradient gently models 3D dimensional lighting as the ribbon curves move
  float foldGradient = (waveA * 0.55 + waveB * 0.35 + waveC * 0.10);
  float foldLight = 1.0 + foldGradient * 0.14 * silkMask;
  fabric.rgb *= foldLight;

  // 7. Subtle Natural Gold Highlight Sheen (Strictly on the ribbon's existing metallic edges)
  // Modulates only pixels that already possess gold/champagne pigment on the ribbon,
  // completely eliminating broad diagonal beams and searchlight streaks across the screen.
  float isNaturalGold = smoothMask(0.36, 0.70, fabric.r) * smoothMask(0.24, 0.55, fabric.g) * silkMask;
  float subtleSheen = 1.0 + (waveA * 0.08 + waveB * 0.05) * isNaturalGold;
  fabric.rgb *= subtleSheen;

  gl_FragColor = vec4(fabric.rgb, baseSample.a);
}`;

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    throw new Error('Unable to compile silk shader');
  }
  return shader;
}

function createProgram(gl) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    throw new Error('Unable to link silk shader');
  }
  return program;
}

/**
 * Draws the existing flattened silk artwork unchanged, then displaces only its
 * ruby fabric zones. The original image remains the no-WebGL/reduced-motion fallback.
 */
export default function SilkFlowBackdrop({ src, kind = 'intro', alt = '', priority = false, className = '' }) {
  const canvasRef = useRef(null);
  const canvasVisibleRef = useRef(false);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    let gl;
    let program;
    let texture;
    let buffer;
    let uniforms = null;
    let frame = 0;
    let disposed = false;
    let ready = false;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return undefined;

    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const render = (timestamp = 0) => {
      if (disposed || !gl || !ready) return;
      if (!program || !texture || !uniforms || gl.isContextLost()) return;
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        frame = window.requestAnimationFrame(render);
        return;
      }
      const ratio = Math.min(window.devicePixelRatio || 1, 1.35);
      const width = Math.max(1, Math.round(rect.width * ratio));
      const height = Math.max(1, Math.round(rect.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      gl.useProgram(program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uniforms.artwork, 0);
      gl.uniform2f(uniforms.resolution, width, height);
      gl.uniform1f(uniforms.imageAspect, 1672 / 941);
      gl.uniform1f(uniforms.time, timestamp * 0.001);
      gl.uniform1f(uniforms.isIntro, kind === 'intro' ? 1.0 : 0.0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!disposed && !canvasVisibleRef.current) {
        canvasVisibleRef.current = true;
        setAnimated(true);
      }
      if (!disposed) frame = window.requestAnimationFrame(render);
    };

    const onContextLost = (event) => {
      event.preventDefault();
      stop();
      canvasVisibleRef.current = false;
      setAnimated(false);
    };

    try {
      gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
      if (!gl) return undefined;
      program = createProgram(gl);
      uniforms = {
        artwork: gl.getUniformLocation(program, 'artwork'),
        resolution: gl.getUniformLocation(program, 'resolution'),
        imageAspect: gl.getUniformLocation(program, 'imageAspect'),
        time: gl.getUniformLocation(program, 'time'),
        isIntro: gl.getUniformLocation(program, 'isIntro'),
      };
      if (Object.values(uniforms).some((location) => location === null)) {
        throw new Error('A required silk shader uniform was not found');
      }
      const position = gl.getAttribLocation(program, 'position');
      if (position < 0) throw new Error('The silk shader position attribute was not found');
      buffer = gl.createBuffer();
      if (!buffer) throw new Error('Unable to allocate silk shader geometry');
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      texture = gl.createTexture();
      if (!texture) throw new Error('Unable to allocate silk artwork texture');
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      const artwork = new window.Image();
      artwork.onload = () => {
        if (disposed || !gl || gl.isContextLost() || !texture || !uniforms) return;
        try {
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, artwork);
          const textureError = gl.getError();
          if (textureError !== gl.NO_ERROR) throw new Error(`Unable to upload silk artwork texture (${textureError})`);
          ready = true;
          render();
        } catch {
          canvasVisibleRef.current = false;
          setAnimated(false);
        }
      };
      artwork.onerror = () => {
        if (!disposed) {
          canvasVisibleRef.current = false;
          setAnimated(false);
        }
      };
      artwork.src = src;
      canvas.addEventListener('webglcontextlost', onContextLost, false);

      return () => {
        disposed = true;
        stop();
        canvas.removeEventListener('webglcontextlost', onContextLost);
        if (buffer) gl.deleteBuffer(buffer);
        if (texture) gl.deleteTexture(texture);
        if (program) gl.deleteProgram(program);
      };
    } catch {
      canvasVisibleRef.current = false;
      setAnimated(false);
      if (buffer) gl?.deleteBuffer(buffer);
      if (texture) gl?.deleteTexture(texture);
      if (program) gl?.deleteProgram(program);
      return undefined;
    }
  }, [src, kind]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <Image src={src} alt={alt} fill priority={priority} quality={92} sizes="100vw" className="object-cover object-center" />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${animated ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
      />
    </div>
  );
}
