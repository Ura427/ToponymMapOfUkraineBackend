const express = require("express");

const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const router = express.Router();


router.use(express.json())

module.exports = router;


const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "kursova",
    password: "123",
    port: 5432
})



router.post("/register", async (req, res) => {

    const { userFirstName, userLastName, userEmail, userPassword } = req.body;

    const firstName = userFirstName;
    const lastName = userLastName;
    const email = userEmail;
    const password = userPassword;

    console.log("///////////////////////////////");
    console.log("Node Register");
    console.log("INSIDE REGISTER.js")

    let client;

    try{
        client = await pool.connect();


        const query = "SELECT id FROM users WHERE email = $1"
        const result = await client.query(query, [email])


        if(result.rows.length > 0) {
            return res
            .status(400)
            .json({message: "Користувач з таким email вже існує"})
        }




        //hashing password



        const insertQuery = 
        "INSERT INTO users (firstName, lastName, email, password) VALUES ($1, $2, $3, $4)";

        await client.query(insertQuery, [
            firstName,
            lastName,
            email,
            password
        ])


        return res.status(201).json({ message: "Реєстрація пройшла успішно"});
    } catch (error){
        console.error("Помилка запиту");
        return res.status(500).json({message: "Помилка серверу"});
    } finally{
        client.release();
    }


})