/* ---------- TREE BUILDER ---------- */

function buildTree(data) {
    const ul = document.createElement("ul");

    Object.entries(data).forEach(([name, children]) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <div class="member-view-box">
                <div class="member-image">
                    <img src="notFound.png">
                </div>
                <div class="member-details">
                    <h3>${name}</h3>
                </div>
            </div>
        `;

        if (Array.isArray(children) && children.length) {
            const childUl = document.createElement("ul");
            children.forEach(child => {
                childUl.innerHTML += `
                    <li>
                        <div class="member-view-box">
                            <div class="member-image">
                                <img src="notFound.png">
                            </div>
                            <div class="member-details">
                                <h3>${child}</h3>
                            </div>
                        </div>
                    </li>
                `;
            });
            li.appendChild(childUl);
        }
        else if (typeof children === "object") {
            li.appendChild(buildTree(children));
        }

        ul.appendChild(li);
    });

    return ul;
}

/* ---------- EXPAND / COLLAPSE ---------- */

document.addEventListener("click", function (e) {
    const card = e.target.closest(".member-view-box");
    if (!card) return;

    const li = card.closest("li");
    const directChild = li.querySelector(":scope > ul");
    if (!directChild) return;

    const isCollapsed =
        directChild.style.display === "none" || !directChild.style.display;

    // 🔹 Collapse everything under this node
    li.querySelectorAll("ul").forEach(ul => {
        ul.style.display = "none";
    });

    // 🔹 Expand ONLY immediate children
    if (isCollapsed) {
        directChild.style.display = "block";
    }

    e.stopPropagation();
});


/* ---------- ZOOM (DESKTOP ONLY) ---------- */

if (window.innerWidth > 768) {
    let scale = 1;
    const zoomWrapper = document.getElementById("zoom-wrapper");

    zoomWrapper.addEventListener("wheel", (e) => {
        if (!e.ctrlKey) return;
        e.preventDefault();

        scale += e.deltaY < 0 ? 0.1 : -0.1;
        scale = Math.min(Math.max(scale, 0.5), 3);
        zoomWrapper.style.transform = `scale(${scale})`;
    }, { passive: false });
}
