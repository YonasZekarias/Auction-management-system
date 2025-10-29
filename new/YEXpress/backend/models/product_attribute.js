const mongoose = require('mongoose');

const ProductAttribute = new mongoose.Schema({
    product: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product',
        required : true
    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category',
    },
    name : {
        type : String,
        required : true 
    }
})

module.exports = mongoose.model('ProductAttribute', ProductAttribute);