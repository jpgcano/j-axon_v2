import assert from 'node:assert/strict';
import test from 'node:test';
import { CreateAsset } from './assets/CreateAsset.js';
import { GetAsset } from './assets/GetAsset.js';
import { ListAssets } from './assets/ListAssets.js';
import { Asset, AssetStatus } from '../domain/assets/Asset.js';
import { CreateTicket } from './tickets/CreateTicket.js';
import { GetTicket } from './tickets/GetTicket.js';
import { ListTickets } from './tickets/ListTickets.js';
import { UpdateTicketStatus } from './tickets/UpdateTicketStatus.js';
import { Ticket, TicketStatus, RiskLevel } from '../domain/tickets/Ticket.js';
import { CreateMaintenance } from './maintenance/CreateMaintenance.js';
import { GetMaintenance } from './maintenance/GetMaintenance.js';
import { ListMaintenance } from './maintenance/ListMaintenance.js';
import { UpdateMaintenanceStatus } from './maintenance/UpdateMaintenanceStatus.js';
import { Maintenance, MaintenanceStatus, MaintenanceType } from '../domain/maintenance/Maintenance.js';
import { RegisterUser } from './users/RegisterUser.js';
import { AuthenticateUser } from './users/AuthenticateUser.js';
import { UserRole } from '../domain/users/User.js';
import { PredictMaintenance } from './ai/PredictMaintenance.js';
import { InternalError, NotFoundError } from '../domain/core/errors.js';

const makeAsset = (id = 'asset-1') => new Asset({ id, description: 'Pump', category: 'MACHINE', status: AssetStatus.ACTIVE, assignedTo: null, createdBy: 'u1', updatedBy: 'u1', createdAt: new Date(), updatedAt: new Date() });
const makeTicket = (id = 'ticket-1') => new Ticket({ id, assetId: 'asset-1', issueDescription: 'Overheating', inherentRiskLevel: RiskLevel.HIGH, status: TicketStatus.OPEN, assignedTechId: null, approvedById: null, createdBy: 'u1', updatedBy: 'u1', createdAt: new Date(), updatedAt: new Date() });
const makeMaintenance = (id = 'mnt-1') => new Maintenance({ id, assetId: 'asset-1', ticketId: null, type: MaintenanceType.PREVENTIVE, description: 'Quarterly check', scheduledDate: new Date(), completedDate: null, status: MaintenanceStatus.SCHEDULED, assignedTechId: 'tech-1', createdBy: 'admin-1', updatedBy: 'admin-1', createdAt: new Date(), updatedAt: new Date() });

test('Assets use cases', async () => {
  const saved: Asset[] = [];
  const repo = { save: async (a: Asset) => void saved.push(a), findById: async (id: string) => (id === 'ok' ? makeAsset('ok') : null), findAll: async () => [makeAsset('a1')] } as any;
  const created = await new CreateAsset(repo).execute({ description: 'Valve', category: 'PIPE', actorId: 'u1' });
  assert.equal(created.toPrimitives().status, AssetStatus.ACTIVE);
  assert.equal(saved.length, 1);
  assert.equal((await new GetAsset(repo).execute('ok')).id, 'ok');
  await assert.rejects(() => new GetAsset(repo).execute('missing'));
  assert.equal((await new ListAssets(repo).execute()).length, 1);
});

test('Tickets use cases', async () => {
  let saved: Ticket | null = null;
  const repo = { save: async (t: Ticket) => { saved = t; }, findById: async (id: string) => (id === 't1' ? makeTicket('t1') : null), findAll: async () => [makeTicket('t1')] } as any;
  const created = await new CreateTicket(repo).execute({ assetId: 'asset-1', issueDescription: 'Noise', actorId: 'u1' });
  assert.equal(created.status, TicketStatus.OPEN);
  assert.equal((await new GetTicket(repo).execute('t1')).id, 't1');
  await assert.rejects(() => new GetTicket(repo).execute('missing'));
  assert.equal((await new ListTickets(repo).execute()).length, 1);
  const updated = await new UpdateTicketStatus(repo).execute({ id: 't1', status: TicketStatus.RESOLVED, actorId: 'u2' });
  assert.equal(updated.status, TicketStatus.RESOLVED);
  assert.ok(saved);
});

test('Maintenance use cases', async () => {
  const ws = { emitEvent: () => undefined } as any;
  const audit = { recordAction: async () => undefined } as any;
  let saved: Maintenance | null = null;
  const repo = { save: async (m: Maintenance) => { saved = m; }, findById: async (id: string) => (id === 'm1' ? makeMaintenance('m1') : null), findAll: async () => [makeMaintenance('m1')] } as any;
  const createResult = await new CreateMaintenance(repo, ws, audit).execute({ assetId: 'asset-1', type: MaintenanceType.CORRECTIVE, description: 'Fix', scheduledDate: new Date(), createdBy: 'admin' });
  createResult.match({ ok: (m) => assert.equal(m.status, MaintenanceStatus.SCHEDULED), err: () => assert.fail() });
  assert.equal((await new GetMaintenance(repo).execute('m1')).id, 'm1');
  await assert.rejects(() => new GetMaintenance(repo).execute('missing'));
  const listResult = await new ListMaintenance(repo).execute();
  listResult.match({ ok: (items) => assert.equal(items.length, 1), err: () => assert.fail() });
  const updateResult = await new UpdateMaintenanceStatus(repo, ws, audit).execute({ id: 'm1', status: MaintenanceStatus.COMPLETED, actorId: 'tech-1' });
  updateResult.match({ ok: (m) => assert.equal(m.status, MaintenanceStatus.COMPLETED), err: () => assert.fail() });
  const missing = await new UpdateMaintenanceStatus(repo, ws, audit).execute({ id: 'x', status: MaintenanceStatus.CANCELLED, actorId: 'tech-1' });
  missing.match({ ok: () => assert.fail(), err: (error) => assert.ok(error instanceof NotFoundError) });
  assert.ok(saved);
  const failingRepo = { findAll: async () => { throw new Error('db down'); } } as any;
  const fail = await new ListMaintenance(failingRepo).execute();
  fail.match({ ok: () => assert.fail(), err: (error) => assert.ok(error instanceof InternalError) });
});

test('Users and AI use cases', async () => {
  const users = new Map<string, any>();
  const userRepository = { findByEmail: async (email: string) => users.get(email) || null, save: async (user: any) => users.set(user.email, user.toPrimitives()) } as any;
  const passwordHasher = { hash: async (plain: string) => `hashed:${plain}`, compare: async (plain: string, hash: string) => hash === `hashed:${plain}` } as any;
  const tokenService = { generateToken: async ({ userId }: { userId: string }) => ({ accessToken: userId, refreshToken: 'refresh' }) } as any;
  const register = new RegisterUser(userRepository, passwordHasher);
  await register.execute({ id: 'u1', email: 'qa@example.com', passwordPlain: 'Secret', role: UserRole.ADMIN, systemIp: '127.0.0.1' });
  await assert.rejects(() => register.execute({ id: 'u2', email: 'qa@example.com', passwordPlain: 'x', role: UserRole.TECH, systemIp: '127.0.0.1' }));
  const auth = new AuthenticateUser(userRepository, passwordHasher, tokenService);
  assert.equal((await auth.execute({ email: 'qa@example.com', passwordPlain: 'Secret' })).refreshToken, 'refresh');
  await assert.rejects(() => auth.execute({ email: 'qa@example.com', passwordPlain: 'bad' }));

  const aiClient = { getPrediction: async () => ({ prediction: 'ok' }) } as any;
  const ai = new PredictMaintenance({ findById: async (id: string) => (id === 'a1' ? makeAsset('a1') : null) } as any, { findById: async () => makeTicket('t1') } as any, aiClient);
  const ok = await ai.execute({ assetId: 'a1', ticketId: 't1' });
  ok.match({ ok: (payload: any) => assert.equal(payload.prediction, 'ok'), err: () => assert.fail() });
  const nf = await ai.execute({ assetId: 'missing' });
  nf.match({ ok: () => assert.fail(), err: (error) => assert.ok(error instanceof NotFoundError) });
});
