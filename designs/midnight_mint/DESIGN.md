---
name: Midnight Mint
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bec9c2'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#89938c'
  outline-variant: '#3f4943'
  surface-tint: '#8bd6b4'
  primary: '#ffffff'
  on-primary: '#003827'
  primary-container: '#a6f2cf'
  on-primary-container: '#247155'
  inverse-primary: '#1b6b4f'
  secondary: '#bcc7de'
  on-secondary: '#263143'
  secondary-container: '#3e495d'
  on-secondary-container: '#aeb9d0'
  tertiary: '#ffffff'
  on-tertiary: '#233144'
  tertiary-container: '#d5e3fd'
  on-tertiary-container: '#57657b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#a6f2cf'
  primary-fixed-dim: '#8bd6b4'
  on-primary-fixed: '#002115'
  on-primary-fixed-variant: '#00513a'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#d5e3fd'
  tertiary-fixed-dim: '#b9c7e0'
  on-tertiary-fixed: '#0d1c2f'
  on-tertiary-fixed-variant: '#3a485c'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 57px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  title-lg:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.5px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.25px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.1px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style
This design system centers on a professional, high-performance dark mode aesthetic tailored for financial data management and SaaS utility. The personality is efficient, focused, and sophisticated. 

The style is **Corporate / Modern**, heavily influenced by **Material Design 3**. It utilizes the "Material You" philosophy where surfaces are tinted with the primary color to create a cohesive environment. The interface prioritizes readability and task completion, using deep midnight tones to reduce eye strain and soft mint accents to guide the user's eye toward primary actions and success states.

## Colors
The palette is rooted in a "Midnight Blue" foundation. The background uses a near-black blue to ensure maximum contrast with text. 

- **Primary (Soft Mint):** Used for primary buttons, active states, and success indicators. It provides a refreshing "pop" against the dark backdrop.
- **Secondary/Surface (Midnight Blue):** These tones (`#1E293B` and `#0F172A`) are used for cards, sidebars, and navigation elements to create hierarchical depth.
- **Functional Colors:** Error states should utilize a desaturated coral to maintain harmony, while warnings use a muted amber. Success states are synonymous with the Soft Mint primary color.

## Typography
The system uses **Manrope** for headlines to provide a modern, balanced, and slightly technical feel appropriate for a data-centric tool. **Inter** is utilized for body text and labels due to its exceptional legibility at small sizes and high-density interfaces.

Text color follows a strict hierarchy:
- **High Emphasis:** White (`#FFFFFF`) or Slate 50 (`#F8FAFC`) for headlines and primary body.
- **Medium Emphasis:** Slate 400 (`#94A3B8`) for secondary information and captions.
- **Disabled:** Slate 600 (`#475569`).

## Layout & Spacing
The layout follows a **Fluid Grid** system based on an 8px square rhythm. For desktop views, a 12-column grid is standard with 24px gutters.

Padding within components (like cards and modals) should scale logically: 16px for small containers, 24px for standard content blocks. Vertical rhythm is maintained by using 8px increments for all margins between structural elements.

## Elevation & Depth
In this dark mode system, depth is communicated through **Tonal Layers** rather than heavy shadows. As elements "rise" closer to the user, their surface color becomes lighter:
- **Level 0 (Background):** `#020617`
- **Level 1 (Card/Surface):** `#0F172A`
- **Level 2 (Hover/Menus):** `#1E293B`
- **Level 3 (Modals/Popups):** `#334155`

Low-opacity, soft-mint tinted shadows (20% opacity) may be used for floating action buttons (FABs) to provide a subtle "glow" effect, reinforcing the accent color.

## Shapes
Following Material Design 3 guidelines, the system uses a highly **Rounded** shape language to soften the industrial feel of dark mode. 

- **Standard Buttons/Inputs:** 8px (`0.5rem`)
- **Cards/Containers:** 16px (`1rem`)
- **Large Sheets/Dialogs:** 24px (`1.5rem`)
- **Search Bars/Chips:** Pill-shaped (fully rounded)

## Components
- **Buttons:** Primary buttons use a Solid Soft Mint background with Dark Green text (`#064E3B`). Secondary buttons use a Slate 800 outline with Soft Mint text.
- **Input Fields:** Use a filled style with a Dark Slate background (`#1E293B`). The bottom indicator or border glows Soft Mint only when focused.
- **Cards:** No borders; depth is strictly defined by the tonal shift from the background. 
- **Chips:** Used for status (e.g., "Paid", "Pending"). "Paid" uses the Soft Mint background with dark text. "Pending" uses a transparent background with a Slate 400 outline.
- **Data Tables:** Row separators should be subtle (`#1E293B`). Header rows should have a slightly darker tint than the body rows to anchor the data.
- **Selection Controls:** Checkboxes and Radio buttons use the Soft Mint primary color when active.