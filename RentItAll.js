var mysql = require("mysql");
var inquirer = require("inquirer");
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
        message: "Are you a new or returning Employee",
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
  console.log("welcome new Employee!");
  locations = ["315 E San Fernando", "189 Curtner Av", "167 E Taylor St"];
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
  
  inquirer
    .prompt([
       {
        name: "position",
        type: "list",
        message: "What position are you?",
        choices: ["Mechanic", "Manager", "Receptionist"]
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
        message: "What location are you at?",
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
          console.log("Your employee was created successfully!");
          // re-prompt the user for if they want to bid or post
        }
      );
      //insert into sub tables
      if(answer.position == "Mechanic"){
          connection.query(
          "INSERT INTO mechanic SET ?",
          {
            //this is the meachinc's ssn
            m_ssn: answer.SSN,
            //ma_ssn is the manager ssn
            ma_ssn: answer.manager,
          },
          function(err) {
            if (err) throw err;
            //if no err, will go back to login, now the employee should hit the returning employee. 
            console.log("Your mechanic was created successfully!");
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
            ma_ssn: answer.manager,
          },
          function(err) {
            if (err) throw err;
            //if no err, will go back to login, now the employee should hit the returning employee. 
            console.log("Your receptionist was created successfully!");
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
            console.log("Your manager was created successfully!");
            // re-prompt the user for if they want to bid or post
          }
        );
        managerMain();
      }else{
        console.log("all of the sub menues have failed and should not end up here");
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
                  console.log("your username and/or ssn is incorrect, please try again");
                  Employeelogin();
                }
              }
          }          
        });
    });
}  

function receptionistMain(ssn){
  console.log("welcome to receptionist Main");
  inquirer.prompt({
        name: "receptionistMenu",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Customer", "Add Customer"]
      })
      .then(function(answer) {
        if(answer.receptionistMenu == "View Customer"){
          // maybe just one's based on the re_ssn in the assits table?
            connection.query("SELECT * FROM assist WHERE re_ssn = " + mysql.escape(ssn), function(err, results) {
             if (err){throw err;}

             var toDisplay = [];
             toReturn = "";
             header ="Receptionist  CustomerUsername";

             for (var i = 0; i < results.length; i++) {
                toReturn = "";
                toReturn = toReturn + results[i].re_ssn + results[i].cu_username;
                toDisplay.push(customerArray[i]);
             }
             toDisplay.unshift(header);
             console.log(toDisplay);
           });
          receptionistMain(ssn);
        } else if(answer.receptionistMenu == "Add Customer"){
              
          inquirer.prompt([
            {
              name: "username",
              type: "input",
              message: "What is your username"
            },
            {
              name: "password",
              type: "input",
              message: "What is your password",
              
            },
            {
              name: "name",
              type: "input",
              message: "What is your name"
            },
            {
              name: "address",
              type: "input",
              message: "What is your address"
            },
            {
              name: "phone_number",
              type: "input",
              message: "What is your phone_number"
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
                console.log("The Customer was created successfully!");
                // re-prompt the user for if they want to bid or post
                receptionistMain(ssn)
              }
            );
            connection.query(
              "INSERT INTO customer SET ?",
              {
                cu_username: answer.username,
                re_ssn: ssn
              },
              function(err) {
                if (err) throw err;
                
                //if no err, will go back to login, now the employee should hit the returning employee. 
                console.log("Your employee was created successfully!");
                // re-prompt the user for if they want to bid or post
                receptionistMain(ssn)
              }
            );
          });
    } else{
      console.log("ooPS Should not be here at all!")
    }
  });
}

function managerMain(ssn){
  console.log("welcome to manager Main");
  inquirer.prompt({
        name: "ManagerMenu",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Car", "Add Car", "Remove Car", "Modify Car", "Logout"]
      })
      .then(function(answer) {
        if(answer.ManagerMenu == "View Car"){
           // list the car table using connectino
           viewCars();
           managerMain(ssn)
        } else if(answer.ManagerMenu == "Add Car"){
          //same logic as cusotmer adding car, except now fill in this ms_ssn
          locations = ["315 E San Fernando", "189 Curtner Av", "167 E Taylor St"];
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
                name: "location",
                type: "list",
                message: "Choose Location",
                choices: locations
              }      
            ]).then(function(answer) {
              //do some salary logic
              var source = 1;
              var purpose = "SELL";


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
                  conditions: answer.conditions

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
          managerLogout();
        } else{
          console.log("ooPS Should not be here at all!")
        }
      });
}

function mechanicMain(ssn){
  console.log("welcome to mechanic Main");
  //show all of the service instances with this mechanic ssn
  inquirer.prompt({
        name: "mechanicMenu",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Schedule"]
      })
      .then(function(answer) {
        if(answer.receptionistMenu == "View Schedule"){         
          connection.query("SELECT * FROM service_instance", function(err, results) {
           if (err){throw err;}
           var toDisplay = [];
           var header = "Customer UserName  bID Price Time VIN" + '\n' + "";
            for (var i = 0; i < results.length; i++) {
             if (ssn == results[i].me_ssn) {
               var toReturn = "";
             
               toReturn = toReturn + results[i].cu_username + " ";
               toReturn = toReturn + results[i].b_id + " ";
               toReturn = toReturn + results[i].price + " ";
               toReturn = toReturn + results[i].time_book + " ";
               toReturn = toReturn + results[i].car_VIN;

               toDisplay.push(toReturn);
             }
               
             }
           toDisplay.unshift(header);

           for(var i = 0; i<toDisplay.length; i++){

             console.log(toDisplay[i]);
             console.log("---------------------------------------------------");
           }
         }); 
      }
    });
}
//ALL OF CUSTOMER

function Customer() {
  inquirer
      .prompt({
        name: "customerType",
        type: "list",
        message: "Are you a new or returning customer",
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
        message: "What is your username"
      },
      {
        name: "password",
        type: "input",
        message: "What is your password",
        
      },
      {
        name: "name",
        type: "input",
        message: "What is your name"
      },
      {
        name: "address",
        type: "input",
        message: "What is your address"
      },
      {
        name: "phone_number",
        type: "input",
        message: "What is your phone_number"
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
          console.log("Your employee was created successfully!");
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
        message: "username"
      },
      {
        name: "password",
        type: "password",
        message: "password"
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info\
         connection.query("SELECT username, password FROM customer", function(err, results) {
           if (err){
             throw err;
           } 
          for (var i = 0; i < results.length; i++){
            if(answer.username == results[i].username && answer.password == results[i].password){
               CustomerMain(results[i].username);
               i = results.length++;
            }else {
              if(i == results.length-1){
                console.log("your username and/or ssn is incorrect, please try again");
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
        message: "What would you like to do?",
        choices: ["buy" , "sell", "rent" ,"rentout", "maintenance" , "review", "logout"]
      })
      .then(function(answer) {
        if (answer.menu == "buy") {
          customerBuy(username);  
        } else if (answer.menu == "sell") {
          customerSell(username);  
        } else if (answer.menu == "rent") {
          customerRent(username);  
        } else if (answer.menu == "rentout") {
          customerRentOut(username);  
        } else if (answer.menu == "maintenance") {
          customerMaintenance(username);
        } else if (answer.menu == "review") {
          customerReview(username);  
        } else if (answer.menu == "logout") {
          customerLogout();  
        }
      });  
}

function customerBuy(username){
  inquirer
      .prompt({
        name: "buyMenu",
        type: "list",
        message: "what would you like to do",
        choices: ["List cars", "Filter", "Return"]
      })
      .then(function(answer) {
        if (answer.buyMenu == "List cars") {
         buyCars(username)
        } else if(answer.buyMenu == "Filter") {
          console.log("Filter!!!!!!");
          //Implement
          
        } else if(answer.buyMenu == "Return") {
          CustomerMain(username);
        } else{
          console.log("oh no, not good");
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


locations = ["315 E San Fernando", "189 Curtner Av", "167 E Taylor St"];
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
        message: "Choose Location",
        choices: locations
      },{
        name: "manager",
        type: "list",
        message: "Choose Manger",
        choices: managersID
      }      
    ]).then(function(answer) {
      
      //manager logic

      //do some salary logic
      var source = 0;
      var purpose = "SELL";
      var available = "yes"
      connection.query(
        "INSERT INTO car SET ?",
        {
          VIN: answer.VIN,
          loc_address: answer.location,
          ma_ssn: answer.manager,
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
            
            console.log("inserted into the car relation!")
            CustomerMain(username); 
         });

    });
}

function customerRent(username){
  inquirer
      .prompt({
        name: "rentMenu",
        type: "list",
        message: "what would you like to do",
        choices: ["List cars", "Filter", "Return"]
      })
      .then(function(answer) {
        if (answer.rentMenu == "List cars") {
         rentCars(username);
        } else if(answer.rentMenu == "Filter") {
          console.log("Filter!!!!!!");
          //Implement
        } else if(answer.rentMenu == "Return") {
          CustomerMain(username);
        } else{
          console.log("oh no, not good");
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
  locations = ["315 E San Fernando", "189 Curtner Av", "167 E Taylor St"];
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
        message: "Choose Location",
        choices: locations
      },{
        name: "manager",
        type: "list",
        message: "Choose Manger",
        choices: managersID
      }      
    ]).then(function(answer) {
      //do some salary logic
      var available = "yes";
      connection.query(
        "INSERT INTO car SET ?",
        {
          VIN: answer.VIN,
          loc_address: answer.location,
          ma_ssn: answer.manager,
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
          console.log("Your car was inserted  cars correctly!");
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
              
              console.log("Your car was inserted into relation correctly!");
              CustomerMain(username);          
           });
      });
  }

function customerMaintenance(username){
inquirer
      .prompt({
        name: "maintenanceMenu",
        type: "list",
        message: "what would you like to do",
        choices: ["Schedule", "Check Current", "Return"]
      })
      .then(function(answer) {
        if (answer.maintenanceMenu == "Schedule") {
         customerMaintenanceSchedule(username);
        } else if(answer.maintenanceMenu == "Check Current") {
          //sql for cars under the customer          
          connection.query("SELECT * FROM service_instance", function(err, results) {
             if (err){
               throw err;
             }
             var toDisplay = [];
             var header = "Customer Username  bID  Price  timeBook  carVin  mechanic" + '\n' + "";
            for (var i = 0; i < reviews.length; i++) {
              
              var toReturn = "";
              toReturn = toReturn + results[i].cu_username + " ";
              toReturn = toReturn + results[i].b_id + " ";
              toReturn = toReturn + results[i].price + " ";
              toReturn = toReturn + results[i].time_book + " ";
              toReturn = toReturn + results[i].car_VIN + " ";
              toReturn = toReturn + results[i].me_ssn + " ";
              toDisplay.push(toReturn);
            }
            toDisplay.upshift(heasder);
            for(var i = 0; i<toDisplay.length; i++){
               console.log(toDisplay[i]);
               console.log("---------------------------------------------------");
             }     
          });

        } else if(answer.maintenanceMenu == "Return") {
          CustomerMain(username);
        } else{
          console.log("oh no, not good");
        }
      });  
}

function customerMaintenanceSchedule(username){
  locations = ["315 E San Fernando", "189 Curtner Av", "167 E Taylor St"];

  inquirer
      .prompt({
        name: "maintenanceMenu",
        type: "list",
        message: "What Service would you like",
        choices: ["Oil Change","Tire Roatation", "Brake", "Return"]
      },{
        name: "location",
        type: "list",
        message: "Which locations would you like?",
        choices: locations
      },
      {
        name: "mechanic",
        type: "list",
        message: "Choose a mechanic",
        choices: meSSNs
      },{
        name: "VIN",
        type: "input",
        message: "VIN:"
      }, {
        name: "date",
        type: "input",
        message: "please enter date in format:MMDDYYYY 01012020"
      })
      .then(function(answer) {
        var price = 0;
        if (answer.maintenanceMenu == "Schedule") {
         price = 50;
        } else if(answer.maintenanceMenu == "Tire Roatation") {
          
          price = 20;
        } else if(answer.maintenanceMenu == "Brake") {
          
          price = 200
        } else if(answer.maintenanceMenu == "Return") {
          CustomerMain(username);
        } else{
          
        }

        connection.query(
          "INSERT INTO maintenance_service SET ?",
          {
            name: answer.maintenanceMenu,
            price: price,
            me_ssn: answer.meSSN
          },
          function(err) {
            if (err) throw err;
            
            //if no err, will go back to login, now the employee should hit the returning employee. 
            console.log("Your car was inserted correctly!");
            // re-prompt the user for if they want to bid or post
            customerMain(username);          
          })
      });
}

function customerReview(username){
  locations = ["315 E San Fernando", "189 Curtner Av", "167 E Taylor St"];
  inquirer
      .prompt({
        name: "reviewMenu",
        type: "list",
        message: "What Service would you like",
        choices: ["Check Reviews", "Write Reviews", "Return"]
      })
      .then(function(answer) {
        if (answer.reviewMenu == "Check Reviews") {
         checkReview();
         //implemnt
        } else if(answer.reviewMenu == "Write Reviews") {
          writeReview(username);
          //Implement
        } else if(answer.reviewMenu == "Return") {
          CustomerMain(username);
        } else{
          console.log("oh no, not good");
        }
      });
}

function writeReview(username){
  var id = 0;
  locations = ["315 E San Fernando", "189 Curtner Av", "167 E Taylor St"];
  inquirer
      .prompt([{
        name: "review",
        type: "input",
        message: "Please write your review"
      },
      {
        name: "location",
        type: "list",
        message: "What location are you at?",
        choices: locations
      },
      {
        name: "stars",
        type: "list",
        message: "How many stars would you rate??",
        choices: [1,2,3,4,5]
      }
      ]).then(function(answer) {
        console.log("here is your review: " + answer.review);
        connection.query(
          "INSERT INTO review SET ?",
          {
            r_id: id,
            stars: answer.stars,
            content: answer.review,
            cu_username: username, 
            loc_address: answer.location
          },
          function(err) {
            if (err) throw err;
            
            //if no err, will go back to login, now the employee should hit the returning employee. 
            console.log("Your car was inserted correctly!");
            // re-prompt the user for if they want to bid or post
            managerMain();          
          })
        
        console.log("you review has been entered");
        CustomerMain(username);
      });
}

function checkReview(){
  var reviews = [];
  connection.query("SELECT * FROM review", function(err, results) {
     if (err){
       throw err;
     }
      for (var i = 0; i < results.length; i++) {      
        reviews.push(results[i].content);
      }     
     });
     
     var toDisplay = [];
     var header = "Reviews" + '\n' + "";

    for (var i = 0; i < reviews.length; i++) {
      
      var toReturn = "";
      toReturn = toReturn + results[i].content + '\n';
      toDisplay.push(toReturn);
    }
    toDisplay.upshift(header);
    for(var i = 0; i<toDisplay.length; i++){
       console.log(toDisplay[i]);
       console.log("---------------------------------------------------");
     }
}




function customerLogout(){
  start();  
}

function managerLogout(){
  start();  
}

//Helper Methods
function viewCars() {
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
        message: "Which Car would you like to remove?",
        choices: toDisplay
      }).then(function(answer) {
          var res = answer.cars.split(" ");
          console.log("this is the vin, for the car you just removed is: " + res[1]);
          VINBought = res[1];
           console.log("the vin is: " + VINBought);

          connection.query(
            "Delete from car where VIN = " + mysql.escape(VINBought),
            function(err) {
              if (err) throw err;
              //if no err, will go back to login, now the employee should hit the returning employee. 
              console.log("Thanks for buying the car, it is now off of our lot");
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
        message: "Which Car would you like change the price?",
        choices: toDisplay
      },{
        name: "price",
        type: "input",
        message: "What is the new price?"
      }]).then(function(answer) {
          var res = answer.cars.split(" ");
          console.log("this is the vin, for the car you just selected is: " + res[1]);
          VINBought = res[1];
          console.log("the vin is: " + VINBought);
          connection.query(
            "UPDATE car SET price = " + mysql.escape(answer.price) + "WHERE VIN = " + mysql.escape(VINBought),
            function(err) {
              if (err) throw err;
              //if no err, will go back to login, now the employee should hit the returning employee. 
              console.log("The car has been removed from the lot");
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
  inquirer
      .prompt({
        name: "cars",
        type: "list",
        message: "Which Car would you like to buy?",
        choices: toDisplay
      }).then(function(answer) {
          var res = answer.cars.split(" ");
          VINBought = res[1];
          //"UPDATE car SET price = " + mysql.escape(answer.price) + "WHERE VIN = " + mysql.escape(VINBought),
          connection.query(
            "UPDATE car SET available = 'no' WHERE VIN = " + mysql.escape(VINBought),
            function(err) {
              if (err) throw err;
              //if no err, will go back to login, now the employee should hit the returning employee. 
              console.log("Thanks for buying the car, it is now off of our lot");
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
            console.log("Your car was inserted into relation correctly!");
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
  inquirer
      .prompt({
        name: "cars",
        type: "list",
        message: "Which Car would you like to rent?",
        choices: toDisplay
      }).then(function(answer) {
          var res = answer.cars.split(" ");
          VINBought = res[1];
          //"UPDATE car SET price = " + mysql.escape(answer.price) + "WHERE VIN = " + mysql.escape(VINBought),
          connection.query(
            "UPDATE car SET available = 'no' WHERE VIN = " + mysql.escape(VINBought),
            function(err) {
              if (err) throw err;
              //if no err, will go back to login, now the employee should hit the returning employee. 
              console.log("Thanks for renting the car, it is now off of our lot");
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
            console.log("Your car was inserted into relation correctly!");
            // re-prompt the user for if they want to bid or post
            CustomerMain(username);          
          });
        });
      });    
  });
}
  








