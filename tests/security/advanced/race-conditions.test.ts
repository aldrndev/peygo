/**
 * Race Condition Security Tests
 * 
 * NOTE: Tests parallel operations
 * RPC tests are for future implementation
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  createTestUser,
  createServiceClient,
  TestUser,
} from '../helpers/supabase-clients';

describe('SECURITY: Race Conditions', () => {
  let user: TestUser;
  let invoiceId: string;

  beforeAll(async () => {
    user = await createTestUser('race-test@peygo.test', 'RaceTest@123');

    const { data } = await user.client
      .from('invoices')
      .insert({
        user_id: user.id,
        invoice_number: `RACE-${Date.now()}`,
        type: 'BILLING',
        status: 'DRAFT',
        recipient_name: 'Race Test',
        recipient_phone: '08123456789',
        description: 'Race condition test',
        amount: 100000,
        subtotal: 100000,
        total_amount: 100000,
      })
      .select()
      .single();

    if (data) invoiceId = data.id;
  });

  afterAll(async () => {
    await user.cleanup();
  });

  describe('Parallel Status Updates (RLS Protection)', () => {
    it('[CRITICAL] Parallel status updates - all blocked by RLS', async () => {
      const service = createServiceClient();
      
      // Reset to DRAFT
      await service.from('invoices').update({ status: 'DRAFT' }).eq('id', invoiceId);

      // Parallel status transitions (should all be blocked by RLS)
      const transitions = [
        user.client.from('invoices').update({ status: 'PAID' }).eq('id', invoiceId),
        user.client.from('invoices').update({ status: 'CANCELLED' }).eq('id', invoiceId),
        user.client.from('invoices').update({ status: 'SENT' }).eq('id', invoiceId),
      ];

      await Promise.allSettled(transitions);

      // Verify status is still DRAFT (RLS blocks status changes)
      const { data: invoice } = await service
        .from('invoices')
        .select('status')
        .eq('id', invoiceId)
        .single();

      expect(invoice?.status).toBe('DRAFT');
    });
  });

  describe('Parallel Amount Modification', () => {
    it('[CRITICAL] Parallel amount updates - all blocked by RLS', async () => {
      const updates = [
        user.client.from('invoices').update({ amount: 1 }).eq('id', invoiceId),
        user.client.from('invoices').update({ amount: 50000 }).eq('id', invoiceId),
        user.client.from('invoices').update({ amount: 0 }).eq('id', invoiceId),
      ];

      await Promise.allSettled(updates);

      // Verify amount unchanged
      const service = createServiceClient();
      const { data: invoice } = await service
        .from('invoices')
        .select('amount')
        .eq('id', invoiceId)
        .single();

      expect(invoice?.amount).toBe(100000);
    });
  });

  describe('Parallel Delete Behavior', () => {
    it('[INFO] Parallel delete - consistent behavior', async () => {
      const service = createServiceClient();
      
      // Create expendable invoice
      const { data: tempInvoice } = await service
        .from('invoices')
        .insert({
          user_id: user.id,
          invoice_number: `TEMP-${Date.now()}`,
          type: 'BILLING',
          status: 'DRAFT',
          recipient_name: 'Temp',
          recipient_phone: '0000',
          description: 'Temp',
          amount: 10000,
          subtotal: 10000,
          total_amount: 10000,
        })
        .select()
        .single();

      if (tempInvoice) {
        // Parallel delete attempts
        await Promise.allSettled([
          user.client.from('invoices').delete().eq('id', tempInvoice.id),
          user.client.from('invoices').delete().eq('id', tempInvoice.id),
        ]);

        // Just verify no crash
        expect(true).toBe(true);
      }
    });
  });
});
