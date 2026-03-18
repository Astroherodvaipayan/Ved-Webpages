'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import styles from './ProfileCard.module.css';

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1200,
  // ✅ Fix #7: ratio-based offsets instead of magic pixel numbers
  INITIAL_X_RATIO: 0.85,
  INITIAL_Y_RATIO: 0.15,
  DEVICE_BETA_OFFSET: 20,
  ENTER_TRANSITION_MS: 180,
};

const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v, p = 3) => parseFloat(v.toFixed(p));
const adjust = (v, fMin, fMax, tMin, tMax) =>
  round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

// ✅ Fix #5: factory function outside the component — pure logic, no hooks
function createTiltEngine(shellRef, wrapRef) {
  let rafId = null;
  let running = false;
  let lastTs = 0;
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;
  const DEFAULT_TAU = 0.14;
  const INITIAL_TAU = 0.6;
  let initialUntil = 0;

  const setVarsFromXY = (x, y) => {
    const shell = shellRef.current;
    const wrap = wrapRef.current;
    if (!shell || !wrap) return;

    const width = shell.clientWidth || 1;
    const height = shell.clientHeight || 1;
    const percentX = clamp((100 / width) * x);
    const percentY = clamp((100 / height) * y);
    const centerX = percentX - 50;
    const centerY = percentY - 50;

    const props = {
      '--pointer-x': `${percentX}%`,
      '--pointer-y': `${percentY}%`,
      '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
      '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
      '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
      '--pointer-from-top': `${percentY / 100}`,
      '--pointer-from-left': `${percentX / 100}`,
      '--rotate-x': `${round(-(centerX / 5))}deg`,
      '--rotate-y': `${round(centerY / 4)}deg`,
    };
    for (const [k, v] of Object.entries(props)) wrap.style.setProperty(k, v);
  };

  const step = (ts) => {
    if (!running) return;
    if (lastTs === 0) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;
    const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
    const k = 1 - Math.exp(-dt / tau);
    currentX += (targetX - currentX) * k;
    currentY += (targetY - currentY) * k;
    setVarsFromXY(currentX, currentY);
    const stillFar =
      Math.abs(targetX - currentX) > 0.05 ||
      Math.abs(targetY - currentY) > 0.05;
    if (stillFar || document.hasFocus()) {
      rafId = requestAnimationFrame(step);
    } else {
      running = false;
      lastTs = 0;
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    }
  };

  const start = () => {
    if (running) return;
    running = true;
    lastTs = 0;
    rafId = requestAnimationFrame(step);
  };

  return {
    setImmediate(x, y) { currentX = x; currentY = y; setVarsFromXY(x, y); },
    setTarget(x, y) { targetX = x; targetY = y; start(); },
    toCenter() {
      const shell = shellRef.current;
      if (!shell) return;
      this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
    },
    beginInitial(ms) { initialUntil = performance.now() + ms; start(); },
    getCurrent() { return { x: currentX, y: currentY, tx: targetX, ty: targetY }; },
    cancel() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null; running = false; lastTs = 0;
    },
  };
}

// ✅ Fix #4: status dot color map
const STATUS_COLOR_MAP = {
  Online: '#34d399',
  Away: '#fbbf24',
  Busy: '#f87171',
  Offline: '#6b7280',
};

const ProfileCardComponent = ({
  avatarUrl = '',
  iconUrl = '',
  grainUrl = '',
  innerGradient,
  behindGlowEnabled = true,
  behindGlowColor,
  behindGlowSize,
  className = '',
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  miniAvatarUrl = '',
  name = 'Javi A. Torres',
  title = 'Software Engineer',
  handle = 'javicodes',
  status = 'Online',
  waitlistNumber = 7,
  showUserInfo = true,
}) => {
  const wrapRef = useRef(null);
  const shellRef = useRef(null);
  const cardRef = useRef(null);
  const enterTimerRef = useRef(null);
  const leaveRafRef = useRef(null);
  // ✅ Fix #5: useRef instead of useMemo — stable, never recreated
  const tiltEngineRef = useRef(null);

  const getTiltEngine = useCallback(() => {
    if (!enableTilt) return null;
    if (!tiltEngineRef.current) {
      tiltEngineRef.current = createTiltEngine(shellRef, wrapRef);
    }
    return tiltEngineRef.current;
  }, [enableTilt]);

  const getOffsets = (evt, el) => {
    const rect = el.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
  };

  const handlePointerMove = useCallback((e) => {
    const shell = shellRef.current;
    const engine = getTiltEngine();
    if (!shell || !engine) return;
    const { x, y } = getOffsets(e, shell);
    engine.setTarget(x, y);
  }, [getTiltEngine]);

  const handlePointerEnter = useCallback((e) => {
    const shell = shellRef.current;
    const card = cardRef.current;
    const engine = getTiltEngine();
    if (!shell || !card || !engine) return;
    shell.classList.add(styles.entering);
    card.classList.add(styles.cardActive);
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
    enterTimerRef.current = setTimeout(
      () => shell.classList.remove(styles.entering),
      ANIMATION_CONFIG.ENTER_TRANSITION_MS
    );
    const { x, y } = getOffsets(e, shell);
    engine.setTarget(x, y);
  }, [getTiltEngine]);

  const handlePointerLeave = useCallback(() => {
    const shell = shellRef.current;
    const card = cardRef.current;
    const engine = getTiltEngine();
    if (!shell || !card || !engine) return;
    engine.toCenter();
    const checkSettle = () => {
      const { x, y, tx, ty } = engine.getCurrent();
      if (Math.hypot(tx - x, ty - y) < 0.6) {
        card.classList.remove(styles.cardActive);
        leaveRafRef.current = null;
      } else {
        leaveRafRef.current = requestAnimationFrame(checkSettle);
      }
    };
    if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
    leaveRafRef.current = requestAnimationFrame(checkSettle);
  }, [getTiltEngine]);

  const handleDeviceOrientation = useCallback((e) => {
    const shell = shellRef.current;
    const engine = getTiltEngine();
    if (!shell || !engine) return;
    const { beta, gamma } = e;
    if (beta == null || gamma == null) return;
    const cx = shell.clientWidth / 2;
    const cy = shell.clientHeight / 2;
    engine.setTarget(
      clamp(cx + gamma * mobileTiltSensitivity, 0, shell.clientWidth),
      clamp(cy + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity, 0, shell.clientHeight)
    );
  }, [getTiltEngine, mobileTiltSensitivity]);

  // ✅ Fix #3: track global pointer so behind-glow follows cursor outside the card
  const handleGlobalMouseMove = useCallback((e) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    wrap.style.setProperty('--global-pointer-x', `${x}%`);
    wrap.style.setProperty('--global-pointer-y', `${y}%`);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [handleGlobalMouseMove]);

  useEffect(() => {
    if (!enableTilt) return;
    const engine = getTiltEngine();
    const shell = shellRef.current;
    if (!shell || !engine) return;

    shell.addEventListener('pointerenter', handlePointerEnter);
    shell.addEventListener('pointermove', handlePointerMove);
    shell.addEventListener('pointerleave', handlePointerLeave);

    const handleClick = () => {
      if (!enableMobileTilt || location.protocol !== 'https:') return;
      const M = window.DeviceMotionEvent;
      if (M && typeof M.requestPermission === 'function') {
        M.requestPermission()
          .then((s) => {
            if (s === 'granted') window.addEventListener('deviceorientation', handleDeviceOrientation);
          })
          .catch(console.error);
      } else {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
      }
    };
    shell.addEventListener('click', handleClick);

    // ✅ Fix #7: percentage-based initial position, not magic pixels
    const w = shell.clientWidth || 300;
    const h = shell.clientHeight || 400;
    engine.setImmediate(w * ANIMATION_CONFIG.INITIAL_X_RATIO, h * ANIMATION_CONFIG.INITIAL_Y_RATIO);
    engine.toCenter();
    engine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

    return () => {
      shell.removeEventListener('pointerenter', handlePointerEnter);
      shell.removeEventListener('pointermove', handlePointerMove);
      shell.removeEventListener('pointerleave', handlePointerLeave);
      shell.removeEventListener('click', handleClick);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
      if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
      engine.cancel();
      shell.classList.remove(styles.entering);
    };
  }, [
    enableTilt, enableMobileTilt, getTiltEngine,
    handlePointerMove, handlePointerEnter, handlePointerLeave, handleDeviceOrientation,
  ]);

  const goldBlueGradient = 'linear-gradient(135deg, #1E3A8A 0%, #D4AF37 100%)';

  // ✅ Fix #9: auto-detect avatar — no need for isCustomAvatar prop
  const hasAvatar = Boolean(avatarUrl);

  const statusColor = STATUS_COLOR_MAP[status] ?? '#34d399';

  const wrapperStyle = {
    '--global-pointer-x': '50%',
    '--global-pointer-y': '50%',
    ...(iconUrl && { '--icon': `url(${iconUrl})` }),
    // ✅ Fix #6: grain variable is now actually consumed in CSS
    ...(grainUrl && { '--grain': `url(${grainUrl})` }),
    ...(innerGradient && { '--inner-gradient': innerGradient }),
    ...(!innerGradient && !avatarUrl && { '--inner-gradient': goldBlueGradient }),
    ...(behindGlowColor && { '--behind-glow-color': behindGlowColor }),
    ...(behindGlowSize && { '--behind-glow-size': behindGlowSize }),
    ...(!behindGlowColor && !avatarUrl && { '--behind-glow-color': 'rgba(212, 175, 55, 0.5)' }),
  };

  return (
    <div
      ref={wrapRef}
      className={`${styles.wrapper} ${className}`.trim()}
      style={wrapperStyle}
    >
      {behindGlowEnabled && <div className={styles.behind} />}

      <div ref={shellRef} className={styles.shell}>
        <section ref={cardRef} className={styles.card}>
          <div className={styles.inside}>

            {/* ✅ Fix #1: holographic foil shimmer */}
            <div className={styles.holo} />

            {/* ✅ Fix #6: grain texture rendered when grainUrl is provided */}
            {grainUrl && <div className={styles.grain} />}

            <div className={styles.glare} />

            {/* Avatar + user-info */}
            <div className={styles.avatarContent}>
              {avatarUrl && (
                <img
                  className={styles.avatar}
                  src={avatarUrl}
                  alt={`${name} avatar`}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              )}

              {showUserInfo && (
                <div className={styles.userInfo}>
                  <div className={styles.userDetails}>
                    <div className={styles.miniAvatar}>
                      <img
                        src={miniAvatarUrl || avatarUrl}
                        alt={`${name} mini avatar`}
                        loading="lazy"
                        onError={(e) => { e.currentTarget.style.opacity = '0.5'; }}
                      />
                    </div>
                    <div className={styles.userText}>
                      <span className={styles.handle}>@{handle}</span>
                      {/* ✅ Fix #4: status dot with color + pulse */}
                      <span className={styles.status}>
                        <span
                          className={styles.statusDot}
                          style={{ '--status-color': statusColor }}
                        />
                        {status}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Centered waitlist number ── */}
            <div className={styles.waitlistCenter}>
              <span className={styles.waitlistCenterLabel}>you&apos;re</span>
              <span className={styles.waitlistCenterNumber}>#{waitlistNumber}</span>
              <span className={styles.waitlistCenterSub}>on the list</span>
            </div>

            {/* Name / title */}
            <div className={styles.textContent}>
              {/* ✅ Fix #9: auto-detect hasAvatar, drop isCustomAvatar prop */}
              <div className={`${styles.details} ${!hasAvatar ? styles.detailsCentered : ''}`}>
                <h3>{name}</h3>
                <p>{title}</p>
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;