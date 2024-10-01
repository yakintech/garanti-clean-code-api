const User = require("../models/user");
const jsonwebtoken = require("jsonwebtoken");


const userController = {
    token: async (req, res) => {

        req.body.email = req.body.email.trim().toLowerCase();
        const { email, password } = req.body;



        try {
            const user = await User.findOne({ email, password });
            if (!user) {
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

