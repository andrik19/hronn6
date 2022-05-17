-- (a)
select count(*)
from songs s
where extract(epoch from s.duration) > 3600;

-- (b)
select round(sum(extract(epoch from s.duration))) as seconds
from songs s;

-- (c)
select count(*)
from artists ar
join albumartists al on ar.artistid = al.artistid
join albums alb on al.albumid = alb.albumid
where ar.artist = 'Tom Waits';

-- (d)
select count(distinct al.albumid)
from albums al
join albumgenres alg on al.albumid = alg.albumid
join genres g on alg.genreid = g.genreid
where g.genre like 'Alt%';

-- (e)
select count(*) 
from songs s
where s.title in (
	select s.title
	from songs s
	group by s.title
	having count(s.title) > 1
);

-- (f) 
select avg(a.count)
from (
select alg.albumid, count(alg.genreid)
from albumgenres alg
group by alg.albumid
	) as a;
	
-- (g)
select count(*)
from albums al 
where al.albumid not in (
	select al.albumid
	from albums al
	join albumgenres alg on al.albumid = alg.albumid
	join genres g on alg.genreid = g.genreid
	where g.genre = 'Rock'
);

--(h)
select max(a.count) 
from(
	select extract(year from s.releasedate), count(extract(year from s.releasedate))
	from songs s
	group by extract(year from s.releasedate)) 
as a;

-- (i)
select extract(year from s.releasedate) 
from songs s
group by extract(year from s.releasedate)
having count(extract(year from s.releasedate)) = (
	select max(a.count) 
		from(
			select extract(year from s.releasedate), count(extract(year from s.releasedate))
			from songs s
			group by extract(year from s.releasedate)
			) as a);

-- (j) 
select s.songid, s.title
from songs s
where extract(year from s.releasedate) = 1979 
and extract(epoch from s.duration) > 180
and s.songid in (
	select s.songid
	from albums al
	join albumgenres alg on al.albumid = alg.albumid
	join albumsongs als on al.albumid = als.albumid
	join songs s on s.songid = als.songid
	join songgenres sg on s.songid = sg.songid
	where alg.genreid = sg.genreid
)
order by s.title;

