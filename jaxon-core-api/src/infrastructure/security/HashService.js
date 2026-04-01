import { createHash } from 'crypto';
export class HashService {
    static stableStringify(value) {
        const normalize = (input) => {
            if (input === null || input === undefined)
                return input;
            if (input instanceof Date)
                return input.toISOString();
            if (Array.isArray(input))
                return input.map(normalize);
            if (typeof input === 'object') {
                const sorted = {};
                for (const key of Object.keys(input).sort()) {
                    sorted[key] = normalize(input[key]);
                }
                return sorted;
            }
            return input;
        };
        return JSON.stringify(normalize(value));
    }
    static calculate(data) {
        const content = typeof data === 'string' ? data : this.stableStringify(data);
        return createHash('sha256').update(content).digest('hex');
    }
    static chain(prevHash, actionType, actorId, payloadAfter) {
        const content = prevHash + actionType + actorId + this.stableStringify(payloadAfter);
        return this.calculate(content);
    }
}
//# sourceMappingURL=HashService.js.map