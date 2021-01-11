-- heroe - grupo
select *
from hero
    inner join heros_crew on hero.id = heros_crew.id_hero
    inner join crew on heros_crew.id_crew = crew.id
where hero.id = 45832;
--
-- saca equipos. si está vivo, heros viva, muerta y total
select crew.id,
    nombre as name,
    crew.side,
    ingame,
    a.alive_heros,
    a.death_heros,
    a.alive_heros + a.death_heros as 'total_heros'
from crew
    inner join heros_crew on crew.id = heros_crew.id_crew
    inner join (
        select a.id as id,
            alive_heros,
            death_heros
        from (
                select id_crew as id,
                    COALESCE(sum(if(hero_isalive = 1, 1, 0)), 0) as 'alive_heros'
                from heros_crew
                group by id_crew
            ) as a
            inner join (
                select id_crew as id,
                    COALESCE(sum(if(hero_isalive = 0, 1, 0)), 0) as 'death_heros'
                from heros_crew
                group by id_crew
            ) as b on a.id = b.id
    ) as a on heros_crew.id_crew = a.id
where crew.evento = 1
group by crew.id;
-- 
