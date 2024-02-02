const express = require('express');

const Model = require('../models/region')
const router = express.Router()

// Add this middleware to parse JSON
router.use(express.json());

module.exports = router;

//Post Method
router.post('/post', async (req, res) => {
    const data = {
        name: req.body.toponym,
        description: req.body.description
    }

    const regionName = req.body.regionName;

    try {
        let foundObject = await Model.findOne({ name: regionName });

        if (foundObject) {
            foundObject.toponyms.push(data);
        } else {
            foundObject = new Model({
                name: regionName,
                toponyms: [data]
            });
        }

        const result = await foundObject.save();
        console.log("Об'єкт успішно додано: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

//Get all Method
router.get('/getAll', async (req, res) => {
    try{
        const data = await Model.find();
        res.json(data);
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by ID Method
router.get('/getOne/:id', async (req, res) => {
    try {
        const data = await Model.findById(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Update by ID Method
router.patch('/update/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const updateData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(
            id, updateData, options
        )

        res.send(result);
    } 
    catch (error){
        res.status(400).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/delete/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id);
        res.send(`Document with ${data.name} has been deleted....`)

    }
    catch (error){
        res.status(400).json({message: error.message})
    }
})