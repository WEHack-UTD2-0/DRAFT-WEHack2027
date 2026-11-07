# Handoff: WEHack 2027 — "The Trip to WEmart" (scroll-driven site)

## Overview
A single-page, scroll-driven hackathon site themed as a Japanese convenience store ("WEmart", ウィーマート). The visitor scrolls from the storefront at night, through the doors, down an aisle, and through eight sections. Each section is a store fixture: freezer, capsule-toy machine, magazine rack, shopping list, checkout, shopping basket. The visitor scrolls back out to the storefront at the end.

Aesthetic: pastel watercolor. Light pink, blue, yellow and cream, thin ink outlines, a paper-grain overlay, hand-drawn-feel SVG.

## About the Design Files
Everything in `reference/` is a **design reference built in HTML**: a prototype of the intended look and behavior, not production code to copy. Recreate it in the target codebase's own environment (React/Next, Vue, Svelte, etc.) with its established patterns. If there is no codebase yet, pick a suitable framework (React + Vite or Next.js recommended).

- `reference/WEmart v5.dc.html` is the source of truth. All markup, inline styles and the logic class are in it. **Open it and read it alongside this README**. Large SVGs (bunny, basket, interior) are best lifted straight from it.
- `reference/WEmart v5 shareable.html` is a standalone build that opens in any browser. Use it to see the real behavior.
- `reference/image-slot.js` is a drag-and-drop photo placeholder. In production, replace every `<image-slot>` with a real `<img>` or CMS image.
- The `.dc.html` format is a prototype format. Treat `{{ }}` holes as template variables, `<sc-for>` as `.map()`, `<sc-if>` as conditionals, and `renderVals()` as the component's computed props.

## Fidelity
**High-fidelity.** Final colors, type, spacing, motion and copy. Recreate pixel-accurately. Placeholder content to swap for real data: officer names/photos, team photos, magazine covers and inner photos, winners lists, editor's letters, the recap video, and the venue FAQ answer.

---

## Design Tokens

### Colors
| Token | Hex | Use |
|---|---|---|
| ink | `#4a3a30` | all text, all outlines (1.8px) |
| cream-page | `#F2EAD0` | body background |
| cream-scene | `#FBF3DF` | fixed scene background |
| paper | `#FBF5E3` | cards, notepad, bubbles, pills |
| pink | `#E9A593` | bunny, badges, sale sticker, door sign |
| yellow | `#EBD08A` | Next buttons, tape, gold tier, caps |
| sky | `#BCD5D8` | aisle badges, notepad header, freezer, silver |
| blue | `#7ba3d6` | accent text, storefront stripe, ✓ checks |
| blue-link | `#76aecc` | links, "AISLE" label text |
| blue-basket | `#799fd5` / `#88afe1` | basket body / rim |
| peach | `#F1D9C6` | magazine 2022, ear inner |
| white | `#fff`, `#fbfbf8` | cards, freezer shell |
| belt-grey | `#5e5e5e`, `#4a4a4a` | checkout machinery |
| notepad rule | `oklch(0.85 0.05 240)` | ruled lines |
| checked box | `oklch(0.93 0.05 355)` | FAQ ticked checkbox |
| night sky | `#0d2433 → #173b4d 55% → #24566a` | storefront bg gradient |
| moon | `#fff6dc → #f6e2b4 45% → #e9c98e` | radial |
| overlay | `rgba(59,53,82,.78)` | magazine viewer backdrop |

Tier colors: gold `#EBD08A`, silver `oklch(0.91 0.02 260)`, bronze `oklch(0.87 0.06 50)`.

### Typography
Google Fonts: **Yusei Magic** (display, headings, labels), **Zen Maru Gothic** 400/500/700/900 (body, buttons), **IBM Plex Mono** 400/500/600 (tags, receipts, counters).
- h1 hero: Yusei Magic 700, `clamp(28px,4.6vw,68px)`, lh .95
- h2 sections: Yusei Magic 400, `clamp(34px,5vw,64px)`, lh 1
- Section lede: 17px, lh 1.5, max-width 46ch
- Aisle badge: pill with mono 11px label (white bg, `#76aecc` text) + Yusei 18px name + 700 Japanese
- Mono tags: 10–12px, letter-spacing .12–.2em
- Body base: Zen Maru Gothic, antialiased

### Shape and shadow
- Outline: `1.8px solid #4a3a30` on nearly everything. Thicker on the door sign (.9cqw) and capsule dome (2px).
- Radius: 4–6px (tags), 8px (badge), 10–12px (cards), 14px (nav, capsule top), 22px (freezer), 30px (pill buttons).
- Standard soft shadow: `0 4px 7px rgba(74,58,48,.28)`. Offset card shadow: `5px 5px 7px` or `8px 10px 7px` (same color).
- Drop shadows on fixtures: `drop-shadow(3px 7px 7px rgba(74,58,48,.32))`.
- Grain: fixed full-screen overlay, `z-index:200`, `pointer-events:none`, SVG feTurbulence (baseFrequency .85, 3 octaves) tiled 260px, opacity .55.

### Layout
Sections are centered columns with `padding: clamp(40px,6vh,72px) 20px` and gap 36–40px. Max widths: freezer 1040px, sponsors 1200px, checkout 1240px, notepad 620px.

### Z-index stack
grain 200 · magazine viewer 100 · nav 60 · basket heading/controls 40 · hero & exit sections 3 · `<main>` 2 · fixed scene 0 · aisle backdrop -1 (inside main).

---

## Global architecture (important)
Three layers:
1. **Fixed scene** (`position:fixed; inset:0; z-index:0`): the night storefront. Zoomed and translated by CSS variables.
2. **Hero spacer section** (300vh, sticky 100vh child) drives the storefront zoom and door opening, and holds the "Welcome to WEmart!" bunny.
3. **`<main>`** (z-index 2) holds the normal-flow sections. It has a fixed `z-index:-1` backdrop showing the **interior corridor SVG**, whose opacity is the `--aisle` variable. A cream scrim fades with `--big`.
4. **Exit spacer** (190vh) reverses the zoom and shows the "Thank you" bunny.

All scroll-linked values are written as **CSS custom properties** (`--zoom --zp --title --hint --door --aisle --big --mas --oimg --lid --bs --t0…--t5 --laser --belt`) directly on elements per frame. Do not drive them through React state. Use refs or `style.setProperty`.

### Update loop
A `requestAnimationFrame` loop runs every frame. It calls `tickBelt`, `tickLid`, and `update()` when `scrollY` changed. A scroll listener (capture, passive) and a resize listener also call `update()`.

Helpers: `c(v)` clamps to [0,1]; `ease(x)` is ease-in-out quad: `x<.5 ? 2x² : 1-(-2x+2)²/2`.

---

## Screens / Sections

### 0. Nav (fixed)
`top:14px`, centered, `width:min(1180px,100%-28px)`, padding `10px 12px 10px 18px`, bg `rgba(255,253,246,.88)` + `backdrop-filter:blur(10px)`, 1.8px ink border, radius 14, shadow standard. Left: logo "WE" + "Hack" (Hack in blue) in Yusei 20px, plus a "2027" mono 10px box (1.5px border, radius 4). Right links (700, 14px): About `#about`, Sponsors `#sponsors`, FAQ `#faq`, MLH Conduct (`https://static.mlh.io/docs/mlh-code-of-conduct.pdf`), and a "Sign in" button (bg sky, 2px ink border, radius 9, padding 8×16). Link color ink, hover `#7ba3d6`.

### 1. Hero / Doors — storefront (fixed scene), hero spacer `#about`
- **Scene contents** (all vh/vw-based, see the source lines 46–96):
  - sky with stars (radial-gradient dots) and three blurred cloud blobs
  - **moon**: `left:73%; bottom:50vh; width:42vh`, radial gradient, 6 blurred crater ellipses, glow `box-shadow:0 0 5vh 1.5vh rgba(255,236,190,.75), 0 0 18vh 6vh rgba(255,222,160,.28)`
  - pavement strip (repeating dark/cream, 3.5vh)
  - building: canopy, sign band "ウィーマート" (blue `#7ba3d6`) with a blue strip reading "WEMART" / "24時間営業", and a 5-column window wall `1fr 1fr min(50vw,64.6vh) 1fr 1fr` (center = the door)
  - side windows with shelf stripes and handwritten notices ("おにぎり ¢99", "NEW!", "アイスコーヒー はじめました ¢100", vertical "いらっしゃいませ", "ハック中")
  - street props: bike, bollards, vending machine, mailbox, plant, a "WEmart" blue crate sign
- **Door** (center column, `container-type:inline-size`, 5px grey frame): two glass sliding panels, each 50% wide. Left panel carries a **notice poster** ("What's the 'WE' in WEHack? W·E = Women Empowered." plus an OPEN/ADMISSION/STOCKED WITH row). Right panel carries a pink **"SALE ENDS IN {d}d {h}h {m}m until doors open"** circle sticker. The countdown runs to `2027-04-11T09:00:00-05:00`, refreshed every 20s. Poster and sticker use `cqw` units so they scale with the door. Each is `scale(.5 + zp*.5)`; the poster is rotated -2°, the sticker 8°.
- **Title overlay** (top-left, cream text with dark text-shadow): "WEHack 2027 presents", h1 "The Trip to WEmart", "April 11th – 12th". Opacity is `--title`.
- **Hint pill** (bottom center, ink bg, white mono 12px): "SCROLL TO OPEN THE DOORS ↓", opacity `--hint`.
- **Hero scroll mapping** (p = progress through the 300vh section, 0–1):
  - `zp = ease(p/.42)`: scene translates up and the poster/sticker grow
  - `zoom = 1 + ease(p/.42)·D`, where D = fill-1 and fill = `min(innerWidth·.94 / doorWidth, (vh-120)/doorHeight)` (the door fills the viewport). Scene `transform-origin:50% 77.5vh`; `translateY(zp·(55px − 27.5vh)) scale(zoom)`.
  - `title = 1 − p/.1` and `hint = 1 − p/.04` (both clamped)
  - `door = ease((p−.42)/.2)`: panels slide outward by ±100% of their width
  - `aisle = ease((p−.6)/.18)`: interior fades in while `big = bottom/vh`
  - `mas = ease((p−.62)/.16)`: bunny fades in
- **Bunny** (static, SVG viewBox 300×222, width `min(24vw,240px)` min 170px, bottom 4vh center). It holds a basket with an onigiri, a pink fruit and a milk bottle. A speech bubble sits at `left:62%; bottom:88%` and says "Welcome to WEmart!" over "いらっしゃいませ" (blue, 900). Bubble: paper bg, 1.8px border, radius `18 18 18 4`, shadow `5px 5px 7px`. Copy the SVG from source lines 107–130.

### 2. Ice cream / Officers `#officers` (AISLE 02 · ICE CREAM · アイス)
- Header: badge, h2 "Freshly frozen officers", and the lede "The team keeping WEmart stocked. Slide the lids to say hi."
- **Freezer**: width `min(1040px,100%)`, off-white shell (`#fbfbf8`, radius `22 22 6 6`, padding `clamp(12px,2vw,22px)`), inner cabinet (radius 12, bg gradient `#DCE8E4 → #BCD5D8`). Contents: grid `repeat(auto-fill,minmax(170px,1fr))`, gap 14, padding 18, of **8 officer cards**. Each card has a 150px photo slot and a yellow footer with name (900, 14px), role (mono 11px) and a "flavor"/price in Yusei 13px blue.
- **Two sliding glass lids**, each `width:50.5%`, covering the left and right halves. Frosted gradient, `backdrop-filter:blur(4px)`, a 4px `#9ab3c4` inner edge, and a handle bar (10px × 38% height). Each lid carries a tilted fun-fact card:
  - #01 yellow, rotate -4°: "Every officer here started as a first-time hacker."
  - #02 white, rotate 3°: "Planning meetings run on mochi ice cream. Officially."
- **Lid logic**: `--lid` from 0 (closed) to 1 (open). It is computed **per frame** in `tickLid`: `q = clamp((vh·.42 − freezerTop)/(vh·.4))` then `ease(q)`. Lids start **closed**, then slide open once, as the freezer rises into the upper part of the viewport. Left lid `translateX(−lid·100%)`, right `translateX(+lid·100%)`. If `lidOpen` (button) is true, lid = 1. Only write the property when it changed.
- Footer bar: pink "アイスクリーム" tag, "−18°C · KEEP FROZEN", and a dark pill button toggling "Slide lids open" / "Close lids".
- Officer data (8): name placeholder, roles President, Vice President, Tech Lead, Design Lead, Marketing, Logistics, Sponsorship, Outreach; flavors ¢100 ×2, ¢80 ×6.

### 3. Capsule toys / Sponsors `#sponsors` (AISLE 03 · CAPSULE TOYS · ガチャ)
- h2 "Our sponsors", lede "Turn a knob. Every capsule is a company making WEHack possible."
- Three tiers stacked (gap 34): Gold [Verizon, CBRE], Silver [Capital One], Bronze [HCSC, CodePath, State Farm, North Highland, DFW ATW, Axxess]. Each has a tier pill ("GOLD TIER", mono 12px, paper bg, 2px border, radius 20).
- **Capsule machine** per sponsor. Widths/dome/name font per tier: gold 210/140/22, silver 190/120/19, bronze 165/96/15. Structure:
  - top box in the tier color (radius `14 14 4 4`, padding 10) with a glass dome (gradient `#EAF1EC → #BCD5D8`, five static half-pink/yellow/blue capsules, a white skewed highlight)
  - white nameplate (Yusei)
  - base `#f4f1e8` with a **round knob button** (62px, white, hover `#F2EAD0`, containing a pill in the tier color) and a "75¢" mono tag
  - a dark 44×36 **dispenser slot**
  - caption below, mono 11px: "turn me ↻" → "you got: {name}!"
- **Behavior**: clicking the knob increments its spin count `n`. The knob rotates `n·360°` (`transition 1s cubic-bezier(.4,1.5,.4,1)`). When `n>0`, a 26px capsule (half-color/half-white, colors cycle `['#E9A593','#EBD08A','#BCD5D8','#BCD5D8','#EBD08A']`) drops into the slot with `wm-pop`. State: `spins: {id: count}`.

### 4. Magazines / Past WEHacks `#archive` (AISLE 04 · MAGAZINES · 雑誌)
- h2 "Back issues, 2026–2020", lede "Every WEHack theme so far, newest on top. Pick one off the rack and flip through."
- **Rack**: a hanging sign "BACK ISSUES / 2026 — 2020 · 雑誌" (230px, paper), a striped pole (10px, gradient `#92b4e0 → #F1D9C6 → #92b4e0`, ink side borders), and a 2-column grid `repeat(2, clamp(130px,15vw,165px))` with column gap `clamp(30px,5vw,56px)`, row gap 26. A central vertical bar runs behind. Below it: a funnel/cone base (320px, `clip-path:polygon(44% 0,56% 0,100% 100%,0 100%)`) and an ellipse foot. Whole rack has `drop-shadow(6px 8px 0 rgba(59,53,82,.25))`.
- **Cover** (button, aspect 3/4.2): title (Yusei 13px uppercase, 3-line clamp), a hatched cover-photo placeholder, "VOL. nn" and `'yy`. Slight tilt from `[1.5,-1,2,-1.5,1,-2]`; hover `translateY(-18px) rotate(0)` (.25s). A pale-blue pocket band (46% tall, 3px `#92b4e0` border) overlaps the lower half.
- **Data** `[year, title, bg, ink, tagline, headline]`, newest first:
  2026 Night at the Museum `#BCD5D8`, 2025 Timeless Moments Await `#EBD08A`, 2024 Enchanted to be Here `#E9A593`, 2023 Adventure is Out There `#BCD5D8`, 2022 The Future is Now `#F1D9C6`, 2020 Robotics `#EBD08A`. Taglines: After-hours exhibits / Moments worth keeping / Apps that captivate / Travel, risk, bold ideas / Innovate, make change / Inaugural issue · hardware + software. `vol = 6 − index`, zero-padded.
- **Viewer** (modal, fixed, overlay `rgba(59,53,82,.78)` + blur 4px, entry `wm-in`): a book `width:min(860px,92vw)`, aspect 2/1.4, `perspective:2200px`. Three leaves are absolutely positioned on the right half, with `transform-origin:left center`, `rotateY(0 → -180deg)` over `.9s cubic-bezier(.6,.1,.25,1)`. Faces use `backface-visibility:hidden`, and the back faces are pre-rotated 180°.
  - Leaf 0 front: cover (title, vol, year, photo slot, tagline, `'yy`). Back: Editor's letter.
  - Leaf 1 front: Photo special (one photo, "Opening ceremony, {year}"). Back: The Winners (1st/2nd/3rd, "Project name" placeholders, dashed rules).
  - Leaf 2 front: Behind the scenes (two photos, "3 a.m. at WEHack {year}"). Back: "See you in 2027 / NEXT ISSUE · THE TRIP TO WEMART".
  - `leaf(i)`: `r = page>i ? −180 : 0`, `z = page>i ? i+1 : 3−i`
  - Book shift: page 0 → `translateX(-25%)`, page 3 → `+25%`, otherwise 0. Static base pages fade out when empty.
  - Controls: Prev (paper), `pageLabel` ["Cover","Pages 1–2","Pages 3–4","Back cover"], Next (yellow), Close ✕ (ink, white 2px border). Prev/Next opacity .4 at the ends. Keys: ←/→ flip, Esc closes, backdrop click closes.
  - State: `mag` (index or null), `page` (0–3).

### 5. Shopping list / FAQ `#faq` (AISLE 05 · SHOPPING LIST · お買い物リスト)
- A badge, then a notepad (`width:min(620px,100%)`, `rotate(-1deg)`): top strip 26px sky with three white 10px punch-hole circles (`space-evenly`), paper body with ruled lines (`background-size:100% 40px`, line at 39–40px, offset 12px), padding `22px 26px 30px`, shadow `8px 10px 7px`.
- Header row: "shopping list (FAQ)" (Zen Maru 700, 34px) and counter `{n}/8 CHECKED` (mono 10px).
- 8 rows (button, min-height 40, 23px): a 22px checkbox + question. Clicking toggles an **answer panel** (15px, lh 1.6, margin-left 34, bg `oklch(0.97 0.04 95)`, 2px ink border, radius 4, `wm-in`). Rows are independent. Q&As:
  1. What is WEHack? — A 24-hour hackathon centering women and gender-minority students. Build a project, learn something new, meet your people.
  2. Who can attend? — Any current university student 18+ who identifies as a woman or gender minority. All majors welcome.
  3. How much does it cost? — Nothing. Admission, food, swag and workshops are all free.
  4. I've never coded. Can I come? — Yes. We run beginner workshops and have mentors on the floor all weekend.
  5. Do I need a team? — No. Teams are up to 4 people, and we host team-forming at the start of the event.
  6. What should I bring? — Student ID, laptop + charger, toiletries, and something comfy to sleep in.
  7. Will there be food? — All meals and plenty of konbini-grade snacks, with dietary options.
  8. Where is it? — Venue details coming soon. Check back or follow us on Instagram.
- **Scroll auto-check**: `n = round(clamp((vh·.85 − listTop)/listHeight) · 8)`. The first `n` boxes show a blue ✓ (`#7ba3d6`, 900, 18px, `wm-pop`) on a pink fill, and the counter updates. It reverses on scroll up. Only `setState` when `n` changes.
- State: `faq: {i: bool}`, `checked: number`.

### 6. Checkout `#checkout` (REGISTER 06 · CHECKOUT · お会計) — h2 "Ring it up"
- Left (flex 1 1 440): a white tab "お会計 · Recap" with a three-stripe icon on a dark monitor (`#4a3a30`, radius 14, padding 14) containing a 16:9 video placeholder (diagonal dark stripes, pink ▶ circle 64px, mono label "VIDEO · WEHACK RECAP REEL"). Below: a stand and a register body (`#4a4a4a`) with a receipt display "WEmart TOTAL ¢0", a keypad (3×2 grid) and a laser scanner. The laser opacity is `--laser` (0.3, or 1 while an item passes the scanner).
- Right (flex 2 1 560): a **conveyor belt** (height 150, `#5e5e5e`, 38/40px tick lines scrolling via `--belt`, top border 10px `#c9cbd0`, bottom 10px `#9ea1a6`) carrying 8 CSS-drawn products (`data-food` 1–8): onigiri, ramen cup, milk carton, dango, water bottle, melon pan, a pink-and-white tall item, and "STIX". Below it, a 60px counter in warm tan.
- **Belt animation** (`tickBelt(t)`): `speed = beltSpeed(70 px/s)/1000`, `span = max(W+140, n·130)`, `off = t·speed`. Each item is `translateX(W − ((off + i·span/n) % span))`. Belt tick background offset is `−(off % 40)px`. Item at x ∈ (−60, 40) triggers the laser to 1. **Tweakable prop**: `beltSpeed` (0–200, step 5, default 70).

### 7. Basket / Teams `#teams` — "Meet the staff!"
- Section height **340vh**, sticky 100vh viewport.
- Left block (absolute, `left:calc(50% − min(31vw,460px))`, vertically centered, width `min(380px,28vw)`): "Meet the / staff!" in Yusei `clamp(34px,5.2vw,76px)`, an aisle badge "BASKET · THE TEAMS · チーム", and Prev / `n / 6` / Next controls.
- **Basket** (520×760 box, `left:calc(50% + 1vw); bottom:2vh`, `rotate(5deg) scale(--bs)`, origin bottom-left; `--bs = clamp(.4, (vh−60)/790, .8)`): a tall, upright blue plastic basket drawn in SVG, with perforated slots, a rim bar, handles and a bottom lip. Copy the SVG from source lines 436–440 (back layer) and 457–462 (front rim layer, `z-index:30`). Cards sit between the two layers, so they appear inside the basket.
- **6 team cards** (receipt style, 250px wide, white, ink dashed rules, zig-zag bottom edge, mono 10px). Each holds a "{TEAM}'s PICK!" title, "0411 · 2027-04-11 / 18:00", a 100px photo slot, "01 {item1} ★★★★★", "02 {item2} ★★★★☆", "TEAM / {name}", and a barcode strip. Teams: Tech (Onigiri, Ramune), Design (Melon pan, Pocky), Marketing (Dango, Milk tea), Logistics (Cup ramen, Onigiri), Sponsorship (Mochi, Coffee), Outreach (Taiyaki, Juice). Tilts `[-3,2,-1.5,2.5,-2,1.5]`.
- **Layout**: two cards per row, `x = 20 + (i%2)·230`, `y = 52 + floor(i/2)·226`. Each is scaled .68 and rotated by its tilt. The "front" card is scaled .74 with the highest z. `k = (i − front + 6) % 6`, `z = k===0 ? 20 : 10−k`. Clicking a card, or Next, advances `front`. Fan transition: `.5s cubic-bezier(.3,1.3,.5,1)`.
- **Drop-in on scroll**: p = `clamp(−top/(height−vh)/0.88)`. Each card i drops from `translateY(−130vh)` with `--t{i} = ease(clamp((p − .04 − (5−i)·.11)/.14))`. Card 5 lands first, card 0 last.

### 8. Exit `#exit` (190vh, sticky)
Reverses the entry. With p = progress and r = section rect:
- `aisle = 1 − ease((vh − top)/vh)`: interior fades out as the section arrives
- `zo = ease((p − .3)/.4)`; `zp = 1 − zo`; `zoom = 1 + D(1 − zo)`: storefront zooms back out
- `door = 1 − ease((p − .68)/.16)`: doors close
- **Exit bunny** ("Thank you for shopping!" / "ありがとうございました", same SVG): `oimg = ease((vh − top)/(vh·.6)) · (1 − ease((p − .24)/.08))`. It appears right after the basket, before the zoom starts, then fades.
- Title/hint stay at 0.

---

## Interior corridor (fixed backdrop, generated)
`buildInterior()` generates one SVG (viewBox 1600×1000, `preserveAspectRatio="xMidYMid slice"`) with a one-point-perspective aisle: wood ceiling, tiled floor with grid, left freezer wall (6 bays with glass, shelves, packaged goods), right shelf wall (6 bays), a back wall with a store counter and tubes, glow, and a blue crate in the foreground. A seeded PRNG (`sd=11`, `sd*9301+49297 mod 233280`) makes the product rows deterministic. Watercolor effects: `feTurbulence`+`feDisplacementMap` wobble (`#wcw`, scale 7), soft blur (`#soft`, σ9), and a blotch overlay (`#blot`, opacity .4). Port the function as-is (source lines 593–664). Vanishing-point box is x 650–950, y 420–625.
Note: `_aisles` (L/R arrays in `renderVals`) is unused legacy and can be dropped.

---

## Keyframes
- `wm-pop`: `0% translateY(-30px) scale(.4) opacity 0` → `60% translateY(4px) scale(1.1) opacity 1` → `100% none` (used for capsules and ✓ marks)
- `wm-in`: `from opacity 0, translateY(16px) scale(.97)` → `to none` (modals, answer panels)
- Unused: `wm-walk`, `wm-flip`, `wm-bubble`, `wm-bob`, `wm-spin` (leftovers from the earlier moving bunny)

## Interactions summary
| Element | Trigger | Result |
|---|---|---|
| Scroll | any | updates scene vars, lids, FAQ ticks, basket drops, bunny fades |
| Sponsor knob | click | spin +1, capsule dispenses, caption changes |
| Magazine cover | click | open viewer at that issue |
| Viewer | ←/→/Esc, buttons, backdrop | flip / close |
| FAQ row | click | toggle answer |
| Lids button | click | force open / release |
| Team card / Next / Prev | click | rotate the front card |
| Cover hover | hover | lifts 18px, straightens |

## State
`mag`, `page`, `faq{}`, `spins{}`, `lidOpen`, `now` (countdown, updated every 20s), `checked`, `front`. Everything scroll-driven lives in CSS variables, **not** state.

## Responsive notes
Scene dimensions use vh/vw so it scales with the viewport. Door-fill zoom is recomputed on resize. Sections use `flex-wrap` and `minmax`. The basket scales by viewport height. A mobile pass has not been designed. Verify the basket and left heading at widths under ~900px.

## Assets
No raster assets. The bunny, basket, interior and products are SVG/CSS. All photos are **placeholders** (`<image-slot>`): officers (`officer-0…7`), teams (`team-0…5`), and magazines (`mag-{year}-cover`, `-p1`, `-p2`, `-p3`). The recap video is a placeholder block. Sponsor names are text-only, so supply logos if wanted.

## Implementation notes for Claude Code
1. Build the page as components: `Nav`, `Scene` (storefront), `Interior`, `Hero`, `Freezer`, `Sponsors/CapsuleMachine`, `MagazineRack`, `MagazineViewer`, `FaqNotepad`, `Checkout/Conveyor`, `TeamBasket`, `Exit`, `Bunny`, `GrainOverlay`.
2. Put the scroll engine in one hook or module that reads section rects each frame and writes CSS variables. Use `useRef` for the DOM nodes. Avoid re-rendering on scroll.
3. Keep sticky + tall spacer sections (hero 300vh, teams 340vh, exit 190vh) for scroll narrative.
4. Match the "lid starts closed" behavior. The lid variable must be written every frame, with a single writer.
5. Respect `prefers-reduced-motion` (not in the prototype): skip the belt and the zoom.

## Files
- `reference/WEmart v5.dc.html`: full design and logic
- `reference/WEmart v5 shareable.html`: standalone playable build
- `reference/image-slot.js`: placeholder component (replace with real images)
