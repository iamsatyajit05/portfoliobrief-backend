import requests
import aiohttp
from time import sleep
import asyncio
from bs4 import BeautifulSoup
from datetime import datetime, timedelta,timezone
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
async def scrape_data(para):
    loop = 1
    url = f"https://www.livemint.com/companies{para}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            html_content = await response.text()

    soup = BeautifulSoup(html_content, 'html.parser')

    extracted_data = []

    # Extracting headline news
    news_headline = soup.select_one('.cardHolder > div > .headline')
    if news_headline:
        print(loop)
        image = soup.select_one('.cardHolder > div').find('img')
        news_link_element = news_headline.find('a')
        news_inner_text = news_headline.text.strip()
        news_href = news_link_element['href']
        news_time_parent = news_headline.find_next('span', attrs={'data-updatedtime': True})
        news_updated_time = news_time_parent['data-updatedtime']
        image_url = image['src']
        
        article_content = await get_article_content(news_href)
        sleep(1) 
        result = generate_summary(title=news_inner_text,content=article_content)

        extracted_data.append({
                    'title': news_inner_text,
                    'summary':result["summary"] if result != None else "None",
                    'articleUrl': news_href,      
                    'category':result["categories"] if result != None else "None",
                    'company':result["company_name"][0:2] if result != None and result.get("company_name")  else "None",           
                    'tags':result["tags"] if result != None else "None",
                    'publishTime': news_updated_time.replace(' IST', ''),
                    'imageUrl': image_url,
        })
            

    # Extracting other news
    list_to_story_elements = soup.select('.listtostory')
    for element in list_to_story_elements:
        headline_sections = element.select('.headlineSec')
        images = element.select('img')
        for i, headline_section in enumerate(headline_sections):
            loop += 1
            print(loop)
            image = images[i] if i < len(images) else None
            headline = headline_section.select_one('.headline')
            link_element = headline.find('a')
            inner_text = headline.text.strip()
            href = link_element['href']
            time_parent = headline_section.find('span', attrs={'data-updatedtime': True})
            time_attribute = time_parent['data-updatedtime']
            image_url = image['data-src'] if image else None
            article_content = await get_article_content("https://www.livemint.com"+href)
            
            result = generate_summary(title=news_inner_text,content=article_content)
            
            extracted_data.append({
                'title': inner_text,
                'articleUrl': 'https://www.livemint.com'+href,
                'publishTime': time_attribute,
                'imageUrl': image_url,
                'summary':result["summary"] if result != None else "None",
                'category':result["categories"] if result != None else "None",
                'tags':result["tags"] if result != None else "None",
                'company':result["company_name"][0:2] if result != None and result.get("company_name")  else "None",   
            })

    return extracted_data

async def get_article_content(article_url):
    async with aiohttp.ClientSession() as session:
        async with session.get(article_url) as response:
            html_content = await response.text()

    soup = BeautifulSoup(html_content, 'html.parser')
    

    # Adjust the selector based on the actual structure of the article pages
    article_content_element = soup.find('div', class_='paywall')  # Replace with the actual class/id of the article content
    
    article_content = article_content_element.get_text(strip=True) if article_content_element else None
    return article_content

async def main():
    all_news = []
    for para in ['/page-1', '/page-2', '/page-3']:
        print(f"{para} :")
        news_data = await scrape_data(para)
        all_news.extend(news_data)

    # Filtering news based on today
    # Convert 'yesterday' to timezone-aware datetime
    yesterday = datetime.now(timezone.utc) - timedelta(days=1)

    filtered_data = [news for news in all_news if datetime.fromisoformat(news['publishTime']).astimezone(timezone.utc) > yesterday]
    filtered_data =  [item for item in filtered_data if item.get("summary") is not None and item.get("summary") != "None" ]

    print('Extracted Data:', filtered_data)
    print('Total News:', len(filtered_data))

    save_to_mongodb(filtered_data)
    

asyncio.run(main())
