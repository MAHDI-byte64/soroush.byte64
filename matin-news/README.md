# matin-news

Hourly copy of the latest posts of a public Telegram channel (with the owner's permission),
for the «تازه‌های ساخت‌وساز» news box on matinarchitect.com.

- `fetch_news.py` reads the channel's public page and writes `news.json` (last 5 posts: title, short excerpt, date).
- `.github/workflows/matin-news.yml` runs it every hour and commits `news.json` when it changes.
- The site's news box reads `news.json` in the visitor's browser.
