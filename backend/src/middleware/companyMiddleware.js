

module.exports = function companyMiddleware(req, res, next) {
  if (req.user.role !== "company_hrd") {
    return res.status(403).json({
      message: "Akses ditolak. Bukan Admin AUM",
    });
  }
  next();
};
