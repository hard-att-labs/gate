# HARD-ATT V7

Experimental cryptographic attestation layer with cost-based request gating.

## Features
- Proof-of-Work cost barrier
- Stateless token verification
- Cryptographic signing (HMAC SHA-256)
- Expiration-based validation

## Flow
Client → PoW → Issue Token → Verify Token

## Run

```bash
npm install
npm start
