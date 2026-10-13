# Market structure

## Two tiers
| | Open tier | Institutional tier |
| --- | --- | --- |
| Who | Anyone with a wallet | Verified institutions, accredited investors, agents with mandates from them |
| Assets | THEO, majors, stablecoins, permissionless tokens | TaaS-issued RWAs, tokenized deposits, permissioned stablecoins |
| Venues | Concentrated-liquidity AMM, order book | Permissioned order book, RFQ, periodic batch auctions |
| Compliance | None beyond sanctions screening at the UI/router | Pre-trade + settlement policy checks on every fill |
| Operator | Protocol | Licensed partner (ATS/MTF/RMO) operating the venue on Autheo rails |
| Settlement | Atomic swap on L1 | DvP on L1 against regulated cash |

## Venue by asset profile
| Asset | Typical liquidity | Venue |
| --- | --- | --- |
| Tokenized money-market fund / T-bill | Deep, daily NAV | Order book + continuous RFQ, NAV-anchored price bands |
| Investment-grade bond | Moderate, dealer-driven | RFQ + periodic batch auction (e.g. every 15 min) |
| Private credit / real estate | Thin, lock-ups | Periodic batch auction or bulletin board; secondary only after lock-up |
| Tokenized equity | Deep in-hours | Order book with circuit breakers |
| Tokenized deposits / stablecoins | Very deep | Open AMM (permissionless stables) or permissioned book (deposits) |

## Order types
Limit, market (with protection band), RFQ (request → firm quotes → accept), iceberg, good-till-time,
batch-auction limit, and **intents** ("deliver ≥ N units of X on chain Z by T"). Agents may submit any of
these within the limits of their DID delegation (scope, budget, venue, asset class).

## Fees (indicative, THEO-denominated)
| Activity | Fee |
| --- | --- |
| Open-tier swap | 5–30 bps by pool tier, split LPs / protocol |
| Institutional fill | 1–3 bps per side; maker rebates for registered market makers |
| RFQ / block | flat per trade + 0.5 bps |
| Cross-chain route | per L0 Mesh hop |
Staking THEO lowers fees (tiers in [THEO](THEO.md)). Institutions that cannot hold tokens pay in fiat/stable, auto-converted.

## Liquidity programme
- Registered market makers on the institutional tier: quoting obligations (spread, size, uptime) for rebates.
- Issuer-sponsored liquidity at launch of an RWA (TaaS issuance can reserve inventory for a designated market maker).
- Open-tier LP incentives in THEO, time-limited and tied to depth, not raw TVL.
