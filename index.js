require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/routes");
const bodyParser = require("body-parser");

const register = require("./routes/register");
const login = require("./routes/login");
const rating = require("./routes/rating");

const app = express();

app.use("/api", routes);
app.use(register);
app.use(login);
app.use("/rating", rating);
app.use(bodyParser.json());



const mongoString = "mongodb://127.0.0.1:27017/kursova";
mongoose.connect(mongoString);

// const mongoString = process.env.DATABASE_URL;
// console.log(mongoString)
// mongoose.connect(mongoString);

// mongoose.connect(mongoString, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     ssl: true, // Enable SSL/TLS
//   });
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});





app.listen(5000, () => {
  console.log(`Run on port ${5000}`);
});


