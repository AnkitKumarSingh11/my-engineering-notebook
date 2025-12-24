
# Byte-Sized Notes

Personal engineering notes and blog posts published using MkDocs + Material.

## Sections

Content lives under `docs/` and is organized by topic:

- `docs/apache-spark/`
- `docs/pyspark/`
- `docs/big-data-engineering/`
- `docs/system-design/`
- `docs/java/`
- `docs/python/`

## Writing a new post

Add a new Markdown file under the relevant section folder, for example:

- `docs/apache-spark/my-new-post.md`

Navigation is generated from the folder structure, so the post will show up in the sidebar under that section automatically.

## Local development

This repo uses `uv` to manage dependencies.

### Serve locally

```bash
uv run mkdocs serve
```

Then open the URL shown in the terminal (typically `http://127.0.0.1:8000/`).

### Build

```bash
uv run mkdocs build
```

## Configuration

Site configuration is in `mkdocs.yml`.

