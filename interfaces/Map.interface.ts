import { HeroGroup } from '../controllers/groupjs/group';

export interface ICity {
	teams: {
		M: HeroGroup[];
		F: HeroGroup[];
		Other: HeroGroup[];
	};
	id: number;
	name: string;
	connections: number[];
}
