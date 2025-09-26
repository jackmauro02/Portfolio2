// ===== Navbar injection (unchanged behaviour) =====
fetch("navbar.html")
  .then((r) => r.text())
  .then((html) => {
    document.getElementById("navbar").innerHTML = html;

    const btn = document.querySelector(".nav-toggle");
    const menu = document.getElementById("mainmenu");
    btn?.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      menu.classList.toggle("open");
    });

    const path = window.location.pathname.split("/").pop();
    document.querySelectorAll(".menu a").forEach((link) => {
      if (link.getAttribute("href") === path) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  });

// ===== Expand / Collapse all details =====
const expandBtn = document.getElementById("expandAll");
const collapseBtn = document.getElementById("collapseAll");
const detailsEls = () => Array.from(document.querySelectorAll(".edu-details"));

expandBtn?.addEventListener("click", () =>
  detailsEls().forEach((d) => (d.open = true))
);
collapseBtn?.addEventListener("click", () =>
  detailsEls().forEach((d) => (d.open = false))
);

// ===== Module info data =====
const MODULE_INFO = {
  // --- Technology (Year numbers are indicative – adjust if needed) ---
  oop: {
    title: "Introduction to Object-Oriented Programming (OOP)",
    cat: "Technology",
    year: 1,
    img: "images/modules/oop.jpg",
    desc: "Core OOP principles using Java: classes, objects, inheritance, polymorphism, interfaces, composition.",
    skills: ["Java", "OOP", "Interfaces", "Unit Testing", "Git"],
    highlights: [
      "Refactored console apps using Strategy/Factory patterns.",
      "Applied SOLID basics to small projects.",
    ],
  },
  "found-comp": {
    title: "Foundations of Computing I",
    cat: "Technology",
    year: 1,
    img: "images/modules/foundations.jpg",
    desc: "Logic, sets, functions, relations, proofs and computational thinking underpinning CS.",
    skills: ["Logic", "Proofs", "Complexity intuition"],
    highlights: ["Estimated algorithmic growth and proved small properties."],
  },
  hci: {
    title: "Human-Computer Interaction",
    cat: "Technology",
    year: 1,
    img: "images/modules/hci.jpg",
    desc: "I explored how physical, digital, and virtual interfaces impact user experience, learning to distinguish between intuitive and frustrating designs. The module focused on user-centred design, analysis methods, and interaction principles, giving me practical skills in creating efficient, accessible interfaces. I built a foundation in UX design, usability testing, and wireframing, and developed the ability to spot and improve usability issues.",
    skills: ["UX", "Wireframing", "Accessibility", "Usability testing"],
    highlights: [
      "UX design and wireframing",
      "User-centred design principles",
      "Usability testing & evaluation",
      "Accessibility considerations",
      "Identifying and resolving usability issues",
    ],
  },
  cloud: {
    title: "Computers and the Cloud",
    cat: "Technology",
    year: 1,
    img: "images/modules/cloud.jpg",
    desc: "Virtualisation, networking basics, IaaS/PaaS/SaaS models, containers and deployment basics.",
    skills: ["Cloud", "Networking", "VMs", "Containers"],
    highlights: [
      "Deployed a tiny service to a free tier and documented steps.",
    ],
  },
  "db-web": {
    title: "Databases and the Web",
    cat: "Technology",
    year: 1,
    img: "images/modules/db-web.jpg",
    desc: "Relational modelling, SQL CRUD/joins, HTTP basics, server vs client rendering patterns.",
    skills: ["SQL", "ERD", "HTTP", "Web"],
    highlights: ["Designed a schema and built a basic CRUD interface."],
  },
  algos: {
    title: "Problem Solving with Algorithms",
    cat: "Technology",
    year: 1,
    img: "images/modules/algorithms.jpg",
    desc: "Classic data structures and algorithms and their complexity trade-offs.",
    skills: ["Algorithms", "Data Structures", "Big-O"],
    highlights: ["Compared list/stack/queue/tree trade-offs on tasks."],
  },
  webdev: {
    title: "Web Development",
    cat: "Technology",
    year: 2,
    img: "images/modules/webdev.jpg",
    desc: "Accessible, responsive web with semantic HTML, modern CSS, vanilla JS, and performance.",
    skills: ["HTML/CSS", "JavaScript", "Accessibility", "Performance"],
    highlights: ["Built responsive components and a mini single-page tool."],
  },
  "se-process": {
    title: "Software Engineering Process",
    cat: "Technology",
    year: 2,
    img: "images/modules/se-process.jpg",
    desc: "Agile, Scrum/Kanban, requirements, version control workflows, code reviews and CI basics.",
    skills: ["Agile", "Git", "Requirements", "CI/CD"],
    highlights: ["Ran sprints with tickets, pull requests and retrospectives."],
  },
  cs: {
    title: "Computer Systems",
    cat: "Technology",
    year: 2,
    img: "images/modules/computer-systems.jpg",
    desc: "How computers run code: CPU, memory, OS, processes/threads, file systems and interrupts.",
    skills: ["OS", "Processes", "CLI"],
    highlights: ["Instrumented simple programs to observe memory/CPU effects."],
  },
  "db-systems": {
    title: "Database Systems",
    cat: "Technology",
    year: 2,
    img: "images/modules/database-systems.jpg",
    desc: "Indexes, transactions, normalisation, query planning and an intro to NoSQL options.",
    skills: ["SQL", "Indexing", "Transactions", "Normalisation"],
    highlights: ["Measured query performance with/without proper indexes."],
  },
  "soft-dev": {
    title: "Software Development",
    cat: "Technology",
    year: 2,
    img: "images/modules/software-dev.jpg",
    desc: "Clean code, testing pyramid, refactoring, modularity and robust error handling.",
    skills: ["Testing", "Refactoring", "Design"],
    highlights: ["Raised unit test coverage and improved cohesion."],
  },
  games: {
    title: "Video Games Development",
    cat: "Technology",
    year: 2,
    img: "images/modules/games.jpg",
    desc: "Unity fundamentals (2D/3D), game loops, physics, input, scene management and UI.",
    skills: ["Unity", "C#", "Physics", "UI"],
    highlights: ["Built a Flappy-like and a menu with save states."],
  },
  cibef: {
    title: "Computational Intelligence in Business Economics & Finance",
    cat: "Technology",
    year: 3,
    img: "images/modules/cibef.jpg",
    desc: "Intro to ML/optimisation for business/finance contexts; evaluation and ethics.",
    skills: ["ML", "Data Prep", "Model Evaluation"],
    highlights: [
      "Compared simple models and discussed bias/variance trade-offs.",
    ],
  },
  "comp-creativity": {
    title: "Computational Creativity",
    cat: "Technology",
    year: 3,
    img: "images/modules/comp-creativity.jpg",
    desc: "Algorithms for generative art/music/text; frameworks for evaluating creative systems.",
    skills: ["Generative Methods", "Evaluation"],
    highlights: [
      "Prototyped a small generative text/image tool and wrote criteria.",
    ],
  },
  "group-project": {
    title: "Group Project — App Development Dissertation",
    cat: "Technology",
    year: 3,
    img: "images/modules/group-project.jpg",
    desc: "End-to-end team project: scoping, delivery, documentation, demo and presentation.",
    skills: ["Full-stack", "Teamwork", "Docs", "Demo"],
    highlights: ["Shipped a working app with README, roadmap and demo video."],
  },

  // --- Business ---
  "intro-mgmt": {
    title: "Introduction to Management",
    cat: "Business",
    year: 1,
    img: "images/modules/management.jpg",
    desc: "Core management theories, org structures, motivation and leadership styles.",
    skills: ["Management", "Communication"],
    highlights: ["Analysed organisation case studies and presented findings."],
  },
  "fin-acc": {
    title: "Financial Accounting: Reporting & Analysis",
    cat: "Business",
    year: 1,
    img: "images/modules/finance.jpg",
    desc: "Financial statements, ratios, accruals and cash flow interpretation.",
    skills: ["Accounting", "Excel", "Analysis"],
    highlights: ["Built a small model and computed core ratios."],
  },
  "new-enterprise": {
    title: "New Enterprise Development",
    cat: "Business",
    year: 2,
    img: "images/modules/enterprise.jpg",
    desc: "Lean validation, MVPs, customer discovery and go-to-market strategy.",
    skills: ["Entrepreneurship", "Research", "Pitching"],
    highlights: ["Produced a lean canvas and a short pitch deck."],
  },
  "fin-mgmt": {
    title: "Financial Management for Decision Making",
    cat: "Business",
    year: 2,
    img: "images/modules/fin-mgmt.jpg",
    desc: "Budgeting, NPV/IRR, pricing basics, risk and sensitivity analysis.",
    skills: ["Finance", "NPV/IRR", "Risk"],
    highlights: ["Compared project options using discounted cash flows."],
  },
  "proj-mgmt": {
    title: "Project Management",
    cat: "Business",
    year: 2,
    img: "images/modules/project-mgmt.jpg",
    desc: "Scope, WBS, critical path, risk, stakeholders and reporting.",
    skills: ["PM", "Gantt/CPM", "Risk"],
    highlights: ["Planned a project with milestones and risks."],
  },
  "tech-innovation": {
    title: "Technology-Driven Business Innovation",
    cat: "Business",
    year: 3,
    img: "images/modules/innovation.jpg",
    desc: "Business models, platform thinking, data as advantage and ethics.",
    skills: ["Innovation", "Strategy"],
    highlights: ["Mapped value chains and platform opportunities."],
  },
  entre: {
    title: "Entrepreneurship",
    cat: "Business",
    year: 3,
    img: "images/modules/entrepreneurship.jpg",
    desc: "Opportunity spotting, traction metrics and funding paths.",
    skills: ["Founders", "MVP", "Metrics"],
    highlights: ["Outlined acquisition channels and KPIs."],
  },
  "cont-mgmt": {
    title: "Contemporary Management Challenges",
    cat: "Business",
    year: 3,
    img: "images/modules/contemporary-mgmt.jpg",
    desc: "Change, sustainability, DEI, global contexts and remote work.",
    skills: ["Change Mgmt", "Sustainability"],
    highlights: ["Wrote a short recommendation report for a case org."],
  },
};

// ===== Modal behaviour =====
const modal = document.getElementById("moduleModal");
const modalBackdrop = modal.querySelector(".modal__backdrop");
const modalCloseButtons = modal.querySelectorAll("[data-close-modal]");
let lastFocus = null;

function fillModal(m) {
  document.getElementById("modalTitle").textContent = m.title || "";
  document.getElementById("modalDesc").textContent = m.desc || "";
  const imgEl = document.getElementById("modalImg");
  imgEl.src = m.img || "";
  imgEl.alt = m.title || "";
  const meta = document.getElementById("modalMeta");
  meta.innerHTML = `
    <span class="pill">${m.cat || ""}</span>
    <span class="pill">Year ${m.year ?? "-"}</span>
  `;
  const skills = document.getElementById("modalSkills");
  skills.innerHTML = "";
  (m.skills || []).forEach((s) => {
    const span = document.createElement("span");
    span.className = "pill";
    span.textContent = s;
    skills.appendChild(span);
  });
  const hl = document.getElementById("modalHighlights");
  hl.innerHTML = "";
  (m.highlights || []).forEach((h) => {
    const li = document.createElement("li");
    li.textContent = h;
    hl.appendChild(li);
  });
}

function openModalById(id, triggerEl) {
  const m = MODULE_INFO[id];
  if (!m) return;
  lastFocus = triggerEl || document.activeElement;
  fillModal(m);
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modal.querySelector(".modal__close").focus();
  document.addEventListener("keydown", escClose);
}

function closeModal() {
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  document.removeEventListener("keydown", escClose);
  if (lastFocus) lastFocus.focus();
}

function escClose(e) {
  if (e.key === "Escape") closeModal();
}

modalBackdrop.addEventListener("click", closeModal);
modalCloseButtons.forEach((b) => b.addEventListener("click", closeModal));

// Delegate clicks from any <li data-module>
document.addEventListener("click", (e) => {
  const li = e.target.closest("li[data-module]");
  if (!li) return;
  const id = li.getAttribute("data-module");
  openModalById(id, li);
});
