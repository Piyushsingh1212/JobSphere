import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import connectDB from "./utils/db.js";

import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Absolute path for backend root
const __dirname1 = path.resolve();
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)



// ================= Middleware =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// ================= CORS Setup =================
const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true
}

app.use(cors(corsOptions))

// ================= API Routes =================
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);


// ================= Serve Frontend (Production Only) =================
if (process.env.NODE_ENV === "production") {
  // Serve React build folder
  app.use(express.static(path.join(__dirname1, "Frontend","vite-project", "dist")));

  // React Router Fix (Express v5 safe)
  app.get("/:splat*", (req, res) => {
    res.sendFile(
      path.join(__dirname1, "Frontend","vite-project", "dist", "index.html")
    );
  });
}


// ================= Start Server =================
app.listen(PORT, () => {
  connectDB();
  console.log(`✅ Server running at port ${PORT}`);
});
