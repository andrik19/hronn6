-- a)
select count(*)
from tests t
join variants v on t.variantid = v.id
where v.name = 'omicron'

-- b)
select count(*)
from variants v
where v.id not in (
	select variantid
	from tests
);

-- c)
select count(*)
from variants v
join risks r on v.riskid = r.id
join detects d on d.variantid = v.id
join kits k on k.id = d.kitid
join tests t on t.variantid = v.id
join testers on t.testerid = testers.id
where extract(year from time) = 2021 and testers.name = 'Kent Lauridsen' and level = 'extreme' and producer = 'JJ'


-- d)
select count(*)
from variants 
where id not in (
	select distinct(variantid)
	from detects
	where accuracy > 50
);












