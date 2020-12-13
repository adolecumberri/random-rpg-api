import { rand } from '../../commonModules/utils';
import { connection } from '../../config/database';
import { ICity, IMapTurn, ITeam } from '../../interfaces/Map.interface';
import { CIUDADES } from './map.dictionary';

export class EventMap {
	constructor(eventType: number) {
		this.eventType = eventType;
		//Carga de ciudades
		this.cities = CIUDADES.map((city) => {
			return {
				...city,
				teams: {
					M: [],
					F: [],
					Other: [],
				},
			};
		}) as ICity[];
	}

	cities: ICity[] = [];
	teams: ITeam[] = [];

	eventType: number;

	MAX_FIGHTS_PER_PLACE = 4;
	MIGRATION_PROB = 0.33;

	eventDay = 0;

	//init event tendría que cargar randomly los grupos en lugares random.
	init: () => Promise<void> = async () => {
		let q = `select crew.id, nombre as name, crew.side , crew_ingame, a.heros_alive, a.heros_death
        from crew 
        inner join heros_crew 
        on crew.id = heros_crew.id_crew
        inner join (
            select a.id as id, heros_alive, heros_death 
        from  (select id_crew as id, count(hero_isalive) as 'heros_alive' 
                from heros_crew  
                where hero_isalive = ${this.eventType} 
                group by id_crew) as a
        inner join (
                select id_crew as id, IF(count(*) is null, count(*), 0) as 'heros_death'
                from heros_crew  
                group by id_crew) as b
        on  a.id = b.id
        )  as a
        on heros_crew.id_crew = a.id 
        group by crew.id;`;

		await new Promise((resolve, reject) => {
			connection.query(q, (err, result: ITeam[]) => {
				this.teams = result;
				resolve(true);
			});
		});

		////

		console.log('teams loaded');
		console.log(this.teams.length);

		//cada team, lo meto
		// for(let i = 0; i < this.teams.length; i++){

		//     if(this.teams[i].side === "MALE"){

		//     }

		// }

		this.teams.forEach((team) => {
			if (team.side === 'MALE') {
				this.cities[rand(0, this.cities.length - 1)].teams.M.push(team);
			} else if (team.side === 'FEMALE') {
				this.cities[rand(0, this.cities.length - 1)].teams.F.push(team);
			} else {
				this.cities[rand(0, this.cities.length - 1)].teams.Other.push(team);
			}
		});
	};

	//ejecutar turno:
	// ejecutar peleas y mover resultantes
	execTurn = () => {
		let turnParams: IMapTurn[] = [];

		//Cargar

		this.cities.forEach((c) => {
			let params: IMapTurn = {
				id: c.id,
				fighting: [],
				moving: [],
			};

			for (let i = 0; i < this.MAX_FIGHTS_PER_PLACE && c.teams.M.length > 0 && c.teams.F.length > 0; i++) {
                
            }

			return params;
		});

		//Procesar

		//Descargar
	};

	listCities = () => {
		// this.cities.forEach((c: ICity) => {
		// 	{
		// 		console.log(
		// 			`${c.id}-\t${c.name}   \t -\tconnections:\t${c.connections} -\tF: ${c.teams.F.length} -\tM: ${c.teams.M.length} -\tOTHERS: ${c.teams.Other.length} `
		// 		);
		// 	}
		// });

		console.table(
			this.cities.map((c) => [
				c.id,
				c.name,
				c.connections,
				c.teams.M.map((c) => c.id),
				c.teams.F.map((c) => c.id),
				c.teams.Other.map((c) => c.id),
			])
		);
	};
}
