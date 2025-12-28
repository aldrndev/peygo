/**
 * Admin Business Logic Tests
 * 
 * Tests admin-only operations and access control
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  createTestUser,
  createServiceClient,
  TestUser,
} from '../security/helpers/supabase-clients';

describe('BUSINESS LOGIC: Admin Operations', () => {
  let adminUser: TestUser;
  let regularUser: TestUser;

  beforeAll(async () => {
    // Create users
    adminUser = await createTestUser('admin-biztest@peygo.test', 'AdminBiz@123');
    regularUser = await createTestUser('regular-biztest@peygo.test', 'RegularBiz@123');

    // Promote to admin via service role
    const service = createServiceClient();
    await service
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', adminUser.id);
  });

  afterAll(async () => {
    const service = createServiceClient();
    // Reset role before cleanup
    await service.from('profiles').update({ role: 'user' }).eq('id', adminUser.id);
    await adminUser.cleanup();
    await regularUser.cleanup();
  });

  // ============================================================
  // ADMIN ACCESS CONTROL
  // ============================================================

  describe('Admin Role Check', () => {
    it('Admin user has role=admin in database', async () => {
      const service = createServiceClient();
      const { data } = await service
        .from('profiles')
        .select('role')
        .eq('id', adminUser.id)
        .single();

      expect(data?.role).toBe('admin');
    });

    it('Regular user has role=user', async () => {
      const service = createServiceClient();
      const { data } = await service
        .from('profiles')
        .select('role')
        .eq('id', regularUser.id)
        .single();

      expect(data?.role).toBe('user');
    });
  });

  // ============================================================
  // ADMIN DATA ACCESS
  // ============================================================

  describe('Admin Data Access (via RLS)', () => {
    it('Admin CAN only see own invoices (same RLS as user)', async () => {
      // Create invoice as regular user
      const { data: regularInvoice } = await regularUser.client
        .from('invoices')
        .insert({
          user_id: regularUser.id,
          invoice_number: `REG-${Date.now()}`,
          type: 'BILLING',
          recipient_name: 'Regular Customer',
          recipient_phone: '08123456789',
          description: 'Regular invoice',
          amount: 100000,
          subtotal: 100000,
          total_amount: 100000,
        })
        .select()
        .single();

      // Admin tries to read regular user's invoice via client
      if (regularInvoice) {
        const { data } = await adminUser.client
          .from('invoices')
          .select('*')
          .eq('id', regularInvoice.id);

        // RLS still applies to admin via client
        // Admin dashboard uses server-side with service role
        expect(data).toEqual([]);
      }
    });
  });

  // ============================================================
  // ADMIN STATISTICS (Server-Side Only)
  // ============================================================

  describe('Admin Statistics (Service Role)', () => {
    it('Service role CAN count all users', async () => {
      const service = createServiceClient();
      const { count, error } = await service
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      expect(error).toBeNull();
      expect(count).toBeGreaterThan(0);
    });

    it('Service role CAN count all invoices', async () => {
      const service = createServiceClient();
      const { count, error } = await service
        .from('invoices')
        .select('*', { count: 'exact', head: true });

      expect(error).toBeNull();
      expect(typeof count).toBe('number');
    });

    it('Service role CAN aggregate revenue', async () => {
      const service = createServiceClient();
      const { data, error } = await service
        .from('invoices')
        .select('total_amount, platform_fee');

      expect(error).toBeNull();
      
      const totalRevenue = data?.reduce((acc: number, i: { total_amount?: number }) => acc + (i.total_amount || 0), 0) || 0;
      expect(typeof totalRevenue).toBe('number');

      const totalFees = data?.reduce((acc: number, i: { platform_fee?: number }) => acc + (i.platform_fee || 0), 0) || 0;
      expect(typeof totalFees).toBe('number');
    });

    it('Service role CAN filter invoices by status', async () => {
      const service = createServiceClient();
      
      const { data: paid } = await service
        .from('invoices')
        .select('id')
        .in('status', ['PAID', 'DISBURSED']);

      const { data: pending } = await service
        .from('invoices')
        .select('id')
        .in('status', ['DRAFT', 'SENT']);

      expect(Array.isArray(paid)).toBe(true);
      expect(Array.isArray(pending)).toBe(true);
    });

    it('Service role CAN count users by role', async () => {
      const service = createServiceClient();
      
      const { data: users } = await service
        .from('profiles')
        .select('id')
        .eq('role', 'user');

      const { data: admins } = await service
        .from('profiles')
        .select('id')
        .eq('role', 'admin');

      expect(Array.isArray(users)).toBe(true);
      expect(Array.isArray(admins)).toBe(true);
    });
  });

  // ============================================================
  // ADMIN CANNOT BYPASS CLIENT RLS
  // ============================================================

  describe('Admin Client-Side Restrictions', () => {
    it('Admin CANNOT read other user profiles via client', async () => {
      const { data } = await adminUser.client
        .from('profiles')
        .select('*')
        .eq('id', regularUser.id);

      // RLS blocks even admin from reading other profiles via client
      expect(data).toEqual([]);
    });

    it('Admin CANNOT update other user invoices via client', async () => {
      const service = createServiceClient();
      
      // Create regular user invoice
      const { data: invoice } = await service
        .from('invoices')
        .insert({
          user_id: regularUser.id,
          invoice_number: `ADMIN-TEST-${Date.now()}`,
          type: 'BILLING',
          recipient_name: 'Test',
          recipient_phone: '08123456789',
          description: 'Test',
          amount: 100000,
          subtotal: 100000,
          total_amount: 100000,
        })
        .select()
        .single();

      if (invoice) {
        // Admin tries to update via client
        const { data } = await adminUser.client
          .from('invoices')
          .update({ description: 'Admin Modified' })
          .eq('id', invoice.id)
          .select();

        expect(data).toEqual([]);

        // Cleanup
        await service.from('invoices').delete().eq('id', invoice.id);
      }
    });

    it('Admin CANNOT delete other user invoices via client', async () => {
      const service = createServiceClient();
      
      const { data: invoice } = await service
        .from('invoices')
        .insert({
          user_id: regularUser.id,
          invoice_number: `DEL-TEST-${Date.now()}`,
          type: 'BILLING',
          recipient_name: 'Test',
          recipient_phone: '08123456789',
          description: 'Test',
          amount: 100000,
          subtotal: 100000,
          total_amount: 100000,
        })
        .select()
        .single();

      if (invoice) {
        // Admin tries to delete via client
        await adminUser.client
          .from('invoices')
          .delete()
          .eq('id', invoice.id);

        // Verify still exists
        const { data: check } = await service
          .from('invoices')
          .select('id')
          .eq('id', invoice.id)
          .single();

        expect(check?.id).toBe(invoice.id);

        // Cleanup
        await service.from('invoices').delete().eq('id', invoice.id);
      }
    });
  });

  // ============================================================
  // ADMIN ROLE ASSIGNMENT (Service Role Only)
  // ============================================================

  describe('Admin Role Assignment', () => {
    it('Service role CAN change user role to admin', async () => {
      const service = createServiceClient();
      
      // Create temp user
      const tempUser = await createTestUser(`temp-admin-${Date.now()}@peygo.test`, 'TempAdmin@123');

      // Promote to admin
      const { error } = await service
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', tempUser.id);

      expect(error).toBeNull();

      // Verify
      const { data } = await service
        .from('profiles')
        .select('role')
        .eq('id', tempUser.id)
        .single();

      expect(data?.role).toBe('admin');

      // Reset and cleanup
      await service.from('profiles').update({ role: 'user' }).eq('id', tempUser.id);
      await tempUser.cleanup();
    });

    it('Service role CAN demote admin to user', async () => {
      const service = createServiceClient();
      
      const tempUser = await createTestUser(`temp-demote-${Date.now()}@peygo.test`, 'TempDemote@123');

      // Promote then demote
      await service.from('profiles').update({ role: 'admin' }).eq('id', tempUser.id);
      await service.from('profiles').update({ role: 'user' }).eq('id', tempUser.id);

      const { data } = await service
        .from('profiles')
        .select('role')
        .eq('id', tempUser.id)
        .single();

      expect(data?.role).toBe('user');

      await tempUser.cleanup();
    });
  });
});
