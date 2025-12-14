/**
 * VAPI Setup Verification Script
 * Checks if all VAPI configuration is correct
 *
 * Usage: npx tsx scripts/verify-vapi-setup.ts
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

interface SetupCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

const checks: SetupCheck[] = [];

function checkEnvVar(name: string, required: boolean = true): boolean {
  const value = process.env[name];

  if (!value || value.includes('your_') || value.includes('_here')) {
    checks.push({
      name,
      status: required ? 'fail' : 'warning',
      message: required
        ? `❌ ${name} is not set or has placeholder value`
        : `⚠️  ${name} is optional but not set`
    });
    return false;
  }

  checks.push({
    name,
    status: 'pass',
    message: `✅ ${name} is configured`
  });
  return true;
}

function printResults() {
  console.log('\n🔍 VAPI Setup Verification\n');
  console.log('='.repeat(60));

  checks.forEach(check => {
    console.log(check.message);
  });

  console.log('='.repeat(60));

  const passed = checks.filter(c => c.status === 'pass').length;
  const failed = checks.filter(c => c.status === 'fail').length;
  const warnings = checks.filter(c => c.status === 'warning').length;

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed, ${warnings} warnings\n`);

  if (failed > 0) {
    console.log('❌ Setup incomplete. Please follow these steps:\n');
    console.log('1. Go to https://dashboard.vapi.ai/');
    console.log('2. Log in with: bdua8933@gmail.com');
    console.log('3. Navigate to Settings → API Keys');
    console.log('4. Copy your Private Key');
    console.log('5. Update .env.local with your keys');
    console.log('6. Run this script again to verify\n');
    console.log('📖 See VAPI_SETUP_GUIDE.md for detailed instructions\n');
    process.exit(1);
  } else if (warnings > 0) {
    console.log('⚠️  Setup is functional but some optional items are missing.');
    console.log('📖 See VAPI_SETUP_GUIDE.md for complete setup\n');
  } else {
    console.log('✅ All checks passed! Your VAPI integration is ready.\n');
    console.log('🚀 Next steps:');
    console.log('   1. Run: npx tsx scripts/create-vapi-assistant.ts');
    console.log('   2. Start dev server: npm run dev');
    console.log('   3. Test voice interview at http://localhost:3000\n');
  }
}

async function verifyApiConnection() {
  const privateKey = process.env.VAPI_PRIVATE_KEY;

  if (!privateKey || privateKey.includes('your_')) {
    console.log('\n⏭️  Skipping API connection test (Private key not set)\n');
    return;
  }

  console.log('\n🔌 Testing VAPI API connection...');

  try {
    const response = await fetch('https://api.vapi.ai/assistant', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${privateKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const assistants = await response.json();
      console.log(`✅ API connection successful!`);
      console.log(`   Found ${Array.isArray(assistants) ? assistants.length : 0} existing assistant(s)`);
    } else {
      console.log(`❌ API connection failed: ${response.status} ${response.statusText}`);
      console.log('   Please verify your VAPI_PRIVATE_KEY is correct');
    }
  } catch (error) {
    console.log(`❌ API connection error: ${error}`);
  }
}

async function main() {
  console.log('Starting VAPI setup verification...\n');

  // Required checks
  checkEnvVar('NEXT_PUBLIC_VAPI_WEB_TOKEN', true);
  checkEnvVar('VAPI_PRIVATE_KEY', true);

  // Optional checks
  checkEnvVar('NEXT_PUBLIC_VAPI_ASSISTANT_ID', false);
  checkEnvVar('NEXT_PUBLIC_SUPABASE_URL', true);
  checkEnvVar('GOOGLE_GENERATIVE_AI_API_KEY', true);

  printResults();

  await verifyApiConnection();
}

main().catch(console.error);
