/* ---------- TREE BUILDER ---------- */

function buildTree(data) {
    const ul = document.createElement("ul");

    Object.entries(data).forEach(([name, children]) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <a href="javascript:void(0);">
                <div class="member-view-box">
                    <div class="member-image">
                        <img src="notFound.png" alt="Member">
                        <div class="member-details">
                            <h3>${name}</h3>
                        </div>
                    </div>
                </div>
            </a>
        `;

        if (Array.isArray(children) && children.length) {
            const childUl = document.createElement("ul");
            children.forEach(child => {
                childUl.innerHTML += `
                    <li>
                        <a href="javascript:void(0);">
                            <div class="member-view-box">
                                <div class="member-image">
                                    <img src="notFound.png">
                                    <div class="member-details">
                                        <h3>${child}</h3>
                                    </div>
                                </div>
                            </div>
                        </a>
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

/* ---------- EXPAND / COLLAPSE (CENTER PRESERVED) ---------- */

document.addEventListener("click", function (e) {
    const card = e.target.closest(".member-view-box");
    if (!card) return;

    const li = card.closest("li");
    const childUl = li.querySelector(":scope > ul");
    if (!childUl) return;

    const container = document.querySelector(".genealogy-scroll");

    const prevScrollLeft = container.scrollLeft;
    const prevScrollTop = container.scrollTop;
    const prevWidth = container.scrollWidth;
    const prevHeight = container.scrollHeight;

    // Toggle
    childUl.style.display =
        childUl.style.display === "none" ? "flex" : "none";

    // Maintain center
    requestAnimationFrame(() => {
        const newWidth = container.scrollWidth;
        const newHeight = container.scrollHeight;

        container.scrollLeft =
            prevScrollLeft + (newWidth - prevWidth) / 2;
        container.scrollTop =
            prevScrollTop + (newHeight - prevHeight) / 2;
    });

    e.stopPropagation();
});

/* ---------- PINCH + TOUCHPAD ZOOM ---------- */

let scale = 1;
let lastScale = 1;
let startDistance = 0;
let isPinching = false;

const zoomWrapper = document.getElementById("zoom-wrapper");

function getDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
}

/* Mobile pinch */
zoomWrapper.addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) {
        isPinching = true;
        startDistance = getDistance(e.touches);
        lastScale = scale;
    }
});

zoomWrapper.addEventListener("touchmove", (e) => {
    if (!isPinching || e.touches.length !== 2) return;

    e.preventDefault();

    scale = lastScale * (getDistance(e.touches) / startDistance);
    scale = Math.min(Math.max(scale, 0.4), 3);

    zoomWrapper.style.transform = `scale(${scale})`;
});

zoomWrapper.addEventListener("touchend", () => {
    isPinching = false;
});

/* Laptop touchpad pinch */
zoomWrapper.addEventListener("wheel", (e) => {
    if (!e.ctrlKey) return;

    e.preventDefault();

    scale += e.deltaY < 0 ? 0.1 : -0.1;
    scale = Math.min(Math.max(scale, 0.4), 3);

    zoomWrapper.style.transform = `scale(${scale})`;
}, { passive: false });
