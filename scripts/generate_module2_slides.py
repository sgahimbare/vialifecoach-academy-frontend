from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
import textwrap

BASE = Path(r"C:\Users\Admin\Desktop\vialifecoach frontend\vialifecoach-frontend\public\videos")
OUT = BASE / "module2" / "slides"
OUT.mkdir(parents=True, exist_ok=True)
logo_path = BASE / "assets" / "vialife-logo.png"

W, H = 1920, 1080
PALETTE = {
    "bg1": (14, 22, 18),
    "bg2": (22, 44, 34),
    "panel": (28, 54, 43),
    "accent": (209, 164, 52),
    "text": (239, 243, 248),
    "muted": (183, 194, 206),
    "good": (92, 193, 138),
    "warn": (225, 124, 106),
}

slides = [
    ("Module 2", "Identifying Personal Thinking Patterns", "From concept recognition to real-time self-observation and tracking.", "overview"),
    ("Core Shift", "Move from theory to personal detection", "Understanding distortions is not enough. You must identify your own pattern loops.", "person"),
    ("Step 1", "Triggering Situation", "Track what happened first: feedback, silence, deadline, uncertainty, or conflict.", "trigger"),
    ("Step 2", "Automatic Interpretation", "Capture the instant meaning your mind assigned before evidence review.", "thought"),
    ("Step 3", "Emotional and Behavioral Outcome", "Record the emotion and the behavior that followed the interpretation.", "emotion"),
    ("Pattern Discovery", "Repeated tracking reveals themes", "Self-criticism, catastrophic prediction, and mind reading become visible.", "patterns"),
    ("Metacognition", "Think about thinking", "Metacognitive awareness creates distance between thought and reaction.", "brain"),
    ("Professional Impact", "Decision quality and communication", "Unexamined patterns can degrade judgment, tone, and stress regulation.", "office"),
    ("Practice Model", "Daily 3-part tracking", "Document trigger, interpretation, and outcome. Name distortions and test evidence.", "checklist"),
    ("Closing", "Identifiable. Trackable. Measurable.", "What can be measured can be modified.", "closing"),
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
    im.alpha_composite(logo, (W - logo.width - 40, 24))


def icon_overview(d):
    d.rounded_rectangle((1260, 340, 1760, 760), radius=30, fill=(33, 70, 55), outline=PALETTE["accent"], width=5)
    d.text((1350, 500), "M2", font=get_font(120, True), fill=PALETTE["accent"])

def icon_person(d):
    d.ellipse((1430, 350, 1600, 520), fill=(245, 214, 188))
    d.rounded_rectangle((1380, 520, 1650, 760), radius=34, fill=(55, 118, 151))

def icon_trigger(d):
    d.rounded_rectangle((1240, 360, 1760, 760), radius=24, fill=(24, 56, 78))
    d.ellipse((1300, 430, 1410, 540), fill=PALETTE["warn"])
    d.text((1450, 450), "TRIGGER", font=get_font(52, True), fill=PALETTE["text"])

def icon_thought(d):
    d.rounded_rectangle((1250, 390, 1720, 690), radius=42, fill=(42, 86, 120))
    d.polygon([(1420, 690), (1500, 790), (1540, 690)], fill=(42, 86, 120))
    d.text((1310, 500), "THOUGHT", font=get_font(56, True), fill=PALETTE["text"])

def icon_emotion(d):
    d.ellipse((1290, 360, 1520, 590), fill=(234, 189, 164))
    d.ellipse((1500, 450, 1730, 680), fill=(114, 63, 126))
    d.text((1320, 700), "EMOTION -> ACTION", font=get_font(44, True), fill=PALETTE["muted"])

def icon_patterns(d):
    for i, x in enumerate([1270, 1430, 1590]):
        d.rounded_rectangle((x, 380, x + 130, 700), radius=24, fill=(58 + i * 18, 101, 78))
    d.line((1330, 540, 1500, 540, 1660, 540), fill=PALETTE["accent"], width=8)

def icon_brain(d):
    d.ellipse((1280, 340, 1740, 780), fill=(74, 100, 143), outline=(177, 197, 230), width=6)
    for y in [430, 520, 610, 700]:
        d.arc((1360, y - 80, 1660, y + 80), 180, 360, fill=(198, 214, 241), width=5)

def icon_office(d):
    d.rounded_rectangle((1240, 340, 1760, 760), radius=24, fill=(28, 52, 70))
    d.rectangle((1280, 620, 1720, 665), fill=(67, 106, 137))
    d.rectangle((1340, 430, 1490, 580), fill=(16, 28, 40))
    d.rectangle((1530, 430, 1680, 580), fill=(16, 28, 40))

def icon_checklist(d):
    d.rounded_rectangle((1240, 340, 1760, 760), radius=24, fill=(26, 52, 72))
    for i, y in enumerate([430, 520, 610]):
        d.rectangle((1300, y, 1360, y + 60), fill=(41, 95, 69))
        d.line((1315, y + 30, 1330, y + 45, 1348, y + 18), fill=(236, 250, 240), width=5)
        d.line((1400, y + 30, 1680, y + 30), fill=PALETTE["muted"], width=6)

def icon_closing(d):
    for i, x in enumerate(range(1250, 1760, 95)):
        c = [PALETTE["accent"], PALETTE["good"], PALETTE["warn"]][i % 3]
        d.line((x, 300, x - 30, 420), fill=c, width=6)
    d.rounded_rectangle((1360, 560, 1660, 740), radius=32, fill=(56, 115, 82))
    d.text((1418, 620), "GROWTH", font=get_font(50, True), fill=(240, 252, 244))

icons = {
    "overview": icon_overview,
    "person": icon_person,
    "trigger": icon_trigger,
    "thought": icon_thought,
    "emotion": icon_emotion,
    "patterns": icon_patterns,
    "brain": icon_brain,
    "office": icon_office,
    "checklist": icon_checklist,
    "closing": icon_closing,
}

for i, (label, title, body, kind) in enumerate(slides, 1):
    im = bg().convert("RGBA")
    d = ImageDraw.Draw(im)

    d.rounded_rectangle((70, 70, 1180, 1000), radius=34, fill=PALETTE["panel"], outline=(76, 108, 92), width=3)
    d.rounded_rectangle((110, 110, 390, 170), radius=18, fill=(36, 68, 57), outline=PALETTE["accent"], width=2)
    d.text((132, 124), label, font=get_font(30, True), fill=PALETTE["accent"])
    d.multiline_text((110, 225), textwrap.fill(title, width=30), font=get_font(66, True), fill=PALETTE["text"], spacing=14)
    d.multiline_text((110, 505), textwrap.fill(body, width=46), font=get_font(41), fill=PALETTE["muted"], spacing=16)

    d.line((110, 955, 1140, 955), fill=(70, 102, 89), width=3)
    d.text((110, 970), "Vialifecoach Academy", font=get_font(28, True), fill=PALETTE["accent"])
    d.text((1000, 970), f"{i}/10", font=get_font(28), fill=PALETTE["muted"])

    d.rounded_rectangle((1200, 270, 1820, 810), radius=36, fill=(27, 50, 66), outline=(76, 104, 124), width=4)
    icons[kind](d)

    draw_logo(im)
    im.convert("RGB").save(OUT / f"slide{i:02d}.png", quality=95)

print(f"Generated {len(slides)} Module 2 slides at {OUT}")
