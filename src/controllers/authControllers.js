const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const renderAuth = (req, res) => {
  res.render("auth", { error: null, success: null });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.userId = user.id;
      req.session.username = user.username;
      return res.redirect("/");
    }
    res.render("auth", {
      error: "Tài khoản hoặc mật khẩu không đúng",
      success: null,
    });
  } catch (e) {
    res.status(500).send("Lỗi Server");
  }
};

const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await User.findByUsername(username);
    if (existing)
      return res.render("auth", {
        error: "Tên đăng nhập đã tồn tại",
        success: null,
      });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create(username, hashedPassword);

    res.render("auth", { error: null, success: "Đăng ký thành công!" });
  } catch (e) {
    // QUAN TRỌNG: Dòng này sẽ cho bạn biết lỗi thực sự là gì
    console.error("=== LỖI ĐĂNG KÝ CHI TIẾT ===");
    console.log(e);
    res.status(500).send("Lỗi hệ thống: " + e.message);
  }
};

const logout = (req, res) => {
  req.session.destroy(() => res.redirect("/auth"));
};

module.exports = { renderAuth, login, register, logout };
