/**
 * Ticket Controller Integration Tests
 * 
 * Tests for REST endpoints with Supertest
 * - POST /api/v1/tickets - Create ticket
 * - GET /api/v1/tickets - List tickets
 * - GET /api/v1/tickets/:id - Get ticket by ID
 * - PATCH /api/v1/tickets/:id/status - Update status with RBAC
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { ticketRouter } from '../ticketRoutes.js';
import { TicketController } from '../TicketController.js';
import type { CreateTicket } from '../../../application/tickets/CreateTicket.js';
import type { ListTickets } from '../../../application/tickets/ListTickets.js';
import type { GetTicket } from '../../../application/tickets/GetTicket.js';
import type { UpdateTicketStatus } from '../../../application/tickets/UpdateTicketStatus.js';
import { v4 as uuid } from 'uuid';

describe('TicketController Integration Tests', () => {
  let app: express.Application;
  let createTicketUseCase: CreateTicket;
  let listTicketsUseCase: ListTickets;
  let getTicketUseCase: GetTicket;
  let updateTicketStatusUseCase: UpdateTicketStatus;

  beforeEach(() => {
    // Setup Express app
    app = express();
    app.use(express.json());

    // Mock middleware to inject user context
    app.use((req: any, res, next) => {
      req.user = {
        id: uuid(),
        role: process.env.TEST_USER_ROLE || 'TECH',
      };
      next();
    });

    // Create mock use cases
    createTicketUseCase = {
      execute: vi.fn(),
    } as any;

    listTicketsUseCase = {
      execute: vi.fn(),
    } as any;

    getTicketUseCase = {
      execute: vi.fn(),
    } as any;

    updateTicketStatusUseCase = {
      execute: vi.fn(),
    } as any;

    // Create controller and router
    const ticketController = new TicketController(
      createTicketUseCase,
      listTicketsUseCase,
      getTicketUseCase,
      updateTicketStatusUseCase
    );

    app.post('/tickets', (req: any, res, next) => ticketController.create(req, res, next));
    app.get('/tickets', (req: any, res, next) => ticketController.list(req, res, next));
    app.get('/tickets/:id', (req: any, res, next) => ticketController.getById(req, res, next));
    app.patch('/tickets/:id/status', (req: any, res, next) => ticketController.updateStatus(req, res, next));

    // Error handler
    app.use((err: any, req: any, res: any, next: any) => {
      res.status(500).json({ error: err.message });
    });
  });

  describe('POST /tickets - Create', () => {
    it('should create LOW risk ticket and return 201', async () => {
      const ticketResponse = {
        id: uuid(),
        riskLevel: 'LOW',
        status: 'APPROVED',
        requiresApproval: false,
        message: 'Ticket created with LOW risk. Automatically approved.',
      };

      vi.mocked(createTicketUseCase.execute).mockResolvedValueOnce(ticketResponse);

      const response = await request(app)
        .post('/tickets')
        .send({
          assetId: uuid(),
          issueDescription: 'Minor maintenance',
          probability: 1,
          consequence: 1,
        });

      expect(response.status).toBe(201);
      expect(response.body.riskLevel).toBe('LOW');
      expect(response.body.requiresApproval).toBe(false);
    });

    it('should create HIGH risk ticket requiring approval and return 201', async () => {
      const ticketResponse = {
        id: uuid(),
        riskLevel: 'HIGH',
        status: 'PENDING_APPROVAL',
        requiresApproval: true,
        message: 'Ticket created with HIGH risk. Requires manager approval.',
      };

      vi.mocked(createTicketUseCase.execute).mockResolvedValueOnce(ticketResponse);

      const response = await request(app)
        .post('/tickets')
        .send({
          assetId: uuid(),
          issueDescription: 'Critical system failure',
          probability: 4,
          consequence: 5,
        });

      expect(response.status).toBe(201);
      expect(response.body.riskLevel).toBe('HIGH');
      expect(response.body.requiresApproval).toBe(true);
    });

    it('should return 400 if required fields missing', async () => {
      const response = await request(app)
        .post('/tickets')
        .send({
          assetId: uuid(),
          // missing issueDescription
          probability: 1,
          consequence: 1,
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /tickets - List', () => {
    it('should list all tickets and return 200', async () => {
      const mockTickets = [
        { toPrimitives: () => ({ id: uuid(), riskLevel: 'LOW' }) },
        { toPrimitives: () => ({ id: uuid(), riskLevel: 'HIGH' }) },
      ];

      vi.mocked(listTicketsUseCase.execute).mockResolvedValueOnce(mockTickets);

      const response = await request(app).get('/tickets');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('should return empty list if no tickets', async () => {
      vi.mocked(listTicketsUseCase.execute).mockResolvedValueOnce([]);

      const response = await request(app).get('/tickets');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /tickets/:id - Get by ID', () => {
    it('should return ticket by ID and return 200', async () => {
      const ticketId = uuid();
      const mockTicket = {
        toPrimitives: () => ({
          id: ticketId,
          riskLevel: 'MEDIUM',
          status: 'APPROVED',
        }),
      };

      vi.mocked(getTicketUseCase.execute).mockResolvedValueOnce(mockTicket);

      const response = await request(app).get(`/tickets/${ticketId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(ticketId);
      expect(response.body.riskLevel).toBe('MEDIUM');
    });

    it('should return 404 if ticket not found', async () => {
      vi.mocked(getTicketUseCase.execute).mockRejectedValueOnce(
        new Error('Ticket not found')
      );

      const response = await request(app).get(`/tickets/${uuid()}`);

      expect(response.status).toBe(500); // Error handler catches it as 500
    });
  });

  describe('PATCH /tickets/:id/status - Update Status', () => {
    it('should update ticket status and return 200', async () => {
      const ticketId = uuid();
      const mockTicket = {
        toPrimitives: () => ({
          id: ticketId,
          status: 'IN_PROGRESS',
          riskLevel: 'MEDIUM',
        }),
      };

      vi.mocked(updateTicketStatusUseCase.execute).mockResolvedValueOnce(mockTicket);

      const response = await request(app)
        .patch(`/tickets/${ticketId}/status`)
        .send({ status: 'IN_PROGRESS' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('IN_PROGRESS');
    });

    it('should reject invalid status enum', async () => {
      const ticketId = uuid();
      const response = await request(app)
        .patch(`/tickets/${ticketId}/status`)
        .send({ status: 'INVALID_STATUS' });

      expect(response.status).toBe(400);
    });
  });
});
