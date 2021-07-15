/*********************************************************************************
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Nurten YILDIRIM___________ Student ID: _141346197___________ Date: ___2021/07/16_____________
*
* Online (Heroku) Link: ________________________________________________________
*
********************************************************************************/

var express = require("express");
var app = express();
var path = require("path");
const data = require('./data-service.js');
var multer = require('multer');
var fs = require('fs');
var bodyParser = require('body-parser');

var exphbs = require('express-handlebars');

app.engine('.hbs', exphbs({ extname: '.hbs' ,
helpers:{
    navLink: function(url, options){ return '<li' +
((url == app.locals.activeRoute) ? ' class="active" ' : '') +
'><a href="' + url + '">' + options.fn(this) + '</a></li>'; },

equal: function (lvalue, rvalue, options) { if (arguments.length < 3)
    throw new Error("Handlebars Helper equal needs 2 parameters"); if (lvalue != rvalue) {
    return options.inverse(this); } else {
    return options.fn(this); }
    }
}}));    

app.set('view engine', '.hbs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


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


app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, ""); next();
    }
    );
  
//images
app.get("/images/add", (req,res)=>{
    res.render('addImage');
});

app.get("/images",(req,res)=>{
    fs.readdir(("./public/images/uploaded"),(err, items) => {   
        res.render('images', {images: items});
    });
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

//home-about
app.get("/", function(req,res){ 
    res.render('home');

});

app.get("/about", function(req,res){
    res.render('about');
});
//employees
app.get("/employees/add", (req,res)=>{
    res.render('addEmployee');
});
app.post("/employees/add",(req, res) => {
    data.addEmployee(req.body).then(res.redirect('/employees'));
});

app.get("/employees",(req,res)=>{
    if(req.query.status){
        data.getEmployeesByStatus(req.query.status).then((data) =>{
            res.render("employees",{employees: data})
        }).catch((err) =>{
            res.render({message: "No results."});
         });
    }
    else if(req.query.department){
        data.getEmployeesByDepartment(req.query.department).then((data) =>{
            res.render("employees",{employees: data})
        }).catch((err) =>{
            res.render({message: "No results."});
         });
    }
    else if(req.query.manager){
        data.getEmployeesByManager(req.query.manager).then((data) =>{
            res.render("employees",{employees: data})
        }).catch((err) =>{
            res.render({message: "No results."});
         });
    }
    else
     data.getAllEmployees().then((data) =>{
        res.render("employees",{employees: data})
     }).catch((err) =>{
        res.render({message: "No results."});
     });

 });

 app.get("/employee/:empNum",(req, res) => {
    data.getEmployeeByNum(req.params.empNum).then((data) =>{
        res.render("employee",{employee:data})
    }).catch((err) =>{
        res.render("employee",{message:"No results."});
     });
  });

  app.post("/employee/update", (req, res) => {
      data.updateEmployee(req.body).then(res.redirect('/employees'));
});
//departments
 app.get("/departments",(req,res)=>{
    data.getDepartments().then((data) =>{
        res.render("departments",{departments: data});
     }).catch((err) =>{
        res.render({message: "No results."});
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
