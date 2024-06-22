import { Request, Response } from 'express';
import newsService from '../services/newsService';

class NewsController {
 

  async saveNews(req: Request, res: Response) {
    try {

      // Parse datetime string back to Date object
      if (req.body.publishTime) {
        req.body.publishTime = new Date(req.body.publishTime);
      }

      const user = await newsService.saveNews(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      console.error(error);
      if (error.code === 11000) {
        // Duplicate key error (E11000), return 409 Conflict
        res.status(409).json({ error: 'Duplicate key error. Resource already exists.' });
      } else {
        // Other internal server errors
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }


  async fetchNews(req: Request, res: Response) {
    const { categories, page, limit } = req.body;
    try {
      const news = await newsService.fetchNews(categories, page, limit);
      res.json({ news });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  async fetchNewsByStocks(req: Request,res: Response){
    const {userId, page, limit} = req.body;
    try {
      const news = await newsService.fetchNewsByStocks(userId, page, limit);
      res.status(200).json(news);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch news by stocks', error: error});
    }
  }
}

export default new NewsController();
