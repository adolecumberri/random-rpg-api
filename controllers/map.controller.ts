import { Request, Response } from "express";
import { EventMap } from "./mapjs/map";

let triggerEvent = async (req: Request, res: Response) => {
  let eventType = req.params.eventType;

  let map = new EventMap(Number(eventType));
  await map.init();
  await map.execTurn();
  //  map.listCities();

  setTimeout(async () => {
    console.log("Time out post 20");
    console.log(await map.loadTurn());
  }, 20000);
  res.sendStatus(200);
};

export { triggerEvent };
