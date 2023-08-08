import { Team } from "rpg-ts";
import { HEROES_NAMES } from "../constants";
import { createHeroes } from "./heroController";
import { Hero } from "../types";


const createTeam = (name: string, totalMembers: number, heroTypes: { [x in keyof typeof HEROES_NAMES]?: number }): Team<Hero> => {
    const team = new Team<Hero>({
        name
    });

    let crewHeroes = createHeroes(totalMembers, heroTypes);

    team.members.push(...crewHeroes);
   
    return team;
}

export {
    createTeam
}