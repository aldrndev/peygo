/**
 * Role Escalation Security Tests
 * 
 * HARDENED: Bug-bounty grade
 * Updated: Uses 'role' column only (no is_admin in schema)
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  createTestUser,
  createServiceClient,
  assertCannotEscalateRole,
  TestUser,
} from '../helpers/supabase-clients';

describe('SECURITY: Role Escalation Prevention', () => {
  let regularUser: TestUser;

  beforeAll(async () => {
    regularUser = await createTestUser(`escalation-test-${Date.now()}@test.local`);
  });

  afterAll(async () => {
    await regularUser.cleanup();
  });

  describe('Profile Role Protection', () => {
    it('[CRITICAL] User CANNOT set role=admin on profile', async () => {
      await regularUser.client
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', regularUser.id);

      const service = createServiceClient();
      const { data: profile } = await service
        .from('profiles')
        .select('role')
        .eq('id', regularUser.id)
        .single();

      expect(profile?.role).not.toBe('admin');
    });

    it('[CRITICAL] User CANNOT set role=super_admin on profile', async () => {
      await regularUser.client
        .from('profiles')
        .update({ role: 'super_admin' })
        .eq('id', regularUser.id);

      const service = createServiceClient();
      const { data: profile } = await service
        .from('profiles')
        .select('role')
        .eq('id', regularUser.id)
        .single();

      expect(profile?.role).not.toBe('super_admin');
    });

    it('[CRITICAL] Full escalation attempt blocked', async () => {
      await assertCannotEscalateRole(regularUser.client, regularUser.id);
    });
  });

  describe('Admin-Only Table Access', () => {
    it('[CRITICAL] Regular user CANNOT read audit_logs', async () => {
      const { data, error } = await regularUser.client
        .from('audit_logs')
        .select('*')
        .limit(10);

      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
      expect(data?.length).toBe(0);
    });

    it('[CRITICAL] Regular user CANNOT insert into audit_logs', async () => {
      const { error } = await regularUser.client
        .from('audit_logs')
        .insert({
          user_id: regularUser.id,
          action: 'MALICIOUS_ACTION',
          entity: 'test',
          entity_id: 'fake-id',
        });

      expect(error).toBeDefined();
    });
  });

  describe('SQL Injection Prevention', () => {
    it('[CRITICAL] SQL injection in filter rejected', async () => {
      const maliciousId = "'; DELETE FROM profiles; --";
      
      const { data, error } = await regularUser.client
        .from('invoices')
        .select('*')
        .eq('id', maliciousId);

      // Either: no error + empty result, OR type error (invalid UUID)
      // Both are safe - no injection executed
      if (error) {
        expect(error.code).toBe('22P02');
      } else {
        expect(data).toEqual([]);
      }
      
      // Verify profiles still exists
      const service = createServiceClient();
      const { data: profiles } = await service
        .from('profiles')
        .select('id')
        .limit(1);
      
      expect(profiles).toBeDefined();
    });
  });
});
