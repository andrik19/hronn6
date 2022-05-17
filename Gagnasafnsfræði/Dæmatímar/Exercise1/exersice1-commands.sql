insert 
into Coffees (name, manufacturer)
values ('Slop', 'Braga');

insert 
into Coffeehouses (name, address, license)
values ('YO','abc','efg');

insert into Sells (coffeehouse, coffee, price)
values ('YO','Slop',12);

insert into Coffees (name, manufacturer)
values ('Vont Kaffi', 'Gott Kaffi');

update Sells
set price = 20
where coffeehouse = 'YO' and coffee = 'Slop'

delete from Coffees
where name = 'Vont Kaffi'

Select * from Coffees;
Select * from Sells;
Select * from Coffeehouses;