'use client';

import React, { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RotateCcw } from 'lucide-react';

class ViewerErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidUpdate(previousProps) {
    if (previousProps.modelUrl !== this.props.modelUrl && this.state.failed) this.setState({ failed: false });
  }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function ModelControls({ controlsRef }) {
  const { camera, gl } = useThree();
  const controls = useRef(null);
  useEffect(() => {
    const instance = new OrbitControls(camera, gl.domElement);
    instance.enablePan = false;
    instance.enableDamping = true;
    instance.dampingFactor = 0.08;
    instance.minDistance = 2.1;
    instance.maxDistance = 7;
    instance.rotateSpeed = 0.75;
    instance.target.set(0, 0, 0);
    instance.update();
    controls.current = instance;
    controlsRef.current = instance;
    return () => {
      controlsRef.current = null;
      instance.dispose();
    };
  }, [camera, gl, controlsRef]);
  useFrame(() => controls.current?.update());
  return null;
}

function Model({ url, controlsRef, onReady }) {
  const { scene } = useLoader(GLTFLoader, url);
  const modelRef = useRef(null);
  const model = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    if (!modelRef.current) return;
    const bounds = new THREE.Box3().setFromObject(modelRef.current);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const largestDimension = Math.max(size.x, size.y, size.z) || 1;
    modelRef.current.position.set(-center.x, -center.y, -center.z);
    modelRef.current.scale.setScalar(2.2 / largestDimension);
    modelRef.current.traverse((part) => {
      if (part.isMesh) {
        part.castShadow = true;
        part.receiveShadow = true;
        if (part.material) part.material.needsUpdate = true;
      }
    });
    controlsRef.current?.reset();
    onReady();
  }, [model, controlsRef, onReady]);

  return <group ref={modelRef}><primitive object={model} /></group>;
}

function ImageFallback({ image, name, failed = false }) {
  return (
    <div className="relative aspect-square overflow-hidden bg-[#F8F1E7]" role={failed ? 'status' : undefined}>
      <Image src={image} alt={name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain p-4" />
      {failed && <p className="absolute bottom-3 left-3 right-3 rounded bg-white/95 px-3 py-2 text-center text-xs text-[#35050D]">3D view unavailable. Showing product image.</p>}
    </div>
  );
}

export default function Product3DViewer({ modelUrl, image, name }) {
  const controlsRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState(null);
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      setWebglAvailable(Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl'))));
    } catch {
      setWebglAvailable(false);
    }
  }, []);
  const handleReady = useCallback(() => setLoaded(true), []);
  const fallback = <ImageFallback image={image} name={name} failed />;

  if (webglAvailable === false) return fallback;

  return (
    <div className="relative aspect-square overflow-hidden rounded-sm border border-[#D6B36A]/50 bg-[radial-gradient(ellipse_at_center,#fffdf8_0%,#F8F1E7_68%,#efe5d5_100%)] shadow-sm">
      {!loaded && <div className="absolute inset-0 z-0"><ImageFallback image={image} name={name} /></div>}
      <ViewerErrorBoundary modelUrl={modelUrl} fallback={fallback}>
        <Canvas
          className="!relative z-[1]"
          camera={{ position: [0, 0, 4], fov: 38, near: 0.1, far: 100 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
          onCreated={({ gl }) => { gl.setClearColor('#F8F1E7', 0); }}
        >
          <ambientLight intensity={1.15} />
          <hemisphereLight args={['#fff7e8', '#6b3440', 1.05]} />
          <directionalLight position={[3, 4, 5]} intensity={2.4} color="#fff2d2" />
          <directionalLight position={[-4, 1, -3]} intensity={1.1} color="#f4d8ac" />
          <Suspense fallback={null}>
            <Model url={modelUrl} controlsRef={controlsRef} onReady={handleReady} />
          </Suspense>
          <ModelControls controlsRef={controlsRef} />
        </Canvas>
      </ViewerErrorBoundary>
      {!loaded && <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D6B36A]/40 bg-white/95 px-4 py-2 text-xs text-[#35050D] shadow-sm">Preparing 3D view…</div>}
      <button
        type="button"
        onClick={() => controlsRef.current?.reset()}
        className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-[#D6B36A]/50 bg-white/90 px-3 py-2 text-[11px] text-[#35050D] shadow-sm hover:bg-white"
        aria-label="Reset 3D viewing angle"
      >
        <RotateCcw className="h-3.5 w-3.5" /> Reset view
      </button>
      <span className="pointer-events-none absolute bottom-4 left-3 z-10 rounded-full bg-white/75 px-2.5 py-1 text-[10px] uppercase tracking-wider text-[#716D64]">Drag to rotate · Pinch or scroll to zoom</span>
    </div>
  );
}
