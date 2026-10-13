# North star: pick an asset and a chain — Autheo handles the rest

**One sentence:** an issuer or holder picks a real-world asset and the chain they want it on; Autheo applies the asset's rules,
settles trades delivery-versus-payment, routes it across chains and proves the physical item is genuine — **without ever holding
anyone's keys or funds**.

## What "handles the rest" means

| The user does | Autheo does | Where it is built |
| --- | --- | --- |
| Picks an asset (or creates one with its rules) | Compiles the rule set into the policy engine and the on-chain compliance module | `packages/policy`, `contracts/ComplianceModule` |
| Picks a destination chain | Quotes a route, re-checks eligibility on the destination, locks on L1 and mints the representation on the destination | `services/router`, L0 Mesh adapter |
| Signs one order or intent in their own wallet | Matches it and settles both legs atomically, or neither | `contracts/AtomicSwap` (DvP) |
| Scans a physical item | Verifies the Lumenco attestation bound to the token before mint, transfer or redemption | `contracts/PhysicalAttestationRegistry` |
| Asks an AI agent to do any of the above | Exposes every step as MCP tools that return explanations and unsigned orders — the agent never signs | `services/mcp` |

## Non-custodial by design

- Users sign typed-data orders (EIP-712) with their own keys or their custodian's MPC; Autheo services build, match and relay, but cannot move funds on their own.
- Settlement is a smart contract call that checks both signatures and the policy, then moves both legs or reverts.
- Regulated institutions may still choose a licensed custodian (D-04, D-12); "non-custodial" means **Autheo** never custodies, not that nobody may.
- The DEX matching engine is off-chain for speed (D-06) but cannot settle anything a user did not sign.

## Lumenco physical verification (partnership)

Lumenco's banknote-grade optical security features turn a physical item (bar, certificate, collectible, packaged good) into
something whose token can be checked against the real thing:

1. At enrolment a Lumenco feature is applied to the item; an approved attester scans it and records **only a hash** of the
   feature identifier and serial, with the token id, in `PhysicalAttestationRegistry`, signed by the attester.
2. The asset's rule set can require a valid attestation for mint, transfer, cross-chain hop or redemption.
3. Anyone can verify a scan against the registry; attesters can revoke (item lost, damaged, feature compromised), which blocks
   the actions the rule set protects.
4. Feature specifics stay with Lumenco and the attester; nothing about how the feature works is published on-chain.

Open items: attester accreditation and liability (new decision D-14), scan-device integration and the commercial terms of the partnership.
Feature names and capabilities on this page are generic until the partnership documents are added.

## How this changes the build

The build moved from planning to code: development started in a private repository (**autheo-real-dex**, ThothDivision) with the
M0 walking skeleton — policy engine, permissioned token + compliance, credential registry, non-custodial DvP, Lumenco attestation
registry, "pick asset + chain" router and an MCP server, with an end-to-end test in CI. The reference-class estimates in the
[Build plan](BUILD-PLAN.md) stay as the outside view; actual progress will be reported against the milestone exit tests.
