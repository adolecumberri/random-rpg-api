import { Router } from 'express';
import { triggerEvent } from '../controllers/map.controller';


const router = Router();

router.route('/init/event=:eventType').get(triggerEvent);


export default router;

//LLAMADA a la base de datos  para cargar los equipos.
/***
 

select crew.id, nombre as name, crew_ingame, a.heros_alive, a.heros_death
from crew 
inner join heros_crew 
on crew.id = heros_crew.id_crew
inner join (
	select a.id as id, heros_alive, heros_death 
from  (select id_crew as id, count(hero_isalive) as `heros_alive` 
		from heros_crew  
        where hero_isalive = 1 
        group by id_crew) as a
inner join (
		select id_crew as id, IF(count(*) is null, count(*), 0) as `heros_death`
        from heros_crew  
        group by id_crew) as b
on  a.id = b.id
)  as a
on heros_crew.id_crew = a.id 







 */