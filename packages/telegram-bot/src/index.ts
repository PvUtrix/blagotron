import dotenv from 'dotenv';
dotenv.config();

import { Bot, Context, session } from 'grammy';
import { startCommand } from './commands/start';
import { helpCommand } from './commands/help';
import { logCommand } from './commands/log';
import { goalsCommand } from './commands/goals';
import { reflectCommand } from './commands/reflect';
import { balanceCommand } from './commands/balance';

// Session data interface
interface SessionData {
  userId?: string;
  accessToken?: string;
  awaitingInput?: {
    type: string;
    data?: any;
  };
}

type MyContext = Context & {
  session: SessionData;
};

// Check required environment variables
if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is required');
}

// Create bot instance
const bot = new Bot<MyContext>(process.env.TELEGRAM_BOT_TOKEN);

// Use session middleware
bot.use(
  session({
    initial: (): SessionData => ({}),
  })
);

// Register commands
bot.command('start', startCommand);
bot.command('help', helpCommand);
bot.command('log', logCommand);
bot.command('goals', goalsCommand);
bot.command('reflect', reflectCommand);
bot.command('balance', balanceCommand);

// Handle callback queries (button presses)
bot.on('callback_query:data', async (ctx) => {
  await ctx.answerCallbackQuery();
  const data = ctx.callbackQuery.data;

  if (data.startsWith('energy:')) {
    const energyValue = parseInt(data.split(':')[1]);
    ctx.session.awaitingInput = {
      type: 'activity',
      data: { energyDelta: energyValue },
    };
    await ctx.reply('Great! Now tell me what activity you did. (e.g., "30 min run")');
  }
});

// Handle text messages
bot.on('message:text', async (ctx) => {
  if (ctx.session.awaitingInput) {
    const { type, data } = ctx.session.awaitingInput;

    if (type === 'activity' && data) {
      // Parse activity from text
      const text = ctx.message.text;
      const durationMatch = text.match(/(\d+)\s*(min|minutes?|m)/i);
      const duration = durationMatch ? parseInt(durationMatch[1]) : 30;

      // Extract activity type (remove duration part)
      const activityType = text
        .replace(/(\d+)\s*(min|minutes?|m)/gi, '')
        .trim() || 'Activity';

      await ctx.reply(
        `Logging: "${activityType}" for ${duration} minutes with energy ${data.energyDelta > 0 ? '+' : ''}${data.energyDelta}.\n\n` +
        `To actually log this, you'll need to authenticate first. Use /start to get started!`
      );

      delete ctx.session.awaitingInput;
    } else if (type === 'reflection') {
      await ctx.reply(
        `Beautiful reflection! 📝\n\n` +
        `To save your reflections, you'll need to authenticate. Use /start to get started!`
      );
      delete ctx.session.awaitingInput;
    }
  } else {
    // Default response for unrecognized text
    await ctx.reply(
      `I'm not sure what to do with that. Try one of these commands:\n\n` +
      `/help - See all available commands\n` +
      `/log - Log an activity\n` +
      `/goals - View your goals\n` +
      `/reflect - Write a reflection`
    );
  }
});

// Error handler
bot.catch((err) => {
  console.error('Bot error:', err);
});

// Start bot
bot.start({
  onStart: (botInfo) => {
    console.log(`🤖 Bot started: @${botInfo.username}`);
    console.log('Ready to receive messages!');
  },
});

// Graceful shutdown
process.once('SIGINT', () => {
  console.log('Stopping bot...');
  bot.stop();
});

process.once('SIGTERM', () => {
  console.log('Stopping bot...');
  bot.stop();
});
