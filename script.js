const languages = [
    {
        name: "HTML",
        image: "html.png",
        created: "سنة 1991",
        creator: "تيم برنرز لي",
        uses: "بناء هيكل صفحات الويب وتنسيق المحتوى داخل المواقع.",
        wikipedia: "https://simple.wikipedia.org/wiki/HTML"
    },
    {
        name: "CSS",
        image: "css.png",
        created: "سنة 1996",
        creator: "هاكون ويوم لي",
        uses: "تنسيق شكل الموقع، الألوان، المسافات، والتجاوب مع الشاشات.",
        wikipedia: "https://simple.wikipedia.org/wiki/Cascading_Style_Sheets"
    },
    {
        name: "Lua",
        image: "lua.png",
        created: "سنة 1993",
        creator: "روبرتو ييروزاليم وآخرون",
        uses: "تُستخدم في الألعاب والسكريبتات والأنظمة المدمجة، وتنتشر في Roblox وWorld of Warcraft.",
        wikipedia: "https://simple.wikipedia.org/wiki/Lua"
    },
    {
        name: "Python",
        image: "python.png",
        created: "سنة 1991",
        creator: "غييدو فان روسم",
        uses: "الذكاء الاصطناعي، الأتمتة، تطوير الويب، وتحليل البيانات.",
        wikipedia: "https://simple.wikipedia.org/wiki/Python_(programming_language)"
    },
    {
        name: "++C",
        image: "cpp.png",
        created: "سنة 1985",
        creator: "بيارن ستروستروب",
        uses: "الألعاب، البرمجيات عالية الأداء، والمحركات والأنظمة الكبيرة.",
        wikipedia: "https://simple.wikipedia.org/wiki/C%2B%2B"
    }
];

const languagesGrid = document.getElementById("languagesGrid");
const certificatesGrid = document.getElementById("certificatesGrid");
const certificatesStatus = document.getElementById("certificatesStatus");
const modal = document.getElementById("infoModal");
const modalBody = document.getElementById("modalBody");
const backToTop = document.getElementById("backToTop");
const ProBut = document.getElementById("ProBut");

function openModal(content) {
    modalBody.innerHTML = content;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    modalBody.innerHTML = "";
    document.body.style.overflow = "";
}

function renderLanguages() {
    languagesGrid.innerHTML = languages
        .map((lang) => `
            <article class="lang-card">
                <img class="lang-image" src="${lang.image}" alt="${lang.name}">
                <div class="lang-content">
                    <h3>${lang.name}</h3>
                    <p>${lang.uses}</p>
                    <button type="button" class="lang-info-btn" onclick="window.open('${lang.wikipedia}', '_blank', 'noopener')">المزيد من المعلومات</button>
                </div>
            </article>
        `)
        .join("");
}

function renderCertificates(certificates) {
    if (!certificates.length) {
        certificatesGrid.innerHTML = "";
        certificatesStatus.textContent = "لا توجد شهادات داخل المجلد بعد.";
        return;
    }

    certificatesStatus.textContent = `تم العثور على ${certificates.length} شهادة.`;

    certificatesGrid.innerHTML = certificates
        .map((cert) => `
            <article class="cert-card" tabindex="0" data-cert-title="${cert.title}" data-cert-file="${cert.file}">
                <img src="Certificates/${cert.file}" alt="${cert.title}">
                <div class="cert-title">${cert.title}</div>
            </article>
        `)
        .join("");

    certificatesGrid.querySelectorAll(".cert-card").forEach((card) => {
        const openCertificate = () => {
            const title = card.dataset.certTitle;
            const file = card.dataset.certFile;
            openModal(`
                <div class="modal-head">
                    <div>
                        <h3 id="modalTitle">${title}</h3>
                        <p>عرض الشهادة بالحجم الكامل</p>
                    </div>
                </div>
                <img class="modal-image" src="Certificates/${file}" alt="${title}">
            `);
        };

        card.addEventListener("click", openCertificate);
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openCertificate();
            }
        });
    });
}

async function loadCertificates() {
    try {
        const response = await fetch("Certificates/certificates.json", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to load certificates.json");
        const certificates = await response.json();
        renderCertificates(certificates);
    } catch {
        certificatesStatus.textContent = "ضع ملف Certificates/certificates.json وأضف أسماء ملفات الشهادات فيه.";
        certificatesGrid.innerHTML = "";
    }
}

document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
        document.querySelectorAll(".nav-links a").forEach((item) => item.classList.remove("active"));
        link.classList.add("active");
    });
});

document.addEventListener("click", (e) => {
    if (e.target.matches("[data-close]")) {
        closeModal();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeModal();
        closeProjects();
    }
});

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a[href^='#']");

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((link) => link.classList.remove("active"));
            const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
            if (activeLink) activeLink.classList.add("active");
        });
    },
    { threshold: 0.45 }
);

sections.forEach((section) => observer.observe(section));

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ===== قائمة المشاريع الجانبية (تنفتح من زر ProBut) ===== */

const projectsDir = "Projects";
let projectsLoaded = false;
let projectsLoading = false;

const projectsOverlay = document.createElement("div");
projectsOverlay.className = "projects-overlay";

const projectsPanel = document.createElement("aside");
projectsPanel.id = "projectsPanel";
projectsPanel.className = "projects-panel";
projectsPanel.setAttribute("aria-label", "مشاريعي");
projectsPanel.innerHTML = `
    <div class="projects-head">
        <div class="projects-title" role="heading" aria-level="2">
            <span>مشاريعي</span>
            <span class="projects-count"></span>
        </div>
        <button type="button" class="projects-close" aria-label="إغلاق القائمة">&times;</button>
    </div>
    <p class="projects-status" role="status"></p>
    <ul class="projects-list"></ul>
`;

document.body.append(projectsOverlay, projectsPanel);

const projectsClose = projectsPanel.querySelector(".projects-close");
const projectsCount = projectsPanel.querySelector(".projects-count");
const projectsStatus = projectsPanel.querySelector(".projects-status");
const projectsList = projectsPanel.querySelector(".projects-list");

function normalizeProject(item) {
    const data = typeof item === "string" ? { folder: item } : item;
    if (!data || !data.folder) return null;

    const folder = String(data.folder).trim().replace(/^\/+|\/+$/g, "");
    if (!folder) return null;

    return {
        title: String(data.title || "").trim() || folder,
        description: data.description ? String(data.description) : "",
        url: `${projectsDir}/${folder.split("/").map(encodeURIComponent).join("/")}/index.html`
    };
}

function renderProjects(projects) {
    projectsList.innerHTML = "";
    projectsCount.textContent = projects.length || "";

    if (!projects.length) {
        projectsStatus.textContent = "لا توجد مشاريع داخل المجلد بعد.";
        return;
    }

    projectsStatus.textContent = "";

    projects.forEach((project) => {
        const item = document.createElement("li");

        const link = document.createElement("a");
        link.className = "project-item";
        link.href = project.url;
        link.target = "_blank";
        link.rel = "noopener";

        const icon = document.createElement("span");
        icon.className = "project-icon";
        icon.textContent = [...project.title][0].toUpperCase();


        const text = document.createElement("span");
        text.className = "project-text";

        const name = document.createElement("span");
        name.className = "project-name";
        name.textContent = project.title;
        text.append(name);

        if (project.description) {
            const desc = document.createElement("span");
            desc.className = "project-desc";
            desc.textContent = project.description;
            text.append(desc);
        }

        link.append(icon, text);
        item.append(link);
        projectsList.append(item);
    });
}

async function loadProjects() {
    if (projectsLoading) return;
    projectsLoading = true;

    projectsList.innerHTML = "";
    projectsCount.textContent = "";
    projectsStatus.textContent = "جاري تحميل المشاريع...";

    try {
        const response = await fetch(`${projectsDir}/projects.json`, { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to load projects.json");
        const data = await response.json();
        renderProjects(Array.isArray(data) ? data.map(normalizeProject).filter(Boolean) : []);
        projectsLoaded = true;
    } catch (error) {
        projectsStatus.textContent = error instanceof SyntaxError
            ? "ملف projects.json فيه خطأ في الصيغة، راجع الفواصل والأقواس."
            : "ضع ملف Projects/projects.json وأضف أسماء مجلدات المشاريع فيه.";
    } finally {
        projectsLoading = false;
    }
}

function openProjects() {
    projectsPanel.classList.add("open");
    projectsOverlay.classList.add("open");
    ProBut?.setAttribute("aria-expanded", "true");
    if (!projectsLoaded) loadProjects();
    projectsClose.focus();
}

function closeProjects() {
    if (!projectsPanel.classList.contains("open")) return;
    projectsPanel.classList.remove("open");
    projectsOverlay.classList.remove("open");
    ProBut?.setAttribute("aria-expanded", "false");
    ProBut?.focus();
}

if (ProBut) {
    ProBut.setAttribute("aria-controls", "projectsPanel");
    ProBut.setAttribute("aria-expanded", "false");

    // لو الزر مو <button> ولا رابط، نخليه يشتغل بالكيبورد برضو
    if (!ProBut.matches("button, a[href], input")) {
        ProBut.setAttribute("role", "button");
        ProBut.tabIndex = 0;
        ProBut.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                ProBut.click();
            }
        });
    }

    ProBut.addEventListener("click", (e) => {
        e.preventDefault();
        if (projectsPanel.classList.contains("open")) closeProjects();
        else openProjects();
    });
}

projectsOverlay.addEventListener("click", closeProjects);
projectsClose.addEventListener("click", closeProjects);

renderLanguages();
loadCertificates();
