import { connection } from '../../config/database';
import { ICity } from '../../interfaces/Map.interface';
import { CIUDADES } from './map.dictionary';

export class EventMap {
	constructor(eventType: number) {
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

		let q = `select id from crew where evento = ${eventType}`;
		connection.query(q, async (err, result) => {
			this.teamIds = result;
		});
	}

	CITIES;
	teamIds: any;

	MAX_FIGHTS_PER_PLACE = 4;
	MIGRATION_PROB = 0.33;

	eventDay = 0;

	//init event tendría que cargar randomly los grupos en lugares random.
	initEvent = () => {
		console.log('team ids?');
		console.log(this.teamIds);
	};

	//ejecutar turno:
	// ejecutar peleas y mover resultantes
	execTurn = () => {};

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
