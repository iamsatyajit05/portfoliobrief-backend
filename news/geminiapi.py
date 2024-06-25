import json
import re

import google.generativeai as genai


def generate_summary(title, content):
    gemini_api_key = 'AIzaSyBMZGhHHSzjXYMlCrwWvM3lYHkNTbjSloc'
    genai.configure(api_key = gemini_api_key)
    model = genai.GenerativeModel('gemini-pro')
    
    prompt = f"""
You are an AI tasked with converting article titles and content into a summary, categories, tags, and company names if mentioned.

Instructions:
- Return a valid stringified JSON object as a response and do not include any other information in the response.
- The JSON object should contain four fields: "summary", "categories", "tags", and "company_name" (if mentioned).
- The "summary" field should contain a concise summary of the content which is summaries to the shortest way possible should only contain 40-50 words and make it mostly based on stocks the company has , dont use **.
- The "categories" field should contain an at least 1 element array of relevant categories based on the content ["Politics", "Education", "India", "Infrastructure", "Travel", "Technology", "Digital Marketing", "Real Estate", "Investment", "Transportation", "Bankruptcy", "Business", "Stock Market", "Manufacturing", "Finance"] should only contain from these categories restrictedly.
- The "tags" field should contain an array of relevant tags based on the content.
- The "company_name" field should contain the stocks name of up to 2 companies mentioned in the title or content if any, in an array. Only include stocks name from the following list if they are mentioned in the article and use same name used in the list :

["Reliance Industries Limited", "TCS (Tata Consultancy Services)", "HDFC Bank", "ICICI Bank", "HUL (Hindustan Unilever Limited)", "Infosys", "ITC (ITC Limited)", "SBI (State Bank of India)", "Bharti Airtel", "Bajaj Finance", "LIC India (Life Insurance Corporation of India)", "Larsen & Toubro (L&T)", "Kotak Mahindra Bank", "Asian Paints", "HCL Tech (HCL Technologies)", "Axis Bank", "Adani Enterprises", "Maruti Suzuki India Limited", "Sun Pharmaceutical Industries Limited", "Titan Company", "Avenue Supermart (DMart)", "Bajaj Finserv", "UltraTech Cement", "ONGC (Oil and Natural Gas Corporation)", "Nestle India", "Wipro", "NTPC (National Thermal Power Corporation)", "Tata Motors", "JSW Steel", "M&M (Mahindra & Mahindra)", "Power Grid Corporation of India", "Adani Ports and Special Economic Zone (APSEZ)", "Adani Green Energy Limited", "LTI (Larsen & Toubro Infotech)", "Tata Steel", "Coal India Limited", "HDFC Life (HDFC Standard Life Insurance Company)", "Siemens India", "Hindustan Zinc Limited", "Bajaj Auto Limited", "Pidilite Industries Limited", "IOC (Indian Oil Corporation)", "Britannia Industries Limited", "Tech Mahindra", "IndusInd Bank", "Adani Power", "Varun Beverages Limited", "Godrej Consumer Products Limited", "Hindalco Industries Limited", "Dabur India Limited", "Divi's Laboratories Limited", "Bank of Baroda", "Cipla Limited", "InterGlobe Aviation (IndiGo)", "Dr. Reddy's Laboratories Limited", "ABB India Limited", "Ambuja Cements Limited", "Bharat Electronics Limited", "Eicher Motors Limited", "Vedanta Limited", "Cholamandalam Investment and Finance Company Limited", "Adani Transmission Limited", "Shree Cements Limited", "SBI Cards and Payment Services Limited", "ICICI Prudential Life Insurance Company Limited", "Havells India Limited", "Zomato Limited", "Bajaj Holdings & Investment Limited", "BPCL (Bharat Petroleum Corporation Limited)", "Tata Consumer Products Limited", "GAIL (Gas Authority of India Limited)", "Mankind Pharma", "Tata Power Company Limited", "Marico Limited", "United Spirits Limited", "Apollo Hospitals Enterprise Limited", "Adani Total Gas Limited", "Torrent Pharmaceuticals Limited", "Polycab India Limited", "Shriram Finance Limited", "IDBI Bank Limited", "Berger Paints India Limited", "Power Finance Corporation Limited", "Macrotech Developers Limited", "SRF Limited", "ICICI Lombard General Insurance Company Limited", "Jindal Steel & Power Limited", "PNB (Punjab National Bank)", "Zydus Wellness Limited", "Motherson Sumi Systems Limited", "TVS Motor Company Limited", "Info Edge (India) Limited", "CG Power and Industrial Solutions Limited", "Trent Limited", "Union Bank of India", "Tube Investments of India Limited", "MRF Limited", "Hero MotoCorp Limited", "ONE 97 COMMUNICATIONS (Paytm)", "JK Tyre & Industries Ltd."]

Note: Ensure the response is in plain text format without any special tags. Do not use characters that are not allowed in JSON. Avoid organizing the content in bullet points. Use "**" to indicate the title in accurate JSON format.

API Constraints:
- Shouldn't miss any ',' or '"' and '{{}}' of JSON and don't use '"' and ',' in any of the summary.
- Provide the response in plain text format, no special formatting.
- No "```json```" box strictly.
- Only use characters allowed in JSON.
- Refrain from structuring the content using bullet points or other formatting.
- Use "**" to signify the title in accurate JSON format.
- If there is any harassment or anything about the wrong thing, just avoid adding the wrong word in the summary to restrict it and if it contains harmful content like in your category of "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT" and "HARM_CATEGORY_DANGEROUS_CONTENT" just make the summary lighter and just about the stock of company and don't quit it.

Example responses: {{"summary": "Summary of the content", "categories": ["Category1", "Category2"], "tags": ["Tag1", "Tag2"], "company_name": ["CompanyXYZ stock name","CompanyABC stock name"]}}

Sample:
user input:
{{
  "title": "{title}",
  "content": "{content}" 
}}

    """
    try:
        response = model.generate_content(prompt)
        json_string = response.text
        json_string = json_string.strip()
        if json_string.startswith('`'):
            json_string = json_string[6:-3]
            
        if json_string.endswith('`'):
            json_string = json_string[:-3]
            # Remove unwanted leading 'n' characters
        if json_string.startswith('n'):
            json_string = json_string[1:]
        
        result = json.loads(json_string)

    except json.JSONDecodeError as json_error:
        # If JSON parsing fails, print the error and the raw text
        print("JSON decoding error:", json_error)
        print("Raw text:", json_string)
        result = None
        print(result)
    except Exception as e:
        print("Error:", e)
        print("res:", response)
        result = None
        print(result)


    return result
