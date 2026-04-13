# Design System Document: The Editorial Domesticity System

## 1. Overview & Creative North Star
**Creative North Star: "The Curated Sanctuary"**

This design system moves away from the sterile, utilitarian nature of a "tracking app" and adopts the persona of a high-end lifestyle journal. In a shared apartment, tension often arises from mundane chores; our goal is to diffuse that tension through **Soft Minimalism** and **Editorial Elegance**. 

The system rejects the "standard dashboard" look (rigid grids and heavy borders) in favor of **Intentional Asymmetry** and **Floating Composition**. We treat toilet paper tracking as a shared wellness metric rather than a chore. By utilizing large typographic scales, breathing room, and overlapping surfaces, we create an experience that feels premium, calm, and unexpectedly sophisticated.

---

## 2. Colors: Tonal Depth over Borders
The palette is a sophisticated interplay of aquatic blues (`primary`), botanical greens (`secondary`), and atmospheric grays (`tertiary`).

- **The "No-Line" Rule:** Designers are strictly prohibited from using 1px solid borders to section content. Separation must be achieved through background shifts. For example, a `surface-container-low` component should sit on a `surface` background to define its boundaries.
- **Surface Hierarchy & Nesting:** Use the surface-container tiers to create physical depth. 
    - **Base:** `surface` (#f9f9fe)
    - **Sections:** `surface-container-low` (#f2f3fa)
    - **Interactive Cards:** `surface-container-lowest` (#ffffff)
- **The "Glass & Gradient" Rule:** To provide "visual soul," primary buttons and hero stats should utilize a subtle linear gradient from `primary` (#0060ad) to `primary_container` (#68abff) at a 135-degree angle. Floating action panels should use a semi-transparent `surface` with a 20px backdrop-blur to mimic frosted glass.

---

## 3. Typography: The Friendly Authority
We utilize a pairing of **Plus Jakarta Sans** (Display/Headlines) for a geometric, friendly personality and **Be Vietnam Pro** (Body/Titles) for its exceptional legibility and modern rhythm.

- **Display (Plus Jakarta Sans):** Used for large-scale usage numbers (e.g., "14 Rolls Left"). The high contrast between `display-lg` and `body-md` creates an editorial hierarchy that feels intentional and high-end.
- **Title & Body (Be Vietnam Pro):** Used for person-specific stats and labels. The soft curves of Be Vietnam Pro reinforce the "clean and modern" apartment vibe without feeling overly "techy."
- **Visual Hierarchy:** Headlines should use `on_surface` (#2e333a), while secondary labels should use `on_surface_variant` (#5b5f67) to create a natural receding of less important information.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are often "dirty." This system uses light and tone to imply height.

- **The Layering Principle:** Instead of shadows, nest layers. Place a `surface-container-lowest` card inside a `surface-container` area. The subtle shift in hex code provides enough contrast for the eye to perceive a "lift."
- **Ambient Shadows:** For floating elements (like an "Add Roll" modal), use an ultra-diffused shadow: `0px 24px 48px rgba(0, 43, 82, 0.06)`. The use of a blue-tinted shadow (`on_primary_container`) ensures the shadow feels like a natural part of the light spectrum, not a gray smudge.
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline_variant` (#aeb2bb) at **15% opacity**. This creates a "suggestion" of a boundary.

---

## 5. Components: Fluidity and Character

### Cards & Stats (The Core Experience)
Cards must use `DEFAULT` (1rem) or `md` (1.5rem) roundedness. **Forbid the use of divider lines.** Separate the "Last Used" date from "Total Rolls" using vertical whitespace or a subtle background pill (`secondary_container`).

### Buttons: Tactile Surfaces
- **Primary:** Gradient of `primary` to `primary_container`. Roundedness: `full`. Large horizontal padding (2rem) to create a "premium" footprint.
- **Secondary:** Surface-only with a `primary` label. No border.
- **Tertiary:** `tertiary_container` background with `on_tertiary_container` text for low-priority actions like "View History."

### Chips: Status Indicators
Use `secondary_fixed` (#a1f5bc) for "In Stock" and `error_container` (#fa746f) for "Running Low." These should be pill-shaped (`full` roundedness) and use `label-md` typography.

### Input Fields: Soft Forms
Inputs should use `surface_container_high` (#e6e8f0) with no border. On focus, transition the background to `surface_container_lowest` and add a subtle `primary` ghost-border (20% opacity).

### Specialized Components
- **The "Usage Gauge":** A custom progress bar using `primary` for the fill and `primary_container` for the track, featuring a subtle "paper roll" icon that moves with the progress.
- **Collaborator Avatars:** Large, circular images with a `surface_bright` ring (3px) to separate the image from the card background.

---

## 6. Do’s and Don’ts

### Do:
- **Embrace White Space:** Give elements more room than you think they need. Editorial design relies on the "void."
- **Use Intentional Asymmetry:** If tracking four roommates, consider a 2x2 grid where one card is slightly taller to highlight the "Top Restocker."
- **Soft Iconography:** Use thin-stroke (1.5pt) icons with rounded caps. Icons should be a tool for navigation, not a distraction.

### Don’t:
- **Don’t Use Pure Black:** Never use #000000. Use `on_background` (#2e333a) for all high-contrast text.
- **Don’t Use Hard Edges:** Avoid `none` roundedness. Even "sharp" elements should have at least a `sm` (0.5rem) radius to maintain the "soft" brand identity.
- **Don’t Use Dividers:** If you feel the need to put a line between items, increase the `gap` or change the background color of one item instead.