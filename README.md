# FIFA World Cup Live
### Created by Mahdi

A simple, clean, fast live sports streaming website for FIFA World Cup matches.

**Live, production-ready. Pure HTML/CSS/JS – works perfectly on GitHub Pages. Zero build step. Zero server.**

Demo: Open `index.html` → click any live match → watch instantly.

---

## Features

- ⚡ **Fast & lightweight** – No frameworks, ~20KB total
- 🎥 **Smooth HLS playback** – HLS.js with low-latency mode, auto quality
- 🔄 **Auto-retry** – Reconnects automatically if stream drops (10 tries)
- 📱 **100% mobile responsive**
- 🌙 **Clean dark theme** – Black + Neon Green
- 🖥️ **Big cinematic player** – 1280px, fullscreen, PiP
- ⏳ **Loading spinner** – Green glowing loader
- Supports 3 stream types:
  1. **YouTube Live**
  2. **HLS / m3u8**
  3. **Any iframe embed**
- Schedule page with Bangladesh Time (BST, UTC+6)
- SEO + OG tags, favicon, 404 page

## Live Demo Files

All files are in the repo root – ready to deploy:

```
index.html       → Homepage – today's live matches
watch.html       → Video player page (big, smooth, auto-retry)
schedule.html    → Full match schedule – BST
style.css        → All styles – dark theme
player.js        → HLS.js + Plyr.js player logic
matches.js       → Match & stream data – EDIT THIS FILE
favicon.svg      → Site icon
404.html         → GitHub Pages 404 page
.nojekyll        → Tells GitHub Pages to serve files as-is
README.md        → This file
```

That’s it. 9 files total.

## How to Change Stream Links

**All matches are in one place: `matches.js`**

Open `matches.js` and edit:

```js
{
  id: "wc1",              // unique id → watch.html?id=wc1
  home: "Argentina",
  away: "Brazil",
  competition: "FIFA World Cup",
  time: "2026-06-21T00:00:00+06:00",  // Bangladesh Time
  status: "live",         // "live" or "upcoming"
  
  // --- STREAM ---
  type: "hls",            // "youtube" | "hls" | "iframe"
  src: "https://your-stream-url.m3u8"
}
```

### 1. HLS / m3u8
```js
type: "hls",
src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
```

### 2. YouTube Live
Use the embed URL:
```js
type: "youtube",
src: "https://www.youtube.com/embed/VIDEO_ID?autoplay=1"
```

### 3. Iframe Embed
```js
type: "iframe",
src: "https://example.com/embed/123"
```

**To show "Watch Live" on the homepage:**  
Set `status: "live"` and add a valid `src`.

For upcoming matches, leave `src: ""` and `status: "upcoming"`.

Times auto-format to Bangladesh Standard Time (BST).

### Tested working HLS URLs
- `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`
- `https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8`
- `https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8`
- Live test: `https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8`

## Deploy to GitHub Pages – 2 minutes

1. Create a new GitHub repository, e.g. `fifa-live`
2. Upload **all files** in this folder to the repo root
3. Go to: **Repo Settings → Pages**
4. **Source:** Deploy from a branch
   **Branch:** `main` / `(root)`
5. Save. Wait ~1 min.

Your site will be live at:  
`https://yourusername.github.io/fifa-live/`

No build. No npm. Works instantly.

GitHub Pages notes:
- `404.html` is included for clean 404s
- `.nojekyll` is included so files like `_something` won't be ignored
- All paths are relative, works in a subfolder automatically

### Custom domain (optional)
Repo Settings → Pages → Custom domain → add your domain → Save. Add a CNAME DNS record pointing to `yourusername.github.io`.

## Tech Stack

- Pure HTML + CSS + JavaScript
- [HLS.js 1.5.8](https://github.com/video-dev/hls.js/) – smooth m3u8
- [Plyr.js 3.7.8](https://plyr.io/) – beautiful player UI
- Inter font – Google Fonts
- 100% static – GitHub Pages friendly

## Browser Support

Chrome, Firefox, Edge, Safari, Opera – Desktop & Mobile.  
iOS Safari uses native HLS (auto fallback).

---

**Created by Mahdi**  
FIFA World Cup Live • 2026
