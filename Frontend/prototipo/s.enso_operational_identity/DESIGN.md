---
name: S.ENSO Operational Identity
colors:
  surface: '#f7f9fc'
  surface-dim: '#d8dadd'
  surface-bright: '#f7f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f7'
  surface-container: '#eceef1'
  surface-container-high: '#e6e8eb'
  surface-container-highest: '#e0e3e6'
  on-surface: '#191c1e'
  on-surface-variant: '#42474f'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f4'
  outline: '#737780'
  outline-variant: '#c3c6d0'
  surface-tint: '#386090'
  primary: '#00274a'
  on-primary: '#ffffff'
  primary-container: '#0b3d6b'
  on-primary-container: '#82a9dd'
  inverse-primary: '#a2c9ff'
  secondary: '#00668a'
  on-secondary: '#ffffff'
  secondary-container: '#6bcbfe'
  on-secondary-container: '#005574'
  tertiary: '#3f1d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#5f2f00'
  on-tertiary-container: '#dd9660'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d3e4ff'
  primary-fixed-dim: '#a2c9ff'
  on-primary-fixed: '#001c38'
  on-primary-fixed-variant: '#1c4877'
  secondary-fixed: '#c4e7ff'
  secondary-fixed-dim: '#7cd0ff'
  on-secondary-fixed: '#001e2c'
  on-secondary-fixed-variant: '#004c69'
  tertiary-fixed: '#ffdcc4'
  tertiary-fixed-dim: '#ffb781'
  on-tertiary-fixed: '#2f1400'
  on-tertiary-fixed-variant: '#6d3a09'
  background: '#f7f9fc'
  on-background: '#191c1e'
  surface-variant: '#e0e3e6'
  alert-success: '#2E7D32'
  alert-warning: '#F9A825'
  alert-danger: '#E65100'
  alert-critical: '#B71C1C'
  neutral-dark: '#1C2333'
  neutral-mid: '#B0B8C4'
  neutral-line: '#E8EEF4'
  ocean-deep: '#0B172A'
  wave-orange: '#DE6A34'
  wave-blue: '#2078CB'
typography:
  display:
    fontFamily: Inter
    fontSize: 56px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-h1:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.015em
  headline-h1-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.3'
  subtitle-h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '400'
    lineHeight: '1.0'
    letterSpacing: 0.32em
  data-tabular:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  data-compact:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 40px
  max-width: 1280px
---

## Brand & Style

The design system is a **Technical & Predictive Operational** framework designed for high-stakes climate risk management. It bridges the gap between complex orbital data and territorial action. The brand personality is authoritative, precise, and forward-looking, evoking a sense of scientific reliability and urgent clarity.

The chosen style is **Corporate Modern with Tactile Depth**. It utilizes a "Pacific-to-Territory" pipeline logic, where information flows through clean, systematic layouts. Key characteristics include:
- **Scientific Precision:** Utilizing monospaced fonts for data strings and strict functional color usage.
- **Simulated 3D (Skeuomorphism Lite):** Using the "Orbital 3D" philosophy from the brand assets—incorporating radial gradients, rim lighting, and glassmorphic overlays to give digital objects physical weight.
- **Predictive Clarity:** A layout that prioritizes "The Signal" (input), "The Territory" (processing), and "The Alert" (output).
- **Operational Urgency:** High-contrast functional alerts that stand out against deep, stable institutional backgrounds.

## Colors

The color palette is strictly divided into **Institutional** and **Functional** tiers.

- **Institutional Colors:** `Azul-oceano` (#0B3D6B) serves as the anchor for headers and primary surfaces, while `Azul-ciano satelital` (#1A8FBF) is used for interactive elements, orbital iconography, and primary data series.
- **Functional Alert Scale:** These colors carry specific operational weight and must never be used decoratively. They follow a 4-level risk hierarchy: Green (Normal), Yellow (Attention), Orange (High Risk), and Red (Critical).
- **Interactive States:** Use `Azul-ciano` with an 18% opacity glow for focus states. 
- **Data Visualization:** El Niño anomalies use `alert-danger` (Orange), while La Niña anomalies use `secondary` (Cyan).

## Typography

This system uses a dual-font strategy to separate narrative from empirical data.

- **UI & Narrative:** `Inter` is the primary workhorse. It is used for all interface controls, headings, and instructional text. For display headers, use tight letter spacing to maintain a "technical" density.
- **Data & Metrics:** `JetBrains Mono` is mandatory for all numerical values, timestamps, coordinate data, and statistical coefficients (e.g., α = 0.94). This ensures that characters align vertically in tables and dashboard widgets, facilitating rapid scanning.
- **Hierarchy:** High-level tags and "taglines" should use the `label-caps` style to mimic technical documentation markings.

## Layout & Spacing

The layout philosophy follows a **Fixed-to-Fluid Hybrid** model:
- **Desktop (Gestor Dashboard):** Uses a 12-column fixed grid for the main content area with a 280px fixed sidebar. Content is organized in "Operational Blocks" (Pacific, Territory, Alerts).
- **Mobile (Agricultor Panel):** A single-column vertical stack. Layout is "Mobile-First" (375px base) with a focus on high-contrast cards that fill the screen width minus margins.
- **Rhythm:** Spacing follows a 4px baseline. Use 16px (4 units) for standard gutters and 24px (6 units) for vertical spacing between disparate content blocks.
- **Visual Flow:** Dashboards should be ordered by data maturity: raw signal at the top, spatial visualization in the center, and actionable tabular lists at the bottom.

## Elevation & Depth

Hierarchy is established through **Tonal Layering and Tactical Shadows**, inspired by the central planetary asset:

- **Surface Levels:** 
    - **Base:** `Neutro claro` (#F4F6F9) for main backgrounds.
    - **Level 1 (Cards):** Pure White (#FFFFFF) with a 1px border of `neutral-line` (#E8EEF4).
- **Shadows:** Use the "Planet Shadow" style for primary floating elements (like the central planet or key alert cards): `dx=0, dy=6, blur=10px` with 25% opacity of `ocean-deep`.
- **Glassmorphism:** Use semi-transparent overlays (18% opacity) for "Rim Highlights" and decorative patterns. Section dividers in presentation slides should feature the cyan sinusoidal wave pattern at 18% opacity over an `Azul-oceano` background.
- **Depth Cues:** Background orbital rings use dashed strokes and 40% opacity to denote they are "behind" the main content plane.

## Shapes

The shape language is **Technical-Geometric**. 

- **Containers:** All primary UI components (buttons, inputs, cards) use a **Soft (2px/0.25rem)** corner radius. This provides a sharp, engineering-grade feel without the harshness of 0px corners.
- **Data Nodes:** Use perfect circles for status indicators ("dots") within badges and satellite nodes.
- **Motion Paths:** Follow elliptical and sinusoidal geometries. Wave paths in charts and dividers should utilize Quadratic Bézier curves with round line caps to maintain the fluid, "liquid" metaphor of oceanic data.

## Components

- **Buttons:** 
    - **Primary:** `Azul-oceano` background, white text, 2px radius. 
    - **Accent:** `Azul-ciano` background, white text.
- **Risk Badges:** A container with 10% opacity of the functional color, a solid 8px circle of the functional color, and the label in `neutral-dark`.
- **Inputs:** 2px radius. Default border is `neutral-line`. On focus, use a 3px `Azul-ciano` outer glow at 18% opacity.
- **Risk Cards:** For mobile alerts, the entire card background adopts the functional color of the risk level (e.g., an "Alto Risco" card has an Orange background) to ensure immediate non-verbal communication.
- **Calendars:** Use a horizontal scroll "Ribbon" with functional color bands (Green/Orange/Red) indicating planting or risk windows.
- **Data Tables:** Minimalist design with `neutral-mid` reference lines. Use `JetBrains Mono` for all cell content. The header should be anchored in `Azul-oceano`.
- **Logos:** 
    - **Horizontal Clear:** Used in white/light headers.
    - **Negative:** Used on `Azul-oceano` covers.