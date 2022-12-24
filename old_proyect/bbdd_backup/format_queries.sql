-- ////////////////////////   FORMATEADORES  ////////////////////////: 

 -- 1 - Reset turn data.
 /*
 update crews for event X, set ingame = 1
 0 event journar.
 0 group fights.
 0 group fights stats.
 0 group moving
 update heros_crew info.  
 */
update crew
set ingame = 1
where evento = 1;
truncate table event_journal;
truncate table groupfight;
truncate table groupfightstats;
truncate table groupmoving;
update heros_crew hc
    inner join hero h on hc.id_hero = h.id
set hc.hero_isalive = 1,
    hc.currenthp = h.hp;