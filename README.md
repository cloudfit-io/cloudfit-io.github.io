# cloudfit-io.github.io

Source for the **cloudfit** landing page, published at **https://cloudfit-io.github.io** via GitHub Pages.

A static, single-page site introducing [`cloudfit-core`](https://github.com/cloudfit-io/cloudfit-core), a cloud-agnostic machine type scoring engine for computational and bioinformatics workloads. No build step, no framework: plain HTML/CSS/JS.

## Structure

```
index.html        Markup
styles/main.css    All styles
scripts/main.js    Archetype data + interactions (no external JS deps)
```

## Local preview

Open `index.html` directly in a browser, or serve it (recommended, mirrors how Pages serves it):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Editing notes

- Styles live in `styles/main.css`; the color palette is defined as CSS custom properties in the `:root` block at the top.
- The interactive archetype panel is driven by the `ARCHETYPES` array in `scripts/main.js`.
- `scripts/main.js` is loaded with `defer`, so inline `onclick` handlers resolve after the DOM is parsed.

## Deployment

Pushing to the default branch publishes automatically via GitHub Pages. No workflow or build required.

## Links

- Library: https://github.com/cloudfit-io/cloudfit-core
- PyPI: https://pypi.org/project/cloudfit-core/

## License

Apache 2.0 · built by Chaitanya Krishna Kasaraneni
