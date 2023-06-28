import { HEROES_NAMES } from "../constants";

type HeroName = typeof HEROES_NAMES[keyof typeof HEROES_NAMES];

