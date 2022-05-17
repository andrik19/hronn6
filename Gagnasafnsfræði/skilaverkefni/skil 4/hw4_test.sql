-- test fyrir hw4--
begin transaction;
insert into people(id, name, address, phone_nr, DOB) values (1, 'mella', 'abc', 123, '01-12-2000')
select *
from people
rollback;