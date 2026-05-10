export class CameraError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CameraError';
  }
}

export class CacheError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CacheError';
  }
}