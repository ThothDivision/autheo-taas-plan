# Roadmap (2–3 years)

Positioning: not "another DEX" — the infrastructure connecting TradFi, decentralized markets and tokenized assets. The DEX is one venue on top of TaaS.

| Phase | Window | Engineering | Commercial / regulatory |
| --- | --- | --- | --- |
| **0 · Sandbox** (this repo) | Now – Q1 | Reference flows, policy model, API, console, Shadw deploy | Demo for bank/partner conversations; validate rule model with counsel |
| **1 · Pilot on Autheo L1** | Q1 – Q3 | Permissioned token standard + compliance module on L1; DvP contract; Autheo Identity credentials; persistent store (Postgres) + multi-tenancy; ISO 20022 / webhook adapters | 1–2 design-partner institutions (issuer + licensed custodian/tokenized-deposit bank); regulatory sandbox applications |
| **2 · Institutional venue** | Q3 – Y2 Q2 | Marketplace order book + RFQ for block trades; oracle-fed corporate actions (rates/NAV); custody integrations (MPC/HSM); audit root anchoring; AI-governance review of policy changes | Partner ATS/MTF operator for secondary trading; KYC provider network; first live RWA issuance (private credit or money-market fund) |
| **3 · Interoperability** | Y2 | L0 Mesh attestations with rules enforced on destination chains; regulated stablecoin & tokenized-deposit PvP; multi-jurisdiction rule packs | Distribution to external chains' liquidity; cross-border settlement corridors |
| **4 · TaaS at scale** | Y2 – Y3 | Self-serve issuance via DevHub templates; SDKs; SLA tiers; THEO staking for relayers/validators | White-label TaaS for banks; fee revenue in THEO; DEX liquidity programmes |

## THEO utility (where appropriate)
- Network & settlement fees denominated in THEO (fiat-quoted, auto-converted for institutions that cannot hold tokens).
- Staking tiers → fee discounts for institutions; staking for L0 Mesh relayers/attesters (security budget).
- Not used as the settlement asset for regulated instruments — cash legs are tokenized deposits / regulated stablecoins.

## Open questions to evaluate
1. Token standard: adopt ERC-3643 semantics on L1 vs. native Autheo standard.
2. First asset class & jurisdiction for the pilot (private credit / MMF; US, EU-DLT Pilot Regime, SG Project Guardian, CH DLT Act).
3. Cash leg: partner tokenized deposits vs. regulated stablecoin vs. both.
4. Licensing map: which partner holds custody, ATS/MTF and transfer-agent roles per jurisdiction.
5. Privacy: confidential balances/transfers for institutions (ZK or permissioned subnets) without losing auditability.
6. Post-quantum: default tenant profile (balanced = ML-DSA-65) and when to require `max`; zkTLS proving backend (RISC Zero / SP1) and STARK vs SNARK on-chain verification — see [SECURITY-PQC.md](SECURITY-PQC.md).
