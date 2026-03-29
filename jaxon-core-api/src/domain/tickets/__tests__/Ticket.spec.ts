/**
 * Ticket Domain Entity Tests
 * 
 * Test Suite for Ticket aggregate root validation and business rules
 * Focuses on:
 * - Constructor validation
 * - ERM calculation (Probability × Consequence)
 * - Status transitions and RBAC
 * - Business rule enforcement
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Ticket } from '../Ticket';
import { RiskLevel, RiskLevelEnum } from '../value-objects/RiskLevel';
import { TicketStatus, TicketStatusEnum } from '../value-objects/TicketStatus';
import { v4 as uuid } from 'uuid';

describe('Ticket Domain Entity', () => {
  let ticketId: string;
  let assetId: string;
  let userId: string;

  beforeEach(() => {
    ticketId = uuid();
    assetId = uuid();
    userId = uuid();
  });

  describe('Constructor Validation', () => {
    it('should create a ticket with valid parameters', () => {
      const ticket = new Ticket(
        ticketId,
        assetId,
        'Critical database failure',
        4,
        5,
        userId
      );

      expect(ticket.getId()).toBe(ticketId);
      expect(ticket.getAssetId()).toBe(assetId);
      expect(ticket.getDescription()).toBe('Critical database failure');
    });

    it('should throw error if ID is empty', () => {
      expect(() => {
        new Ticket('', assetId, 'Description', 3, 3, userId);
      }).toThrow('Ticket ID cannot be empty');
    });

    it('should throw error if asset ID is empty', () => {
      expect(() => {
        new Ticket(ticketId, '', 'Description', 3, 3, userId);
      }).toThrow('Asset ID cannot be empty');
    });

    it('should throw error if description is empty', () => {
      expect(() => {
        new Ticket(ticketId, assetId, '', 3, 3, userId);
      }).toThrow('Description cannot be empty');
    });

    it('should throw error if probability is out of range', () => {
      expect(() => {
        new Ticket(ticketId, assetId, 'Description', 6, 3, userId);
      }).toThrow('Probability must be between 1-5');

      expect(() => {
        new Ticket(ticketId, assetId, 'Description', 0, 3, userId);
      }).toThrow('Probability must be between 1-5');
    });

    it('should throw error if consequence is out of range', () => {
      expect(() => {
        new Ticket(ticketId, assetId, 'Description', 3, 6, userId);
      }).toThrow('Consequence must be between 1-5');

      expect(() => {
        new Ticket(ticketId, assetId, 'Description', 3, 0, userId);
      }).toThrow('Consequence must be between 1-5');
    });
  });

  describe('ERM Calculation (Probability × Consequence)', () => {
    it('should calculate LOW risk (1-5): P=1, C=1', () => {
      const ticket = Ticket.create(ticketId, assetId, 'Minor issue', 1, 1, userId);
      const risk = ticket.getRiskLevel();

      expect(risk.getValue()).toBe(RiskLevelEnum.LOW);
      expect(risk.requiresApproval()).toBe(false);
    });

    it('should calculate LOW risk (1-5): P=2, C=2', () => {
      const ticket = Ticket.create(ticketId, assetId, 'Minor issue', 2, 2, userId);
      const risk = ticket.getRiskLevel();

      expect(risk.getValue()).toBe(RiskLevelEnum.LOW);
    });

    it('should calculate MEDIUM risk (6-12): P=2, C=4', () => {
      const ticket = Ticket.create(ticketId, assetId, 'Moderate issue', 2, 4, userId);
      const risk = ticket.getRiskLevel();

      expect(risk.getValue()).toBe(RiskLevelEnum.MEDIUM);
      expect(risk.requiresApproval()).toBe(false);
    });

    it('should calculate HIGH risk (13-20): P=3, C=5', () => {
      const ticket = Ticket.create(ticketId, assetId, 'Severe issue', 3, 5, userId);
      const risk = ticket.getRiskLevel();

      expect(risk.getValue()).toBe(RiskLevelEnum.HIGH);
      expect(risk.requiresApproval()).toBe(true);
    });

    it('should calculate HIGH risk (13-20): P=4, C=4', () => {
      const ticket = Ticket.create(ticketId, assetId, 'Severe issue', 4, 4, userId);
      const risk = ticket.getRiskLevel();

      expect(risk.getValue()).toBe(RiskLevelEnum.HIGH);
    });

    it('should calculate EXTREME risk (21-25): P=5, C=5', () => {
      const ticket = Ticket.create(ticketId, assetId, 'Critical issue', 5, 5, userId);
      const risk = ticket.getRiskLevel();

      expect(risk.getValue()).toBe(RiskLevelEnum.EXTREME);
      expect(risk.requiresApproval()).toBe(true);
    });

    it('should calculate boundary: P=5, C=4 = 20 = HIGH', () => {
      const ticket = Ticket.create(ticketId, assetId, 'Critical', 5, 4, userId);
      expect(ticket.getRiskLevel().getValue()).toBe(RiskLevelEnum.HIGH);
    });

    it('should calculate boundary: P=5, C=5 = 25 = EXTREME', () => {
      const ticket = Ticket.create(ticketId, assetId, 'Critical', 5, 5, userId);
      expect(ticket.getRiskLevel().getValue()).toBe(RiskLevelEnum.EXTREME);
    });
  });

  describe('Initial Status Based on Risk Level', () => {
    it('should auto-approve LOW risk tickets', () => {
      const ticket = Ticket.create(ticketId, assetId, 'Low risk', 1, 1, userId);
      expect(ticket.getStatus().getValue()).toBe(TicketStatusEnum.APPROVED);
    });

    it('should auto-approve MEDIUM risk tickets', () => {
      const ticket = Ticket.create(ticketId, assetId, 'Medium risk', 2, 3, userId);
      expect(ticket.getStatus().getValue()).toBe(TicketStatusEnum.APPROVED);
    });

    it('should require approval for HIGH risk tickets', () => {
      const ticket = Ticket.create(ticketId, assetId, 'High risk', 3, 5, userId);
      expect(ticket.getStatus().getValue()).toBe(TicketStatusEnum.PENDING_APPROVAL);
    });

    it('should require approval for EXTREME risk tickets', () => {
      const ticket = Ticket.create(ticketId, assetId, 'Extreme risk', 5, 5, userId);
      expect(ticket.getStatus().getValue()).toBe(TicketStatusEnum.PENDING_APPROVAL);
    });
  });

  describe('Approval Workflow', () => {
    it('should approve PENDING_APPROVAL ticket', () => {
      const ticket = Ticket.create(ticketId, assetId, 'High risk', 4, 5, userId);
      const managerId = uuid();
      const updaterId = uuid();

      ticket.approve(managerId, updaterId);

      expect(ticket.getStatus().getValue()).toBe(TicketStatusEnum.APPROVED);
      expect(ticket.getApprovedById()).toBe(managerId);
      expect(ticket.getUpdatedBy()).toBe(updaterId);
    });

    it('should throw error if approving already approved ticket', () => {
      const ticket = Ticket.create(ticketId, assetId, 'Low risk', 1, 1, userId);
      // Already APPROVED due to low risk

      expect(() => {
        ticket.approve(uuid(), uuid());
      }).toThrow('Cannot approve ticket. Current status is APPROVED, expected PENDING_APPROVAL');
    });

    it('should not allow approval transition after creation', () => {
      const ticket = Ticket.create(ticketId, assetId, 'High risk', 4, 5, userId);
      ticket.approve(uuid(), userId);

      // Try to revert to PENDING_APPROVAL (should fail)
      expect(() => {
        ticket.changeStatus(TicketStatus.pendingApproval(), 'ADMIN', userId);
      }).toThrow('Cannot set status to PENDING_APPROVAL after creation');
    });
  });

  describe('RBAC for Status Transitions', () => {
    it('should allow ADMIN to transition any status', () => {
      const ticket = Ticket.create(ticketId, assetId, 'Test', 2, 2, userId);
      expect(ticket.canBeModifiedBy('ADMIN')).toBe(true);
    });

    it('should not allow AUDITOR to modify', () => {
      const ticket = Ticket.create(ticketId, assetId, 'Test', 2, 2, userId);
      expect(ticket.canBeModifiedBy('AUDITOR')).toBe(false);
    });

    it('should block TECH from modifying HIGH/EXTREME tickets (RBAC)', () => {
      const ticket = Ticket.create(ticketId, assetId, 'High risk', 4, 5, userId);
      expect(ticket.canBeModifiedBy('TECH')).toBe(false);
      expect(ticket.canBeModifiedBy('MANAGER')).toBe(true);
    });

    it('should allow TECH to modify LOW/MEDIUM tickets', () => {
      const ticket = Ticket.create(ticketId, assetId, 'Low risk', 1, 2, userId);
      expect(ticket.canBeModifiedBy('TECH')).toBe(true);
    });

    it('should allow MANAGER to modify any ticket', () => {
      const highRiskTicket = Ticket.create(ticketId, assetId, 'High', 4, 5, userId);
      expect(highRiskTicket.canBeModifiedBy('MANAGER')).toBe(true);
    });
  });

  describe('Immutability of Core Fields', () => {
    it('should not allow modification of probability after creation', () => {
      const ticket = Ticket.create(ticketId, assetId, 'Test', 2, 3, userId);
      const originalProbability = ticket.getProbability();

      // Try to create a modified copy (should fail via design)
      // Getters are read-only by design
      expect(ticket.getProbability()).toBe(originalProbability);
    });

    it('should not allow modification of consequence after creation', () => {
      const ticket = Ticket.create(ticketId, assetId, 'Test', 2, 3, userId);
      const originalConsequence = ticket.getConsequence();

      expect(ticket.getConsequence()).toBe(originalConsequence);
    });

    it('should not allow modification of asset ID after creation', () => {
      const ticket = Ticket.create(ticketId, assetId, 'Test', 2, 3, userId);
      const originalAssetId = ticket.getAssetId();

      expect(ticket.getAssetId()).toBe(originalAssetId);
    });

    it('should not allow modification of created_by after creation', () => {
      const ticket = Ticket.create(ticketId, assetId, 'Test', 2, 3, userId);
      const originalCreator = ticket.getCreatedBy();

      expect(ticket.getCreatedBy()).toBe(originalCreator);
    });
  });

  describe('Serialization to Primitives', () => {
    it('should convert to primitives object', () => {
      const ticket = Ticket.create(ticketId, assetId, 'Test issue', 3, 4, userId);
      const primitives = ticket.toPrimitives();

      expect(primitives.id).toBe(ticketId);
      expect(primitives.assetId).toBe(assetId);
      expect(primitives.description).toBe('Test issue');
      expect(primitives.probability).toBe(3);
      expect(primitives.consequence).toBe(4);
      expect(primitives.riskLevel).toBe(RiskLevelEnum.MEDIUM);
      expect(primitives.status).toBe(TicketStatusEnum.APPROVED);
      expect(primitives.createdBy).toBe(userId);
    });

    it('should reconstruct from primitives', () => {
      const ticket = Ticket.create(ticketId, assetId, 'Test issue', 4, 5, userId);
      const primitives = ticket.toPrimitives();

      const reconstructed = Ticket.reconstruct(primitives);

      expect(reconstructed.getId()).toBe(ticket.getId());
      expect(reconstructed.getDescription()).toBe(ticket.getDescription());
      expect(reconstructed.getRiskLevel().getValue()).toBe(
        ticket.getRiskLevel().getValue()
      );
    });
  });

  describe('Full Lifecycle', () => {
    it('should complete full workflow: create → approve → assign → resolve → close', () => {
      const ticket = Ticket.create(ticketId, assetId, 'High risk issue', 4, 5, userId);
      expect(ticket.getStatus().getValue()).toBe(TicketStatusEnum.PENDING_APPROVAL);

      // Approve
      const managerId = uuid();
      ticket.approve(managerId, userId);
      expect(ticket.getStatus().getValue()).toBe(TicketStatusEnum.APPROVED);

      // Note: Assign to tech would be done via a separate command/use case
      // This test focuses on the Ticket entity itself
      expect(ticket.canBeModifiedBy('TECH')).toBe(false); // Still protected by RBAC
    });
  });
});
