const mongoose = require('mongoose');

const productVariantSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    price : {
        type: Number,
        required: true  
    },
    sku : {
        type: String,
        required: false,
        // unique: true   
    },
    stock_quantity : {
        type: Number,
        required: true  
    },
    attributes: [
        {
            attributes : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "ProductAttribute"
            },
            value : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "ProductAttributeValue"
            }
        }
    ]
})
module.exports = mongoose.model('ProductVariant', productVariantSchema);