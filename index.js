const express = require('express');
const app = express();
const mongoose = require('mongoose');


app.use(express.json());

const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb+srv://techcareer_swift:qSJrSgUN9qfgs0Fa@cluster0.jcus0vv.mongodb.net/garanti-clean-code-db")
    .then(() => {
        console.log("Connected to database!");
    })
    .catch(() => {
        console.log("Connection failed!");
    });


const category = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
});

const Category = mongoose.model('Category', category);



app.get("/api/categories", async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
});

app.post("/api/categories", async (req, res) => {
    const category = new Category({
        name: req.body.name,
        description: req.body.description
    });
    await category.save();
    res.json(category);
})




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



//1. modellerimi ayrı bir dosyada tutmak istiyorum
//2. Post işlemi yaparken hata yakalamak istiyorum
//3. Post işleminde validation yapmak istiyorum
//4. Get işleminde hata yakalamak istiyorum