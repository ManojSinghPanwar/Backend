const express=require('express')
const router=express.Router()
const admin=require('../middleware/admin') 
const auth= require('../middleware/auth')
const {Category}=require('../model/category')
const joi =require('joi')

router.get('/Categories',async(req,res)=>{
    const cat= await Category.find()
    res.send(cat)
})

router.post('/AddCategory',auth,admin,async (req,res)=>{
    const {error}= validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    const  name =await Category.findOne({name:req.body.name});
          if(name) return res.status(400).send('Category Already Present')

    let category= new Category({
        name:req.body.name
    })
    
    category= await category.save()
    res.send(category)
})



function validate(input) {
    const Schema= joi.object({
        name:joi.string().required().max(30)

        
    })

    return  Schema.validate(input.body)
}

module.exports=router