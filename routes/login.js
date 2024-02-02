const express = require("express");
const router = express.Router();

const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.use(express.json());

module.exports = router;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "kursova",
  password: "123",
  port: 5432,
});

router.post("/login", async (req, res) => {
  const { userEmail, userPassword } = req.body;

  console.log("|||||||||||||||||||||||||||||||");
  console.log("Node Login");
    console.log("INSIDE LOGIN.js");

    console.log(userEmail);
    console.log(userPassword);

  let client;

  try {
    client = await pool.connect();

    const query = "SELECT * FROM users WHERE email = $1";
    const result = await client.query(query, [userEmail]);

    if(result.rows.length === 1){
        const user = result.rows[0];
        console.log(user);
        console.log(user.password + "  " + userPassword);
        const passwordMatch = await user.password === userPassword;

        if(passwordMatch){
            console.log("Користувач увійшов");
            return res.status(200).json({ message: "Увійшов успішно", user});
        }

        // return res.status(400).json({ message: "Неправильний пароль"});
    }

    return res.status(400).json({ message: "Неправильний логін або пароль"});

  } catch (error) {
    console.error("Помилка запиту: ", error.message);
    return res.status(500).json({ message: "Помилка сервера"})
  } finally {
    client.release();
}
});
