/**
 * Test script for question generation API
 * Usage: npx tsx scripts/test-question-generation.ts
 */

async function testQuestionGeneration() {
  console.log('🧪 Testing Question Generation API...\n');

  const testData = {
    jobRole: 'Frontend Developer',
    company: 'Test Company',
    interviewType: 'mixed',
    difficulty: 'medium',
    numberOfQuestions: 3
  };

  console.log('Test Data:', JSON.stringify(testData, null, 2));

  try {
    const response = await fetch('http://localhost:3000/api/generate-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('\nResponse Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Error:', errorData);
      process.exit(1);
    }

    const data = await response.json();
    console.log('\n✅ Success! Generated Questions:');
    console.log(JSON.stringify(data, null, 2));

    if (data.questions && Array.isArray(data.questions)) {
      console.log(`\n📝 Total Questions: ${data.questions.length}`);
      data.questions.forEach((q: any, i: number) => {
        console.log(`\n${i + 1}. [${q.category}]`);
        console.log(`   ${q.question}`);
      });
    }

    console.log('\n✅ Question generation test passed!');

  } catch (error: any) {
    console.error('❌ Test Failed:', error.message);
    console.error('\nMake sure:');
    console.log('1. Dev server is running: npm run dev');
    console.log('2. GOOGLE_GENERATIVE_AI_API_KEY is set in .env.local');
    console.log('3. API route exists at: app/api/generate-questions/route.ts');
    process.exit(1);
  }
}

testQuestionGeneration();
