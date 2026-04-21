import wave
from pathlib import Path
import sys

if len(sys.argv) != 4:
    raise SystemExit("usage: build_concat.py <audio.wav> <slides_dir> <out_txt>")

audio_path = Path(sys.argv[1])
slides_dir = Path(sys.argv[2])
out_path = Path(sys.argv[3])
slides = sorted(slides_dir.glob('slide*.png'))
if not slides:
    raise SystemExit('No slides found')

with wave.open(str(audio_path), 'rb') as wf:
    duration = wf.getnframes() / float(wf.getframerate())

per_slide = max(3.0, duration / len(slides))
lines = []
for s in slides:
    lines.append(f"file '{s.as_posix()}'")
    lines.append(f"duration {per_slide:.4f}")
lines.append(f"file '{slides[-1].as_posix()}'")
out_path.write_text("\n".join(lines) + "\n", encoding='ascii')
print(f"audio_duration={duration:.2f}s slides={len(slides)} per_slide={per_slide:.2f}s")
