# Economics (indicative)

Every number on this page is computed from the inputs in the first table. **The inputs are assumptions for discussion, not
benchmarked prices or a forecast**; change an input and recompute. Costs are not estimated here (see decision D-09 in
[Decisions and risks](DECISIONS-AND-RISKS.md)).

## Inputs (assumptions)

| Input | Value | Note |
| --- | --- | --- |
| Issuance fee | 15 bps of issued notional | assumption |
| Servicing | $2,000 per corporate action + $1 per holder per action | assumption |
| Trading fee | 5 bps per side → 10 bps of traded notional | assumption, THEO-denominated with staking discounts not modelled |
| Settlement fee | 0.5 bps per DvP leg × 2 legs | assumption |
| Reference asset | $100,000,000 bond, 4 corporate actions a year, 300 holders | illustrative |

## One reference asset

| Stream | Formula | Year 1 |
| --- | --- | --- |
| Issuance (one-off) | 100,000,000 × 0.0015 | $150,000 |
| Servicing | 4 × (2,000 + 300 × 1) | $9,200 |
| Trading + settlement at 40 % annual turnover | 40,000,000 × (0.0010 + 0.0001) | $44,000 |
| **Total year 1** | | **$203,200** |
| Recurring from year 2 | servicing + trading + settlement | $53,200 |

## Portfolio scenarios (first year after launch)

| Scenario | Assets issued | Annual turnover | One-off issuance | Recurring | Total |
| --- | --- | --- | --- | --- | --- |
| Low | 3 | 10 % | $450,000 | $60,600 | $510,600 |
| Base | 10 | 40 % | $1,500,000 | $532,000 | $2,032,000 |
| High | 25 | 100 % | $3,750,000 | $2,980,000 | $6,730,000 |

What moves the result most: issuance count and size dominate year 1; **turnover** dominates every later year, which is why
the plan puts secondary liquidity (designated market makers, anchor assets) ahead of new features — see
[DEX integration](DEX-INTEGRATION.md).

## Where THEO flows

- Fees are quoted in fiat and settled in THEO; institutions that cannot hold tokens pay fiat and a partner converts.
- Staking tiers give fee discounts; L0 Mesh relayers and attesters stake THEO as their security bond.
- THEO is **not** the cash leg of regulated instruments (tokenized deposits / regulated stablecoins are).

## Not modelled

Partner revenue share (bank float, venue fees), white-label licences, THEO price, staking discounts, operating and compliance
costs, and the time from pilot to the first live issuance. These are open until D-09 is decided.
