/**
 * JOIN & Foreign Key Leakage Tests
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  createTestUserPair,
  createServiceClient,
  TestUser,
} from '../helpers/supabase-clients';

describe('SECURITY: JOIN & FK Leakage Prevention', () => {
  let userA: TestUser;
  let userB: TestUser;
  let userAInvoiceId: string;

  beforeAll(async () => {
    ({ userA, userB } = await createTestUserPair());

    const { data: invoice } = await userA.client
      .from('invoices')
      .insert({
        user_id: userA.id,
        invoice_number: `JOIN-${Date.now()}`,
        type: 'BILLING',
        recipient_name: 'Secret Corp',
        recipient_phone: '08123456789',
        description: 'Secret invoice',
        amount: 100000,
        subtotal: 100000,
        total_amount: 100000,
      })
      .select()
      .single();

    if (invoice) userAInvoiceId = invoice.id;
  });

  afterAll(async () => {
    await userA.cleanup();
    await userB.cleanup();
  });

  describe('Invoice Data Protection', () => {
    it('[CRITICAL] User B cannot see User A invoice data', async () => {
      const { data } = await userB.client
        .from('invoices')
        .select('*')
        .eq('id', userAInvoiceId);

      expect(data).toEqual([]);
    });
  });

  describe('Profile Data Leakage', () => {
    it('[CRITICAL] User B cannot see other profiles', async () => {
      const { data } = await userB.client
        .from('profiles')
        .select('id, full_name')
        .neq('id', userB.id);

      // Should be empty or null (depends on RLS)
      expect(data?.length ?? 0).toBe(0);
    });

    it('[CRITICAL] User B can only see own profile', async () => {
      const { data } = await userB.client
        .from('profiles')
        .select('id');

      // Should only contain own profile
      const foreign = data?.filter(p => p.id !== userB.id);
      expect(foreign?.length ?? 0).toBe(0);
    });
  });

  describe('Aggregate Leakage', () => {
    it('[CRITICAL] User B cannot count User A invoices', async () => {
      const { count } = await userB.client
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userA.id);

      expect(count).toBe(0);
    });
  });

  describe('IN Query Leakage', () => {
    it('[CRITICAL] User B cannot access via IN query', async () => {
      const { data } = await userB.client
        .from('invoices')
        .select('*')
        .in('id', [userAInvoiceId]);

      expect(data).toEqual([]);
    });
  });
});
