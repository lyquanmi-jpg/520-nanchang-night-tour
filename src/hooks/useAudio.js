import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const STORAGE_KEY = '520-night-tour-audio-enabled';
const BGM_SRC = '/audio/bgm-night-tour.wav';

function getInitialEnabled() {
  if (typeof window === 'undefined') return true;
  return window.localStorage.getItem(STORAGE_KEY) !== 'off';
}

export const audioAssets = {
  bgm: BGM_SRC,
  click: '/audio/ui-click.wav',
  fragment: '/audio/fragment-get.wav',
  easter: '/audio/easter-egg.wav',
};

export default function useAudio(debugEnabled = false) {
  const [enabled, setEnabled] = useState(getInitialEnabled);
  const [unlocked, setUnlocked] = useState(false);
  const audioContextRef = useRef(null);
  const bgmRef = useRef(null);
  const sfxRef = useRef({});

  const debug = useCallback((message, extra) => {
    if (debugEnabled) console.info(`[520-audio] ${message}`, extra || '');
  }, [debugEnabled]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const bgm = new Audio(BGM_SRC);
    bgm.loop = true;
    bgm.volume = 0.25;
    bgm.preload = 'auto';
    bgm.addEventListener('error', () => debug('background music file not loaded; game continues', BGM_SRC));
    bgmRef.current = bgm;
    sfxRef.current = Object.fromEntries(
      Object.entries({
        click: audioAssets.click,
        fragment: audioAssets.fragment,
        easter: audioAssets.easter,
      }).map(([key, src]) => {
        const audio = new Audio(src);
        audio.volume = 0.16;
        audio.preload = 'auto';
        audio.addEventListener('error', () => debug(`sound file not loaded; Web Audio fallback is used: ${key}`, src));
        return [key, audio];
      }),
    );
    return () => {
      bgm.pause();
      bgmRef.current = null;
      sfxRef.current = {};
    };
  }, [debug]);

  const getContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    if (!audioContextRef.current) audioContextRef.current = new AudioContext();
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency, startTime, duration, volume = 0.04) => {
    const context = getContext();
    if (!context || !enabled) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(frequency, startTime);
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }, [enabled, getContext]);

  const playSound = useCallback((type = 'click') => {
    if (!enabled) return;
    const fileSound = sfxRef.current[type];
    if (fileSound?.readyState >= 2) {
      const instance = fileSound.cloneNode();
      instance.volume = type === 'click' ? 0.12 : 0.16;
      instance.play().catch(() => {});
      return;
    }
    const context = getContext();
    if (!context) return;
    if (context.state === 'suspended') context.resume().catch(() => {});
    const now = context.currentTime;
    if (type === 'fragment') {
      playTone(660, now, 0.08, 0.035);
      playTone(880, now + 0.09, 0.11, 0.035);
      return;
    }
    if (type === 'easter') {
      playTone(660, now, 0.07, 0.035);
      playTone(880, now + 0.08, 0.08, 0.035);
      playTone(1175, now + 0.17, 0.12, 0.032);
      return;
    }
    playTone(520, now, 0.055, 0.03);
  }, [enabled, getContext, playTone]);

  const startBgm = useCallback(async () => {
    setUnlocked(true);
    if (!enabled || !bgmRef.current) return;
    try {
      bgmRef.current.volume = 0.25;
      await bgmRef.current.play();
    } catch (error) {
      debug('background music play was blocked or missing', error?.message);
    }
  }, [debug, enabled]);

  const pauseBgm = useCallback(() => {
    bgmRef.current?.pause();
  }, []);

  const toggle = useCallback(async () => {
    setEnabled((current) => {
      const next = !current;
      window.localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off');
      if (!next) bgmRef.current?.pause();
      return next;
    });
    setUnlocked(true);
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    if (enabled) startBgm();
    else pauseBgm();
  }, [enabled, pauseBgm, startBgm, unlocked]);

  return useMemo(() => ({
    enabled,
    startBgm,
    pauseBgm,
    toggle,
    playSound,
  }), [enabled, pauseBgm, playSound, startBgm, toggle]);
}
