const config=require('config')
const jwt=require('jsonwebtoken')
const _=require('lodash')
const express= require('express')
const router=express.Router()
const bcrypt=require('bcrypt')
const joi=require('joi')
const admin=require('../middleware/admin')
const {User,validate}= require('../model/user')  
const auth= require('../middleware/auth')



router.get('/me', auth,async(req,res)=>{
    const user= await User.findById(req.user._id).select('-password')
    res.send(user)
   }) 
      
   router.post('/SignUp',async (req,res)=>{
       const {error}= validate(req.body)
       if(error) return res.status(400).send(error.details[0].message)
   
       let user =await User.findOne({email:req.body.email});
          if(user) return  res.status(400).send('User already registered')
        user= new User(
          _.pick(req.body,['name','email','password','isAdmin']))
          const salt=await bcrypt.genSalt(10);
          user.password =await bcrypt.hash(user.password,salt)
       user=await user.save() 
      // const token=user.generateAuthToken();
      // res.header('x-auth-token',token).send( _.pick(user,['_id','name', 'email']))
      res.send( _.pick(user,['_id','name', 'email']))
   })

router.post('/signin',async(req,res)=>{
   
    const {error} = validateSignin(req.body)
    if(error) res.status(400).send(error.details[0].message)

    let user =await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send('Invalid email or password')
    
    const validPassword=await bcrypt.compare(req.body.password,user.password)
    if(!validPassword)
     res.status(400).send('Invalid email or password')   
     const token=jwt.sign({id:user._id,name:user.name,Email:user.email,Admin:user.isAdmin},config.get('jwtPrivateKey'))
     res.cookie('t',token, {expire: new Date() + 9999})
     res.header('x-auth-token',token).send({token})

})

router.get('/signout',(req,res)=>{
    res.clearCookie('t')
    res.json({message:'Signout Succuss'})

})

function validateSignin(input)
{
    const schema=joi.object({
        email:joi.string().min(5).max(40).required().trim(),
        password:joi.string().trim().min(8).required().trim()
    })

    return schema.validate(input.body)
}
module.exports=router