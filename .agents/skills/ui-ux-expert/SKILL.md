---
name: ui-ux-expert
description: "Comprehensive UI/UX design intelligence and checklists. Use this skill when planning, building, reviewing, or fixing UI/UX code. Covers accessibility, responsive layout, typography, animations, and professional polish."
---

# UI/UX Expert Guidelines for Antigravity

This skill provides comprehensive UI/UX guidelines and checklists to ensure production-grade, highly polished interfaces. Instead of relying on external scripts, Antigravity agents should internalize these rules and apply them proactively whenever writing or reviewing frontend code (React, Vue, Tailwind, HTML/CSS, etc.).

## When to Apply

Reference these guidelines when:
- Designing new UI components or pages.
- Reviewing code for UX, accessibility, or layout issues.
- Adding final polish to an application before delivery.
- Debugging visual glitches like layout shifts or poor contrast.

## 1. Quick Reference: Core Principles

### Accessibility (CRITICAL)
- **Contrast**: Minimum 4.5:1 ratio for text.
- **Focus States**: Visible focus rings on interactive elements for keyboard navigation.
- **Alt Text**: Meaningful alt text for images; empty `alt=""` for purely decorative ones.
- **Labels**: `aria-label` for icon-only buttons, proper `<label>` for forms.
- **Keyboard Nav**: Tab order must match the visual order.

### Touch & Interaction (CRITICAL)
- **Touch Targets**: Minimum 44x44px for clickable elements on mobile.
- **Hover States**: Always provide visual feedback (color, shadow, border) on interactive elements.
- **Disabled States**: Disable buttons and show loading spinners during async operations.
- **Pointers**: Always add `cursor-pointer` to clickable/hoverable elements (cards, buttons, links).

### Performance & Layout (HIGH)
- **Viewport**: `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- **Text Size**: Minimum 16px body text on mobile to prevent automatic zooming on inputs (iOS).
- **No Overflow**: Prevent accidental horizontal scrolling (`overflow-x-hidden` on main wrappers if needed).
- **Z-Index**: Keep a strict, predictable z-index scale (e.g., 10 for sticky navs, 40 for modals, 50 for tooltips).

## 2. Common Rules for Professional UI

Avoid these frequently overlooked issues that make a UI look unprofessional:

### Icons & Visual Elements
| Rule | Do | Don't |
|------|----|-------|
| **No emoji icons** | Use SVG icons (e.g., Lucide, Heroicons) | Use emojis like 🎨 🚀 as UI icons |
| **Stable hover states** | Use color/opacity/shadow transitions | Use scale transforms that shift sibling layouts |
| **Consistent sizing** | Use a fixed size (e.g., `w-5 h-5` in Tailwind) | Mix different icon sizes randomly |

### Interaction & Cursor
| Rule | Do | Don't |
|------|----|-------|
| **Cursor pointer** | Add `cursor-pointer` to interactive cards | Leave the default cursor on clickable items |
| **Smooth transitions** | Use `transition-all duration-200` | Leave state changes instant or jarring |
| **Empty States** | Show well-designed empty states for lists | Leave a blank screen when data is missing |

### Light/Dark Mode Contrast
| Rule | Do | Don't |
|------|----|-------|
| **Glass card (Light)** | Use `bg-white/80` with backdrop blur | Use `bg-white/10` (invisible on light themes) |
| **Muted Text** | Ensure secondary text remains legible | Use grays that are too light (e.g., gray-300 on white) |
| **Borders** | Use visible structural borders (`border-gray-200`) | Use transparent/invisible borders |

### Layout & Spacing
| Rule | Do | Don't |
|------|----|-------|
| **Content padding** | Add padding to account for fixed navbars | Let content hide underneath fixed headers |
| **Consistent widths** | Stick to a consistent `max-w` container | Mix container widths arbitrarily |

## 3. Pre-Delivery Checklist

Before finalizing any UI code, Antigravity agents MUST verify these items:

### Visual Quality
- [ ] No emojis used as icons; SVG icons only.
- [ ] Hover states are smooth and don't cause layout shifts.
- [ ] Colors are consistent and respect the chosen palette.

### Interaction
- [ ] All clickable elements have `cursor-pointer`.
- [ ] Hover states provide clear visual feedback (color/shadow change).
- [ ] Transitions are smooth (150-300ms).
- [ ] Focus states are clearly visible for keyboard navigation.

### Layout & Accessibility
- [ ] Responsive design verified at mobile, tablet, and desktop breakpoints.
- [ ] No horizontal scrolling on mobile.
- [ ] All inputs have labels and all image/icon-buttons have alt text/aria-labels.
- [ ] Light mode and dark mode (if applicable) both have sufficient contrast.
