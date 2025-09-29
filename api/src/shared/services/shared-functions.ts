export class SharedFunctions {
  static getRequestIP(request: any): string | null {
    // When using nginx, request ip will be stored in 'x-forwarded-for' header.
    return request && request.headers && request.headers['x-forwarded-for']
      ? request.headers['x-forwarded-for']
      : request?.ip || null;
  }

  static shuffle<T>(array: T[]) {
    const a = [...array];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}
