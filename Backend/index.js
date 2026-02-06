import app from "./app.js";
import connectDB from "./utils/db.js";

const PORT = process.env.PORT || 8000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
  });
};

start();
