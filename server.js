/*********************************************************************************
* WEB322 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part * of this 
assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: _________Nurten Yildirim_____________ Student ID: __141346197____________ Date: ________2021/08/13bool divBy3(const int& val) { return val % 3  --0; }________
*
* Online (Heroku) Link: _https://afternoon-anchorage-52875.herokuapp.com/login____________________________________________
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
var dataServiceAuth = require('./data-service-auth.js');
var clientSessions = require('client-sessions');
 

app.set('view engine', '.hbs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
var HTTP_PORT = process.env.PORT || 8080;

const { get } = require("http");

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
}}
)); 

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

app.use(clientSessions({
  cookieName: "session", 
  secret: "webAssignment6", 
  duration: 2 * 60 * 1000, 
  activeDuration: 1000 * 60 
}));

app.use(function(req, res, next){
   res.locals.session = req.session; 
   next();
});

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  }else{
    next();
  }
}

app.post("/login",function(req,res){
  req.body.userAgent = req.get('User-Agent');

  dataServiceAuth.checkUser(req.body).then((users) => { 
    req.session.user = {
    userName: users.userName,
    email: users.email,
    loginHistory: users.loginHistory
    }
    res.redirect('/employees'); 
  }).catch((err)=>{
    res.render("login",{errorMessage: err, userName: req.body.userName})
  });
});

app.post("/register",function(req,res){
  dataServiceAuth.RegisterUser(req.body).then(
    res.render("register",{successMessage: "User created"})
  ).catch((err)=>{
    res.render("register",{errorMessage: err, userName: req.body.userName})
  });
});

app.get("/login",function(req,res){
  res.render("login");
});
app.get("/register",function(req,res){
  res.render("register");
});
app.get("/logout", function(req, res) {
  req.session.reset();
  res.redirect("/");
});

app.get("/userHistory",ensureLogin,function(req,res){
  res.render("userHistory",{user: req.session.user});
});

app.post("/employees/add", ensureLogin,function (req, res) {
  data.addEmployee(req.body)
    .then(res.redirect("/employees"))
    .catch((error) => { res.status(500).send("Unable to Add Employee");
    });
});
 app.get("/employees/add", ensureLogin, (req, res) => {
        data.getDepartments()
          .then((data) => res.render("addEmployee",{ departments: data }))
          .catch(() => res.render("addEmployee", { departments: [] }));
      });
      
      app.post("/departments/add",ensureLogin,(req, res) => {
        data.addDepartment(req.body).then(res.redirect('/departments')).catch((err) =>{
            res.status(500).send("Unable to Add Department");
         });
      });

      app.post("/employee/update",ensureLogin, (req, res) => {
        data.updateEmployee(req.body)
          .then(res.redirect("/employees"))
          .catch((err) => {
            console.log(err);
            res.status(500).send("Unable to Update Employee");
          });
      });

    app.post("/department/update",ensureLogin,(req, res) => {
      data.updateDepartment(req.body)
        .then(res.redirect("/departments"))
        .catch((error) => {
          res.status(500).send("Unable to Update Employee");
        });
    });

    app.post("/images/add", ensureLogin, upload.single("imageFile"), (req, res) => {
      res.redirect("/images");
  });

    app.get("/employees", ensureLogin, function(req, res) {
        if (req.query.status) {
          data.getEmployeesByStatus(req.query.status).then((data) => {
              if (data.length > 0)
                res.render("employees",{
                  employees: data
                });
              else res.render("employees",{ message: "No Data Displayed" });
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
              else res.render("employees", { message: "No Data Displayed" });
            })
            .catch((rejectMsg) => {
              res.status(500).send("No results");
            });
        } else if (req.query.manager) {
          data.getEmployeesByManager(req.query.manager).then((data) => {
              if (data.length > 0)
                res.render("employees",
                {employees: data
              });
              else res.render("employees",{ message: "No Data Displayed" });
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
                res.render("employees",
                { message: "No results" });
              }
            })
            .catch((rejectMsg) => {
              res.status(500).send("No Data Displayed");
            });
        }
      });

      app.get("/departments", ensureLogin, function (req, res) {
        data.getDepartments()
          .then((data) => {
            if (data.length > 0) {
              res.render("departments", { departments: data });
            } else res.render("departments", { message: "No Data Displayed" });
          })
          .catch((err) => {
            res.status(500).send("No Data Displayed");
          });
      });
app.get("/departments/add", ensureLogin, function (req, res) {
  data.getDepartments().then((data) => {
      res.render("addDepartment",{ departments: data });
    })
    .catch((err) => {
      res.render("addDepartment", { departments: [] });
    });
});  
app.get("/department/:departmentId", ensureLogin,(req, res) => {
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

app.get("/employee/:empNum", ensureLogin,(req, res) => {
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
    res.render("employee",{ viewData: viewData }); 
     }
    });
 });
    
app.get("/employees/delete/:empNum", ensureLogin,(req, res) => {
    data.deleteEmployeeByNum(req.params.empNum).then((data) =>{
        res.redirect("/employees");
    }).catch((err) =>{
        res.status(500).send("Unable to Remove Employee / Employee not found");
     });
  });

  app.get("/departments/delete/:departmentNum", ensureLogin,(req, res) => {
    data.deleteDepartmentById(req.params.departmentNum)
      .then((data) => {
        res.redirect("/departments");
      })
      .catch(() =>
        res.status(500).send("Unable to Remove Department / Department not found")
      );
  });
app.get("/images/add", ensureLogin, (req,res)=>{
    res.render('addImage');
});

app.get("/images", ensureLogin,(req,res)=>{
    fs.readdir(("./public/images/uploaded"),(err, images) => {   
        res.render('images',{images: images});
    });
});
app.get("/", function(req,res){ 
    res.render('home');

});

app.get("/about", function(req,res){
    res.render('about');
});
  
app.get("*", function(req,res){
    res.status(404).sendFile(path.join(__dirname,"/views/error.html"));
});
data.initialize().then(dataServiceAuth.initialize)
.then(function(){
  app.listen(HTTP_PORT, function(){ console.log("app listening on: " + HTTP_PORT)
  }); 
}).catch(function(err){
  console.log("unable to start server: " + err); 
});
  
