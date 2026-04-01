/**
 * RiskLevel Value Object
 * Represents the calculated risk level based on Probability x Consequence matrix (ERM)
 *
 * Risk Calculation (ERM - Enterprise Risk Model):
 * - LOW: 1-5 (low probability or low impact)
 * - MEDIUM: 6-12 (moderate risk)
 * - HIGH: 13-20 (high risk requiring manager approval)
 * - EXTREME: 21-25 (extreme risk requiring immediate escalation)
 *
 * Formula: riskValue = probability (1-5) × consequence (1-5)
 * Result range: [1, 25]
 */
export var RiskLevelEnum;
(function (RiskLevelEnum) {
    RiskLevelEnum["LOW"] = "LOW";
    RiskLevelEnum["MEDIUM"] = "MEDIUM";
    RiskLevelEnum["HIGH"] = "HIGH";
    RiskLevelEnum["EXTREME"] = "EXTREME";
})(RiskLevelEnum || (RiskLevelEnum = {}));
export class RiskLevel {
    value;
    constructor(value) {
        this.value = value;
    }
    /**
     * Factory method: Calculate risk level from probability and consequence
     * @param probability Score 1-5 (likelihood)
     * @param consequence Score 1-5 (impact)
     * @returns RiskLevel instance
     * @throws Error if inputs are outside valid range
     */
    static calculateFromMatrix(probability, consequence) {
        if (probability < 1 || probability > 5)
            throw new Error('Probability must be between 1-5');
        if (consequence < 1 || consequence > 5)
            throw new Error('Consequence must be between 1-5');
        const riskValue = probability * consequence;
        if (riskValue <= 5)
            return new RiskLevel(RiskLevelEnum.LOW);
        if (riskValue <= 12)
            return new RiskLevel(RiskLevelEnum.MEDIUM);
        if (riskValue <= 20)
            return new RiskLevel(RiskLevelEnum.HIGH);
        return new RiskLevel(RiskLevelEnum.EXTREME);
    }
    static low() {
        return new RiskLevel(RiskLevelEnum.LOW);
    }
    static medium() {
        return new RiskLevel(RiskLevelEnum.MEDIUM);
    }
    static high() {
        return new RiskLevel(RiskLevelEnum.HIGH);
    }
    static extreme() {
        return new RiskLevel(RiskLevelEnum.EXTREME);
    }
    static fromString(value) {
        if (!Object.values(RiskLevelEnum).includes(value)) {
            throw new Error(`Invalid RiskLevel: ${value}`);
        }
        return new RiskLevel(value);
    }
    /**
     * Check if ticket requires approval (HIGH or EXTREME)
     */
    requiresApproval() {
        return this.value === RiskLevelEnum.HIGH || this.value === RiskLevelEnum.EXTREME;
    }
    /**
     * Get numeric risk score for sorting/comparison
     * Used for sorting tickets by risk
     */
    getNumericScore() {
        const scores = {
            [RiskLevelEnum.LOW]: 1,
            [RiskLevelEnum.MEDIUM]: 2,
            [RiskLevelEnum.HIGH]: 3,
            [RiskLevelEnum.EXTREME]: 4,
        };
        return scores[this.value];
    }
    /**
     * Get display color (for UI Badge component)
     */
    getColor() {
        const colors = {
            [RiskLevelEnum.LOW]: 'gray',
            [RiskLevelEnum.MEDIUM]: 'yellow',
            [RiskLevelEnum.HIGH]: 'orange',
            [RiskLevelEnum.EXTREME]: 'red',
        };
        return colors[this.value];
    }
    getValue() {
        return this.value;
    }
    equals(other) {
        return this.value === other.value;
    }
    toString() {
        return this.value;
    }
}
//# sourceMappingURL=RiskLevel.js.map