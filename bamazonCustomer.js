var connection = require("./connection.js");
var columnify = require('columnify');
var inquirer = require("inquirer");


connection.query("SELECT id, product_name, price, stock_quantity FROM products;", function (err, data2) {
    if (err) {
        return res.status(500).end();
    }
    var data = [];
    for (i in data2) {
        var newdata = {
            id: data2[i].id,
            product_name: data2[i].product_name,
            price: data2[i].price
        }
        data.push(newdata);
    }
    console.log(columnify(data) + "\n");
    // connection.end();
    function purchase() {
        inquirer
            .prompt([
                {
                    name: "prodid",
                    message: "Please enter Product ID you want to buy: ",
                    validate: function (value) {
                        if (isNaN(value) === false && value < data.length) {
                            return true;
                        }
                        console.log("\n-- Enter valid Product ID --\n");
                        return false;
                    }
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

            ])
            .then(function (answer) {
                if (answer.prodqty > data2[answer.prodid - 1].stock_quantity) {
                    console.log("\nInsufficient Quantity!\n");
                    cont();
                }
                else {
                    console.log("\nThanks for your purchase of qty *" + answer.prodqty + "* " + data[answer.prodid - 1].product_name + ". Your total is $" + (data[answer.prodid - 1].price * answer.prodqty) + ".\n");
                    var qtyrem = data2[answer.prodid - 1].stock_quantity - answer.prodqty;
                    var totsales = data[answer.prodid - 1].product_sales + (data[answer.prodid - 1].price * answer.prodqty);
                    // console.log(qtyrem);
                    updateqty(qtyrem, answer.prodid);
                    productsales(totsales, answer.prodid);
                    cont();
                }
            });
    }
    function cont() {
        console.log("\n");
        inquirer.prompt([
            {
                name: "cont",
                message: "Continue Shopping?",
                type: "confirm"
            }
        ]).then(function (answer2) {
            if (answer2.cont) {
                console.log("\n");
                purchase();
            }
            else {
                console.log("\nThanks for shopping with Bamazon!")
                connection.end();
                return;
            }
        })
    }
    purchase();
});

function updateqty(qtyrem, myid) {
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: qtyrem
            },
            {
                id: myid
            }
        ],
        function (err, res) {
            // console.log(query.sql)
        }
    );
}

function productsales(totsales, myid) {
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                product_sales = totsales
            },
            {
                id: myid
            }
        ],
        function (err, res) {
            // console.log(query.sql)
        }
    );
}