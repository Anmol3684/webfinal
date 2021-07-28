/*********************************************************************************
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Nurten YILDIRIM___________ Student ID: _141346197___________ Date: ___2021/07/16_____________
*
* Online (Heroku) Link: https://afternoon-anchorage-52875.herokuapp.com/________________________________________________________
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
//const Sequelize = require('sequelize');


app.engine('.hbs', exphbs({ extname: '.hbs' ,
helpers:{
    navLink: function(url, options){ return '<li' +
((url == app.locals.activeRoute) ? ' class="active" ' : '') +
'><a href="' + url + '">' + options.fn(this) + '</a></li>'; },

equal: function (lvalue, rvalue, options) { 
    if (arguments.length < 3)
    throw new Error("Handlebars Helper equal needs 2 parameters");
    if (lvalue != rvalue) {
    return options.inverse(this); }
     else {
    return options.fn(this); 
    }
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

    app.get("/employees/add", (req, res) => {
        data.getDepartments()
          .then((data) => res.render("addEmployee", { departments: data }))
          .catch(() => res.render("addEmployee", { departments: [] }));
      });
      
    app.get("/employees", function (req, res) {
        if (req.query.status) {
          data.getEmployeesByStatus(req.query.status).then((data) => {
              if (data.length > 0)
                res.render("employees", {
                  employees: data
                });
              else res.render("employees", { message: "No results" });
            })
            .catch((rejectMsg) => {
              res.status(500).send("No results");
            });
        } else if (req.query.department) {
          data.getEmployeesByDepartment(req.query.department).then((data) => {
              if (data.length > 0)
                res.render("employees", {
                  employees: data
                });
              else res.render("employees", { message: "No results" });
            })
            .catch((rejectMsg) => {
              res.status(500).send("No results");
            });
        } else if (req.query.manager) {
          data.getEmployeesByManager(req.query.manager).then((data) => {
              if (data.length > 0)
                res.render("employees", {
                  employees: data
                });
              else res.render("employees", { message: "No results" });
            })
            .catch((rejectMsg) => {
              res.status(500).send("No results");
            });
        } else {
          data.getAllEmployees().then((data) => {
              if (data.length > 0) {
                res.render("employees", {
                  employees: data
                });
              } else {
                res.render("employees", { message: "No results" });
              }
            })
            .catch((rejectMsg) => {
              res.status(500).send("No results");
            });
        }
      });

      app.get("/departments", function (req, res) {
        data.getDepartments()
          .then((data) => {
            if (data.length > 0) {
              res.render("departments", { departments: data });
            } else res.render("departments", { message: "No results" });
          })
          .catch((err) => {
            res.status(500).send("No results");
          });
      });

app.post("/employees/add", function (req, res) {
    data.addEmployee(req.body)
      .then(res.redirect("/employees"))
     .catch((error) => { res.status(500).send("Unable to Add Employee");
      });
  });


app.get("/departments/add", (req,res)=>{
    res.render('addDepartment');
});

app.post("/departments/add",(req, res) => {
    data.addDepartment(req.body).then(res.redirect('/departments')).catch((err) =>{
        res.status(500).send("Unable to Add Department");
     });
  });
  
app.get("/department/:departmentId",(req, res) => {
    data.getDepartmentById(req.params.departmentId).then((data) =>{
        if(data == undefined || data == null){
            res.status(404).send("Department Not Found");
        } else{
        res.render("department",{department:data});
        }
    }).catch((err) =>{
        res.status(404).send("Department Not Found");
     });
  });


  app.post("/employee/update", (req, res) => {
    data.updateEmployee(req.body).then(res.redirect('/employees')
    ).catch((err) =>{
      res.status(500).send("Unable to Update Employee");
   });
});

app.post("/department/update",(req, res) => {
  data.updateDepartment(req.body)
    .then(res.redirect("/departments"))
    .catch((error) => {
      res.status(500).send("Unable to Update Employee");
    });
});


app.get("/employee/:empNum", (req, res) => {
    let viewData = {};
    data.getEmployeeByNum(req.params.empNum).then((data) => { 
     if (data) {
    viewData.employee = data; 
    }
    else {
    viewData.employee = null; 
     }
    }).catch(() => {
    viewData.employee = null; 
    }).then(data.getDepartments).then((data) => {
      viewData.departments = data; 

    for (let i = 0; i < viewData.departments.length; i++) {
    if (viewData.departments[i].departmentId == viewData.employee.department) {
    viewData.departments[i].selected = true; }
    }
    }).catch(() => {
    viewData.departments = []; 
    }).then(() => {
    if(viewData.employee == null){ 
    res.status(404).send("Employee Not Found"); 
    } else {
    res.render("employee", { viewData: viewData }); 
     }
    });
 });
    
app.get("/employees/delete/:empNum",(req, res) => {
    data.deleteEmployeeByNum(req.params.empNum).then((data) =>{
        res.redirect("/employees");
    }).catch((err) =>{
        res.status(500).send("Unable to Remove Employee / Employee not found");
     });
  });

  app.get("/departments/delete/:departmentNum", (req, res) => {
    data.deleteDepartmentById(req.params.departmentNum)
      .then((data) => {
        res.redirect("/departments");
      })
      .catch(() =>
        res.status(500).send("Unable to Remove Department / Department not found")
      );
  });



app.get("/images/add", (req,res)=>{
    res.render('addImage');
});

app.get("/images",(req,res)=>{
    fs.readdir(("./public/images/uploaded"),(err, images) => {   
        res.render('images', {images: images});
    });
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

app.get("/", function(req,res){ 
    res.render('home');

});

app.get("/about", function(req,res){
    res.render('about');
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


