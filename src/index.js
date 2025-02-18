const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const connectDB = require("./db/db");
const port = process.env.PORT;
const authRoutes = require("./routes/authRoutes");
const userSchema = require("./schemas/userSchema");
const { userCountersSchema, globalCountersSchema } = require("./schemas/scoreSchema");
const { createTable } = require("./utils/sqlFunctions");
const scoreRoutes = require("./routes/scoreRoutes");

const app = express();

app.use(cors({
  origin: process.env.DB_URL ? 'https://norgy-fe.onrender.com' : 'http://localhost:3000' ,  // Allow frontend origin
  credentials: true                 // Allow sending cookies/sessions
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", authRoutes);
app.use("/scores", scoreRoutes);

Promise.all([createTable(userSchema), createTable(userCountersSchema), createTable(globalCountersSchema)])
  .then(() => console.log("User/Counters tables verified/created successfully"))
  .catch((error) => console.error("Error creating counters tables:", error));

connectDB();

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
