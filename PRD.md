# Product Requirements Document (PRD)

## Scroll-Triggered Card Expansion Hero (Landing Page)

---

# 1. Overview

This feature implements a **scroll-driven hero interaction** where a **card positioned at the bottom of the hero section expands into a full-screen section as the user scrolls**.

During the interaction:

1. A **hero headline is initially visible**.
2. A **card container sits partially below the fold**.
3. As the user scrolls:

   * The card **moves upward**
   * The card **scales larger**
   * The card **expands to fill the viewport**
4. The hero text **scrolls out of view**.
5. The card becomes the **primary content section**.

This interaction is commonly used in modern landing pages to create a **narrative scroll experience**.

---

# 2. Goals

### Primary Goals

* Create an **engaging hero transition**
* Guide users from **headline → product/demo content**
* Maintain **smooth performance (60fps)**

### Secondary Goals

* Support **desktop and mobile**
* Avoid layout shifts
* Maintain accessibility

---

# 3. User Experience Flow

### Step 1 — Initial State

When the page loads:

* Hero container fills viewport
* Headline text centered near top
* Card container positioned near bottom
* Card partially visible

```
|--------------------------------|
|                                |
|      bringing your way         |
|      of learning               |
|      to life                   |
|                                |
|                                |
|                                |
|           [ Card ]             |
|--------------------------------|
```

---

### Step 2 — Scroll Begins

User scrolls.

Card begins to:

* Move upward
* Increase size
* Maintain rounded corners

Headline remains visible.

---

### Step 3 — Expansion Phase

Further scrolling:

* Card continues scaling
* Card width approaches full width
* Card height increases

Headline scrolls upward and begins leaving viewport.

---

### Step 4 — Fullscreen Transition

Card reaches:

```
width: 100%
height: 100vh
border-radius: 0
```

The card now becomes the **main content section**.

---

# 4. Functional Requirements

## 4.1 Hero Section

Hero must:

* Fill **entire viewport height**
* Contain:

  * Headline text
  * Card container

Required CSS:

```
height: 100vh
position: relative
overflow: hidden
```

---

## 4.2 Card Container

Initial properties:

```
position: absolute
bottom: 0
left: 50%
transform: translateX(-50%)
width: 70%
height: 300px
border-radius: 24px
```

Card should:

* Be centered horizontally
* Sit partially above bottom edge

---

## 4.3 Scroll Behavior

Scroll animation should control:

| Property      | Start | End    |
| ------------- | ----- | ------ |
| translateY    | 0     | -200px |
| scale         | 0.8   | 1      |
| width         | 70%   | 100%   |
| height        | 300px | 100vh  |
| border-radius | 24px  | 0px    |

---

# 5. Animation Timeline

Scroll range: **0 → 1000px**

| Scroll Position | Animation            |
| --------------- | -------------------- |
| 0               | initial state        |
| 200px           | card begins scaling  |
| 400px           | card moves upward    |
| 700px           | headline nearly gone |
| 1000px          | card full screen     |

---

# 6. Implementation Requirements

Recommended approach:

**GSAP ScrollTrigger**

Reasons:

* Smooth scroll sync
* Pinning support
* Precise timeline control

---

# 7. DOM Structure

Required HTML structure:

```
<section class="hero">

  <div class="hero-text">
    bringing your way of learning to life
  </div>

  <div class="card-wrapper">
    <div class="card-content">
      <!-- demo / video / illustration -->
    </div>
  </div>

</section>
```

---

# 8. CSS Layout

Hero container:

```
.hero {
  height: 200vh;
  position: relative;
}
```

Headline:

```
.hero-text {
  position: sticky;
  top: 20vh;
  text-align: center;
  font-size: 48px;
}
```

Card wrapper:

```
.card-wrapper {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
}
```

Card content:

```
.card-content {
  width: 100%;
  height: 300px;
  border-radius: 24px;
  overflow: hidden;
}
```

---

# 9. Scroll Animation Logic

Initialize animation:

```
gsap.timeline({
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "+=1000",
    scrub: true,
    pin: true
  }
})
```

Animate card:

```
.fromTo(".card-content",
{
  scale: 0.8,
  borderRadius: 24
},
{
  scale: 1,
  width: "100%",
  height: "100vh",
  borderRadius: 0
})
```

---

# 10. Performance Requirements

The animation must:

* Maintain **60 FPS**
* Use **transform properties instead of layout changes**
* Avoid heavy DOM reflows

Use:

```
transform
opacity
scale
translate
```

Avoid:

```
top
left
margin
```

---

# 11. Mobile Behavior

Mobile adjustments:

Card initial width:

```
width: 90%
```

Headline font size:

```
font-size: 32px
```

Scroll distance shortened:

```
end: "+=700"
```

---

# 12. Accessibility

Requirements:

* Text must remain readable
* Card content must be keyboard navigable
* Reduced motion preference supported

Example:

```
@media (prefers-reduced-motion: reduce) {
  disable animation
}
```

---

# 13. Edge Cases

Handle:

### Fast scrolling

Use scrub animation.

### Short viewport heights

Card must not overflow incorrectly.

### Safari rendering

Ensure:

```
will-change: transform
```

---

# 14. Acceptance Criteria

The feature is complete when:

* Hero loads with visible headline
* Card is partially visible at bottom
* Scrolling expands card
* Headline scrolls away
* Card fills viewport smoothly
* Animation remains smooth across browsers

---

# 15. Testing Checklist

Test on:

Desktop

* Chrome
* Safari
* Firefox
* Edge

Mobile

* iOS Safari
* Android Chrome

Verify:

* Scroll sync
* Smooth scaling
* No layout shifts
* Correct pinning behavior

---

# 16. Deliverables

Engineering must produce:

1. Hero section component
2. Scroll animation implementation
3. Mobile responsive behavior
4. Accessibility compliance
5. Cross browser compatibility

---

# 17. Future Enhancements

Possible improvements:

* Parallax background elements
* Animated particles during expansion
* Dynamic card content loading
* Interactive product preview

---

# End of Document
