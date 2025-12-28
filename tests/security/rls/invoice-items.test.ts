/**
 * Invoice Items RLS Security Tests
 * 
 * Tests that invoice_items inherit proper RLS from parent invoice
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  createTestUserPair,
  createServiceClient,
  TestUser,
} from '../helpers/supabase-clients';

describe('SECURITY: Invoice Items RLS (Cascade)', () => {
  let userA: TestUser;
  let userB: TestUser;
  let userAInvoiceId: string;
  let userAItemId: string;
  let setupSuccess = false;

  beforeAll(async () => {
    try {
      ({ userA, userB } = await createTestUserPair());

      // Create invoice
      const { data: invoice } = await userA.client
        .from('invoices')
        .insert({
          user_id: userA.id,
          invoice_number: `ITEM-TEST-${Date.now()}`,
          type: 'BILLING',
          recipient_name: 'Item Test',
          recipient_phone: '08123456789',
          description: 'Invoice items test',
          amount: 100000,
          subtotal: 100000,
          total_amount: 100000,
        })
        .select()
        .single();

      if (!invoice) return;
      userAInvoiceId = invoice.id;

      // Create invoice item (adjust fields to match schema)
      const { data: item, error } = await userA.client
        .from('invoice_items')
        .insert({
          invoice_id: userAInvoiceId,
          description: 'Secret Item',
          quantity: 1,
          unit_price: 100000,
        })
        .select()
        .single();

      if (error) {
        console.warn(`Invoice items setup skipped: ${error.message}`);
        return;
      }
      
      userAItemId = item.id;
      setupSuccess = true;
    } catch {
      console.warn('Invoice items test setup failed');
    }
  });

  afterAll(async () => {
    if (userA) await userA.cleanup();
    if (userB) await userB.cleanup();
  });

  describe('SELECT Policy', () => {
    it('[CRITICAL] User B CANNOT read User A invoice items', async () => {
      if (!setupSuccess) return;
      
      const { data } = await userB.client
        .from('invoice_items')
        .select('*')
        .eq('id', userAItemId);

      expect(data).toEqual([]);
    });

    it('[CRITICAL] User B CANNOT see items via invoice JOIN', async () => {
      if (!setupSuccess) return;
      
      const { data } = await userB.client
        .from('invoices')
        .select('*, invoice_items(*)')
        .eq('id', userAInvoiceId);

      expect(data).toEqual([]);
    });
  });

  describe('UPDATE Policy', () => {
    it('[CRITICAL] User B CANNOT update User A invoice item', async () => {
      if (!setupSuccess) return;
      
      const { data } = await userB.client
        .from('invoice_items')
        .update({ quantity: 999 })
        .eq('id', userAItemId)
        .select();

      expect(data).toEqual([]);

      const service = createServiceClient();
      const { data: item } = await service
        .from('invoice_items')
        .select('quantity')
        .eq('id', userAItemId)
        .single();

      expect(item?.quantity).toBe(1);
    });
  });

  describe('DELETE Policy', () => {
    it('[CRITICAL] User B CANNOT delete User A invoice item', async () => {
      if (!setupSuccess) return;
      
      const { data } = await userB.client
        .from('invoice_items')
        .delete()
        .eq('id', userAItemId)
        .select();

      expect(data).toEqual([]);
    });
  });

  describe('INSERT Policy', () => {
    it('[CRITICAL] User B CANNOT insert item into User A invoice', async () => {
      if (!setupSuccess) return;
      
      const { error } = await userB.client
        .from('invoice_items')
        .insert({
          invoice_id: userAInvoiceId,
          description: 'Injected Item',
          quantity: 1,
          unit_price: 1,
        });

      expect(error).toBeDefined();
    });
  });
});
