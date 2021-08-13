var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');


var userSchema = new Schema({
    "userName": {
        type: String,
        unique: true 
      },
    "password": String,
    "email": String,
    "loginHistory" : [{
        "dateTime" : Date,
        "userAgent" : String
         }] 
  });
  
  let User;

 //module.exports.initialize = function () {
   // return new Promise(function (resolve, reject) {
    //let db = mongoose.createConnection("mongodb+srv://ANMOL:Anmol@3684@webapp.ylf5a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
    //db.on('error', (err)=>{
    //reject(err); 
    //});
    //db.once('open', ()=>{
    //User = db.model("users", userSchema);
    //resolve(); });
    //}); 
//};

module.exports.RegisterUser = function (userData) {
  return new Promise(function (resolve, reject) {  
      if(userData.password == userData.password2){
        let newUser = new User(userData);

        bcrypt.hash(newUser.password, 10).then(hash=>{ 
          newUser.password = hash;
          newUser.save((error) => {
            if(error){
              if(error.code == 11000) {
                reject("User Name already taken!");
              } 
              reject("There was an error creating the user: " + error);
            }
            else{
              resolve();
            }
          });
          }).catch(err=>{
           reject("There was an error: "+ err);
        });
      }else{
        reject("Password already taken!");
      }
  });
};
module.exports.checkUser = function(userData) {
  return new Promise(function (resolve, reject) {
      User.find({
        userName: userData.userName
      }).then((users)=>{
        users = users.map(value => value.toObject());
        console.log(users,users.length);
        if(users.length == 0){
          reject("Unable to find the user: " + userData.userName);
        }else{
          console.log("Found it!!");
          console.log(users[0].password,userData.password);
        }

        bcrypt.compare(userData.password, users[0].password).then((res) => {
          if(res){
            users[0].loginHistory.push({dateTime:(new Date()).toString(), userAgent: userData.userAgent});
            console.log("Found it2");
            User.updateOne({
              userName : users[0].userName
            },{
              $set:{
                loginHistory: users[0].loginHistory
              }
            }
            ).then(function(){
              console.log("found it.");
              resolve(users[0]);
            }).catch(function(err){
              reject("There was an error verifying the user: "+userData.userName);
            })
          }
          else{
            reject("Incorrect Password for user: "+ userData.userName);
          }
          });
      
      }).catch(function(err){
        reject("User not found: " +userData.userName);
      })
  });
};