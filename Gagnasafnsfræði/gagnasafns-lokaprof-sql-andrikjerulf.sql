-- a)
select count(*)
from monitors m
	join humans h on m.hid = h.hid
	join outlets o on h.oid = o.oid
where 
	mrating is not null 
	and o.zip = 200;
	
--b)
select count(*)
from outlets o
where o.oid not in (
	select h.oid
	from humans h
);

--c)
select count(*)
from sells s
join reviews r on s.sid = r.sid
where r.rwhen < s.swhen;

--d)
select p.pname
from produce p
join sells s on p.pid = s.pid
where s.sprice = (select max(s.sprice) from sells s);

--e)
select count(*)
from humans h
where h.hid not in (
	select m.hid -- öll hid sem hafa fengið rating
	from monitors m
	where m.mrating is not null
);

--f)
select h.hname
from sells s
join humans h on s.hid = h.hid
group by h.hid
having sum(s.sprice) = (
	select max(sum) from (
		select sum(s.sprice)
		from sells s 
		join humans h on s.hid = h.hid
		group by h.hid
	) tmp
);

--g)
select count(*)
from (
	select p.pid
	from produce p
		join sells s on p.pid = s.pid
		join humans h on h.hid = s.hid
		join outlets o on o.oid = h.oid
	where 
		o.zip = 200
	group by p.pid
	having count(distinct o.oid) = (
		select count(*)
		from outlets o
		where o.zip = 200
	)
) tmp;

--h)
select c.cname, h.hname, s.sprice, s.swhen
from sells s
	join reviews r on s.sid = r.sid
	join humans h on h.hid = s.hid
	join outlets o on o.oid = h.oid
	join customers c on c.cid = s.cid
where s.hid = r.hid and o.zip = 130


