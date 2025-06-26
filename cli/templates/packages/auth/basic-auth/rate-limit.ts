export class TokenBucketRateLimit<_KEY> {
  private storage = new Map<_KEY, Bucket>()

  constructor(
    private max: number,
    private refillIntervalSeconds: number,
  ) {
    if (max <= 0) throw new Error('Max must be greater than 0')
    if (refillIntervalSeconds <= 0)
      throw new Error('Refill interval must be greater than 0')
  }

  public consume(key: _KEY, cost: number): boolean {
    if (cost <= 0) throw new Error('Cost must be greater than 0')

    let bucket = this.storage.get(key) ?? null
    const now = Date.now()

    if (bucket === null) {
      if (cost > this.max) return false

      bucket = {
        count: this.max - cost,
        refilledAtMilliseconds: now,
      }
      this.storage.set(key, bucket)
      return true
    }

    if (
      now - bucket.refilledAtMilliseconds >
      this.refillIntervalSeconds * 1000
    ) {
      this.storage.delete(key)
      return this.consume(key, cost)
    }

    const refill = Math.floor(
      (now - bucket.refilledAtMilliseconds) /
        (this.refillIntervalSeconds * 1000),
    )
    bucket.count = Math.min(bucket.count + refill, this.max)
    bucket.refilledAtMilliseconds += refill * this.refillIntervalSeconds * 1000

    if (bucket.count < cost) {
      this.storage.set(key, bucket)
      return false
    }

    bucket.count -= cost
    this.storage.set(key, bucket)
    return true
  }
}

interface Bucket {
  count: number
  refilledAtMilliseconds: number
}
