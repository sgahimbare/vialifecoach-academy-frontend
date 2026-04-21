from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
import textwrap

BASE = Path(r"C:\Users\Admin\Desktop\vialifecoach frontend\vialifecoach-frontend\public\videos")
OUT = BASE / "module5" / "slides"
OUT.mkdir(parents=True, exist_ok=True)
logo_path = BASE / "assets" / "vialife-logo.png"

W, H = 1920, 1080
PALETTE = {
    "bg1": (14, 30, 22),
    "bg2": (24, 52, 38),
    "panel": (30, 62, 46),
    "accent": (214, 170, 62),
    "text": (243, 246, 250),
    "muted": (191, 206, 197),
    "good": (103, 198, 145),
    "warn": (224, 133, 105),
}

slides = [
    ("Module 5", "Gratitude, Perspective, and Environment", "Reinforcing cognitive change through attentional and contextual design.", "overview"),
    ("Purpose", "Reinforcement and sustainability", "Cognitive gains weaken without structured reinforcement loops.", "purpose"),
    ("Gratitude", "Attentional conditioning", "Train attention toward what is functioning, stable, and supportive.", "gratitude"),
    ("Neuro Effect", "Reward activation, stress reduction", "Specific daily acknowledgments rebalance threat-focused scanning.", "reward"),
    ("Perspective", "Expand the time horizon", "Ask: how will this matter in six months? Regain proportionality.", "perspective"),
    ("Reframing", "Alternative interpretations", "Challenge narrow conclusions and reduce emotional rigidity.", "reframe"),
    ("Environment", "Design the cognitive ecosystem", "Media, people, routine, and workspace shape your baseline.", "environment"),
    ("Small Shifts", "Measurable cognitive benefit", "Reduce negative inputs. Increase clarity-supporting inputs.", "shift"),
    ("Integration", "Habit, perspective, context", "Sustainable resilience is built through aligned reinforcement.", "integration"),
    ("Closing", "Resilience becomes structured", "Positive cognition is sustained by design, not effort alone.", "closing"),
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
    d.rounded_rectangle((1260, 350, 1760, 760), radius=30, fill=(55, 102, 77), outline=PALETTE["accent"], width=5)
    d.text((1360, 500), "M5", font=get_font(118, True), fill=PALETTE["accent"])

def icon_purpose(d):
    d.rounded_rectangle((1260, 390, 1760, 720), radius=26, fill=(52, 95, 74))
    d.text((1320, 520), "REINFORCE", font=get_font(58, True), fill=PALETTE["text"])

def icon_gratitude(d):
    d.rounded_rectangle((1250, 360, 1760, 760), radius=26, fill=(52, 96, 74))
    for i, t in enumerate(["3 daily wins", "1 support source", "1 stable anchor"]):
        y = 430 + i * 95
        d.rounded_rectangle((1300, y, 1710, y + 68), radius=18, fill=(68, 121, 93))
        d.text((1330, y + 18), t, font=get_font(34, True), fill=PALETTE["text"])

def icon_reward(d):
    d.ellipse((1300, 390, 1700, 790), fill=(67, 109, 139), outline=(193, 214, 234), width=5)
    d.text((1425, 555), "+", font=get_font(86, True), fill=PALETTE["accent"])

def icon_perspective(d):
    d.rounded_rectangle((1240, 360, 1760, 760), radius=24, fill=(54, 96, 76))
    d.text((1305, 470), "NOW", font=get_font(44, True), fill=PALETTE["warn"])
    d.text((1475, 470), "->", font=get_font(44, True), fill=PALETTE["text"])
    d.text((1570, 470), "6M", font=get_font(44, True), fill=PALETTE["good"])
    d.text((1310, 580), "How will this matter?", font=get_font(40, True), fill=PALETTE["text"])

def icon_reframe(d):
    d.rounded_rectangle((1240, 360, 1760, 760), radius=24, fill=(51, 92, 72))
    d.text((1320, 470), "ONE STORY", font=get_font(46, True), fill=PALETTE["warn"])
    d.text((1320, 570), "ALTERNATIVES", font=get_font(46, True), fill=PALETTE["good"])

def icon_environment(d):
    d.rounded_rectangle((1240, 340, 1760, 760), radius=24, fill=(52, 96, 73))
    labels = ["Media", "People", "Workspace", "Routine"]
    for i, t in enumerate(labels):
        x = 1280 + (i % 2) * 240
        y = 400 + (i // 2) * 180
        d.rounded_rectangle((x, y, x + 200, y + 120), radius=18, fill=(68, 119, 92))
        d.text((x + 26, y + 42), t, font=get_font(30, True), fill=PALETTE["text"])

def icon_shift(d):
    d.rounded_rectangle((1240, 360, 1760, 760), radius=24, fill=(53, 98, 76))
    d.text((1300, 470), "- NEGATIVE INPUT", font=get_font(36, True), fill=PALETTE["warn"])
    d.text((1300, 560), "+ CLARITY INPUT", font=get_font(36, True), fill=PALETTE["good"])

def icon_integration(d):
    d.ellipse((1300, 400, 1500, 600), fill=(67, 122, 93))
    d.ellipse((1460, 400, 1660, 600), fill=(67, 122, 93))
    d.ellipse((1380, 540, 1580, 740), fill=(67, 122, 93))
    d.text((1352, 488), "Habit", font=get_font(30, True), fill=PALETTE["text"])
    d.text((1495, 488), "View", font=get_font(30, True), fill=PALETTE["text"])
    d.text((1450, 620), "Context", font=get_font(30, True), fill=PALETTE["text"])

def icon_closing(d):
    for i, x in enumerate(range(1250, 1760, 95)):
        c = [PALETTE["accent"], PALETTE["good"], PALETTE["warn"]][i % 3]
        d.line((x, 300, x - 28, 420), fill=c, width=6)
    d.rounded_rectangle((1360, 560, 1660, 740), radius=34, fill=(84, 138, 98))
    d.text((1408, 620), "STABLE", font=get_font(54, True), fill=(242, 252, 245))

icons = {
    "overview": icon_overview,
    "purpose": icon_purpose,
    "gratitude": icon_gratitude,
    "reward": icon_reward,
    "perspective": icon_perspective,
    "reframe": icon_reframe,
    "environment": icon_environment,
    "shift": icon_shift,
    "integration": icon_integration,
    "closing": icon_closing,
}

for i, (label, title, body, kind) in enumerate(slides, 1):
    im = bg().convert("RGBA")
    d = ImageDraw.Draw(im)

    d.rounded_rectangle((70, 70, 1180, 1000), radius=34, fill=PALETTE["panel"], outline=(93, 137, 111), width=3)
    d.rounded_rectangle((110, 110, 390, 170), radius=18, fill=(56, 103, 78), outline=PALETTE["accent"], width=2)
    d.text((132, 124), label, font=get_font(30, True), fill=PALETTE["accent"])
    d.multiline_text((110, 225), textwrap.fill(title, width=30), font=get_font(62, True), fill=PALETTE["text"], spacing=14)
    d.multiline_text((110, 505), textwrap.fill(body, width=46), font=get_font(40), fill=PALETTE["muted"], spacing=16)

    d.line((110, 955, 1140, 955), fill=(95, 142, 116), width=3)
    d.text((110, 970), "Vialifecoach Academy", font=get_font(28, True), fill=PALETTE["accent"])
    d.text((1000, 970), f"{i}/10", font=get_font(28), fill=PALETTE["muted"])

    d.rounded_rectangle((1200, 270, 1820, 810), radius=36, fill=(52, 96, 73), outline=(98, 142, 116), width=4)
    icons[kind](d)

    draw_logo(im)
    im.convert("RGB").save(OUT / f"slide{i:02d}.png", quality=95)

print(f"Generated {len(slides)} Module 5 slides at {OUT}")
