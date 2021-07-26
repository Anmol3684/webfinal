const Sequelize = require('sequelize');

// set up sequelize to point to our postgres database
var sequelize = new Sequelize('d16l84f7apvsvq', 'uccfotubnqbbrop', 'bf2dcf24dc6f050905eba9874424d201b50e45c425d68184d012c8afce04fcd2', {
    host: 'hec2-50-17-255-120.compute-1.amazonaws.comt',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

sequelize
    .authenticate()
    .then(function() {
        console.log('Connection has been established successfully.');
    })
    .catch(function(err) {
        console.log('Unable to connect to the database:', err);
    });
    var Employee = sequelize.define('Employee', {
      employeeNum:{
          type: Sequelize.INTEGER,
          primaryKey:true,
          autoIncrement: true
      },
      firstName:Sequelize.STRING,
      lastName:Sequelize.STRING,
      email:Sequelize.STRING,
      SSN:Sequelize.STRING,
      addressStreet:Sequelize.STRING,
      addressCity :Sequelize.STRING,
      addressState :Sequelize.STRING,
      addressPostal :Sequelize.STRING,
      maritalStatus :Sequelize.STRING,
      isManager: Sequelize.BOOLEAN,
      employeeManagerNum: Sequelize.INTEGER,
      status:Sequelize.INTEGER,
      department: Sequelize.INTEGER,
      hireDate:Sequelize.INTEGER
  });
  var Department = sequelize.define('Department', {
    departmentId:{
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});
module.exports.initialize = function(){
  return new Promise(function (resolve, reject) { 
      sequelize.sync().then(function(){
          resolve();
      }).catch(function(err){
          reject("Unable to sync the database.");
      });
  });
}
module.exports.getAllEmployees = function(){  
return new Promise(function (resolve, reject) { 
      Employee.findAll({
          order:["employeeNum"]
      }).then(function(data){        
          resolve(data);
      }).catch(function(err) {
          reject("No results returned.");
      });

});
}
module.exports.getEmployeesByStatus = function(sta){
  return new Promise(function (resolve, reject) { 
          Employee.findAll({
          attributes: ['status'],
          where:{
              status: sta
          }
      }).then(function(data){        
              resolve(data);
          }).catch(function(err) {
              reject("No results returned.");
          });
  });
}
module.exports.getEmployeesByDepartment = function(depart){
  return new Promise(function (resolve, reject) { 
      Employee.findAll({
          attributes: ['department'],
          where:{
              department: depart
          }
      }).then(function(data){        
              resolve(data);
          }).catch(function(err) {
              reject("No results returned.");
          });
  });
}
module.exports.getEmployeesByManager  = function(manager){
  return new Promise(function (resolve, reject) { 
      Employee.findAll({
          attributes: ['employeeManagerNum'],
          where: {
              employeeManagerNum : manager
          }
      }).then(function(data){        
              resolve(data);
          }).catch(function(err) {
              reject("No results returned.");
          });
  });
}
module.exports.getEmployeeByNum  = function(num){
  return new Promise(function (resolve, reject) { 
      Employee.findAll({
          attributes: ['employeeNum'],
          where: {
              employeeNum: num
          }
      }).then(function(data){        
              resolve(data[0]);
          }).catch(function(err) {
              reject("No results returned.");
          });
  });
}
module.exports.getDepartments = function(){
  return new Promise(function (resolve, reject) { 
      Department.findAll({
          order:["departmentId"]
      }).then(function(data){
          resolve(data);
      }).cath(function(data){
          reject("No results returned.");
      })
  });
}
module.exports.addEmployee = function(employeeData){
  return new Promise(function (resolve, reject) { 
      employeeData.isManager=(employeeData.isManager)?true:false;
      for(const i in employeeData){
          if(employeeData[i] == " "){
              employeeData[i] = null;
          }
      }
      Employee.create(employeeData).then(function(data) {  
          resolve(data);
      }).catch(function(error) {
          reject("Unable to sync the database.");
      });

  });

}
module.exports.updateEmployee = function(employeeData){
  return new Promise(function (resolve, reject) { 
      employeeData.isManager = (employeeData.isManager)?true:false;
      for(const i in employeeData){
          if(employeeData[i] ==" "){
              employeeData[i] = null;
          }
      }
      Employee.update(employeeData,{
          where:{ 
              employeeNum: employeeData.employeeNum 
          } 
      }).then(function(data) {
          resolve(data);
      }).catch(function(error) {
          reject("Unable to sync the database.");
      });
      
  });
}