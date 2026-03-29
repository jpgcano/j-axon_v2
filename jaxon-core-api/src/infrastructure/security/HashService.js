import { createHash } from 'crypto';
export class HashService {
    static calculate(data) {
        const content = typeof data === 'string' ? data : JSON.stringify(data);
        return createHash('sha256').update(content).digest('hex');
    }
    static chain(prevHash, payload) {
        const content = prevHash + JSON.stringify(payload);
        return this.calculate(content);
    }
}
//# sourceMappingURL=HashService.js.map