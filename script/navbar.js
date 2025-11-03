document.addEventListener("DOMContentLoaded", () => {
    const navbarContainer = document.getElementById("navbar");
    if (!navbarContainer) return;

    const inHtmlFolder = window.location.pathname.includes("/html/");
    const fetchPrefix = inHtmlFolder ? "../" : "./";

    fetch(fetchPrefix + "navbar.html")
        .then(res => res.text())
        .then(html => {
            navbarContainer.innerHTML = html;

            // Adjust links relative to folder depth
            const linkPrefix = inHtmlFolder ? "../" : "";
            navbarContainer.querySelectorAll("a").forEach(a => {
                const href = a.getAttribute("href");
                if (href.startsWith("html/") || href === "index.html") {
                    a.setAttribute("href", linkPrefix + href);
                }
            });

            // Highlight the active page
            const currentPath = window.location.pathname.split("/").pop();
            navbarContainer.querySelectorAll("a").forEach(a => {
                if (a.getAttribute("href").endsWith(currentPath)) {
                    a.classList.add("active");
                }
            });
        })
        .catch(err => console.error("Navbar load error:", err));
});
