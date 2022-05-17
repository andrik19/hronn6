drop table if exists jojos cascade;
create table jojos (
	JID int primary key,
	name varchar not null
);

drop table if exists homes cascade;
create table homes (
	HID int primary key,
	state varchar not null
);

drop table if exists left_for cascade;
create table left_for (
	HID int,
	JID int,
	what varchar,
	primary key (what, HID, JID),
	Foreign key (JID) references jojos(JID),
	Foreign key (HID) references homes(HID)
);

drop table if exists loners cascade;
create table loners (
	LID int primary key,
	status varchar not null,
	
	HID int not null,
	JID int not null,
	what varchar not null,
	foreign key (what, HID, JID) references left_for(what, HID, JID)
);

drop table if exists thought cascade; -- því jojos 0...N tengist 0...1 Loners
create table thought (
	lasted varchar not null, 
	LID int,
	JID int,
	Primary key (JID),
	Foreign key (LID) references loners(LID),
	Foreign key (JID) references jojos(JID)
);
