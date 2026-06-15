import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

const DISMISS_KEY = 'caldasgo_install_dismissed';

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (window.navigator as NavigatorWithStandalone).standalone === true;

const isIOS = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);

const InstallPrompt: React.FC = () => {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === '1');

  useEffect(() => {
    if (isStandalone() || dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);

    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isIOS()) {
      timer = setTimeout(() => setShowIOSHint(true), 1500);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      if (timer) clearTimeout(timer);
    };
  }, [dismissed]);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
    setDeferredEvent(null);
    setShowIOSHint(false);
  };

  const handleInstall = async () => {
    if (!deferredEvent) return;
    await deferredEvent.prompt();
    await deferredEvent.userChoice;
    dismiss();
  };

  const visible = !dismissed && (!!deferredEvent || showIOSHint);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 220 }}
          className="absolute bottom-0 left-0 right-0 z-[2000] p-3 pb-[max(env(safe-area-inset-bottom),12px)] pointer-events-none"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 flex items-center gap-3 pointer-events-auto">
            <img
              src={`${import.meta.env.BASE_URL}icon-192.png`}
              alt="CaldasGO"
              className="w-12 h-12 rounded-xl shadow shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-black text-slate-800 text-sm leading-tight">Install CaldasGO</p>
              {deferredEvent ? (
                <p className="text-xs text-slate-500 leading-tight mt-0.5">Add to your Home Screen for the full app experience.</p>
              ) : (
                <p className="text-xs text-slate-500 leading-tight mt-0.5 flex items-center gap-1 flex-wrap">
                  Tap
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2a9ab5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="inline-block shrink-0"><path d="M12 2v13"/><path d="m8 6 4-4 4 4"/><rect x="4" y="9" width="16" height="12" rx="2"/></svg>
                  Share, then <span className="font-bold text-slate-700">Add to Home Screen</span>.
                </p>
              )}
            </div>
            {deferredEvent ? (
              <button
                onClick={handleInstall}
                className="bg-[#2a9ab5] text-white font-black text-sm px-4 py-2 rounded-full shadow active:scale-95 transition-transform whitespace-nowrap shrink-0"
              >
                Install
              </button>
            ) : (
              <button onClick={dismiss} className="text-[#2a9ab5] font-black text-xs px-2 shrink-0">Got it</button>
            )}
            <button onClick={dismiss} className="text-slate-300 hover:text-slate-500 p-1 shrink-0" aria-label="Dismiss">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;
