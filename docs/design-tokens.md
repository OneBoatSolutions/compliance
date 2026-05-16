# Design Tokens

This document contains the design tokens defined in the Cipherion codebase (`app/globals.css`). It acts as a single source of truth for the styling variables used throughout the application.

## Colors (OKLCH format)

The application uses OKLCH color space for better interpolation and contrast.

### Light Mode
- `--background`: `oklch(1 0 0)` (White)
- `--foreground`: `oklch(0.2 0.02 260)` / `oklch(0.145 0 0)` (Dark Gray)
- `--card`: `oklch(1 0 0)`
- `--card-foreground`: `oklch(0.145 0 0)`
- `--popover`: `oklch(1 0 0)`
- `--popover-foreground`: `oklch(0.145 0 0)`
- `--primary`: `oklch(0.56 0.26 295)` (Purple: #6D18FF)
- `--primary-foreground`: `oklch(1 0 0)`
- `--secondary`: `oklch(0.97 0 0)`
- `--secondary-foreground`: `oklch(0.205 0 0)`
- `--muted`: `oklch(0.97 0 0)`
- `--muted-foreground`: `oklch(0.556 0 0)`
- `--accent`: `oklch(0.97 0 0)`
- `--accent-foreground`: `oklch(0.205 0 0)`
- `--destructive`: `oklch(0.67 0.23 27)` (Red: #EF4444)
- `--destructive-foreground`: `oklch(1 0 0)`
- `--border`: `oklch(0.922 0 0)`
- `--input`: `oklch(0.922 0 0)`
- `--ring`: `oklch(0.708 0 0)`

#### Semantic Colors
- `--success`: `oklch(0.72 0.18 162)` (Green: #10B981)
- `--success-foreground`: `oklch(1 0 0)`
- `--warning`: `oklch(0.8 0.18 85)` (Amber: #F59E0B)
- `--warning-foreground`: `oklch(0 0 0)`
- `--info`: `oklch(0.68 0.2 280)` (Violet: #8B5CF6)
- `--info-foreground`: `oklch(1 0 0)`
- `--primary-pale`: `oklch(0.93 0.05 295)` (Light Purple: #E9DDFF)

### Dark Mode (`html.dark`)
- `--background`: `oklch(0.145 0 0)`
- `--foreground`: `oklch(0.985 0 0)`
- `--card`: `oklch(0.205 0 0)`
- `--card-foreground`: `oklch(0.985 0 0)`
- `--popover`: `oklch(0.205 0 0)`
- `--popover-foreground`: `oklch(0.985 0 0)`
- `--primary`: `oklch(0.48 0.24 295)` (Darker Purple: #5412CC)
- `--primary-foreground`: `oklch(1 0 0)`
- `--secondary`: `oklch(0.269 0 0)`
- `--secondary-foreground`: `oklch(0.985 0 0)`
- `--muted`: `oklch(0.269 0 0)`
- `--muted-foreground`: `oklch(0.708 0 0)`
- `--accent`: `oklch(0.269 0 0)`
- `--accent-foreground`: `oklch(0.985 0 0)`
- `--destructive`: `oklch(0.6 0.21 27)`
- `--border`: `oklch(1 0 0 / 10%)`
- `--input`: `oklch(1 0 0 / 15%)`
- `--ring`: `oklch(0.556 0 0)`
- `--success`: `oklch(0.65 0.15 162)`
- `--warning`: `oklch(0.7 0.16 85)`
- `--info`: `oklch(0.6 0.18 280)`
- `--primary-pale`: `oklch(0.3 0.08 295)`

## Typography
- `--font-sans`: `var(--font-inter)`
- `--font-mono`: `var(--font-roboto-mono)`

## Borders and Spacing
- `--radius`: `0.625rem` (10px base radius)
- `--radius-sm`: `calc(var(--radius) - 4px)` (6px)
- `--radius-md`: `calc(var(--radius) - 2px)` (8px)
- `--radius-lg`: `var(--radius)` (10px)
- `--radius-xl`: `calc(var(--radius) + 4px)` (14px)
- `--radius-2xl`: `calc(var(--radius) + 8px)` (18px)
- `--radius-3xl`: `calc(var(--radius) + 12px)` (22px)
- `--radius-4xl`: `calc(var(--radius) + 16px)` (26px)
- `--sidebar-width`: `240px`

## Animations
- `authFadeSlide`: Used for route transitions (`.auth-route-enter`).
- `authFloat` & `authFloatDelayed`: Decorative float animations for the auth layout blobs.
- `fadeIn`: Standard fade in effect (`.animate-fadeIn`).
- `loadingBar`: Indeterminate loading bar (`.animate-loadingBar`).
