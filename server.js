const express =require('express')
const { request } = require('http');
const app=express();
const MongoClient=require('mongodb').MongoClient
const PORT=3000;
require('dotenv').config()
let path=require('path')

// Connecting to MongoDB
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'champs'
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })


//middleware
app.set('view engine','ejs')
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))
app.use(express.json())

// GET
app.get('/',async (req,res)=>{
    db.collection('champs').find().toArray()
    .then(data=>{
        res.render('index.ejs',{info:data})
    })
    .catch(error=>console.error(error))
}
)

// POST
app.post('/addChamp',(req,res)=>{
    console.log('hello')
    db.collection('champs').insertOne({champName:req.body.champName,champBirthLocation:req.body.champBirthLocation,champPic:req.body.champPic,completed:false})
    .then(result=>{
        console.log('Champ added')
        res.redirect('/')
    })
    .catch(error=>console.error)
})

app.delete('./deleteItem',(req,res)=>{
    db.collection('champs').deleteOne({champName:req.body.champName})
    .then(result=>{
        console.log("champ deleted")
        res.json("champ deleted")
    })
    .catch(error=>console.error(error))
})


// Connecting to local host
app.listen(process.env.PORT || PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})