const User = require("../models/user");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const userController = {
    token: async (req, res) => {
        req.body.email = req.body.email.trim().toLowerCase();
        const { email, password } = req.body;

        try {

            const user = await User.findOne({ email, isActive: true});
            if (!user) {
                return res.status(404).json({ message: "Invalid email or password" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(404).json({ message: "Invalid email or password" });
            }

            //kullanıcı email ve şifre doğruysa bir token üretiyorum.
            const token = jsonwebtoken.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return res.status(200).json({ token });
        }
        catch (error) {
            console.log("/api/login error", error);
            return res.status(500).json(error);
        }
    },
    getAll: async (req, res) => {
        try {
            const users = await User.find({ isActive: true, isConfirm: true });
            return res.json(users);
        }
        catch (error) {
            console.log("/api/users error", error);
            return res.status(500).json(error);
        }
    },
    create: async (req, res) => {
        let email = req.body.email.trim().toLowerCase();

        let password = req.body.password;
        const salt = bcrypt.genSaltSync(10);
        password = bcrypt.hashSync(password, salt);

        try {
            const existingUser = await User.findOne({ email, isConfirm: true });
            if (existingUser) {
                return res.status(404).json({ message: "User with this email already exists" });
            }

            const user = new User({
                email,
                password,
                isConfirm: true
            });
            await user.save();
            return res.status(201).json({ id: user._id, email: user.email });
        }
        catch (error) {
            console.log("/api/users error", error);
            return res.status(500).json(error);
        }
    }
}

module.exports = userController;



//#region kodun ilk hali

// token: async (req, res) => {

//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email, password });
//         if (!user) {
//             return res.status(400).json({ message: "Invalid email or password" });
//         }

//         //kullanıcı email ve şifre doğruysa bir token üretiyorum.
//         const token = jsonwebtoken.sign(email, "secret_key")

//         return res.json(token);
//     }
//     catch (error) {
//         console.log("/api/login error", error);
//         return res.status(500).json(error);
//     }

// }

//#endregion


//token endpoint codereview notları
//1. secret key bir env dosyasına taşınmalı
//2. email trim ve lowercase yapılmalı
//3. email ve password validation yapılmalı ( userroutes kısmına eklendi)
//4. token expiration süresi eklenmeli
//5. token içerisinde emaili json olarak sakladım
//6. token dönüşü json olarak yapıldı
//7. error handling yapıldı
//8. status code lar eklendi


//create endpoint codereview notları
//1. validation yapılmalı
//2. password hashlenmeli
//3. response olarak sadece id ve email dönülmeli
//.4 two factor authentication eklenmeli


