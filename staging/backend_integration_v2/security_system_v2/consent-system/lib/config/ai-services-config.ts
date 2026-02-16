// AI Services Configuration for Student Interface
// Environment variables and service endpoints

export const AI_SERVICES_CONFIG = {
  // Hugging Face Configuration
  HUGGING_FACE: {
    BASE_URL: 'https://api-inference.huggingface.co',
    MODELS: {
      LLAMA2_CHAT: 'meta-llama/Llama-2-7b-chat-hf',
      WHISPER: 'openai/whisper-large-v3',
      COQUI_TTS: 'coqui/XTTS-v2'
    },
    RATE_LIMITS: {
      REQUESTS_PER_MINUTE: 60,
      TOKENS_PER_REQUEST: 1000
    }
  },

  // Supabase Configuration
  SUPABASE: {
    TABLES: {
      STUDENT_PROFILES: 'student_profiles',
      LEARNING_SESSIONS: 'student_learning_sessions',
      CONTENT_RATINGS: 'content_ratings',
      AI_INTERACTIONS: 'student_ai_interactions',
      LEARNING_CONTENT: 'learning_content',
      STUDENT_SIMILARITY: 'student_similarity'
    },
    RLS_POLICIES: {
      STUDENT_DATA_ACCESS: true,
      PRIVACY_PROTECTION: true,
      ANONYMIZED_ANALYTICS: true
    }
  },

  // Privacy and Security Settings
  PRIVACY: {
    HASH_USER_QUERIES: true,
    ANONYMIZE_ANALYTICS: true,
    LOCAL_PROCESSING_PREFERRED: true,
    NO_EXTERNAL_PII_SHARING: true,
    DATA_RETENTION_DAYS: 90
  },

  // AI Model Parameters
  MODEL_PARAMETERS: {
    LLAMA2: {
      MAX_NEW_TOKENS: 200,
      TEMPERATURE: 0.7,
      DO_SAMPLE: true,
      RETURN_FULL_TEXT: false,
      TOP_P: 0.9,
      TOP_K: 50
    },
    WHISPER: {
      LANGUAGE: 'ar',
      TASK: 'transcribe',
      RETURN_TIMESTAMPS: false
    },
    TTS: {
      LANGUAGE: 'ar',
      SPEAKER: 'default',
      SPEED: 1.0,
      PITCH: 1.0
    }
  },

  // Recommendation System Settings
  RECOMMENDER: {
    ALGORITHM: 'collaborative_filtering',
    MIN_SIMILARITY_THRESHOLD: 0.6,
    MAX_RECOMMENDATIONS: 5,
    DIVERSITY_FACTOR: 0.3,
    NOVELTY_BOOST: 0.2
  },

  // Error Handling and Fallbacks
  ERROR_HANDLING: {
    MAX_RETRIES: 3,
    RETRY_DELAY_MS: 1000,
    FALLBACK_RESPONSES: {
      LLAMA2_ERROR: 'عذراً، لم أتمكن من فهم سؤالك. هل يمكنك إعادة صياغته؟',
      WHISPER_ERROR: 'لم يتم التعرف على الصوت بوضوح. يرجى المحاولة مرة أخرى.',
      TTS_ERROR: 'لا يمكن تحويل النص إلى صوت حالياً.',
      NETWORK_ERROR: 'مشكلة في الاتصال. يرجى التحقق من الإنترنت.'
    }
  }
};

// Environment Variables Validation
export const validateAIConfig = (): boolean => {
  const requiredEnvVars = [
    'NEXT_PUBLIC_HUGGING_FACE_TOKEN',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];

  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    return false;
  }

  return true;
};

// Service Health Check
export const checkAIServicesHealth = async (): Promise<{
  llama2: boolean;
  whisper: boolean;
  tts: boolean;
  supabase: boolean;
}> => {
  const health = {
    llama2: false,
    whisper: false,
    tts: false,
    supabase: false
  };

  try {
    // Check Hugging Face API health
    const hfToken = process.env.NEXT_PUBLIC_HUGGING_FACE_TOKEN;
    if (hfToken) {
      const response = await fetch(`${AI_SERVICES_CONFIG.HUGGING_FACE.BASE_URL}/models/${AI_SERVICES_CONFIG.HUGGING_FACE.MODELS.LLAMA2_CHAT}`, {
        method: 'HEAD',
        headers: { 'Authorization': `Bearer ${hfToken}` }
      });
      health.llama2 = response.ok;
      health.whisper = response.ok; // Assume same health for HF services
      health.tts = response.ok;
    }

    // Check Supabase health
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'HEAD',
        headers: { 'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '' }
      });
      health.supabase = response.ok;
    }
  } catch (error) {
    console.error('Health check failed:', error);
  }

  return health;
};

export default AI_SERVICES_CONFIG;