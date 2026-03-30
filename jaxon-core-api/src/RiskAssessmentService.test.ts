import { test, expect, describe } from 'vitest';
import { RiskAssessmentService } from './RiskAssessmentService.js';
import { RiskLevel } from './domain/tickets/index.js';

describe('RiskAssessmentService - Cálculo ERM', () => {
  const service = new RiskAssessmentService();

  test('debe retornar LOW para score bajo (2x2)', () => {
    const { level, score } = service.calculate(2, 2);
    expect(level).toBe(RiskLevel.LOW);
    expect(score).toBe(4);
  });

  test('debe retornar MEDIUM para score medio (3x3)', () => {
    const { level, score } = service.calculate(3, 3);
    expect(level).toBe(RiskLevel.MEDIUM);
    expect(score).toBe(9);
  });

  test('debe retornar HIGH para score alto (4x4)', () => {
    const { level, score } = service.calculate(4, 4);
    expect(level).toBe(RiskLevel.HIGH);
    expect(score).toBe(16);
  });

  test('debe retornar EXTREME para score máximo (5x5)', () => {
    const { level, score } = service.calculate(5, 5);
    expect(level).toBe(RiskLevel.EXTREME);
    expect(score).toBe(25);
  });
});