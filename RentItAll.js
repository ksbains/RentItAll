var mysql = require("mysql");
var inquirer = require("inquirer");
var passwordHash = require('password-hash');
// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "",
  database: "RentItAll_DB"
});
// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

/*------------------------Logging------------------------*/ 
// Sends log info to debug.log file
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};
/*------------------------Logging------------------------*/ 


global.b_id = 0;
locations = ["315 E San Fernando", "189 Curtner Ave", "167 E Taylor St"];

// function which prompts the user to see what type they are
function start() {
  inquirer
    .prompt({
      name: "userType",
      type: "list",
      message: "Are you an employee or customer?",
      choices: ["Employee", "Customer"]
    })
    .then(function(answer) {
      // based on their answer, either call the Employee or Customer functions
      if (answer.userType.toUpperCase() === "EMPLOYEE") {
        //This method will handle the employee flow
        Employee();
      }
      else {
        //This method will handle the customer flow
        Customer();
      }
    });
}
//ALL OF EMPLOYEE
function Employee(){
  inquirer
      .prompt({
        name: "userType",
        type: "list",
        message: "\nAre you a new or returning employee?",
        choices: ["New Employee", "Returning Employee", "Return"]
      })
      .then(function(answer) {
        // based on their answer, either call the createEmployee or the signInEmployee  functions
        if (answer.userType.toUpperCase() === "NEW EMPLOYEE") {
          createEmployee();
        }
        else if(answer.userType == "Return") {
          start();
        } 
        else {
          //This method will handle the employee flow
          Employeelogin();
        }
      });
 };

function createEmployee(){
  console.log("\nWelcome new employee!");
  //locations = ["315 E San Fernando", "189 Curtner Ave", "167 E Taylor St"];
  var managers = [];
  var managersID = [];
  connection.query("SELECT name, mgr_ssn FROM employee INNER JOIN manager ON employee.SSN = manager.mgr_ssn", function(err, results) {
   if (err){
     throw err;
   }
    for (var i = 0; i < results.length; i++) {      
      managers.push(results[i].name);
      managersID.push(results[i].mgr_ssn);
    }     
   }); 
  managers.push("None");
  inquirer
    .prompt([
       {
        name: "position",
        type: "list",
        message: "\nWhat position are you?",
        choices: ["Mechanic", "Manager", "Receptionist"]
      },{
        name: "manager",
        type: "list",
        message: "\nWho is your manager? If you are a manager or do not have a manager select none.",
        choices: managers
      },
      {
        name: "SSN",
        type: "input",
        message: "SSN"
      },
      {
        name: "name",
        type: "input",
        message: "name"
      },
      {
        name: "location",
        type: "list",
        message: "\nWhat location are you at?",
        choices: locations
      }]).then(function(answer) {
      var salary = 0;
      if(answer.position == "Mechanic"){
        salary = 65000;
      } else if(answer.position == "Receptionist"){
        salary = 45000;
      } else if(answer.position == "Manager"){
        salary = 95000;
      } else{
        salary = -1;
      }
      connection.query(
        "INSERT INTO employee SET ?",
        {
          SSN: answer.SSN,
          name: answer.name,
          loc_address: answer.location,
          salary: salary,
        },
        function(err) {
          if (err) throw err;
          //if no err, will go back to login, now the employee should hit the returning employee. 
          console.log("\nYour employee account was created successfully!");
          // re-prompt the user for if they want to bid or post
        }
      );

      //manager logic
      managersID.unshift("None");
      var idx = 0;
      for (var i = 0; i < managers.length; i++) {
        if(managers[i] == answer.manager){
          idx = i;
        }
      }




      //insert into sub tables
      if(answer.position == "Mechanic"){
          connection.query(
          "INSERT INTO mechanic SET ?",
          {
            //this is the meachinc's ssn
            m_ssn: answer.SSN,
            //ma_ssn is the manager ssn
            ma_ssn: managersID[idx],
          },
          function(err) {
            if (err) throw err;
            //if no err, will go back to login, now the employee should hit the returning employee. 
            console.log("\nYour mechanic account was created successfully!");
            // re-prompt the user for if they want to bid or post
          }
        );
          mechanicMain();
      } else if(answer.position == "Receptionist"){
        connection.query(
          "INSERT INTO receptionist SET ?",
          {
            //this is the meachinc's ssn
            r_ssn: answer.SSN,
            //ma_ssn is the manager ssn
            ma_ssn: managersID[idx],
          },
          function(err) {
            if (err) throw err;
            //if no err, will go back to login, now the employee should hit the returning employee. 
            console.log("\nYour receptionist account was created successfully!");
            // re-prompt the user for if they want to bid or post
          }
        );
        receptionistMain();
      } else if(answer.position == "Manager"){
        connection.query(
          "INSERT INTO manager SET ?",
          {
            //this is the meachinc's ssn
            mgr_ssn: answer.SSN,
          },
          function(err) {
            if (err) throw err;
            //if no err, will go back to login, now the employee should hit the returning employee. 
            console.log("\nYour manager account was created successfully!");
            // re-prompt the user for if they want to bid or post
          }
        );
        managerMain();
      }else{
        console.log("All of the sub menus have failed and should not have ended up here.");
      }
    });
}

function Employeelogin() {
  // prompt for info about the employee to login
  inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "name"
      },
      {
        name: "SSN",
        type: "input",
        message: "SSN"
      }
    ]).then(function(answer) {
     connection.query("SELECT name, SSN, salary FROM employee", function(err, results) {
       if (err){
         throw err;
       } 

         var nameArray = [];
         var ssnArray = [];
         var salaryArray = [];
          for (var i = 0; i < results.length; i++) {
            nameArray.push(results[i].name);
            ssnArray.push(results[i].SSN);
            salaryArray.push(results[i].salary);
          }
          for (var i = 0; i < nameArray.length; i++){
            if(answer.name == nameArray[i] && answer.SSN == ssnArray[i]){
              if(salaryArray[i] == 45000){
                // this is for the receptionist
                receptionistMain(answer.SSN);
                i = nameArray.length++;
              } else if(salaryArray[i] == 65000){
                // this is for the mechanic
                mechanicMain(answer.SSN);
                i = nameArray.length++;
              } else if(salaryArray[i] == 95000){
                // this is for the manager
                // might have to pass the ssn like this: managerMain(answer.SSN)
                managerMain(answer.SSN);
                i = nameArray.length++;
              } 
            } else{
                if(i == nameArray.length-1){
                  console.log("Your username and/or ssn is incorrect, please try again!");
                  Employeelogin();
                }
              }
          }          
        });
    });
}  

function receptionistMain(ssn){
  console.log("\nWelcome to receptionist main!");
  inquirer.prompt({
        name: "receptionistMenu",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Customer", "Add Customer", "Logout"]
      })
      .then(function(answer) {
        if(answer.receptionistMenu == "View Customer"){
          // maybe just one's based on the re_ssn in the assits table?
            connection.query("SELECT * FROM assist WHERE re_ssn = " + mysql.escape(ssn), function(err, results) {
             if (err){throw err;}

             var toDisplay = [];
             header ="Receptionist  CustomerUsername";

             for (var i = 0; i < results.length; i++) {
                toReturn = "";
                toReturn = toReturn + results[i].re_ssn + "    " + results[i].cu_username;
                toDisplay.push(toReturn);
             }
             toDisplay.unshift(header);
             
             for (var i = 0; i < toDisplay.length; i++) {
               console.log(toDisplay[i]);
             }
             inquirer.prompt(
                    {
                      name: "return",
                      type: "list",
                      message: " ",
                      choices: ["Return"]
                    }).then(function(answer) {
                      if(answer.return == "Return"){
                        receptionistMain(ssn); return
                      }
                });
           });
          
        } else if(answer.receptionistMenu == "Add Customer"){
              
          inquirer.prompt([
            {
              name: "username",
              type: "input",
              message: "What is your username?"
            },
            {
              name: "password",
              type: "input",
              message: "What is your password?",
              
            },
            {
              name: "name",
              type: "input",
              message: "What is your name?"
            },
            {
              name: "address",
              type: "input",
              message: "What is your address?"
            },
            {
              name: "phone_number",
              type: "input",
              message: "What is your phone_number?"
            }
          ])
          .then(function(answer) {
            //do some salary logic

            connection.query(
              "INSERT INTO customer SET ?",
              {
                username: answer.username,
                password: answer.password,
                name: answer.name,
                address: answer.address,
                P_number: answer.phone_number
              },
              function(err) {
                if (err) throw err;
                
                //if no err, will go back to login, now the employee should hit the returning employee. 
                console.log("The customer was created successfully!");
                // re-prompt the user for if they want to bid or post
                receptionistMain(ssn)
              }
            );
            connection.query(
              "INSERT INTO assist SET ?",
              {
                cu_username: answer.username,
                re_ssn: ssn
              },
              function(err) {
                if (err) throw err;
                
                //if no err, will go back to login, now the employee should hit the returning employee. 
                console.log("Your assist was created successfully!");
                // re-prompt the user for if they want to bid or post
                receptionistMain(ssn)
              }
            );
          });
    } else if (answer.receptionistMenu == "Logout"){
      employeeLogout();
    }else{
      console.log("ooPS Should not be here at all!")
    }
  });
}

function managerMain(ssn){
  console.log("\nWelcome to manager main!");
  inquirer.prompt({
        name: "ManagerMenu",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Car", "Add Car", "Remove Car", "Modify Car", "Logout"]
      })
      .then(function(answer) {
        if(answer.ManagerMenu == "View Car"){
           // list the car table using connectino
           viewCars(ssn);
           
        } else if(answer.ManagerMenu == "Add Car"){
          //same logic as cusotmer adding car, except now fill in this ms_ssn
          //locations = ["315 E San Fernando", "189 Curtner Ave", "167 E Taylor St"];
          inquirer
            .prompt([
              {
                name: "VIN",
                type: "input",
                message: "VIN: "
              },
              {
                name: "type",
                type: "input",
                message: "Type: "
              },
              {
                name: "make",
                type: "input",
                message: "Make: "
              },
              {
                name: "model",
                type: "input",
                message: "Model: "
              },
              {
                name: "year",
                type: "input",
                message: "Year: "
              },
              {
                name: "paint",
                type: "input",
                message: "Paint: "
              },
              {
                name: "transmission",
                type: "input",
                message: "Transmission: "
              },
              {
                name: "price",
                type: "input",
                message: "Price: "
              },
              {
                name: "mileage",
                type: "input",
                message: "Mileage: "
              },
              {
                name: "conditions",
                type: "input",
                message: "Condition: "
              },{
                name: "location",
                type: "list",
                message: "Choose Location: ",
                choices: locations
              }      
            ]).then(function(answer) {
              //do some salary logic
              var source = 1;
              var purpose = "SELL";
              var available = "yes";

              connection.query(
                "INSERT INTO car SET ?",
                {
                  VIN: answer.VIN,
                  loc_address: answer.location,
                  ma_ssn: ssn,
                  source: source,
                  purpose: purpose,
                  type: answer.type,
                  make: answer.make,
                  model: answer.model,
                  year: answer.year,
                  paint: answer.paint,
                  transmission: answer.transmission,
                  mileage: answer.mileage,
                  conditions: answer.conditions,
                  price: answer.price,
                  available: available
                },
                function(err) {
                  if (err) throw err;
                  
                  //if no err, will go back to login, now the employee should hit the returning employee. 
                  console.log("Your car was inserted correctly!");
                  // re-prompt the user for if they want to bid or post
                  managerMain();          
                })
            });
        } else if(answer.ManagerMenu == "Remove Car"){
          //remove car from car table
          removeCar(ssn);
        } else if(answer.ManagerMenu == "Modify Car"){
          //modify car's price
          modifyCar(ssn);
        } else if(answer.ManagerMenu == "Logout") {
          employeeLogout();
        } else{
          console.log("Oops should not be here at all!")
        }
      });
}

function mechanicMain(ssn){
  console.log("\nWelcome to mechanic main!");
  //show all of the service instances with this mechanic ssn
  inquirer.prompt({
        name: "mechanicMenu",
        type: "list",
        message: "What would you like to do?",
        choices: ["Choose Jobs", "Do Jobs", "Logout"]
      }).then(function(answer) {
        if(answer.mechanicMenu == "Choose Jobs"){         
          jobs = [];
          var header = "B_ID  CustomerUsername Price TimeBook Car_VIN"
          connection.query("SELECT * FROM service_instance WHERE me_ssn IS NULL", function(err,results){
            if(err){return err;}
            
            for (var i = 0; i < results.length; i++) {
              toReturn = "";
              toReturn = toReturn + results[i].b_id + " ";
              toReturn = toReturn + results[i].cu_username+ " ";
              toReturn = toReturn + results[i].price+ " ";
              toReturn = toReturn + results[i].time_book+ " ";
              toReturn = toReturn + results[i].car_VIN+ " ";

              jobs.push(toReturn);
            }
            jobs.unshift(header);
            jobs.push("Return");
          
          inquirer.prompt({
            name:"job",
            type: "list",
            message:"Choose a job",
            choices: jobs
          }).then(function(answer){
                if(answer.cars == "Return"){CustomerMain(username); return}
              var res = answer.job.split(" ");
              jobID = res[0];
              console.log("the b_id is: " + jobID);
              //"UPDATE car SET price = " + mysql.escape(answer.price) + "WHERE VIN = " + mysql.escape(VINBought),
              connection.query(
                "UPDATE service_instance SET me_ssn = "+ mysql.escape(ssn) + "WHERE b_id = " + mysql.escape(jobID),
                function(err) {
                  if (err) throw err;
                  //if there is no error then it will 
                  console.log("Thanks for picking up the job!");

                  inquirer.prompt(
                    {
                      name: "return",
                      type: "list",
                      message: " ",
                      choices: ["Return"]
                    }).then(function(answer) {
                      if(answer.return == "Return"){
                        mechanicMain(ssn); return
                      }
                });
              });
                      
            });
          });      
         } else if(answer.mechanicMenu == "Do Jobs"){
             jobs = [];
          var header = "B_ID  CustomerUsername Price TimeBook Car_VIN"
          connection.query("SELECT * FROM service_instance WHERE me_ssn = " + mysql.escape(ssn), function(err,results){
            if(err){return err;}
            
            for (var i = 0; i < results.length; i++) {
              toReturn = "";
              toReturn = toReturn + results[i].b_id + " ";
              toReturn = toReturn + results[i].cu_username+ " ";
              toReturn = toReturn + results[i].price+ " ";
              toReturn = toReturn + results[i].time_book+ " ";
              toReturn = toReturn + results[i].car_VIN+ " ";

              jobs.push(toReturn);
            }
            jobs.unshift(header);
            jobs.push("Return");
          
          inquirer.prompt({
            name:"job",
            type: "list",
            message:"Choose a job to do",
            choices: jobs
          }).then(function(answer){
                if(answer.cars == "Return"){CustomerMain(username); return}
              var res = answer.job.split(" ");
              jobID = res[0];
              console.log("the b_id is: " + jobID);
              connection.query(
                "DELETE from service_instance WHERE b_id = " + mysql.escape(jobID),
                function(err) {
                  if (err) throw err;
                  //if there is no error then it will 
                  console.log("Thanks for completing the job!");
                  inquirer.prompt(
                    {
                      name: "return",
                      type: "list",
                      message: " ",
                      choices: ["Return"]
                    }).then(function(answer) {
                      if(answer.return == "Return"){
                        mechanicMain(ssn); return
                      }
                });
              });
            });
          });
         }else if (answer.mechanicMenu == "Logout"){
           employeeLogout();
         }else {
           console.log("oops");
         }          
      });//end of then 
}
//ALL OF CUSTOMER

function Customer() {
  inquirer
      .prompt({
        name: "customerType",
        type: "list",
        message: "\nAre you a new or returning customer?",
        choices: ["New Customer", "Returning Customer", "Return"]
      })
      .then(function(answer) {
        // based on their answer, either call the createEmployee or the signInEmployee  functions
        if (answer.customerType.toUpperCase() === "NEW CUSTOMER") {
          createCustomer();
        }
        else if(answer.customerType == "Return") {
          start();
        } 
        else {
          //This method will handle the employee flow
          CustomerLogin();
        }
      });
}

function createCustomer(){
  inquirer
    .prompt([
      {
        name: "username",
        type: "input",
        message: "\nWhat is your username?"
      },
      {
        name: "password",
        type: "input",
        message: "What is your password?",
        
      },
      {
        name: "name",
        type: "input",
        message: "What is your name?"
      },
      {
        name: "address",
        type: "input",
        message: "What is your address?"
      },
      {
        name: "phone_number",
        type: "input",
        message: "What is your phone number?"
      }
    ])
    .then(function(answer) {
      //do some salary logic
      
      var hashedPassword = passwordHash.generate(answer.password);
      //console.log("the hashed password is: " + hashedPassword);

      connection.query(
        "INSERT INTO customer SET ?",
        {
          username: answer.username,
          password: hashedPassword,
          name: answer.name,
          address: answer.address,
          P_number: answer.phone_number
        },
        function(err) {
          if (err) throw err;
          
          //if no err, will go back to login, now the employee should hit the returning employee. 
          console.log("Your customer account was created successfully!");
          // re-prompt the user for if they want to bid or post
          CustomerMain(answer.username);
        }
      );
    });

}
function CustomerLogin() {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "username",
        type: "input",
        message: "Username:"
      },
      {
        name: "password",
        type: "password",
        message: "Password:"
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info\
         connection.query("SELECT username, password FROM customer", function(err, results) {
           if (err){
             throw err;
           } 
           // var hashedPassword = passwordHash.generate(answer.password);
           // console.log("the hashedPassword is: " + hashedPassword)
          for (var i = 0; i < results.length; i++){
            if(answer.username == results[i].username && passwordHash.verify(answer.password, results[i].password)) {
               CustomerMain(results[i].username);
               i = results.length++;
            }else {
              if(i == results.length-1){
                console.log("Your username and/or ssn is incorrect, please try again!");
                Customerlogin();
              }
            }
          }          
      });
  });
}


function CustomerMain(username) {
  inquirer
      .prompt({
        name: "menu",
        type: "list",
        message: "\nWhat would you like to do?",
        choices: ["Buy" , "Sell", "Rent" ,"Rentout", "Maintenance" , "Review", "Logout"]
      })
      .then(function(answer) {
        if (answer.menu == "Buy") {
          customerBuy(username);  
        } else if (answer.menu == "Sell") {
          customerSell(username);  
        } else if (answer.menu == "Rent") {
          customerRent(username);  
        } else if (answer.menu == "Rentout") {
          customerRentOut(username);  
        } else if (answer.menu == "Maintenance") {
          customerMaintenance(username);
        } else if (answer.menu == "Review") {
          customerReview(username);  
        } else if (answer.menu == "Logout") {
          customerLogout();  
        }
      });  
}

function customerBuy(username){
  inquirer
      .prompt({
        name: "buyMenu",
        type: "list",
        message: "\nWhat would you like to do?",
        choices: ["List Cars", "Return"]
      })
      .then(function(answer) {
        if (answer.buyMenu == "List Cars") {
         buyCars(username)
        } else if(answer.buyMenu == "Return") {
          CustomerMain(username);
        } else{
          console.log("Oh no, not good!");
        }
      });  
}

function customerSell(username) {
var managers = [];
  var managersID = [];
  connection.query("SELECT name, mgr_ssn FROM employee INNER JOIN manager ON employee.SSN = manager.mgr_ssn", function(err, results) {
   if (err){
     throw err;
   }
    for (var i = 0; i < results.length; i++) {      
      managers.push(results[i].name);
      managersID.push(results[i].mgr_ssn);
    }     
   });


//locations = ["315 E San Fernando", "189 Curtner Ave", "167 E Taylor St"];
  inquirer
    .prompt([
      {
        name: "VIN",
        type: "input",
        message: "VIN: "
      },
      {
        name: "type",
        type: "input",
        message: "Type: "
      },
      {
        name: "make",
        type: "input",
        message: "Make: "
      },
      {
        name: "model",
        type: "input",
        message: "Model: "
      },
      {
        name: "year",
        type: "input",
        message: "Year: "
      },
      {
        name: "paint",
        type: "input",
        message: "Paint: "
      },
      {
        name: "transmission",
        type: "input",
        message: "Transmission: "
      },
      {
        name: "mileage",
        type: "input",
        message: "Mileage: "
      },
      {
        name: "conditions",
        type: "input",
        message: "Condition: "
      },{
        name: "price",
        type: "input",
        message: "Price for Car: "
      },{
        name: "location",
        type: "list",
        message: "Choose Location: ",
        choices: locations
      },{
        name: "manager",
        type: "list",
        message: "Choose Manager: ",
        choices: managers
      }      
    ]).then(function(answer) {
      var idx = 0;
      //manager logic
      for (var i = 0; i < managers.length; i++) {
        if(managers[i] == answer.manager){
          idx = i
        }
      }
      //do some salary logic
      var source = 0;
      var purpose = "SELL";
      var available = "yes"
      connection.query(
        "INSERT INTO car SET ?",
        {
          VIN: answer.VIN,
          loc_address: answer.location,
          ma_ssn: managersID[idx],
          source: source,
          price: answer.price,
          purpose: purpose,
          type: answer.type,
          make: answer.make,
          model: answer.model,
          year: answer.year,
          paint: answer.paint,
          transmission: answer.transmission,
          mileage: answer.mileage,
          conditions: answer.conditions,
          available : available
        },
        function(err) {
          if (err) throw err;
          
          //if no err, will go back to login, now the employee should hit the returning employee. 
          console.log("Your car was inserted correctly!");
          // re-prompt the user for if they want to bid or post
          
        })
      var state = "sale";
      connection.query(
        "INSERT INTO car_relation SET ?",
        {
          cu_username: username,
          car_VIN: answer.VIN,
          state: state
        },
        function(err) {
          if (err) {throw err;}
            
            console.log("Inserted into the car relation!")
            CustomerMain(username); 
         });

    });
}

function customerRent(username){
  inquirer
      .prompt({
        name: "rentMenu",
        type: "list",
        message: "\nWhat would you like to do",
        choices: ["List Cars", "Return"]
      })
      .then(function(answer) {
        if (answer.rentMenu == "List Cars") {
         rentCars(username);
        } else if(answer.rentMenu == "Return") {
          CustomerMain(username);
        } else{
          console.log("Oh no, not good");
        }
      });  
}

function customerRentOut(username){
  var managers = [];
  var managersID = [];
  connection.query("SELECT name, mgr_ssn FROM employee INNER JOIN manager ON employee.SSN = manager.mgr_ssn", function(err, results) {
   if (err){
     throw err;
   }
    for (var i = 0; i < results.length; i++) {      
      managers.push(results[i].name);
      managersID.push(results[i].mgr_ssn);
    }    
   });
  //locations = ["315 E San Fernando", "189 Curtner Ave", "167 E Taylor St"];
  //var maSSN = "123456789";
  var source = 0;
  var purpose = "RENT"

  inquirer
    .prompt([
      {
        name: "VIN",
        type: "input",
        message: "VIN: "
      },

      {
        name: "type",
        type: "input",
        message: "Type: "
      },

      {
        name: "make",
        type: "input",
        message: "Make: "
      },

      {
        name: "model",
        type: "input",
        message: "Model: "
      },

      {
        name: "year",
        type: "input",
        message: "Year: "
      },
      {
        name: "price",
        type: "input",
        message: "Price per day: "
      },

      {
        name: "paint",
        type: "input",
        message: "Paint: "
      },

      {
        name: "transmission",
        type: "input",
        message: "Transmission: "
      },

      {
        name: "mileage",
        type: "input",
        message: "Mileage: "
      },
      
      {
        name: "conditions",
        type: "input",
        message: "Condition: "
      },
      {
        name: "location",
        type: "list",
        message: "Choose Location: ",
        choices: locations
      },{
        name: "manager",
        type: "list",
        message: "Choose Manager: ",
        choices: managers
      }      
    ]).then(function(answer) {
      //do some manager logic
      var idx = 0;
      for (var i = 0; i < managers.length; i++) {
        if(managers[i] == answer.manager){
          idx = i;
        }
      }
      var available = "yes";
      connection.query(
        "INSERT INTO car SET ?",
        {
          VIN: answer.VIN,
          loc_address: answer.location,
          ma_ssn: managersID[idx],
          source: source,
          price: answer.price,
          purpose: purpose,
          type: answer.type,
          make: answer.make,
          model: answer.model,
          year: answer.year,
          paint: answer.paint,
          transmission: answer.transmission,
          mileage: answer.mileage,
          conditions: answer.conditions,
          available: available
        },
        function(err) {
          if (err) throw err;
          
          //if no err, will go back to login, now the employee should hit the returning employee. 
          console.log("Your car was inserted correctly!");
          // re-prompt the user for if they want to bid or post
        });
        var state = "rent";
        connection.query(
          "INSERT INTO car_relation SET ?",
          {
            cu_username: username,
            car_VIN: answer.VIN,
            state: state
            
          },
          function(err) {
            if (err) {throw err;}
              
              //console.log("Your car was inserted into relation correctly!");
              CustomerMain(username);          
           });
      });
  }

function customerMaintenance(username){
inquirer
      .prompt({
        name: "maintenanceMenu",
        type: "list",
        message: "What would you like to do?",
        choices: ["Schedule", "Check Current", "Return"]
      })
      .then(function(answer) {
        if (answer.maintenanceMenu == "Schedule") {
         customerMaintenanceSchedule(username);
        } else if(answer.maintenanceMenu == "Check Current") {
           inquirer
              .prompt(
              {
                name: "return",
                type: "list",
                message: " ",
                choices: ["Return"]
              }).then(function(answer) {
                if(answer.return == "Return"){
                  customerMaintenance(username)
                }
          });

          //sql for cars under the customer          
          connection.query("SELECT * FROM service_instance LEFT JOIN employee on service_instance.me_ssn = employee.SSN  WHERE cu_username = " + mysql.escape(username), function(err, results) {
             if (err){
               throw err;
             }
             var toDisplay = [];
             var header = "Customer Username  bID  Price  timeBook  carVin  mechanic" + '\n' + "";
            for (var i = 0; i < results.length; i++) {
              
              var toReturn = "";
              toReturn = toReturn + results[i].cu_username + " ";
              toReturn = toReturn + results[i].b_id + " ";
              toReturn = toReturn + results[i].price + " ";
              toReturn = toReturn + results[i].time_book + " ";
              toReturn = toReturn + results[i].car_VIN + " ";
              toReturn = toReturn + results[i].name + " ";
              toDisplay.push(toReturn);
            }
            toDisplay.unshift(header);
            for(var i = 0; i<toDisplay.length; i++){
               console.log(toDisplay[i]);
               console.log("---------------------------------------------------");
             }     
          });


        } else if(answer.maintenanceMenu == "Return") {
          CustomerMain(username);
        } else{
          console.log("Oh no, not good");
        }
      });  
}

function customerMaintenanceSchedule(username){
  ++b_id;
  //locations = ["315 E San Fernando", "189 Curtner Ave", "167 E Taylor St"];
  services = ["Oil Change", "Tire Rotation","Brake Change","Blinker Fluid","Wheel Alignment","Battery Replacement","Timing Belt Replacement","Water Pump Replacement","Engine Replacement"];
  cars = [];

  //SELECT car_VIN FROM car_relation WHERE  NOT EXISTS (SELECT * from service_instance WHERE cu_username = 'k');
  // var SQL = "SELECT car_VIN FROM car_relation WHERE NOT EXISTS (SELECT * from service_instance WHERE cu_username = "+ mysql.escape(username)+ " )";
  var SQL = "SELECT car_VIN FROM car_relation WHERE cu_username = "+ mysql.escape(username);
  connection.query(SQL, function(err, results){
    for(var i =0; i< results.length; i++){
      cars.push(results[i].car_VIN);
    }
  });

  inquirer
      .prompt([{
        name: "maintenanceMenu",
        type: "list",
        message: "What Service would you like?",
        choices: services
      },{
        name: "location",
        type: "list",
        message: "Which locations would you like?",
        choices: locations
      },
      {
        name: "date",
        type: "input",
        message: "Please enter date in format (MMDDYYYY): "
      },{
        name: "car",
        type: "list",
        message: "Select a car by VIN:",
        choices: cars
      }])
      .then(function(answer) {
        var price = 0;
        if (answer.maintenanceMenu == "Oil Change") {
         price = 30;
        } else if(answer.maintenanceMenu == "Tire Rotation") {
          price = 40;
        } else if(answer.maintenanceMenu == "Brake Change") {
          price = 60
        } else if(answer.maintenanceMenu == "Blinker Fluid") {
          price = 5
        } else if(answer.maintenanceMenu == "Wheel Alignment") {
          price = 80
        } else if(answer.maintenanceMenu == "Battery Replacement") {
          price = 50
        } else if(answer.maintenanceMenu == "Timing Belt Replacement") {
          price = 200
        } else if(answer.maintenanceMenu == "Water Pump Replacement") {
          price = 250
        } else if(answer.maintenanceMenu == "Engine Replacement") {
          price = 5500
        } else{
          console.log("uh-oh errror");
        }

        connection.query(
          "INSERT INTO service_instance SET ?",
          {
            b_id: b_id,
            cu_username: username,
            price: price,
            time_book: answer.date,
            car_VIN: answer.car
          },
          function(err) {
            if (err) throw err;
            
            //if no err, will go back to login, now the employee should hit the returning employee. 
            console.log('\n' + "Your car was inserted correctly for maintenance!");
            // re-prompt the user for if they want to bid or post
        });

        connection.query("INSERT INTO instance_of SET ?", 
        {
          cu_username: username,
          b_id: b_id,
          srv_name: answer.maintenanceMenu
        },function(err) {
            if (err) {throw err;}
              
              //console.log("Inserted into the car relation!")
              
           });
        CustomerMain(username); 
      });
}

function customerReview(username){
  inquirer
      .prompt({
        name: "reviewMenu",
        type: "list",
        message: "\nWhat Service would you like?",
        choices: ["Check Reviews", "Write Reviews", "Return"]
      })
      .then(function(answer) {
        if (answer.reviewMenu == "Check Reviews") {
         checkReview(username);
        } else if(answer.reviewMenu == "Write Reviews") {
          writeReview(username);
          //Implement
        } else if(answer.reviewMenu == "Return") {
          CustomerMain(username);
        } else{
          console.log("Oh no, not good");
        }
      });
}

function writeReview(username){
  //locations = ["315 E San Fernando", "189 Curtner Ave", "167 E Taylor St"];
  inquirer.prompt([{
        name: "review",
        type: "input",
        message: "Please write your review:"
      },
      {
        name: "stars",
        type: "list",
        message: "How many stars would you rate the location?",
        choices: ["1","2","3","4","5"]
      },{
        name: "location",
        type: "list",
        message: "What location are you at?",
        choices: locations
      }]).then(function(answer) {
        console.log("Here is your review: " + answer.review);
        connection.query("INSERT INTO review SET ?",
          {
            stars: answer.stars,
            content: answer.review,
            cu_username: username, 
            loc_address: answer.location
          },
          function(err) {
            if (err) throw err;
            //this is after review has been inserted
            console.log("Your review has been entered!");
            CustomerMain(username);
          });
      });
}
function checkReview(username){
  var reviews = [];
  locations = ["315 E San Fernando", "189 Curtner Ave", "167 E Taylor St"];
  locations.push("Return");
    inquirer
    .prompt({
      name: "location",
      type: "list",
      message: "Choose a location:",
      choices: locations
    }).then(function(answer) {
      if(answer.reviews == "Return"){customerReview(username); return}
      connection.query("SELECT * FROM review WHERE loc_address = " + mysql.escape(answer.location), function(err, results) {
         if (err){throw err;}      

         var toDisplay = [];
         var header = "Reviews" + '\n' + "";

        for (var i = 0; i < results.length; i++) {
          
          var toReturn = "";
          toReturn = toReturn + results[i].content + '\n';
          toDisplay.push(toReturn);
        }

        toDisplay.unshift(header);

        for (var i = 0; i < toDisplay.length; i++) {
          console.log(toDisplay[i]);
        }


        inquirer
              .prompt(
              {
                name: "return",
                type: "list",
                message: " ",
                choices: ["Return"]
              }).then(function(answer) {
                if(answer.return == "Return"){
                  customerReview(username); return
                }
          });
      });
    });
}

function employeeLogout(){
  start();  
}

function customerLogout(){
  start();  
}  

//Helper Methods
function viewCars(ssn) {
  connection.query("SELECT * FROM car", function(err, results) {
   if (err){throw err;}
   
   var toDisplay = [];
   var header = "Price    Make   Model   Year  VIN   Purpose   Available  Location " + '\n' + "";
    for (var i = 0; i < results.length; i++) {
     
       var toReturn = "";

       toReturn = toReturn + results[i].price + " ";
       toReturn = toReturn + results[i].make + " ";
       toReturn = toReturn + results[i].model + " ";
       toReturn = toReturn + results[i].year + " ";
       toReturn = toReturn + results[i].VIN + " ";
       toReturn = toReturn + results[i].purpose + " ";
       toReturn = toReturn + results[i].available + " ";
       toReturn = toReturn + results[i].loc_address + '\n';

       toDisplay.push(toReturn);
   }
   toDisplay.unshift(header);
   for(var i = 0; i<toDisplay.length; i++){
     console.log(toDisplay[i]);
     console.log("---------------------------------------------------");
   }

  inquirer.prompt(
      {
        name: "return",
        type: "list",
        message: " ",
        choices: ["Return"]
      }).then(function(answer) {
        if(answer.return == "Return"){
          managerMain(ssn); return
        }
  }); 
 });
}

function removeCar(ssn){
  var header = "Price VIN Make Model Year Purpose Location" + "";
  var toDisplay = [];
  var VINBought = "";
  
  connection.query("SELECT * FROM car ", function(err, results) {
    
   if (err){throw err;}
    
    for (var i = 0; i < results.length; i++) {
       var toReturn = "";

       toReturn = toReturn + results[i].price + " ";
       toReturn = toReturn + results[i].VIN + " ";
       toReturn = toReturn + results[i].make + " ";
       toReturn = toReturn + results[i].model + " ";
       toReturn = toReturn + results[i].year + " ";
       toReturn = toReturn + results[i].purpose + " ";
       toReturn = toReturn + results[i].loc_address;
       toDisplay.push(toReturn);
   }
   toDisplay.unshift(header);
  inquirer
      .prompt({
        name: "cars",
        type: "list",
        message: "Which car would you like to remove?",
        choices: toDisplay
      }).then(function(answer) {
          var res = answer.cars.split(" ");
          console.log("This is the VIN for the car you just removed: " + res[1]);
          VINBought = res[1];
           console.log("The VIN is: " + VINBought);

          connection.query(
            "Delete from car where VIN = " + mysql.escape(VINBought),
            function(err) {
              if (err) throw err;
              //if no err, will go back to login, now the employee should hit the returning employee. 
              console.log("Thanks for buying the car, it is now off of our lot!");
              // re-prompt the user for if they want to bid or post
              managerMain(ssn);
            });
    });    
  });
}

function modifyCar(ssn){
  var header = "Price VIN Make Model Year Purpose Location" + "";
  var toDisplay = [];
  var VINBought = "";
  
  connection.query("SELECT * FROM car ", function(err, results) {
    
   if (err){throw err;}
    
    for (var i = 0; i < results.length; i++) {
       var toReturn = "";

       toReturn = toReturn + results[i].price + " ";
       toReturn = toReturn + results[i].VIN + " ";
       toReturn = toReturn + results[i].make + " ";
       toReturn = toReturn + results[i].model + " ";
       toReturn = toReturn + results[i].year + " ";
       toReturn = toReturn + results[i].purpose + " ";
       toReturn = toReturn + results[i].loc_address;
       toDisplay.push(toReturn);
   }
   toDisplay.unshift(header);
  inquirer
      .prompt([{
        name: "cars",
        type: "list",
        message: "Which car would you like change the price of?",
        choices: toDisplay
      },{
        name: "price",
        type: "input",
        message: "What is the new price?"
      }]).then(function(answer) {
          var res = answer.cars.split(" ");
          console.log("This is the VIN for the car you just selected: " + res[1]);
          VINBought = res[1];
          console.log("The VIN is: " + VINBought);
          connection.query(
            "UPDATE car SET price = " + mysql.escape(answer.price) + "WHERE VIN = " + mysql.escape(VINBought),
            function(err) {
              if (err) throw err;
              //if no err, will go back to login, now the employee should hit the returning employee. 
              console.log("The car has been removed from the lot!");
              // re-prompt the user for if they want to bid or post
              managerMain(ssn);
            });
        });    
   });
}

function buyCars(username){
  var header = "Price VIN Make Model Year Location" + '\n' + "";
  var toDisplay = [];
  var VINBought = "";
  
  connection.query("SELECT * FROM car WHERE purpose = 'SELL' AND available = 'yes'", function(err, results) {
    
   if (err){throw err;}
    
    for (var i = 0; i < results.length; i++) {
       var toReturn = "";

       toReturn = toReturn + results[i].price + " ";
       toReturn = toReturn + results[i].VIN + " ";
       toReturn = toReturn + results[i].make + " ";
       toReturn = toReturn + results[i].model + " ";
       toReturn = toReturn + results[i].year + " ";
       toReturn = toReturn + results[i].loc_address;
       toDisplay.push(toReturn);
   }
   toDisplay.unshift(header);
   toDisplay.push("Return");
  inquirer
      .prompt({
        name: "cars",
        type: "list",
        message: "Which car would you like to buy?",
        choices: toDisplay
      }).then(function(answer) {
        if(answer.cars == "Return"){CustomerMain(username); return}
          var res = answer.cars.split(" ");
          VINBought = res[1];
          //"UPDATE car SET price = " + mysql.escape(answer.price) + "WHERE VIN = " + mysql.escape(VINBought),
          connection.query(
            "UPDATE car SET available = 'no' WHERE VIN = " + mysql.escape(VINBought),
            function(err) {
              if (err) throw err;
              //if no err, will go back to login, now the employee should hit the returning employee. 
              console.log("Thanks for buying the car, it is now off of our lot!");
              // re-prompt the user for if they want to bid or post
            
          var state = "sold"
         connection.query(
          "INSERT INTO car_relation SET ?",
          {
            cu_username: username,
            car_VIN: VINBought,
            state: state
          },
          function(err) {
            if (err) throw err;
            
            //if no err, will go back to login, now the employee should hit the returning employee. 
            //console.log("Your car was inserted into relation correctly!");
            // re-prompt the user for if they want to bid or post
            CustomerMain(username);          
          });
        });
      });    
  }); 
}
  
function rentCars(username){
   var header = "Price VIN Make Model Year Location" + '\n' + "";
  var toDisplay = [];
  var VINBought = "";
  
  connection.query("SELECT * FROM car WHERE purpose = 'RENT' AND available = 'yes'", function(err, results) {
    
   if (err){throw err;}
    
    for (var i = 0; i < results.length; i++) {
       var toReturn = "";

       toReturn = toReturn + results[i].price + " ";
       toReturn = toReturn + results[i].VIN + " ";
       toReturn = toReturn + results[i].make + " ";
       toReturn = toReturn + results[i].model + " ";
       toReturn = toReturn + results[i].year + " ";
       toReturn = toReturn + results[i].loc_address;
       toDisplay.push(toReturn);
   }
   toDisplay.unshift(header);
   toDisplay.push("Return");
  inquirer
      .prompt({
        name: "cars",
        type: "list",
        message: "Which car would you like to rent?",
        choices: toDisplay
      }).then(function(answer) {
        if(answer.cars == "Return"){CustomerMain(username); return}
          var res = answer.cars.split(" ");
          VINBought = res[1];
          //"UPDATE car SET price = " + mysql.escape(answer.price) + "WHERE VIN = " + mysql.escape(VINBought),
          connection.query(
            "UPDATE car SET available = 'no' WHERE VIN = " + mysql.escape(VINBought),
            function(err) {
              if (err) throw err;
              //if no err, will go back to login, now the employee should hit the returning employee. 
              console.log("Thanks for renting the car, it is now off of our lot!");
              // re-prompt the user for if they want to bid or post
            
          var state = "rentOut"
         connection.query(
          "INSERT INTO car_relation SET ?",
          {
            cu_username: username,
            car_VIN: VINBought,
            state: state
          },
          function(err) {
            if (err) throw err;
            
            //if no err, will go back to login, now the employee should hit the returning employee. 
            //console.log("Your car was inserted into relation correctly!");
            // re-prompt the user for if they want to bid or post
            CustomerMain(username);          
          });
        });
      });    
  });
}
  








