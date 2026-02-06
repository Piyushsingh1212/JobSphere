import app from "../Backend/app.js";
import connectDB from "../Backend/utils/db.js";

let dbConnected = false;

export default async function handler(req, res) {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (err) {
      console.error("DB connect error:", err);
    }
  }

  return app(req, res);
}
