const mongoose = require('mongoose');

const productAtributeValueSchema = new mongoose.Schema({
    attribute: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "ProductAttribute",
        required: true
    },
    value : {
        type: String,
        required: true  
    },
})

module.exports = mongoose.model('ProductAttributeValue', productAtributeValueSchema);