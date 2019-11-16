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
      type: "rawlist",
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
        type: "rawlist",
        message: "",
        choices: ["New Employee", "Returning Employee"]
      })
      .then(function(answer) {
        // based on their answer, either call the createEmployee or the signInEmployee  functions
        if (answer.postOrBid.toUpperCase() === "NEW EMPLOYEE") {
          createEmployee();
        }
        else {
          //This method will handle the employee flow
          Employeelogin();
        }
      });
 }

function createEmployee(){
  
  var locations;
  
  // connection.query("SELECT address FROM company_locations", 
  //   function (err, result, fields) {
  //     if (err) throw err;

  //     for (var i = 0; i < result.length; i++) {
  //       location.push(result[i].address);
  //     }
  //   };

    locations = ["springfield", "cuba", "san jose"]
    managers = ["123456789", "012345678"]

  inquirer
    .prompt([
      {
        name: "SSN",
        type: "input",
        message: "SSN"
      },
      {
        name: "name",
        type: "input",
        message: "name"
      },{
        name: "position",
        type: "rawlist",
        message: "What position are you?",
        choices: ["Mechanic", "Manager", "Receptionist"]
      },{
        name: "location",
        type: "rawlist",
        message: "What location are you at?",
        choices: locations
      },
      {
        name: "manager",
        type: "rawlist",
        message: "Whis your manager?",
        choices: managers
      }
    ])
    .then(function(answer) {
      //do some salary logic
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
        "INSERT INTO employees SET ?",
        {
          SSN: answer.SSN,
          name: answer.name,
          address: answer.address,
          salary: salary,
          manager: manager,
          position: answer.position
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
// function to handle posting new items up for auction
function EmployeeLogin() {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "username",
        type: "input",
        message: "username"
      },
      {
        name: "SSN",
        type: "input",
        message: "SSN"
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO employees SET ?",
        {
          username: answer.username,
          password: answer.password
        },
        function(err) {
          if (err) throw err;
          console.log("Your employee was created successfully!");
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });
}

//ALL OF CUSTOMER

function Customer() {
  inquirer
      .prompt({
        name: "customerType",
        type: "rawlist",
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
  var password = "password";

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
        type: "rawlist",
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
        type: "rawlist",
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

function customerSell(){
  var location = "bikinin bottom";
  var maSSN = "012345678";
  var source = 0;
  var purpose = "sell"

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
        }
}

function customerRent(){
  inquirer
      .prompt({
        name: "rentMenu",
        type: "rawlist",
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
  var location = "bikinin bottom";
  var maSSN = "012345678";
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
        }
}

function customerMaintenance(){
inquirer
      .prompt({
        name: "maintenanceMenu",
        type: "rawlist",
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
  locations = ["springfield", "cuba", "san jose"]
  inquirer
      .prompt({
        name: "maintenanceMenu",
        type: "rawlist",
        message: "What Service would you like",
        choices: ["Oil Change","Tire Roatation", "Brake", "Return"]
      },{
        name: "location",
        type: "rawlist",
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
  locations = ["springfield", "cuba", "san jose"]
  inquirer
      .prompt({
        name: "reviewMenu",
        type: "rawlist",
        message: "What Service would you like",
        choices: ["Check Reveiws", "Write Reviews"]
      }
      .then(function(answer) {
        if (answer.reviewMenu == "Check Reveiws") {
         checkReview();
         //implemnt
        } else if(answer.reviewMenu == "Tire Roatation") {
          writeReview();
          //Implement
        } else{
          console.log("oh no, not good");
        }
      });
}

function writeReview(){
  locations = ["springfield", "cuba", "san jose"]
  inquirer
      .prompt({
        name: "location",
        type: "rawlist",
        message: "What location are you at?",
        choices: locations
      },{
        name: "review",
        type: "input",
        message: "Please write your review",
      }
      .then(function(answer) {
        console.log("you review has been entered");
        CustomerMain();
      });
}


function checkReview(){
  locations = ["springfield", "cuba", "san jose"]
  inquirer
      .prompt({
        name: "location",
        type: "rawlist",
        message: "What location are you at?",
        choices: locations
      }
      .then(function(answer) {
        console("here are the reviews for " + answer.location);
        CustomerMain();
      });
}

function customerLogout(){
  start();  
}










