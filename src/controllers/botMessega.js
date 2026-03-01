const TelegramBot = require("node-telegram-bot-api");

const token = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;

const bot = new TelegramBot(token, { polling: false });

const botMessage = {
  sendWarning: (plantName, percent) => {
    const message = `⚠️ [11A7 - CẢNH BÁO]\n🌿 Cây: ${plantName}\n💧 Độ ẩm hiện tại: ${percent}%\n❗ Trạng thái: QUÁ KHÔ! Hãy tưới nước ngay.`;

    bot
      .sendMessage(chatId, message)
      .then(() => console.log("✅ Đã gửi cảnh báo qua Telegram"))
      .catch((error) => console.error("❌ Lỗi gửi Telegram:", error));
  },
  sendSystemStart: () => {
    bot.sendMessage(chatId, "🚀 Hệ thống giám sát 11A7 đã trực tuyến!");
  },
};

module.exports = botMessage;
