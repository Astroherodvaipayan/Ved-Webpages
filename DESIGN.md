# Ved AI - Design Principles & Style Guide

## Overview

This document outlines the design principles, visual language, and styling conventions used in the Ved AI landing page. The design embodies a premium, sophisticated aesthetic that reflects the high-tech nature of AI-powered meta-learning.

## Color Palette

### Primary Colors

| Color | Hex Code | Usage |
|-------|----------|-------|
| Deep Navy | `#1E3A8A` | Primary accent, buttons, highlights |
| Midnight Navy | `#0F1F4D` | Dark elements, overlays |
| Rich Gold | `#D4AF37` | Premium accents, hover states, highlights |

### Background Colors

| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary Background | `#FAFBFF` | Main page background |
| Secondary Background | `#F0F4FF` | Section backgrounds |
| Tertiary Background | `#E8EEFF` | Cards, elevated surfaces |
| Card Background | `#FFFFFF` | Content### Text Colors

 cards |

| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary Text | `#0A0F2E` | Headings, important text |
| Secondary Text | `#2D3A6B` | Body text |
| Muted Text | `#6B7AA1` | Supporting text |
| Dim Text | `#B0B8D1` | Placeholder, disabled |

### Gradients

```css
--gradient-neon: linear-gradient(135deg, #1E3A8A 0%, #D4AF37 100%);
--gradient-glass: linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.3) 100%);
```

## Typography

### Font Families

| Font | Purpose | Weights |
|------|---------|----------|
| **Montserrat** | Headings, navigation, buttons | 300, 700, 900 |
| **Inter** | Body text, paragraphs | 400, 500, 600 |

### Usage Guidelines

- **Headings (h1-h6)**: Montserrat, weight 700, letter-spacing -0.03em
- **Body text**: Inter, weight 400-500
- **Buttons**: Montserrat, weight 700, uppercase, letter-spacing 0.1em
- **Eyebrow text**: Montserrat, 0.75rem, weight 600, uppercase, letter-spacing 0.25em

### CSS Variables

```css
--font-montserrat: var(--font-montserrat);
--font-inter: var(--font-inter);
```

## Styling Approach

### Tailwind CSS v4

The project uses **Tailwind CSS v4** with the following configuration:

- `@tailwindcss/postcss`: PostCSS integration
- `@tailwindcss/vite`: Vite support (if needed)
- Custom theme variables defined in `@theme` block
- CSS-native color palette using CSS custom properties

### Component Architecture

```
components/
├── PixelCard.jsx         # 3D pixel-style card component
├── PixelCard.css
├── ProfileCard.jsx       # Profile display card
└── ProfileCard.css

app/components/
├── sections/            # Page section components
│   ├── Hero.tsx
│   ├── Header.tsx
│   ├── FeatureShowcase.tsx
│   ├── ProductShowcase.tsx
│   ├── Architecture.tsx
│   ├── Roadmap.tsx
│   ├── Metrics.tsx
│   ├── Traction.tsx
│   ├── Moat.tsx
│   ├── ProblemStatement.tsx
│   ├── CaseGrid.tsx
│   ├── FooterCTA.tsx
│   ├── JoinRevolution.tsx
│   ├── CloudSection.tsx
│   ├── Schools.tsx
│   ├── Mission.tsx
│   └── TransitionPanels.tsx
│
└── ui/                 # Reusable UI components
    ├── Navigation.tsx
    ├── GradientButton.tsx
    ├── GlobalBackground.tsx
    ├── BackgroundController.tsx
    ├── Atmosphere.tsx
    ├── CloudReveal.tsx
    ├── CloudTransition.tsx
    ├── ImageTransition.tsx
    ├── SlicedReveal.tsx
    ├── Preloader.tsx
    ├── ScrollProgress.tsx
    └── CustomCursor.tsx
```

### shadcn/ui Integration

The project uses **shadcn/ui** for base UI components:

- `class-variance-authority`: Component variants
- `clsx` & `tailwind-merge`: Class utility functions
- Radix UI primitives for accessibility

## Animation Strategy

### Animation Libraries

| Library | Purpose |
|---------|---------|
| **GSAP** | Complex timeline animations, scroll-triggered effects |
| **Framer Motion** | React-friendly animations, layout transitions |
| **@gsap/react** | React integration for GSAP |
| **Lenis** | Smooth scrolling experience |
| **@studio-freight/react-lenis** | React wrapper for Lenis |
| **react-countup** | Number counting animations |

### Animation Techniques

1. **Scroll-Triggered Reveals**: Elements animate in as they enter the viewport
2. **Parallax Effects**: Background layers move at different speeds
3. **3D Transforms**: Perspective-based card flips and rotations
4. **Glassmorphism**: Backdrop blur effects for depth
5. **Data Stream Effects**: Animated background patterns
6. **Neon Glows**: Hover states with box-shadow glows

### Custom Easing

```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out-expo: cubic-bezier(0.87, 0, 0.13, 1);
```

### Animation Classes

```css
.reveal-up        /* Fade in from below */
.glass-panel      /* Glassmorphism card */
.card-hover       /* Hover lift effect */
.neon-glow        /* Neon glow on hover */
.data-stream-bg   /* Animated background */
.scan-lines       /* CRT scan line overlay */
```

## Key Design Principles

### 1. Premium Minimalism

- Clean, uncluttered layouts with generous whitespace
- Focus on content hierarchy and readability
- Subtle shadows and depth for visual interest

### 2. Navy & Gold Elegance

- Trustworthy navy as the dominant color
- Gold accents for premium, sophisticated feel
- Gradients add depth without overwhelming

### 3. Motion-First Experience

- Smooth, purposeful animations
- Scroll-linked interactions that feel natural
- Performance-optimized with will-change hints

### 4. Glassmorphism Depth

- Frosted glass panels for overlay content
- Layered backgrounds create depth
- Blur effects enhance modern aesthetic

### 5. Responsive Design

- Mobile-first approach
- Fluid typography and spacing
- Touch-friendly interactions

## Component Patterns

### Button Styles

```css
.btn-primary {
  background: var(--color-accent-primary);
  color: #ffffff;
  font-family: var(--font-montserrat);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 1rem 2.5rem;
  border-radius: 9999px;
}
```

### Card Patterns

```css
.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(30, 58, 138, 0.08);
  box-shadow: 0 4px 30px rgba(30, 58, 138, 0.06);
}

.card-hover:hover {
  transform: translateY(-5px);
  border-color: rgba(30, 58, 138, 0.15);
  box-shadow: 0 20px 40px -10px rgba(30, 58, 138, 0.12);
}
```

### Text Gradient

```css
.text-gradient {
  background: var(--gradient-neon);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

## Responsive Breakpoints

The design follows responsive principles through Tailwind's utility classes:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## Performance Considerations

- CSS animations over JavaScript where possible
- `will-change` hints for transform-heavy animations
- Optimized font loading with `display: swap`
- Lazy loading for heavy components
- Lenis smooth scroll for better perceived performance

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Focus-visible states
- Sufficient color contrast ratios
- Reduced motion support via prefers-reduced-motion

---

# Referral Link System Implementation Plan

## Overview
Implement a full referral tracking system that generates unique referral links for each waitlist signup, tracks referrer/referral relationships, stores referral data in the database, and displays referral links after successful signup.

## Current State Analysis

**What already exists:**
- Waitlist table in Supabase with fields: id, name, email, role, avatar_url, status, created_at, updated_at
- Frontend referral link generation in WaitlistPage.tsx using email prefix as ref code
- WaitlistSuccess component displaying referral link and share buttons
- API route at `/api/waitlist` for form submission

**What's missing:**
- No unique referral codes stored in database
- No referral tracking (referred_by field)
- Client-side only referral link (not persistent/secure)
- No referral statistics or analytics

## Requirements

1. Generate unique, secure referral codes (not email-based) for each user
2. Store referrer information when a new user signs up via referral link
3. Track referral counts per user for analytics/rewards
4. Display unique referral links in WaitlistSuccess component
5. Allow users to share via Twitter, WhatsApp, LinkedIn
6. Prevent referral code manipulation (server-side validation)

## Architecture Changes

### Database Schema Changes
- Add `referral_code` column to `waitlist` table (unique, indexed)
- Add `referred_by` column to `waitlist` table (foreign key to waitlist.id, nullable)
- Add `referral_count` column to `waitlist` table (default 0)

### New Files
- `app/api/waitlist/referrals/route.ts` - Get referral stats for a user
- `lib/referral.ts` - Utility functions for generating/validating referral codes

### Modified Files
- `app/api/waitlist/route.ts` - Capture referral code on signup
- `app/waitlist/components/WaitlistPage.tsx` - Capture ref param from URL and send to API

## Implementation Steps

### Phase 1: Database Schema

1. **Add referral columns to waitlist table** (Supabase SQL)
   ```sql
   -- Add unique referral_code column
   ALTER TABLE waitlist
   ADD COLUMN IF NOT EXISTS referral_code VARCHAR(20) UNIQUE;

   -- Add referred_by column (self-referential FK)
   ALTER TABLE waitlist
   ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES waitlist(id) ON DELETE SET NULL;

   -- Add referral_count column
   ALTER TABLE waitlist
   ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0;

   -- Create index for faster lookups
   CREATE INDEX IF NOT EXISTS idx_waitlist_referral_code ON waitlist(referral_code);
   CREATE INDEX IF NOT EXISTS idx_waitlist_referred_by ON waitlist(referred_by);
   ```

### Phase 2: Backend API Changes

2. **Create referral code generator utility** (File: `lib/referral.ts`)
   ```typescript
   // lib/referral.ts
   const REFERRAL_CODE_LENGTH = 12
   const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789'

   export function generateReferralCode(): string {
     const array = new Uint8Array(REFERRAL_CODE_LENGTH)
     crypto.getRandomValues(array)
     return Array.from(array, (byte) => CHARS[byte % CHARS.length]).join('')
   }

   export function buildReferralLink(referralCode: string, baseUrl: string): string {
     return `${baseUrl}/waitlist?ref=${referralCode}`
   }

   export function parseReferralCode(url: string): string | null {
     try {
       const urlObj = new URL(url)
       return urlObj.searchParams.get('ref')
     } catch {
       return null
     }
   }
   ```

3. **Update waitlist API route** (File: `app/api/waitlist/route.ts`)
   - Import referral utilities
   - Add `referralCode` optional field to input schema
   - Look up referrer by code and set `referred_by`
   - Generate unique code for new user
   - Return referral link in response

4. **Create referral stats API endpoint** (File: `app/api/waitlist/referrals/route.ts`)
   - GET endpoint to fetch referral stats for a user
   - Returns referralCode, referralCount, and list of referrals

### Phase 3: Frontend Changes

5. **Update WaitlistPage to capture and pass referral code**
   - Add state for `referralSource` (captured from URL)
   - On mount, parse `ref` query parameter
   - Pass `referralCode` to API on submit

6. **Update WaitlistSuccess to show referral stats**
   - Accept new props: `referralCode`, `referralCount`
   - Display referral count if available

### Phase 4: URL Parameter Handling

7. **Handle referral code validation gracefully**
   - Show subtle indicator when user arrived via referral
   - Optionally show "Invited by [name]" if referrer info available

## Testing Strategy

- **Unit tests**: Referral code generation, URL parsing utilities
- **Integration tests**:
  - Signup with valid referral code updates referrer count
  - Signup with invalid referral code fails gracefully
  - Referral stats endpoint returns correct data
- **E2E tests**:
  - User A shares referral link
  - User B clicks link and signs up
  - User A sees referral count increase

## Risks & Mitigations

- **Risk**: Referral code collision
  - Mitigation: Use crypto.getRandomValues for sufficient entropy

- **Risk**: Users manipulating referral codes
  - Mitigation: All referral validation happens server-side

- **Risk**: Race condition when updating referral count
  - Mitigation: Use Supabase atomic increment

- **Risk**: Broken referral links if user doesn't exist
  - Mitigation: Validate referral code exists before allowing signup

## Success Criteria

- [ ] Each waitlist signup receives a unique 12-character referral code
- [ ] Referral codes are stored in database and indexed
- [ ] When User B signs up with User A's referral code, User A's referral_count increments
- [ ] WaitlistSuccess displays unique referral link with share options
- [ ] Referral stats can be retrieved via API endpoint
- [ ] Frontend captures ref parameter from URL and sends to backend
- [ ] Invalid referral codes are handled gracefully

## Summary of File Changes

| File | Action |
|------|--------|
| `lib/referral.ts` | New - Referral utility functions |
| `app/api/waitlist/route.ts` | Modify - Add referral tracking on signup |
| `app/api/waitlist/referrals/route.ts` | New - Referral stats endpoint |
| `app/waitlist/components/WaitlistPage.tsx` | Modify - Capture ref param, pass to API |
| `app/waitlist/components/WaitlistSuccess.tsx` | Modify - Accept and display referral stats |
| Supabase Database | Migration - Add referral columns |
