# Peygo Business Logic Testing Documentation

> **Status: ✅ 40 Tests Passing**  
> **Last Updated: 2025-12-28**

---

## Overview

Business Logic Tests memverifikasi bahwa semua fitur aplikasi berfungsi dengan benar sesuai dengan kebutuhan bisnis.

### Jenis Test
| Type | Description |
|------|-------------|
| **Integration Tests** | Test langsung ke database Supabase |
| **End-to-End Flow** | Test complete user journey |
| **CRUD Operations** | Create, Read, Update, Delete |

### Test Connection
```
Test Runner (Vitest)
    ↓
Supabase Client (supabase-js)
    ↓
Real Supabase Database
    ↓
Real RLS Policies Applied
```

**⚠️ PENTING:** Tests ini menghit database production/development yang sama!
Pastikan environment variables mengarah ke project yang tepat.

---

## Quick Start

```bash
# Run business tests only
pnpm run test:business

# Run all tests (security + business)
pnpm run test:all
```

### Expected Output
```
Test Files  3 passed (3)
     Tests  40 passed (40)
```

---

## Test Structure

```
tests/business/
├── user-operations.test.ts    # 19 tests - User CRUD & features
├── admin-operations.test.ts   # 13 tests - Admin access & stats
└── invoice-workflow.test.ts   # 8 tests  - Invoice lifecycle
```

---

## Test Coverage Detail

### 1. User Operations (19 tests)

#### Invoice Creation - Penjualan (Billing)
| Test | Expected Result |
|------|-----------------|
| Create billing invoice | ✅ Invoice created with DRAFT status |
| Positive amount required | ❌ Reject if amount ≤ 0 |
| Required fields check | ❌ Reject if missing fields |

#### Invoice Creation - Pembayaran (Payment Request)
| Test | Expected Result |
|------|-----------------|
| Create payment request | ✅ Invoice with type=PAYMENT_REQUEST |
| Link to supplier | ✅ supplier_id saved correctly |

#### Invoice Items
| Test | Expected Result |
|------|-----------------|
| Add items to invoice | ✅ Item linked to invoice |

#### Supplier Management
| Test | Expected Result |
|------|-----------------|
| Create supplier | ✅ Supplier created |
| Update supplier | ✅ Changes saved |
| Delete supplier | ✅ Supplier removed |

#### Profile Management
| Test | Expected Result |
|------|-----------------|
| Read own profile | ✅ Profile returned |
| Update name | ✅ Name changed |
| Update business info | ✅ Company info saved |
| Cannot update role | ❌ Role stays same |

#### Invoice Filtering
| Test | Expected Result |
|------|-----------------|
| Filter by type | ✅ Only matching type returned |
| Filter by status | ✅ Only matching status returned |
| Search by recipient | ✅ Name search works |

---

### 2. Admin Operations (13 tests)

#### Admin Role Verification
| Test | Expected Result |
|------|-----------------|
| Admin has role=admin | ✅ Correct role in DB |
| Regular user has role=user | ✅ Correct role in DB |

#### Admin Data Access
| Test | Expected Result | Note |
|------|-----------------|------|
| Admin same RLS as user | ❌ Cannot see other data | Via client-side |

**Note:** Admin akses semua data via **Server Component** menggunakan service role, bukan via client-side. Ini lebih aman.

#### Admin Statistics (via Service Role)
| Test | Expected Result |
|------|-----------------|
| Count all users | ✅ Total count returned |
| Count all invoices | ✅ Total count returned |
| Aggregate revenue | ✅ Sum calculated |
| Filter by status | ✅ PAID/PENDING counted |
| Count by role | ✅ Users/admins counted |

#### Admin Client Restrictions
| Test | Expected Result |
|------|-----------------|
| Cannot read other profiles | ❌ Empty result (RLS) |
| Cannot update other invoices | ❌ No rows affected |
| Cannot delete other invoices | ❌ Row still exists |

#### Role Assignment
| Test | Expected Result |
|------|-----------------|
| Promote to admin | ✅ Role changed to admin |
| Demote to user | ✅ Role changed to user |

---

### 3. Invoice Workflow (8 tests)

#### Invoice Lifecycle

```
┌─────────┐      ┌──────┐      ┌──────┐      ┌─────────┐
│  DRAFT  │ ───► │ SENT │ ───► │ PAID │ ───► │DISBURSED│
└─────────┘      └──────┘      └──────┘      └─────────┘
     │              
     ▼              
┌───────────┐       
│ CANCELLED │       
└───────────┘       
```

#### Creation Tests
| Test | Expected Result |
|------|-----------------|
| New invoice starts DRAFT | ✅ status = 'DRAFT' |
| Correct amounts | ✅ amount, subtotal, total saved |

#### Draft Editing
| Test | Expected Result |
|------|-----------------|
| Update description | ✅ Description changed |
| Update recipient | ✅ Recipient info changed |
| Cannot update amount | ❌ Amount protected (RLS) |

#### Status Transitions
| Test | Expected Result |
|------|-----------------|
| User cannot set SENT | ❌ Status unchanged |
| User cannot set PAID | ❌ Status unchanged |
| Service can change | ✅ Status changed |

#### Payment Flow
| Test | Expected Result |
|------|-----------------|
| Set PAID with paid_at | ✅ Both fields set |
| Cannot revert to DRAFT | ❌ Status stays PAID |

#### Deletion
| Test | Expected Result |
|------|-----------------|
| Can delete DRAFT | ✅ Invoice deleted |

---

## How Tests Work

### 1. Test User Creation
```typescript
// Creates authenticated user for testing
const user = await createTestUser('email@test.com', 'Password123');

// User has:
// - user.id: UUID
// - user.client: Authenticated Supabase client
// - user.cleanup(): Delete all user data
```

### 2. Authenticated Requests
```typescript
// All requests use authenticated client
const { data, error } = await user.client
  .from('invoices')
  .insert({ user_id: user.id, ... })
  .select()
  .single();
```

### 3. Service Role Verification
```typescript
// Service role can bypass RLS to verify
const service = createServiceClient();
const { data } = await service
  .from('invoices')
  .select('status')
  .eq('id', invoiceId)
  .single();
```

### 4. Cleanup
```typescript
// After each test file, cleanup user data
afterAll(async () => {
  await user.cleanup();
});
```

---

## Environment Variables

Tests require these variables in `.env.local`:

```env
# Supabase Project URL
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co

# Public anon key (for authenticated users)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

# Service role key (for verification & cleanup)
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

---

## Test Users

Tests use fixed test users to avoid auth rate limiting:

| User | Purpose |
|------|---------|
| `business-user@peygo.test` | User operations |
| `workflow-test@peygo.test` | Invoice workflow |
| `admin-biztest@peygo.test` | Admin operations |
| `regular-biztest@peygo.test` | Non-admin for comparison |

---

## Adding New Tests

### 1. Create new test file
```typescript
// tests/business/new-feature.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createTestUser, TestUser } from '../security/helpers/supabase-clients';

describe('BUSINESS LOGIC: New Feature', () => {
  let user: TestUser;

  beforeAll(async () => {
    user = await createTestUser('new-test@peygo.test', 'NewTest@123');
  });

  afterAll(async () => {
    await user.cleanup();
  });

  it('should do something', async () => {
    // Test code
  });
});
```

### 2. Run tests
```bash
pnpm run test:business
```

---

## Known Issues & TODOs

| Issue | Priority | Description |
|-------|----------|-------------|
| SENT invoice description editable | Medium | Need trigger to block all updates |
| Invoice items schema variance | Low | Different schemas in different environments |
| Profile column names | Low | `name` vs `full_name` varies |

---

## CI Integration

Add to `.github/workflows/tests.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm run test:all
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

---

## Best Practices

1. **Isolation**: Each test file creates its own users and cleans up
2. **Independence**: Tests don't depend on each other's data
3. **Real Data**: Tests use real database - no mocks
4. **Verification**: Use service role to verify changes
5. **Graceful Handling**: Skip tests if schema doesn't match

---

*Generated by Peygo Business Test Framework*
