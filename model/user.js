const config=require('config')
const jwt=require('jsonwebtoken')
const mongoose= require('mongoose')
const joi= require('joi')

const userSchema= mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        maxlength:32,
        minlength:5
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
        maxlength:32
    },
    password:{
        type:String,
        trim:true,
        minlength:8,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
})
userSchema.methods.generateAuthToken = function(){
    const token=jwt.sign({_id: this._id,isAdmin:this.isAdmin},config.get('jwtPrivateKey'))
    return token
}

const user= mongoose.model('users',userSchema)

function validateUser(input)
{
    const schema=joi.object({
        name:joi.string().min(5).max(32).required().trim(),
        email:joi.string().min(5).max(32).required().trim(),
        password:joi.string().trim().min(8).required()
    })

    return schema.validate(input.body)
}

module.exports.User=user
module.exports.validate=validateUser