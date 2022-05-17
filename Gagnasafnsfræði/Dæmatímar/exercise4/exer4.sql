-- 1
create view AllAccountRecords as 
select a.aid, a.pid, a.adate, a.abalance, a.aover, ar.rid, ar.rdate, ar.rtype, ar.ramount, ar.rbalance
from accounts a
left join accountrecords ar on a.aid = ar.aid;

-- 2
create function CheckBills()
returns trigger
as $$ begin 
	if (NEW.bamount < 0.0) then
		raise exception 'CheckBills: Bills amount must be over 0.0'
		using errcode = '45000';
	end if;
	if (NEW.bduedate <= current_date)
	then
		raise exception 'CheckBills: Due date must be in the future'
		using errcode = '45000';
	end if;
	return NEW;
end; $$ LANGUAGE plpgsql;

create trigger CheckBills
before insert
on bills
for each row execute procedure CheckBills();

create function BanChanges()
returns trigger
as $$ begin
	raise exception 'BanChanges: Cannot change bills'
	using errcode = '45000';
end; $$ language plpgsql;

create trigger BanChanges
before update or delete
on bills
for each row execute procedure BanChanges();

-- 3
create function updateAccountRecords()
returns trigger 
as $$ begin
	if NEW.ramount < (
	select a.abalance + a.aover
	from accounts a 
	where aid = new.aid
	) then
		raise exception 'Insufficient funds';
	end if;
	UPDATE accountrecords
	set rbalance = rbalance + new.ramount
	where rid = new.rid;
return new;
end; $$ language plpgsql
	
create trigger updateAccountRecords
before insert
on accountrecords
for each row execute procedure updateAccountRecords();


