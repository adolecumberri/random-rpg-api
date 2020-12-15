import { HeroGroup } from '../controllers/groupjs/group';

export interface ICity {
	teams: {
		M: ITeam[];
		F: ITeam[];
		Other: ITeam[];
	};
	id: number;
	name: string;
	connections: number[];
}

export interface ITeam {
	id: number;
	name: string;
	ingame: boolean;
	side: string;
	heros_alive: number;
	heros_death: number;
}

export interface IMapTurn {
	id: number;
	fighting: { A: ITeam; B: ITeam }[];
    moving: {team: ITeam, from: number, to: number,  type: "M" | "F" | "Other"}[]; //From y To son cities.id
   
}
