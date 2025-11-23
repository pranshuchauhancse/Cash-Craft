

const requestCounts = new Map();

const rateLimit = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, 
    max = 100, 
    message = 'Too many requests, please try again later.'
  } = options;

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    
    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, { count: 0, resetTime: now + windowMs });
    }

    const requestData = requestCounts.get(ip);

    
    if (now > requestData.resetTime) {
      requestData.count = 0;
      requestData.resetTime = now + windowMs;
    }

    
    requestData.count++;

    
    if (requestData.count > max) {
      return res.status(429).json({
        success: false,
        message
      });
    }

    next();
  };
};


setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of requestCounts.entries()) {
    if (now > data.resetTime) {
      requestCounts.delete(ip);
    }
  }
}, 60 * 60 * 1000);

module.exports = rateLimit;
