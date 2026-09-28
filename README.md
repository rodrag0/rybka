# Rybka

An unnecessarily technical website for missing someone who is literally one building away.

The experience starts as a terminal investigation, reconstructs Lisa's portrait from rising binary, and ends with a pair of appropriately unserious response buttons.

## Run locally

The portrait is loaded from a same-origin HTML asset, so serve the folder instead of opening `index.html` directly:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Project structure

```text
index.html
css/default.css
js/matrix-reveal.js
js/interactions.js
assets/binary-portrait.html
```

The site has no package manager, build step, framework, jQuery dependency, or external CDN dependency. It is suitable for GitHub Pages.

## Accessibility

- Keyboard-accessible response paths.
- Visible focus states.
- Skip-intro and pause-digits controls.
- A reduced-motion version that skips the streaming reveal.
- Decorative canvas and portrait glyphs are hidden from screen readers while the meaningful text remains available.
