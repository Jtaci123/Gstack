# Scout Changelog

---

## [Unreleased]

---

## 2026-06-29 (update)

### Changed
- **Brand color via web search** — `fetchBrandColor` now uses Claude's `web_search` tool to find the brand's official hex color from the internet instead of relying on training-data recall. Color is cached in localStorage so the lookup fires only once per brand.

---

## 2026-06-29

### Added
- **Highrise font** — loaded from Fontshare CDN, applied to brand hero name
- **Dynamic brand color** — Scout asks Claude for the brand's primary hex color on brand select/create; stores in localStorage and overrides `--signal` CSS var across the entire UI
- **Homepage tagline** — "We Don't Wait for the Brief. We Find it First." under the Scout wordmark on the empty state
- **Phase 3: Award Intelligence Scan** — before idea generation, Claude synthesizes Cannes Lions 2025/2026, D&AD, and Effie award-winning patterns and jury principles to inform ideation
- **Phase 5: Commerce Lens** — after Concept Rigor, each idea is evaluated by a Cannes Creative Commerce juror and labeled: Award Contender / Solid Performer / Needs a Hook / Awareness Play (with color-coded badges)
- **Thumbs up/down feedback training** — per-idea 👍/👎 buttons store liked/disliked ideas in localStorage per brand; approved/rejected directions are injected into Phase 4 (Idea Generation) prompt so Scout learns your taste over time

### Changed
- Pipeline expanded from 3 phases to 5; status bar counters updated accordingly
- `brands` object accessed via direct key lookup (`brands[activeBrandId]`) instead of `.find()` — fixes "brands.find is not a function" error

### Fixed
- `brands.find is not a function` — `brands` is stored as a plain object `{ id: brandObj }`, not an array; replaced all `.find()` calls with direct object lookup
- `saveBrands()` → `saveStore(brands)` — correct save function name

---

### Tracy-Locke Dark Theme (TL 2026 Style Guide)

#### Colors
- Background → **Dark Mode Navy** `#1f1f2d`
- Default accent → **TL Cyan** `#06e3fc` (overridden per brand)
- Borders → **Charcoal UI** `#50505a`
- Body text → **Gray Code** `#e8e8f0`
- All semantic CSS vars updated: `--ink`, `--paper`, `--rule`, `--muted`, `--ghost`, `--signal`, `--signal-dim`

#### Layout & Shape
- Masthead: sticky frosted glass (`backdrop-filter: blur`) with ambient TL Cyan glow line at top
- Idea cards: frosted glass with hover shadow lift, 14px border-radius
- Context block: frosted glass, 14px border-radius
- Run strip: frosted glass, 12px border-radius
- Buttons/inputs: 8–10px border-radius
- Chips: 6px border-radius

#### Typography
- Wordmark updated to `{ Scout }` — TL bracket notation style
- Brand hero name: Highrise font, white on dark

#### Component Updates
- Rigor/commerce labels: rgba-tinted (15% opacity) with colored text and border — dark mode safe
- Source badges (reading/done/error): dark rgba variants
- Status bar: signal-tinted, right-rounded corners
- Error bar: red-tinted, right-rounded corners
- `--signal-dim` for brand colors now computed as `rgba(r,g,b,0.12)` instead of a lightened hex

---

## Earlier Sessions

### Initial Build
- Single-file HTML app (`scout.html`) — no backend, no build step
- Direct Claude API calls from browser using `anthropic-dangerous-direct-browser-access: true`
- Brand management: create, select, delete brands stored in localStorage
- Source ingestion: upload PDFs/docs, paste URLs — Claude reads and incorporates into brand brief
- Phase 1: Brand Intelligence (Claude's knowledge + optional uploaded docs)
- Phase 2: Cultural Scan (trending moments, events, platform trends, subcultures)
- Phase 4: Idea Generation (structured JSON output: headline, handle, tension, hook, execution, signals)
- Concept Rigor Engine (Barry-Backboned): each idea evaluated against criteria — Strong Premise / Soft Insight / Execution-First / Decorative / Cliché
- Idea cards with rank badges, field labels, chip tags
- Source log toggle for transparency
- Default brands: Doritos, Mountain Dew, Gatorade, OtterBox
