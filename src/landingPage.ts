/*
 * The landing page shown before any fields are bound.
 *
 * This used to be three ~10KB HTML documents under style/, pulled in with
 * raw-loader and dropped into the DOM with innerHTML. They were byte-identical
 * apart from a title, a bullet list and which progress dot was filled -- and
 * raw innerHTML both fails powerbi-visuals/no-inner-outer-html and blocks
 * AppSource certification. The shared stylesheet now lives in visual.less
 * scoped under .landing-page-container; what varies is the data below.
 */

export interface LandingButton {
    /** Read back off the element by the navigation handler. */
    action: "back" | "next" | "finish";
    label: string;
}

export interface LandingPageContent {
    title: string;
    subtitle: string;
    bullets: string[];
    buttons: LandingButton[];
}

export const LANDING_PAGES: LandingPageContent[] = [
    {
        title: "Welcome",
        subtitle: "Welcome to the Nova Matrix - A powerful matrix visualization tool",
        bullets: [],
        buttons: [{ action: "next", label: "Next" }],
    },
    {
        title: "Features",
        subtitle: "Nova Matrix offers powerful features for your data",
        bullets: [
            "Highly customizable styling and formatting",
            "Interactive expand/collapse functionality",
            "Advanced subtotal calculations",
            "Dynamic row and column sizing",
            "Smart context menu for quick actions",
        ],
        buttons: [
            { action: "back", label: "Back" },
            { action: "next", label: "Next" },
        ],
    },
    {
        title: "Instructions",
        subtitle: "Begin presenting your data to viewers by:",
        bullets: [
            "Adding a Matrix visual to your report",
            "Configure the Rows, Columns, and Values fields",
            "Use the formatting panel to customize your matrix",
            "Enjoy the power of interactive data exploration!",
        ],
        buttons: [
            { action: "back", label: "Back" },
            { action: "finish", label: "Get Started" },
        ],
    },
];

/** `document.createElement` with the class set, which is most of what follows. */
function el<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    className?: string,
    text?: string
): HTMLElementTagNameMap[K] {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
}

/** The small rotated square that marks each bullet. */
function diamond(): HTMLElement {
    const outer = el("span", "diamond");
    outer.appendChild(el("span", "diamond-inner"));
    return outer;
}

/**
 * Builds one landing page.
 *
 * `pageNumber` is 1-based to match the rest of the visual; anything out of
 * range falls back to the first page rather than rendering an empty shell.
 */
export function buildLandingPage(pageNumber: number): HTMLElement {
    const index = (pageNumber >= 1 && pageNumber <= LANDING_PAGES.length)
        ? pageNumber - 1
        : 0;
    const page = LANDING_PAGES[index];

    const container = el("div", "container");

    // --- header: wordmark and progress dots ---
    const header = el("div", "header");
    const logo = el("div", "logo");
    logo.appendChild(el("div", null, "NOVA MATRIX"));
    header.appendChild(logo);

    const progress = el("div", "progress");
    for (let i = 0; i < LANDING_PAGES.length; i++) {
        progress.appendChild(el("div", i === index ? "progress-item active" : "progress-item"));
    }
    header.appendChild(progress);
    container.appendChild(header);

    // --- body ---
    const wrapper = el("div", "content-wrapper");
    wrapper.appendChild(el("h1", "main-title", page.title));

    const featureList = el("div", "feature-list");
    featureList.appendChild(el("p", "subtitle", page.subtitle));

    if (page.bullets.length) {
        const list = el("ul");
        for (const bullet of page.bullets) {
            const item = el("li");
            item.appendChild(diamond());
            // A text node rather than textContent, which would drop the diamond.
            item.appendChild(document.createTextNode(` ${bullet}`));
            list.appendChild(item);
        }
        featureList.appendChild(list);
    }
    wrapper.appendChild(featureList);

    // --- navigation ---
    // These were <a href="#">, which navigates and is not reachable by
    // keyboard in a meaningful way. Real buttons are both.
    const nav = el("div", "nav-buttons");
    for (const button of page.buttons) {
        const navButton = el("button", "nav-button");
        navButton.type = "button";
        navButton.setAttribute("data-action", button.action);

        const orbContainer = el("span", "button-orb-container");
        orbContainer.appendChild(el("span", "button-orb"));
        navButton.appendChild(orbContainer);
        navButton.appendChild(el("span", "continue-text", button.label));

        nav.appendChild(navButton);
    }
    wrapper.appendChild(nav);

    const footer = el("div", "footer");
    footer.appendChild(el("div", "credit", "Developed by Joshua Biondo"));
    wrapper.appendChild(footer);

    container.appendChild(wrapper);
    return container;
}
