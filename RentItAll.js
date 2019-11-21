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
  managers = ["123456789", "123456786"];
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
        message: "Who is your manager?",
        choices: managers
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
                receptionistMain();
                i = nameArray.length++;
              } else if(salaryArray[i] == 65000){
                // this is for the mechanic
                mechanicMain();
                i = nameArray.length++;
              } else if(salaryArray[i] == 95000){
                // this is for the manager
                // might have to pass the ssn like this: managerMain(answer.SSN)
                managerMain();
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

function receptionistMain(){
  console.log("welcome to receptionist Main");
  inquirer.prompt({
        name: "receptionistMenu",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Customer", "Add Customer"]
      })
      .then(function(answer) {
        if(answer.receptionistMenu == "View Customer"){
          //show all customers? or maybe just one's based on teh re_ssn?
        } else if(answer.receptionistMenu == "Add Customer"){
          //should be same logic as create customer
        } else{
          console.log("ooPS Should not be here at all!")
        }
      });
}

function managerMain(){
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
        } else if(answer.ManagerMenu == "Add Car"){
          //same logic as cusotmer adding car, except now fill in this ms_ssn
        } else if(answer.ManagerMenu == "Remove Car"){
          //remove car from car table
        } else if(answer.ManagerMenu == "Modify Car"){
          //modify car no based on VIN
        } else{
          console.log("ooPS Should not be here at all!")
        }
      });
}

function mechanicMain(){
  console.log("welcome to mechanic Main");
  //show all of the service instances with this mechanic ssn
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
          phone_number: answer.phone_number
        },
        function(err) {
          if (err) throw err;
          
          //if no err, will go back to login, now the employee should hit the returning employee. 
          console.log("Your employee was created successfully!");
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });

}
function CustomerLogin() {
  // prompt for info about the item being put up for auction
  var username = "kb";
  var password = "";

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
     if(answer.username == username && answer.password == password){
       CustomerMain();
     } 
    });
}


function CustomerMain() {
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
          customerSell();  
        } else if (answer.menu == "rent") {
          customerRent();  
        } else if (answer.menu == "rentout") {
          customerRentOut();  
        } else if (answer.menu == "maintenance") {
          customerMaintenance();
        } else if (answer.menu == "review") {
          customerReview();  
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
         console.log("these are all of the cars!")   
         //implemnt
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

function customerSell() {
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
      var maSSN = "012345678";
      var source = 0;
      var purpose = "sell";


      connection.query(
        "INSERT INTO car SET ?",
        {
          VIN: answer.VIN,
          loc_address: location,
          ma_ssn: maSSN,
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
         //implemnt
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

function customerMaintenance(){
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
          console.log("show all of the cars for the scedule");
          //Implement
        } else if(answer.maintenanceMenu == "Return") {
          CustomerMain();
        } else{
          console.log("oh no, not good");
        }
      });  
}

function customerMaintenanceSchedule(){
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
        name: "maintenanceMenu",
        type: "list",
        message: "What Service would you like",
        choices: ["Oil Change","Tire Roatation", "Brake", "Return"]
      },{
        name: "location",
        type: "list",
        message: "Choose Location",
        choices: locations
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
        if (answer.maintenanceMenu == "Schedule") {
         console.log("oh goody! oil change");
         //implemnt
        } else if(answer.maintenanceMenu == "Tire Roatation") {
          console.log("Tire rotation");
          //Implement
        } else if(answer.maintenanceMenu == "Brake") {
          console.log("Brake");
          //Implement
        } else if(answer.maintenanceMenu == "Return") {
          CustomerMain();
        } else{
          console.log("oh no, not good");
        }

        console.log("put this in the service instance table");
      });
}

function customerReview(){
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
          writeReview();
          //Implement
        } else{
          console.log("oh no, not good");
        }
      });
}

function writeReview(){
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
      }]).then(function(answer) {
        console.log("here is your review: " + answer.review);
        console.log("you review has been entered");
        CustomerMain();
      });
}

function checkReview(){
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
        name: "location",
        type: "list",
        message: "What location are you at?",
        choices: locations
      })
      .then(function(answer) {
        console.log("here are the reviews for " + answer.location);
        CustomerMain();
      });
}

function customerLogout(){
  start();  
}










