export class TokenBucketRateLimit<_KEY> {
  private storage = new Map<_KEY, Bucket>()

  constructor(
    private max: number,
    private refillIntervalSeconds: number,
  ) {}

  public consume(key: _KEY, cost: number): boolean {
    let bucket = this.storage.get(key) ?? null
    const now = Date.now()

    if (bucket === null) {
      bucket = {
        count: this.max - cost,
        refilledAtMilliseconds: now,
      }
      this.storage.set(key, bucket)
      return true
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
