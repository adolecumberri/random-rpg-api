import { ICity } from '../../interfaces/Map.interface';
import { CIUDADES } from './map.dictionary';

export class Map {
	constructor() {
		this.CITIES = CIUDADES.map((city) => {
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

	CITIES;

    MAX_FIGHTS_PER_PLACE = 4;
    MIGRATION_PROB = 0.33;


    //init event tendría que cargar randomly los grupos en lugares random.
    initEvent = () =>{

    }

    //ejecutar turno: 
    // ejecutar peleas y mover resultantes
    execTurn = () => {

    }




	listCities = () => {
		this.CITIES.forEach((c) => {
			{
				console.log(
					`${c.id} - ${c.name} - connections: ${c.connections} - F: ${c.teams.F} - M: ${c.teams.M} - OTHERS: ${c.teams.Other} `
				);
			}
		});
	};
}
