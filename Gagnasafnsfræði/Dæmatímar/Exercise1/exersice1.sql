DROP TABLE IF EXISTS Coffees, Coffeehouses, Sells;

CREATE TABLE Coffees (
	name VARCHAR(20) PRIMARY KEY,
	manufacturer VARCHAR(20)
);

CREATE TABLE Coffeehouses (
	name VARCHAR(20) PRIMARY KEY,
	address VARCHAR(20),
	license VARCHAR(20)
);

CREATE TABLE Sells (
	coffeehouse VARCHAR(20)
		REFERENCES Coffeehouses(name),
	coffee VARCHAR(20) REFERENCES Coffees(name),
	price REAL,
	PRIMARY KEY (coffeehouse, coffee)
);


