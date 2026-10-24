'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import SplashScreen from './SplashScreen';
import CinematicIntro from './CinematicIntro';

/** Keeps the opening sequence on the home route and advances through one state at a time. */
export default function CinematicSequence({ children }) {
  const pathname = usePathname();
  const [stage, setStage] = useState('splash');

  // Check session after initial hydration to prevent SSR mismatch
  useEffect(() => {
    if (sessionStorage.getItem('rj_intro_seen') === 'true') {
      setStage('home');
    }
  }, []);

  useEffect(() => {
    if (pathname === '/' && stage === 'home') window.dispatchEvent(new Event('store-home-ready'));
    else window.dispatchEvent(new Event('store-home-hidden'));
  }, [pathname, stage]);

  // Keep every route other than the storefront homepage on its normal path.
  // On /, do not mount the shopping experience until the visitor dismisses
  // the intro; this prevents the homepage, header, and assistant appearing
  // behind the cinematic screen.
  if (pathname !== '/') return children;

  if (stage === 'home') return children;

  return (
    <>
      {(stage === 'transition' || stage === 'intro') && (
        <CinematicIntro
          dismissEnabled={stage === 'intro'}
          onDismissComplete={() => {
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('rj_intro_seen', 'true');
            }
            setStage('home');
          }}
        />
      )}
      {(stage === 'splash' || stage === 'transition') && (
        <SplashScreen
          onTransitionStart={() => setStage((current) => current === 'splash' ? 'transition' : current)}
          onComplete={() => setStage((current) => current === 'transition' || current === 'splash' ? 'intro' : current)}
        />
      )}
    </>
  );
}
