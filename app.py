from __future__ import annotations

import mimetypes
from pathlib import Path
from urllib.parse import unquote


SITE_DIR = Path(__file__).parent / "site"


def _safe_path(request_path: str) -> Path:
    relative_path = request_path.lstrip("/")
    if not relative_path or request_path.endswith("/"):
        relative_path = f"{relative_path}/index.html" if relative_path else "index.html"

    candidate = (SITE_DIR / relative_path).resolve()
    site_root = SITE_DIR.resolve()

    if site_root not in candidate.parents and candidate != site_root:
        return site_root / "index.html"

    if candidate.is_dir():
        candidate = candidate / "index.html"

    if not candidate.exists() and not candidate.suffix:
        fallback = candidate.parent / f"{candidate.name}.html"
        if fallback.exists():
            return fallback

    return candidate


def app(environ, start_response):
    request_path = unquote(environ.get("PATH_INFO", "/"))
    file_path = _safe_path(request_path)

    if not file_path.exists():
        file_path = SITE_DIR / "index.html"

    try:
        body = file_path.read_bytes()
        content_type = mimetypes.guess_type(file_path.name)[0] or "application/octet-stream"
        start_response("200 OK", [("Content-Type", content_type)])
        return [body]
    except FileNotFoundError:
        start_response("404 Not Found", [("Content-Type", "text/plain; charset=utf-8")])
        return [b"Not Found"]