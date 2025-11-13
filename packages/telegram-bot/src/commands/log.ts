import { Context, InlineKeyboard } from 'grammy';

export async function logCommand(ctx: Context) {
  const keyboard = new InlineKeyboard()
    .text('😊 Very energizing (+3)', 'energy:3')
    .text('🙂 Energizing (+2)', 'energy:2').row()
    .text('☺️ Slightly energizing (+1)', 'energy:1')
    .text('😐 Neutral (0)', 'energy:0').row()
    .text('😕 Slightly draining (-1)', 'energy:-1')
    .text('😰 Draining (-2)', 'energy:-2').row()
    .text('😫 Very draining (-3)', 'energy:-3');

  await ctx.reply(
    '📊 Let\'s log an activity!\n\nFirst, how did this activity affect your energy?',
    { reply_markup: keyboard }
  );
}
