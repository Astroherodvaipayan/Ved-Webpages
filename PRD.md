
# 📄 Product Requirements Document: "The Book of Knowledge" Intro Sequence

## 1. Objective & Overview

**Goal:** Create a cinematic, 2.5D parallax intro animation that visually masks the loading of heavy website assets while delivering a strong, memorable narrative hook.
**Concept:** An over-the-shoulder view of a boy reading a magical book in space. The camera zooms past the boy and dives directly into the glowing pages of the book, transitioning into a blinding light that ultimately fades to reveal the website's Hero Section.
**Architecture Pivot:** We are utilizing a highly optimized 3-layer architecture to reduce network load while maintaining visual fidelity.

## 2. User Experience (UX) Flow

1. **Initial Load (0s - 0.5s):** A minimal, lightning-fast splash screen (e.g., solid dark blue background with a subtle spinner) appears while the specific high-res intro assets are preloaded.
2. **Ambient Phase (0% - 80% Site Assets Loaded):** The scene fades in. The background elements (stars, rocket, DNA) float gently. The foreground layer (the boy and the book) has a subtle, slow parallax drift to establish depth against the space background. The light from the book pulses softly.
3. **Action Phase (80% - 100% Site Assets Loaded):** The camera rapidly "pushes in." The entire foreground layer scales up dramatically, anchored directly on the glowing pages of the book. Because the zoom is centered on the book, the boy's shoulder naturally pushes out of the camera's view. Simultaneously, the space background slightly recedes and blurs.
4. **The "Whiteout" Transition:** The glowing center of the book rapidly increases in brightness until the entire screen is pure, glowing white.
5. **The Reveal:** The white glow fades away, revealing the fully loaded, interactive Hero Section of the website.

## 3. Design & Asset Requirements

The original flat image must be professionally sliced and exported as highly compressed `.webp` files with identical canvas dimensions (e.g., 1920x1080) so they stack perfectly.

* **Layer 1 (`foreground-boy-book.webp`):** The boy’s head, hair, left shoulder, back, his hands, the open book, and the visible scribbled text. (Background must be completely transparent).
* **Layer 2 (`background-space.webp`):** The starry space, rocket, DNA, and floating math symbols. Needs to be slightly oversized (e.g., `110vw`/`110vh`) to allow for panning without showing edges. The area behind the boy/book must be filled in (inpainted) with stars so no empty holes show during parallax.
* **Layer 3 (`overlay-glow.webp`):** A soft, warm, yellowish-white radial gradient mapping to the center crease of the book.

## 4. Technical Specifications & Stack

**Stack:** HTML, CSS, Vanilla JS, and **GSAP (GreenSock)**.

**Animation Logic & Rules:**

* **Target CSS Properties:** Strictly animate `transform: scale()`, `transform: translate()`, and `opacity`. *Never* animate `width`, `height`, `top`, or `left`.
* **Hardware Acceleration:** Apply `will-change: transform, opacity;` to Layers 1, 2, and 3.
* **Foreground Zoom Logic (Crucial):** Because the boy and book are merged on Layer 1, you must set the `transform-origin` of Layer 1 to the exact X/Y coordinates of the center of the book's pages (e.g., `transform-origin: 60% 70%;`). This ensures the `scale` pushes into the glow, rather than the center of the image.

## 5. Performance, Edge Cases & Accessibility

* **The "Second Visit" Rule:** Use `localStorage.setItem('hasSeenIntro', 'true')` upon completion. On subsequent page loads, bypass the intro sequence entirely and render the Hero Section immediately.
* **Accessibility (a11y):** Implement `window.matchMedia('(prefers-reduced-motion: reduce)')`. If true, skip the zoom/parallax entirely; execute a simple fade to white, or skip directly to the site.
* **Manual Override:** Include a "Skip Intro" button (bottom right corner, low opacity) that instantly triggers the whiteout transition.
* **Loading Fallback:** If site assets take longer than 8 seconds, automatically force the transition to prevent the user from being stuck.

---

## 🤖 Instructions for the AI (Claude)

*Read the above PRD context carefully. Below is the boilerplate HTML, CSS, and JS. Your task is to implement the exact GSAP timeline choreography described in the "UX Flow" using the 3-layer architecture.*

* *Ensure the `transformOrigin` on `.layer-foreground` is precisely tuned so a `scale: 15` zoom dives directly into the book's pages, pushing the boy's head out of frame.*
* *Implement the ambient floating effect for the background and the pulsing effect for the glow.*
* *Ensure the whiteout overlay fully masks the transition between the intro container and the main site content.*
* *Write clean, modular code and wire up the `skip` button, `localStorage` check, and `prefers-reduced-motion` guards.*

### Boilerplate Code

**HTML:**

```html
<div id="intro-container">
  <img src="background-space.webp" class="parallax-layer layer-background" alt="Space Background">
  
  <img src="foreground-boy-book.webp" class="parallax-layer layer-foreground" alt="Boy reading book">
  
  <img src="overlay-glow.webp" class="parallax-layer layer-glow" alt="Magic Glow">
  
  <button id="skip-btn">Skip Intro</button>
</div>

<div id="whiteout-overlay"></div>

<main id="main-content" style="display: none;">
  <section class="hero">
    <h1>Welcome to the Universe of Knowledge</h1>
  </section>
</main>

```

**CSS:**

```css
body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden; /* Prevent scroll during intro */
  background-color: #050b14; /* Match deep space */
}

#intro-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.parallax-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform, opacity;
}

/* Specific Layer Adjustments */
.layer-background {
  width: 110vw; /* Oversized for panning */
  height: 110vh;
  top: -5vh;
  left: -5vw;
  z-index: 1;
}

.layer-foreground {
  z-index: 2;
  /* TO DO for AI: Adjust these percentages to hit the exact center of the book in the image */
  transform-origin: 60% 75%; 
}

.layer-glow {
  z-index: 3;
  opacity: 0.5; /* Base opacity before pulse/whiteout */
}

#whiteout-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fffbea; /* Warm white glow */
  z-index: 9999;
  opacity: 0;
  pointer-events: none;
}

#skip-btn {
  position: absolute;
  bottom: 30px;
  right: 30px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

#skip-btn:hover {
  opacity: 1;
}

#main-content {
  width: 100%;
  height: 100vh;
  /* Add your main site styles here */
}

```

**JavaScript (GSAP Skeleton):**

```javascript
document.addEventListener("DOMContentLoaded", () => {
  const introContainer = document.getElementById('intro-container');
  const mainContent = document.getElementById('main-content');
  const whiteoutOverlay = document.getElementById('whiteout-overlay');
  const skipBtn = document.getElementById('skip-btn');
  
  // Guard 1: LocalStorage Check
  if (localStorage.getItem('hasSeenIntro') === 'true') {
    introContainer.style.display = 'none';
    mainContent.style.display = 'block';
    document.body.style.overflow = 'auto';
    return;
  }

  // Guard 2: Accessibility (Reduced Motion)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Simple fade execution
    gsap.to(introContainer, { opacity: 0, duration: 1, onComplete: revealSite });
    return;
  }

  // TO DO for AI: Build the GSAP master timeline here
  const masterTl = gsap.timeline({
    onComplete: () => {
      localStorage.setItem('hasSeenIntro', 'true');
    }
  });

  // Phase 1: Ambient Floating (0% - 80%)
  // Phase 2: Action Push In (80% - 100%)
  // Phase 3: Whiteout & Reveal

  function revealSite() {
    introContainer.style.display = 'none';
    mainContent.style.display = 'block';
    document.body.style.overflow = 'auto';
    gsap.to(whiteoutOverlay, { opacity: 0, duration: 1 });
  }

  // Skip Button Logic
  skipBtn.addEventListener('click', () => {
    masterTl.kill(); // Stop current animation
    gsap.to(whiteoutOverlay, { 
      opacity: 1, 
      duration: 0.5, 
      onComplete: revealSite 
    });
    localStorage.setItem('hasSeenIntro', 'true');
  });

  // TO DO for AI: Add fallback timeout (e.g., 8 seconds to force transition)
});

```