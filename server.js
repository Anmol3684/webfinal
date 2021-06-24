/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: _______Nurten YILDIRIM_______________ Student ID: ____141346197__________ Date: ___2021/06/10_____________
*
* Online (Heroku) Link: _____https://afternoon-anchorage-52875.herokuapp.com/___________________________________________________
********************************************************************************/
var express = require("express");
var app = express();
var path = require("path");
const data = require('./data-service.js');
var multer = require('multer');
var fs = require('fs');
var bodyParser = require ('body-parser');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

var HTTP_PORT = process.env.PORT || 8080;

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
     filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalName));
    }
  });
   const upload = multer({ storage: storage });

  function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
//HOME
  app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/views/home.html"));
});
//ABOUT
app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
}); 
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname,"/views/error.html"));
 });
}
//EMPLOYEES
app.get("/employees/add", (req,res)=>{
    res.sendFile(path.join(__dirname,"/views/addEmployee.html")); 
});
app.post("/employees/add",(req, res) => {
    data.addEmployee(req.body).then(res.redirect('/employees'));
  });
  app.get("/employees",(req,res)=>{
    data.getAllEmployees().then((data) =>{
    res.json(data);
    });
});
app.get("/employee/:value",(req, res) => {
   data.getEmployeeByNum(req.params.value).then((data) =>{
       res.json(data);
   });
 });
 app.get("/employees",(req,res)=>{
   if(req.query.status){
       data.getEmployeesByStatus(req.query.status).then((data) =>{
           res.json(data);
       });
   }
   else if(req.query.department){
       data.getEmployeesByDepartment(req.query.department).then((data) =>{
           res.json(data);
       });
   }
   else if(req.query.manager){
       data.getEmployeesByManager(req.query.manager).then((data) =>{
           res.json(data);
       });
   }
   else
    data.getAllEmployees().then((data) =>{
    res.json(data);
    });

});

app.get("/employee/:value",(req, res) => {
   data.getEmployeeByNum(req.params.value).then((data) =>{
       res.json(data);
   });
 });
 //DEPARTMENTS
 app.get("/departments",(req,res)=>{
    data.getDepartments().then((data) =>{
     res.json(data);
     });
 });
 app.get("/departments",(req,res)=>{
    data.getDepartments().then((data) =>{
     res.json(data);
     });
 });
 //MANAGERS
 app.get("/managers",(req,res)=>{
    data.getManagers().then((data) =>{
    res.json(data);
     });
 });
 app.get("/managers",(req,res)=>{
    data.getManagers().then((data) =>{
    res.json(data);
     });
 });
//IMAGES
app.get("/images/add", (req,res)=>{
    res.sendFile(path.join(__dirname,"/views/addImage.html")); 
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});
app.get("/images",(req,res)=>{
    fs.readdir(("./public/images/uploaded"), (err, items) => {   
        
        res.json({"images":items});
    });
});

data.initialize().then(function(){
    app.listen(HTTP_PORT, onHttpStart);
}).catch(function(err){
    console.log("Unable to start server:" + err);
});

