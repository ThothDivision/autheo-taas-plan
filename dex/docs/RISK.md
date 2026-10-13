# Risk & compliance

| Risk | Mitigation |
| --- | --- |
| **Operating an unlicensed exchange** | Institutional tier operated by / with a licensed ATS/MTF/RMO partner per jurisdiction; Autheo provides technology. Open tier limited to non-security tokens. |
| **Securities leaking into open pools** | Transfer hooks reject non-eligible addresses including pool contracts; listing policy per asset. |
| **Smart-contract failure** | Audits, formal verification of settlement and hook contracts, staged limits, pause by issuer/venue operator. |
| **Thin RWA liquidity** | Batch auctions, RFQ, designated market makers, NAV-anchored price bands. |
| **Oracle manipulation** | Multiple sources, staleness and deviation breakers, zkTLS-attested sources for off-chain facts. |
| **MEV / front-running** | Frequent batch auctions, sealed order submission, solver competition with bonds. |
| **Cross-chain risk** | Canonical supply on L1, attested mint/burn via L0 Mesh, per-chain caps, rules enforced on destinations. |
| **Agent misuse** | DID delegation chains with scope/budget/venue limits, receipts, revocation. |
| **Quantum** | Hybrid ML-DSA signatures on settlement and audit, hybrid ML-KEM transport; tunable profiles per institution. |
| **Privacy** | Credentials prove eligibility without PII on-chain; confidential balances studied for institutions. |
