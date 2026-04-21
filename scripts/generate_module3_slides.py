from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
import textwrap

BASE = Path(r"C:\Users\Admin\Desktop\vialifecoach frontend\vialifecoach-frontend\public\videos")
OUT = BASE / "module3" / "slides"
OUT.mkdir(parents=True, exist_ok=True)
logo_path = BASE / "assets" / "vialife-logo.png"

W, H = 1920, 1080
PALETTE = {
    "bg1": (20, 16, 34),
    "bg2": (38, 24, 54),
    "panel": (45, 30, 70),
    "accent": (214, 168, 54),
    "text": (241, 244, 250),
    "muted": (189, 194, 212),
    "good": (98, 195, 145),
    "warn": (230, 126, 110),
}

slides = [
    ("Module 3.1", "Emotional Regulation and Cognitive Awareness", "Understanding the thought-emotion feedback loop in professional contexts.", "overview"),
    ("Core Link", "Thoughts and emotions are connected", "Thoughts trigger emotions. Emotions reinforce thoughts. The loop can escalate quickly.", "loop"),
    ("Stress Response", "When thought feels like confirmed threat", "Heart rate increases, muscles tighten, vigilance rises.", "stress"),
    ("Cognitive Distortion", "Intensity is not accuracy", "Strong emotion can make weak evidence feel certain.", "scale"),
    ("Skill 1", "Emotional Labeling", "Name the state: this is anxiety, frustration, or shame.", "label"),
    ("Skill 2", "Pause Technique", "One breath cycle. Slow speech. Evaluate before reacting.", "pause"),
    ("Skill 3", "Evidence Check", "Separate emotional urgency from factual accuracy.", "evidence"),
    ("Neuroscience", "Labeling supports regulation", "Reduced amygdala load. Improved prefrontal engagement.", "brain"),
    ("Professional Impact", "Better decisions under pressure", "Stronger clinical judgment, coaching quality, academic focus, leadership clarity.", "office"),
    ("Closing", "Emotion becomes informative data", "Not a directive command. Awareness enables deliberate response.", "closing"),
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
    if logo_path.exists():
        logo = Image.open(logo_path).convert("RGBA")
        logo = ImageOps.contain(logo, (230, 120))
        im.alpha_composite(logo, (W - logo.width - 40, 24))


def icon_overview(d):
    d.rounded_rectangle((1260, 350, 1760, 760), radius=30, fill=(65, 42, 102), outline=PALETTE["accent"], width=5)
    d.text((1360, 500), "M3", font=get_font(118, True), fill=PALETTE["accent"])

def icon_loop(d):
    d.arc((1280, 380, 1540, 640), 30, 330, fill=PALETTE["text"], width=8)
    d.arc((1460, 460, 1720, 720), 210, 510, fill=PALETTE["text"], width=8)
    d.polygon([(1545, 515), (1600, 520), (1570, 560)], fill=PALETTE["text"])
    d.polygon([(1460, 605), (1405, 600), (1435, 560)], fill=PALETTE["text"])

def icon_stress(d):
    d.ellipse((1320, 380, 1510, 570), fill=(245, 210, 184))
    d.rounded_rectangle((1280, 570, 1560, 760), radius=30, fill=(98, 70, 148))
    for x in [1600, 1660, 1720]:
        d.line((x, 450, x, 700), fill=PALETTE["warn"], width=10)

def icon_scale(d):
    d.line((1280, 680, 1720, 680), fill=PALETTE["muted"], width=8)
    d.line((1500, 400, 1500, 680), fill=PALETTE["muted"], width=8)
    d.line((1320, 520, 1680, 520), fill=PALETTE["accent"], width=8)
    d.ellipse((1290, 530, 1370, 610), fill=PALETTE["warn"])
    d.ellipse((1630, 530, 1710, 610), fill=PALETTE["good"])

def icon_label(d):
    d.rounded_rectangle((1260, 390, 1760, 730), radius=30, fill=(64, 93, 130))
    d.text((1320, 520), "THIS IS ANXIETY", font=get_font(52, True), fill=PALETTE["text"])

def icon_pause(d):
    d.ellipse((1320, 380, 1700, 760), outline=PALETTE["accent"], width=8)
    d.rectangle((1450, 470, 1490, 670), fill=PALETTE["text"])
    d.rectangle((1530, 470, 1570, 670), fill=PALETTE["text"])

def icon_evidence(d):
    d.rounded_rectangle((1260, 360, 1760, 760), radius=26, fill=(57, 86, 120))
    d.rectangle((1320, 430, 1700, 500), fill=(36, 62, 91))
    d.rectangle((1320, 540, 1700, 610), fill=(36, 62, 91))
    d.rectangle((1320, 650, 1700, 720), fill=(36, 62, 91))
    d.text((1350, 443), "FACTS", font=get_font(36, True), fill=PALETTE["accent"])
    d.text((1350, 553), "ASSUMPTIONS", font=get_font(36, True), fill=PALETTE["warn"])
    d.text((1350, 663), "BALANCED VIEW", font=get_font(36, True), fill=PALETTE["good"])

def icon_brain(d):
    d.ellipse((1280, 340, 1740, 780), fill=(82, 103, 152), outline=(186, 204, 235), width=6)
    d.line((1510, 360, 1510, 760), fill=(198, 214, 241), width=5)
    for y in [430, 530, 630]:
        d.arc((1340, y-70, 1490, y+70), 270, 90, fill=(198, 214, 241), width=5)
        d.arc((1530, y-70, 1680, y+70), 90, 270, fill=(198, 214, 241), width=5)

def icon_office(d):
    d.rounded_rectangle((1240, 340, 1760, 760), radius=24, fill=(42, 56, 86))
    d.rectangle((1280, 620, 1720, 665), fill=(87, 103, 136))
    d.rectangle((1340, 430, 1490, 580), fill=(18, 26, 41))
    d.rectangle((1530, 430, 1680, 580), fill=(18, 26, 41))
    d.ellipse((1600, 600, 1695, 695), fill=(234, 197, 167))

def icon_closing(d):
    for i, x in enumerate(range(1250, 1760, 95)):
        c = [PALETTE["accent"], PALETTE["good"], PALETTE["warn"]][i % 3]
        d.line((x, 300, x - 28, 420), fill=c, width=6)
    d.rounded_rectangle((1360, 560, 1660, 740), radius=34, fill=(70, 122, 90))
    d.text((1420, 620), "CALM", font=get_font(54, True), fill=(242, 252, 245))

icons = {
    "overview": icon_overview,
    "loop": icon_loop,
    "stress": icon_stress,
    "scale": icon_scale,
    "label": icon_label,
    "pause": icon_pause,
    "evidence": icon_evidence,
    "brain": icon_brain,
    "office": icon_office,
    "closing": icon_closing,
}

for i, (label, title, body, kind) in enumerate(slides, 1):
    im = bg().convert("RGBA")
    d = ImageDraw.Draw(im)

    d.rounded_rectangle((70, 70, 1180, 1000), radius=34, fill=PALETTE["panel"], outline=(101, 86, 136), width=3)
    d.rounded_rectangle((110, 110, 430, 170), radius=18, fill=(66, 48, 98), outline=PALETTE["accent"], width=2)
    d.text((132, 124), label, font=get_font(30, True), fill=PALETTE["accent"])
    d.multiline_text((110, 225), textwrap.fill(title, width=30), font=get_font(64, True), fill=PALETTE["text"], spacing=14)
    d.multiline_text((110, 505), textwrap.fill(body, width=46), font=get_font(41), fill=PALETTE["muted"], spacing=16)

    d.line((110, 955, 1140, 955), fill=(104, 91, 140), width=3)
    d.text((110, 970), "Vialifecoach Academy", font=get_font(28, True), fill=PALETTE["accent"])
    d.text((1000, 970), f"{i}/10", font=get_font(28), fill=PALETTE["muted"])

    d.rounded_rectangle((1200, 270, 1820, 810), radius=36, fill=(46, 54, 90), outline=(96, 108, 144), width=4)
    icons[kind](d)

    draw_logo(im)
    im.convert("RGB").save(OUT / f"slide{i:02d}.png", quality=95)

print(f"Generated {len(slides)} Module 3 slides at {OUT}")
