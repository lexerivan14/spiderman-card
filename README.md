# Three Spider-Men — Setup & Instructions

A comic-style landing page with three "issue" cards (Tobey Maguire, Andrew
Garfield, Tom Holland). Hovering a card shows a floating video preview that
follows your cursor.

## 1. File structure

Your project folder needs to look **exactly** like this:

```
your-project-folder/
├── index.html
├── style.css
├── script.js
├── README.md          (this file)
└── media/
    ├── tobey.mp4
    ├── andrew.mp4
    └── tom.mp4
```

The `media` folder and the three `.mp4` files don't exist yet — you need to
create the folder and add your own video files. Names must match exactly
(lowercase, `.mp4` extension).

## 2. Adding your own videos

1. Create a folder named `media` (all lowercase, no spaces) next to
   `index.html`.
2. Put your three video files inside it, named:
   - `tobey.mp4`
   - `andrew.mp4`
   - `tom.mp4`
3. **The files must actually be `.mp4` (H.264) format** — renaming a
   `.webm`/`.mkv`/`.mov` file to end in `.mp4` does not convert it, and the
   browser will silently fail to play it. If your clip came from a video
   downloader, check its real format first (see Troubleshooting below).

If you want different filenames or a different folder, open `script.js` and
edit the `src` paths in the `eraContent` object near the top:

```javascript
const eraContent = {
    tobey:  { src: 'media/tobey.mp4',  caption: 'ISSUE #01 — 2002–2007' },
    andrew: { src: 'media/andrew.mp4', caption: 'ISSUE #02 — 2012–2014' },
    tom:    { src: 'media/tom.mp4',    caption: 'ISSUE #03 — 2016–Present' }
};
```

## 3. Running the site

Opening `index.html` by double-clicking it works in most browsers, but some
browsers restrict video playback when opened directly from disk (`file://`).
If videos don't load, run a local server instead:

**Option A — VS Code**
Install the "Live Server" extension, right-click `index.html` → "Open with
Live Server".

**Option B — Python** (already installed on most Macs/Linux; on Windows,
install Python first)
```bash
cd your-project-folder
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

## 4. Sound behavior

Browsers block videos from playing **with sound** automatically — a video
can only autoplay unmuted after the visitor has clicked somewhere on the
page. To work around this:

- Every preview starts **muted** so it always plays instantly on hover.
- The **first click anywhere** on the page unlocks sound.
- Every hover **after that first click** plays with audio.

This is expected behavior, not a bug — there's a note about it directly on
the page.

## 5. Customizing text

- **Headline (H1):** in `index.html`, look for `<h1 class="masthead-title">`.
- **Subtitle:** look for `<p class="masthead-sub">`.
- **Card labels/eras:** each `<article class="issue ...">` block has an
  `.issue-name` and `.issue-era` you can edit directly.

## 6. Troubleshooting checklist

If a hover preview stays blank:

1. Open the browser DevTools (F12) → **Console** tab, hover the card, and
   read the error.
2. Check the **Network** tab for a `404` — that means the file path is
   wrong or the file isn't where the code expects it.
3. Confirm the folder is named `media` exactly (not `Media`, not `medias`).
4. Confirm the file is a real `.mp4`, not a renamed `.webm`/`.mkv`.
5. Try running through a local server (see Section 3) instead of opening
   the file directly.

## 7. What I can't help source

I can't download or supply copyrighted movie clips on your behalf — you'll
need to provide your own video files legally (personal recordings, licensed
footage, etc.) for the previews to show real content.
