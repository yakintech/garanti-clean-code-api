const express = require('express');
const app = express();
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/user');
const jsonwebtoken = require('jsonwebtoken');
const authMiddleware = require('./middleware/authMiddleware');



require('dotenv').config()

app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
})

// Apply the rate limiting middleware to all requests.
// app.use(limiter)

app.use(authMiddleware);


const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to database!");
    })
    .catch(() => {
        console.log("Connection failed!");
    });



app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

