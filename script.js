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
        name: "C++",
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

renderLanguages();
loadCertificates();
