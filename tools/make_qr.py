"""Generate a print-ready QR code for the deployed Kitakits DVO landing page.

Usage:
    pip install "qrcode[pil]"
    python tools/make_qr.py https://your-permanent-site.vercel.app

Output: assets/qr-code.png  (1600x1600 px, black on white, error correction H,
with a 4-module quiet zone for reliable scanning in print).
"""
import sys
from pathlib import Path

import qrcode
from qrcode.constants import ERROR_CORRECT_H

BLOCKED = ("localhost", "127.0.0.1", "0.0.0.0")


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    url = sys.argv[1].strip()
    if not url.startswith("https://"):
        sys.exit("Use the full permanent https:// URL.")
    if any(b in url for b in BLOCKED):
        sys.exit("Refusing to encode a local address.")
    if "-git-" in url:
        print("Warning: this looks like a branch preview URL. Use your production URL.")

    qr = qrcode.QRCode(error_correction=ERROR_CORRECT_H, box_size=40, border=4)
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white").convert("RGB")
    img = img.resize((1600, 1600))
    out = Path(__file__).resolve().parent.parent / "assets" / "qr-code.png"
    img.save(out, dpi=(300, 300))
    print(f"Saved {out} for {url}")


if __name__ == "__main__":
    main()
