-- ////////////////////////   COMPROBANTES   ////////////////////////:
-- 1 HERO_CREW
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
