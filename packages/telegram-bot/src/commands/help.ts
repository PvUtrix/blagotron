import { Context } from 'grammy';

export async function helpCommand(ctx: Context) {
  const helpMessage = `
📚 **Blagotron Bot Commands**

**Activity Tracking:**
/log - Log an activity with energy impact
Example: "30 min run" or "Work meeting 1 hour"

**Goals:**
/goals - View and manage your goals
Create goals across 8 life domains

**Reflections:**
/reflect - Write a daily reflection
Get prompted questions for self-discovery

**Life Balance:**
/balance - Check your life balance wheel
Track satisfaction across different areas

**General:**
/start - Welcome message and setup
/help - This help message

💡 **Tips:**
• Quick logging: Just describe what you did
• Energy ratings: -3 (draining) to +3 (energizing)
• Daily reflections help build self-awareness
• Check your balance weekly for insights

🌐 **Web App:**
For full features, use the web application at [Coming soon]
  `.trim();

  await ctx.reply(helpMessage, { parse_mode: 'Markdown' });
}
