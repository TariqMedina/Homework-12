var connection = require("./connection.js");
var columnify = require('columnify');
var inquirer = require("inquirer");

function start() {
    inquirer.prompt([
        {
            name: "options",
            type: "list",
            choices: ["View Products Sales by Department", "Create New Department"],
            message: "Please choose an option: "
        }
    ]).then(function (answer) {
        switch (answer.options) {
            case "View Products Sales by Department":
                viewdept();
                break;
            case "Create New Department":
                addnew();
                break;
        }
    })
}

function viewdept() {
    connection.query("SELECT departments.id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) FROM departments LEFT JOIN products ON departments.department_name=products.department_name GROUP BY department_name", function (err, data) {
        var output = [];
        for (i in data){
            var record = {
                id: data[i].id,
                department_name: data[i].department_name,
                over_head_costs: data[i].over_head_costs,
                total_sales: data[i]["SUM(products.product_sales)"],               
            }
            record.total_profit = record.total_sales - record.over_head_costs
            output.push(record);
        }
        console.log(columnify(output));
        cont();
    })
}

function addnew() {
    console.log("\n")
    inquirer
        .prompt([
            {
                name: "idept",
                message: "Enter department name: "
            },
            {
                name: "ioverhead",
                message: "Enter Overhead Costs: ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    console.log("\n-- Enter valid Cost --\n");
                    return false;
                }
            }

        ]).then(function (answer) {
            var query2 = connection.query("INSERT INTO departments (department_name, over_head_costs) VALUES (?,?);",
            [answer.idept, answer.ioverhead], 
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

start();