const express=require("express"); 
const app=express();
const userRoutes=require('./routes/user')
const adminRoutes=require('./routes/admin')
const path=require('path')
const hbs=require('hbs');

const connectDB = require("./db/connectDB");
const  session=require("express-session")
const nocache=require('nocache');

//view engine setup
app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs')

app.use(nocache())

app.use(session({
    secret: "Your_secret",
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge: 1000 * 60 * 40
    }
}))
//static assets
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json());

app.use('/user',userRoutes)
app.use('/admin',adminRoutes)

connectDB();

app.listen(3001,()=>{ console.log("server started at:http://localhost:3001")})

