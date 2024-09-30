const { default: mongoose } = require("mongoose");

const category = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
},
    {
        timestamps: true
    });

const Category = mongoose.model('Category', category);

module.exports = Category;


//her modelde bir timestamps olacak. Bu sayede her modelde oluşturulma ve güncellenme tarihleri otomatik olarak kaydedilecek.

//iyi bir db modelinde eklenme tarihi, güncellenme tarihi, silinme tarihi, ekleyen userId, güncelleyen userId, silenUserId, datanın isDeleted veya isActive gibi bir alanı, data hakkında notlar gibi alanlar olabilir. Bu alanlar her modelde olacak şekilde bir yapı oluşturulabilir. Bu sayede her modelde bu alanları tekrar tekrar tanımlamak zorunda kalmayız. Bu sayede kod tekrarını önlemiş oluruz.