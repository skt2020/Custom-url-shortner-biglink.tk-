const express=require('express');
const shortId=require('shortid');
const createHttpError=require('http-errors');
const mongoose=require('mongoose');
const path=require('path');
const urlhref =require('url');
const URI="mongodb+srv://dbUser:dbUser@cluster0.r7bte.mongodb.net/url-shortner?retryWrites=true&w=majority"
const ShortUrl=require('./models/url.model')
const app=express();
const port = process.env.PORT || 1337;
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json())
app.use(express.urlencoded({extended:false}))
/////////////////////////////////////


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://dbUser:dbUser@cluster0.r7bte.mongodb.net/url-shortner?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });



///////////////////////////

mongoose.connect(URI,{
    dbName:'url-shortner',
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=>console.log('mongoose connected'))
.catch((error)=>console.log('Error in mongodb connection:'+ error))


app.set('view engine','ejs');



app.get('/:shortId',async(req,res,next)=>{
   try {
    const {shortId}=req.params
    const result=await ShortUrl.findOne({shortId})
    if(!result){
            throw createHttpError.NotFound('short url does not exist')
    }
    res.redirect(result.url)
   } catch (error) {
       next(error)
   }
   
})





app.get('*',async(req,res,next)=>{
    
     var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        console.log("fullUrl: "+fullUrl);
        res.render('index')
        //res.end("Hello World!");
})

app.post('/',async(req,res,next)=>{
    try{
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        console.log("fullUrl: "+fullUrl);
            const {url}=req.body
            const {custom}=req.body
           
            if(!url){
                throw createHttpError.BadRequest('Provide a Valid URL')
            }
            else{

                if(!custom){
                
                    const UrlExists= await ShortUrl.findOne({url})
                    if(UrlExists){
                        res.render('index',{short_url: `${fullUrl}${UrlExists.shortId}`})
                        return
                    }
                    const shortUrl= new ShortUrl({url:url,shortId:shortId.generate()})
                    const result=await shortUrl.save()
                    res.render('index',{short_url:`${fullUrl}${result.shortId}`})
                }
                else{
                        
                   
                    const customExists= await ShortUrl.findOne({custom})

                    if(customExists){
                       
                        throw createHttpError.BadRequest('Custom URL is already Existed. Enter another Custom URL or leave it empty.')
                    }
                    else{
                        const shortUrl= new ShortUrl({url:url,shortId:custom,custom:custom})
                        const result=await shortUrl.save()
                        res.render('index',{short_url:`${fullUrl}${result.shortId}`})
    
                    }
    
                  
                }

            }
            
         

    }catch(error){
        next(error)
    }

})


//here

app.use((req,res,next)=>{
next(createHttpError.NotFound())
})


app.use((err,req,res,next)=>{
    res.status(err.status||500)
    res.render('index',{error: err.message})
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

/*
const express=require('express');
const app=express();
const port = process.env.PORT || 1337;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
*/
