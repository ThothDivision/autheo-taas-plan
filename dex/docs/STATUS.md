# Roadmap & status

> **Where it stands (13 Oct 2026):** milestone **M0 is done**, **agent interoperability is done**, and **M1 has started**. Everything runs on a local test chain; nothing is deployed to an Autheo network and no real asset has been issued.

<div class="status-strip"><span class="chip c-done">M0 walking skeleton · Done</span><span class="chip c-done">Agent interop · Done</span><span class="chip c-started">M1 · Started</span><span class="chip c-ahead">M2 contracts · Partly ahead of plan</span><span class="chip c-planned">M3–M6 · Planned</span></div>

## Milestones and exit tests

Milestones come from the TaaS [Build plan](https://thothdivision.github.io/autheo-taas-plan/docs/BUILD-PLAN.html). A milestone counts as done only when its exit tests pass in CI and on a shared environment.

| Milestone | Exit tests (shortened) | Status |
| --- | --- | --- |
| **M0-V Discovery** | Letters of intent from a cash-leg bank, an issuer and a market maker or buyer; usability test with 5 people; decisions D-02, D-03, D-09 | {open} business work outside the code repository; not tracked here |
| **M0 Walking skeleton** | CI green on every push; scripted onboarding → mint → DvP → audit-verify passes; policy engine explains 100 % of the test vectors | {done} all met, except the shared environment (CI only so far) |
| **Agent interop** (M1 scope, added) | Agent with a mandate quotes and builds an order → human signs → DvP settles with the agent bound in; over-threshold escalates; widened or revoked chains refused | {done} unit tests + end-to-end (ADR 0006) |
| **Outside-venue plug-ins** (M1 scope, added) | One adapter interface; router picks the cheapest compatible venue; no venue contacted before the policy pre-check | {done} with mock adapters |
| **M1 Policy engine as a service** | At least 200 vectors covering every rule; property tests ("no allowed movement breaks a rule"); REST `policy.check` p95 under 50 ms at 200 requests/s | {started} 35 vectors; no REST service yet |
| **M2 L1 contracts** | On Autheo L1 testnet; invariants (supply, no move without `canTransfer`, atomic DvP); external auditor engaged; STRIDE threat model with threat tests; signed, logged freeze lifting (D-11) | {partial} contracts and invariants done early; testnet, audit, threat model, freeze flow not started |
| **M3 Pilot issuance** | Design partner issues and pays a coupon on testnet via console/API; reconciliation to the unit; appeal flow within SLA | {planned} |
| **M4 Institutional venue** | Matching engine with deterministic replay; ≥ 99 % of ineligible orders rejected pre-trade; first secondary TaaS trade on the DEX settles DvP against tokenized deposits | {planned} |
| **M5 Servicing and proofs** | Coupon to holders with units on the book; third-party-verifiable proof of reserves; audit anchoring with zero gaps over 30 days | {planned} |
| **M6 Cross-chain** | An asset bought from another chain arrives with its rules intact; supply of record unchanged after 1,000 round trips | {planned} |

The longer-range phases (open tier, institutional pilot, auctions, multi-chain, scale) are in the plan document [Phase roadmap](ROADMAP.md).

## Done

- {done} Policy engine with 12 explained checks and 35 shared vectors, enforced identically on-chain.
- {done} Permissioned token, compliance module, credential and physical-attestation registries, DvP settlement, audit anchor; 22 contract tests incl. fuzz and invariants.
- {done} Router, read-only MCP server (5 tools), audit log, SDK, console stub.
- {done} Agent authorization with Autheo delegation chains: allow / escalate / block, `agentRef` in signed orders, receipts in the audit log.
- {done} VenueAdapter plug-in interface with a mock bridge and a mock AMM.
- {done} Scripted 11-step end-to-end run and CI on Node 20 and 22; 61 unit tests.

## Next (toward M1)

From the build repository's README, in its order:

1. Freeze rule model v1; grow vectors to 200 or more, including sanctions screening and per-jurisdiction rule packs; property tests.
2. `policy.check` as a REST service with the explanation format; p95 under 50 ms at 200 requests/s.
3. Deploy to an Autheo L1 testnet; persistent audit service with periodic anchoring.
4. Lumenco: agree the scan-template hash format and attester quorum (k-of-n); wire a real scanner key (HSM).
5. Real credentials: verifiable credentials from a KYC provider; wallet-to-legal-entity binding.
6. Real venue adapters: L0 Mesh quote API and one permissioned AMM or exchange RFQ; venue allow-list and per-venue fee and slippage limits.
7. Agents: persist receipts with the audit service; bind principal DIDs to wallets; show `agentRef` and the agent's DID in the signing screen.
8. STRIDE threat model per container before M2, including agents and outside venues.

## Open risks

| Risk | Why it matters | Planned fix |
| --- | --- | --- |
| Agent budgets and receipts are in memory | A restart forgets what an agent has spent | Persist with the audit service (Next 3, 7) |
| No DID-to-wallet binding | Any trusted principal's agent can prepare orders for any wallet (it still cannot sign) | Bind principal DIDs to maker wallets (Next 7) |
| M0-signed orders no longer verify | Adding `agentRef` changed the order format; anything signed before 53caf04 must be re-signed. No real orders exist, so impact today is nil | None needed; note for anyone holding test orders |
| Venue adapters are mocks | Fees and timings are fixed numbers; no outside venue is actually reached | Real L0 Mesh and AMM / RFQ adapters (Next 6) |
| Audit log is in memory | No persistent record across restarts | Persistent audit service (Next 3) |
| Test keys for KYC and Lumenco | No real identity or device integration | Next 4, 5 |
| Amounts as JavaScript numbers in the off-chain engine | Safe below 2^53 units only | Move to big integers before real sizes |
| Not on an Autheo network; unaudited | Everything so far is local | Testnet (Next 3); external audit in M2 |
| Shared environment missing | M0 formally asks for one | Comes with the testnet deployment |

## Decisions needed

| Decision | Who / when (per the plan) | Why it blocks |
| --- | --- | --- |
| D-02 first asset class and jurisdiction | Before M1 (M0-V) | Sets the first rule pack and partner set |
| D-03 cash leg: bank tokenized deposits vs regulated stablecoin | Head of BD, before M1 | Replaces the mock `DepositToken` |
| D-09 pricing and cost model | Before quoting a partner | Fees in the router and venues |
| Lumenco scan-template format and attester quorum | With Lumenco, M1 | Real physical attestation (ADR 0003) |
| First real outside venue (L0 Mesh API; which AMM or RFQ venue) | M1 | Turns mock adapters into real routes |
| D-11 who may lift a code-enforced freeze, and the appeal path | Before M2 | Full ERC-3643 freeze / recovery features |
| D-12 key custody: MPC threshold vs HSM | Security lead, before M2 | Scanner, relayer and institutional keys |
