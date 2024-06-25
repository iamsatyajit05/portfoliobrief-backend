import { Request, Response } from 'express';
import newsService from '../services/newsService';
import stocks from '../models/stocks';
import { IStock } from '../models/stocks';
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
    try {
      const categories = req.query.categories as string[] | undefined;
      const page = +(req.query.page || 1);
      const limit = +(req.query.limit || 10);

      const news = await newsService.fetchNews(categories, page, limit);
      res.json({ news });
    } catch (error) {
      console.error('Error fetching news:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async fetchNewsByStocks(req: Request, res: Response) {
    try {
      const userId = req.query.userId as string;
      const page = +(req.query.page || 1);
      const limit = +(req.query.limit || 10);

      const news = await newsService.fetchNewsByStocks(userId, page, limit);
      res.status(200).json(news);
    } catch (error) {
      console.error('Error fetching news by stocks:', error);
      res.status(500).json({ message: 'Failed to fetch news by stocks', error: error });
    }
  }
  async searchNews(req: Request, res: Response) {
    const { searchText } = req.query;
    const page = +(req.query.page || 1);
    const limit = +(req.query.limit || 10);

    try {
      if (typeof searchText !== 'string' || searchText.trim() === '') {
        return res.status(400).json({ message: 'Invalid search text provided' });
      }

      const newsArticles = await newsService.searchNewsByTitle(searchText, page, limit);

      res.status(200).json(newsArticles);
    } catch (error) {
      console.error('Error searching news:', error);
      res.status(500).json({ message: 'Failed to search news articles', error: error });
    }
  }
  async fetchStockList(req: Request, res: Response){
    try{
      const stocklist = await newsService.fetchStockList();
      res.status(200).json(stocklist);
    
    }
    catch (error) {
      console.error('Error searching news:', error);
      res.status(500).json({ message: 'Failed to search news articles', error: error });
    }

  }
  async insertStocks(req: Request, res: Response): Promise<void> {
    try {
      const stocksData = req.body as IStock[];
      const insertedStocks = await newsService.insertStocks(stocksData);
      res.status(201).json(insertedStocks);
    } catch (error) {
      console.error('Error in insertStocks controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
export default new NewsController();
