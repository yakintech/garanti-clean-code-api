const express = require('express');
const app = express();
const mongoose = require('mongoose');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');

require('dotenv').config()




app.use(express.json());

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to database!");
    })
    .catch(() => {
        console.log("Connection failed!");
    });


    
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


