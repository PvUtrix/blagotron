import { Context } from 'grammy';

const dailyPrompts = [
  'What gave you the most energy today?',
  'What are you grateful for today?',
  'What did you learn about yourself today?',
  'What progress did you make toward your goals?',
  'What brought you joy today?',
  'What challenged you and how did you respond?',
];

export async function reflectCommand(ctx: Context & any) {
  const randomPrompt = dailyPrompts[Math.floor(Math.random() * dailyPrompts.length)];

  const message = `
📝 **Daily Reflection**

Today's prompt:
*${randomPrompt}*

Take a moment to reflect and respond with your thoughts...

💡 Your reflection helps build self-awareness and track your journey over time.

(In demo mode - to save reflections, please set up your account on the web app)
  `.trim();

  ctx.session.awaitingInput = {
    type: 'reflection',
  };

  await ctx.reply(message, { parse_mode: 'Markdown' });
}
