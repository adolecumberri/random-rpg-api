import { Request, Response } from 'express';
import { EventMap } from './mapjs/map';

let triggerEvent = async (req: Request, res: Response) => {
	let eventType = req.params.eventType;

	let map = new EventMap(Number(eventType));
};

export { triggerEvent };
