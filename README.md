# Designer Deb — Enhanced Portfolio

Upgraded version of the original single-file `index.html` from
`real-debabrata/DesignerDeb`, split into clean `html / css / js` files and
rebuilt on a heavier GSAP stack for smoother scroll, richer motion, and
better adaptability across devices/refresh rates.

## File structure

```
index.html        markup only, no inline <style> or <script> logic
css/style.css     all visual styling + ScrollSmoother scaffolding rules
js/main.js        all interaction/animation logic
README.md         this file
```

Just open `index.html` in a browser (or serve the folder with any static
server) — everything is CDN-loaded, no build step required.

## What changed vs. the original

- **Lenis → GSAP ScrollSmoother.** Same buttery inertial scroll, but now
  it also drives real parallax through `data-speed` / `data-lag`
  attributes (see the floating hero cards and the "about" portrait).
- **SplitText** shatters the hero headline and every section title into
  characters/words that animate in on load / on scroll.
- **Draggable + InertiaPlugin** replace the native `overflow-x` swipe row
  in "Posters & Campaigns" with a throwable, momentum-based carousel that
  snaps to the nearest card — draggable *or* clickable via the new arrow
  buttons.
- **Flip** animates a sliding highlight pill behind the Instagram-feed
  category tabs instead of a hard class swap.
- **CustomEase** defines one signature "silk" easing curve reused across
  reveals for a consistent, organic feel.
- **ScrollTrigger.batch()** staggers in cards/badges/tags as they scroll
  into view (`.gsap-reveal` class), and drives an animated number-count
  for the stats in the "about" section.
- **gsap.quickTo()** powers the custom cursor and magnetic buttons instead
  of manual `gsap.to()` calls — noticeably smoother on 120Hz/144Hz
  displays since it's tied directly to the render tick.
- **Adaptability:** `gsap.matchMedia()` disables the custom cursor /
  magnetic buttons on touch devices, shortens the pinned brochure-stack
  scroll distance on small screens, and `prefers-reduced-motion` disables
  smoothing and decorative motion entirely for users who ask for it.
- **Mesmerising backdrop:** a lightweight canvas mesh-gradient with soft
  color blobs that drift and subtly follow the cursor, plus a faint film
  grain overlay, sitting behind the existing grid background.
- All original sections, copy, and images are preserved — this is a
  technical/motion upgrade, not a redesign.

## GSAP plugins used

`ScrollTrigger` · `ScrollSmoother` · `SplitText` · `Draggable` ·
`InertiaPlugin` · `Flip` · `CustomEase`

All of these ship free in the standard `gsap` npm package since
GreenSock's 2025 license change (no Club GreenSock membership needed).
