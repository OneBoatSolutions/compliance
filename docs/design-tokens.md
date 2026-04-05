#  Design Tokens Documentation

## Overview

This project uses a token-based design system built with:
- Tailwind CSS v4
- shadcn/ui
- next-themes
- OKLCH color model

All core colors are defined as CSS variables in `globals.css`.

---

#  Light Theme Tokens

| Token | Value | Usage |
|--------|--------|--------|
| --background | oklch(1 0 0) | App background |
| --foreground | oklch(0.145 0 0) | Primary text |
| --primary | oklch(0.56 0.26 295) | Brand purple (#6D18FF) |
| --primary-pale | oklch(0.93 0.05 295) | Light brand tint |
| --success | oklch(0.72 0.18 162) | Success states |
| --warning | oklch(0.80 0.18 85) | Warning states |
| --destructive | oklch(0.67 0.23 27) | Error states |
| --info | oklch(0.68 0.20 280) | Info states |

---

#  Dark Theme Tokens

Dark theme overrides use `html.dark`.

| Token | Value |
|--------|--------|
| --background | oklch(0.145 0 0) |
| --foreground | oklch(0.985 0 0) |
| --primary | oklch(0.48 0.24 295) |
| --destructive | oklch(0.60 0.21 27) |
| --success | oklch(0.65 0.15 162) |
| --warning | oklch(0.70 0.16 85) |
| --info | oklch(0.60 0.18 280) |

---

#  Utility Mapping

Tokens are mapped using Tailwind `@theme inline`:

Example:
bg-primary
text-foreground
border-border


---

#  Theming System

- Managed via `next-themes`
- Uses `class` attribute
- Supports light, dark, and system
- Global `<Toaster />` (Sonner) integrated

---

#  Typography

- Google Font: Inter
- Configured in `layout.tsx`
- Injected via `next/font/google`

---

#  Utilities

- `lib/utils.ts` includes `cn()` helper
- Uses `clsx` + `tailwind-merge`

---

#  Installed shadcn Components

- Button
- Card
- Input
- Form
- Select
- Dialog
- Table
- Tabs
- Badge
- Dropdown
- Toast (Sonner)
- Progress
- Checkbox
- Separator
- Skeleton
- Sheet
- Avatar
- Tooltip

---

#  Architecture Complete

Design system is theme-aware, token-driven, and production ready.
