--- 14	
select distinct p.id, p.name, p.height, r.result, s.name, 
case 
	when r.result >= s.record then 'Yes' else 'No' end as isRecord 
from people p
join results r on p.id = r.peopleid
join sports s on r.sportid = s.id
where (s.name, r.result) in (
	select s.name, max(R.result)
	from sports s
	join Results r on s.id = r.sportid
	group by s.id, s.name
)

-- 15
select p.id, p.name 
from people p
where p.id not in (
	select r.peopleid
	from results r
)

-- 16
select distinct p.id, p.name
from people p 
join results r on r.peopleid = p.id
join competitions c on r.competitionid = c.id
where (extract(month from c.held) = 06 and extract(year from c.held) = 2002) or p.id in (
	select r.peopleid
	from results r
	join sports s on s.id = r.sportid 
	where (sportid = 0 and r.result >= s.record)
)

-- 17
select p.id, p.name
from people p 
join results r on r.peopleid = p.id
where p.id in (
	select r.peopleid
	from results r
	join sports s on r.sportid = s.id
	where r.result >= s.record
)
group by p.id
having count(r.peopleid) = 1 

-- 18
select count(*)
from people p 
where p.id in (
	select p.id
	from people p 
	join results r on p.id = r.peopleid
	join competitions c on c.id = r.competitionid
	group by p.id 
	having count(distinct c.place) >= 10
)

-- 19 held þetta sé rétt ekki viss
select p.id, p.name
from people p
join results r on r.peopleid = p.id
join sports s on s.id = r.sportid
group by p.id
having count(distinct r.result = s.record) = (select count(*) from sports s)

-- 20 
select s.id, s.name, s.record, min(r.result)
from sports s
join results r on s.id = r.sportid
join competitions c on c.id = r.competitionid
group by s.id
having count(distinct c.place) >= (select count(distinct c.place) from competitions c)


















