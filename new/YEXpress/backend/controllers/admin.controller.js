const mongoose = require("mongoose")
const User = require("../models/user")
const Product = require("../models/product")
const ProductAttribute = require("../models/product_attribute")
const ProductVariant = require("../models/product_variant")
const ProductAttributeValue = require ("../models/product_attribute_value")
const logger = require("../utils/logger")
const addProduct= async (req,res) => {
   try {
    const { name, description, variants ,category_id } = req.body;

    const product = await Product.create({
        name,
        description,
        category_id
    });

    for (const variant in variants){
        const variantAttribute = []
        for (const attr in variant.attributes){
            let attribute = ProductAttribute.findOne({
                name : attr.name,
                category : category_id,
            });
            if (!attribute) ProductAttribute.create({
                name : attr.name,
                category : category_id,
                product : product._id,
            });
            let attributeValue = ProductAttributeValue.findOne({
                attribute : attribute._id,
                value : attr.value
            });
            if (!attributeValue) ProductAttributeValue.create({
                attribute : attribute._id,
                value : attr.value,
            }),
            variantAttribute.push({
                attribute : attribute._id,
                value : attributeValue._id
            })
        }
        await ProductVariant.create({
            product : product._id,
            price : variant.price,
            stock_quantity : variant.stock_quantity,
            attributes : variantAttribute
        })
    }
    res.status(201).json({message : "Product created succesfuly",product})
   } catch (error) {
    console.error(error);

    res.status(500).json({error : "Error Creating Product"})
   }
}

const viewAllUser =async(req, res) =>{
    try {
        allUsers = User.find({
            deleted : false
        })
    } catch (error) {
        
    }
}

module.exports = {
    addProduct,
    viewAllUser
}