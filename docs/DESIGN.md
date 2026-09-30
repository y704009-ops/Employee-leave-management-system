---
name: Corporate Modern Enterprise
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#444653'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#757684'
  outline-variant: '#c4c5d5'
  surface-tint: '#3755c3'
  primary: '#00288e'
  on-primary: '#ffffff'
  primary-container: '#1e40af'
  on-primary-container: '#a8b8ff'
  inverse-primary: '#b8c4ff'
  secondary: '#006398'
  on-secondary: '#ffffff'
  secondary-container: '#5bb8fe'
  on-secondary-container: '#00476e'
  tertiary: '#2d3449'
  on-tertiary: '#ffffff'
  tertiary-container: '#434b60'
  on-tertiary-container: '#b4bbd5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c4ff'
  on-primary-fixed: '#001453'
  on-primary-fixed-variant: '#173bab'
  secondary-fixed: '#cce5ff'
  secondary-fixed-dim: '#93ccff'
  on-secondary-fixed: '#001d31'
  on-secondary-fixed-variant: '#004b73'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.015em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system delivers a mature, composed, and institutional visual language engineered for human resources operations. The emotional foundation is grounded in certainty, operational clarity, and psychological safety. Internal HR processes—handling leave accruals, sick leave, compassionate requests, and executive approvals—demand absolute clarity and zero decorative ambiguity.

The design movement is **Corporate / Modern**: high-density structural integrity, precise content bounding, deliberate information hierarchy, and complete elimination of trendy superficial treatments (no decorative gradients, no translucent frosted glass, no neon accents, and no organic canvas blobs). The UI establishes visual authority through disciplined typography, exact pixel alignment, structural keylines, and calibrated data tables.

## Colors

The palette operates with strict semantic role assignment, avoiding decorative or gratuitous color fills. 

- **Primary Canvas Background**: `#F8FAFC` (Slate 50) delivers an eye-friendly, cool-neutral backdrop that reduces glare during prolonged operational use.
- **Secondary Canvas / Wells**: `#F1F5F9` (Slate 100) serves as structural grouping fills, table header zones, and read-only field surfaces.
- **Card Surfaces**: Pure `#FFFFFF` elevates key operational content cards, modals, and dropdown sheets with clear contrast against `#F8FAFC`.
- **Structural Borders & Dividers**: `#E2E8F0` (Slate 200) defines clean, sharp 1px perimeters across all cards, cells, and dividers.
- **Typography Scale**: `#0F172A` (Slate 900) ensures AAA accessibility for primary labels, data values, and headings; `#64748B` (Slate 500) supports secondary annotations, metadata, and timestamps; `#94A3B8` (Slate 400) is reserved for disabled text and placeholder indicators.
- **Brand Accent**: `#1E40AF` (Navy/Blue 800) acts as the interactive anchor for primary actions, focused form borders, and active navigation states. `#2563EB` (Blue 600) serves exclusively as the active hover state.
- **Status Semantic Palette**:
  - *Approved / Active*: Subtle Emerald background `#ECFDF5`, border `#A7F3D0`, text `#065F46`.
  - *Pending / Review*: Subtle Amber background `#FFFBEB`, border `#FDE68A`, text `#92400E`.
  - *Draft / Scheduled*: Subtle Sky background `#F0F9FF`, border `#BAE6FD`, text `#075985`.
  - *Rejected / Cancelled*: Subtle Rose background `#FFF1F2`, border `#FECDD3`, text `#9F1239`.

## Typography

The typographic hierarchy prioritizes rapid scanning and tabular precision. `Inter` provides high legibility at dense enterprise desktop resolutions, featuring open apertures and distinct character shaping. For numerical identifiers, balance tallies, employee IDs, and timestamps, `JetBrains Mono` is used selectively to align tabular digits perfectly across grid cells.

- Headings use negative letter tracking to maintain structural tightness on high-DPI displays.
- Section titles rely on weight contrast (`600` vs `400`) rather than drastic font size jumps to preserve vertical efficiency.
- Microcopy, table column headers, and status badges utilize strict uppercase or standardized sentence case with slight positive tracking to ensure instant legibility at sub-13px sizing.

## Layout & Spacing

Layout geometry follows an 8-point structural system, using a 4-point sub-grid for internal component padding, badge boundaries, and input heights.

- **Desktop Layout (≥ 1280px)**: A 12-column responsive fluid grid bounded by a maximum shell container of 1440px. Gutters are standardized to `1rem` (16px), with canvas edge margins of `1.5rem` (24px). Fixed left-hand navigation is 240px wide; collapsible to 64px for expanded data tables.
- **Tablet Layout (768px - 1279px)**: An 8-column layout with fixed-width overlays for detail flyouts. Margins compress to 16px.
- **Mobile Layout (< 768px)**: A single-column vertical flow with 12px gutters and 16px page margins. Bottom sheets replace slide-out panels and multi-step dialogs.
- **Rhythm & Density**: Forms and tables prioritize medium-compact density to minimize user scrolling while avoiding mis-taps. Standard table row height is locked to 48px; compact view is 36px.

## Elevation & Depth

Visual hierarchy uses low-contrast 1px outlines complemented by subtle, sharp directional drop shadows. Surfaces do not rely on diffuse blur layers or heavy offsets.

- **Base Canvas**: Surface level zero (`#F8FAFC`), completely flat.
- **Level 1 (Cards, Data Panels, Form Sections)**: Pure white background (`#FFFFFF`), solid border `1px solid #E2E8F0`, shadow `0 1px 2px 0 rgba(15, 23, 42, 0.05)`.
- **Level 2 (Popovers, Select Menus, Dropdown Panels)**: Solid border `1px solid #CBD5E1`, shadow `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Modal Dialogs, Leave Request Drawers)**: Solid border `1px solid #CBD5E1`, shadow `0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.05)`.
- **Backdrop Overlay**: Modals use `#0F172A` with 40% opacity (`rgba(15, 23, 42, 0.40)`) with zero backdrop-filter blur to maintain crisp legibility.

## Shapes

The shape system is set to **Soft** (`roundedness: 1`), conveying disciplined enterprise professionalism. Extreme pill curves and stadium buttons are strictly prohibited to prevent an overly casual aesthetic.

- Standard buttons, form fields, and status badges use `0.25rem` (4px).
- Cards, table containers, popovers, and slide-over side drawers use `0.5rem` (8px).
- Modals, large operational sheets, and prompt dialogs use `0.75rem` (12px).
- Avatars and user profile indicators use `9999px` (circular) strictly for human representation.

## Components

### Buttons
- **Primary**: Solid background `#1E40AF`, text `#FFFFFF`, border `1px solid #1E40AF`. Hover: `#1D4ED8`. Active: `#1E3A8A`. Focus: 2px offset ring in `#2563EB`. Height: 36px (compact: 32px), internal padding 8px 14px.
- **Secondary**: Surface `#FFFFFF`, text `#0F172A`, border `1px solid #E2E8F0`. Hover: `#F8FAFC`, border `#CBD5E1`.
- **Tertiary / Ghost**: Transparent fill, text `#64748B`. Hover: `#F1F5F9`, text `#0F172A`.
- **Destructive**: Surface `#FFFFFF`, text `#DC2626`, border `1px solid #FCA5A5`. Hover: `#FEF2F2`, border `#F87171`.

### Badges & Status Indicators
- Structured with a `0.25rem` radius, 11px uppercase bold tracking (`label-sm`), padding `2px 8px`, 1px border.
- **Approved**: Surface `#ECFDF5`, border `#A7F3D0`, text `#065F46`.
- **Pending Approval**: Surface `#FFFBEB`, border `#FDE68A`, text `#92400E`.
- **Draft / In Review**: Surface `#F0F9FF`, border `#BAE6FD`, text `#075985`.
- **Rejected**: Surface `#FFF1F2`, border `#FECDD3`, text `#9F1239`.

### Form Inputs & Selectors
- Standard height: 36px. Pure white background, `1px solid #CBD5E1` border, `0.25rem` radius, text `#0F172A` in 13px (`body-md`).
- Focus state: Border transitions to `#1E40AF`, ring `0 0 0 1px #1E40AF`.
- Placeholder text: `#94A3B8`.
- Date range picker: Dual input container with a persistent central line separator `#E2E8F0` and line-icon calendar indicator `#64748B`.

### Checkboxes & Radio Controls
- Base: 16px square (checkbox) or circle (radio), border `1.5px solid #94A3B8`, background `#FFFFFF`.
- Selected: Background `#1E40AF`, border `#1E40AF`, check icon `#FFFFFF` (1.5px stroke width).

### Tables & Data Lists
- Table headers: `#F8FAFC`, bottom border `1px solid #E2E8F0`, text `label-md` in `#64748B`.
- Cells: Vertical alignment center, padding 10px 16px, bottom border `1px solid #F1F5F9`, alternating rows optional via `#FDFDFE`.
- Hover state: Entire row highlights to `#F8FAFC`.

### Leave Balance Cards
- Surface: `#FFFFFF`, border `1px solid #E2E8F0`, padding 16px.
- Layout: Top line badge indicates leave type ("Annual Leave", "Sick Leave", "Comp Off"). Large central metric in `headline-xl` (`#0F172A`) showing remaining balance, paired with secondary label "Days Available" in `body-sm` (`#64748B`).
- Sub-data bar: Subtle 4px segmented progress bar indicating Taken (slate-300), Pending (amber-400), and Remaining (blue-800).