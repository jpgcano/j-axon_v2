import { createHash } from 'crypto';

export class HashService {
  public static calculate(data: any): string {
    const content = typeof data === 'string' ? data : JSON.stringify(data);
    return createHash('sha256').update(content).digest('hex');
  }

  public static chain(prevHash: string, payload: any): string {
    const content = prevHash + JSON.stringify(payload);
    return this.calculate(content);
  }
}
