from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
import textwrap

BASE = Path(r"C:\Users\Admin\Desktop\vialifecoach frontend\vialifecoach-frontend\public\videos")
OUT = BASE / "module1" / "slides"
OUT.mkdir(parents=True, exist_ok=True)
logo_path = BASE / "assets" / "vialife-logo.png"

W, H = 1920, 1080
PALETTE = {
    "bg1": (10, 18, 30),
    "bg2": (16, 34, 52),
    "panel": (22, 40, 62),
    "accent": (210, 162, 45),
    "text": (239, 243, 248),
    "muted": (180, 191, 208),
    "good": (82, 190, 132),
    "warn": (227, 119, 104),
}

slides = [
    ("Module 1", "Understanding Negative Thinking", "A professional guide to identifying thought patterns before changing them.", "intro"),
    ("Core Principle", "Negative thinking is a process", "It is not a personality flaw. It follows repeatable cognitive structures.", "person"),
    ("Cognitive Distortions", "Five Distortion Patterns", "Recognize these patterns early to reduce emotional escalation.", "distortions"),
    ("Distortion 2", "Overgeneralization", "Turning one setback into a permanent conclusion.", "graph"),
    ("Distortion 3", "Personalization", "Taking excessive responsibility for events beyond your control.", "people"),
    ("Distortion 4", "All-or-Nothing Thinking", "Interpreting outcomes in extremes with no middle ground.", "split"),
    ("Distortion 5", "Mind Reading", "Assuming what others think without direct evidence.", "conversation"),
    ("Professional Impact", "Why this matters at work", "In healthcare, education, and leadership, distorted thinking harms judgment and emotional regulation.", "office"),
    ("Cognitive Skill", "Separate fact from interpretation", "Thoughts are mental events. They are not automatically truths.", "brain"),
    ("Closing", "Awareness creates choice", "Choice creates change. This is your foundation for every next module.", "celebrate"),
]

font_candidates = [r"C:\\Windows\\Fonts\\segoeui.ttf", r"C:\\Windows\\Fonts\\calibri.ttf", r"C:\\Windows\\Fonts\\arial.ttf"]
font_bold_candidates = [r"C:\\Windows\\Fonts\\segoeuib.ttf", r"C:\\Windows\\Fonts\\calibrib.ttf", r"C:\\Windows\\Fonts\\arialbd.ttf"]

def get_font(size, bold=False):
    for p in (font_bold_candidates if bold else font_candidates):
        if Path(p).exists():
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def bg():
    im = Image.new("RGB", (W, H), PALETTE["bg1"])
    d = ImageDraw.Draw(im)
    for y in range(H):
        t = y / max(H - 1, 1)
        r = int(PALETTE["bg1"][0] * (1 - t) + PALETTE["bg2"][0] * t)
        g = int(PALETTE["bg1"][1] * (1 - t) + PALETTE["bg2"][1] * t)
        b = int(PALETTE["bg1"][2] * (1 - t) + PALETTE["bg2"][2] * t)
        d.line([(0, y), (W, y)], fill=(r, g, b))
    return im


def draw_logo(im):
    if not logo_path.exists():
        return
    logo = Image.open(logo_path).convert("RGBA")
    logo = ImageOps.contain(logo, (230, 120))
    x, y = W - logo.width - 40, 24
    im.alpha_composite(logo, (x, y))


def icon_person(d):
    d.ellipse((1390, 330, 1700, 640), fill=(32, 68, 102), outline=PALETTE["accent"], width=6)
    d.ellipse((1490, 360, 1600, 470), fill=(246, 210, 183))
    d.rounded_rectangle((1450, 470, 1640, 620), radius=32, fill=(60, 117, 164))

def icon_warning(d):
    d.polygon([(1500, 320), (1760, 760), (1240, 760)], fill=(120, 58, 52), outline=PALETTE["warn"], width=8)
    d.rectangle((1490, 470, 1515, 620), fill=(255, 245, 230))
    d.ellipse((1490, 660, 1515, 685), fill=(255, 245, 230))

def icon_graph(d):
    d.rounded_rectangle((1250, 320, 1780, 760), radius=24, fill=(24, 52, 78), outline=(70, 102, 136), width=4)
    d.line((1300, 700, 1300, 380), fill=PALETTE["muted"], width=4)
    d.line((1300, 700, 1720, 700), fill=PALETTE["muted"], width=4)
    d.line((1320, 680, 1420, 620, 1510, 640, 1600, 540, 1700, 470), fill=PALETTE["warn"], width=8)

def icon_people(d):
    for i, x in enumerate([1300, 1470, 1640]):
        d.ellipse((x, 360, x + 120, 480), fill=(238, 201 - i * 20, 178))
        d.rounded_rectangle((x - 20, 480, x + 140, 690), radius=30, fill=(44 + i * 20, 92, 142))

def icon_split(d):
    d.rounded_rectangle((1240, 320, 1760, 760), radius=28, fill=(22, 44, 68), outline=(70, 98, 125), width=4)
    d.rectangle((1498, 330, 1504, 750), fill=PALETTE["accent"])
    d.text((1300, 510), "FAIL", font=get_font(54, True), fill=PALETTE["warn"])
    d.text((1580, 510), "PERFECT", font=get_font(54, True), fill=PALETTE["good"])

def icon_conversation(d):
    d.rounded_rectangle((1250, 360, 1600, 620), radius=40, fill=(34, 84, 122))
    d.polygon([(1370, 620), (1420, 700), (1470, 620)], fill=(34, 84, 122))
    d.rounded_rectangle((1420, 460, 1760, 760), radius=40, fill=(55, 110, 86))
    d.polygon([(1580, 760), (1620, 840), (1660, 760)], fill=(55, 110, 86))

def icon_office(d):
    d.rounded_rectangle((1220, 320, 1780, 760), radius=24, fill=(24, 46, 68))
    d.rectangle((1260, 620, 1740, 660), fill=(66, 103, 139))
    d.rectangle((1320, 420, 1450, 570), fill=(12, 22, 36))
    d.rectangle((1520, 420, 1660, 570), fill=(12, 22, 36))
    d.ellipse((1600, 610, 1690, 700), fill=(233, 196, 164))
    d.rounded_rectangle((1560, 690, 1740, 760), radius=20, fill=(74, 140, 108))

def icon_brain(d):
    d.ellipse((1280, 330, 1740, 780), fill=(70, 92, 145), outline=(170, 192, 230), width=6)
    for y in [420, 500, 580, 660]:
        d.arc((1350, y - 90, 1660, y + 70), 180, 360, fill=(196, 212, 240), width=5)
    for x in [1380, 1480, 1580]:
        d.arc((x - 80, 390, x + 80, 720), 90, 270, fill=(196, 212, 240), width=5)

def icon_celebrate(d):
    for i, x in enumerate(range(1240, 1760, 90)):
        c = [PALETTE["accent"], PALETTE["good"], PALETTE["warn"]][i % 3]
        d.line((x, 280, x - 40, 420), fill=c, width=6)
        d.ellipse((x - 12, 260, x + 12, 284), fill=c)
    d.rounded_rectangle((1360, 540, 1660, 740), radius=34, fill=(53, 108, 78))
    d.text((1430, 610), "DONE", font=get_font(58, True), fill=(236, 250, 240))

def icon_distortions(d):
    d.rounded_rectangle((1240, 320, 1760, 760), radius=28, fill=(23, 46, 70), outline=(70, 98, 125), width=4)
    chips = [
        "Catastrophizing",
        "Overgeneralization",
        "Personalization",
        "All-or-Nothing",
        "Mind Reading",
    ]
    y = 370
    for idx, item in enumerate(chips):
        fill = (35, 70, 104) if idx % 2 == 0 else (41, 81, 118)
        d.rounded_rectangle((1280, y, 1720, y + 64), radius=20, fill=fill, outline=(88, 118, 146), width=2)
        d.text((1310, y + 16), item, font=get_font(30, True), fill=PALETTE["text"])
        y += 76

icon_map = {
    "intro": icon_brain,
    "person": icon_person,
    "warning": icon_warning,
    "graph": icon_graph,
    "people": icon_people,
    "split": icon_split,
    "conversation": icon_conversation,
    "office": icon_office,
    "brain": icon_brain,
    "celebrate": icon_celebrate,
    "distortions": icon_distortions,
}

for i, (label, title, body, kind) in enumerate(slides, 1):
    im = bg().convert("RGBA")
    d = ImageDraw.Draw(im)

    d.rounded_rectangle((70, 70, 1180, 1000), radius=34, fill=PALETTE["panel"], outline=(68, 94, 124), width=3)
    d.rounded_rectangle((110, 110, 390, 170), radius=18, fill=(30, 55, 82), outline=PALETTE["accent"], width=2)
    d.text((132, 124), label, font=get_font(30, True), fill=PALETTE["accent"])
    d.multiline_text((110, 225), textwrap.fill(title, width=28), font=get_font(68, True), fill=PALETTE["text"], spacing=14)
    d.multiline_text((110, 500), textwrap.fill(body, width=46), font=get_font(42), fill=PALETTE["muted"], spacing=16)

    d.line((110, 955, 1140, 955), fill=(64, 90, 120), width=3)
    d.text((110, 970), "Vialifecoach Academy", font=get_font(28, True), fill=PALETTE["accent"])
    d.text((1010, 970), f"{i}/10", font=get_font(28), fill=PALETTE["muted"])

    d.rounded_rectangle((1200, 270, 1820, 810), radius=36, fill=(24, 44, 66), outline=(70, 95, 125), width=4)
    icon_map.get(kind, icon_brain)(d)

    draw_logo(im)

    im.convert("RGB").save(OUT / f"slide{i:02d}.png", quality=95)

print(f"Generated {len(slides)} professional slides at {OUT}")
