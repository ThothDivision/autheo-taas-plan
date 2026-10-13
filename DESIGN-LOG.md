# DESIGN-LOG — Autheo TaaS & DEX plan sites (DADA run)

- **Artifacts**: `site/landing.html`, `site/style.css`, `scripts/build.mjs` (shared by ThothDivision/autheo-taas-plan and ThothDivision/autheo-dex)
- **Mode**: Adaptive (public pitch to banks and institutions; must read clearly for non-crypto audiences and on phones)
- **Tools**: Playwright Chromium screenshots (1366×900 full page, 390×844, doc pages with rendered Mermaid); overflow measured with `scrollWidth - innerWidth`. Panels written sequentially in one context (process gap: no separate agent per critic).
- **Stop conditions**: S1 every Block resolved; S2 no horizontal page overflow at 390 px; S3 every diagram legible at native size (scroll rather than shrink); S4 a round with no new Block; S5 time box 3 rounds.

## Traversal Plan
Seed — Stance: "White (Kenya Hara)" (emptiness as invitation; paper, ink, room). Dotted counterpoint: Hara -.-> "Tufte Style" (*emptiness counterpoint to* data density) — kept live by giving the dense material (tables, diagrams) a quiet frame instead of decoration. Rules: "Grid Systems in Graphic Design (Josef Müller-Brockmann)", "Visual Hierarchy (Arnheim, Dondis)", "WCAG 2.2 Contrast and Perceivability (W3C)". System: "NYCTA Graphics Standards Manual (Vignelli, Noorda)" + "The Vignelli Canon (Massimo Vignelli)". Breaker: "Making and Breaking the Grid (Timothy Samara)", through "Chesterton's Fence".
Frontier: "Envisioning Information (Edward Tufte)", "Don't Make Me Think (Steve Krug)", "Mismatch: How Inclusion Shapes Design (Kat Holmes)", "MAYA: Most Advanced Yet Acceptable (Raymond Loewy)".

## R0 — Premortem of the existing site
The old site was the default GitHub Pages theme rendering a README: no identity, no picture of the idea, tables of links. Imagined failure: "a bank executive opens it, sees a markdown file, and never learns what 'Autheo handles the chains' means."

## Decision Records
**D1 — The idea as a transit map.** Anchors: "NYCTA Graphics Standards Manual (Vignelli, Noorda)", "Envisioning Information (Edward Tufte)". Intent: the North Star is literally a routing promise — assets (lines) pass one interchange (policy · DvP · L0 Mesh) and reach destinations (DEX, chains, bank rails). Alternatives rejected: (a) isometric "blockchain cubes" illustration — generic, says nothing specific; (b) layered architecture diagram as hero — accurate but cold, kept for the docs. Consequence: generated SVG, 45° bends, one colour per line, white terminals with black rings, single hub. Fence: labels in ink, never in line colour (colour is not the only carrier — WCAG). mode: Adaptive.

**D2 — Paper and ink.** Anchors: "White (Kenya Hara)", "Visual Hierarchy (Arnheim, Dondis)". Intent: institutional trust through restraint; colour reserved for routes. Alternatives rejected: dark crypto aesthetic (signals speculation to bank readers); brand gradients (decoration). Measured: ink #111 on paper #fbfaf6 ≈ 18.5:1; muted #55534d ≈ 7.3:1; link #0b50c2 ≈ 6.9:1 — all AA+.

**D3 — Swiss grid, one break.** Anchors: "Grid Systems in Graphic Design (Josef Müller-Brockmann)", "Making and Breaking the Grid (Timothy Samara)", "Chesterton's Fence". Intent: 12 columns, 2 px ink rules opening each band; the only element that ignores the column grid is the route map, which runs edge to edge because routes don't stop at gutters. An earlier break (map tucked under the headline) was withdrawn in R3 — see panel.

**D4 — Docs as reading surfaces.** Anchors: "Envisioning Information (Edward Tufte)", "The Vignelli Canon (Massimo Vignelli)". Intent: 68-character measure, minimal-ink tables (rules, no fills), each document owns one route colour shown as a full-height line and a station marker in its kicker, so the reader always knows "which line" they are on. Mermaid diagrams render at native size and scroll sideways on phones rather than shrinking to illegible.

## Panel Reports
### R1
| Critic | Anchor | Observed | Verdict | Requested change |
| --- | --- | --- | --- | --- |
| Critic: Provocateur (Debord) | The Society of the Spectacle (Guy Debord) | No hype imagery; the map argues rather than dazzles | Pass | — |
| Critic: Provocateur (Shklovsky) | Art as Technique (Viktor Shklovsky) | Transit map makes "tokenization" strange and concrete | Pass | — |
| Critic: Inclusion (Holmes) | Mismatch: How Inclusion Shapes Design (Kat Holmes) | On a phone the map scales to ~5 px labels; nav wraps to three rows | **Block** | Map scrolls at native size; one-row scrolling nav |
| Critic: Inclusion (Mace) | The Principles of Universal Design (Ronald Mace et al.) | Contrast fine; route colours always paired with ink labels | Pass | — |
| Critic: Evidence (Tufte) | Envisioning Information (Edward Tufte) | Mermaid diagrams shrunk to fit: 6–8 px text | **Block** | Native size + horizontal scroll |
| Critic: Usability (Krug) | Don't Make Me Think (Steve Krug) | Pillars 5+1 and cards 4+2 leave orphans; map below the fold on DEX | Concern | Fixed 3-column grids; smaller headline |
| Critic: Craft (Bringhurst) | The Elements of Typographic Style (Robert Bringhurst) | Headline tracking/leading good; measure good | Pass | — |
CRP — Andon pulled by Holmes and Tufte. Dotted pair: Provocateurs vs Krug agree for once (the map is both strange and clear).

### R2
Fixes landed (3-column grids, single-row nav, native-size diagrams, mobile map scroll, headline 5.6vw). **New Block (Holmes/Krug):** the first station label ("Bonds", "Wallets") disappeared under the call-to-action buttons because the map was pulled up under the hero with a negative margin (the D3 break). Chesterton's Fence: the gap above the map existed to keep labels clear.

### R3
Negative margin removed; all station labels visible at 1366 and 390 px; page overflow 0 at every width tested. No new Block — stop (S1–S4 met).

## Anchor Ledger
Hara (White), Tufte Style (counterpoint), Müller-Brockmann, Arnheim/Dondis, WCAG 2.2, NYCTA Manual, Vignelli Canon, Samara, Chesterton's Fence, Envisioning Information, Krug, Holmes, Mace, Debord, Shklovsky, Bringhurst, MAYA (map kept familiar — Beck/Vignelli conventions — while the subject is new).

## Compliance Check
Mode ✓ · seed (Stance, Rules, Breaker, dotted counterpoint) ✓ · premortem ✓ · decisions before moves ✓ · Provocateur + Inclusion seats ✓ · measurements ✓ · stops met after R3 ✓ · gap: sequential panel.
