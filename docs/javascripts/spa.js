(function () {
    // Client-side SPA router for instant navigation without full page reloads

    function isInternalLink(link) {
        if (!link) return false;
        const href = link.getAttribute("href");
        if (
            !href ||
            href.startsWith("#") ||
            href.startsWith("http://") ||
            href.startsWith("https://") ||
            href.startsWith("//") ||
            href.startsWith("javascript:") ||
            href.startsWith("mailto:") ||
            link.target === "_blank" ||
            link.hasAttribute("download")
        ) {
            return false;
        }

        const targetUrl = new URL(link.href, window.location.href);
        return targetUrl.origin === window.location.origin;
    }

    document.addEventListener("click", function (e) {
        const link = e.target.closest("a");
        if (!isInternalLink(link)) return;

        const targetUrl = new URL(link.href, window.location.href);

        // If clicking an anchor link on current page
        if (targetUrl.pathname === window.location.pathname && targetUrl.hash) {
            return;
        }

        e.preventDefault();

        if (targetUrl.href === window.location.href) return;

        navigateTo(targetUrl.href, true);
    });

    window.addEventListener("popstate", function () {
        navigateTo(window.location.href, false);
    });

    async function navigateTo(url, push = true) {
        try {
            const res = await fetch(url);
            if (!res.ok) {
                window.location.href = url;
                return;
            }

            const html = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            const updateDOM = () => {
                // 1. Update page title
                document.title = doc.title;

                // 2. Update pushState URL before replacing DOM so relative paths resolve correctly
                if (push) {
                    window.history.pushState({}, "", url);
                }

                // 3. Replace body content
                const newInner = doc.getElementById("inner-body");
                const currentInner = document.getElementById("inner-body");

                if (newInner && currentInner) {
                    currentInner.innerHTML = newInner.innerHTML;
                }

                // 4. Scroll to top or anchor
                const hash = new URL(url).hash;
                if (hash) {
                    const targetEl = document.querySelector(hash);
                    if (targetEl) {
                        targetEl.scrollIntoView();
                    } else {
                        window.scrollTo(0, 0);
                    }
                } else {
                    window.scrollTo(0, 0);
                }

                // 5. Re-evaluate inline scripts in inner-body
                if (currentInner) {
                    const scripts = currentInner.querySelectorAll("script");
                    scripts.forEach((oldScript) => {
                        const newScript = document.createElement("script");
                        Array.from(oldScript.attributes).forEach((attr) =>
                            newScript.setAttribute(attr.name, attr.value)
                        );
                        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                        oldScript.parentNode.replaceChild(newScript, oldScript);
                    });
                }

                // 6. Re-trigger KaTeX math rendering if active
                if (typeof renderMathInElement === "function") {
                    renderMathInElement(document.body, {
                        delimiters: [
                            { display: true, left: "$$", right: "$$" },
                            { display: false, left: "$", right: "$" },
                            { display: false, left: "\\(", right: "\\)" },
                            { display: true, left: "\\[", right: "\\]" }
                        ]
                    });
                }

                // 7. Re-trigger Mermaid rendering if active
                if (window.mermaid && typeof window.mermaid.contentLoaded === "function") {
                    window.mermaid.contentLoaded();
                }
            };

            // Use browser's View Transitions API if supported for ultra smooth transition
            if (document.startViewTransition) {
                document.startViewTransition(updateDOM);
            } else {
                updateDOM();
            }
        } catch (err) {
            console.error("SPA routing error:", err);
            window.location.href = url;
        }
    }
})();
