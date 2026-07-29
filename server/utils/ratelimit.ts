import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

let ratelimitInstance: Ratelimit | null = null

export function getRatelimit() {
  if (ratelimitInstance) {
    return ratelimitInstance
  }

  const config = useRuntimeConfig()

  const url = config.upstashRedisRestUrl || process.env.UPSTASH_REDIS_REST_URL
  const token = config.upstashRedisRestToken || process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    console.warn('[Ratelimit] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN missing. Rate limiting disabled/bypassed.')
    return null
  }

  const redis = new Redis({
    url,
    token
  })

  const reqLimit = Number(config.upstashLimitRequests || process.env.UPSTASH_LIMIT_REQUESTS) || 5
  const windowConfig = (config.upstashLimitWindow || process.env.UPSTASH_LIMIT_WINDOW || '60s') as `${number}s` | `${number}m` | `${number}h` | `${number}d`

  ratelimitInstance = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(reqLimit, windowConfig),
    analytics: true,
    prefix: 'ratelimit:send-message'
  })

  return ratelimitInstance
}
