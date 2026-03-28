# Haraka Platform: Cryptographic Key Rotation Policy (Production-Grade)

To maintain absolute Zero-Trust integrity, all asymmetric and symmetric keys must be rotated on a defined schedule or upon potential exposure.

## 1. Automated Session Key Rotation
- **Session Tokens (JWT):** Rotated every 15 minutes per user automatically via short TTLs.
- **Refresh Tokens:** Rotated on every single usage (Refresh Token Rotation pattern).

## 2. Service-to-Service RSA Keys (Vision/Node)
- **Schedule:** Every 90 Days.
- **Process:**
    1. Generate new RSA KeyPair: `node scripts/generate_crypto.js`.
    2. Deploy new `vision_public.pem` to Node Server.
    3. Deploy new `vision_private.pem` to Vision Microservice.
    4. Restart Vision Service followed by Node Server.

## 3. Internal mTLS Certificates (CA/Node/Vision)
- **Schedule:** Every 365 Days.
- **Process:**
    1. Re-run `generate_crypto.js` to create new Root CA and derived service certs.
    2. Update `certs/` volume in Docker/K8s.
    3. Verify connectivity via `/health` endpoints.

## 4. Emergency Revocation (CRL)
- In case of a compromise, the `ca.crt` must be immediately revoked and all derived certificates blacklisted at the `https.Agent` level in Node.js.
- **Action:** Wipe the `certs/` directory and re-initialize the root trust chain immediately.
