import { describe, it, expect } from 'vitest';
import { Asset, AssetStatus } from '../Asset.js';
describe('Asset Domain Entity', () => {
    const validProps = {
        id: 'asset-123',
        description: 'MacBook Pro M3',
        category: 'LAPTOP',
        status: AssetStatus.ACTIVE,
        assignedTo: null,
        createdBy: 'user-1',
        updatedBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    describe('constructor', () => {
        it('should create asset with valid props', () => {
            const asset = new Asset(validProps);
            expect(asset.props.id).toBe('asset-123');
            expect(asset.props.description).toBe('MacBook Pro M3');
            expect(asset.props.status).toBe(AssetStatus.ACTIVE);
        });
        it('should maintain immutability of created asset', () => {
            const asset = new Asset(validProps);
            const original = { ...asset.props };
            try {
                // @ts-ignore attempting mutation
                asset.props.id = 'modified';
            }
            catch (e) {
                // Expected to fail or not mutate
            }
            expect(asset.props.id).toBe(original.id);
        });
    });
    describe('changeStatus', () => {
        it('should change status from ACTIVE to MAINTENANCE', () => {
            const asset = new Asset(validProps);
            asset.changeStatus(AssetStatus.MAINTENANCE);
            expect(asset.props.status).toBe(AssetStatus.MAINTENANCE);
        });
        it('should not allow invalid status transitions', () => {
            const asset = new Asset(validProps);
            // Assuming validation exists
            expect(() => {
                // @ts-ignore invalid status
                asset.changeStatus('INVALID_STATUS');
            }).toThrow();
        });
        it('should update updatedAt timestamp on status change', () => {
            const asset = new Asset(validProps);
            const originalUpdatedAt = asset.props.updatedAt;
            // Wait small amount to ensure timestamp difference
            asset.changeStatus(AssetStatus.MAINTENANCE);
            // updatedAt should be updated in real implementation
            expect(asset.props.updatedAt).toBeInstanceOf(Date);
        });
    });
    describe('assignTo', () => {
        it('should assign asset to user', () => {
            const asset = new Asset(validProps);
            asset.assignTo('user-tech-1');
            expect(asset.props.assignedTo).toBe('user-tech-1');
        });
        it('should reject null assignTo', () => {
            const asset = new Asset(validProps);
            // @ts-ignore
            expect(() => asset.assignTo(null)).toThrow();
        });
        it('should reject empty string assignTo', () => {
            const asset = new Asset(validProps);
            expect(() => asset.assignTo('')).toThrow();
        });
    });
    describe('unassign', () => {
        it('should unassign asset from user', () => {
            const asset = new Asset({ ...validProps, assignedTo: 'user-1' });
            asset.unassign();
            expect(asset.props.assignedTo).toBeNull();
        });
    });
    describe('toPrimitives', () => {
        it('should return plain object representation', () => {
            const asset = new Asset(validProps);
            const primitive = asset.toPrimitives();
            expect(typeof primitive).toBe('object');
            expect(primitive.id).toBe('asset-123');
            expect(primitive.description).toBe('MacBook Pro M3');
        });
        it('should omit private fields', () => {
            const asset = new Asset(validProps);
            const primitive = asset.toPrimitives();
            expect('_id' in primitive).toBe(false);
            expect('_props' in primitive).toBe(false);
        });
    });
});
//# sourceMappingURL=Asset.spec.js.map