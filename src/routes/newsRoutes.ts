import { Router } from 'express';
import newsController from '../controllers/newsController';

const router = Router();

router.post('/', newsController.saveNews);
router.get('/', newsController.fetchNews);

export default router;
