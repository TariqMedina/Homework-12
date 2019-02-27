var connection = require("./connection.js");
var columnify = require('columnify');
var inquirer = require("inquirer");

function start() {
    inquirer.prompt([
        {
            name: "options",
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            message: "Please choose an option: "
        }
    ]).then(function (answer) {
        switch (answer.options) {
            case "View Products for Sale":
                viewall();
                break;
            case "View Low Inventory":
                viewlow();
                break;
            case "Add to Inventory":
                addinv();
                break;
            case "Add New Product":
                addnew();
                break;
        }
    })
}
function viewall() {
    connection.query("SELECT id, product_name, price, stock_quantity FROM products;", function (err, data) {
        console.log(columnify(data, { config: { stock_quantity: { align: 'right' } } }));
        cont();
    })
}

function viewlow() {
    connection.query("SELECT id, product_name, price, stock_quantity FROM products WHERE stock_quantity<5;", function (err, data) {
        console.log(columnify(data, { config: { stock_quantity: { align: 'right' } } }));
        cont();
    })
}

function addinv() {

    connection.query("SELECT id, product_name, stock_quantity FROM products;", function (err, data) {
        var items = [];
        var itemid = 0;
        for (i in data) {
            var item = {
                name: data[i].product_name,
                value: i
            }
            items.push(item);
        }
        inquirer
            .prompt([
                {
                    name: "prodid",
                    message: "Which item do you want to add inventory for: ",
                    validate: function (value) {
                        if (isNaN(value) === false && value < data.length) {
                            return true;
                        }
                        console.log("\n-- Enter valid Product ID --\n");
                        return false;
                    },
                    type: "list",
                    choices: items
                },
                {
                    name: "prodqty",
                    message: "Please enter quantity needed: ",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        console.log("\n-- Enter valid Quantity --\n");
                        return false;
                    }
                }

            ]).then(function (answer) {
                var newqty;
                itemid = data[answer.prodid].id;
                newqty = parseInt(data[answer.prodid].stock_quantity) + parseInt(answer.prodqty);
                updatestock(itemid, newqty);
                console.log("\nYou have added " + answer.prodqty + " pieces to item *" + data[answer.prodid].product_name + "* for a total of " + newqty + ".\n");
                cont();
            });
    })


}

function updatestock(myid, qtyrem) {
    var query = connection.query("UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: qtyrem
            },
            {
                id: myid
            }
        ], function (err, data) {
            // console.log(query.sql)
            return;
        })
}

function addnew() {
    console.log("\n")
    inquirer
        .prompt([
            {
                name: "iname",
                message: "Enter product name: "
            },
            {
                name: "idept",
                message: "Enter department name: "
            },
            {
                name: "iqty",
                message: "Enter item quantity: ",
                validate: function (value) {
                    if (Number.isInteger(parseInt(value))) {
                        return true;
                    }
                    console.log("\n-- Enter valid Quantity --\n");
                    return false;
                }
            },
            {
                name: "iprice",
                message: "Enter item price: ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    console.log("\n-- Enter valid Price --\n");
                    return false;
                }
            },

        ]).then(function (answer) {
            var query2 = connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?,?,?,?);",
            [answer.iname, answer.idept, answer.iprice, answer.iqty], 
            function (err, data) {
                cont();
            })
        })
}

function cont() {
    inquirer.prompt([
        {
            name: "cont",
            message: "Continue Working?",
            type: "confirm"
        }
    ]).then(function (answer2) {
        if (answer2.cont) {
            console.log("\n");
            start();
        }
        else {
            console.log("\nSee you next time!")
            connection.end();
            return;
        }
    })
}

start()