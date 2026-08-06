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

    // Top Progress Bar & Loader Elements Management
    let progressBar = null;
    let progressTimer = null;
    let currentAbortController = null;
    let activeLink = null;

    function createLoaderElements() {
        if (!progressBar || !document.getElementById("spa-progress-bar")) {
            progressBar = document.createElement("div");
            progressBar.id = "spa-progress-bar";
            progressBar.className = "spa-progress-bar";
            document.body.appendChild(progressBar);
        }
    }

    function startLoading(targetLink) {
        createLoaderElements();

        // 1. Reset progress bar
        if (progressTimer) clearInterval(progressTimer);
        progressBar.style.opacity = "1";
        progressBar.style.width = "0%";
        progressBar.classList.remove("completed");

        let progress = 15;
        progressBar.style.width = progress + "%";

        progressTimer = setInterval(() => {
            if (progress < 75) {
                progress += Math.random() * 12 + 4;
            } else if (progress < 92) {
                progress += Math.random() * 2 + 0.5;
            }
            progressBar.style.width = progress + "%";
        }, 100);

        // 2. Dim content & add loading indicator to inner-body
        const innerBody = document.getElementById("inner-body");
        if (innerBody) {
            innerBody.classList.add("spa-content-loading");

            if (!document.getElementById("spa-loader-badge")) {
                const badge = document.createElement("div");
                badge.id = "spa-loader-badge";
                badge.className = "spa-loader-badge";
                badge.innerHTML = `
                    <div class="spa-spinner"></div>
                    <span>Loading post...</span>
                `;
                innerBody.appendChild(badge);
            }
        }

        // 3. Mark active clicked link
        if (targetLink) {
            if (activeLink) activeLink.classList.remove("spa-link-loading");
            activeLink = targetLink;
            activeLink.classList.add("spa-link-loading");
        }
    }

    function stopLoading() {
        if (progressTimer) {
            clearInterval(progressTimer);
            progressTimer = null;
        }

        if (progressBar) {
            progressBar.style.width = "100%";
            setTimeout(() => {
                progressBar.style.opacity = "0";
                setTimeout(() => {
                    progressBar.style.width = "0%";
                }, 300);
            }, 150);
        }

        const innerBody = document.getElementById("inner-body");
        if (innerBody) {
            innerBody.classList.remove("spa-content-loading");
            const badge = document.getElementById("spa-loader-badge");
            if (badge) badge.remove();
        }

        if (activeLink) {
            activeLink.classList.remove("spa-link-loading");
            activeLink = null;
        }
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

        navigateTo(targetUrl.href, true, link);
    });

    window.addEventListener("popstate", function () {
        navigateTo(window.location.href, false);
    });

    async function navigateTo(url, push = true, clickedLink = null) {
        if (currentAbortController) {
            currentAbortController.abort();
        }
        currentAbortController = new AbortController();
        const signal = currentAbortController.signal;

        startLoading(clickedLink);

        try {
            const res = await fetch(url, { signal });
            if (!res.ok) {
                stopLoading();
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
                    currentInner.classList.add("spa-content-fade-in");
                    setTimeout(() => currentInner.classList.remove("spa-content-fade-in"), 400);
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
                await document.startViewTransition(updateDOM).finished;
            } else {
                updateDOM();
            }

            stopLoading();
        } catch (err) {
            if (err.name === "AbortError") {
                return;
            }
            console.error("SPA routing error:", err);
            stopLoading();
            window.location.href = url;
        }
    }
})();
