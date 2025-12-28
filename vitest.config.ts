import { defineConfig } from 'vitest/config';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Manual env loading
function loadEnvFile(path: string): Record<string, string> {
  if (!existsSync(path)) return {};
  const content = readFileSync(path, 'utf-8');
  const env: Record<string, string> = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (key) {
      env[key] = rest.join('=').replace(/^["']|["']$/g, '');
    }
  }
  return env;
}

const envLocal = loadEnvFile(resolve(__dirname, '.env.local'));

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/security/**/*.test.ts', 'tests/business/**/*.test.ts'],
    testTimeout: 30000,
    sequence: {
      shuffle: false,
    },
    reporters: ['verbose'],
    env: {
      SUPABASE_URL: envLocal.NEXT_PUBLIC_SUPABASE_URL || '',
      SUPABASE_ANON_KEY: envLocal.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      SUPABASE_SERVICE_ROLE_KEY: envLocal.SUPABASE_SERVICE_ROLE_KEY || '',
    },
  },
});
