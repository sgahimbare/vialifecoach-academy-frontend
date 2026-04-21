from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
import textwrap

BASE = Path(r"C:\Users\Admin\Desktop\vialifecoach frontend\vialifecoach-frontend\public\videos")
OUT = BASE / "module4" / "slides"
OUT.mkdir(parents=True, exist_ok=True)
logo_path = BASE / "assets" / "vialife-logo.png"

W, H = 1920, 1080
PALETTE = {
    "bg1": (28, 18, 12),
    "bg2": (52, 34, 18),
    "panel": (66, 43, 24),
    "accent": (214, 170, 62),
    "text": (244, 246, 249),
    "muted": (205, 197, 184),
    "good": (96, 195, 144),
    "warn": (226, 129, 104),
}

slides = [
    ("Module 4", "Rewiring for Positivity", "From awareness to intervention through structured cognitive correction.", "overview"),
    ("Transition", "Recognition is not enough", "Negative patterns change through deliberate interruption and repetition.", "transition"),
    ("Step 1", "Interrupt", "Create space between stimulus and reaction. Label thought as thought.", "interrupt"),
    ("Step 2", "Question", "Test evidence. Challenge certainty. Separate assumption from fact.", "question"),
    ("Step 3", "Replace", "Use balanced, proportionate alternatives grounded in evidence.", "replace"),
    ("Principle", "Correction, not forced optimism", "The goal is disciplined accuracy, not emotional denial.", "balance"),
    ("Neuroplasticity", "The brain strengthens rehearsal", "Repeated balanced thinking rewires interpretive default pathways.", "brain"),
    ("Systemization", "Systems beat motivation", "Embed intervention into routines to reduce willpower dependence.", "system"),
    ("Outcomes", "Escalation shortens, recovery accelerates", "Decision quality improves under stress and complexity.", "outcome"),
    ("Closing", "Intentional cognitive control", "Intervention becomes real-time, deliberate, and sustainable.", "closing"),
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
    d.rounded_rectangle((1260, 350, 1760, 760), radius=30, fill=(88, 56, 31), outline=PALETTE["accent"], width=5)
    d.text((1360, 500), "M4", font=get_font(118, True), fill=PALETTE["accent"])

def icon_transition(d):
    d.rounded_rectangle((1260, 390, 1760, 700), radius=24, fill=(86, 57, 38))
    d.text((1335, 500), "AWARE -> ACT", font=get_font(56, True), fill=PALETTE["text"])

def icon_interrupt(d):
    d.ellipse((1310, 380, 1710, 780), outline=PALETTE["accent"], width=8)
    d.rectangle((1460, 490, 1500, 670), fill=PALETTE["text"])
    d.rectangle((1540, 490, 1580, 670), fill=PALETTE["text"])

def icon_question(d):
    d.rounded_rectangle((1260, 350, 1760, 760), radius=26, fill=(84, 59, 41))
    d.text((1340, 470), "EVIDENCE?", font=get_font(58, True), fill=PALETTE["text"])
    d.text((1340, 560), "CERTAIN?", font=get_font(58, True), fill=PALETTE["accent"])

def icon_replace(d):
    d.rounded_rectangle((1260, 380, 1760, 730), radius=30, fill=(82, 58, 39))
    d.text((1330, 500), "DISTORTION", font=get_font(44, True), fill=PALETTE["warn"])
    d.text((1515, 500), "->", font=get_font(48, True), fill=PALETTE["text"])
    d.text((1330, 585), "BALANCED VIEW", font=get_font(44, True), fill=PALETTE["good"])

def icon_balance(d):
    d.line((1280, 680, 1720, 680), fill=PALETTE["muted"], width=8)
    d.line((1500, 420, 1500, 680), fill=PALETTE["muted"], width=8)
    d.line((1320, 530, 1680, 530), fill=PALETTE["accent"], width=8)

def icon_brain(d):
    d.ellipse((1280, 340, 1740, 780), fill=(100, 86, 139), outline=(214, 205, 233), width=6)
    for y in [430, 530, 630]:
        d.arc((1360, y-70, 1660, y+70), 180, 360, fill=(223, 215, 241), width=5)

def icon_system(d):
    d.rounded_rectangle((1240, 340, 1760, 760), radius=24, fill=(82, 58, 40))
    for i, y in enumerate([430, 530, 630]):
        d.rounded_rectangle((1300, y, 1700, y+70), radius=18, fill=(98, 70, 48))
        d.text((1330, y+18), ["Daily Log", "Pause Prompt", "Review Loop"][i], font=get_font(34, True), fill=PALETTE["text"])

def icon_outcome(d):
    d.rounded_rectangle((1240, 340, 1760, 760), radius=24, fill=(84, 60, 41))
    d.text((1310, 450), "ESCALATION", font=get_font(38, True), fill=PALETTE["warn"])
    d.text((1540, 450), "DOWN", font=get_font(38, True), fill=PALETTE["good"])
    d.text((1310, 560), "RECOVERY", font=get_font(38, True), fill=PALETTE["text"])
    d.text((1540, 560), "UP", font=get_font(38, True), fill=PALETTE["good"])

def icon_closing(d):
    for i, x in enumerate(range(1250, 1760, 95)):
        c = [PALETTE["accent"], PALETTE["good"], PALETTE["warn"]][i % 3]
        d.line((x, 300, x - 28, 420), fill=c, width=6)
    d.rounded_rectangle((1360, 560, 1660, 740), radius=34, fill=(89, 130, 90))
    d.text((1388, 620), "CONTROL", font=get_font(54, True), fill=(242, 252, 245))

icons = {
    "overview": icon_overview,
    "transition": icon_transition,
    "interrupt": icon_interrupt,
    "question": icon_question,
    "replace": icon_replace,
    "balance": icon_balance,
    "brain": icon_brain,
    "system": icon_system,
    "outcome": icon_outcome,
    "closing": icon_closing,
}

for i, (label, title, body, kind) in enumerate(slides, 1):
    im = bg().convert("RGBA")
    d = ImageDraw.Draw(im)

    d.rounded_rectangle((70, 70, 1180, 1000), radius=34, fill=PALETTE["panel"], outline=(124, 96, 70), width=3)
    d.rounded_rectangle((110, 110, 390, 170), radius=18, fill=(96, 67, 44), outline=PALETTE["accent"], width=2)
    d.text((132, 124), label, font=get_font(30, True), fill=PALETTE["accent"])
    d.multiline_text((110, 225), textwrap.fill(title, width=30), font=get_font(64, True), fill=PALETTE["text"], spacing=14)
    d.multiline_text((110, 505), textwrap.fill(body, width=46), font=get_font(41), fill=PALETTE["muted"], spacing=16)

    d.line((110, 955, 1140, 955), fill=(130, 102, 76), width=3)
    d.text((110, 970), "Vialifecoach Academy", font=get_font(28, True), fill=PALETTE["accent"])
    d.text((1000, 970), f"{i}/10", font=get_font(28), fill=PALETTE["muted"])

    d.rounded_rectangle((1200, 270, 1820, 810), radius=36, fill=(73, 54, 37), outline=(124, 100, 76), width=4)
    icons[kind](d)

    draw_logo(im)
    im.convert("RGB").save(OUT / f"slide{i:02d}.png", quality=95)

print(f"Generated {len(slides)} Module 4 slides at {OUT}")
