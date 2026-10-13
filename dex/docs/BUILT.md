# What we've built

> In one sentence: a working, tested **walking skeleton** of a compliance-gated, non-custodial exchange for tokenized real-world assets, running on a local test blockchain, with AI-agent authorization added on top.

The code lives in the private repository **ThothDivision/autheo-real-dex**. Everything below was checked against that repository on 13 Oct 2026 (latest commit `27c34c9`). Labels: {built} works and is tested · {mock} a stand-in with fixed answers · {stub} minimal placeholder · {planned} not started.

## At a glance

| Component | What it does, in plain words | Status |
| --- | --- | --- |
| Policy engine | Decides whether a transfer is allowed and explains every reason | {built} |
| Permissioned token + compliance contracts | Tokens that physically cannot move to someone who fails the rules | {built} local chain only |
| DvP settlement contract | Swaps the asset and the cash in one step: both move or neither moves | {built} local chain only |
| Credential and physical-attestation registries | Record who passed KYC, and that a physical item was scanned and is genuine | {built} test keys |
| Router service | "Pick an asset and a chain": returns a step-by-step plan the user signs | {built} |
| Venue adapters (outside exchanges) | One plug-in shape for bridges, AMMs and exchanges | {built} interface · {mock} adapters |
| MCP server (for AI tools) | Lets AI assistants ask questions and prepare unsigned orders | {built} read-only |
| Agent authorization | Checks an agent's mandate; allow, ask a human, or refuse; signs a receipt | {built} in memory |
| Audit log + on-chain anchor | Tamper-evident record of every decision, fingerprinted on-chain | {built} in memory |
| SDK | Shared code for signing formats and reading chain state | {built} |
| Console | One-page demo screen: pick asset and chain, see allow/deny explained | {stub} |
| End-to-end test + CI | Runs the whole story on a fresh test chain on every push | {built} green |

## Tests (counted on 13 Oct 2026)

| Suite | Count | What it proves |
| --- | --- | --- |
| Unit tests (vitest) | **61** passing in 5 files | policy 36 · router 10 · MCP 6 · agent 5 · audit 4 |
| Contract tests (Foundry) | **22** passing in 7 suites | 16 unit tests, 1 fuzzed DvP atomicity test, 4 invariants, 1 test that runs all 35 shared policy vectors on-chain |
| Shared policy vectors | **35** | The same 35 cases are checked by the TypeScript engine and by the contract; both must agree |
| End-to-end run | **11** scripted steps | Onboard → issue → attest → quote → settle → refuse → agent flow → audit verify, on a local chain |
| CI | Node 20 and 22 | Lint, unit, contracts and end-to-end on every push; the last 5 runs on main are green |

## Each component in detail

### Policy engine (`packages/policy`) {built}

The rulebook. Given an asset, a sender, a receiver, an amount and a time, it runs **12 checks** and returns each one with pass/fail and a human-readable reason: amount valid, asset active, sender credential, receiver credential, receiver eligibility (KYC / accredited / institution), jurisdiction, minimum size, holding limit, lock-up, transfer window, sender balance, and physical attestation. The same rule model is written a second time in Solidity (`Policy.sol`) so the on-chain check and the explanation can never drift apart (ADR 0004). Shortcut noted in the code: amounts are plain JavaScript numbers, safe below 2^53 units; they move to big integers before real notional sizes.

### Permissioned token + compliance contracts (`contracts/src`) {built}

- **PermissionedToken**: an ERC-20 token in the style of ERC-3643. Every mint, transfer and burn asks the compliance module first and reverts with the list of failed checks if the answer is no (ADR 0001).
- **ComplianceModule** + **Policy.sol**: one module serves many tokens; only the token's issuer can set its rules.
- **CredentialRegistry**: KYC providers sign credentials; anyone submits them; only the issuer revokes; distrusting a provider voids all its credentials at once.
- **PhysicalAttestationRegistry**: stores a fingerprint (hash) of a Lumenco security-feature scan per item and serial. If an asset requires it, nothing can be minted or moved without a live attestation (ADR 0003).
- **AuditAnchor**: stores the latest audit-log fingerprint on-chain; it can only move forward.
- **DepositToken** {mock}: stands in for a bank's tokenized deposits (the cash leg) until a bank partner is chosen (decision D-03).

Running on a local Ethereum-compatible test chain (anvil). Not yet deployed to an Autheo L1 testnet.

### DvP settlement (`DvPSettlement`) {built}

Delivery versus payment. Buyer and seller each sign an order (EIP-712) with their own wallet. Anyone can submit a matching pair; the contract moves the asset to the buyer and the cash to the seller **in one transaction**, straight from maker to maker. If anything fails (signature, nonce, expiry, rules, balance) the whole thing reverts: never half-settled. The contract has **no owner and no admin** and never holds a balance (checked in tests and the end-to-end run). Orders carry an `agentRef` field: zero for orders placed directly, or the fingerprint of the agent request that prepared it; settlement then emits an `AgentOrder` event. Partial fills and price improvement are deferred to the matching engine (M4).

### Router service (`services/router`) {built}

The "pick an asset and a chain" entry point. Given asset, destination chain, amount and holder, it runs the policy pre-check, then asks the venue adapters for quotes and returns a **plan** (policy result, DvP step, bridge or swap steps) for the holder to sign. Exposes `GET /assets`, `POST /quote` and serves the console page. Works against in-memory demo state or a live local chain. It never signs or submits anything.

### Venue adapters: outside exchanges (`services/router/src/venues.ts`) {built} interface, {mock} adapters

The Autheo DEX is designed as one venue among many: the router can also use outside bridges, AMMs and exchanges. Each one plugs in through the same **VenueAdapter** interface: its capabilities (kind, chains, permissioned or not), a quote, a policy-compatibility check ("can this venue keep this asset's holder rules?") and a build step. The router picks the cheapest compatible venue, and **no venue is contacted unless the policy pre-check passed**. Two adapters exist today, both mocks with fixed numbers:

- **mock L0 Mesh bridge**: lock on Autheo L1, mint a rule-bound copy on Ethereum, Base, Polygon or Avalanche (fixed 5 bps fee, 120 s).
- **mock permissioned AMM**: a swap pool that checks the holder's credential (fixed 30 bps, 15 s). An open (non-permissioned) pool is refused for assets that have holder rules.

Real adapters (L0 Mesh quote API, a permissioned AMM or exchange RFQ) are next.

### MCP server (`services/mcp`) {built}

MCP (Model Context Protocol) is how AI assistants call tools. The server is **read-only** and runs locally (stdio), against demo state or a live chain. Tools:

| Tool | What it answers |
| --- | --- |
| `asset_list` | Which assets exist, on which chains, with which rules |
| `policy_check` | Would this transfer be allowed? Every check with a reason |
| `route_quote` | The plan to get asset X onto chain Z |
| `attestation_verify` | Does a fresh scan of a physical item match its on-chain attestation? |
| `dvp_build_order` | An **unsigned** settlement order for the user to sign in their own wallet |

`policy_check`, `route_quote` and `dvp_build_order` accept an optional agent request (next section).

### Agent authorization (`packages/agent`) {built}

Lets an AI agent act for a person within a mandate, without ever getting keys. The agent sends a signed request that carries its chain of delegations back to the person. The **AgentGate** verifies it offline with a pinned copy of the public Autheo agent-environment verifier, checks that the request names exactly this call, and decides: **allow** (return the unsigned order), **escalate** (needs the person's approval) or **block** (refuse with reasons). Orders an agent prepares carry `agentRef`, so the person signs over which agent asked. Each decision produces a signed receipt that is linked into the audit log. Limits: budgets and receipts are in memory; a person's identity (DID) is not yet bound to their wallet. Details: [Agents](AGENTS.md).

### Audit log (`packages/audit`) {built}

Every event is appended to a hash chain: each entry includes the fingerprint of the one before, so changing or deleting any entry is detectable. The head is anchored on-chain in `AuditAnchor`; verification detects both tampering and truncation. Agent decisions and refusals are included. Limit: the log is held in memory; a persistent audit service is planned.

### SDK (`packages/sdk`) {built}

Shared building blocks: the EIP-712 signing formats for orders, credentials and attestations, and two "state sources" (live contracts, or in-memory demo data) that the router and MCP server read from.

### Console (`apps/console`) {stub}

A single static page served by the router: pick an asset and a chain, see the allow/deny decision with reasons and the plan. A demo, not a product UI.

### End-to-end test and CI {built}

`scripts/e2e.ts` starts a fresh local chain and runs the whole story in 11 steps: deploy and trust a KYC provider and a Lumenco attester; onboard issuer, accredited buyer and KYC-only retail party; issue an asset whose mint is refused until it is physically attested; attest and mint; quote (buyer allowed, retail denied, off-chain answer equals on-chain answer); settle a DvP trade; refuse a DvP to the retail party with nothing moved; answer MCP tools from chain state; agent with a mandate quotes and builds an order that the buyer signs and settles; over-threshold, widened and revoked agent requests escalated or refused; audit log verified and anchored. CI (GitHub Actions) runs lint, unit, contract and end-to-end tests on Node 20 and 22 on every push.

## What is real and what is mocked

| Real | Mocked or shortcut |
| --- | --- |
| Contracts, signatures, rule enforcement, DvP on a local test chain | Autheo L1 testnet not targeted yet |
| Policy engine, shared vectors, explanations | Cash leg: `DepositToken` stands in for bank tokenized deposits |
| Credentials with issuer signatures and revocation | KYC provider: a test key; no off-chain verifiable-credential check yet |
| Lumenco attestation registry and verification | Lumenco scanner: a test key and a fixed scan; no device integration |
| Router reading live chain state; MCP server | Venues: mock bridge and mock AMM with fixed fees; no live exchange |
| Agent delegation chains, mandate decisions, signed receipts | Agent receipts and spend in memory; person's DID not bound to a wallet |
| Audit hash chain and on-chain anchor | Audit log in memory; no persistent service |
