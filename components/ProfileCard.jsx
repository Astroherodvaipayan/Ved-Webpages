'use client';

import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import styles from './ProfileCard.module.css';

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1200,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
  ENTER_TRANSITION_MS: 180,
};

const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v, p = 3) => parseFloat(v.toFixed(p));
const adjust = (v, fMin, fMax, tMin, tMax) =>
  round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

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
  contactText = 'Contact',
  showUserInfo = true,
  onContactClick = undefined,
}) => {
  const wrapRef = useRef(null);
  const shellRef = useRef(null);
  const cardRef = useRef(null);
  const enterTimerRef = useRef(null);
  const leaveRafRef = useRef(null);

  const tiltEngine = useMemo(() => {
    if (!enableTilt) return null;

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
  }, [enableTilt]);

  const getOffsets = (evt, el) => {
    const rect = el.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
  };

  const handlePointerMove = useCallback((e) => {
    const shell = shellRef.current;
    if (!shell || !tiltEngine) return;
    const { x, y } = getOffsets(e, shell);
    tiltEngine.setTarget(x, y);
  }, [tiltEngine]);

  const handlePointerEnter = useCallback((e) => {
    const shell = shellRef.current;
    const card = cardRef.current;
    if (!shell || !card || !tiltEngine) return;
    shell.classList.add(styles.entering);
    card.classList.add(styles.cardActive);
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
    enterTimerRef.current = setTimeout(
      () => shell.classList.remove(styles.entering),
      ANIMATION_CONFIG.ENTER_TRANSITION_MS
    );
    const { x, y } = getOffsets(e, shell);
    tiltEngine.setTarget(x, y);
  }, [tiltEngine]);

  const handlePointerLeave = useCallback(() => {
    const shell = shellRef.current;
    const card = cardRef.current;
    if (!shell || !card || !tiltEngine) return;
    tiltEngine.toCenter();
    const checkSettle = () => {
      const { x, y, tx, ty } = tiltEngine.getCurrent();
      if (Math.hypot(tx - x, ty - y) < 0.6) {
        card.classList.remove(styles.cardActive);
        leaveRafRef.current = null;
      } else {
        leaveRafRef.current = requestAnimationFrame(checkSettle);
      }
    };
    if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
    leaveRafRef.current = requestAnimationFrame(checkSettle);
  }, [tiltEngine]);

  const handleDeviceOrientation = useCallback((e) => {
    const shell = shellRef.current;
    if (!shell || !tiltEngine) return;
    const { beta, gamma } = e;
    if (beta == null || gamma == null) return;
    const cx = shell.clientWidth / 2;
    const cy = shell.clientHeight / 2;
    tiltEngine.setTarget(
      clamp(cx + gamma * mobileTiltSensitivity, 0, shell.clientWidth),
      clamp(cy + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity, 0, shell.clientHeight)
    );
  }, [tiltEngine, mobileTiltSensitivity]);

  useEffect(() => {
    if (!enableTilt || !tiltEngine) return;
    const shell = shellRef.current;
    if (!shell) return;

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

    const initialX = (shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    tiltEngine.setImmediate(initialX, ANIMATION_CONFIG.INITIAL_Y_OFFSET);
    tiltEngine.toCenter();
    tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

    return () => {
      shell.removeEventListener('pointerenter', handlePointerEnter);
      shell.removeEventListener('pointermove', handlePointerMove);
      shell.removeEventListener('pointerleave', handlePointerLeave);
      shell.removeEventListener('click', handleClick);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
      if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
      tiltEngine.cancel();
      shell.classList.remove(styles.entering);
    };
  }, [
    enableTilt, enableMobileTilt, tiltEngine,
    handlePointerMove, handlePointerEnter, handlePointerLeave, handleDeviceOrientation,
  ]);

  // Per-instance CSS variable overrides (only set when prop is supplied)
  const wrapperStyle = {
    ...(iconUrl && { '--icon': `url(${iconUrl})` }),
    ...(grainUrl && { '--grain': `url(${grainUrl})` }),
    ...(innerGradient && { '--inner-gradient': innerGradient }),
    ...(behindGlowColor && { '--behind-glow-color': behindGlowColor }),
    ...(behindGlowSize && { '--behind-glow-size': behindGlowSize }),
  };

  const handleContactClick = useCallback(() => onContactClick?.(), [onContactClick]);

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

            <div className={styles.glare} />

            {/* Avatar + user-info layer */}
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
                      <span className={styles.status}>{status}</span>
                    </div>
                  </div>
                  <button
                    className={styles.contactBtn}
                    onClick={handleContactClick}
                    type="button"
                    aria-label={`Contact ${name}`}
                  >
                    {contactText}
                  </button>
                </div>
              )}
            </div>

            {/* Name / title layer */}
            <div className={styles.textContent}>
              <div className={styles.details}>
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