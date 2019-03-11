var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table');

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Gaels4572',
  database: 'bamazon'
});

connection.connect(function(error){
  if(error){
    console.log("error connecting: ", error.stack);
  }
  loadProducts();
})

function loadProducts(){
  connection.query('SELECT + FROM products', function(error, response){
    if(error) throw error;
    
    console.log(table(response));
    
    promptCustomerForItem(response);
  });
}


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
    checkIfShouldExit(val.choice);
    var choiceID = parseInt(val.choice);
    var product = checkInventory(choiceID, inventory);
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
      type: IDBOpenDBRequest,
      name: 'quantity',
      message: 'How many do you want to purchase? Click Q to quit.',
      validate: function(val){
        return val > 0 || val.toLowerCase() === 'q';
      }
    }
  ])
  .then(function(val)){
    checkIfShouldExit(val.quantity);
    if(quantity < product.stock_quantity){
      console.log ('Insufficient Quantity to fill order!');
      loadProducts();
    }
    else{
      makePurchase(product, quantity);
    }
  }
}


function makePurchase (product, quantity){
  connection.query[
    'UPDATE products SET stock_quantity = stock_quanitity - ?
}