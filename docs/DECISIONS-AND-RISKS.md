# Decisions and risks

Open decisions with options and a recommendation, the risk register, and the premortem that produced them.
Owners are roles; names are assigned at the next planning review. Every row is **Proposed** until accepted in an ADR.

## Decisions (ADR-style)

| ID | Decision | Options | Recommendation | Consequences | Status | Decide by | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D-01 | Token standard on L1 | (a) ERC-3643 semantics on L1 · (b) native Autheo standard · (c) both via adapter | (a) — tooling, auditors and partners already recognise it; native fast path behind the same interface | Easier: audits, partner integration. Harder: L1-specific optimisations. Touches R-03, R-04 | Proposed | before M2 | Lead architect |
| D-02 | First asset class and jurisdiction | (a) money-market fund · (b) short-dated bond · (c) private credit; US / EU DLT Pilot / SG / CH | (a) or (b) in a sandbox regime — NAV-anchored, deep, simplest servicing | Easier: liquidity (R-05). Harder: yield story for private-credit investors | Proposed | before M1 (M0-V) | Head of BD + Counsel |
| D-03 | Cash leg | (a) partner tokenized deposits · (b) regulated stablecoin · (c) both | (a) for the pilot, (b) later | Easier: bank partnership, regulation. Harder: depends on one bank (R-01) | Proposed | before M1 (M0-V) | Head of BD |
| D-04 | Licensing map | (a) a licensed partner holds every role (custodian, venue operator, transfer agent) · (b) Autheo obtains its own licence for one or more roles · (c) hybrid: partners for the pilot, Autheo licensed later | (a), one partner per role per jurisdiction before M3 | Easier: R-02. Harder: partner dependency, revenue share | Proposed | before M3 | Counsel |
| D-05 | Privacy model | (a) public balances · (b) confidential balances with view keys · (c) permissioned subnet | (b) — auditability kept through view keys and the audit chain | Harder: key management for regulators; touches R-12 | Proposed | before M4 | Lead architect + Counsel |
| D-06 | Matching engine placement | (a) off-chain, venue-supervised · (b) on-chain book | (a) — speed and venue supervision; settlement stays on-chain | Gives up: on-chain order transparency; adds trust in the venue operator (R-02) | Proposed | before M4 | Lead architect |
| D-07 | Default post-quantum profile | balanced (ML-DSA-65) vs max | balanced by default, max per tenant | Harder: two signature sizes to test | Proposed | before M2 | Security lead |
| D-08 | zkTLS proving backend | RISC Zero vs SP1; STARK vs SNARK verification | spike both in M5, pick on verifier gas and proof time | Easier: a pick based on measured verifier gas and proof time. Harder: two spikes in M5; the pick locks in a proof system. Touches R-07, R-08 | Proposed | M5 | Lead architect |
| D-09 | Pricing and cost model | adopt the indicative schedule in [Economics](ECONOMICS.md) vs benchmark first | benchmark against 3 live tokenization platforms before quoting a partner | Delays first quote; avoids pricing on untested numbers | Proposed | before M1 (M0-V) | Head of BD |
| D-10 | Fiat-quoted fees settled in THEO | (a) THEO only · (b) fiat or THEO via a converting partner | (b) | Harder: conversion partner; touches R-11 | Proposed | before M3 | Finance + Counsel |
| D-11 | Override and appeal authority for code-enforced freezes | (a) issuer / transfer agent · (b) licensed venue · (c) Autheo · appeals via (i) the investor's institution with an SLA, (ii) an ombudsman | (a)+(b) may lift freezes by a signed, logged action; never (c). Appeals via (i) with a published SLA: reason + ticket id within 1 business day, unfreeze or denial within 10 business days (assumption, Counsel to confirm by M2) | Easier: accountability for code-as-law. Harder: SLA operations for institutions | Proposed | before M2 | Counsel + Head of BD |
| D-12 | Key custody threshold | MPC t-of-n per client vs HSM-only vs both | MPC 2-of-3 minimum for institutional wallets, HSM for relayer and attester keys | Touches R-09, R-08 | Proposed | before M2 | Security lead |
| D-13 | Domain reference class | assemble 3+ institutional tokenization / DvP build histories vs keep the general IT base rate | assemble during M0-V; until then use the IT base rate | Changes P50/P80 buffers in the Build plan | Proposed | before M1 | Product lead |

Status moves Proposed → Accepted or Superseded only with a dated entry in `docs/adr/` of the development repo.

## Risk register

| ID | Risk | Likelihood | Impact | Trigger to watch | Mitigation | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| R-01 | No design-partner bank for the cash leg | Medium | High | No signed LOI by end of Phase 0 | Parallel talks with 3 banks; stablecoin fallback (D-03) | Head of BD |
| R-02 | Regulator treats Autheo as performing a regulated activity | Medium | High | Counsel opinion or sandbox feedback | Partners hold every licensed role (D-04); legal opinion per jurisdiction | Counsel |
| R-03 | Smart-contract defect moves value incorrectly | Low | Critical | Audit findings, invariant test failures | Invariant + fuzz tests, external audit, pause control, value caps in pilot | CTO |
| R-04 | Off-chain pre-check and on-chain rule drift apart | Medium | High | A fill allowed off-chain fails on-chain | Shared test vectors (build plan); settlement-time re-check | Lead architect |
| R-05 | Thin secondary liquidity makes listings look dead | High | High | No buy-side or market-maker LOI by end of Phase 0; later, spread and depth per listing below target | Anchor assets, designated market makers, issuer inventory ([DEX integration](DEX-INTEGRATION.md)) | Head of markets |
| R-06 | KYC/credential provider outage blocks trading | Medium | Medium | Credential verification error rate | Cache valid credentials until expiry; second provider | Ops |
| R-07 | L1 throughput or finality below need | Low | High | Settlement queue latency | Batch settlement, measured capacity tests before M4 | CTO |
| R-08 | Mesh attestation compromise mints unbacked supply elsewhere | Low | Critical | Attester quorum anomalies | Supply of record on L1, staked attesters, HSM keys (D-12), per-route caps, pause; forged-quorum threat test in M2 | Mesh lead |
| R-09 | Key compromise at a client or custodian | Medium | High | Custodian incident report | Wallet unbinding, MPC/HSM requirement, per-party limits | Security lead |
| R-10 | Schedule overrun (outside view) | High | Medium | A milestone passes its P80 date ([Build plan](BUILD-PLAN.md)) | P50/P80 buffers from the reference class (D-13); cut scope, never exit tests | Product lead |
| R-11 | THEO price volatility affects fee predictability | Medium | Medium | Fee quotes drift | Fiat-quoted fees (D-10) | Finance |
| R-12 | Personal data written on-chain by mistake | Low | High | Data review finding | Only references on-chain; schema checks in CI; privacy review | Counsel + CTO |

## Premortem (R0)

"It is two years from now and TaaS failed. Why?" — the answers that became decisions or risks above:
there was no bank for the cash leg (R-01, D-03); a regulator saw Autheo as the venue (R-02, D-04); listings had no buyers
(R-05); a contract bug froze an asset (R-03); the off-chain and on-chain rules disagreed in production (R-04); the plan's
fees were never tested against the market (D-09); the build ran a year late because the first estimate was the inside view (R-10).

## Who the plan leaves out

The plan is written for issuers, banks and venues. Two parties carry risk without a seat: **end investors of the institutions**
(their positions are frozen by pauses and sanctions hits they cannot see) and **holders on destination chains** (they rely on
mesh attestations they did not choose). The plan answers both only partly: every denial carries a readable reason through the
institution's API, and destination holders can verify supply of record on L1. A complaint and appeal path for frozen positions
is now decision D-11: freezes are lifted only by a named legal role through a signed, logged action, and appeals go through the investor's institution under a published SLA, tested in M3.
