const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const { populateDBWithCourseDetails, populateDBWithStudents, populateDbWithAdmin } = require("./utils/populateDB");
const AuthRoute = require("./routes/AuthRoute")
const CourseRoute = require("./routes/CourseRoute")
const QuestionRoute = require("./routes/QuestionRoute")
const UserRoute = require("./routes/UserRoute")

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('Connected to Database')
  // populateDbWithAdmin()
  // populateDBWithCourseDetails()
  // populateDBWithStudents() 
})

//middleware
const corsOption = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOption));
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use(UserRoute)
app.use(CourseRoute)
app.use(QuestionRoute)
app.use(AuthRoute)

app.listen(PORT, () => {
  console.log("Backend server is running on port " + PORT);
});
