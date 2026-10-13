# Compliance & security

> Three promises: **only eligible people can hold the asset**, **nobody but the owner can move it**, and **every decision leaves a tamper-evident trace**. Autheo provides technology; regulated roles (custodian, venue operator, transfer agent) are meant to be held by licensed partners.

## Who may hold an asset

- **Credentials.** A trusted KYC provider signs a credential for a wallet, with claims: `KYC`, `ACCREDITED`, `INSTITUTION`, and a jurisdiction. Anyone can submit it to the on-chain credential registry; only the provider can revoke it; if the provider is distrusted, all its credentials stop counting at once. {built} with a test provider key.
- **Asset rules.** The issuer (or transfer agent) sets each asset's rule set: required claims, allowed jurisdictions, minimum size, holding limit, lock-up end, daily transfer window, and whether a live physical attestation is required. Only the token's owner can change it. {built}
- **Physical truth.** For physical assets, a Lumenco micro-optic security feature is scanned; only a fingerprint (hash) goes on-chain. If required, nothing mints or moves without a live attestation, and anyone can check a fresh scan against the record. {built} with a test scanner key.

## Transfer restrictions: the 12 checks

Every mint, transfer and burn runs these checks on-chain. The off-chain engine runs the same checks first so people see the reasons before signing.

| Check | Plain meaning |
| --- | --- |
| `amount_valid` | The amount is greater than zero |
| `asset_active` | The asset is not paused |
| `sender_credential` | The sender holds a credential that is not revoked or expired (not applied to a mint) |
| `receiver_credential` | The receiver holds a credential that is not revoked or expired |
| `receiver_eligibility` | The receiver has the required claims (e.g. accredited) |
| `jurisdiction` | The receiver's jurisdiction is allowed |
| `minimum_size` | The trade meets the minimum size |
| `holding_limit` | The receiver will not exceed the holding cap (the issuer is exempt) |
| `lockup` | The lock-up period has ended (the issuer is exempt) |
| `transfer_window` | It is inside the allowed time window of the day |
| `sender_balance` | The sender has enough |
| `physical_attestation` | The physical item has a live attestation, if required |

A failed on-chain transfer reverts with a bitmask of the failed checks that decodes to the same names and reasons the API shows (ADR 0004).

## Who holds which keys

| Party | Key | Can it move value? |
| --- | --- | --- |
| Users and institutions | Their own wallet (EOA, smart account or MPC custodian) | Yes, their own assets only, by signing orders |
| Issuer / transfer agent | Token owner key | Sets rules and mints within the rules; cannot bypass them |
| KYC provider | Credential-signing key | No; signs credentials only (test key today) |
| Lumenco attester | Scanner key (HSM planned, decision D-12) | No; signs attestations only (test key today) |
| Autheo services (router, MCP) | **None** | No; they return plans and unsigned orders |
| DEX receipt key | Its own `did:key` | No; signs agent-decision receipts only |
| AI agents | **Never a user key**; only their own key for signing requests | No; at most they prepare unsigned orders |
| DvP contract | **No owner, no admin** | Only moves both legs of orders the makers signed |
| Relayer | Any account | Submits signed orders; cannot alter them |

## Threats and what stops them

| Threat | What stops it | Status |
| --- | --- | --- |
| Autheo service is hacked | Services hold no keys and only build unsigned data: zero funds at risk | {built} |
| Half-settled trade | DvP moves both legs in one transaction or reverts; fuzz-tested | {built} |
| Asset reaches an ineligible holder | On-chain `canTransfer` on every movement; invariant-tested | {built} |
| Off-chain and on-chain rules disagree | Same 35 vectors in both; e2e asserts the pre-check equals the chain | {built} |
| Replayed or stale order | Nonces, expiry, on-chain `cancel` | {built} |
| Counterfeit physical item | Attestation required; fresh scan must match; revocation freezes the token | {built} |
| Forged, widened or revoked agent mandate | Offline chain verification; attenuation; revocations | {built} |
| Agent request replayed or reused for another call | One invocation authorizes one exact call | {built} |
| Agent order relabelled | `agentRef` is inside the signed order | {built} |
| Restricted asset leaks into an open pool | Venue adapter must pass a policy-compatibility check; open pools refused | {built} (mock venues) |
| Outside venue contacted for a denied trade | Router contacts venues only after the pre-check passes | {built} |
| Audit log edited or truncated | Hash chain + on-chain anchor; both detected | {built} |
| Agent overspends after a restart | Budgets in memory today; persistence planned | {open} |
| Agent prepares orders for a stranger's wallet | Wallet must still sign; DID-to-wallet binding planned | {open} |
| Smart-contract defect | Invariant + fuzz tests; external audit planned before any real value | {partial} |
| Full threat model | STRIDE model per container, before M2 | {planned} |

The code is **unaudited sandbox code** running on a local test chain.

## Architecture decision records

| ADR | Decision in one line |
| --- | --- |
| 0001 | Permissioned token with ERC-3643 *semantics* (every movement asks one shared compliance module); not the full T-REX suite until a partner needs it |
| 0002 | Non-custodial: users sign EIP-712 orders, settlement goes maker to maker in one transaction, the DvP contract has no owner, services are read-only |
| 0003 | Physical verification: per-item hash of a Lumenco scan, signed by a trusted attester, required by rule; a lost or disputed item freezes until re-attested |
| 0004 | One rule model written twice (TypeScript and Solidity), tested against the same vectors; on-chain reverts decode to the same reasons |
| 0005 | Tooling: TypeScript npm workspaces on Node 20+, Solidity + Foundry, OpenZeppelin, viem, MCP SDK |
| 0006 | Agent authorization: optional Autheo delegation-chain request on the tools, verified offline; allow / escalate / block; `agentRef` in the order; signed receipts in the audit log |

All six were accepted on 13 Oct 2026. The wider plan's open decisions (D-01 to D-13) and risk register are in the TaaS plan's [Decisions and risks](https://thothdivision.github.io/autheo-taas-plan/docs/DECISIONS-AND-RISKS.html); the DEX plan's own risk list is [Risk register (plan)](RISK.md).
