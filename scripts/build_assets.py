"""
Builds every web asset in public/assets from the original artwork in art/source.

  python3 scripts/build_assets.py

Requires Pillow, numpy and scipy. The preloader video is encoded separately
by scripts/build_video.sh (ffmpeg).

The asset grid (art/source/asset-grid.png) is cut into individual pieces using
a chroma key on the electric-blue background; the crop boxes live in
scripts/asset-boxes.json. Full scenes are exported as-is (not cut out).
"""
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "art" / "source"
OUT = ROOT / "public" / "assets"
BOXES = json.loads((ROOT / "scripts" / "asset-boxes.json").read_text())


def clean_grid(img: Image.Image) -> np.ndarray:
    """Paint out the thin separator line that crosses the throne / palm row."""
    a = np.array(img.convert("RGB")).astype(int)
    for y in (772, 773, 774):
        a[y] = (a[y - 3] + a[y + 3]) // 2
    return a.astype(float)


def key(c: np.ndarray, lo=50, hi=88, keep="all", minarea=40, fill=False) -> Image.Image:
    """Chroma-key the blue background out of a crop and un-mix the blue spill."""
    r, g, b = c[..., 0], c[..., 1], c[..., 2]
    s = b - np.maximum(r, g)
    a = np.clip((hi - s) / (hi - lo), 0, 1)
    # dark navy (vest, sunglasses, shoes) always stays opaque
    a = np.where(b < 150, np.maximum(a, np.clip((170 - b) / 20, 0, 1)), a)
    hard = a > 0.5
    if fill:  # objects that contain blue themselves (globes)
        fh = ndimage.binary_fill_holes(ndimage.binary_closing(hard, iterations=2))
        a = np.where(fh & ~hard, 1.0, a)
        hard = fh
    lab, n = ndimage.label(ndimage.binary_dilation(hard, iterations=2))
    if n:
        sizes = ndimage.sum(hard, lab, range(1, n + 1))
        if keep == "largest":
            good = lab == (int(np.argmax(sizes)) + 1)
        else:
            good = np.isin(lab, [i + 1 for i, sz in enumerate(sizes) if sz >= minarea])
        a = a * good
    bgm = s > hi
    bg = np.median(c[bgm], axis=0) if bgm.sum() > 50 else np.array([45, 135, 250.0])
    A = a[..., None]
    fg = np.where(A > 0.02, (c - (1 - A) * bg) / np.maximum(A, 1e-3), c)
    img = Image.fromarray(np.dstack([np.clip(fg, 0, 255), a * 255]).astype("uint8"), "RGBA")
    bb = Image.fromarray((a > 0.03).astype("uint8") * 255).getbbox()
    if bb:
        x0, y0, x1, y1 = bb
        p = 3
        img = img.crop((max(0, x0 - p), max(0, y0 - p), min(img.width, x1 + p), min(img.height, y1 + p)))
    return img


def save_webp(img: Image.Image, path: Path, quality=86):
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "WEBP", quality=quality, method=6)


def cut_grid():
    grid = clean_grid(Image.open(SRC / "asset-grid.png"))
    for group, folder in (("characters", "damian"), ("stickers", "stickers")):
        for name, spec in BOXES[group].items():
            x0, y0, x1, y1 = spec["box"]
            img = key(grid[y0:y1, x0:x1], keep=spec.get("keep", "all"),
                      minarea=spec.get("minarea", 40), fill=spec.get("fill", False))
            if name == "throne":  # drop the stanchion sliver on the right
                img = img.crop((0, 0, img.width - 10, img.height - 4))
            save_webp(img, OUT / folder / f"{name}.webp", quality=90)
            print(f"{folder}/{name}.webp", img.size)


def scenes():
    for name in ("scene-reclining-wide", "scene-portrait-wide", "scene-standing-tall", "scene-reclining-square"):
        im = Image.open(SRC / f"{name}.png").convert("RGB")
        for w in (640, 1280, im.width):
            if w > im.width:
                continue
            r = im if w == im.width else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
            suffix = "" if w == im.width else f"-{w}"
            save_webp(r, OUT / "scenes" / f"{name}{suffix}.webp", quality=82)
        print("scene", name)


def brand():
    crown = Image.open(OUT / "stickers" / "crown-gold.webp").convert("RGBA")
    # favicon / app icons: crown on brand blue rounded square
    for size, fname in ((32, "favicon-32.png"), (180, "apple-touch-icon.png"), (512, "icon-512.png")):
        base = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        d = ImageDraw.Draw(base)
        d.rounded_rectangle((0, 0, size - 1, size - 1), radius=size // 4, fill=(45, 138, 252, 255))
        c = crown.copy()
        c.thumbnail((int(size * 0.8), int(size * 0.8)), Image.LANCZOS)
        base.alpha_composite(c, ((size - c.width) // 2, (size - c.height) // 2 + size // 40))
        base.save(ROOT / "public" / fname)
    # social preview 1200x630
    scene = Image.open(SRC / "scene-reclining-wide.png").convert("RGB")
    h = 630
    w = round(scene.width * h / scene.height)
    scene = scene.resize((w, h), Image.LANCZOS)
    left = (w - 1200) // 2
    og = scene.crop((left, 0, left + 1200, h)).convert("RGBA")
    sticker = Image.open(OUT / "stickers" / "sticker-our-coin.webp").convert("RGBA")
    sticker = sticker.resize((sticker.width * 3, sticker.height * 3), Image.LANCZOS)
    og.alpha_composite(sticker, (48, 40))
    og.convert("RGB").save(ROOT / "public" / "og-image.jpg", quality=86)
    print("brand icons + og image")


if __name__ == "__main__":
    cut_grid()
    scenes()
    brand()
