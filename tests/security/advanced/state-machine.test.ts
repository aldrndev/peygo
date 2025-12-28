/**
 * State Machine Validation Tests
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  createTestUser,
  createServiceClient,
  TestUser,
} from '../helpers/supabase-clients';

describe('SECURITY: State Machine Validation', () => {
  let user: TestUser;
  let invoiceId: string;

  beforeAll(async () => {
    user = await createTestUser('state-test@peygo.test', 'StateTest@123');

    const { data } = await user.client
      .from('invoices')
      .insert({
        user_id: user.id,
        invoice_number: `STATE-${Date.now()}`,
        type: 'BILLING',
        status: 'DRAFT',
        recipient_name: 'State Test',
        recipient_phone: '08123456789',
        description: 'State machine test',
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

  describe('Status Protection via RLS', () => {
    it('[CRITICAL] User CANNOT change status DRAFT → PAID', async () => {
      const service = createServiceClient();
      await service.from('invoices').update({ status: 'DRAFT' }).eq('id', invoiceId);

      await user.client
        .from('invoices')
        .update({ status: 'PAID' })
        .eq('id', invoiceId);

      const { data } = await service
        .from('invoices')
        .select('status')
        .eq('id', invoiceId)
        .single();

      expect(data?.status).toBe('DRAFT');
    });

    it('[CRITICAL] User CANNOT change status DRAFT → CANCELLED', async () => {
      const service = createServiceClient();
      await service.from('invoices').update({ status: 'DRAFT' }).eq('id', invoiceId);

      await user.client
        .from('invoices')
        .update({ status: 'CANCELLED' })
        .eq('id', invoiceId);

      const { data } = await service
        .from('invoices')
        .select('status')
        .eq('id', invoiceId)
        .single();

      expect(data?.status).toBe('DRAFT');
    });

    it('[CRITICAL] User CANNOT revert PAID → DRAFT', async () => {
      const service = createServiceClient();
      await service.from('invoices').update({ status: 'PAID' }).eq('id', invoiceId);

      await user.client
        .from('invoices')
        .update({ status: 'DRAFT' })
        .eq('id', invoiceId);

      const { data } = await service
        .from('invoices')
        .select('status')
        .eq('id', invoiceId)
        .single();

      expect(data?.status).toBe('PAID');

      // Reset
      await service.from('invoices').update({ status: 'DRAFT' }).eq('id', invoiceId);
    });
  });
});
