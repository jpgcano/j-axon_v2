import { RiskLevel } from './domain/tickets/index.js';

/**
 * RiskAssessmentService
 * 
 * Calcula el nivel de riesgo ERM basado en la matriz Probabilidad x Consecuencia (1-5).
 * Cumple con el requerimiento REQ-F2.1 del SRS y el objetivo OBJ-03 del BRD.
 */
export class RiskAssessmentService {
  /**
   * Calcula el nivel de riesgo multiplicando probabilidad por consecuencia.
   */
  calculate(probability: number, consequence: number): { level: RiskLevel; score: number } {
    const score = probability * consequence;

    let level: RiskLevel;
    if (score <= 4) level = RiskLevel.LOW;
    else if (score <= 9) level = RiskLevel.MEDIUM;
    else if (score <= 16) level = RiskLevel.HIGH;
    else level = RiskLevel.EXTREME;

    return { level, score };
  }
}