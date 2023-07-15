const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");

dotenv.config();
const app = express();
const PORT = process.env.port || 5000;

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to Database'))

//middleware
const corsOption = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOption));
app.use(express.json());
app.use(helmet());

app.listen(PORT, () => {
  console.log("Backend server is running on port " + PORT);
});
