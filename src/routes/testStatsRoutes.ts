import { Router, Request, Response } from 'express';


const statsRoutes = Router();

statsRoutes.post('/stats', (req: Request, res: Response) => {
    res.json({ message: 'test' });
});

export {
    statsRoutes
}