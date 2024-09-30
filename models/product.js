const { default: mongoose } = require("mongoose");


const product = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    images: [{
        type: String
    }],
}
    , {
        timestamps: true
    });

const Product = mongoose.model('Product', product);