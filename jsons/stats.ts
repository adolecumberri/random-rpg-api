import { CLASS_NAMES } from "../constants/class_names"
import { hero_stats } from "../interfaces/hero.interfaces"

export const BASE_STATS: hero_stats = {
	hp: 70,
	attack: 10,
	defence: 7,
	crit: 0.1,
	crit_multiplier: 1,
	accuracy: 0.9,
	evasion: 0.1,
	attack_interval: 12,
	reg: 0.6,
}


export const CLASS_STATS_ARRAY = [
	{
		name: CLASS_NAMES.ARCHER,
		id: 1,
		hp: 18,
		attack: 13,
		defence: -1,
		crit: 0.3,
		crit_multiplier: 0.3,
		accuracy: -0.05,
		evasion: 0.24,
		attack_interval: -5,
		reg: 0
	},
	{
		name: CLASS_NAMES.BERSERKER,
		id: 2,
		hp: 70,
		attack: 25,
		defence: -2,
		crit: 0.05,
		crit_multiplier: 0,
		accuracy: -0.05,
		evasion: 0.05,
		attack_interval: -1,
		reg: 0.2
	},
	{
		name: CLASS_NAMES.DEFFENDER,
		id: 3,
		hp: 42,
		attack: 6,
		defence: 31,
		crit: -0.1,
		crit_multiplier: 0,
		accuracy: 0.04,
		evasion: -0.05,
		attack_interval: 3,
		reg: 0.2
	},
	{
		name: CLASS_NAMES.FENCER,
		id: 4,
		hp: 34,
		attack: 16,
		defence: 11,
		crit: 0.1,
		crit_multiplier: 0,
		accuracy: -0.05,
		evasion: 0.1,
		attack_interval: 0,
		reg: 0
	},
	{
		name: CLASS_NAMES.NINJA,
		id: 5,
		hp: -28,
		attack: 14,
		defence: -2,
		crit: 0.4,
		crit_multiplier: 0.25,
		accuracy: 0,
		evasion: 0.33,
		attack_interval: -2,
		reg: 0
	},
	{
		name: CLASS_NAMES.PALADIN,
		id: 6,
		hp: 50,
		attack: 19,
		defence: 21,
		crit: 0.1,
		crit_multiplier: 0,
		accuracy: 0,
		evasion: 0,
		attack_interval: -1,
		reg: 0.2
	},
	{
		name: CLASS_NAMES.SNIPER,
		id: 7,
		hp: 5,
		attack: 33,
		defence: -2,
		crit: 0.7,
		crit_multiplier: 2.7,
		accuracy: -0.6,
		evasion: 0,
		attack_interval: 14,
		reg: -0.2
	},
	{
		name: CLASS_NAMES.SOLDIER,
		id: 8,
		hp: 35,
		attack: 21,
		defence: 16,
		crit: 0.2,
		crit_multiplier: 0.1,
		accuracy: 0,
		evasion: 0.1,
		attack_interval: 0,
		reg: 0
	},
	{
		name: CLASS_NAMES.THIEVE,
		id: 9,
		hp: 25,
		attack: 14,
		defence: 3,
		crit: 0.42,
		crit_multiplier: 0.24,
		accuracy: -0.19,
		evasion: 0.22,
		attack_interval: -1,
		reg: 0.3
	}
]

export const CLASS_STATS_BY_NAME: {
	[x in typeof CLASS_NAMES[keyof typeof CLASS_NAMES]]: hero_stats
} = {
	'Archer': {
		name: CLASS_NAMES.ARCHER,
		id: 1,
		hp: 18,
		attack: 13,
		defence: -1,
		crit: 0.3,
		crit_multiplier: 0.3,
		accuracy: -0.05,
		evasion: 0.24,
		attack_interval: -5,
		reg: 0
	},
	'Berserker': {
		name: CLASS_NAMES.BERSERKER,
		id: 2,
		hp: 70,
		attack: 25,
		defence: -2,
		crit: 0.05,
		crit_multiplier: 0,
		accuracy: -0.05,
		evasion: 0.05,
		attack_interval: -1,
		reg: 0.2
	},
	'Deffender': {
		name: CLASS_NAMES.DEFFENDER,
		id: 3,
		hp: 42,
		attack: 6,
		defence: 31,
		crit: -0.1,
		crit_multiplier: 0,
		accuracy: 0.04,
		evasion: -0.05,
		attack_interval: 3,
		reg: 0.2
	},
	'Fencers': {
		name: CLASS_NAMES.FENCER,
		id: 4,
		hp: 34,
		attack: 16,
		defence: 11,
		crit: 0.1,
		crit_multiplier: 0,
		accuracy: -0.05,
		evasion: 0.1,
		attack_interval: 0,
		reg: 0
	},
	'Ninja': {
		name: CLASS_NAMES.NINJA,
		id: 5,
		hp: -28,
		attack: 14,
		defence: -2,
		crit: 0.4,
		crit_multiplier: 0.25,
		accuracy: 0,
		evasion: 0.33,
		attack_interval: -2,
		reg: 0
	},
	'Paladin': {
		name: CLASS_NAMES.PALADIN,
		id: 6,
		hp: 50,
		attack: 19,
		defence: 21,
		crit: 0.1,
		crit_multiplier: 0,
		accuracy: 0,
		evasion: 0,
		attack_interval: -1,
		reg: 0.2
	},
	'Sniper': {
		name: CLASS_NAMES.SNIPER,
		id: 7,
		hp: 5,
		attack: 33,
		defence: -2,
		crit: 0.7,
		crit_multiplier: 2.7,
		accuracy: -0.6,
		evasion: 0,
		attack_interval: 14,
		reg: -0.2
	},
	'Soldier': {
		name: CLASS_NAMES.SOLDIER,
		id: 8,
		hp: 35,
		attack: 21,
		defence: 16,
		crit: 0.2,
		crit_multiplier: 0.1,
		accuracy: 0,
		evasion: 0.1,
		attack_interval: 0,
		reg: 0
	},
	'Thieve': {
		name: CLASS_NAMES.THIEVE,
		id: 9,
		hp: 25,
		attack: 14,
		defence: 3,
		crit: 0.42,
		crit_multiplier: 0.24,
		accuracy: -0.19,
		evasion: 0.22,
		attack_interval: -1,
		reg: 0.3
	}
}