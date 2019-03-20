// NPM PACKAGES
var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table');

// CONNECTION TO SQL SERVER
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Gaels4572',
  database: 'bamazon'
});

// COUNTER
var numberOfProductTypes = 0;

// CONNECT TO DATABASE
connection.connect(function(error){
  if(error){
    console.log("error connecting: ", error.stack);
  }
  loadProducts();
})

// LOAD PRODUCTS FUNCTION
function loadProducts(){
  connection.query('SELECT * FROM products', function(error, response){
    if(error) throw error;
    console.log(response);
    console.table(response);
    
    // CALL
    promptCustomerForItem(response);
  });
}

// PROMPT CUSTOMERS
function promptCustomerForItem (inventory){
  
  inquirer
  .prompt([
    {
      type: 'input',
      name: 'choice',
      message: 'What is the ID of the item that you would like to purchase?',
      validation: function(val){
        return !NaN(val) || val.toLowerCase() === 'q';
      }
    }
  ])
  .then(function(val){
    // checkIfShouldExit(val.choice);
    var choiceID = parseInt(val.choice);
    var product = checkInventory(choiceID, inventory);
    console.log('testing!!!!!!!!!!', product);
    if(product){
      promptCustomerForQuantity(product);
    }
    else{
      console.log('\n That item is no longer in our inventory. Please check back with us in 2 weeks.');
      loadProducts();
    }
  });
}

function promptCustomerForQuantity(product){
  inquirer
  .prompt([
    {
      type: 'input',
      name: 'quantity',
      message: 'How many do you want to purchase? Click Q to quit.',
      validate: function(val){
        return val > 0 || val.toLowerCase() === 'q';
      }
    }
  ])
  .then(function(val){
    checkIfShouldExit(val.quantity);
    if(val.quantity > product.stock_quantity){
      console.log ('Insufficient Quantity To Fill Order; Product Not In Stock.');
      loadProducts();
    }
    else{
      makePurchase(product, val.quantity);
    }
  })
}

// UPDATE products SET stock_quantity = 200 WHERE id = 18
function makePurchase (product, quantity){
  // product.stock_quantity - quantity
  // produce.id
  connection.query(
    'UPDATE products SET ? WHERE ?',
    [{stock_quantity: product.stock_quantity - quantity}, {id: product.id}], function (err, res) {
      if(err){
        console.log(err)
      }
      console.log('\nSuccessfully Purchased!');
      loadProducts();
    });
}

function checkInventory(choiceID, inventory){
  for (var i = 0; i < inventory.length; i++){
    if(inventory[i].id === choiceID){
      return inventory[i];
    }
  }
    return null;
}

function checkIfShouldExit(choice){
  if(choice.toLowerCase() === "q"){
    console.log ('Exiting Program.');
    process.exit(0);
  }
}
