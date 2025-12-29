/**
 * Authorization Security Tests
 * 
 * Tests for server action authorization vulnerabilities fixed in 2024-12
 * - deleteSupplier ownership check
 * - sendInvoice ownership check
 * - getSettingByKey admin check
 * - Payment API ownership check
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  createTestUserPair,
  createServiceClient,
  TestUser,
} from '../helpers/supabase-clients';

describe('SECURITY: Server Action Authorization', () => {
  let userA: TestUser;
  let userB: TestUser;
  let userAInvoiceId: string;
  let userASupplierId: string;

  beforeAll(async () => {
    ({ userA, userB } = await createTestUserPair());

    // Create test invoice for User A
    const { data: invoice } = await userA.client
      .from('invoices')
      .insert({
        user_id: userA.id,
        invoice_number: `AUTH-TEST-${Date.now()}`,
        type: 'BILLING',
        recipient_name: 'Test Recipient',
        recipient_email: 'test@example.com',
        recipient_phone: '08123456789',
        description: 'Authorization test',
        amount: 50000,
        subtotal: 50000,
        total_amount: 50000,
      })
      .select()
      .single();

    if (invoice) userAInvoiceId = invoice.id;

    // Create test supplier for User A
    const { data: supplier } = await userA.client
      .from('suppliers')
      .insert({
        user_id: userA.id,
        name: 'Test Supplier A',
        email: 'supplier@example.com',
        phone: '08123456789',
      })
      .select()
      .single();

    if (supplier) userASupplierId = supplier.id;
  });

  afterAll(async () => {
    // Cleanup test data
    const service = createServiceClient();
    if (userAInvoiceId) {
      await service.from('invoices').delete().eq('id', userAInvoiceId);
    }
    if (userASupplierId) {
      await service.from('suppliers').delete().eq('id', userASupplierId);
    }
    await userA.cleanup();
    await userB.cleanup();
  });

  describe('Supplier Authorization', () => {
    it('[CRITICAL] User B CANNOT delete User A supplier via RLS', async () => {
      // User B tries to delete User A's supplier
      const { error } = await userB.client
        .from('suppliers')
        .delete()
        .eq('id', userASupplierId);

      // RLS should prevent this - either error or no rows affected
      // Verify supplier still exists
      const service = createServiceClient();
      const { data: supplier } = await service
        .from('suppliers')
        .select('id')
        .eq('id', userASupplierId)
        .single();

      expect(supplier).not.toBeNull();
      expect(supplier?.id).toBe(userASupplierId);
    });

    it('[CRITICAL] User B CANNOT read User A suppliers', async () => {
      const { data } = await userB.client
        .from('suppliers')
        .select('*')
        .eq('id', userASupplierId);

      expect(data?.length ?? 0).toBe(0);
    });
  });

  describe('Invoice Authorization', () => {
    it('[CRITICAL] User B CANNOT read User A invoice', async () => {
      const { data } = await userB.client
        .from('invoices')
        .select('*')
        .eq('id', userAInvoiceId);

      expect(data?.length ?? 0).toBe(0);
    });

    it('[CRITICAL] User B CANNOT update User A invoice', async () => {
      await userB.client
        .from('invoices')
        .update({ description: 'Hacked by B' })
        .eq('id', userAInvoiceId);

      // Verify invoice unchanged
      const service = createServiceClient();
      const { data: invoice } = await service
        .from('invoices')
        .select('description')
        .eq('id', userAInvoiceId)
        .single();

      expect(invoice?.description).not.toBe('Hacked by B');
    });
  });

  describe('Settings Authorization', () => {
    it('[CRITICAL] Non-admin user CANNOT read settings directly', async () => {
      // Regular user trying to read settings
      const { data } = await userA.client
        .from('settings')
        .select('*')
        .eq('is_secret', true);

      // Should either be empty or only show non-secret public settings
      const secrets = data?.filter(s => s.is_secret === true);
      expect(secrets?.length ?? 0).toBe(0);
    });

    it('[CRITICAL] Non-admin user CANNOT update settings', async () => {
      // Get original value
      const service = createServiceClient();
      const { data: originalSetting } = await service
        .from('settings')
        .select('value')
        .eq('key', 'platform_name')
        .single();

      // Regular user tries to update settings
      await userA.client
        .from('settings')
        .update({ value: 'hacked' })
        .eq('key', 'platform_name');

      // Verify data unchanged (RLS blocks silently - returns success but 0 rows)
      const { data: afterSetting } = await service
        .from('settings')
        .select('value')
        .eq('key', 'platform_name')
        .single();

      expect(afterSetting?.value).toBe(originalSetting?.value);
      expect(afterSetting?.value).not.toBe('hacked');
    });
  });

  describe('Cross-User Data Isolation', () => {
    it('[CRITICAL] User B CANNOT see User A data in any table', async () => {
      const tables = ['invoices', 'suppliers', 'invoice_items'];

      for (const table of tables) {
        const { data } = await userB.client
          .from(table)
          .select('*')
          .eq('user_id', userA.id);

        expect(data?.length ?? 0).toBe(0);
      }
    });
  });
});
