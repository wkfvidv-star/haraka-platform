import os
import json
import numpy as np
import redis
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from contextlib import asynccontextmanager

# ------------------------------------------------------------------------------
# ARCHITECTURAL SANDBOX CONSTRAINT:
# The Fraud Engine is strictly STATELESS. It maintains NO in-memory session data.
# It connects to Redis to pull the user's historical rolling window.
# It returns a definitive Verdict (ACCEPT / FLAG / REJECT) based on Z-Score variance.
# ------------------------------------------------------------------------------

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/1")
redis_client = redis.from_url(redis_url, decode_responses=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🕵️ Fraud Engine Booting in Stateless Z-Score Analysis Mode...")
    # Validate Redis Connection on boot
    try:
        redis_client.ping()
        print("✅ Redis Extracted Memory Hook Connected.")
    except Exception as e:
        print(f"❌ FATAL: Redis connection failed. Fraud Engine MUST be stateless. {e}")
        # In strictly enforced environments, we would raise here.
    yield
    print("🕵️ Fraud Engine Shutting Down...")

app = FastAPI(lifespan=lifespan)

class FraudEvaluationRequest(BaseModel):
    traceId: str
    userId: str
    sessionId: str
    frameCount: int
    durationSeconds: int
    motionScore: int

# Configuration for Rolling Baseline
MIN_SESSIONS_FOR_BASELINE = 3
ROLLING_WINDOW_SIZE = 20

def calculate_z_score(current_value, history_list):
    """Calculates Statistical Z-Score (Standard Deviations from Mean)."""
    if len(history_list) < MIN_SESSIONS_FOR_BASELINE:
        return 0.0 # Insufficient data to flag
    
    mean = np.mean(history_list)
    std_dev = np.std(history_list)
    
    if std_dev == 0:
        # User is submitting the EXACT same score every time. Highly suspicious.
        return 3.5 if current_value != mean else 0.0
        
    z_score = (current_value - mean) / std_dev
    return float(z_score)

@app.post("/evaluate")
async def evaluate_session(request: FraudEvaluationRequest):
    fps = request.frameCount / request.durationSeconds if request.durationSeconds > 0 else 0
    
    # 1. Biological Limits Check (Static Guardrails)
    if fps > 60 or fps < 0.1:
        return {
            "verdict": "REJECT",
            "reason": f"Biologically impossible FPS detected: {fps:.2f}",
            "zScore": 99.9,
            "traceId": request.traceId
        }

    # 2. Extract Rolling Baseline from Stateless Redis Store
    redis_key = f"fraud:history:{request.userId}"
    history_json = redis_client.lrange(redis_key, 0, -1)
    
    # Parse history
    motion_history = []
    fps_history = []
    for h in history_json:
        try:
            data = json.loads(h)
            motion_history.append(data.get("motionScore", 0))
            fps_history.append(data.get("fps", 0))
        except:
            pass
            
    # 3. Compute Dynamic Baseline (Z-Score)
    motion_z_score = calculate_z_score(request.motionScore, motion_history)
    fps_z_score = calculate_z_score(fps, fps_history)
    
    # Take the most extreme deviance
    max_z_score = max(abs(motion_z_score), abs(fps_z_score))
    
    # Verdict Logic
    verdict = "ACCEPT"
    reason = "Nominal Variance"
    
    if max_z_score > 3.0:
        verdict = "REJECT"
        reason = f"Statistical Outlier Detected (Z-Score: {max_z_score:.2f} | FPS: {fps:.2f})"
    elif max_z_score > 2.0:
        verdict = "FLAG"
        reason = f"Anomalous Performance Variance (Z-Score: {max_z_score:.2f})"
        
    # Check for Oracle Exploit (Exact perfect repeats)
    if request.motionScore == 100:
        perfect_key = f"fraud:perfect_streak:{request.userId}"
        streak = redis_client.incr(perfect_key)
        redis_client.expire(perfect_key, 86400) # 24 hr rolling window
        if streak >= 5:
            verdict = "REJECT"
            reason = "Oracle Bypass Sequence Detected (5 Consecutive Perfect Scores)"
            max_z_score = 99.9
    else:
        redis_client.delete(f"fraud:perfect_streak:{request.userId}")

    # 4. Update Stateful Redis Baseline (LPOP/RPUSH Pattern)
    if verdict == "ACCEPT":
        new_entry = json.dumps({"motionScore": request.motionScore, "fps": fps})
        redis_client.rpush(redis_key, new_entry)
        if redis_client.llen(redis_key) > ROLLING_WINDOW_SIZE:
            redis_client.lpop(redis_key)
            
    return {
        "traceId": request.traceId,
        "verdict": verdict,
        "reason": reason,
        "zScore": max_z_score
    }

@app.get("/health")
async def health():
    return {"status": "ok", "role": "fraud-engine"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
