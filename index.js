const express = require("express");
const cors = require("cors");
const db = require("./db");
const adminAuthRoutes = require("./routes/adminAuth");
const swaggerDocs = require("./swagger/swagger");
const uploadProductImg = require("./routes/UploadProductImg");
const authRoutes = require("./routes/auth");
const path = require("path");
const app = express();
app.use(cors());
app.use(express.json());

swaggerDocs(app);

// Test endpoint
app.get("/", (req, res) => {
  res.send("ONLY FOR TEST PURPOSE! (Stag)");
});

// Auth routes
app.use("/api", authRoutes); // POST /api/signup, POST /api/login
app.use("/api/admin", adminAuthRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "../../frontend/public/uploads")));
app.use("/api/upload", uploadProductImg);
app.listen(5000, () =>
  console.log("🚀 Server running on http://localhost:5000")
);
