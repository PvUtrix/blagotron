import { Context } from 'grammy';

export async function startCommand(ctx: Context) {
  const welcomeMessage = `
👋 Welcome to **Blagotron**!

I'm your personal assistant for designing a meaningful and fulfilling life.

🎯 What I can help you with:
• Track activities and energy levels
• Manage your goals across life domains
• Daily reflections and journaling
• Monitor your life balance

📱 **Get Started:**
1. Visit the web app to create your account: [Coming soon]
2. Once registered, you can use this bot for quick logging!

For now, try these commands:
/help - See all commands
/log - Quick activity logging (demo)
/goals - View your goals (demo)
/reflect - Daily reflection (demo)
/balance - Life balance check (demo)

💡 **Tip:** The bot works best when connected to your account. Full authentication coming soon!
  `.trim();

  await ctx.reply(welcomeMessage, { parse_mode: 'Markdown' });
}
