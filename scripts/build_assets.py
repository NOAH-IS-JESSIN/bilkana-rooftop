"""
Build every photograph the site ships from Bilkana's own public media.

  sources/photos/*.webp   — the hotel's Bilkana gallery (thousandnights.com, Sep 2026)
  sources/reels/*.mp4     — Bilkana's Instagram reels, mirrored on the same page

Output: public/media/<name>-<width>.webp. One light, consistent grade; nothing
generated, nothing stock. See ASSET_REGISTER.md for what each file shows.

    python3 scripts/build_assets.py
"""
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageEnhance

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "sources"
OUT = ROOT / "public" / "media"
OUT.mkdir(parents=True, exist_ok=True)

MAX_BYTES = 290_000  # build standard: nothing over 300 KB ships


def grade(im: Image.Image) -> Image.Image:
    im = ImageEnhance.Contrast(im).enhance(1.04)
    return ImageEnhance.Color(im).enhance(0.97)


def save(im: Image.Image, name: str, widths: list[int]) -> None:
    im = grade(im.convert("RGB"))
    for w in widths:
        if w > im.width:
            continue
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS)
        q = 76
        path = OUT / f"{name}-{w}.webp"
        while True:
            r.save(path, "WEBP", quality=q, method=6)
            if path.stat().st_size <= MAX_BYTES or q <= 50:
                break
            q -= 4
        print(f"  {path.name:40s} {w}x{h}  q{q}  {path.stat().st_size // 1024} KB")


def crop_ratio(im: Image.Image, ratio: float, cx: float = 0.5, cy: float = 0.5) -> Image.Image:
    """Largest crop of aspect `ratio` (w/h) centred near (cx, cy) in 0–1 coords."""
    W, H = im.size
    if W / H > ratio:
        w, h = round(H * ratio), H
    else:
        w, h = W, round(W / ratio)
    x = min(max(round(cx * W - w / 2), 0), W - w)
    y = min(max(round(cy * H - h / 2), 0), H - h)
    return im.crop((x, y, x + w, y + h))


def photo(name: str) -> Image.Image:
    return Image.open(SRC / "photos" / f"bilkana-{name}.webp")


def frame(reel: str, t: float) -> Image.Image:
    cap = cv2.VideoCapture(str(SRC / "reels" / f"{reel}.mp4"))
    fps = cap.get(cv2.CAP_PROP_FPS)
    target = int(t * fps)
    fr = None
    for _ in range(target + 1):  # sequential read: frame-accurate on these files
        ok, f = cap.read()
        if ok:
            fr = f
    return Image.fromarray(cv2.cvtColor(fr, cv2.COLOR_BGR2RGB))


# ── Venue ─────────────────────────────────────────────────────────────────────
print("venue")
room = photo("rooftop-dining-room")
save(room, "room-glass", [960, 1440, 1920])
save(crop_ratio(room, 9 / 16, cx=0.56), "room-glass-portrait", [540, 760, 960])
# The wide venue shots have the photographer's light stand, laptop and bag in frame.
# Only the clean corner right of the stand is used: window, city, velvet banquette.
interior = photo("rooftop-interior")
city = interior.crop((round(interior.width * 0.665), 0, interior.width, interior.height))
save(crop_ratio(city, 4 / 5, cy=0.52), "room-city", [540, 850])
save(crop_ratio(frame("ditudo2onoz", 0.3), 4 / 5, cy=0.55), "room-banquette", [540, 720])
save(photo("rooftop-bar-and-sign"), "room-sign", [800, 1200, 1600])
save(crop_ratio(frame("dx3104aoebj", 3.4), 4 / 5, cy=0.55), "room-roof-open", [540, 720])

# ── Food (landscape, used in category visuals and the desktop side panel) ────
print("food")
for n in ["arabic-breakfast", "burger-and-fries", "drinks-and-pastries", "pizza-with-basil", "table-spread"]:
    save(photo(n), f"food-{n}", [480, 800, 1200, 1600])

# ── 4:5 portraits for the Bilkana Selection and item sheets ──────────────────
print("portraits")
save(crop_ratio(photo("breakfast-board"), 4 / 5, cx=0.47), "pick-baladi", [480, 800, 1080])
save(crop_ratio(photo("nachos"), 4 / 5, cx=0.33), "pick-nachos", [480, 800, 1080])
save(crop_ratio(photo("sliders"), 4 / 5, cx=0.36), "pick-sliders", [480, 800, 1080])
save(crop_ratio(photo("mojito"), 4 / 5, cx=0.45), "pick-mojito", [480, 800, 1080])

# ── Items cut from Bilkana's reels (720 px source) ───────────────────────────
print("reel items")
tb = frame("dyckvr0cqd1", 0.3)  # caption sits in the top ~240 px → crop below it
save(crop_ratio(tb.crop((0, 300, 720, 1280)), 4 / 5, cy=0.42), "item-turkish-breakfast", [480, 720])
save(crop_ratio(frame("dx3104aoebj", 12.4), 4 / 5, cy=0.5), "item-avocado-toast", [480, 720])
save(crop_ratio(frame("dx3104aoebj", 15.4), 4 / 5, cy=0.45), "item-croissant-tomato", [480, 720])
save(crop_ratio(frame("dx3104aoebj", 8.5), 4 / 5, cy=0.5), "item-manaqish-zaatar", [480, 720])

print("done →", OUT.relative_to(ROOT))
