---
name: react-architecture
description: "Guidelines for React and Inertia.js component architecture, state management, and file structure."
---

# React & Inertia Architecture Guidelines

When building the frontend for this application, Antigravity agents must adhere to these architectural boundaries to prevent unmaintainable, prop-drilling spaghetti code.

## 1. Inertia-First Philosophy
- **Data Fetching:** Rely on server-side data passed via Inertia props. Avoid `useEffect` + `fetch/axios` for initial page data.
- **Forms:** Always use Inertia's `useForm` hook for form state, validation, and submission handling. Do not build custom form state with `useState` unless absolutely necessary.

## 2. Component Boundaries
- **Thin Pages:** Files in `resources/js/pages/` should primarily be layout wrappers and prop receivers. Complex logic should be abstracted.
- **Dumb UI Components:** UI elements (Buttons, Inputs, Cards) in `resources/js/components/ui/` should be purely presentational, accepting props and emitting events. They should not contain business logic or make network requests.

## 3. State Management
- Avoid deep prop-drilling. If state needs to be shared across multiple nested components, lift it to a React Context or use a lightweight store (like Zustand) rather than passing props down 5 levels.
- Keep local `useState` restricted to purely visual states (e.g., `isOpen` for a modal).

## 4. AI Anti-Pattern Warning: Over-engineering
- **Do not prematurely abstract:** While pages should be thin, do not extract components or custom hooks for simple, single-use forms or trivial features. 
- **Rule of Thumb:** Keep everything in one file for rapid prototyping unless it exceeds ~150 lines or the logic/UI needs to be explicitly reused elsewhere.
