import { Request, Response } from 'express';
import newsService from '../services/newsService';

class NewsController {
  async saveNews(req: Request, res: Response) {
    try {
      const user = await newsService.saveNews(req.body);
      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
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
}

export default new NewsController();
