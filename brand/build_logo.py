"""Builds the BA "Carved" mark, wordmark and lockups as SVG masters.

Run: python brand/build_logo.py   (writes into brand/)
Geometry: mark on a 256 grid; wordmark letters on a 100-unit cap height,
monoline stroke 10, constructed from lines and circular arcs only.
"""
from pathlib import Path

OUT = Path(__file__).parent

# --- Mark ---------------------------------------------------------------
# Solid B (stem + upper r44 bowl + lower r52 bowl) with one A cut through it:
# a closed triangular counter above an open notch, the band between = crossbar.
MARK = ("M56 32 H148 A44 44 0 0 1 148 120 A52 52 0 0 1 148 224 H146 "
        "L137.2 182 H90.8 L82 224 H56 Z M114 72 L133.4 164 H94.6 Z")
# Small-size cut (<= 32 px): narrower A, thicker crossbar band, so the stem
# and counter stay at least ~1.6 px at 16 px.
MARK_SMALL = ("M56 32 H148 A44 44 0 0 1 148 120 A52 52 0 0 1 148 224 H140 "
              "L132.6 184 H95.4 L88 224 H56 Z M114 80 L128.4 156 H99.6 Z")

def mark_svg(d, fill="#000"):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">'
            f'<path fill="{fill}" fill-rule="evenodd" d="{d}"/></svg>\n')

# --- Wordmark -----------------------------------------------------------
SW = 10  # stroke on a 100-unit cap height
LETTERS = {
    "B": (65, "M5 100 V5 H34 A21.5 21.5 0 0 1 34 48 H5 M5 48 H36 A23.5 23.5 0 0 1 36 95 H5"),
    "L": (50, "M5 0 V95 H50"),
    "E": (50, "M50 5 H5 V95 H50 M5 50 H44"),
    "V": (61, "M2 -12 L30.5 104 L59 -12"),
    "I": (10, "M5 0 V100"),
    "S": (55, "M46.99 16.25 A22.5 22.5 0 1 0 27.5 50 A22.5 22.5 0 1 1 8.01 83.75"),
    "A": (62, "M2 112 L31 -8 L60 112 M13.1 66 H48.9"),
    "U": (60, "M5 0 V71.5 A25 25 0 0 0 55 71.5 V0"),
    "H": (60, "M5 0 V100 M55 0 V100 M5 50 H55"),
}
TRACK, SPACE = 30, 80

def wordmark_paths(text="BLEVIS ALLUSHI"):
    x, parts = 0.0, []
    for ch in text:
        if ch == " ":
            x += SPACE - TRACK
            continue
        w, d = LETTERS[ch]
        parts.append(f'<path transform="translate({x:g} 0)" d="{d}"/>')
        x += w + TRACK
    return "".join(parts), x - TRACK

def wordmark_group(scale, tx, ty, color, clip_id):
    paths, width = wordmark_paths()
    g = (f'<g transform="translate({tx:g} {ty:g}) scale({scale:g})">'
         f'<clipPath id="{clip_id}"><rect x="-10" y="0" width="{width + 20:g}" height="100"/></clipPath>'
         f'<g clip-path="url(#{clip_id})" fill="none" stroke="{color}" stroke-width="{SW}" '
         f'stroke-linejoin="miter" stroke-miterlimit="10">{paths}</g></g>')
    return g, width * scale

def write(name, body):
    (OUT / name).write_text(body, encoding="utf-8")
    print("wrote", name)

def build():
    write("ba-mark.svg", mark_svg(MARK))
    write("ba-mark-small.svg", mark_svg(MARK_SMALL))

    # Wordmark alone, cap height 100.
    g, w = wordmark_group(1, 0, 0, "#000", "wm")
    write("ba-wordmark.svg", f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 {w + 12:g} 112">{g}</svg>\n')

    # Horizontal: mark (glyph 192 tall) + wordmark caps at 0.31 of glyph height,
    # gap = 1.5 x the mark's stem width, caps vertically centred on the glyph.
    cap = 60
    g, w = wordmark_group(cap / 100, 0, 0, "#000", "wh")
    mark_right, gap = 200, 40
    tx, ty = mark_right + gap, 128 - cap / 2
    g, w = wordmark_group(cap / 100, tx, ty, "#000", "wh")
    total = tx + w + 24
    write("ba-lockup-horizontal.svg",
          f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="32 0 {total - 32:g} 256">'
          f'<path fill="#000" fill-rule="evenodd" d="{MARK}"/>{g}</svg>\n')

    # Stacked: mark above, wordmark centred below.
    cap = 34
    _, w = wordmark_group(cap / 100, 0, 0, "#000", "ws")
    width = max(w, 192) + 48
    mx = (width - 256) / 2
    g, _ = wordmark_group(cap / 100, (width - w) / 2, 264, "#000", "ws")
    write("ba-lockup-stacked.svg",
          f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 8 {width:g} {264 + cap + 32 - 8:g}">'
          f'<path transform="translate({mx:g} 0)" fill="#000" fill-rule="evenodd" d="{MARK}"/>{g}</svg>\n')

if __name__ == "__main__":
    build()
