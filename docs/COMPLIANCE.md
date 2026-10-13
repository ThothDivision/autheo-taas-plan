# Compliance model

**Autheo is a technology provider, not a bank, broker-dealer, custodian or exchange.** In the target model:

| Role | Who |
| --- | --- |
| KYC/AML decision, sanctions screening | Licensed providers / the onboarding institution (Autheo enforces the result) |
| Custody of client assets & keys | Licensed custodian partner (MPC/HSM) |
| Cash leg (tokenized deposits / stablecoin) | Partner bank / regulated issuer |
| Secondary-market venue | Partner holding ATS/MTF/RMO licence |
| Issuer / transfer agent of record | Issuer + licensed transfer agent |
| Rule enforcement, settlement rails, interoperability, audit | **Autheo** |

## Rules enforced per movement (`src/policy.js`)
`amount_valid`, `asset_active` (pause/freeze), `sender_kyc`/`receiver_kyc` (incl. expiry),
`sender_sanctions`/`receiver_sanctions`, `jurisdiction` (allow/deny lists), `investor_eligibility`
(accredited/institution), `concentration_limit`, `lockup`, `minimum_size`, `sender_balance`.
Every result returns all checks with pass/fail and a human-readable detail, which is what an auditor or compliance officer sees.

## Sandbox caveats
Seed parties, KYC results, custody and chains are simulated. Nothing here is an offer of securities or a regulated service. Before any live pilot: legal review per jurisdiction, data-protection review (PII stays off-chain; only credential references on-chain), security review and penetration test.
