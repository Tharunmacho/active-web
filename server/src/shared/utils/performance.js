// Performance monitoring utilities

export const logSlowQuery = (operation, duration, threshold = 100) => {
  if (duration > threshold && process.env.NODE_ENV === 'development') {
    console.warn(`⚠️ Slow query detected: ${operation} took ${duration}ms`);
  }
};

export const asyncTimer = async (fn, operation) => {
  const start = Date.now();
  const result = await fn();
  const duration = Date.now() - start;
  logSlowQuery(operation, duration);
  return result;
};

export const cacheManager = {
  cache: new Map(),
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  },
  
  set(key, value, ttlSeconds = 60) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + (ttlSeconds * 1000)
    });
  },
  
  clear() {
    this.cache.clear();
  }
};
