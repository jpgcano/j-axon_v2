import { test, expect, describe } from 'vitest';
import { TicketController } from './TicketController.js';
import { RiskLevel } from '../../domain/tickets/index.js';
import { RiskAssessmentService } from '../../RiskAssessmentService.js';

describe('TicketController - Create Flow', () => {
  const mockCreateTicket: any = {
    execute: async (payload: any) => ({
      toPrimitives: () => ({ ...payload, id: 'new-uuid' })
    })
  };

  const controller = new TicketController(
    mockCreateTicket,
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    new RiskAssessmentService()
  );

  test('debe calcular automáticamente el riesgo EXTREME para 5x5', async () => {
    const req: any = {
      body: {
        issueDescription: 'Falla catastrófica en generador',
        assetId: '550e8400-e29b-41d4-a716-446655440000',
        probability: 5,
        consequence: 5
      },
      user: { id: 'user-admin' }
    };

    let responseData: any;
    let statusCode: number;
    const res: any = {
      status: (code: number) => {
        statusCode = code;
        return { json: (data: any) => { responseData = data; } };
      }
    };

    await controller.create(req, res, (err) => { 
      if (err) {
        console.error('Zod or Service Error:', err);
        throw err;
      }
    });
    
    expect(statusCode).toBe(201);
    expect(responseData).toBeDefined();
    // Comparamos contra el valor del enum para evitar fallos de referencia
    expect(responseData.inherentRiskLevel).toBe(RiskLevel.EXTREME);
    expect(responseData.metadata.erm_score).toBe(25);
  });

  test('debe retornar 401 si falta el contexto de usuario', async () => {
    const req: any = { 
      body: {
        issueDescription: 'Descripción válida para pasar Zod',
        assetId: '550e8400-e29b-41d4-a716-446655440000' // UUID válido
      }, 
      user: null 
    };
    let statusCode: number;
    let responseData: any;

    const res: any = {
      status: (code: number) => ({
        json: (data: any) => { 
          statusCode = code; 
          responseData = data; 
        }
      })
    };

    // Usamos una función next que atrape errores de validación inesperados
    await controller.create(req, res, (err) => { 
      if (err) throw new Error(`Validación Zod falló inesperadamente: ${JSON.stringify(err)}`); 
    });

    expect(statusCode).toBe(401);
  });
});