const mongoose=require('mongoose')

const categorySchema= mongoose.Schema({
    name:{type:String, trim:true, required:true,}
})

const categoryModel= mongoose.model('category',categorySchema)

module.exports.Category=categoryModel