---
version: alpha
name: Aero SaaS Product Management Template
description: A high-density, dark-themed SaaS workspace designed for project management and engineering workflows, featuring deep blue accents, blurred gradients, and a clear information hierarchy.
colors:
  background: "var(--background)"
  surface: "var(--card)"
  surface-alt: "var(--popover)"
  primary: "var(--primary)"
  accent-blue: "var(--ring)"
  text-primary: "var(--foreground)"
  text-secondary: "var(--muted-foreground)"
  text-muted: "var(--muted-foreground)"
  border: "var(--border)"
  success: "var(--chart-2)"
  warning: "var(--chart-4)"
  danger: "var(--destructive)"
typography:
  family: "Inter, sans-serif"
  weights:
    light: 300
    regular: 400
    medium: 500
    semibold: 600
  sizes:
    xs: 0.75rem
    sm: 0.875rem
    base: 1rem
    lg: 1.125rem
    xl: 1.25rem
    display: 3.75rem
spacing:
  base: 4px
  container-max: 1280px
rounded:
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  "2xl": 16px
  full: 9999px
components:
  button-primary: "bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-500 shadow-blue-950/50"
  card: "rounded-xl border border-white/10 bg-gradient-to-br from-white/7 to-white/1.5"
  badge: "rounded-full border border-blue-400/15 bg-blue-500/10 px-3 py-1.5 text-blue-200"
---

## Overview
Aero is a high-density project management interface designed for modern engineering teams. The visual personality is professional and technical, utilizing a deep carbon-black palette (`#030712`) with vibrant blue highlights and glassmorphism effects. The layout is structured around a central "Nexus" workspace that balances high information density with a calm, readable aesthetic through generous use of whitespace and precise typography.

## Colors (Global CSS)
- **Semantic Theming**: Do NOT use arbitrary hex colors (like `bg-[#030712]`). Always use the global CSS variables defined in the project's `app.css` (e.g., `bg-background`, `bg-card`, `text-primary`). This ensures robust light/dark mode support and maintains a single source of truth.
- **Primary Palette**: The interface uses `bg-background` for the base canvas. Accents use `bg-primary` for main actions and `bg-ring` or `text-primary` for active states.
- **Status Colors**: Rely on semantic variables like `text-destructive` for errors, or standard Tailwind colors for specific visual pips if semantic variables don't exist.
- **Overlays**: Use opacity modifiers with semantic variables (e.g., `bg-primary/15`) to provide depth through background blur circles.

## Typography
- **Primary Font**: Inter (300 to 600 weights).
- **Scale**:
  - Headlines: 3.75rem (6xl) for hero sections, tracking-tight, medium weight.
  - UI Text: Small sizes (0.75rem and 0.875rem) dominate the workspace interface to maintain density.
  - Mono: Used for code snippets and keyboard shortcuts (`kbd`).

## Layout
- **Grid System**: A 2rem x 2rem background grid pattern (opacity 0.035) serves as a visual guide.
- **Workspace**: A split-pane layout for the application preview featuring a narrow sidebar (12rem) and a flexible content area.
- **Content Alignment**: Center-aligned hero sections transition into left-aligned utility sections and grid-based feature blocks.

## Elevation & Depth
- **Surfaces**: Primary surfaces use `backdrop-filter: blur(16px)` with 90% opacity.
- **Shadows**: Heavy, dark shadows (`shadow-black/40`) and colored glows (`shadow-blue-950/30`) emphasize floating components.
- **Borders**: Thin 1px borders using `white/10` or `white/5` define shapes without adding visual weight.

## Shapes
- **Radius**: Softness is consistent across the UI. Large sections use `2xl` (16px), while internal cards use `xl` (12px) or `lg` (8px).
- **Buttons**: Rounded-lg (8px) for primary actions; rounded-full for status badges and avatar masks.

## Components
- **Navigation**: Transparent top bar with a 20px height and subtle text links.
- **Sidebar**: High-density list items with 16px icons and status pips.
- **Issue Cards**: Compact rectangles with vertical stacking, featuring assignee avatars and unique identifiers (e.g., NXS-102).
- **Terminal/Code Block**: A dark container with syntax highlighting using violet, blue, and emerald tones.

## Page Sections

### Navigation
A fixed-height (h-20) header featuring a stylized atom logo in a blue glow. Contains centered navigation links for Platform, Workflows, Developers, and Customers, ending with a "Start building" call-to-action.

### Hero Section
A centered, high-impact area. Includes a pill-shaped announcement badge, a dual-tone 6xl headline, and a descriptive paragraph. Action buttons are paired (Primary Blue / Ghost Gray) above trust signals showing "No credit card" and "Import in minutes."

### Nexus Workspace (Application Preview)
A complex glassmorphic container sitting on a blur-3xl glow. It simulates a project board with:
- **Chrome**: Window controls (red/yellow/green) and a simulated URL bar.
- **Sidebar**: Workspace switcher, global search (⌘K), and a navigation tree.
- **Kanban Board**: Three columns (To do, In progress, Review) containing rich task cards with progress indicators and team avatars.

### Feature Grid
A three-column layout of feature cards. Each card uses a white/2.5% background that brightens on hover. Icons are contained in 40x40 containers with blue borders.

### Developer Section
A split section featuring benefit bullets with checkmarks on the left and a functional code preview on the right. The code block simulates a modern CLI/SDK interaction.

### Social Proof & Stats
A quote section featuring a high-quality user avatar and large-scale testimonial text, followed by a three-column statistical grid showing performance metrics.

### CTA Footer Section
A high-contrast gradient box (`blue-600/25` to transparent) with a centered "Start with momentum" message and dual action buttons.

## Motion & Interaction
- **Hover States**: Links transition color to slate-100. Cards lift slightly (`-translate-y-0.5`) and increase background opacity.
- **Transitions**: 200ms durations for background and transform properties.
- **Performance Control**: Includes a custom controller to pause animations and transitions when requested by the environment.

## Do's and Don'ts
- **Do**: Use high-density layouts for workspace areas.
- **Do**: Maintain the 1px border language for all containers.
- **Don't**: Use solid bright backgrounds; always prefer deep dark surfaces with subtle gradients.
- **Don't**: Overpower the design with color; keep blue as the primary accent and use others sparingly for status.

## Accessibility
- **Contrast**: Text primarily uses slate-300 or slate-400 against a dark background for readability.
- **Semantics**: Proper use of `aside`, `nav`, `main`, and `article` tags for document structure.
- **Labels**: ARIA labels are present on visual-only buttons and logo links.

## Assets
1. `other`: https://cdn.tailwindcss.com
2. `other`: https://code.iconify.design/iconify-icon/2.2.1/iconify-icon.min.js
3. `embed`: https://fonts.googleapis.com
4. `embed`: https://fonts.gstatic.com
5. `embed`: https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap
6. `other`: https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80
7. `other`: https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80
8. `other`: https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80
9. `other`: https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=60&q=80
10. `other`: https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=60&q=80
11. `other`: https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=60&q=80
12. `other`: https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=60&q=80
13. `other`: https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&q=80
14. `other`: https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=60&q=80
15. `other`: https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=100&q=80
