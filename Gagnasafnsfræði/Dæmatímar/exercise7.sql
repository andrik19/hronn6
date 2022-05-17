drop table if exists dane;
create table dane(
	ID int NOT NULL,
	name varchar,
	nationality varchar, 
	primary key (ID)
);

drop table if exists degrees;
create table degrees(
	daneID int NOT NULL,
	level varchar,
	subject varchar,
	inst varchar,
	year date,
	primary key (daneID, level, subject),
	unique(daneID, level, subject),
	FOREIGN KEY (daneID) REFERENCES dane (ID)
);

drop table if exists club;
create table club(
	clubID int NOT NULL,
	name varchar,
	nationality varchar
	primary key (clubID)
	unique (name, nationality)
);

drop table if exists member;
create table member(
	clubID int,
	daneID int,
	start date,
	end date,
	primary key(start)
	FOREIGN KEY (clubID) REFERENCES club (clubID)
	FOREIGN KEY (daneID) REFERENCES dane (ID)
);

drop table if exists tournament;
create table tournament(
	tournID int NOT NULL,
	name varchar,
	venue varchar,
	tournDate date,
	primary key(tournID)
);

drop table if exists heldBy;
create table heldBy(
	clubID int,
	tournID int,
	primary key(clubID, tournID)
	FOREIGN KEY (clubID) REFERENCES club (clubID)
	FOREIGN KEY (tournID) REFERENCES tournament (tournID)
);





