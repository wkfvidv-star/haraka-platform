import os
import base64
import time
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.serialization import load_pem_private_key
from contextlib import asynccontextmanager

# ------------------------------------------------------------------------------
# ARCHITECTURAL SANDBOX CONSTRAINT:
# The Vision Service is a "Deterministic Sensor Authority".
# It DOES NOT calculate XP or decide if a session was successful.
# It ONLY processes frames, generates metrics, and cryptographically SIGNS them 
# so the Node Master can verify authenticity.
# ------------------------------------------------------------------------------

KEY_PATH = os.path.join(os.path.dirname(__file__), "..", "server", "certs", "vision_private.pem")
if not os.path.exists(KEY_PATH):
    raise RuntimeError(f"FATAL: Private RSA Key for Vision Service not found at {KEY_PATH}")

with open(KEY_PATH, "rb") as key_file:
    private_key = load_pem_private_key(key_file.read(), password=None)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🔒 Vision Sandbox Container Booting in Zero-Trust Mode...")
    # NOTE: In production, YOLOv8 model loading happens here. 
    # For architectural validation, we focus on the Asymmetric Cryptography and mTLS constraints.
    yield
    print("🔒 Vision Sandbox Container Shutting Down...")

app = FastAPI(lifespan=lifespan)

class AnalysisRequest(BaseModel):
    traceId: str
    sessionId: str
    durationSeconds: int
    frameCount: int
    nonce: str

def sign_payload(trace_id: str, session_id: str, nonce: str, timestamp: int, frame_count: int, duration_seconds: int, motion_score: int) -> dict:
    """Signs the deterministic metrics. Returns Payload + RSA PSS Signature."""
    
    # Expiry Window: Node must receive this payload within 10 seconds of this exact timestamp
    expiry_window = 10 
    
    # Canonical JSON Serialization before signing to prevent Signature Ambiguity
    payload_dict = {
        "traceId": trace_id,
        "sessionId": session_id,
        "nonce": nonce,
        "timestamp": timestamp,
        "expiryWindow": expiry_window,
        "frameCount": frame_count,
        "durationSeconds": duration_seconds,
        "motionScore": motion_score
    }
    
    canonical_payload = json.dumps(payload_dict, separators=(',', ':'), sort_keys=True).encode("utf-8")
    
    # Asymmetric RSA Signing (PSS Padding for maximum security)
    signature = private_key.sign(
        canonical_payload,
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.MAX_LENGTH
        ),
        hashes.SHA256()
    )
    
    payload_dict["signature"] = base64.b64encode(signature).decode("utf-8")
    return payload_dict

@app.post("/analyze")
async def analyze_video(request: AnalysisRequest):
    if request.durationSeconds <= 0 or request.frameCount <= 0:
        raise HTTPException(status_code=400, detail="Sandbox Rejection: Impossible Temporal Metrics")

    # MVP Hardening Simulation: Replaces actual heavy GPU bounding box processing to keep test loops fast
    # but strictly enforces the cryptographic pipeline.
    fps = request.frameCount / request.durationSeconds
    motion_score = min(int(fps * 10), 100) # Capped at 100
    
    current_timestamp = int(time.time())
    
    # Sensor Authority strictly signs the output. It does NOT decide XP.
    signed_data = sign_payload(
        request.traceId,
        request.sessionId,
        request.nonce,
        current_timestamp,
        request.frameCount, 
        request.durationSeconds,
        motion_score
    )

    return signed_data

@app.get("/health")
async def health():
    # K8s Liveness Probe
    return {"status": "ok", "role": "sensor-authority"}

if __name__ == "__main__":
    import uvicorn
    # mTLS enforced natively via Uvicorn SSL context in Production
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000,
        # In a real Dockerized env, the cert paths would point to securely mounted secrets
        ssl_keyfile=os.path.join(os.path.dirname(__file__), "..", "server", "certs", "vision.key"),
        ssl_certfile=os.path.join(os.path.dirname(__file__), "..", "server", "certs", "vision.crt"),
        ssl_ca_certs=os.path.join(os.path.dirname(__file__), "..", "server", "certs", "ca.crt"),
        ssl_cert_reqs=2 # ssl.CERT_REQUIRED
    )
