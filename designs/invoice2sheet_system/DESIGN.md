---
name: Invoice2Sheet System
colors:
  surface: '#f9f9fa'
  surface-dim: '#dadadb'
  surface-bright: '#f9f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeef'
  surface-container-high: '#e8e8e9'
  surface-container-highest: '#e2e2e3'
  on-surface: '#1a1c1d'
  on-surface-variant: '#444749'
  inverse-surface: '#2f3132'
  inverse-on-surface: '#f1f1f1'
  outline: '#75777a'
  outline-variant: '#c4c7c9'
  surface-tint: '#5c5f61'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#191c1e'
  on-primary-container: '#828486'
  inverse-primary: '#c5c7c9'
  secondary: '#396755'
  on-secondary: '#ffffff'
  secondary-container: '#b6e8d1'
  on-secondary-container: '#3b6a57'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#001e2c'
  on-tertiary-container: '#68889c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e2e5'
  primary-fixed-dim: '#c5c7c9'
  on-primary-fixed: '#191c1e'
  on-primary-fixed-variant: '#444749'
  secondary-fixed: '#bbedd6'
  secondary-fixed-dim: '#a0d1bb'
  on-secondary-fixed: '#002116'
  on-secondary-fixed-variant: '#204f3e'
  tertiary-fixed: '#c6e7fe'
  tertiary-fixed-dim: '#aacbe1'
  on-tertiary-fixed: '#001e2c'
  on-tertiary-fixed-variant: '#2a4a5d'
  background: '#f9f9fa'
  on-background: '#1a1c1d'
  surface-variant: '#e2e2e3'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 57px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.25px
  headline-md:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
    letterSpacing: 0px
  title-lg:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: 0px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: 0.15px
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
  unit: 4px
  margin-mobile: 16px
  margin-tablet: 24px
  gutter: 16px
  container-max: 1200px
---

## Brand & Style

The design system is engineered for **Productive Minimalism**. It targets professionals and small business owners who require high-speed data extraction and seamless exports to spreadsheets. The brand personality is clinical, reliable, and unobtrusive, ensuring the interface recedes to let the user's data take center stage.

Drawing from **Corporate / Modern** aesthetics and Material Design 3 (Material You) principles, the system emphasizes efficiency through clear hierarchy and reduced visual noise. The emotional response is one of "calm control"—transforming the chaotic task of invoice processing into an automated, orderly flow.

## Colors

The palette utilizes Material You dynamic color logic. The **Midnight Blue** primary provides a grounded, authoritative foundation, while the **Soft Mint** secondary acts as a functional accent for success states and confirmation actions, suggesting growth and accuracy.

- **Primary Role:** Navigation, key headers, and prominent branding.
- **Secondary Role:** Success indicators, status badges for "Processed" invoices, and supportive action accents.
- **Neutral Role:** Following MD3 "Neutral" and "Neutral Variant" specs, using tonal grays to differentiate between background, surface, and surface-container levels.
- **Dynamic Logic:** Surfaces should accept a slight tint of the primary color to maintain a cohesive, "oxygenated" feel across the PWA.

## Typography

This design system utilizes **Inter** (as a highly legible alternative to Google Sans) to maximize readability within data-dense spreadsheets and invoice lists. The type scale follows the standard Material 3 hierarchy, ensuring that invoice totals and vendor names are instantly scannable. 

System fonts should fall back to standard sans-serif stacks on devices where Inter is not available. High-emphasis numbers (invoice amounts) should utilize `title-lg` with a medium weight to ensure they stand out against body text.

## Layout & Spacing

The layout utilizes a **fluid grid** system. On mobile devices, a 4-column grid is used with 16px margins. As the PWA scales to desktop, it transitions to a 12-column grid. 

A strict 4dp / 8dp baseline grid governs all vertical spacing to maintain a rhythmic, systematic feel. Content is organized into functional "containers" that adapt their width based on the viewport, ensuring that invoice detail views remain legible on both handheld devices and wide monitors.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layers** rather than heavy shadows, consistent with Material 3. 

1.  **Level 0 (Flat):** Main background.
2.  **Level 1 (Surface):** Cards and main content area. Uses a subtle primary container color.
3.  **Level 2 (Elevated):** Hover states for cards and navigation bars.
4.  **Level 3 (Overlay):** Dialogs and Floating Action Buttons (FAB). These use an **ambient shadow**—highly diffused, low opacity, with a slight Midnight Blue tint to prevent the shadow from appearing muddy.

Depth is primarily signaled through color shifts in the "Surface Container" spectrum (Lowest, Low, Default, High, Highest).

## Shapes

The shape language is "Extra Rounded" for primary interaction points to provide a friendly, modern contrast against the rigid, rectangular nature of invoice data.

- **Floating Action Buttons (FAB):** Utilize a 28dp radius, creating a signature large-format rounded square or pill.
- **Cards:** Use a 12-16dp radius to soften the layout of the invoice list.
- **Tonal Buttons:** Fully pill-shaped (100px) to maximize touch target comfort and visual distinction.
- **Text Fields:** Slightly more structured with 4-8dp corners to maintain a professional "form-filling" feel.

## Components

- **Floating Action Buttons (FAB):** The primary entry point for "Scan Invoice." Located at the bottom right. Uses `Primary Container` color with a `Large FAB` (96x96dp) or `Standard FAB` (56x56dp) configuration.
- **Material Text Fields:** Outlined variants with `Midnight Blue` borders on focus. Labels transition to the top border. Error states utilize a standard MD3 Red, while successful validation uses `Soft Mint`.
- **Tonal Buttons:** Used for secondary actions (e.g., "Export to Sheet," "Save Draft"). These use the `Secondary Container` (Soft Mint) color with a lower emphasis than the FAB.
- **Bottom Navigation:** Fixed to the bottom of the PWA. Icons use a "pill" shaped active indicator. Labels are always visible for accessibility.
- **Skeleton Loaders:** Subtle, pulsing rectangles with a `Surface Container` background. Used during OCR processing and API fetches to maintain the perception of speed.
- **Data Chips:** Small, rounded (8dp) chips used for "Category" or "Status" (e.g., Paid, Pending, Overdue).
- **Surface-Container Cards:** Each invoice in a list is a card with a subtle 1px border or tonal shift to separate it from the background without requiring heavy shadows.