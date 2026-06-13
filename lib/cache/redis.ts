import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function cacheGet<T>(key: string): Promise<T | null> {
  const data = await redis.get<string>(key)
  if (!data) return null
  try {
    return JSON.parse(data) as T
  } catch {
    return null
  }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  await redis.set(key, JSON.stringify(value), { ex: ttlSeconds })
}

export async function cacheDelete(key: string): Promise<void> {
  await redis.del(key)
}
