import os
import re
import json
import httpx
from bs4 import BeautifulSoup
from openai import AsyncOpenAI
from models import GeneratedContent
from dotenv import load_dotenv
import asyncio

load_dotenv()

def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("MISSING_API_KEY")
    return AsyncOpenAI(
        api_key=api_key,
        base_url="https://api.groq.com/openai/v1",
    )

def is_url(text: str) -> bool:
    url_pattern = re.compile(
        r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
    )
    return bool(url_pattern.match(text.strip()))

async def extract_text_from_url(url: str) -> str:
    try:
        async with httpx.AsyncClient() as http_client:
            response = await http_client.get(url, timeout=10.0)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            # Kill javascript and style tags
            for script in soup(["script", "style"]):
                script.extract()
            text = soup.get_text(separator=' ', strip=True)
            # Limit the extracted text to prevent huge prompts
            return text[:4000]
    except Exception as e:
        raise ValueError(f"URL extraction failed: {str(e)}")

async def generate_social_content(input_text: str, tone: str = "viral") -> GeneratedContent:
    try:
        client = get_groq_client()
    except ValueError as e:
        if str(e) == "MISSING_API_KEY":
            raise e
        raise ValueError(f"Bağlantı kurulamadı: {str(e)}")

    processed_text = input_text
    
    if is_url(input_text):
        try:
            processed_text = await extract_text_from_url(input_text.strip())
        except Exception:
            # If extraction fails, just use the raw text/url
            pass

    prompt = f"""
    Lütfen aşağıdaki içeriği analiz et ve {tone.upper()} bir tonda, sosyal medyada viral olacak içerikler tasarla.
    
    ÖNEMLİ KURALLAR:
    1. Yüzeysel, genel-geçer ifadeler kullanmak yerine spesifik örnekler ve zekice çıkarımlar (insights) kullan.
    2. %100 TÜRKÇE: Kullanacağın her kelime ve hashtag kusursuz Türkçe olmalıdır. "authenticity", "successful", "stay tuned" gibi internet jargonu yabancı kelimeleri ASLA ve ASLA kullanma.
    3. JSON formatı dışında hiçbir extra metin yazma.
    
    SADECE JSON formatında dön:
    Strict Keys:
    - "dil_kontrolu": Değeri her zaman "Evet, okudum anladım, hiçbir ingilizce kelime, hashtag veya yabancı cümle kullanmayacağım." olmalıdır.
    - "linkedin_post": Tamamen Türkçe yazılmış, uzman ağzıyla, çok spesifik iddialı bir LinkedIn postu.
    - "tweets": Tamamı Türkçe olan, sonuna ASLA ingilizce kelime ("Authenticity matters" gibi) eklenmemiş 3 farklı tweet.
    - "instagram_caption": Sadece Türkçe yazılmış instagram metni. Yabancı hashtag KULLANMA.
    
    Analiz edilecek konu:
    {processed_text}
    """

    try:
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            temperature=0.35,
            messages=[
                {"role": "system", "content": "Sen birinci sınıf bir sosyal medya stratejisti ve anadili sadece Türkçe olan yeminli bir tercümansın. Üreteceğin tüm içerikler %100 ve pürüzsüz Türkçeyle yazılmalı. İstenilen TONA uygun şekilde, sıfır yabancı kelime kullanarak JSON üret."},
                {"role": "user", "content": prompt}
            ],
            response_format={ "type": "json_object" }
        )
        
        result_content = response.choices[0].message.content
        data = json.loads(result_content)
        
        return GeneratedContent(
            linkedin_post=data.get("linkedin_post", ""),
            tweets=data.get("tweets", []),
            instagram_caption=data.get("instagram_caption", "")
        )
    except Exception as e:
        raise ValueError(f"AI Üretimi Başarısız: {str(e)}")
