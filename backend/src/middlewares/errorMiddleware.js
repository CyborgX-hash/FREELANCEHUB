function errorHandler(err, req, res, next) {
    console.error("Global Error:", err);
  
    res.status(err.statusCode || 500).json({
      ERROR: err.message || "Internal Server Error",
    });
  }
  
module.exports = errorHandler;