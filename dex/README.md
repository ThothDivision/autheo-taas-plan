# Autheo DEX

> **You choose the asset. You choose the destination. Autheo handles the chains.**

Autheo DEX is the trading layer of the Autheo stack: one venue with **two liquidity tiers** —
an open, permissionless tier for crypto-native assets and a **compliance-gated institutional tier**
for tokenized real-world assets issued through Autheo Tokenization-as-a-Service (TaaS).
Both settle atomically on Autheo L1, route across chains through the L0 Mesh, and pay fees in THEO.

The goal is not another AMM clone. It is the market that tokenized bonds, funds, private credit and
deposits need: eligibility enforced on every fill, delivery-versus-payment settlement, institutional
order types, and access to the liquidity of every chain Autheo connects.

## Planning documents
| | |
| --- | --- |
| [Architecture](docs/ARCHITECTURE.md) | Venues, router, settlement, compliance hooks, custody, oracles, MEV protection |
| [Market structure](docs/MARKET-STRUCTURE.md) | Two tiers, venue types per asset, order types, fees, market-maker programme |
| [TaaS integration](docs/TAAS-INTEGRATION.md) | How TaaS-issued assets list, trade, settle, pay coupons and move across chains on the DEX |
| [THEO economics](docs/THEO.md) | Fees, staking, liquidity incentives, where THEO is and is not used |
| [Risk & compliance](docs/RISK.md) | Regulatory perimeter, partner licences, smart-contract, liquidity, oracle and quantum risk |
| [Roadmap](docs/ROADMAP.md) | Phased 2–3 year plan with gates |

Status: planning. Companion: [Autheo TaaS plan](https://github.com/ThothDivision/autheo-taas-plan).
Nothing here is an offer of securities or a regulated service.
