import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    // Log the error
    logger.error(err.message, {
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip
    });

    res.status(statusCode).json({
        success: false,
        error: {
            message: process.env.NODE_ENV === 'production' && statusCode === 500
                ? 'Internal Server Error'
                : err.message,
            code: err.code || 'INTERNAL_ERROR'
        }
    });
};
