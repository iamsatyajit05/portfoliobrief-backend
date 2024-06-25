
from time import sleep

import requests
from bs4 import BeautifulSoup
from geminiapi import generate_summary


def save_to_mongodb(news_data):
    url = "http://localhost:5000/api/v1/news"
    headers = {"Content-Type": "application/json"}

    for news_item in news_data:
        try:        
            response = requests.post(url, json=news_item, headers=headers)
            if response.status_code == 201:
                print(f'News article "{news_item["title"]}" added successfully.')
            elif response.status_code == 409:  # Assuming 409 Conflict is returned for duplicates
                print(f'News article "{news_item["title"]}" already exists. Skipping.')
            else:
                print(f'Failed to add news article "{news_item["title"]}". Status code: {response}')
        except Exception as e:
            print(f'Error occurred while adding news article "{news_item["title"]}": {str(e)}')

def get_article_content(article_url, headers):
    response = requests.get(article_url, headers=headers)
    
    if response.status_code != 200:
        print(f"Error: Unable to access article page (Status code: {response.status_code})")
        return None

    soup = BeautifulSoup(response.content, 'lxml')
    # Adjust the selector based on the actual structure of the article pages
    article_content_element =soup.find('div', class_='content_wrapper')   # Replace with the actual class/id of the article content
    
    article_content = article_content_element.get_text(strip=True) if article_content_element else None
    return article_content

def scrape_money_control_news():
    url_iteration = 0
    # there is a bug where second url get skipped
    urls = {'https://www.moneycontrol.com/news/tags/companies.html','https://www.moneycontrol.com/news/business/economy/','https://www.moneycontrol.com/news/business/mutual-funds/', 'https://www.moneycontrol.com/news/business/personal-finance/', 'https://www.moneycontrol.com/news/business/ipo/', 'https://www.moneycontrol.com/news/business/startups/','https://www.moneycontrol.com/news/business/stocks/'}
    # urls = {'https://www.moneycontrol.com/news/business/personal-finance/',}
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    news_data = []
    for url in urls:
        url_iteration += 1
        print(url_iteration)
        response = requests.get(url, headers=headers)
       
        if response.status_code != 200:
            print(f"Error: Unable to access page (Status code: {response.status_code})")
            return []

        soup = BeautifulSoup(response.content, 'lxml')
        news_items = soup.select('.clearfix')

        
        item_iteration = 0
        for item in news_items:
            
            inner_text_element = item.select_one('h2 a')
            news_time_element = item.select_one('span')
            image_element = item.select_one('img')
            lazy_element = item.select_one('.lazy-container')

            inner_text = inner_text_element.get_text(strip=True) if inner_text_element else None
            href = inner_text_element['href'] if inner_text_element and 'href' in inner_text_element.attrs else None
            news_time = news_time_element.get_text(strip=True) if news_time_element else None
            image_url = image_element['data-src'] if image_element and 'data-src' in image_element.attrs else None
            if news_time == "Jump to" and lazy_element:
                news_time = lazy_element.select_one('span')
                news_time = news_time.get_text(strip=True) if news_time_element else None
            # Extract title from inner_text_element if available    
            title = inner_text_element['title'] if inner_text_element and 'title' in inner_text_element.attrs else None

            if inner_text and href and news_time and image_url:
                article_url = href
                article_content = get_article_content(article_url, headers)
                sleep(1)  # To avoid making too many requests in a short period
                result = generate_summary(title=title,content=article_content)
                if result == None:
                    print(article_url)
            
                item_iteration += 1
                print(url_iteration,":",item_iteration)

                news_data.append({
                    'title': title,
                    'summary':result["summary"] if result != None else "None",
                    'articleUrl': article_url,      
                    'category':result["categories"] if result != None else "None",
                    'company':result["company_name"][0:2] if result != None and result.get("company_name")  else "None",           
                    'tags':result["tags"] if result != None else "None",
                    'publishTime': news_time.replace(' IST', ''),
                    'imageUrl': image_url,
                })

    return news_data



if __name__ == '__main__':
        news_data = scrape_money_control_news()

        if news_data:
            filtered_data = [item for item in news_data if item.get("summary") is not None and item.get("summary") != "None" ]
            print('Extracted Data:', filtered_data)
            print('Total News:', len(filtered_data))
        
            save_to_mongodb(news_data)
            print('News data saved to MongoDB.')
        else:
            print('No news data extracted.')

