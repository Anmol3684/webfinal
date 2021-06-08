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
var path = require("path")
const data = require('./data-service.js');
app.use(express.static('public'));

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}
app.use(express.static('public'));


// setup  route to listen on /about
app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
});
app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/views/home.html"));
});
app.get("/employees",(req,res) =>{
    data.getAllEmployees().then((data)=>{
        res.json(data);
    });
});
app.get("/departments",(req,res) =>{
    data.getDepartments().then((data)=>{
        res.json(data);
    });
});
app.get("/managers",(req,res) =>{
    data.getManagers().then((data)=>{
        res.json(data);
    });
});
app.use((req,res)=>{
    res.sendFile(path.join(__dirname,"/views/error.html"));
});
 
    data.initialize().then(function(){
    app.listen(HTTP_PORT, onHttpStart);
}).catch(function(err){
    console.log("Unable to start server:" + err);
});