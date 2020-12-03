import { Request, Response, Router } from 'express';
import { indexWelcome } from '../controllers/index.controller';

const router = Router();

router.route('/').get(indexWelcome);
router.route('/wait/:min').get(
	(req: Request, res: Response): void => {
		setTimeout(() => {
			return res.json('Welcome to the Random Hero API!!');
		}, Number(req.params.min) * 6000);
	}
);

export default router;
