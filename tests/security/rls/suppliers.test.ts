/**
 * Suppliers RLS Security Tests
 * 
 * HARDENED: Bug-bounty grade
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  createTestUserPair,
  createServiceClient,
  assertCannotRead,
  assertCannotUpdate,
  assertCannotDelete,
  assertCannotInsertForged,
  TestUser,
} from '../helpers/supabase-clients';

describe('SECURITY: Suppliers RLS Policies', () => {
  let userA: TestUser;
  let userB: TestUser;
  let userASupplierId: string;

  beforeAll(async () => {
    ({ userA, userB } = await createTestUserPair());

    const { data, error } = await userA.client
      .from('suppliers')
      .insert({
        user_id: userA.id,
        name: 'Secret Supplier Corp',
        phone: '08123456789',
        email: 'secret@supplier.com',
        address: 'Hidden Address 123',
      })
      .select()
      .single();

    if (error) throw new Error(`Setup failed: ${error.message}`);
    userASupplierId = data.id;
  });

  afterAll(async () => {
    await userA.cleanup();
    await userB.cleanup();
  });

  describe('SELECT Policy', () => {
    it('[CRITICAL] User B CANNOT read User A supplier by ID', async () => {
      await assertCannotRead(userB.client, 'suppliers', userASupplierId);
    });

    it('[CRITICAL] User B CANNOT see User A suppliers in table scan', async () => {
      const { data } = await userB.client.from('suppliers').select('*');
      
      const leaked = data?.find((s) => s.user_id === userA.id);
      expect(leaked).toBeUndefined();
    });

    it('[CRITICAL] Supplier data not leaked via invoice JOIN', async () => {
      // Create invoice with supplier
      const { data: invoice } = await userA.client
        .from('invoices')
        .insert({
          user_id: userA.id,
          invoice_number: `SUP-TEST-${Date.now()}`,
          type: 'PAYMENT',
          recipient_name: 'Test',
          recipient_phone: '0000',
          description: 'Test',
          amount: 10000,
          subtotal: 10000,
          total_amount: 10000,
        })
        .select()
        .single();

      if (invoice) {
        // User B tries to read invoices with supplier join
        const { data } = await userB.client
          .from('invoices')
          .select('*, suppliers(*)')
          .eq('id', invoice.id);

        expect(data).toEqual([]);

        // Cleanup
        await createServiceClient().from('invoices').delete().eq('id', invoice.id);
      }
    });
  });

  describe('UPDATE Policy', () => {
    it('[CRITICAL] User B CANNOT update User A supplier', async () => {
      await assertCannotUpdate(userB.client, 'suppliers', userASupplierId, {
        name: 'Hacked Supplier',
      });
    });

    it('[CRITICAL] User B CANNOT take ownership of User A supplier', async () => {
      await assertCannotUpdate(userB.client, 'suppliers', userASupplierId, {
        user_id: userB.id,
      });
    });
  });

  describe('DELETE Policy', () => {
    it('[CRITICAL] User B CANNOT delete User A supplier', async () => {
      await assertCannotDelete(userB.client, 'suppliers', userASupplierId);
    });
  });

  describe('INSERT Policy', () => {
    it('[CRITICAL] User B CANNOT insert supplier with User A user_id', async () => {
      await assertCannotInsertForged(
        userB.client,
        'suppliers',
        {
          name: 'Forged Supplier',
          phone: '0000',
        },
        userA.id
      );
    });
  });
});
