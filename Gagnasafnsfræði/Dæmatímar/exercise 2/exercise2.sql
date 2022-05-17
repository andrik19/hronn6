-- 1
select Sports.name, Sports.record
from Sports
ORDER BY name;

-- 2 
select distinct name
from sports s join results r on s.id = r.sportid

-- 3 
select count(distinct peopleid)
from results 

-- 4 
select id, name
from people p join results r on p.id = r.peopleid
group by id
having count(*) >= 20;

-- 5 
select distinct p.id, p.name, g.description
from people p
join gender g on p.gender = g.gender
join results r on r.peopleid = p.id
join sports s on s.id = r.sportid
WHERE r.result >= s.record

-- 6
select s.name, count(distinct r.peopleid) numathletes
from sports s
join results r on s.id = r.sportid
where r.result = s.record
GROUP BY s.name

-- 7 ekki viss hvort þetta sé rétt 
select p.id, p.name, max(r.result) best, to_char(s.record-max(r.result), '0D99') difference
from people p
join results r on p.id = r.peopleid
join sports s on r.sportid = s.id
where s.name = 'Triple Jump'
group by p.id, s.record
having count(r.result) >= 20

-- 8 
select distinct p.id, p.name, g.description
from people p
join gender g on p.gender = g.gender
join results r on p.id = r.peopleid
join competitions c on r.competitionid = c.id
where c.place = 'Hvide Sande' and extract(year from c.held) = 2009

-- 9
select p.name, g.description
from people p
join gender g on p.gender = g.gender
where p.name like '% J%' and p.name like '%sen'

-- 10
select p.name, s.name, 
case 
	when round(r.result/s.record*100) is null then '0%' 
	else CONCAT(round(r.result/s.record*100),'%') end percentage
from people p 
join results r on p.id = r.peopleid
join sports s on r.sportid = s.id

-- 11
select count(distinct p.id)
from people p
join results r on p.id = r.peopleid
where (r.competitionid is null or r.sportid is null or r.result is null)

-- 12
select s.id, s.name, max(R.result) as maxres
from sports s
join Results r on s.id = r.sportid
group by s.id, s.name
order by s.id;

-- 13 ?????
select p.id, p.name, count(*)
from people p
join results r on p.id = r.peopleid
join sports s on r.sportid = s.id
group by p.id, p.name
having count(distinct s.id) > 1;















