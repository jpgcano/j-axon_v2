import { RiskLevel } from './domain/tickets/index.js';
/**
 * RiskAssessmentService
 *
 * Calcula el nivel de riesgo ERM basado en la matriz Probabilidad x Consecuencia (1-5).
 * Cumple con el requerimiento REQ-F2.1 del SRS y el objetivo OBJ-03 del BRD.
 */
export declare class RiskAssessmentService {
    /**
     * Calcula el nivel de riesgo multiplicando probabilidad por consecuencia.
     */
    calculate(probability: number, consequence: number): {
        level: RiskLevel;
        score: number;
    };
}
//# sourceMappingURL=RiskAssessmentService.d.ts.map