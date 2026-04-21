(function () {
    var mount = document.getElementById("site-header");
    if (!mount) {
        return;
    }

    var loaderScript = document.querySelector("script[data-header-loader]");
    var prefix = loaderScript && loaderScript.dataset.prefix ? loaderScript.dataset.prefix : "";
    var active = loaderScript && loaderScript.dataset.active ? loaderScript.dataset.active : "";
    var faviconPath = loaderScript && loaderScript.dataset.favicon ? loaderScript.dataset.favicon : "images/favicon.png";

    // Keep one favicon source managed from this shared loader.
    var iconHref = prefix + faviconPath;
    var iconSelectors = 'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]';
    var existingIcons = document.head.querySelectorAll(iconSelectors);
    if (existingIcons.length) {
        existingIcons.forEach(function (icon) {
            icon.setAttribute("href", iconHref);
        });
    } else {
        var icon = document.createElement("link");
        icon.setAttribute("rel", "icon");
        icon.setAttribute("type", "image/png");
        icon.setAttribute("href", iconHref);
        document.head.appendChild(icon);
    }

    function mountHeader(html) {
        mount.innerHTML = html;

        var links = mount.querySelectorAll("[data-path]");
        links.forEach(function (link) {
            var path = link.getAttribute("data-path") || "";
            link.setAttribute("href", prefix + path);
        });

        if (active) {
            var activeLink = mount.querySelector('[data-nav="' + active + '"]');
            if (activeLink) {
                activeLink.classList.add("active");
            }
        }
    }

    if (window.SITE_HEADER_TEMPLATE) {
        mountHeader(window.SITE_HEADER_TEMPLATE);
        return;
    }

    fetch(prefix + "partials/site-header.html")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Failed to load shared header");
            }
            return response.text();
        })
        .then(function (html) {
            mountHeader(html);
        })
        .catch(function (error) {
            console.error(error);
        });
})();
