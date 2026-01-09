async function loadProjects() {
  try {
    const response = await fetch("projects.json");

    if (!response.ok) {
      throw new Error(`Error fetching projects: ${response.statusText}`);
    }
    const projects = await response.json();
    console.log(projects);
    renderProjects(projects);
  } catch (error) {
    console.error("Fetch error:", error.message);
  }
}

function renderProjects(projects) {
  const app = document.getElementById("app");

  // Define categories for display and order
  const categories = [
    "the-odin-project",
    "scrimba",
    "frontend-mentor",
    "personal",
  ];

  categories.forEach((category) => {
    const filtered = projects.filter(
      (project) => project.category === category
    );
    console.log(`Found ${filtered.length} projects for ${category}`);
    if (filtered.length > 0) {
      const cardsHTML = filtered
        .map(
          (project) => `
        <div class="card">
          <img class="card-image" src="${project.image}" alt="Screenshot of ${
            project.title
          }">
          <div class="card-content">
            <p class="card-title">${project.title}</p>
            <p class="card-desc">${project.description}</p>
            <div class="card-tech">
              ${project.tech
                .map((tech) => `<span class="tech-tag">${tech}</span>`)
                .join("")}
            </div>
            <div class="card-actions">
              <a href="${
                project.demo
              }" class="primary-card-btn" target="_blank">DEMO</a>
              <a href="${
                project.github
              }" class="card-btn" target="_blank">CODE</a>
            </div>
          </div>
        </div>`
        )
        .join("");

      const trackSection = `
      <section class="track-section">
        <h3>${category.replaceAll("-", " ").toUpperCase()}</h3>
        <div class="track">
          ${cardsHTML}
        </div>
      </section>
      `;

      app.innerHTML += trackSection;
    }
  });
}

function setupNerdMode() {
  const button = document.querySelector(".nerd-btn");

  if (!button) return; // safety: button not found

  button.addEventListener("click", () => {
    console.log("Button was clicked");
    // Toggle the 'debug' class to apply visual changes
    document.body.classList.toggle("debug");

    // If debug is active, update button text accordingly
    const isDebugActive = document.body.classList.contains("debug");
    button.textContent = `NERD MODE: ${isDebugActive ? "ON" : "OFF"}`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadProjects();
  setupNerdMode();
});
