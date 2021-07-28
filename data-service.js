const Sequelize = require('sequelize');
var sequelize = new Sequelize('d16l84f7apvsvq', 'ccfotubnqbbrop', 'bf2dcf24dc6f050905eba9874424d201b50e45c425d68184d012c8afce04fcd2', {
    host: 'ec2-50-17-255-120.compute-1.amazonaws.com',
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
          autoIncrement: true,
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
          Employee.findAll().then(function(data){        
              resolve(data);
          }).catch(function(err) {
              reject("No results returned.");
          });
});
}

module.exports.getEmployeesByStatus = function(sta){
  return new Promise(function (resolve, reject){ 
       Employee.findAll({
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

module.exports.getEmployeesByDepartment = function(depa){
  return new Promise(function (resolve, reject) {
          Employee.findAll({
          where: {
              department: depa
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
          Department.findAll().then(function(data){        
              resolve(data);
          }).catch(function(err) {
              reject("No results returned.");
          });
});
}

module.exports.addEmployee = function(employeeData){
  return new Promise(function (resolve, reject) {
      employeeData.isManager = (employeeData.isManager)? true : false;

      for(var d in employeeData){
          if(employeeData[d]=='') {
              employeeData[d] = null;
          }
      }
      Employee.create(employeeData).then(()=>{
          resolve("Successfully added a new employee");
      }).catch((err)=>{
          reject('Unable to create employee.');
      });
  });
}
module.exports.updateEmployee = function (employeeData) {
  return new Promise((resolve, reject) => {
    employeeData.isManager = employeeData.isManager ? true : false;
    for (const field in employeeData) {
      if (employeeData[field] == "") {
        employeeData[field] = null;
      }
    }

    Employee.update(employeeData, {
      where: { employeeNum: employeeData.employeeNum },
    })
      .then(function(data) {
        resolve(data);
      })
      .catch((err) =>{
          reject("Unable to sync the database.");
      });
  });
};


module.exports.addDepartment= function(departmentData){
  return new Promise(function (resolve, reject) { 
   for(const obj in departmentData){
       if(departmentData[obj] ==" "){
           departmentData[obj] = null;
       }
   }
       Department.create(departmentData).then(function(data){ 
           resolve(data);
       }).catch(function(error) {
           reject("Unable to sync the database.");
       });
});

}

module.exports.updateDepartment = function (departmentData) {
  return new Promise((resolve, reject) => {
    for (prop in departmentData) {
      if (prop == "") prop = null;
    }
    Department.update(departmentData, {
      where: { departmentId: departmentData.departmentId },
    })
      .then(function(data) {
        resolve(data);
      })
      .catch((err) => {
          reject("Unable to sync the database.");
      });
  });
};
module.exports.getDepartmentById  = function(id){
  return new Promise(function (resolve, reject) { 
          Department.findAll({
          where: {
              departmentId: id
          }
      }).then(function(data){        
              resolve(data[0]);
          }).catch(function(err) {
              reject("No results returned.");
          });
});
}

module.exports.deleteEmployeeByNum  = function(empNum){
  return new Promise(function (resolve, reject) { 
          Employee.destroy({
          where: {
              employeeNum: empNum
          }
      }).then(function(){        
              resolve("Success! Employee is removed.");
          }).catch(function(err) {
              reject("Error!");
          });
});
}
module.exports.deleteDepartmentById  = function(departmentNum){
  return new Promise(function (resolve, reject) { 
          Department.destroy({
          where: {
              departmentId: departmentNum
          }
      }).then(function(){        
              resolve("Success! Department is removed.");
          }).catch(function(err) {
              reject("Error!");
          });
});
}