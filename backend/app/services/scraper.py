import requests
from bs4 import BeautifulSoup

def scrape_wikipedia(url: str):
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; WikiQuizBot/1.0)"
    }

    resp = requests.get(url, headers=headers, timeout=10)

    if resp.status_code != 200:
        raise Exception(f"Wikipedia fetch failed: {resp.status_code}")

    soup = BeautifulSoup(resp.text, "html.parser")

    title = soup.find("h1").get_text()
    paragraphs = soup.select("p")

    content = "\n".join(p.get_text() for p in paragraphs[:10])

    return {
        "title": title,
        "content": content,
    }
