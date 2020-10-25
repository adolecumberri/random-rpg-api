export interface IFightStats {
    totalDmg1: number;
    totalDmg2: number;
    totalDmgStopped1: number;
    totalDmgStopped2: number;
    numHits1: number;
    numHits2: number;
    winner: number | null;
    loser: number | null;
}