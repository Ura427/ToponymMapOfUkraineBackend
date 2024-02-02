const express = require("express");
const { Pool } = require("pg");


const app = express();

const router = express.Router();

module.exports = router;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "kursova",
    password: "123",
    port: 5432
})


router.post("/getAvgRating", async(req, res) => {
    const { toponym } = req.body;
    console.log("//////////////////////")
    console.log(toponym);
    let client;

    try{
        client = await pool.connect();

        const avgQuery = "SELECT AVG(rating) FROM rating WHERE toponym = $1";
        const result = await client.query(avgQuery, [toponym]);

        console.log(result);
        const avgRating = result.rows[0].avg;
        console.log(avgRating);
        const roundedAvgRating = + (Math.round(avgRating + "e+2")  + "e-2");
        console.log(roundedAvgRating)
        res.json({ roundedAvgRating })
    } catch(error){
        console.error("ERROR: " + error);
        return res.status(500).json({ message: "Помилка сервера"});
    } finally{
        client.release();
    }
})


router.post("/add", async(req,res) => {
    const { region, toponym, rating, user_id} = req.body;

    console.log( region, toponym, rating, user_id);


    let client;

    try{
        client = await pool.connect();

        const selectQuery = "SELECT * FROM rating WHERE toponym = $1 AND user_id = $2";
        const result = await client.query(selectQuery, [toponym, user_id]);
        

        if(result.rows.length > 0){
            const updateQuery = "UPDATE rating SET rating = $1 WHERE toponym = $2 AND user_id = $3";
            console.log("UPDATE")
            await client.query(updateQuery, [
                rating,
                toponym,
                user_id]);
            return res.status(201).json({ message: "Додавання даних пройшло успішно"})
        }

        const insertQuery = "INSERT INTO rating (region, toponym, rating, user_id) VALUES ($1, $2, $3, $4)";
        console.log("INSERT");
        await client.query(insertQuery, [
            region, 
            toponym, 
            rating, 
            user_id]);


        return res.status(201).json({message: "Оновлення даних пройшло успішно"})

        // return res
        // .status(400)
        // .json({message: "Цей користувач вже поставив відгук"})
    } catch(error) {
        console.error("Помилка запиту: " + error);
        res.status(500).json({message: "Помилка сервера"})
    } finally{
        client.release();
    }
})