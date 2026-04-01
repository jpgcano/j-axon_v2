import { createHash } from 'crypto';

export class HashService {
  private static stableStringify(value: any): string {
    const normalize = (input: any): any => {
      if (input === null || input === undefined) return input;
      if (input instanceof Date) return input.toISOString();
      if (Array.isArray(input)) return input.map(normalize);
      if (typeof input === 'object') {
        const sorted: Record<string, any> = {};
        for (const key of Object.keys(input).sort()) {
          sorted[key] = normalize((input as any)[key]);
        }
        return sorted;
      }
      return input;
    };

    return JSON.stringify(normalize(value));
  }

  public static calculate(data: any): string {
    const content = typeof data === 'string' ? data : this.stableStringify(data);
    return createHash('sha256').update(content).digest('hex');
  }

  public static chain(
    prevHash: string,
    actionType: string,
    actorId: string,
    payloadAfter: any
  ): string {
    const content = prevHash + actionType + actorId + this.stableStringify(payloadAfter);
    return this.calculate(content);
  }
}
