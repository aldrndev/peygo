/**
 * Edge Case Security Tests
 * 
 * Tests advanced attack vectors
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  createTestUserPair,
  createServiceClient,
  createAnonClient,
  TestUser,
} from '../helpers/supabase-clients';

describe('SECURITY: Edge Cases & Advanced Attacks', () => {
  let userA: TestUser;
  let userB: TestUser;
  let testInvoiceId: string;

  beforeAll(async () => {
    ({ userA, userB } = await createTestUserPair());

    const { data } = await userA.client
      .from('invoices')
      .insert({
        user_id: userA.id,
        invoice_number: `EDGE-${Date.now()}`,
        type: 'BILLING',
        recipient_name: 'Edge Test',
        recipient_phone: '08123456789',
        description: 'Edge case testing',
        amount: 100000,
        subtotal: 100000,
        total_amount: 100000,
      })
      .select()
      .single();

    if (data) testInvoiceId = data.id;
  });

  afterAll(async () => {
    await userA.cleanup();
    await userB.cleanup();
  });

  describe('Anonymous Access', () => {
    it('[CRITICAL] Anonymous user CANNOT read invoices', async () => {
      const anon = createAnonClient();
      const { data } = await anon.from('invoices').select('*').limit(10);
      expect(data).toEqual([]);
    });

    it('[CRITICAL] Anonymous user CANNOT read profiles', async () => {
      const anon = createAnonClient();
      const { data } = await anon.from('profiles').select('*').limit(10);
      expect(data).toEqual([]);
    });

    it('[CRITICAL] Anonymous user CANNOT read suppliers', async () => {
      const anon = createAnonClient();
      const { data } = await anon.from('suppliers').select('*').limit(10);
      expect(data).toEqual([]);
    });
  });

  describe('Bulk Operations', () => {
    it('[CRITICAL] User B CANNOT bulk update User A invoices', async () => {
      await userB.client
        .from('invoices')
        .update({ description: 'Bulk hacked' })
        .eq('user_id', userA.id);

      const service = createServiceClient();
      const { data: invoice } = await service
        .from('invoices')
        .select('description')
        .eq('id', testInvoiceId)
        .single();

      expect(invoice?.description).not.toBe('Bulk hacked');
    });
  });

  describe('ID Enumeration Prevention', () => {
    it('[CRITICAL] Sequential UUID probe returns empty', async () => {
      const fakeIds = [
        '00000000-0000-0000-0000-000000000001',
        '11111111-1111-1111-1111-111111111111',
      ];

      for (const fakeId of fakeIds) {
        const { data } = await userB.client
          .from('invoices')
          .select('*')
          .eq('id', fakeId);

        expect(data).toEqual([]);
      }
    });
  });

  describe('Filter Bypass Attempts', () => {
    it('[CRITICAL] OR filter cannot bypass RLS', async () => {
      const { data } = await userB.client
        .from('invoices')
        .select('*')
        .or(`user_id.eq.${userA.id},user_id.eq.${userB.id}`);

      const leaked = data?.filter(inv => inv.user_id === userA.id);
      expect(leaked?.length ?? 0).toBe(0);
    });

    it('[CRITICAL] NOT filter cannot bypass RLS', async () => {
      const { data } = await userB.client
        .from('invoices')
        .select('*')
        .not('user_id', 'eq', userB.id);

      expect(data).toEqual([]);
    });

    it('[CRITICAL] IN filter cannot bypass RLS', async () => {
      const { data } = await userB.client
        .from('invoices')
        .select('*')
        .in('user_id', [userA.id, userB.id]);

      const leaked = data?.filter(inv => inv.user_id === userA.id);
      expect(leaked?.length ?? 0).toBe(0);
    });
  });

  describe('Timestamp Manipulation', () => {
    it('[CRITICAL] User CANNOT backdate created_at', async () => {
      await userA.client
        .from('invoices')
        .update({ created_at: '2020-01-01T00:00:00Z' })
        .eq('id', testInvoiceId);

      const service = createServiceClient();
      const { data: invoice } = await service
        .from('invoices')
        .select('created_at')
        .eq('id', testInvoiceId)
        .single();

      const createdYear = new Date(invoice?.created_at).getFullYear();
      expect(createdYear).not.toBe(2020);
    });
  });
});
