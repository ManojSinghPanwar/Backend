const mongoose=require('mongoose')
const joi=require('joi')
const {Category}= require('../model/category')

const productSchema= mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        maxlength:50, 
    },
    description:{
        type:String,
        required:true,
        maxlength:2000, 
    },
    price:{
        type:Number,
        trim:true,
        required:true,
        maxlength:32, 
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    quant:{
        type:Number,
    },
    photo:{
        type:String,
        required:true
    }
})

const productModel=mongoose.model('products',productSchema)

module.exports.Product=productModel