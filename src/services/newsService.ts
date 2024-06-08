import News, { NewsDocument } from '../models/newsModel';

class NewsService {
  async saveNews(data: NewsDocument): Promise<NewsDocument> {
    const user = await News.create(data);
    return user;
  }

  async fetchNews(
    categories: string[] = [],
    page: number = 1,
    limit: number = 10
  ): Promise<NewsDocument | null> {
    try {
      limit = limit > 0 ? limit : 10;

      const query: { category?: { $in: string[] } } = {};
      if (categories.length > 0) {
        query.category = { $in: categories };
      }

      const skip = (page - 1) * limit;

      const results = await News.find(query).skip(skip).limit(limit);

      return results;
    } catch (error) {
      console.error('Error searching news:', error);
      throw error;
    }
  }
}

export default new NewsService();
