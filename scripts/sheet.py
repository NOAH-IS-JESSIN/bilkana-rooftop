"""Tile screenshots into contact sheets: python3 scripts/sheet.py <prefix> <out> [cols] [scale]"""
import sys, glob
from PIL import Image
prefix, out = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 6
scale = float(sys.argv[4]) if len(sys.argv) > 4 else 0.5
fs = sorted(glob.glob(f".shots/{prefix}*.png"))
ims = [Image.open(f).convert("RGB") for f in fs]
ims = [i.resize((int(i.width * scale), int(i.height * scale))) for i in ims]
w, h = ims[0].size
rows = (len(ims) + cols - 1) // cols
s = Image.new("RGB", (cols * (w + 6), rows * (h + 6)), "white")
for k, im in enumerate(ims):
    s.paste(im, ((k % cols) * (w + 6), (k // cols) * (h + 6)))
s.save(out, quality=82)
print(out, s.size, len(ims))
