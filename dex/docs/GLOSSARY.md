# Glossary

Plain-language meanings of the terms on these pages.

| Term | Meaning |
| --- | --- |
| **ADR** | Architecture decision record: a short note of one decision, why, and what it costs. The DEX has six |
| **agentRef** | A field in a settlement order holding the fingerprint of the agent request that prepared it (zero if a person placed it directly). The person signs over it |
| **AgentGate** | The DEX component that checks an agent's request and mandate and signs a receipt |
| **Allow / escalate / block** | The three outcomes of an agent check: go ahead, ask the person first, or refuse |
| **AMM** | Automated market maker: a trading pool that prices by formula instead of an order book |
| **Anvil** | A local, throwaway Ethereum-compatible test chain used for tests |
| **Attestation (physical)** | A signed statement that a scanned Lumenco security feature on a physical item matches its token |
| **Audit anchor** | A contract that stores the latest fingerprint of the audit log on-chain, so the log cannot be quietly rewritten |
| **Audit log (hash chain)** | A list of events where each entry includes the fingerprint of the previous one; editing or deleting any entry is detectable |
| **Autheo Agent Environment** | The public SolutionsAsService reference project defining agent identities, mandates, decisions and receipts |
| **Autheo L1** | Autheo's own blockchain, where settlement is meant to happen; not targeted yet (local chain only) |
| **Bridge** | A way to move a token's representation from one chain to another |
| **Budget asset** | The unit all of an agent's limits are counted in, e.g. a specific token in its smallest units |
| **canTransfer** | The on-chain question every token movement asks the compliance module: are all checks passed? |
| **Cash leg / asset leg** | The two sides of a trade: the payment and the thing bought |
| **Claim** | A property in a credential: KYC passed, accredited investor, institution |
| **Compliance module** | The contract that holds each asset's rules and answers `canTransfer` |
| **Credential** | A signed statement from a KYC provider about a wallet's claims and jurisdiction |
| **DEX** | Decentralized exchange. Here: a venue where users trade from their own wallets and settlement happens on-chain |
| **DID / did:key** | Decentralized identifier: an identity that is just a public key, created locally with no registry |
| **Delegation chain** | Signed permission slips from a person to an agent (and on to sub-agents), each only able to narrow what it received |
| **Deposit token** | A test token standing in for a bank's tokenized deposits (the cash leg) |
| **DvP** | Delivery versus payment: asset and cash move together in one transaction, or neither moves |
| **EIP-712** | A standard for signing structured data in a wallet, so the user sees what they sign |
| **ERC-20** | The common token standard on Ethereum-style chains |
| **ERC-3643** | A standard for permissioned security tokens (also known as T-REX) where every transfer is checked against rules |
| **End-to-end (e2e) test** | A script that runs the whole story on a fresh chain, start to finish |
| **Exit test** | A test that must pass for a milestone to count as done |
| **Foundry** | The toolkit used to build and test the Solidity contracts |
| **Fuzz test** | A test run with many random inputs to find edge cases |
| **Invariant test** | A test that checks something always holds (e.g. total supply never changes unexpectedly) across random sequences of actions |
| **Invocation** | An agent's signed request for one specific call, carrying its delegation chain |
| **KYC** | Know your customer: identity checks done by a regulated provider |
| **L0 Mesh** | Autheo's planned cross-chain routing layer; mocked today |
| **Lumenco** | Partner producing banknote-grade micro-optic security features that can be applied to items and scanned |
| **Mandate** | What an agent may do for a person: scopes, assets, per-action limit, total budget, approval threshold |
| **MCP** | Model Context Protocol: the standard way AI assistants call tools |
| **Minor units** | The smallest unit of an asset (like cents for dollars) |
| **Mock** | A stand-in with fixed answers, used until the real thing is connected |
| **Non-custodial** | Autheo never holds users' keys or funds |
| **Nonce** | A one-time number in an order that prevents replaying it |
| **Policy engine** | The code that runs the 12 transfer checks and explains each result |
| **Policy vector** | One test case (inputs and expected result) shared by the off-chain engine and the contract |
| **Principal** | The person an agent works for; the root of its delegation chain |
| **Receipt** | A signed record of an agent decision, hash-linked to the previous ones |
| **Relayer** | Any account that submits already-signed orders to the chain; it cannot change them |
| **RFQ** | Request for quote: asking market makers for a price instead of using a pool or book |
| **Router** | The service that turns "this asset on that chain" into a step-by-step plan |
| **RWA** | Real-world asset: bonds, funds, deposits, bullion and similar, represented as tokens |
| **Scope** | A named permission in a mandate, e.g. `dex.quote` or `dex.order.build` |
| **STRIDE** | A standard way of listing threats: spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege |
| **TaaS** | Tokenization as a Service: Autheo's issuance product; the DEX is where TaaS assets trade |
| **THEO** | Autheo's network token (fees, staking); see [THEO economics](THEO.md) |
| **Typehash** | The fingerprint of an order's format; changing the format (as `agentRef` did) invalidates older signatures |
| **Unsigned order** | An order prepared for a user that does nothing until the user signs it |
| **Vendored / pinned** | A dependency copied into the repository at an exact version, checked so it cannot change silently |
| **Venue** | Any place a trade can happen: the Autheo DEX, an outside exchange, an AMM, a bridge |
| **VenueAdapter** | The plug-in shape every outside venue implements so the router can use it |
