# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (uses Turbopack for faster builds)
- **Build for production**: `npm run build` (builds with Turbopack)
- **Static export**: `npm run export` (builds and exports static files)
- **Production server**: `npm start`
- **Linting**: `npm run lint` (ESLint with Next.js config)

## Project Architecture

This is a DJ Kevin Daman's professional website built with Next.js 15 and React 19, configured for static export deployment.

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 with custom themes
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Data Fetching**: SWR
- **Build Tool**: Turbopack for fast development and builds

### Key Configuration
- **Static Export**: Configured for static site generation (`output: 'export'`)
- **Images**: Unoptimized for static export compatibility
- **Path Aliases**: `@/*` maps to `./src/*`
- **Fonts**: Uses Geist and Geist Mono from Google Fonts

### Project Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata and fonts
│   ├── page.tsx            # Homepage with hero, about, services sections
│   ├── links/page.tsx      # Links page with social media links
│   └── globals.css         # Global styles and Tailwind imports
└── components/
    └── book-now.tsx        # Reusable contact/booking component
```

### Component Patterns
- **Client Components**: Pages use `'use client'` directive for interactivity
- **Shared Navigation**: Mobile-responsive navigation with hamburger menu
- **Consistent Styling**: Dark theme with purple/cyan accent colors
- **Reusable Components**: BookNow component used across pages
- **Icon Integration**: Lucide React icons throughout interface

### Styling Approach
- **Tailwind v4**: Uses new `@theme inline` syntax for custom properties
- **Dark Theme**: Black/gray color scheme with neon accents
- **Responsive**: Mobile-first design with breakpoint-specific layouts
- **Accessibility**: Color contrast and focus states included