export const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access Denied"
        });
      }
      next();
    } catch (error) {
      console.log("ROLE MIDDLEWARE ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Access denied"
      });
    }
  };
};
