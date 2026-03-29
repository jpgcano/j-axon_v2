import { describe, it, expect, vi } from 'vitest';
import { ListMaintenance } from '../ListMaintenance.js';

describe('ListMaintenance', () => {
  it('should list all maintenance records', async () => {
    const maintenanceMock = [{ toPrimitives: () => ({ id: 'm1' }) }];
    const maintenanceRepository = { findAll: vi.fn().mockResolvedValue(maintenanceMock) } as any;
    const listMaintenance = new ListMaintenance(maintenanceRepository);

    const result = await listMaintenance.execute();
    const maintenances = result.unwrap();

    expect(maintenances).toHaveLength(1);
    expect(maintenanceRepository.findAll).toHaveBeenCalled();
  });
});
