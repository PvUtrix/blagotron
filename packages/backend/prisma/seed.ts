import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create default reflection prompts
  const prompts = [
    {
      promptText: 'What gave you the most energy today?',
      frequency: 'daily',
      category: 'energy',
      active: true,
    },
    {
      promptText: 'What are you grateful for today?',
      frequency: 'daily',
      category: 'gratitude',
      active: true,
    },
    {
      promptText: 'What would you do differently today?',
      frequency: 'daily',
      category: 'growth',
      active: true,
    },
    {
      promptText: 'What did you learn about yourself today?',
      frequency: 'daily',
      category: 'self-awareness',
      active: true,
    },
    {
      promptText: 'What progress did you make toward your goals?',
      frequency: 'daily',
      category: 'progress',
      active: true,
    },
    {
      promptText: 'How did you contribute to others today?',
      frequency: 'daily',
      category: 'contribution',
      active: true,
    },
    {
      promptText: 'What challenged you and how did you respond?',
      frequency: 'daily',
      category: 'challenges',
      active: true,
    },
    {
      promptText: 'What brought you joy today?',
      frequency: 'daily',
      category: 'joy',
      active: true,
    },
    {
      promptText: 'What worked well this week?',
      frequency: 'weekly',
      category: 'reflection',
      active: true,
    },
    {
      promptText: 'What drained your energy this week?',
      frequency: 'weekly',
      category: 'energy',
      active: true,
    },
    {
      promptText: 'What are you learning about yourself?',
      frequency: 'weekly',
      category: 'self-awareness',
      active: true,
    },
    {
      promptText: 'What would you like to improve next week?',
      frequency: 'weekly',
      category: 'growth',
      active: true,
    },
    {
      promptText: 'What are your biggest wins this month?',
      frequency: 'monthly',
      category: 'achievements',
      active: true,
    },
    {
      promptText: 'How has your life balance changed this month?',
      frequency: 'monthly',
      category: 'balance',
      active: true,
    },
    {
      promptText: 'What new insights did you gain this month?',
      frequency: 'monthly',
      category: 'insights',
      active: true,
    },
  ];

  for (const prompt of prompts) {
    await prisma.reflectionPrompt.upsert({
      where: {
        promptText: prompt.promptText,
      },
      update: {},
      create: prompt,
    });
  }

  console.log(`Created ${prompts.length} reflection prompts`);
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
