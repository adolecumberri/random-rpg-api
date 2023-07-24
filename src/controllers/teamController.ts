import { Team } from "rpg-ts";
import { HEROES_NAMES } from "../constants";
import { createHero } from "./heroController";


const createTeam = (name: string, totalMembers: number, heroTypes: { [x in keyof typeof HEROES_NAMES]?: number }): Team => {
    const team: Team = {
        name,
        totalMembers,
        members: [],
    };
    for (let i = 0; i < totalMembers; i++) {
        team.members.push(createHero(heroTypes));
    }
    return team;
}