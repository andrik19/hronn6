--- 10.
drop table if exists opponent cascade;
create table opponent (
	ID int primary key
);

--- 1.
drop table if exists people cascade;
create table people(
	ID int primary key,
	name varchar not null,
	address varchar not null,
	phone_nr int not null,
	DOB date not null,
	DOD date default null
);

--- 2.
drop table if exists member cascade;
create table member(
	ID int primary key references people(ID),
	start_date date not null
);

drop table if exists enemy cascade;
create table enemy(
	ID int primary key references people(ID),
	reason varchar not null,
	
	opponentID int not null references opponent(ID) -- 10
);

--- 3.
drop table if exists asset cascade;
create table asset(
	name varchar,
	memberID int,
	detail varchar not null,
	uses varchar not null,
	primary key (memberID, name),
	foreign key (memberID) references member(ID)
);

--- 4 og 5.
drop table if exists linking cascade;
create table linking(
	ID int primary key,
	name varchar not null,
	type varchar not null,
	description varchar not null
);

drop table if exists participate cascade;
create table participate(
	linkID int references linking(ID),
	personID int references people(ID),
	monitorsID int references member(ID) not null,
	primary key (linkID, personID)
);

--- 6.
drop table if exists role cascade;
create table role(
	ID int primary key,
	title varchar not null unique,
	salary int not null
);

drop table if exists serve_in cascade;
create table serve_in(
	roleID int,
	memberID int,
	start_date date not null,
	end_date date not null,
	primary key (roleID, memberID),
	foreign key (roleID) references role(ID),
	foreign key (memberID) references member(ID)
);

--- 7.
drop table if exists party cascade;
create table party(
	ID int primary key,
	country varchar not null,
	name varchar not null,
	unique(country, name),
	
	opponentID int not null references opponent(ID) -- 10
);

drop table if exists monitors_party cascade;
create table monitors_party(
	monitorsID int,
	partyID int,
	start_date date,
	end_date date not null,
	primary key (monitorsID, partyID, start_date),
	foreign key (monitorsID) references member(ID),
	foreign key (partyID) references party(ID)
);

--- 8.
drop table if exists sponsor cascade;
create table sponsor(
	ID int primary key,
	name varchar not null,
	address varchar not null,
	industry varchar not null
);

--- 8 og 9.
drop table if exists grants cascade;
create table grants(
	sponsorID int,
	memberID int,
	date_granted date,
	amount int not null,
	payback varchar not null,
	
	date_reviewed date not null, --- 9
	reviewerID int not null, --- 9
	grade int default null, --- 9
	
	primary key (sponsorID, memberID, date_granted),
	foreign key (sponsorID) references sponsor(ID),
	foreign key (memberID) references member(ID),
	foreign key (reviewerID) references member(ID)
);

--- 10.
drop table if exists opposes cascade;
create table opposes (
	start_date date not null,
	end_date date default null,
	memberID int,
	opponentID int,
	foreign key (memberID) references member(ID),
	foreign key (opponentID) references party(ID),
	foreign key (opponentID) references enemy(ID),
	primary key (memberID, opponentID)
);

-- triggers for 2)
drop function if exists CheckTot() cascade;
create function CheckTot()
returns trigger
as $$ begin 
	declare
		cnt int;
		tot int;
	begin
		cnt = (select count(*) from people);
		tot = (select count(*) from (
			select ID from member UNION select ID from enemy) X);
		IF (cnt <> tot) then
			raise exception 'Function CheckTotDis: Not total!' using errcode = '45000';
		end if;
	end;
end; $$ LANGUAGE plpgsql;

drop trigger if exists CheckTot on enemy cascade;
create trigger CheckTot
after delete or update
on enemy
for each row execute procedure CheckTot();

drop trigger if exists CheckTot on member cascade;
create trigger CheckTot
after delete or update
on member
for each row execute procedure CheckTot();