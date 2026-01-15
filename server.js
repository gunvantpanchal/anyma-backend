const Connection = require("./config/dBConnect");
const app = require("./config/expressConfig");
const http = require("http");
const PORT = process.env.PORT || 8000;

(async () => {
  try {
    await Connection();
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  } catch (err) {
    console.error("Failed to start server due to DB connection error:", err?.message || err);
    process.exit(1);
  }
})();

