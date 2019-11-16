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
        "INSERT INTO employees SET ?",
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
      // when finished prompting, insert a new item into the db with that info\
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












////STARTER CODE:
// function to handle posting new items up for auction
function postAuction() {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "What is the item you would like to submit?"
      },
      {
        name: "category",
        type: "input",
        message: "What category would you like to place your auction in?"
      },
      {
        name: "startingBid",
        type: "input",
        message: "What would you like your starting bid to be?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO auctions SET ?",
        {
          item_name: answer.item,
          category: answer.category,
          starting_bid: answer.startingBid,
          highest_bid: answer.startingBid
        },
        function(err) {
          if (err) throw err;
          console.log("Your auction was created successfully!");
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });
}

function bidAuction() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM auctions", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].item_name);
            }
            return choiceArray;
          },
          message: "What auction would you like to place a bid in?"
        },
        {
          name: "bid",
          type: "input",
          message: "How much would you like to bid?"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_name === answer.choice) {
            chosenItem = results[i];
          }
        }

        // determine if bid was high enough
        if (chosenItem.highest_bid < parseInt(answer.bid)) {
          // bid was high enough, so update db, let the user know, and start over
          connection.query(
            "UPDATE auctions SET ? WHERE ?",
            [
              {
                highest_bid: answer.bid
              },
              {
                id: chosenItem.id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Bid placed successfully!");
              start();
            }
          );
        }
        else {
          // bid wasn't high enough, so apologize and start over
          console.log("Your bid was too low. Try again...");
          start();
        }
      });
  });
}
