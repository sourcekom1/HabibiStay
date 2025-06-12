import { logger } from "./logger";

interface CacheItem {
  data: any;
  expiry: number;
  tags: string[];
}

class InMemoryCache {
  private cache = new Map<string, CacheItem>();
  private tagIndex = new Map<string, Set<string>>();
  
  set(key: string, data: any, ttlSeconds: number = 300, tags: string[] = []): void {
    const expiry = Date.now() + (ttlSeconds * 1000);
    
    // Store the item
    this.cache.set(key, { data, expiry, tags });
    
    // Update tag index
    tags.forEach(tag => {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(key);
    });
    
    logger.debug(`Cache SET: ${key} (TTL: ${ttlSeconds}s, Tags: ${tags.join(', ')})`);
  }
  
  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) {
      logger.debug(`Cache MISS: ${key}`);
      return null;
    }
    
    if (Date.now() > item.expiry) {
      this.delete(key);
      logger.debug(`Cache EXPIRED: ${key}`);
      return null;
    }
    
    logger.debug(`Cache HIT: ${key}`);
    return item.data;
  }
  
  delete(key: string): void {
    const item = this.cache.get(key);
    if (item) {
      // Remove from tag index
      item.tags.forEach(tag => {
        const tagSet = this.tagIndex.get(tag);
        if (tagSet) {
          tagSet.delete(key);
          if (tagSet.size === 0) {
            this.tagIndex.delete(tag);
          }
        }
      });
    }
    
    this.cache.delete(key);
    logger.debug(`Cache DELETE: ${key}`);
  }
  
  invalidateByTag(tag: string): void {
    const keys = this.tagIndex.get(tag);
    if (keys) {
      keys.forEach(key => this.delete(key));
      logger.debug(`Cache INVALIDATE BY TAG: ${tag} (${keys.size} items)`);
    }
  }
  
  clear(): void {
    this.cache.clear();
    this.tagIndex.clear();
    logger.debug('Cache CLEAR: All items removed');
  }
  
  // Cleanup expired items
  cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    this.cache.forEach((item, key) => {
      if (now > item.expiry) {
        expiredKeys.push(key);
      }
    });
    
    expiredKeys.forEach(key => this.delete(key));
    
    if (expiredKeys.length > 0) {
      logger.debug(`Cache CLEANUP: Removed ${expiredKeys.length} expired items`);
    }
  }
  
  getStats(): { size: number; hitRate?: number } {
    return {
      size: this.cache.size,
    };
  }
}

// Cache instances
export const cache = new InMemoryCache();

// Cache key generators
export const cacheKeys = {
  properties: (filters?: any) => {
    if (!filters) return 'properties:all';
    const sortedFilters = Object.keys(filters)
      .sort()
      .map(key => `${key}:${filters[key]}`)
      .join('|');
    return `properties:${Buffer.from(sortedFilters).toString('base64')}`;
  },
  
  property: (id: number) => `property:${id}`,
  
  userFavorites: (userId: string) => `favorites:${userId}`,
  
  userNotifications: (userId: string, unread?: boolean) => 
    `notifications:${userId}${unread ? ':unread' : ''}`,
  
  searchResults: (query: string, filters: any) => {
    const searchData = { query, ...filters };
    const searchHash = Buffer.from(JSON.stringify(searchData)).toString('base64');
    return `search:${searchHash}`;
  },
  
  analytics: (filters: any) => {
    const analyticsHash = Buffer.from(JSON.stringify(filters)).toString('base64');
    return `analytics:${analyticsHash}`;
  },
  
  adminStats: () => 'admin:stats',
};

// Cache tags for invalidation
export const cacheTags = {
  properties: 'properties',
  property: (id: number) => `property:${id}`,
  user: (userId: string) => `user:${userId}`,
  favorites: (userId: string) => `favorites:${userId}`,
  notifications: (userId: string) => `notifications:${userId}`,
  analytics: 'analytics',
  admin: 'admin',
};

// Cache middleware
export function cacheMiddleware(keyGenerator: (req: any) => string, ttl: number = 300) {
  return (req: any, res: any, next: any) => {
    const key = keyGenerator(req);
    const cachedData = cache.get(key);
    
    if (cachedData) {
      return res.json(cachedData);
    }
    
    // Store original json method
    const originalJson = res.json;
    
    // Override json method to cache response
    res.json = function(data: any) {
      cache.set(key, data, ttl);
      return originalJson.call(this, data);
    };
    
    next();
  };
}

// Setup periodic cleanup
setInterval(() => {
  cache.cleanup();
}, 60000); // Cleanup every minute

logger.info('Cache system initialized');