import wave
from pathlib import Path

audio_path = Path(r"C:\Users\Admin\Desktop\vialifecoach frontend\vialifecoach-frontend\public\videos\module2\identifying-personal-thinking-patterns.wav")
slides_dir = Path(r"C:\Users\Admin\Desktop\vialifecoach frontend\vialifecoach-frontend\public\videos\module2\slides")
out_path = Path(r"C:\Users\Admin\Desktop\vialifecoach frontend\vialifecoach-frontend\scripts\module2_slides_concat.txt")

slides = sorted(slides_dir.glob("slide*.png"))
if not slides:
    raise SystemExit("No slides found")

with wave.open(str(audio_path), "rb") as wf:
    duration = wf.getnframes() / float(wf.getframerate())

per_slide = max(3.0, duration / len(slides))
lines = []
for s in slides:
    lines.append(f"file '{s.as_posix()}'")
    lines.append(f"duration {per_slide:.4f}")
lines.append(f"file '{slides[-1].as_posix()}'")
out_path.write_text("\n".join(lines) + "\n", encoding="ascii")
print(f"audio_duration={duration:.2f}s slides={len(slides)} per_slide={per_slide:.2f}s")
