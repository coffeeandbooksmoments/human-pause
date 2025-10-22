
Human Pause — a moment of calm / trenutak mira

Files in this package:
- index.html        : single-page web app (open locally or host)
- style.css         : styling (beige-gray minimal)
- script.js         : main logic (quotes, WebAudio ambient synth, breathing guide)
- assets/favicon.svg: realistic espresso cup SVG (used as favicon)
- README.txt        : this file

How to use locally:
1. Download the folder and open index.html in Chrome or Edge (best audio support).
2. Click "Take a Pause / Napravi pauzu". A 30s pause will start with a random ambient sound.
3. Use "Breathing Guide / Vođeno disanje" for spoken breathing prompts (uses browser speechSynthesis).

How to host on GitHub Pages:
1. Create a new public GitHub repo.
2. Upload all files preserving the folder structure (assets/ folder included).
3. Rename index.html to index.html (already named) and enable Pages from the main branch.
4. Your page will appear at https://<username>.github.io/<repo>/

How to host on Vercel:
1. Create a new Vercel project and point it to your GitHub repo, or drag & drop this folder in Vercel.
2. Deploy — Vercel will provide a live URL.

Notes & credits:
- Ambient sounds are synthesized in-browser using WebAudio for permissive usage (no external audio files).
- You can replace favicon.svg with a .ico if you prefer (optional).
- Optional: to use a custom domain, configure GitHub Pages or Vercel DNS settings.
- By default the app displays English and Serbian labels; you can edit text in index.html and script.js.
- Credit optional: by Coffee & Books Moments ☕
