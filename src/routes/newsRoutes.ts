import { Router } from 'express';
import newsController from '../controllers/newsController';

const router = Router();

router.post('/', newsController.saveNews);
router.get('/', newsController.fetchNews);
router.get('/stocks', newsController.fetchNewsByStocks);
router.get('/search',newsController.searchNews)
router.get('/stocklist',newsController.fetchStockList)
router.post('/insertstocks',newsController.insertStocks)
export default router;
