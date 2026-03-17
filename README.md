# Ved AI - Meta-Learning Agent Landing Page

<p align="center">
  <img src="app/icon.png" alt="Ved AI Logo" width="120" />
</p>

<p align="center">
  <strong>The World's Best Meta-Learning Agent</strong><br />
  Learns how you learn, and teaches you to mastery. Enabling a billion geniuses.
</p>
good
---

## About

Ved AI is a high-tech landing page for an AI-powered meta-learning platform. The website showcases the product's features, architecture, roadmap, and vision through an immersive, animation-rich experience.

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16.1.1 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Animations** | GSAP, Framer Motion |
| **3D Graphics** | Three.js, React Three Fiber |
| **Smooth Scroll** | Lenis |
| **UI Components** | shadcn/ui, Radix UI |
| **Icons** | Lucide React |
| **Build Tool** | PostCSS |

### Key Dependencies

```json
{
  "next": "16.1.1",
  "react": "^18.2.0",
  "tailwindcss": "^4",
  "gsap": "^3.14.2",
  "framer-motion": "^12.23.26",
  "@studio-freight/lenis": "^1.0.42",
  "three": "^0.182.0",
  "lucide-react": "^0.577.0"
}
```

## Project Structure

```
ved-webpage/
├── app/                          # Next.js App Router
│   ├── components/
│   │   ├── sections/             # Page section components
│   │   │   ├── Hero.tsx              # Main hero section
│   │   │   ├── Header.tsx            # Navigation header
│   │   │   ├── FeatureShowcase.tsx   # Product features
│   │   │   ├── ProductShowcase.tsx   # Product display
│   │   │   ├── Architecture.tsx      # Technical architecture
│   │   │   ├── Roadmap.tsx           # Product roadmap
│   │   │   ├── Metrics.tsx           # Key metrics
│   │   │   ├── Traction.tsx          # Traction/progress
│   │   │   ├── Moat.tsx              # Competitive advantages
│   │   │   ├── ProblemStatement.tsx  # Problem description
│   │   │   ├── CaseGrid.tsx           # Use cases grid
│   │   │   ├── FooterCTA.tsx         # Call to action
│   │   │   ├── JoinRevolution.tsx    # Join section
│   │   │   ├── CloudSection.tsx      # Cloud features
│   │   │   ├── Schools.tsx           # Schools section
│   │   │   ├── Mission.tsx           # Mission page
│   │   │   └── TransitionPanels.tsx  # Transitions
│   │   │
│   │   └── ui/                   # Reusable UI components
│   │       ├── Navigation.tsx        # Main navigation
│   │       ├── GradientButton.tsx    # Custom button
│   │       ├── GlobalBackground.tsx  # Background effects
│   │       ├── BackgroundController.tsx
│   │       ├── Atmosphere.tsx        # 3D atmosphere
│   │       ├── CloudReveal.tsx       # Cloud reveal effect
│   │       ├── CloudTransition.tsx   # Cloud transitions
│   │       ├── ImageTransition.tsx   # Image transitions
│   │       ├── SlicedReveal.tsx      # Sliced reveal effect
│   │       ├── Preloader.tsx         # Loading screen
│   │       ├── ScrollProgress.tsx    # Scroll indicator
│   │       └── CustomCursor.tsx      # Custom cursor
│   │
│   ├── mission/                  # Mission page route
│   │   └── page.tsx
│   │
│   ├── schools/                 # Schools page route
│   │   └── page.tsx
│   │
│   ├── globals.css              # Global styles & theme
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
│
├── components/                   # Standalone components
│   ├── PixelCard.jsx            # 3D pixel card
│   └── ProfileCard.jsx          # Profile card
│
├── lib/                         # Utility functions
│
├── public/                      # Static assets
│
├── package.json                 # Dependencies
├── next.config.ts               # Next.js config
├── tailwind.config.*            # Tailwind config
├── postcss.config.mjs           # PostCSS config
├── tsconfig.json                # TypeScript config
├── DESIGN.md                    # Design system docs
└── README.md                    # This file
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/Astroherodvaipayan/Ved-Webpages.git
cd Ved-Webpages

# Install dependencies
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install

# Or using bun
bun install
```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Create a production build:

```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

### Production

Start the production server:

```bash
npm start
# or
yarn start
# or
pnpm start
# or
bun start
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home page - Main landing |
| `/mission` | Mission page |
| `/schools` | Schools/institutions page |

## Design System

### Colors

- **Primary**: Deep Navy (#1E3A8A)
- **Accent**: Rich Gold (#D4AF37)
- **Background**: Light premium (#FAFBFF)

See [DESIGN.md](./DESIGN.md) for complete color palette and typography.

### Typography

- **Headings**: Montserrat (700, 900)
- **Body**: Inter (400, 500, 600)

### Animation Libraries

- **GSAP**: Complex timeline animations
- **Framer Motion**: React animations
- **Lenis**: Smooth scroll

## Features

- Cinematic hero section with 3D effects
- Smooth scroll experience
- Glassmorphism UI components
- Interactive feature showcases
- Responsive design
- Performance-optimized animations
- Custom cursor
- Loading preloader
- Scroll progress indicator

## License

Private - All rights reserved

## Contributing

This is a private project. Please contact the team for contribution guidelines.

---

<p align="center">
  Built with Next.js, Tailwind CSS, GSAP, and Three.js
</p>
