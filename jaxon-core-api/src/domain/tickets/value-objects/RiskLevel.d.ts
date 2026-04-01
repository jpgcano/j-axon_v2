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
export declare enum RiskLevelEnum {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    EXTREME = "EXTREME"
}
export declare class RiskLevel {
    private value;
    constructor(value: RiskLevelEnum);
    /**
     * Factory method: Calculate risk level from probability and consequence
     * @param probability Score 1-5 (likelihood)
     * @param consequence Score 1-5 (impact)
     * @returns RiskLevel instance
     * @throws Error if inputs are outside valid range
     */
    static calculateFromMatrix(probability: number, consequence: number): RiskLevel;
    static low(): RiskLevel;
    static medium(): RiskLevel;
    static high(): RiskLevel;
    static extreme(): RiskLevel;
    static fromString(value: string): RiskLevel;
    /**
     * Check if ticket requires approval (HIGH or EXTREME)
     */
    requiresApproval(): boolean;
    /**
     * Get numeric risk score for sorting/comparison
     * Used for sorting tickets by risk
     */
    getNumericScore(): number;
    /**
     * Get display color (for UI Badge component)
     */
    getColor(): 'gray' | 'yellow' | 'orange' | 'red';
    getValue(): RiskLevelEnum;
    equals(other: RiskLevel): boolean;
    toString(): string;
}
//# sourceMappingURL=RiskLevel.d.ts.map