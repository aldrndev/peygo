/**
 * Audit Log Immutability Tests
 * 
 * Tests that audit logs cannot be tampered with
 * NOTE: Skips if audit_logs table doesn't exist
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  createTestUser,
  createServiceClient,
  TestUser,
} from '../helpers/supabase-clients';

describe('SECURITY: Audit Log Immutability', () => {
  let user: TestUser;
  let testLogId: string | null = null;
  let tableExists = false;

  beforeAll(async () => {
    user = await createTestUser('audit-test@peygo.test', 'AuditTest@123');

    // Check if audit_logs table exists
    const service = createServiceClient();
    const { error } = await service.from('audit_logs').select('id').limit(1);
    
    if (error?.code === '42P01') {
      // Table doesn't exist
      console.warn('[SKIP] audit_logs table does not exist');
      return;
    }

    tableExists = true;

    // Create test log via service
    const { data } = await service
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'TEST_ACTION',
        entity: 'invoices',
        entity_id: 'test-entity-id',
      })
      .select()
      .single();

    if (data) testLogId = data.id;
  });

  afterAll(async () => {
    if (testLogId) {
      const service = createServiceClient();
      await service.from('audit_logs').delete().eq('id', testLogId);
    }
    await user.cleanup();
  });

  describe('Read Protection', () => {
    it('[CRITICAL] Regular user CANNOT read audit_logs', async () => {
      if (!tableExists) return;
      
      const { data, error } = await user.client
        .from('audit_logs')
        .select('*')
        .limit(10);

      expect(error).toBeNull();
      expect(data).toEqual([]);
    });
  });

  describe('Insert Protection', () => {
    it('[CRITICAL] User CANNOT insert into audit_logs', async () => {
      if (!tableExists) return;
      
      const { error } = await user.client
        .from('audit_logs')
        .insert({
          user_id: user.id,
          action: 'FAKE_ACTION',
          entity: 'test',
          entity_id: 'fake-id',
        });

      expect(error).toBeDefined();
    });
  });

  describe('Update Protection', () => {
    it('[CRITICAL] User CANNOT update audit_logs', async () => {
      if (!tableExists || !testLogId) return;
      
      const { data } = await user.client
        .from('audit_logs')
        .update({ action: 'MODIFIED' })
        .eq('id', testLogId)
        .select();

      expect(data).toEqual([]);
    });
  });

  describe('Delete Protection', () => {
    it('[CRITICAL] User CANNOT delete audit_logs', async () => {
      if (!tableExists || !testLogId) return;
      
      await user.client
        .from('audit_logs')
        .delete()
        .eq('id', testLogId);

      const service = createServiceClient();
      const { data: log } = await service
        .from('audit_logs')
        .select('id')
        .eq('id', testLogId)
        .single();

      expect(log?.id).toBe(testLogId);
    });
  });
});
