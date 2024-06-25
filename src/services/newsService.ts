import Newsarticle, { NewsDocument } from '../models/newsModel';
import { IStock } from '../models/stocks';
import stocks from '../models/stocks';
import StockSubscription from '../models/stockSubscriptionModel';
import { StockSubscriptionDocument } from '../models/stockSubscriptionModel';
class NewsService {
  async saveNews(data: NewsDocument): Promise<NewsDocument> {
    const user = await Newsarticle.create(data);
    return user;
  }

  async fetchNews(
    categories: string[] = [],
    page: number = 1,
    limit: number = 10
  ): Promise<NewsDocument[]> {
    try {
      limit = limit > 0 ? limit : 10;
  
      const query: { category?: { $in: string[] } } = {};
      if (categories.length > 0) {
        query.category = { $in: categories };
      }
  
      const skip = (page - 1) * limit;
  
      // Adjusted the find query to include sorting by publishTime in descending order (newest first)
      const results = await Newsarticle.find(query)
        .sort({ publishTime: -1 }) // Sort by publishTime descending (newest to oldest)
        .skip(skip)
        .limit(limit);
  
      return results;
    } catch (error) {
      console.error('Error searching news:', error);
      throw error;
    }
  }
  async fetchNewsByStocks(userId: string, page: number = 1, limit: number = 10): Promise<NewsDocument[]> {
    try {
      limit = limit > 0 ? limit : 10;
      const skip = (page - 1) * limit;

      // Fetch the user's stock subscriptions
      const subscription: StockSubscriptionDocument | null = await StockSubscription.findOne({ userId });
      if (!subscription) {
        throw new Error('No stock subscriptions found for the user');
      }

      // Fetch news articles based on the user's subscribed stocks
      const results = await Newsarticle.find({ company: { $in: subscription.stocks } })
                                .sort({ publishTime: -1 })
                                .skip(skip)
                                .limit(limit);

      return results;
    } catch (error) {
      console.error('Error fetching news by stocks:', error);
      throw error;
    }
  }
  async searchNewsByTitle(queryText: string,page:number = 1,limit:number = 10): Promise<NewsDocument[]> {
    try {
      const skip = (page - 1) * limit;
      const results = await Newsarticle.aggregate([
        {
          $search: {
            index: "title_search",
            text: {
              query: queryText,
              path: {
                wildcard: "*"
              }
            }
          }
        }, 
        { $sort: { publishTime: 1 } },
        { $skip: skip },
        { $limit: limit }
      ]).exec();
      return results;
    } catch (error) {
      console.error('Error searching news by title:', error);
      throw error;
    }
  }
  async fetchStockList(): Promise<IStock[]> {
    try {
      const result = await stocks.find({});
      return result;
    } catch (error) {
      console.error('Error in fetching stock list:', error);
      throw error;
    }
  }
  async insertStocks(stockData: IStock[]): Promise<IStock[]> {
    try {
      const insertedStocks = await stocks.insertMany(stockData);
      return insertedStocks;
    } catch (error) {
      console.error('Error inserting stocks:', error);
      throw error;
    }
  }
}

export default new NewsService();
