const { default: mongoose } = require("mongoose");


const user = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}
    , {
        timestamps: true
    });

const User = mongoose.model('User', user);

module.exports = User;