/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Nurten YILDIRIM Student ID: 141346197 Date: 2021/06/10
*
* Online (Heroku) Link: https://afternoon-anchorage-52875.herokuapp.com
********************************************************************************/

var express = require("express");
var app = express();
var path = require("path");
const data = require('./data-service.js');

var multer = require('multer');
var fs = require('fs');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));



var HTTP_PORT = process.env.PORT || 8080;

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
    const upload = multer({ storage: storage });

  function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

//IMAGE MODIFIED
app.get("/images/add", (req,res)=>{
    res.sendFile(path.join(__dirname,"/views/addImage.html")); 
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

app.get("/images",(req,res)=>{
    fs.readdir(("./public/images/uploaded"), (err, images) => {   
        res.json({"images":images});
    });
});



//EMPLOYEES MODIFIED
app.get("/employees/add", (req,res)=>{
    res.sendFile(path.join(__dirname,"/views/addEmployee.html")); 
});

app.post("/employees/add",(req, res) => {
    data.addEmployee(req.body).then(res.redirect('/employees'));
  });

 
//MAIN PART
app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/views/home.html"));
});

app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

app.get("/employee/:id",(req, res) => {
    data.getEmployeeByNum(req.params.id).then((data) =>{
        res.json(data);
    });
  });

 app.get("/departments",(req,res)=>{
    data.getDepartments().then((data) =>{
     res.json(data);
     });
 });

app.get("/managers",(req,res)=>{
    data.getManagers().then((data) =>{
    res.json(data);
     });
 });


//EMPLOYEES MODIFIED
app.get("/employees",(req,res)=>{

    if(req.query.department){
        data.getEmployeesByDepartment(req.query.department).then((data) =>{
            res.json(data);
        });
    }
    else if(req.query.manager){
        data.getEmployeesByManager(req.query.manager).then((data) =>{
            res.json(data);
        });
    }
   else if(req.query.status){
        data.getEmployeesByStatus(req.query.status).then((data) =>{
            res.json(data);
        });
    }
    else
     data.getAllEmployees().then((data) =>{
     res.json(data);
     });

 });
 app.use((req,res)=>{
    res.sendFile(path.join(__dirname,"/views/error.html"));
});

// setup http server to listen on HTTP_PORT

data.initialize().then(function(){
    app.listen(HTTP_PORT, onHttpStart);
}).catch(function(err){
    console.log("Unable to start server:" + err);
});


