# Security architecture: post-quantum, tunable, verifiable

Shared with the Autheo Agent Environment (see its `docs/PQC-ROADMAP.md`). Tokenized assets,
settlement records and audit trails are long-lived evidence, so they must survive the arrival of
quantum computers ("harvest now, forge/decrypt later").

## 1. Tunable strength per institution
Each institution (tenant) selects a security profile; verifiers enforce a minimum, so a tenant
cannot be downgraded by a counterparty on a weaker profile.

| Profile | Signatures | Key exchange | NIST cat. | Typical tenant |
| --- | --- | --- | --- | --- |
| compact | Ed25519 + ML-DSA-44 | X25519 + ML-KEM-768 | 2 | high-volume retail flows, short-lived quotes |
| balanced (default) | Ed25519 + ML-DSA-65 | X25519 + ML-KEM-768 | 3 | issuers, brokers, institutional investors |
| max | Ed25519 + ML-DSA-87 | X25519 + ML-KEM-1024 (pure ML-KEM optional) | 5 | custodians, settlement anchors, regulators, CNSA 2.0 requirements |

Trade-off: higher strength → larger keys/signatures (2.4 → 4.6 KB per PQ signature) and more CPU;
no change to business logic.

## 2. Where it applies
| Layer | Mechanism |
| --- | --- |
| Identity & institution keys | DIDs with hybrid Ed25519 + ML-DSA keys, cross-signed key bindings |
| Transfers, DvP legs, corporate actions, audit entries | hybrid proof sets at the tenant's profile; audit roots anchored on Autheo L1 |
| Bank / custodian / payment-rail APIs, L0 Mesh relays | TLS 1.3 with hybrid `X25519MLKEM768`; pure `MLKEM1024` (IETF draft-ietf-tls-mlkem) for `max` tenants once stable |
| Stored or relayed confidential data (settlement instructions, KYC payloads) | hybrid X25519 + ML-KEM sealed envelopes |
| Off-chain facts used by compliance | zkTLS attestations (below) |

## 3. zkTLS: proving bank data without exposing it
zkTLS proves that a TLS endpoint (a bank, custodian, KYC provider) returned a given value, without
revealing credentials or the full response. Uses in TaaS:
- **Proof of reserves / backing** for tokenized deposits and RWA tokens, checked before minting.
- **Bank-balance and funds checks** for DvP pre-trade, without sharing statements.
- **KYC / accreditation status** from a licensed provider as a predicate ("verified, accredited"), not raw PII.
- **Reference data** (rates, NAV) for coupons and redemptions from attested sources.

Each becomes an `AutheoTlsAttestation` credential (server, request template, extracted fields,
time, proof reference) that the compliance policy can require — e.g. "reserve ≥ supply, proven by
zkTLS from custodian X within 10 minutes". Proofs verify on Autheo L1 and supported destination chains.

Caveats: the attested TLS session is classical today; SNARK-wrapped proofs are not quantum-safe
(prefer STARK-based verification where possible); proving is compute-heavy. zkTLS establishes data
provenance; identity and authorization stay on DIDs with hybrid post-quantum signatures.

## 4. Roadmap alignment
- Phase 1 pilot: hybrid signatures (balanced) on settlement and audit; hybrid PQ TLS to partners.
- Phase 2 venue: tenant-selectable profiles, zkTLS proof-of-reserves and funds checks.
- Phase 3 interoperability: PQ-signed L0 Mesh attestations; pure ML-KEM transport for `max` tenants.
