const db = require("../config/database");

const User = {
  findByUsername: async (username) => {
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    return rows[0];
  },
  create: async (username, hashedPassword) => {
    return await db.execute(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword],
    );
  },
};

module.exports = User;
