const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema({
    name:{
        required: true,
        type: String
    },
    toponyms: [{
        name:{
            required: true,
            type: String
        },
        description: {
            required: true,
            type: String
        }
    }]
})

module.exports = mongoose.model("region", regionSchema);