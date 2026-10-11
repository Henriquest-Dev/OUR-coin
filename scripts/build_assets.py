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


GRID_X4 = ROOT / "art" / "derived" / "asset-grid-x4.png"
UP = 4  # the grid is cut from a 4x Real-ESRGAN upscale (see scripts/upscale_esrgan.py)
OUT_SCALE = 2  # exported pieces are 2x the original sheet resolution


def clean_grid(img: Image.Image) -> np.ndarray:
    """Paint out the thin separator line that crosses the throne / palm row (original-res sheet)."""
    a = np.array(img.convert("RGB")).astype(int)
    for y in (772, 773, 774):
        a[y] = (a[y - 3] + a[y + 3]) // 2
    return a.astype(np.uint8)


def build_grid_x4() -> np.ndarray:
    """4x upscale with the original paper grain transferred back on top."""
    if not GRID_X4.exists():
        raise SystemExit(
            "art/derived/asset-grid-x4.png missing: run\n"
            "  python3 scripts/upscale_esrgan.py <RealESRGAN_x4plus_anime_6B.pth> <clean-grid.png> <out.png>\n"
            "then python3 scripts/build_assets.py --grain <out.png>"
        )
    return np.array(Image.open(GRID_X4).convert("RGB")).astype(float)


def key(c: np.ndarray, keep="all", fill=False, minhole=40) -> Image.Image:
    """
    Remove the electric-blue background from one crop (4x space).

    * background colour is sampled from the crop border (the sheet has a slight gradient)
    * alpha comes from the colour distance to that background, so soft edges stay soft
    * only background-coloured regions that touch the crop border, or enclosed gaps larger
      than `minhole`, are made transparent -> blue *inside* an object (globe oceans,
      reflections) survives. `fill=True` keeps every enclosed region.
    * the blue spill is un-mixed from edge pixels, and the matte is tightened by ~1px.
    """
    h, w, _ = c.shape
    border = np.concatenate([c[:4].reshape(-1, 3), c[-4:].reshape(-1, 3), c[:, :4].reshape(-1, 3), c[:, -4:].reshape(-1, 3)])
    bs = border[:, 2] - np.maximum(border[:, 0], border[:, 1])
    bg = np.median(border[bs > 60], axis=0) if (bs > 60).sum() > 20 else np.array([45, 137, 252.0])

    d = np.sqrt(((c - bg) ** 2).sum(-1))
    s = c[..., 2] - np.maximum(c[..., 0], c[..., 1])
    bgish = (d < 95) & (s > 45)  # candidate background pixels
    lab, n = ndimage.label(bgish)
    if n:
        edge_labels = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
        sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
        drop = [i + 1 for i in range(n) if (i + 1) in edge_labels or (not fill and sizes[i] >= minhole)]
        region = np.isin(lab, drop)
    else:
        region = np.zeros((h, w), bool)
    # widen the region a little so the anti-aliased rim is evaluated by the soft ramp
    region_soft = ndimage.binary_dilation(region, iterations=5)
    ramp = np.clip((d - 40) / (130 - 40), 0, 1)
    a = np.where(region_soft, ramp, 1.0)
    a = np.where(region, 0.0, a)
    a = ndimage.gaussian_filter(a, 0.7)

    hard = a > 0.5
    lab2, n2 = ndimage.label(ndimage.binary_dilation(hard, iterations=6))
    if n2:
        sz = ndimage.sum(hard, lab2, range(1, n2 + 1))
        if keep == "largest":
            good = lab2 == (int(np.argmax(sz)) + 1)
        else:
            good = np.isin(lab2, [i + 1 for i, v in enumerate(sz) if v >= 400])
        a = a * good
    # tighten the matte ~1px to kill the blue halo
    a = np.minimum(a, ndimage.grey_erosion(a, size=(3, 3)) * 0.5 + a * 0.5)

    A = a[..., None]
    fg = np.where(A > 0.02, (c - (1 - A) * bg) / np.maximum(A, 1e-3), c)
    fg = np.clip(fg, 0, 255)
    # residual spill on the rim: cap blue at max(r,g) + a bit
    rim = (a > 0.02) & (a < 0.98)
    cap = np.maximum(fg[..., 0], fg[..., 1]) + 25
    fg[..., 2] = np.where(rim & (fg[..., 2] > cap), cap, fg[..., 2])

    img = Image.fromarray(np.dstack([fg, a * 255]).astype("uint8"), "RGBA")
    bb = Image.fromarray((a > 0.03).astype("uint8") * 255).getbbox()
    if bb:
        x0, y0, x1, y1 = bb
        p = 8
        img = img.crop((max(0, x0 - p), max(0, y0 - p), min(w, x1 + p), min(h, y1 + p)))
    # downscale on premultiplied colour to avoid dark/blue fringes
    tw, th = round(img.width * OUT_SCALE / UP), round(img.height * OUT_SCALE / UP)
    pm = img.convert("RGBa").resize((tw, th), Image.LANCZOS)
    return pm.convert("RGBA")


def save_webp(img: Image.Image, path: Path, quality=86):
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "WEBP", quality=quality, method=6)


def cut_grid():
    grid = build_grid_x4()
    for group, folder in (("characters", "damian"), ("stickers", "stickers")):
        for name, spec in BOXES[group].items():
            x0, y0, x1, y1 = (v * UP for v in spec["box"])
            img = key(grid[y0:y1, x0:x1], keep=spec.get("keep", "all"), fill=spec.get("fill", False),
                      minhole=spec.get("minhole", 40))
            if name == "throne":  # drop the stanchion sliver on the right
                img = img.crop((0, 0, img.width - 20, img.height - 8))
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


def make_grain(upscaled: str):
    """Transfer the original paper grain onto the Real-ESRGAN output and cache it."""
    from PIL import ImageFilter
    up = np.array(Image.open(upscaled).convert("RGB")).astype(np.float32)
    lz = Image.fromarray(clean_grid(Image.open(SRC / "asset-grid.png"))).resize((up.shape[1], up.shape[0]), Image.LANCZOS)
    blur = np.array(lz.filter(ImageFilter.GaussianBlur(3))).astype(np.float32)
    lz = np.array(lz).astype(np.float32)
    GRID_X4.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(np.clip(up + 0.9 * (lz - blur), 0, 255).astype(np.uint8)).save(GRID_X4)


if __name__ == "__main__":
    import sys
    if len(sys.argv) == 3 and sys.argv[1] == "--grain":
        make_grain(sys.argv[2])
    cut_grid()
    scenes()
    brand()
