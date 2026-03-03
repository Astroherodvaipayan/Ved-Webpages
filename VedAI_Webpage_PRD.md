# Ved AI — Webpage Redesign PRD
**For: Antigravity**
**Stack: Next.js (App Router) · Tailwind CSS v4 · Framer Motion · GSAP + ScrollTrigger · Three.js · Lenis**

---

## Ground Rules

- **Do NOT use the browser preview tool** — it is unreliable and wastes time. Make changes, run the dev server, and trust the code.
- **Do NOT create new files unless explicitly specified** — modify existing components in place.
- **Do NOT restructure the page architecture** — sections stay in the same order.
- **All changes must be fully mobile responsive** (breakpoint: ≤768px).
- Preserve all existing animation logic unless the PRD explicitly replaces it.
- Fonts remain unchanged: **Montserrat** (headings/buttons) + **Inter** (body/nav).
- Color schema remains as defined: `#FAFBFF` bg · `#0A0F2E` text · `#1E3A8A` navy · `#D4AF37` gold.

---

## Section-by-Section Changes

---

### 1. CinematicIntro
**Status: No changes.**

---

### 2. Hero Section

**File: `Hero.tsx` (or equivalent)**

**Change: Vertical gradient upgrade on the background.**

- The existing background uses a flat `#FAFBFF` with floating gradient orbs.
- Add a top-to-bottom vertical gradient layer underneath the orbs:
  ```css
  background: linear-gradient(
    to bottom,
    #EEF3FF 0%,      /* cool periwinkle top */
    #FAFBFF 45%,     /* brand off-white mid */
    #F0F4FF 75%,     /* soft blue-tinted lower */
    #E8EEFF 100%     /* deeper panel blue at bottom */
  );
  ```
- The existing radial orbs and grid overlay sit on top of this gradient — do not remove them.
- The gradient must feel subtle and premium — not loud. Reference: Sarvam AI's hero, adapted to navy/gold palette.
- On mobile: same gradient applies, no changes to layout.

---

### 3. CloudSection → CloudReveal

**Status: No changes to the existing CloudReveal component.**

- The cloud reveal effect (clouds rising, drifting, fading) stays exactly as-is.
- This section already exists as a structural spacer + fixed overlay — leave the logic intact.

---

### 4. Mission → TeacherScrollSequence

**File: `TeacherScrollSequence.tsx` (or equivalent canvas/frame component)**

**Change: Add cinematic text overlay at end of frame sequence.**

**Trigger condition:** After the last frame (frame 40) has been reached AND the 2000px scroll delay begins.

**At the START of the 2000px hold delay:**
- Animate in a cinematic subtitle bar at the bottom of the canvas.
- Style:
  ```
  Position: absolute, bottom: 10%, left: 50%, transform: translateX(-50%)
  Background: rgba(0, 0, 0, 0.45) with backdrop-filter: blur(8px)
  Border-radius: 12px
  Padding: 16px 40px
  Text: "Building the greatest teacher ever."
  Font: Montserrat, font-weight: 600, font-size: clamp(1rem, 2.5vw, 1.5rem)
  Color: #FFFFFF
  Letter-spacing: 0.04em
  ```
- Animation: `opacity: 0, translateY: 20px` → `opacity: 1, translateY: 0` over 600ms, ease-out.
- The subtitle stays visible for the entire 2000px delay duration.
- At the END of the delay (when normal scroll resumes and the canvas exits), fade the subtitle out: `opacity: 1` → `opacity: 0` over 400ms.

**Mobile:** Same animation, reduce font-size to `clamp(0.85rem, 4vw, 1.1rem)`, padding `12px 24px`.

---

### 5. ProductShowcase

**File: `ProductShowcase.tsx` (or equivalent)**

**This section requires a sequence rewrite of the existing dolly zoom. Follow this spec precisely.**

#### Full Scroll Sequence (Pinned Section, 250% scroll distance):

**Phase 1 — Text dolly zoom in (scroll 0% → 35%)**
- "THE FUTURE OF LEARNING IS HERE" text scales from `0.2` → `1.0`.
- Opacity: `0` → `1`.
- Framer Motion `useTransform` tied to scroll progress.

**Phase 2 — Text zooms past camera (scroll 35% → 55%)**
- Text continues to scale from `1.0` → `8.0`.
- Opacity: `1` → `0` (fades out as it "flies past").

**Phase 3 — Mac window appears (scroll 55% → 75%)**
- Mac window enters from scale `0.1` → `0.6`, opacity `0` → `1`.
- Simultaneously with Phase 2 exit — the window "emerges" from where the text was.

**Phase 4 — Snap trigger point (scroll 75% → 80%)**
- This is the critical new behaviour: at scroll progress `0.75`, a **single minimal scroll gesture** (≈ 5% of total section scroll) triggers a **hard snap** that completes Phase 5 instantly.
- Implement using GSAP ScrollTrigger `snap` on this sub-range, or a Lenis scroll lock + programmatic scroll to end.
- Visual feedback: a brief (200ms) ease-out acceleration of the Mac window as the snap kicks in.

**Phase 5 — Mac window fills screen (snap → 100%)**
- Mac window scales from `0.6` → `1.0`, filling the viewport.
- Once snapped into final position, normal vertical scroll resumes (unpin the section).

**Mac Window Styling (unchanged from current):**
- Traffic light dots (red/yellow/green), light title bar.
- Embedded `/product-demo.mp4` — plays on enter, pauses on leave.
- Background: `#FAFBFF`.

**Mobile (≤768px):**
- Reduce scroll distance to 180% (shorter pin).
- Snap behaviour still applies.
- Mac window scales to fit mobile viewport width on final snap.

---

### 6. ProblemStatement

**File: `ProblemStatement.tsx`**

**Change: Replace existing animation with a two-stage parallax scroll reveal.**

**Current state:** Both headline and subtitle animate in together.

**New behaviour:**

**Stage 1 — First text block enters (scroll enters viewport → +300px):**
- Only this text is visible:
  ```
  "Personal tutoring improves learning outcomes by 98%."
  ```
- Animate in: `translateY: 60px, opacity: 0` → `translateY: 0, opacity: 1` over 500ms.
- The "98%" retains its existing elastic bounce GSAP animation (`elastic.out`).
- The subtitle ("But having 8 billion teachers is impossible.") is `opacity: 0`, `visibility: hidden` at this stage.

**Stage 2 — Further scroll (+300px → +600px from viewport entry):**
- The subtitle fades and slides up into view:
  ```
  "But having 8 billion teachers is impossible."
  ```
- Animate in: `translateY: 80px, opacity: 0` → `translateY: 0, opacity: 1` over 600ms, with a 150ms delay after Stage 1 completes.
- Both texts are now fully visible and remain static on further scroll.

**Implementation note:** Use GSAP ScrollTrigger with `scrub: false` and `once: true` for both stages. Two separate ScrollTrigger instances with different `start` values.

**Retain:** Rotating orbital circles, animated SVG curve, SlideInText wrapper — these stay, just the sequencing changes.

**Mobile:** Reduce translateY offsets to 40px/50px. Same two-stage logic applies.

---

### 7. Architecture (3-Agent Cards)

**Status: No changes.**

---

### 8. NEW — Feature Showcase Section (3 Cards)

**Insert after Architecture section, before Moat section.**

**Create new file: `FeatureShowcase.tsx`**

**Layout:**
- 3 feature cards displayed vertically stacked (one per row, full-width).
- Each card is a horizontal split: **left side = text content, right side = image/visual**.
- Reference visual: the Creatium "Go from watching to coaching" card (attached image 3).

**Card structure (per card):**
```
┌──────────────────────────────────────────────────────────┐
│  [LEFT — 45% width]          [RIGHT — 55% width]         │
│                                                           │
│  [EYEBROW LABEL]             ┌─────────────────────┐     │
│  [MAIN HEADLINE]             │                     │     │
│                              │   IMAGE PLACEHOLDER │     │
│  [SUBTEXT BODY]              │   (rounded corners) │     │
│                              └─────────────────────┘     │
└──────────────────────────────────────────────────────────┘
```

**Card styling:**
```css
background: #FFFFFF
border: 1px solid rgba(30, 58, 138, 0.08)
border-radius: 24px
padding: 48px
box-shadow: 0 4px 32px rgba(30, 58, 138, 0.06)
```

**Text fields (all placeholder — content to be filled later):**
- Eyebrow label: `font: Inter, 12px, letter-spacing: 0.1em, color: #1E3A8A, text-transform: uppercase`
- Main headline: `font: Montserrat, clamp(1.4rem, 2.5vw, 2rem), font-weight: 700, color: #0A0F2E`
- Subtext: `font: Inter, clamp(0.9rem, 1.5vw, 1.1rem), color: #2D3A6B, line-height: 1.7`

**Image field:**
```
Border-radius: 16px
Background: #E8EEFF (placeholder tint)
Min-height: 260px
Object-fit: cover
```

**Placeholder content (replace later):**

Card 1:
- Eyebrow: `"PERSONALIZED LEARNING"`
- Headline: `"[Feature headline goes here]"`
- Subtext: `"[Feature description goes here — 2 to 3 sentences about what this feature does and why it matters to the learner.]"`
- Image: placeholder div with `#E8EEFF` background + centered label `"Image Placeholder"`

Card 2:
- Eyebrow: `"ADAPTIVE INTELLIGENCE"`
- Headline: `"[Feature headline goes here]"`
- Subtext: `"[Feature description goes here — 2 to 3 sentences.]"`
- Image: same placeholder style

Card 3:
- Eyebrow: `"MASTERY EVALUATION"`
- Headline: `"[Feature headline goes here]"`
- Subtext: `"[Feature description goes here — 2 to 3 sentences.]"`
- Image: same placeholder style

**Alternating layout:** Cards 1 and 3 have text left / image right. Card 2 flips: image left / text right.

**Entrance animation (Framer Motion):**
- Each card animates in on viewport entry: `opacity: 0, translateY: 48px` → `opacity: 1, translateY: 0`, duration 600ms, staggered by 150ms between cards.
- Use `whileInView` with `once: true`.

**Mobile (≤768px):**
- Cards stack vertically: image on top, text below.
- Full width, remove alternating layout.
- Padding: 28px.

---

### 9. Moat (Intelligence that Compounds)

**Status: No changes.**

---

### 10. JoinRevolution — Wave Animation Addition

**File: `JoinRevolution.tsx`**

**Do NOT modify the existing SVG line art, button logic, paper plane animation, or particle effects.**

**Add: A wave SVG layer rendered behind the existing content.**

**Wave structure:**

Render an `<svg>` element positioned `absolute, bottom: 0, left: 0, width: 100%, z-index: 0`. The existing section content sits at `z-index: 1` above it.

The wave consists of multiple layered sinusoidal `<path>` elements:

**Default state (before button click):**
- Left side waves (approx left 50% of SVG): `stroke: rgba(150, 150, 150, 0.35)`, `fill: none`, `strokeWidth: 1.5`
- Right side waves (approx right 50% of SVG): same gray — `stroke: rgba(150, 150, 150, 0.35)`
- Render 5–7 wave paths at slightly different amplitudes and vertical offsets for depth.
- Subtle continuous CSS animation: waves drift horizontally at different speeds (`animation: waveFlow 8s linear infinite`), creating a living, breathing background.

**On "Join the Waitlist" button click:**
- Trigger a transition on the right-side wave paths only.
- Right side strokes animate from gray → brand color gradient over 1200ms:
  ```
  stroke color transitions:
  Wave 1: rgba(150,150,150,0.35) → rgba(30, 58, 138, 0.6)    /* navy */
  Wave 2: rgba(150,150,150,0.35) → rgba(30, 58, 138, 0.5)
  Wave 3: rgba(150,150,150,0.35) → rgba(212, 175, 55, 0.55)   /* gold */
  Wave 4: rgba(150,150,150,0.35) → rgba(212, 175, 55, 0.4)
  Wave 5: rgba(150,150,150,0.35) → rgba(30, 58, 138, 0.45)
  ```
- Use CSS transition or GSAP `to()` on each path's stroke.
- Left side waves remain gray — no change on click.
- This transition fires at the same time as the existing paper plane / particle animation.

**Button label in this section only:**
- Change the CTA button text from `"Join Beta"` to `"Join the Waitlist"`.
- Do NOT change the button label in the Navbar or any other section.
- The button style (dark glassmorphism pill) remains identical.

**Mobile:**
- Wave SVG scales to viewport width naturally (SVG `viewBox` + `preserveAspectRatio`).
- Reduce wave amplitude slightly on mobile for cleaner rendering.

---

### 11. FooterCTA

**Status: No changes.**

---

### 12. Navigation.tsx

**Status: No changes** — the navbar was updated in a prior session (pill shape, frosted glass, dark Join Beta button). Do not touch.

---

## Mobile Responsiveness Checklist

Every section above must pass these on ≤768px viewport:
- [ ] No horizontal overflow / x-scroll
- [ ] Text never overflows container — use `clamp()` or responsive font sizes
- [ ] Tap targets ≥ 44px height
- [ ] GSAP scroll distances halved vs desktop where noted
- [ ] Canvas (TeacherScrollSequence) correct aspect ratio maintained
- [ ] Mac window in ProductShowcase fits within viewport width
- [ ] FeatureShowcase cards stack vertically, image top / text bottom
- [ ] Wave SVG scales correctly, no clipping

---

## Implementation Order (Recommended)

1. Hero gradient (lowest risk, visual only)
2. ProblemStatement parallax (self-contained)
3. TeacherScrollSequence subtitle overlay (additive)
4. FeatureShowcase new section (new file, insert into page.tsx)
5. JoinRevolution wave layer (additive, no existing logic touched)
6. ProductShowcase snap trigger (highest complexity — do last)
