const express=require('express')
const formidable=require('formidable')
const _=require('lodash')
const router=express.Router()
const admin=require('../middleware/admin') 
const auth= require('../middleware/auth')
const {Product}=require('../model/product')
const joi =require('joi')
const fs=require('fs')
const multer=require('multer')

const storage= multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,'./routes/uploads/')
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
})

 const fileFilter= (req,file,cb)=>{
      if(file.mimtype==='image/jpeg' || file.mintype==='image/png')
      {
          cb(null,true);
      }
      else
      {
          cb(null,false)
      }
}
 const upload=multer({
    storage: storage,limits:{
    fileSize:1024*1024*5
 },
//  fileFilter:fileFilter
})

//const upload=multer({dest:'uploads'});


router.get('/productPhoto/:id',async(req,res)=>{
    const pro= await Product.findById(req.params.id)
    if(!pro) return res.status(404).send('Wrond id passed')
    res.send(pro)
  
})

router.get('/productbasedcategory/:id',async(req,res)=>{
    const pro= await Product.find({category:req.params.id})
    if(!pro) return res.status(404).send('Wrond id passed')
    res.send(pro)
})


router.get('/product/:id',async(req,res)=>{
    const cat= await Product.findById(req.params.id)
    if(!cat) return res.status(404).send('Wrond id passed')   
    res.send(cat)
})
router.get('/products',async(req,res)=>{
    const cat= await Product.find()
    res.send(cat)
})
   
router.delete('/Deleteproduct/:id',auth,admin, async(req,res)=>{
    const product=await Product.findByIdAndDelete(req.params.id)
    if(!product) return res.status(404).send('Wrond id passed')
    res.send(product)
})

router.post('/addProduct',upload.single('photo'),auth,admin,async(req,res)=>{
 console.log(req.file)
 //const {error}= validate(req.body)
 //if(error) return res.status(400).send(error.details[0].message)
 const  name =await Product.findOne({name:req.body.name});
       if(name) return res.status(400).send('Product Already Present')

 let product= new Product({
     name:req.body.name,
     price:req.body.price,
     quant:req.body.quant,
     description:req.body.description,
     category: req.body.category,
     photo: req.file.originalname
 })
 
 product= await product.save()
 res.send(product)
})

router.put('/UpdateProduct/:id',upload.single('photo'),auth,admin,async(req,res)=>{
   
    //const {error}= validate(req.body)
    //if(error) return res.status(400).send(error.details[0].message)
    const  product =await Product.findByIdAndUpdate(req.params.id,{name:req.body.name,
        price:req.body.price,
        quant:req.body.quant,
        description:req.body.description,
        category: req.body.category},{useFindAndModify:false,new:true});

        if(!product) return res.status(404).send('Wrong id passed')

        res.send(product)
   })
   


/*router.put('/Updateproduct/:id',auth,admin,(req,res)=>{
    let form= new formidable.IncomingForm()
    form.keepExtensions=true
    form.parse(req, (err,fields,files)=>{
        if(err) return res.status(400).send(err,'Something went Wrong')
 

        const {name, description,price, category,quantity}= fields

     //   if(!name || !description || !price || !category || !quantity)  return res.status(400).send("All filed are required" )

        let product= Product.findById(req.params.id)

        product= _.extend(product,fields)
   
        if(files.photo)
        {
            if(files.photo.size>1000000)  return res.status(400).send("Image size should be less then 1 mb")
            product.photo.data= fs.readFileSync(files.photo.path)
            product.photo.contentType=files.photo.type
        }

        product.save((err,result)=>{
          if(err) return res.status(400).send(err,'Something went Wrong')

          res.send(result)
      })
  

    })
    
})*/

/*router.post('/AddProduct',auth,admin,async (req,res)=>{

          let form= new formidable.IncomingForm()
          form.keepExtensions=true
          form.parse(req, (err,fields,files)=>{
              if(err) return res.status(400).send(err,'Something went Wrong')
       

              const {name, description,price, category,quantity}= fields

              if(!name || !description || !price || !category || !quantity)  return res.status(400).send("All filed are required" )

              let product= new Product(fields)
         
              if(files.photo)
              {
                  if(files.photo.size>1000000)  return res.status(400).send("Image size should be less then 1 mb")
                  product.photo.data= fs.readFileSync(files.photo.path)
                  product.photo.contentType=files.photo.type
              }

              product.save((err,result)=>{
                if(err) return res.status(400).send(err,'Something went Wrong')

                res.send(result)
            })
        
    
          })
})*/

/*router.put('/updateProduct/:id',auth,admin,(req,res)=>{
    const product = Product.findById(req.params.id)
    if(product==null) return res.status(400).send('Product not found') 
})
*/
module.exports=router