import { Context } from 'grammy';

export async function balanceCommand(ctx: Context) {
  const message = `
⚖️ **Life Balance Wheel** (Demo Mode)

The Life Balance Wheel helps you visualize your satisfaction across 8 key areas:

🎯 Career - Professional growth and satisfaction
💪 Health - Physical and mental well-being
❤️ Relationships - Quality of connections
🌱 Personal Growth - Learning and development
💰 Finances - Financial security and goals
🎨 Recreation - Hobbies and fun activities
🏡 Environment - Living space and surroundings
🤝 Contribution - Impact on others and community

**To use Life Balance:**
1. Visit the web app
2. Rate each domain from 0-10
3. View your balance wheel visualization
4. Track changes over time
5. Set goals to improve lower-scoring areas

💡 **Tip:** Reassess monthly to track your progress!

Visit the web app to create your first assessment.
  `.trim();

  await ctx.reply(message, { parse_mode: 'Markdown' });
}
