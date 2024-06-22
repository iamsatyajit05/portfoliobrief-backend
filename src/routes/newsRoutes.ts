import { Router } from 'express';
import newsController from '../controllers/newsController';

const router = Router();

router.post('/', newsController.saveNews);
router.get('/', newsController.fetchNews);
router.get('/stocks', newsController.fetchNewsByStocks);

export default router;
