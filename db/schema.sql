### Schema

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products
(
	id int NOT NULL AUTO_INCREMENT,
	product_name varchar(255) NOT NULL,
	department_name varchar(255) NOT NULL,
	price DECIMAL(6, 2) NOT NULL,
	stock_quantity INTEGER (5) NOT NULL,
    product_sales DECIMAL(10, 2) DEFAULT 0,
	PRIMARY KEY (id)
);

CREATE TABLE departments
(
	id int NOT NULL AUTO_INCREMENT,
	department_name varchar(255) NOT NULL,
    over_head_costs DECIMAL(10, 2) NOT NULL,
	PRIMARY KEY (id)
);
