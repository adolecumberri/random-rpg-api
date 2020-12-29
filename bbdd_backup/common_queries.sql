--  COMPROBANTES:
-- !== null = error: tiene que dar nulo. La gente fuera de juego tiene currenthp === 0. 
select *
from heros_crew
where hero_isalive = 0
    and currenthp <> 0;
- - != = null = error: la gente viva tiene que tener currenthp > 0;
select *
from heros_crew
where hero_isalive = 1
    and currenthp = 0;
-- FORMATEADORES: 
-- 1 - resetea los heroes de heros_crew. La funcion que los actualiza tiene un defecto y creo que los actualiza mal
/*
 hero_ingame = 1;
 currenthp = hero.hp;
 */
update heros_crew hc
    inner join hero h on hc.id_hero = h.id
set hc.hero_isalive = 1,
    hc.currenthp = h.hp;



/*
 -- 2 - Reset turn data.
 0 event journar.
 0 group fights.
 0 group fights stats.
 0 group moving
 update heros_crew info.  
 */
truncate table event_journal;
truncate table groupfight;
truncate table groupfightstats;
truncate table groupmoving;
update heros_crew hc
    inner join hero h on hc.id_hero = h.id
set hc.hero_isalive = 1,
    hc.currenthp = h.hp;