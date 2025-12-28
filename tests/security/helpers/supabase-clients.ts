/**
 * Supabase Security Test Helpers
 * Production-ready utilities for RLS security testing
 * 
 * HARDENED: Bug-bounty grade assertions
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment validation
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
}

// Tables that need cleanup (add new tables here)
const USER_OWNED_TABLES = [
  'invoice_items',
  'invoices',
  'suppliers',
];

// Types
export interface TestUser {
  id: string;
  email: string;
  client: SupabaseClient;
  cleanup: () => Promise<void>;
}

export interface TestUserPair {
  userA: TestUser;
  userB: TestUser;
}

/**
 * Creates an anonymous Supabase client (no auth)
 */
export function createAnonClient(): SupabaseClient {
  return createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
}

/**
 * Creates a service role client (bypasses RLS - use only for setup/teardown)
 */
export function createServiceClient(): SupabaseClient {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY required for service client');
  }
  return createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

/**
 * Creates an authenticated test user with real JWT session.
 */
export async function createTestUser(
  email: string,
  password: string = 'SecurityTest@123'
): Promise<TestUser> {
  const anonClient = createAnonClient();

  // Try sign in first
  let session = await anonClient.auth.signInWithPassword({ email, password });

  // If user doesn't exist, create with retry
  if (session.error?.message?.includes('Invalid login')) {
    const signUp = await anonClient.auth.signUp({ email, password });
    
    if (signUp.error) {
      // 'Already registered' or rate limit - try sign in again
      if (signUp.error.message.includes('already') || 
          signUp.error.message.includes('rate') || 
          signUp.error.message.includes('limit')) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        session = await anonClient.auth.signInWithPassword({ email, password });
      } else {
        throw new Error(`Failed to create user ${email}: ${signUp.error.message}`);
      }
    } else {
      // Wait for user to be created, then sign in
      await new Promise(resolve => setTimeout(resolve, 500));
      session = await anonClient.auth.signInWithPassword({ email, password });
    }
  }

  if (session.error || !session.data.session) {
    throw new Error(`Auth failed for ${email}: ${session.error?.message}`);
  }

  const { access_token, user } = session.data.session;

  const userClient = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    global: {
      headers: { Authorization: `Bearer ${access_token}` },
    },
    auth: { persistSession: false },
  });

  return {
    id: user.id,
    email,
    client: userClient,
    cleanup: async () => {
      const service = createServiceClient();
      for (const table of USER_OWNED_TABLES) {
        await service.from(table).delete().eq('user_id', user.id);
      }
    },
  };
}

// Fixed test user credentials (create these once in Supabase)
const TEST_USER_A = {
  email: 'security-test-user-a@peygo.test',
  password: 'SecurityTestA@123',
};

const TEST_USER_B = {
  email: 'security-test-user-b@peygo.test',
  password: 'SecurityTestB@123',
};

/**
 * Creates a pair of test users for cross-user security testing.
 * Uses fixed users to avoid Supabase auth rate limiting.
 */
export async function createTestUserPair(): Promise<TestUserPair> {
  const userA = await createTestUser(TEST_USER_A.email, TEST_USER_A.password);
  const userB = await createTestUser(TEST_USER_B.email, TEST_USER_B.password);
  return { userA, userB };
}

/**
 * Security assertion: User should NOT be able to read target row
 */
export async function assertCannotRead(
  client: SupabaseClient,
  table: string,
  targetId: string
): Promise<void> {
  const { data, error } = await client
    .from(table)
    .select('*')
    .eq('id', targetId);
  
  if (error && !error.code?.includes('PGRST116')) {
    throw new Error(`Unexpected error reading ${table}: ${error.message}`);
  }

  if (data && data.length > 0) {
    throw new Error(`SECURITY VIOLATION: User can read ${table}/${targetId}`);
  }
}

/**
 * Security assertion: User should NOT be able to update target row
 */
export async function assertCannotUpdate(
  client: SupabaseClient,
  table: string,
  targetId: string,
  payload: Record<string, unknown>
): Promise<void> {
  const service = createServiceClient();
  const { data: beforeState } = await service
    .from(table)
    .select('*')
    .eq('id', targetId)
    .single();

  const { data: returnedRows } = await client
    .from(table)
    .update(payload)
    .eq('id', targetId)
    .select();

  if (returnedRows && returnedRows.length > 0) {
    throw new Error(`SECURITY VIOLATION: User updated ${table}/${targetId}`);
  }

  const { data: afterState } = await service
    .from(table)
    .select('*')
    .eq('id', targetId)
    .single();

  for (const [key, value] of Object.entries(payload)) {
    if (afterState && beforeState && afterState[key] !== beforeState[key] && afterState[key] === value) {
      throw new Error(`SECURITY VIOLATION: ${table}/${targetId} field '${key}' was modified`);
    }
  }
}

/**
 * Security assertion: User should NOT be able to delete target row
 */
export async function assertCannotDelete(
  client: SupabaseClient,
  table: string,
  targetId: string
): Promise<void> {
  const service = createServiceClient();
  
  const { data: before } = await service
    .from(table)
    .select('id')
    .eq('id', targetId)
    .single();
  
  if (!before) {
    // Row doesn't exist - skip test (not a security issue)
    console.warn(`[SKIP] Row ${table}/${targetId} doesn't exist - skipping delete test`);
    return;
  }

  const { data: deletedRows } = await client
    .from(table)
    .delete()
    .eq('id', targetId)
    .select();

  if (deletedRows && deletedRows.length > 0) {
    throw new Error(`SECURITY VIOLATION: User deleted ${table}/${targetId}`);
  }

  const { data: after } = await service
    .from(table)
    .select('id')
    .eq('id', targetId)
    .single();
  
  if (!after) {
    throw new Error(`SECURITY VIOLATION: Row ${table}/${targetId} was deleted`);
  }
}

/**
 * Security assertion: User cannot insert with forged user_id
 */
export async function assertCannotInsertForged(
  client: SupabaseClient,
  table: string,
  payload: Record<string, unknown>,
  forgedUserId: string
): Promise<void> {
  const { data, error } = await client
    .from(table)
    .insert({ ...payload, user_id: forgedUserId })
    .select();

  if (!error) {
    if (data && Array.isArray(data) && data.length > 0) {
      const service = createServiceClient();
      const insertedRow = data[0] as Record<string, unknown>;
      if (insertedRow.id) {
        await service.from(table).delete().eq('id', insertedRow.id);
      }
    }
    throw new Error(`SECURITY VIOLATION: Insert with forged user_id succeeded`);
  }
}

/**
 * Security assertion: User cannot escalate role
 * Updated: Only checks 'role' column (no is_admin in this schema)
 */
export async function assertCannotEscalateRole(
  client: SupabaseClient,
  userId: string
): Promise<void> {
  const escalationAttempts = [
    { role: 'admin' },
    { role: 'super_admin' },
  ];

  const service = createServiceClient();

  for (const attempt of escalationAttempts) {
    await client
      .from('profiles')
      .update(attempt)
      .eq('id', userId);

    const { data: profile } = await service
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profile?.role === 'admin' || profile?.role === 'super_admin') {
      throw new Error(`SECURITY VIOLATION: Role escalation - role='${profile.role}'`);
    }
  }
}

/**
 * Assert that a query returns empty AND no error
 */
export function assertEmptyResultNoError(
  result: { data: unknown[] | null; error: { message: string } | null }
): void {
  if (result.error) {
    throw new Error(`Unexpected error: ${result.error.message}`);
  }

  if (!Array.isArray(result.data)) {
    throw new Error(`Expected array, got: ${typeof result.data}`);
  }

  if (result.data.length > 0) {
    throw new Error(`Expected empty result, got ${result.data.length} rows`);
  }
}
