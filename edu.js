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
      "Core OOP mindset and Java fundamentals using BlueJ: modelling problems as classes/objects; encapsulation, inheritance and polymorphism; interfaces and composition; test-driven habits and debugging. Emphasis on readable, version-controlled code and small refactorings.",
    skills: ["Java", "OOP", "Encapsulation", "Inheritance", "Polymorphism", "Interfaces", "BlueJ"],
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
    highlights: ["Reasoned about program behaviour and growth of simple algorithms.",
      "Explored the core mathemmatics required for core coding concepts."
    ],
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
      "Produced low-fidelity wireframes and interaction flows.",
      "Understanding the user's needs, their way with interacting with UI and designing interfaces accordingly."
    ],
  },
  cloud: {
    title: "Computers and the Cloud",
    cat: "Technology",
    year: 1,
    img: "images/modules/cloud.png",
    desc:
      "From hardware/OS and virtualisation to distributed systems and cloud service models (IaaS/PaaS/SaaS). Covered scalability, reliability, basic networking and containerised deployment concepts.",
    skills: ["Cloud Fundamentals", "Virtualisation", "Networking Basics", "Linux CLI", "Containers", "Encapsulation"],
    highlights: ["Documented a minimal service deployment on a free tier.",
      "Explored core cloud types with their strengths and weaknesses as well as security regulations.",
      "internet protocols and services (DNS, HTTP, FTP, email)."
    ],
  },
  "db-web": {
    title: "Databases and the Web",
    cat: "Technology",
    year: 1,
    img: "images/modules/database2.png",
    desc:
      "Relational modelling and SQL alongside web data flows. Topics: ER modelling, normalisation, transactions, and building data-driven pages/APIs over HTTP.",
    skills: ["SQL", "PHP","ER Modelling", "Normalisation", "Transactions", "HTTP/REST", "CRUD"],
    highlights: ["Designed a schema and built a basic CRUD web interface.",
      "Explored ways in which databases and the web interact with each other."
    ],
  },
  algos: {
    title: "Problem Solving with Algorithms",
    cat: "Technology",
    year: 1,
    img: "images/modules/algo.jpg",
    desc:
      "Turning problems into precise procedures and analysing performance. Patterns included divide-and-conquer, greedy and dynamic programming; used Big-O to compare approaches.",
    skills: ["Algorithms", "Data Structures", "Recursion", "Big-O Analysis", "Sorting", "Searching", "loops"],
    highlights: ["Compared list/stack/queue/tree trade-offs on targeted tasks.",
      "Implemented a variety of sorting/ searching algorithms and analysed their efficiency. such as the binary search tree and merge sort."
    ],
  },
  webdev: {
    title: "Web Development",
    cat: "Technology",
    year: 2,
    img: "images/modules/web dev.png",
    desc:
      "Modern, accessible web foundations: semantic HTML, responsive CSS (Flex/Grid), vanilla JS for interactivity, and performance/accessibility baselines. Client–server thinking and simple RESTful patterns.",
    skills: ["HTML5", "CSS3 (Flex/Grid)", "JavaScript (DOM/Fetch)", "Accessibility", "Performance"],
    highlights: ["Built responsive components and small pages with different purposes.",
      "Explored accessibility and performance best practices for web development."
    ],
  },
  "se-process": {
    title: "Software Engineering Process",
    cat: "Technology",
    year: 2,
    img: "images/modules/SEP.jpg",
    desc:
      "How teams deliver software: requirements/user stories, estimation and planning, Scrum/Kanban, version-control workflows, code reviews, CI and quality/risk management. Focus on producing professional artefacts.",
    skills: ["Agile (Scrum/Kanban)", "User Stories", "Git/GitHub Flow", "Code Review", "CI"],
    highlights: ["Ran short sprints with tickets, PRs and retrospectives.",
      "Focused on the planning and the stages of software development that happen before coding."
    ],
  },
  cs: {
    title: "Computer Systems",
    cat: "Technology",
    year: 2,
    img: "images/modules/nand2.jpg",
    desc:
      "How computers run programs: CPU, memory hierarchy, processes/threads, file systems and interrupts; OS responsibilities and network layering; reasoning about performance and concurrency.",
    skills: ["HDL", "Nand2tetris", "Operating Systems", "Processes/Threads", "Memory/Storage", "Networking", "CLI"],
    highlights: ["Instrumented simple programs to observe CPU/memory effects.",
      "Built basic digital circuits and explored how computers execute code at a low level.",
      "Created my own simplistic CPU using a hardware description language (HDL)."
    ],
  },
  "db-systems": {
    title: "Database Systems",
    cat: "Technology",
    year: 2,
    img: "images/modules/database.png",
    desc:
      "Advanced data management: relational algebra, indexing, query optimisation, ACID transactions, isolation levels, concurrency control and security; compared relational with alternative models where apt.",
    skills: ["SQL", "Indexing", "Query Optimisation", "ACID", "Concurrency", "Security"],
    highlights: ["Benchmarked queries with/without appropriate indexes.",
      "Explored advanced database concepts such as indexing and query optimization."
    ],
  },
  "soft-dev": {
    title: "Software Development",
    cat: "Technology",
    year: 2,
    img: "images/modules/software dev.png",
    desc:
      "Clean code, testing pyramid, refactoring and modular design; robust error handling, logging and simple automation. Emphasis on reliability and maintainability.",
    skills: ["Clean Code", "Unit Testing", "Refactoring", "Modularity", "Error Handling"],
    highlights: ["Raised unit-test coverage and improved cohesion/coupling.",
      "Implemented logging and error handling best practices.",
      "Implemented database skills with postgreSQL as well as interaction with applications"
    ],
  },
  games: {
    title: "Video Games Development",
    cat: "Technology",
    year: 2,
    img: "images/modules/game.png",
    desc:
      "Unity fundamentals (2D/3D): game loops, physics, input, scene management and UI. Incorporated play-testing and iteration towards a stable prototype. Built a variety of games from procedural generating infinite runner, fruit ninja and my own custom 3D game based on a round based zombie shooter",
    skills: ["Unity", "C#", "Physics", "Input/Scenes", "Game UI"],
    highlights: ["Built a playable prototype with menus and save states.",
      "Implemented enemy AI and wave spawning system.",
      "Implemented a health and damage system for the player and enemies.",
      "Implemented a scoring system and UI to display the points and perks."
    ],
  },
  cibef: {
    title: "Computational Intelligence in Business Economics & Finance",
    cat: "Technology",
    year: 3,
    img: "images/modules/comp bus.png",
    desc:
      "Nature-inspired/data-driven techniques for real decisions: simple neural nets, evolutionary optimisation, fuzzy systems and data mining; evaluation/ethics in business/finance settings.",
    skills: ["ML Basics", "Data Preparation", "Model Evaluation", "Heuristics"],
    highlights: ["Compared baseline models and discussed bias/variance trade-offs.",
      "Explored machine learning algorithms and their applications in business, economics and finance.",
      "Implemented more complex sorting and searching algorithms such as genetic algorithms and neural networks."
    ],
  },
  "comp-creativity": {
    title: "Computational Creativity",
    cat: "Technology",
    year: 3,
    img: "images/cc demo.png",
    desc:
      "Algorithms that generate/support creative artefacts (images/music/text) and how to evaluate creativity computationally. Hands-on experiments with generative methods. Discussed philosophical theories of creativity and wether or not machines can be truly creative.",
    skills: ["Generative Algorithms", "Evaluation", "Creative Coding (p5.js)"],
    highlights: ["Prototyped a  generative tool and articulated evaluation criteria.",
      "Understood the complexities of creativity and how it can be simulated using algorithms. However, true creativity is still a human trait that machines can only mimic to a certain extent."
    ],
  },
  "group-project": {
    title: "Dissertation App Development - Group Project",
    cat: "Technology",
    year: 3,
    img: "images/clubtime.png",
    desc:
      "Multi-month team build: scoping and requirements, UX prototypes, implementation, test strategy, documentation and final demo. Strong focus on teamwork and engineering discipline.",
    skills: ["Full-stack Delivery", "Teamwork", "Documentation", "Presentations", "Roadmapping", "git", "React", "Node.js", "Firebase"],
    highlights: ["Full freedom to explore and implement ideas. With original mobile sports app",
       "Shipped a working app with README, roadmap and demo video.",
      "including a wide range of features such as user authentication, event creation and management, real-time chat, notifications, and user profiles."],
  },

  // --- Business ---
  "intro-mgmt": {
    title: "Introduction to Management",
    cat: "Business",
    year: 1,
    img: "images/modules/manage.jpg",
    desc:
      "Management fundamentals: planning, organising, leading and controlling; organisational behaviour, motivation and ethics. Case-based work linked theory to real managerial choices. Looked out management styles over history and how they have evolved.",
    skills: ["Management", "Organisational Behaviour", "Communication", "Bureaucracy", "Ethics", "Motivation"],
    highlights: ["Analysed case organisations and presented recommendations.",
      "Types of management styles and their impact on employee performance and satisfaction."
    ],
  },
  "fin-acc": {
    title: "Financial Accounting: Reporting & Analysis",
    cat: "Business",
    year: 1,
    img: "images/modules/finance.png",
    desc:
      "How financial statements are prepared and interpreted (income, balance sheet, cash flows) and how to analyse profitability, liquidity and efficiency using ratios. Practiced advising a sole-proprietor on basic financial decisions.",
    skills: ["Accounting", "Financial Statements", "Ratio Analysis", "Excel", "Creative Accounting"],
    highlights: ["Built a simple model and computed core financial ratios.",
      "Explored the fundamentals of financial accounting and how to interpret financial statements."
    ],
  },
  "new-enterprise": {
    title: "New Enterprise Development",
    cat: "Business",
    year: 2,
    img: "images/modules/new bus.jpg",
    desc:
      "From idea to venture: opportunity recognition, customer discovery, lean validation, MVPs and go-to-market strategy. Developed and critiqued a credible business plan.",
    skills: ["Entrepreneurship", "Customer Discovery", "Lean Canvas", "Pitching", "Business Models"],
    highlights: ["Produced a lean canvas and a short pitch deck.",
      "Analysed business models and go-to-market strategies for startups."
    ],
  },
  "fin-mgmt": {
    title: "Financial Management for Decision Making",
    cat: "Business",
    year: 2,
    img: "images/modules/fin man.png",
    desc:
      "Managerial accounting and finance for internal decisions: costing, budgeting, variance analysis, performance measures and investment appraisal (NPV/IRR) with sensitivity to risk.",
    skills: ["Budgeting", "NPV/IRR", "Variance Analysis", "Decision Support", "Balance sheets"],
    highlights: ["Compared project options using discounted cash flows.",
       "Interpreting data from balance sheets and income statements to make informed business decisions."
    ],
  },
  "proj-mgmt": {
    title: "Project Management",
    cat: "Business",
    year: 2,
    img: "images/modules/project management.png",
    desc:
      "Planning and delivery: scope/WBS, scheduling (Gantt, critical path), risk and stakeholder management, governance and reporting for predictable outcomes.",
    skills: ["WBS", "Critical Path", "Risk Management", "Stakeholders", "Reporting", "Gantt Charts", "Planning"],
    highlights: ["Planned a project with milestones, dependencies and risks.",
      "Calculated the best case scenario, worst case scenario as well as the most likely scenario as well as measures to mitigate risks."
    ],
  },
  "tech-innovation": {
    title: "Technology-Driven Business Innovation",
    cat: "Business",
    year: 3,
    img: "images/modules/tech drive.png",
    desc:
      "How IT enables new products, services and business models. Evaluated technologies, mapped value creation and aligned innovation strategy with market/organisational needs.",
    skills: ["Innovation", "Digital Strategy", "Business Models", "Value Mapping", "Innovation Frameworks"],
    highlights: ["Mapped value chains and potential platform plays.",
      "Evaluated the impact of emerging technologies on business models.",
      "The affect of different types of innovation on businesses and how they can adapt to stay competitive."
    ],
  },
  entre: {
    title: "Entrepreneurship",
    cat: "Business",
    year: 3,
    img: "images/modules/entre.png",
    desc:
      "Entrepreneurial mindset, opportunity assessment, resource acquisition and early growth strategies. Assessment often includes a defendable venture concept.",
    skills: ["Opportunity Sizing", "MVPs", "Traction Metrics", "Funding Paths", "Planning"],
    highlights: ["Outlined acquisition channels and KPIs for a concept.",
      "Played the role of an entrepreneur in a competitive simulation, making strategic decisions to grow the business and respond to market changes.",
      "Used unique strategies to outperform competitors and achieve business goals."
    ],
  },
  "cont-mgmt": {
    title: "Contemporary Management Challenges",
    cat: "Business",
    year: 3,
    img: "images/modules/challenges.png",
    desc:
      "Leading amid disruption: digital change, sustainability, diversity & inclusion, ethics and evolving workforce expectations. Encourages critical reflection and practical responses.",
    skills: ["Change Management", "Sustainability", "Ethics", "Diversity & Inclusion"],
    highlights: ["Wrote a recommendation memo for a case organisation.",
      "Explored contemporary challenges in management and strategies to address them."
    ],
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
