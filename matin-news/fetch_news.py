"""Fetch the latest posts of a public Telegram channel (t.me/s/<channel>)
and write a small news.json for the matinarchitect.com news box.
Runs in GitHub Actions (outside Iran). Standard library only."""
import json, re, sys, urllib.request
from html import unescape
from html.parser import HTMLParser

CHANNEL = "javazsakht"
LIMIT = 5          # posts shown in the box
EXCERPT = 160      # characters of text after the title

class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.posts, self.cur, self.text_depth, self.title_depth = [], None, 0, 0
        self.channel_title = ""
        self.depth = 0
    def handle_starttag(self, tag, attrs):
        a = dict(attrs); cls = a.get("class", "") or ""
        if tag == "meta" and a.get("property") == "og:title":
            self.channel_title = a.get("content", "")
        if tag == "div" and "tgme_widget_message " in cls + " " and a.get("data-post"):
            self.cur = {"post": a["data-post"], "text": "", "date": ""}
            self.posts.append(self.cur)
        if self.cur is None:
            return
        if tag == "div":
            if self.text_depth:
                self.text_depth += 1
            elif "tgme_widget_message_text" in cls and "reply" not in cls:
                self.text_depth = 1
        if self.text_depth and tag == "br":
            self.cur["text"] += "\n"
        if tag == "time" and a.get("datetime") and not self.cur["date"]:
            self.cur["date"] = a["datetime"]
    def handle_endtag(self, tag):
        if tag == "div" and self.text_depth:
            self.text_depth -= 1
    def handle_data(self, data):
        if self.cur is not None and self.text_depth:
            self.cur["text"] += data

SOURCE_HINTS = re.compile(r"@\w+|t\.me/|telegram\.me/|https?://|www\.|🆔|کانال|عضو شوید|join", re.I)

# ads / promos: phone numbers or "call us" lines -> skip the whole post
AD_HINTS = re.compile(r"(?:0|\+98|۰)9[\d۰-۹]{9}|[\d۰-۹]{3,4}[- ]?[\d۰-۹]{7,8}|تماس|تبلیغ|به ما بسپارید|سفارش|تخفیف|رپورتاژ")
# emojis and decorative symbols, for a calm look
EMOJI = re.compile("[\U0001F000-\U0001FAFF\u2190-\u21FF\u2300-\u27BF\u2B00-\u2BFF\uFE0F\u200d\u20E3]+")

def is_ad(text):
    return bool(AD_HINTS.search(text))

def clean(t, channel_title=""):
    t = unescape(t)
    t = EMOJI.sub(" ", t)
    t = re.sub(r"[ \t\u200f\u200e\ufeff]+", " ", t)
    out = []
    for l in t.split("\n"):
        l = re.sub(r"#\S+", "", l).strip(" -–|:")   # hashtags
        if not l:
            continue
        # drop signature / link lines that would show where the news came from
        if SOURCE_HINTS.search(l) or (channel_title and channel_title in l):
            continue
        out.append(re.sub(r"[^\S\n]+", " ", l).strip())
    return out

def main():
    req = urllib.request.Request(f"https://t.me/s/{CHANNEL}",
        headers={"User-Agent": "Mozilla/5.0 (news box for matinarchitect.com)"})
    html = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "replace")
    p = Parser(); p.feed(html)
    items = []
    for post in reversed(p.posts):          # newest first
        if is_ad(unescape(post["text"])):
            continue
        lines = clean(post["text"], p.channel_title)
        if not lines:
            continue                         # photo/video without caption
        title = lines[0][:110]
        rest = " ".join(lines[1:])
        rest = rest.strip()
        excerpt = (rest[:EXCERPT].rsplit(" ", 1)[0] + "…") if len(rest) > EXCERPT else rest
        items.append({"title": title, "excerpt": excerpt, "date": post["date"]})
        if len(items) >= LIMIT:
            break
    if not items:
        sys.exit("no posts found; keeping the previous news.json")
    out = {"items": items}
    with open("news.json", "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(f"{len(items)} posts written")

if __name__ == "__main__":
    main()
