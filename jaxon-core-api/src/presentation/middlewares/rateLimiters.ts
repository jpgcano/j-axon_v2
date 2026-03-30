import rateLimit from 'express-rate-limit';

const authWindowMs = Number(process.env.RATE_LIMIT_AUTH_WINDOW_MS ?? 15 * 60 * 1000);
const authMax = Number(process.env.RATE_LIMIT_AUTH_MAX ?? 5);

const apiWindowMs = Number(process.env.RATE_LIMIT_API_WINDOW_MS ?? 60 * 1000);
const apiMax = Number(process.env.RATE_LIMIT_API_MAX ?? 300);

export const authLimiter = rateLimit({
  windowMs: authWindowMs,
  max: authMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Try again later.' },
});

export const apiLimiter = rateLimit({
  windowMs: apiWindowMs,
  max: apiMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down.' },
});
