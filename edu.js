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

    const path = (window.location.pathname.split("/").pop() || "").toLowerCase();
    document.querySelectorAll(".menu a").forEach((link) => {
      const href = (link.getAttribute("href") || "").toLowerCase();
      if (href === path) {
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

// ===== Module info data (updated descriptions + skills) =====
const MODULE_INFO = {
  // --- Technology ---
  oop: {
    title: "Introduction to Object-Oriented Programming (OOP)",
    cat: "Technology",
    year: 1,
    img: "images/modules/shape.jpg",
    desc:
      "Core OOP mindset and Java fundamentals: modelling problems as classes/objects; encapsulation, inheritance and polymorphism; interfaces and composition; test-driven habits and debugging. Emphasis on readable, version-controlled code and small refactorings.",
    skills: ["Java", "OOP", "Encapsulation", "Inheritance", "Polymorphism", "Interfaces", "JUnit", "Git"],
    highlights: [
      "Refactored console apps using Strategy/Factory patterns.",
      "Applied SOLID basics and wrote unit tests for core logic."
    ],
  },
  "found-comp": {
    title: "Foundations of Computing I",
    cat: "Technology",
    year: 1,
    img: "images/modules/foundations.jpg",
    desc:
      "Mathematical and theoretical tools for CS: sets, logic, proofs, functions and relations; number systems and data representation; introductory automata and computation ideas to support later algorithmic thinking.",
    skills: ["Discrete Maths", "Logic", "Proof Techniques", "Set Theory", "Boolean Algebra", "Complexity intuition"],
    highlights: ["Reasoned about program behaviour and growth of simple algorithms."],
  },
  hci: {
    title: "Human-Computer Interaction",
    cat: "Technology",
    year: 1,
    img: "images/modules/hci.jpg",
    desc:
      "Designing for people: usability principles, accessibility, interaction styles and prototyping. Practised user-centred methods (heuristics, think-aloud, surveys) and turned findings into wireframes and UI improvements.",
    skills: ["UX Research", "Wireframing", "Prototyping", "Accessibility", "Usability Testing", "Heuristic Evaluation"],
    highlights: [
      "Planned and ran small usability tests; translated insights into UI tweaks.",
      "Produced low-fidelity wireframes and interaction flows."
    ],
  },
  cloud: {
    title: "Computers and the Cloud",
    cat: "Technology",
    year: 1,
    img: "images/modules/cloud.jpg",
    desc:
      "From hardware/OS and virtualisation to distributed systems and cloud service models (IaaS/PaaS/SaaS). Covered scalability, reliability, basic networking and containerised deployment concepts.",
    skills: ["Cloud Fundamentals", "Virtualisation", "Networking Basics", "Linux CLI", "Containers"],
    highlights: ["Documented a minimal service deployment on a free tier."],
  },
  "db-web": {
    title: "Databases and the Web",
    cat: "Technology",
    year: 1,
    img: "images/modules/db-web.jpg",
    desc:
      "Relational modelling and SQL alongside web data flows. Topics: ER modelling, normalisation, transactions, and building data-driven pages/APIs over HTTP.",
    skills: ["SQL", "ER Modelling", "Normalisation", "Transactions", "HTTP/REST", "CRUD"],
    highlights: ["Designed a schema and built a basic CRUD web interface."],
  },
  algos: {
    title: "Problem Solving with Algorithms",
    cat: "Technology",
    year: 1,
    img: "images/modules/algorithms.jpg",
    desc:
      "Turning problems into precise procedures and analysing performance. Patterns included divide-and-conquer, greedy and dynamic programming; used Big-O to compare approaches.",
    skills: ["Algorithms", "Data Structures", "Recursion", "Big-O Analysis"],
    highlights: ["Compared list/stack/queue/tree trade-offs on targeted tasks."],
  },
  webdev: {
    title: "Web Development",
    cat: "Technology",
    year: 2,
    img: "images/modules/webdev.jpg",
    desc:
      "Modern, accessible web foundations: semantic HTML, responsive CSS (Flex/Grid), vanilla JS for interactivity, and performance/accessibility baselines. Client–server thinking and simple RESTful patterns.",
    skills: ["HTML5", "CSS3 (Flex/Grid)", "JavaScript (DOM/Fetch)", "Accessibility", "Performance"],
    highlights: ["Built responsive components and a small single-page style tool."],
  },
  "se-process": {
    title: "Software Engineering Process",
    cat: "Technology",
    year: 2,
    img: "images/modules/se-process.jpg",
    desc:
      "How teams deliver software: requirements/user stories, estimation and planning, Scrum/Kanban, version-control workflows, code reviews, CI and quality/risk management. Focus on producing professional artefacts.",
    skills: ["Agile (Scrum/Kanban)", "User Stories", "Git/GitHub Flow", "Code Review", "CI"],
    highlights: ["Ran short sprints with tickets, PRs and retrospectives."],
  },
  cs: {
    title: "Computer Systems",
    cat: "Technology",
    year: 2,
    img: "images/modules/computer-systems.jpg",
    desc:
      "How computers run programs: CPU, memory hierarchy, processes/threads, file systems and interrupts; OS responsibilities and network layering; reasoning about performance and concurrency.",
    skills: ["Operating Systems", "Processes/Threads", "Memory/Storage", "Networking", "CLI"],
    highlights: ["Instrumented simple programs to observe CPU/memory effects."],
  },
  "db-systems": {
    title: "Database Systems",
    cat: "Technology",
    year: 2,
    img: "images/modules/database-systems.jpg",
    desc:
      "Advanced data management: relational algebra, indexing, query optimisation, ACID transactions, isolation levels, concurrency control and security; compared relational with alternative models where apt.",
    skills: ["SQL", "Indexing", "Query Optimisation", "ACID", "Concurrency", "Security"],
    highlights: ["Benchmarked queries with/without appropriate indexes."],
  },
  "soft-dev": {
    title: "Software Development",
    cat: "Technology",
    year: 2,
    img: "images/modules/software-dev.jpg",
    desc:
      "Clean code, testing pyramid, refactoring and modular design; robust error handling, logging and simple automation. Emphasis on reliability and maintainability.",
    skills: ["Clean Code", "Unit Testing", "Refactoring", "Modularity", "Error Handling"],
    highlights: ["Raised unit-test coverage and improved cohesion/coupling."],
  },
  games: {
    title: "Video Games Development",
    cat: "Technology",
    year: 2,
    video: "images/Trailer1.mp4",
    desc:
      "Unity fundamentals (2D/3D): game loops, physics, input, scene management and UI. Incorporated play-testing and iteration towards a stable prototype.",
    skills: ["Unity", "C#", "Physics", "Input/Scenes", "Game UI"],
    highlights: ["Built a playable prototype with menus and save states."],
  },
  cibef: {
    title: "Computational Intelligence in Business Economics & Finance",
    cat: "Technology",
    year: 3,
    img: "images/modules/cibef.jpg",
    desc:
      "Nature-inspired/data-driven techniques for real decisions: simple neural nets, evolutionary optimisation, fuzzy systems and data mining; evaluation/ethics in business/finance settings.",
    skills: ["ML Basics", "Data Preparation", "Model Evaluation", "Heuristics"],
    highlights: ["Compared baseline models and discussed bias/variance trade-offs."],
  },
  "comp-creativity": {
    title: "Computational Creativity",
    cat: "Technology",
    year: 3,
    img: "images/cc demo.png",
    desc:
      "Algorithms that generate/support creative artefacts (images/music/text) and how to evaluate creativity computationally. Hands-on experiments with generative methods.",
    skills: ["Generative Algorithms", "Evaluation", "Creative Coding (p5.js)"],
    highlights: ["Prototyped a small generative tool and articulated evaluation criteria."],
  },
  "group-project": {
    title: "Group Project — App Development Dissertation",
    cat: "Technology",
    year: 3,
    img: "images/modules/group-project.jpg",
    desc:
      "Multi-month team build: scoping and requirements, UX prototypes, implementation, test strategy, documentation and final demo. Strong focus on teamwork and engineering discipline.",
    skills: ["Full-stack Delivery", "Teamwork", "Documentation", "Presentations", "Roadmapping"],
    highlights: ["Shipped a working app with README, roadmap and demo video."],
  },

  // --- Business ---
  "intro-mgmt": {
    title: "Introduction to Management",
    cat: "Business",
    year: 1,
    img: "images/modules/management.jpg",
    desc:
      "Management fundamentals: planning, organising, leading and controlling; organisational behaviour, motivation and ethics. Case-based work linked theory to real managerial choices.",
    skills: ["Management", "Org Behaviour", "Communication"],
    highlights: ["Analysed case organisations and presented recommendations."],
  },
  "fin-acc": {
    title: "Financial Accounting: Reporting & Analysis",
    cat: "Business",
    year: 1,
    img: "images/modules/finance.jpg",
    desc:
      "How financial statements are prepared and interpreted (income, balance sheet, cash flows) and how to analyse profitability, liquidity and efficiency using ratios.",
    skills: ["Accounting", "Financial Statements", "Ratio Analysis", "Excel"],
    highlights: ["Built a simple model and computed core financial ratios."],
  },
  "new-enterprise": {
    title: "New Enterprise Development",
    cat: "Business",
    year: 2,
    img: "images/modules/enterprise.jpg",
    desc:
      "From idea to venture: opportunity recognition, customer discovery, lean validation, MVPs and go-to-market strategy. Developed and critiqued a credible business plan.",
    skills: ["Entrepreneurship", "Customer Discovery", "Lean Canvas", "Pitching"],
    highlights: ["Produced a lean canvas and a short pitch deck."],
  },
  "fin-mgmt": {
    title: "Financial Management for Decision Making",
    cat: "Business",
    year: 2,
    img: "images/modules/fin-mgmt.jpg",
    desc:
      "Managerial accounting and finance for internal decisions: costing, budgeting, variance analysis, performance measures and investment appraisal (NPV/IRR) with sensitivity to risk.",
    skills: ["Budgeting", "NPV/IRR", "Variance Analysis", "Decision Support"],
    highlights: ["Compared project options using discounted cash flows."],
  },
  "proj-mgmt": {
    title: "Project Management",
    cat: "Business",
    year: 2,
    img: "images/modules/project-mgmt.jpg",
    desc:
      "Planning and delivery: scope/WBS, scheduling (Gantt, critical path), risk and stakeholder management, governance and reporting for predictable outcomes.",
    skills: ["WBS", "Critical Path", "Risk Management", "Stakeholders", "Reporting"],
    highlights: ["Planned a project with milestones, dependencies and risks."],
  },
  "tech-innovation": {
    title: "Technology-Driven Business Innovation",
    cat: "Business",
    year: 3,
    img: "images/modules/innovation.jpg",
    desc:
      "How IT enables new products, services and business models. Evaluated technologies, mapped value creation and aligned innovation strategy with market/organisational needs.",
    skills: ["Innovation", "Digital Strategy", "Business Models", "Value Mapping"],
    highlights: ["Mapped value chains and potential platform plays."],
  },
  entre: {
    title: "Entrepreneurship",
    cat: "Business",
    year: 3,
    img: "images/modules/entrepreneurship.jpg",
    desc:
      "Entrepreneurial mindset, opportunity assessment, resource acquisition and early growth strategies. Assessment often includes a defendable venture concept.",
    skills: ["Opportunity Sizing", "MVPs", "Traction Metrics", "Funding Paths"],
    highlights: ["Outlined acquisition channels and KPIs for a concept."],
  },
  "cont-mgmt": {
    title: "Contemporary Management Challenges",
    cat: "Business",
    year: 3,
    img: "images/modules/contemporary-mgmt.jpg",
    desc:
      "Leading amid disruption: digital change, sustainability, diversity & inclusion, ethics and evolving workforce expectations. Encourages critical reflection and practical responses.",
    skills: ["Change Management", "Sustainability", "Ethics", "Diversity & Inclusion"],
    highlights: ["Wrote a short recommendation memo for a case organisation."],
  },
};

// ===== Modal behaviour (unchanged) =====
const modal = document.getElementById("moduleModal");
const modalBackdrop = modal?.querySelector(".modal__backdrop");
const modalCloseButtons = modal ? modal.querySelectorAll("[data-close-modal]") : [];
let lastFocus = null;

function fillModal(m) {
  // Title + description
  document.getElementById("modalTitle").textContent = m.title || "";
  document.getElementById("modalDesc").textContent = m.desc || "";

  // Meta pills
  const meta = document.getElementById("modalMeta");
  meta.innerHTML = `
    <span class="pill">${m.cat || ""}</span>
    <span class="pill">Year ${m.year ?? "-"}</span>
  `;

  // Skill pills
  const skills = document.getElementById("modalSkills");
  skills.innerHTML = "";
  (m.skills || []).forEach((s) => {
    const span = document.createElement("span");
    span.className = "pill";
    span.textContent = s;
    skills.appendChild(span);
  });

  // --- Move and style the image as a work preview -------------------------
  const imgEl = document.getElementById("modalImg");
  if (imgEl) {
    // Set src/alt
    if (m.img) {
      imgEl.src = m.img;
      imgEl.alt = m.title || "";
      imgEl.style.display = "block";
    } else {
      imgEl.removeAttribute("src");
      imgEl.style.display = "none";
    }

    // Make it a big preview and place it *after the skills row*
    imgEl.classList.add("modal__workimg");
    // If the image is currently in the header, this physically moves the node
    (skills || document.getElementById("modalDesc"))
      ?.insertAdjacentElement("afterend", imgEl);
  }
  // ------------------------------------------------------------------------

  // Highlights (bullets)
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
  if (!m || !modal) return;
  lastFocus = triggerEl || document.activeElement;
  fillModal(m);
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modal.querySelector(".modal__close").focus();
  document.addEventListener("keydown", escClose);
}

function closeModal() {
  if (!modal) return;
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  document.removeEventListener("keydown", escClose);
  if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
}

function escClose(e) {
  if (e.key === "Escape") closeModal();
}

modalBackdrop?.addEventListener("click", closeModal);
modalCloseButtons.forEach((b) => b.addEventListener("click", closeModal));

// Delegate clicks from any clickable module item
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-module]");
  if (!el) return;
  const id = el.getAttribute("data-module");
  openModalById(id, el);
});
