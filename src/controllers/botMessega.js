const TelegramBot = require("node-telegram-bot-api");
const token = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;
const bot = token ? new TelegramBot(token, { polling: false }) : null;

const botMessage = {
  /**
   * @param {string} tenCay
   * @param {number} doAm
   * @param {string} loaiCanhBao
   */
  guiThongBao: (tenCay, doAm, loaiCanhBao) => {
    if (!bot || !chatId) return;
    const thoiGian = new Date().toLocaleString("vi-VN");
    let tieuDe = "";
    let huongDan = "";

    if (loaiCanhBao === "KHO") {
      tieuDe = "CANH BAO: DO AM THAP";
      huongDan = "Hanh dong: Kich hoat thiet bi tuoi nuoc.";
    } else if (loaiCanhBao === "UOT") {
      tieuDe = "CANH BAO: DO AM QUA CAO";
      huongDan = "Hanh dong: Kiem tra thoat nuoc bon cay.";
    } else {
      tieuDe = "HE THONG: TRANG THAI ON DINH";
      huongDan = "Hanh dong: Tiep tuc theo doi.";
    }
    const tinNhan = `
THONG BAO HE THONG - 11A7
----------------------------
SU KIEN: ${tieuDe}
THIET BI: ${tenCay}
CHI SO: ${doAm}%
THOI GIAN: ${thoiGian}
----------------------------
GHI CHU: ${huongDan}
    `.trim();
    bot
      .sendMessage(chatId, tinNhan)
      .then(() => console.log(`[Telegram] Da gui bao cao: ${loaiCanhBao}`))
      .catch((err) => console.error(" [Telegram] Loi:", err.message));
  },

  baoHeThongOnline: () => {
    if (bot && chatId) {
      bot.sendMessage(chatId, "HE THONG GIAM SAT 11A7: KHOI DONG THANH CONG");
    }
  },
};

module.exports = botMessage;
