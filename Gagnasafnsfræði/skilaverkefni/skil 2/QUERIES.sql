-- a)
select count(*)
from person p
where p.height is null;

-- b)
select count(*)
from (
	select p.id
	from person p 
	where p.name like 'Harrison %' or p.name like '% Ford'
) tmp;

-- c)
select count(*)
from (
	select m.id
	from person p
	join involved i on p.id = i.personid
	join movie m on i.movieid = m.id
	group by m.id
	having avg(p.height) > 190
) tmp;

-- d) 
select count(*)
from (
	select distinct movieid
	from movie_genre
	group by movieid, genre
	having count(*) > 1
) tmp;

-- e)
select count(distinct p.id)
from person p 
join involved i on p.id = i.personid
where i.role = 'actor' and i.movieid in (
	select m.id
	from person p 
	join involved i on p.id = i.personid
	join movie m on i.movieid = m.id
	where p.name = 'Steven Spielberg' and i.role = 'director'
);

-- f)
select count(*)
from movie m
where m.id not in (
	select i.movieid
	from involved i
)
and m.year = 1999;

-- g)
drop view if exists personMovies; 
create view personMovies (personID, movieID, role) -- connects persons to movies and their role
as 
select p.id, m.id, i.role
from person p
join involved i on p.id = i.personid
join movie m on m.id = i.movieid;

select count(*)
from (
	select p.id
	from person p
	join involved i on p.id = i.personid
	where (p.id, i.movieid) in (
		select personid, movieid
		from personMovies
		where role = 'actor'
	)
	and (p.id, i.movieid) in (
		select personid, movieid
		from personMovies
		where role = 'director'
	)
	group by p.id
	having count(p.id) > 2
) tmp;

-- h) 
select count(*)
from (
	select m.id
	from movie m
	join involved i on m.id = i.movieid
	where m.year = 1999 and i.role in (select role from role)
	group by m.id
	having count(distinct i.role) = (select count(role) from role)
) tmp;

-- i)
drop view if exists lamecat;
create view lamecat (movieid, genre) as
select * -- all movies that have a genre in the lame category
from movie_genre mg
where mg.genre in (
	select g.genre
	from genre g
	where category = 'Lame'
);

select count(*)
from (
	select p.id
	from person p
	join involved i on p.id = i.personid
	join movie_genre mg on i.movieid = mg.movieid 
	where (i.movieid, mg.genre) in (select movieid, genre from lamecat)
	group by p.id
	having count(distinct mg.genre) = (select count(distinct genre) from lamecat)
) tmp;

-- j) 
drop view if exists maxcountToID; 
create view maxcountToID (maxCount) -- finds how often the max toid is referenced 
as
select max(a.count) 
from (
	select count(*) 
	from movie_reference 
	group by toid
) as a;

select m.title
from movie m
where m.id in (
	select toid
	from movie_reference 
	group by toid
	having count(toid) = (select * from maxcountToID)
);

