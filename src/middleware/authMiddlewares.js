// src/middleware/authMiddlewares.js
const authMiddleware = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect("/login");
};

module.exports = authMiddleware; // Dòng này cực kỳ quan trọng
