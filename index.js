const { faker } = require('@faker-js/faker');

const mysql=require('mysql2');

const express=require('express');
const app = express();

const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.use(express.static(path.join(__dirname, "public")));

const methodOverride=require('method-override');
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'my_app',
  password:'ajlm786@M!'
});


let getRandomUser=()=> {
  return [
     faker.string.uuid(),
     faker.internet.username(),
    faker.internet.email(),
     faker.internet.password(),
    
  ];
}
// let data=[];
// data.push(getRandomUser());

app.get("/",(req,res)=>{
    let q='SELECT count(*) FROM user';
    try{
    connection.query(q,(err,result)=>{
        if(err) throw err;
        let count =result[0]["count(*)"];

        res.render("home.ejs",{count});
    });
    }catch(err){
    console.log(err);
    res.send("Some error in DB");
    }

});

app.get('/user',(req,res)=>{
    let q='SELECT * FROM user';
    try{
    connection.query(q,(err,users)=>{
        if(err) throw err;
        res.render("showuser.ejs",{users});
    });
    }catch(err){
    console.log(err);
    res.send("Some error in DB");
    }

});

app.get('/user/:id/edit',(req,res)=>{
    let {id}=req.params;
    let q=`SELECT * FROM user WHERE id='${id}'`;
    try{
    connection.query(q,(err,result)=>{
        if(err) throw err;
       let user=result[0];
       
        res.render("edit.ejs",{user});
    });
    }catch(err){
    console.log(err);
    res.send("Some error in DB");
    }
    
});

app.patch('/user/:id',(req,res)=>{
     let {id}=req.params;
    let q=`SELECT * FROM user WHERE id='${id}'`;
    let {password:formPass,email:formEmail}=req.body;
    try{
    connection.query(q,(err,result)=>{
        if(err) throw err;
       let user=result[0];
       if(formPass!=user.password){
        res.send("wrong password");
       }else{
        let q2=`UPDATE user SET email='${formEmail}' WHERE id='${id}'`;
        connection.query(q2,(err,result)=>{
            if(err) throw err; 
            res.redirect("/user");
        });
       }
        
    });
    }catch(err){
    console.log(err);
    res.send("Some error in DB");
    }
});


app.listen("8080",()=>{
    console.log("app is working on 8080");
});

// try{
//     connection.query(q,[data],(err,result)=>{
//         if(err) throw err;
//         console.log(result);
//     });
// }catch{
//     console.log(err);
// }


