const express=require("express");
const app=express();
const {db, Users}=require("./db");
const path=require("path");
const passport=require('passport');
const routes=require('./Routes/index.js');

const PORT=process.env.PORT||5000;

app.use(express.urlencoded({extended:true}));

app.use(express.json())

app.set("view engine","ejs");
app.set("views",path.join(__dirname,'views'));
app.get('/',routes);
app.post('/register',routes);
app.get('/register',routes);
app.get('/login',routes);
app.post('/login',routes);
app.get('/success',routes);
app.get('/logout',routes);
app.post('/addmsg',routes);
app.get('/data',routes);
db.sync().then(()=>{
    app.listen(PORT,()=>{
        console.log("SERVER IS UP ON PORT 5000")
    })
}).catch(console.error);

