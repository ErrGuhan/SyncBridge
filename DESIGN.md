# DESIGN.md — SyncBridge Design System
**Version:** 2.0  
**Theme:** Cooperative Trust — Clean, Professional, Accessible

---

## 1. Design Philosophy

SyncBridge is built for **real people** — cooperative federation officers in tier-2 cities, electricians from rural areas, and homeowners seeking verified workers. The design must be:

- **Clear over clever** — no decorative gradients, no excessive animation
- **Trustworthy** — blue institutional palette communicates government-backed cooperative
- **Accessible first** — works on low-end Android devices, readable in bright sunlight
- **Democratic** — no dark patterns, transparent pricing, no hidden fees

---

## 2. Colour System

### Brand Colours
| Name | Hex | Usage |
|---|---|---|
| Blue Primary | `#1e40af` | Brand headers, primary CTA, cooperative badge |
| Blue Accent | `#2563eb` | Links, active states, focus rings |
| Blue Light | `#dbeafe` | Tag backgrounds, hover fills |

### Status Colours
| Name | Hex | Usage |
|---|---|---|
| Green Success | `#059669` | Verified worker badge, completed booking |
| Green Light | `#d1fae5` | Success backgrounds |
| Amber Warning | `#d97706` | Pending review, moderate urgency |
| Amber Light | `#fef3c7` | Warning backgrounds |
| Red Danger | `#dc2626` | Emergency, rejected, error |
| Red Light | `#fee2e2` | Error backgrounds |

### Neutrals
| Name | Hex | Usage |
|---|---|---|
| Slate 900 | `#0f172a` | Primary text, dark headings |
| Slate 700 | `#334155` | Secondary text |
| Slate 500 | `#64748b` | Placeholder, metadata |
| Slate 200 | `#e2e8f0` | Borders, dividers |
| Slate 100 | `#f1f5f9` | Secondary backgrounds |
| Slate 50 | `#f8fafc` | Page background |
| White | `#ffffff` | Card backgrounds |

---

## 3. Typography

### Font Family
```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
/* Indic scripts fallback */
font-family: 'Noto Sans Devanagari', 'Noto Sans Kannada', 'Noto Sans Tamil', 'Inter', sans-serif;
```

### Type Scale
| Token | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| display-2xl | 48px | 800 | 1.1 | Hero headline |
| display-xl | 36px | 700 | 1.15 | Section hero |
| display-lg | 30px | 700 | 1.2 | Page title |
| heading-xl | 24px | 700 | 1.3 | Section heading |
| heading-lg | 20px | 600 | 1.4 | Card heading |
| heading-md | 16px | 600 | 1.5 | Subheading |
| body-lg | 16px | 400 | 1.6 | Primary body |
| body-md | 14px | 400 | 1.6 | Secondary body |
| body-sm | 12px | 400 | 1.5 | Caption, metadata |
| label | 12px | 700 | 1 | Tags, badges (uppercase) |

---

## 4. Spacing System (4px Grid)

```
4px  — xs   (icon padding, tight gaps)
8px  — sm   (component internal gaps)
12px — md   (card padding small)
16px — lg   (standard padding)
20px — xl   (form field gaps)
24px — 2xl  (card padding)
32px — 3xl  (section padding)
48px — 4xl  (large section gaps)
64px — 5xl  (hero padding)
```

---

## 5. Component Library

### 5.1 Cooperative Badge
```html
<span class="coop-badge">
  ✓ Cooperative Verified
</span>
```
- Background: `#dbeafe`, colour: `#1e40af`
- Border: `1px solid #bfdbfe`
- Border-radius: `999px` (pill)
- Font: 11px bold uppercase

### 5.2 Primary Button
```css
.btn-primary {
  background: #1e40af;
  color: #ffffff;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 14px;
  min-height: 44px;
  border: none;
  transition: background 0.15s ease;
}
.btn-primary:hover { background: #1d4ed8; }
.btn-primary:active { background: #1e3a8a; }
```

### 5.3 Secondary Button
```css
.btn-secondary {
  background: #ffffff;
  color: #1e40af;
  border: 1.5px solid #2563eb;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  min-height: 44px;
}
```

### 5.4 Emergency Button
```css
.btn-emergency {
  background: #dc2626;
  color: #ffffff;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 700;
  animation: pulse-red 2s infinite;
}
@keyframes pulse-red {
  0%, 100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.4); }
  50% { box-shadow: 0 0 0 8px rgba(220,38,38,0); }
}
```

### 5.5 Card
```css
.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}
```

### 5.6 Input Field
```css
.input {
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 14px;
  background: #f8fafc;
  transition: border-color 0.15s;
}
.input:focus {
  border-color: #2563eb;
  outline: none;
  box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
}
```

---

## 6. Worker Card Design

```
┌─────────────────────────────────────────┐
│  [Avatar]  Ramesh Kumar        ★ 4.8    │
│            Electrician                  │
│            ✓ Cooperative Verified       │
│            📍 2.3 km away              │
│                                         │
│  Skills: Wiring · Panel · AC Install   │
│                                         │
│  ₹500/hr        [Book Now]             │
└─────────────────────────────────────────┘
```

---

## 7. Revenue Split Visualiser

Display as a horizontal bar or donut chart with flat solid colours:
- **Worker (80%)** — Blue `#2563eb`
- **Coop Fund (15%)** — Slate `#475569`
- **Welfare Fund (5%)** — Green `#059669`

No gradients. Flat solid fills only.

---

## 8. Layout Grid

- **Mobile:** 1 column, 16px side padding
- **Tablet (640px+):** 2 columns, 24px side padding
- **Desktop (1024px+):** 3–4 columns, max-width 1280px, centered

---

## 9. Motion & Animation

**Allowed:**
- Hover lift: `transform: translateY(-2px)` with `transition: 0.2s ease`
- Focus ring: `box-shadow: 0 0 0 3px rgba(37,99,235,0.12)`
- Tab underline slide: `width 0.2s ease`
- Modal fade-in: `opacity 0→1, translateY 8px→0, 0.2s ease`
- Emergency pulse: `box-shadow` keyframe, 2s loop

**Forbidden:**
- Gradient background animations
- Parallax scroll effects
- Spinning loaders that take > 300ms to appear
- Colour transitions that shift hue (e.g., blue→purple)

---

## 10. Icons

- Use **Lucide React** icon set throughout
- Size: 16px (small), 20px (default), 24px (large), 32px (hero)
- Stroke width: 1.5 (default), 2 (emphasis)
- Never fill icons — stroke only

---

## 11. Status Indicators

| State | Colour | Icon |
|---|---|---|
| Online / Available | Green dot `#059669` | circle filled |
| Offline / Unavailable | Grey dot `#94a3b8` | circle filled |
| Verified | Blue badge | shield-check |
| Pending | Amber badge | clock |
| Rejected | Red badge | x-circle |
| Emergency | Red pulsing | alert-triangle |
