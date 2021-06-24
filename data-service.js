const fs = require ("fs");
const { resolve } = require("path");
let  employees = [];
let departments = [];

module.exports.initialize = function(){
  return new Promise((resolve,reject)=>{
    fs.readFile('./data/employees.json',(err,data) =>{
      if(err){
        reject(err)
      }
      employees = JSON.parse(data);
    })
    fs.readFile('./data/departments.json',(err, data)=>{
      if(err){
        reject(err);
      }
      departments = JSON.parse(data);
    })
      resolve();
    });
}
//EMPLOYEES
module.exports.getAllEmployees = function(){

  return new Promise((resolve,reject)=>{
   if (employees.length == 0) {
   reject("No data to be displayed");
  }
            resolve(employees);
});
}
module.exports.addEmployee = function(employeeData){
  return new Promise(function(resolve,reject){
      employeeData.isManager = (employeeData.isManager)? true :false;
      employeeData.employeeNum = employees.length +1;
      employees.push(employeeData);
      resolve();
  })

}
module.exports.getEmployeesByStatus = function(status){
  return new Promise((resolve,reject) => {
      var department = new Array();

      for(let i = 0; i < employees.length; i++)
      {
          if(employees[i].status == status)
          {
              department.push(employees[i]);
          }
      }

      if(department.length == 0)
      {
          reject("No result returned.");
      }

      resolve(department);
  })
}


module.exports.getEmployeesByDepartment = function(department){
  return new Promise((resolve,reject) => {
      var emp = new Array();

      for(let i = 0; i < employees.length; i++)
      {
          if(employees[i].department == department){
              emp.push(employees[i]);
          }
      }

      if(emp.length == 0)
      {
          reject("No result returned.");
      }
      
      resolve(emp);
  })
}

module.exports.getEmployeesByManager  = function(manager){
  return new Promise((resolve,reject) => {
      var emp = new Array();

      for(let i = 0; i < employees.length; i++)
      {
          if(employees[i].employeeManagerNum == manager){
              emp.push(employees[i]);
          }
      }

      if(emp.length == 0)
      {
          reject("No result returned.");
      }
      
      resolve(emp);
  })
}

module.exports.getEmployeeByNum  = function(num){
  return new Promise((resolve,reject) => {
      var emp = new Array();

      for(let i = 0; i < employees.length; i++)
      {
          if(employees[i].employeeNum == num){
              emp.push(employees[i]);
          }
      }

      if(emp.length == 0)
      {
          reject("No result returned.");
      }
      resolve(emp);
  })
}
//MANAGERS
module.exports.getManagers = function(){
  return new Promise((resolve,reject) =>{
    var managers = [];
    for(let i= 0; i<employees.length; i++){
      if(employees[i].isManager==true){
        managers.push(employees[i]);
        }
    }
      if(managers.length == 0){
        reject("No managers to be displayed");
      }
        resolve(managers);
    });
  }
//DEPARTMENTS
module.exports.getDepartments = function(){

  return new Promise((resolve,reject)=>{
   if (departments.length == 0) {
   reject("No data to be displayed");
  }
            resolve(departments);
});
}