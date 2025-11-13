import { Context } from 'grammy';

export async function goalsCommand(ctx: Context) {
  const message = `
🎯 **Your Goals** (Demo Mode)

To view and manage your goals, please:
1. Create an account on the web app
2. Set up your goals across different life domains
3. Return here for quick updates!

**Life Domains:**
• Career
• Health
• Relationships
• Personal Growth
• Finances
• Recreation
• Environment
• Contribution

Once connected, you'll be able to:
✓ View goal progress
✓ Mark milestones complete
✓ Get goal reminders
✓ Quick status updates

Visit the web app to get started!
  `.trim();

  await ctx.reply(message, { parse_mode: 'Markdown' });
}
