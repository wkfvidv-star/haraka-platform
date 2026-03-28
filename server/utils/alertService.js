import winston from 'winston';

const alertLogger = winston.createLogger({
    level: 'warn',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/alerts.log' }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

/**
 * Centeralized Alert Service for Phase 9 Controlled Financial Pilot.
 */
export const broadcastAlert = (level, message, metadata = {}) => {
    alertLogger.log(level, message, {
        service: 'haraka-alert-system',
        timestamp: new Date().toISOString(),
        ...metadata
    });

    // FUTURE: Integrate with Slack/Discord/PagerDuty here
};

/**
 * Basic Anomaly Detection
 * @param {string} type - 'XP' or 'AI_USAGE'
 * @param {number} value - The value to check
 * @param {object} context - User/Service context
 */
export const checkAnomaly = (type, value, context = {}) => {
    const thresholds = {
        XP_SPIKE: 500,        // Max XP per single event
        AI_USAGE_SPIKE: 50,    // Max AI calls per hour per user (mock threshold)
        REDIS_SATURATION: 0.8  // 80% capacity (mock threshold)
    };

    if (type === 'XP' && value > thresholds.XP_SPIKE) {
        broadcastAlert('error', `ANOMALY DETECTED: XP Spike`, {
            type, value, threshold: thresholds.XP_SPIKE, ...context
        });
        return true;
    }

    if (type === 'AI_USAGE' && value > thresholds.AI_USAGE_SPIKE) {
        broadcastAlert('warn', `ANOMALY DETECTED: AI Usage Spike`, {
            type, value, threshold: thresholds.AI_USAGE_SPIKE, ...context
        });
        return true;
    }

    return false;
};

export default {
    broadcastAlert,
    checkAnomaly
};
