# Autheo DEX

> **You choose the asset. You choose the destination. Autheo handles the chains.**

Autheo DEX is the trading layer of the Autheo stack: one venue with **two liquidity tiers** —
an open, permissionless tier for crypto-native assets and a **compliance-gated institutional tier**
for tokenized real-world assets issued through Autheo Tokenization-as-a-Service (TaaS).
Both settle atomically on Autheo L1, route across chains through the L0 Mesh, and pay fees in THEO.

The goal is not another AMM clone. It is the market that tokenized bonds, funds, private credit and
deposits need: eligibility enforced on every fill, delivery-versus-payment settlement, institutional
order types, and access to the liquidity of every chain Autheo connects.

## Build status (what exists today)
Checked against the private build repository ThothDivision/autheo-real-dex; the site's overview page is the entry point.

| | |
| --- | --- |
| [What we've built](docs/BUILT.md) | Every component, real vs mock, test counts |
| [Architecture](docs/SYSTEM.md) | Parts, trade flow, agent flow, repository map |
| [Agents](docs/AGENTS.md) | Autheo Agent Environment: identities, delegation chains, mandates, `dex.*` scopes, receipts |
| [Compliance & security](docs/SECURITY.md) | Eligibility, the 12 transfer checks, key holders, threat table, ADRs |
| [Roadmap & status](docs/STATUS.md) | Milestones with exit tests, done / next, open risks, decisions needed |
| [Glossary](docs/GLOSSARY.md) | Plain-language terms |

Build: `node scripts/build.mjs` (no dependencies; mermaid is vendored in `site/vendor/`, no remote scripts).

## Planning documents
| | |
| --- | --- |
| [Architecture](docs/ARCHITECTURE.md) | Venues, router, settlement, compliance hooks, custody, oracles, MEV protection |
| [Market structure](docs/MARKET-STRUCTURE.md) | Two tiers, venue types per asset, order types, fees, market-maker programme |
| [TaaS integration](docs/TAAS-INTEGRATION.md) | How TaaS-issued assets list, trade, settle, pay coupons and move across chains on the DEX |
| [THEO economics](docs/THEO.md) | Fees, staking, liquidity incentives, where THEO is and is not used |
| [Risk & compliance](docs/RISK.md) | Regulatory perimeter, partner licences, smart-contract, liquidity, oracle and quantum risk |
| [Roadmap](docs/ROADMAP.md) | Phased 2–3 year plan with gates |

Status: M0 done, agent interop done, M1 started (see Roadmap & status). Part of the [Autheo TaaS plan](../README.md) (merged from ThothDivision/autheo-dex-plan); site: https://thothdivision.github.io/autheo-taas-plan/dex/
Nothing here is an offer of securities or a regulated service.
