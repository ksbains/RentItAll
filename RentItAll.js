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
        choices: ["New Employee", "Returning Employee"]
      })
      .then(function(answer) {
        // based on their answer, either call the createEmployee or the signInEmployee  functions
        if (answer.userType.toUpperCase() === "NEW EMPLOYEE") {
          createEmployee();
        }
        else {
          //This method will handle the employee flow
          Employeelogin();
        }
      });
 };

function createEmployee(){
  console.log("welcome new Employee!");
  var locations = [];
  connection.query("SELECT address FROM company_locations", function(err, results) {
   if (err){
     throw err;
   }
    for (var i = 0; i < results.length; i++) {      
      locations.push(results[i].address);
    }     
   }); 
  //locations = ["123 Irvington St", "123 Washington St"];
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
      },
      {
        name: "manager",
        type: "list",
        message: "Who is your manager, please select Manager ID?",
        choices: managersID
      }]).then(function(answer) {
      var salary = 0;
      if(answer.position == "Mechanic"){
        salary = 65000;
      } else if(answer.position == "Receptionist"){
        salary = 45000;
      } else if(answer.position == "Manager"){
        salary = 95000;
      }else{
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
            connection.query("SELECT * FROM assist", function(err, results) {
             if (err){throw err;}
             var cusotomerArray = [];
             var recepArray = [];

             for(var i = 0; i< results.length; i++){
              customerArray.push(results[i].cu_username);
              recepArray.push(results[i].re_ssn);
             }

             var toDisplay = [];

             for (var i = 0; i < recepArray.length; i++) {
               if(recepArray[i] == ssn){
                 toDisplay.push(customerArray[i]);
               }
             }
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
        choices: ["View Car", "Add Car", "Remove Car", "Modify Car"]
      })
      .then(function(answer) {
        if(answer.ManagerMenu == "View Car"){
           // list the car table using connectino
           viewCars();
           managerMain(ssn)
        } else if(answer.ManagerMenu == "Add Car"){
          //same logic as cusotmer adding car, except now fill in this ms_ssn
          var locations = [];
          connection.query("SELECT address FROM company_locations", function(err, results) {
           if (err){
             throw err;
           }
            for (var i = 0; i < results.length; i++) {      
              locations.push(results[i].address);
            }     
           });
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
              var purpose = "sell";


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
          //removeCar();
          //managerMain();
        } else if(answer.ManagerMenu == "Modify Car"){
          //modify car's price
          //managerMain();
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
        choices: ["New Customer", "Returning Customer"]
      })
      .then(function(answer) {
        // based on their answer, either call the createEmployee or the signInEmployee  functions
        if (answer.customerType.toUpperCase() === "NEW CUSTOMER") {
          createCustomer();
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
          CustomerMain();
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
              if(i == usernameArray.length-1){
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
          customerBuy();  
        } else if (answer.menu == "sell") {
          customerSell(username);  
        } else if (answer.menu == "rent") {
          customerRent();  
        } else if (answer.menu == "rentout") {
          customerRentOut();  
        } else if (answer.menu == "maintenance") {
          customerMaintenance(username);
        } else if (answer.menu == "review") {
          customerReview(username);  
        } else if (answer.menu == "logout") {
          customerLogout();  
        }
      });  
}

function customerBuy(){
  inquirer
      .prompt({
        name: "buyMenu",
        type: "list",
        message: "what would you like to do",
        choices: ["List cars", "Filter", "Return"]
      })
      .then(function(answer) {
        if (answer.buyMenu == "List cars") {
         buyCars()
        } else if(answer.buyMenu == "Filter") {
          console.log("Filter!!!!!!");
          //Implement
          
        } else if(answer.buyMenu == "Return") {
          CustomerMain();
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


var locations = [];
  connection.query("SELECT address FROM company_locations", function(err, results) {
   if (err){
     throw err;
   }
    for (var i = 0; i < results.length; i++) {      
      locations.push(results[i].address);
    }     
   });
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
        message: "Price: "
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
      var purpose = "sell";
      connection.query(
        "INSERT INTO car SET ?",
        {
          VIN: answer.VIN,
          loc_address: answer.location,
          ma_ssn: answer.manager,
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
        })

      connection.query(
        "INSERT INTO sell SET ?",
        {
          cu_username: username,
          price: answer.price,
          car_VIN: answer.VIN
          
        },
        function(err) {
          if (err) throw err;
            
            CustomerMain();          
         });

    });
}

function customerRent(){
  inquirer
      .prompt({
        name: "rentMenu",
        type: "list",
        message: "what would you like to do",
        choices: ["List cars", "Filter", "Return"]
      })
      .then(function(answer) {
        if (answer.rentMenu == "List cars") {
         console.log("these are all of the cars!")   
         viewCars();
        } else if(answer.rentMenu == "Filter") {
          console.log("Filter!!!!!!");
          //Implement
        } else if(answer.rentMenu == "Return") {
          CustomerMain();
        } else{
          console.log("oh no, not good");
        }
      });  
}

function customerRentOut(){
  var locations = [];
  connection.query("SELECT address FROM company_locations", function(err, results) {
   if (err){
     throw err;
   }
    for (var i = 0; i < results.length; i++) {      
      locations.push(results[i].address);
    }     
   });
  var maSSN = "123456789";
  var source = 0;
  var purpose = "rent"

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
      },      
    ]).then(function(answer) {
      //do some salary logic

      connection.query(
        "INSERT INTO car SET ?",
        {
          VIN: answer.VIN,
          location: location,
          maSSN: maSSN,
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
          CustomerMain();          
        })
      })
  }

function customerMaintenance(username){
inquirer
      .prompt({
        name: "maintenanceMenu",
        type: "list",
        message: "what would you like to do",
        choices: ["Schedule", "Check Current"]
      })
      .then(function(answer) {
        if (answer.maintenanceMenu == "Schedule") {
         customerMaintenanceSchedule();
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
          CustomerMain();
        } else{
          console.log("oh no, not good");
        }
      });  
}

function customerMaintenanceSchedule(){
  var meSSNs = [];
  connection.query("SELECT m_ssn FROM mechanic", function(err, results) {
   if (err){
     throw err;
   }
    for (var i = 0; i < results.length; i++) {      
      meSSNs.push(results[i].m_ssn);
    }     
   });
  inquirer
      .prompt({
        name: "maintenanceMenu",
        type: "list",
        message: "What Service would you like",
        choices: ["Oil Change","Tire Roatation", "Brake", "Return"]
      },{
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
         console.log("oh goody! oil change");
         price = 50;
        } else if(answer.maintenanceMenu == "Tire Roatation") {
          console.log("Tire rotation");
          price = 20;
        } else if(answer.maintenanceMenu == "Brake") {
          console.log("Brake");
          price = 200
        } else if(answer.maintenanceMenu == "Return") {
          CustomerMain();
        } else{
          console.log("oh no, not good");
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
            managerMain();          
          })
      });
}

function customerReview(username){
  var locations = [];
  connection.query("SELECT address FROM company_locations", function(err, results) {
   if (err){
     throw err;
   }
    for (var i = 0; i < results.length; i++) {      
      locations.push(results[i].address);
    }     
   });
  inquirer
      .prompt({
        name: "reviewMenu",
        type: "list",
        message: "What Service would you like",
        choices: ["Check Reviews", "Write Reviews"]
      })
      .then(function(answer) {
        if (answer.reviewMenu == "Check Reviews") {
         checkReview();
         //implemnt
        } else if(answer.reviewMenu == "Write Reviews") {
          writeReview(username);
          //Implement
        } else{
          console.log("oh no, not good");
        }
      });
}

function writeReview(username){
  var id = 0;
  var locations = [];
  connection.query("SELECT address FROM company_locations", function(err, results) {
   if (err){
     throw err;
   }
    for (var i = 0; i < results.length; i++) {      
      locations.push(results[i].address);
    }     
   });
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
        CustomerMain();
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
    toDisplay.upshift(heasder);
    for(var i = 0; i<toDisplay.length; i++){
       console.log(toDisplay[i]);
       console.log("---------------------------------------------------");
     }
}




function customerLogout(){
  start();  
}

//Helper Methods
function viewCars() {
  connection.query("SELECT * FROM car", function(err, results) {
   if (err){throw err;}
   
   var toDisplay = [];
   var header = "Make Model Year VIN address" + '\n' + "";
    for (var i = 0; i < results.length; i++) {
     
       var toReturn = "";
     
       toReturn = toReturn + results[i].make + " ";
       toReturn = toReturn + results[i].model + " ";
       toReturn = toReturn + results[i].year + " ";
       toReturn = toReturn + results[i].VIN + " ";
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


function buyCars(){
  var header = "Make Model Year VIN address" + '\n' + "";
  var toDisplay = [];
  var VINBought = "";
  
  connection.query("SELECT * FROM car", function(err, results) {
   if (err){throw err;}
    
    for (var i = 0; i < results.length; i++) {
       var toReturn = "";
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
          console.log("this is the vin, for the car you just bought" + res[0]);
          VINBought = res[0];
           console.log("the vin is: " + VINBought);

          //var sql = "DELETE FROM car WHERE VIN = '" + VINBought +"'";
          //DHB100ZASFG
          //"DELETE FROM car WHERE VIN = '" + VINBought +"'",
          connection.query(
            "Delete from car where VIN = " + mysql.escape(VINBought),
            function(err) {
              if (err) throw err;
              //if no err, will go back to login, now the employee should hit the returning employee. 
              console.log("Thanks for buying the car, it is now off of our lot");
              // re-prompt the user for if they want to bid or post
              CustomerMain();
            });
    });    
  }); 
}
  




