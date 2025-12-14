/**
 * Script to create a VAPI assistant for the AI Mock Interview application
 * Run this script to create an assistant in your VAPI account
 *
 * Usage:
 * 1. Set your VAPI_PRIVATE_KEY in .env.local
 * 2. Run: npx tsx scripts/create-vapi-assistant.ts
 */

import { createInterviewAssistantConfig } from '../lib/vapi-assistant.config';

const VAPI_API_URL = 'https://api.vapi.ai';

interface CreateAssistantResponse {
  id: string;
  name: string;
  model: any;
  voice: any;
  transcriber: any;
  createdAt: string;
  updatedAt: string;
}

async function createAssistant(apiKey: string) {
  // Sample configuration for creating the base assistant
  const sampleConfig = createInterviewAssistantConfig({
    jobRole: 'Software Engineer',
    company: 'Demo Company',
    interviewType: 'technical',
    difficulty: 'medium',
    currentQuestion: 'Can you explain the difference between var, let, and const in JavaScript?',
    questionCategory: 'JavaScript Fundamentals',
  });

  try {
    console.log('Creating VAPI assistant...');
    console.log('Assistant Configuration:', JSON.stringify(sampleConfig, null, 2));

    const response = await fetch(`${VAPI_API_URL}/assistant`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sampleConfig),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create assistant: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const assistant: CreateAssistantResponse = await response.json();

    console.log('\n✅ Assistant created successfully!');
    console.log('Assistant ID:', assistant.id);
    console.log('Assistant Name:', assistant.name);
    console.log('\n📝 Add this to your .env.local file:');
    console.log(`NEXT_PUBLIC_VAPI_ASSISTANT_ID=${assistant.id}`);

    return assistant;
  } catch (error) {
    console.error('❌ Error creating assistant:', error);
    throw error;
  }
}

async function listAssistants(apiKey: string) {
  try {
    console.log('\nFetching existing assistants...');

    const response = await fetch(`${VAPI_API_URL}/assistant`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch assistants: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const assistants = await response.json();

    console.log('\n📋 Existing Assistants:');
    if (Array.isArray(assistants) && assistants.length > 0) {
      assistants.forEach((assistant: any, index: number) => {
        console.log(`\n${index + 1}. ${assistant.name || 'Unnamed Assistant'}`);
        console.log(`   ID: ${assistant.id}`);
        console.log(`   Model: ${assistant.model?.model || 'N/A'}`);
        console.log(`   Voice: ${assistant.voice?.voiceId || 'N/A'}`);
      });
    } else {
      console.log('No assistants found in your account.');
    }

    return assistants;
  } catch (error) {
    console.error('❌ Error fetching assistants:', error);
    throw error;
  }
}

async function main() {
  // Get the private API key from environment
  const apiKey = process.env.VAPI_PRIVATE_KEY;

  if (!apiKey) {
    console.error('❌ Error: VAPI_PRIVATE_KEY not found in environment variables');
    console.log('\n📝 Steps to fix:');
    console.log('1. Log in to https://dashboard.vapi.ai/');
    console.log('2. Navigate to Settings > API Keys');
    console.log('3. Copy your Private Key');
    console.log('4. Add to .env.local: VAPI_PRIVATE_KEY=your_private_key_here');
    console.log('5. Run this script again');
    process.exit(1);
  }

  console.log('🚀 VAPI Assistant Setup');
  console.log('========================\n');

  try {
    // First, list existing assistants
    const existingAssistants = await listAssistants(apiKey);

    // Check if we already have an interview assistant
    const interviewAssistant = Array.isArray(existingAssistants)
      ? existingAssistants.find((a: any) => a.name?.includes('Interview Assistant'))
      : null;

    if (interviewAssistant) {
      console.log('\n⚠️  Found existing Interview Assistant:');
      console.log(`   ID: ${interviewAssistant.id}`);
      console.log('\n💡 You can use this assistant or create a new one.');
      console.log('\nTo create a new one, delete the existing assistant first from the dashboard.');
      console.log('\n📝 Add this to your .env.local file:');
      console.log(`NEXT_PUBLIC_VAPI_ASSISTANT_ID=${interviewAssistant.id}`);
    } else {
      // Create a new assistant
      await createAssistant(apiKey);
    }

    console.log('\n✅ Setup complete!');
  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run the script
main();
