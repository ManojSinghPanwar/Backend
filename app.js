const express= require('express')
const mongoose=require('mongoose')
const morgan=require('morgan')
const userRoute= require('./routes/Userroute')
const cookie=require('cookie-parser')
const app=express()
const config=require('config')
const category=require('./routes/category')
const product=require('./routes/product')
const cors=require('cors')


if(!config.get('jwtPrivateKey')){
    console.log('FATLA ERROR: jwtPrivateKey is not defined.');
    process.exit(1)  
}
mongoose.connect('mongodb://localhost:/centralperk',{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log('Connected to Database'))
.catch(err=>console.log(err.message))

app.use(express.json())
app.use(cors())
app.use(express.static('./routes/uploads'))
app.use(cookie())
app.use('/api/User',userRoute)
app.use('/api/category',category)
app.use('/api/Product',product)
app.listen(8000,(req,res)=>{
    console.log('Server is running on port 3000')
})