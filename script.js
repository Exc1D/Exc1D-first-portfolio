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
  const categories = ["personal", "odin", "scrimba", "frontend-mentor"];

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
            <div class="card-tech" style="margin-top: auto;">
              ${project.tech
                .map(
                  (tech) =>
                    `<span class="tech-tag" style="font-size: 0.75rem; padding: 4px 8px;">${tech}</span>`
                )
                .join("")}
            </div>
            <div class="card-actions">
              <button class="primary-card-btn">DEMO</button>
              <button class="card-btn">CODE</button>
            </div>
          </div>
        </div>`
        )
        .join();

      const trackSection = `
      <section class="track-section">
        <h3>${category.toUpperCase()}</h3>
        <div class="track">
          ${cardsHTML}
        </div>
      </section>
      `;

      app.innerHTML += trackSection;
    }
  });
}
document.addEventListener("DOMContentLoaded", loadProjects);
